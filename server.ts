import express from "express";
import { createServer as createViteServer } from "vite";
import pg from "pg";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function initializeDatabase() {
  try {
    console.log("Iniciando a verificação/criação das tabelas no banco de dados...");
    
    // Tabela de Leads
    await pool.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(50),
        message TEXT,
        source VARCHAR(100),
        status VARCHAR(50) DEFAULT 'novo',
        created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo')
      );
    `);
    
    // Ajustar fuso horário de tabelas existentes
    await pool.query(`
      ALTER TABLE leads 
      ALTER COLUMN created_at TYPE TIMESTAMP WITHOUT TIME ZONE USING created_at AT TIME ZONE 'America/Sao_Paulo',
      ALTER COLUMN created_at SET DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo');
    `);

    // Tabela de Autores do Blog
    await pool.query(`
      CREATE TABLE IF NOT EXISTS blog_authors (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        bio TEXT,
        avatar_url VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Tabela de Categorias do Blog
    await pool.query(`
      CREATE TABLE IF NOT EXISTS blog_categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Tabela de Posts do Blog
    await pool.query(`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT,
        cover_image VARCHAR(255),
        author_id INTEGER REFERENCES blog_authors(id) ON DELETE SET NULL,
        category_id INTEGER REFERENCES blog_categories(id) ON DELETE SET NULL,
        published BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("✅ Todas as tabelas foram verificadas/criadas com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao criar as tabelas:", error);
  }
}

async function startServer() {
  // Inicializa o banco de dados antes de subir o servidor
  await initializeDatabase();

  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT NOW()');
      client.release();
      res.json({ status: "ok", db_time: result.rows[0].now });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Database connection failed" });
    }
  });

  // --- LEADS API ---
  app.post("/api/leads", async (req, res) => {
    try {
      const { name, email, phone, message, source } = req.body;
      
      if (!name) {
        return res.status(400).json({ error: "O nome é obrigatório." });
      }

      const result = await pool.query(
        `INSERT INTO leads (name, email, phone, message, source) 
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [name, email, phone, message, source || 'website']
      );
      
      const newLead = result.rows[0];

      // Enviar notificação por email via FormSubmit (Zero Configuração)
      // Isso elimina qualquer problema de SMTP, Senha de App, ou bloqueios do Gmail.
      fetch("https://formsubmit.co/ajax/adailtonrabellogestaodetrafego@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          _subject: `🚀 Novo Lead Recebido: ${name}`,
          Nome: name,
          Email: email || 'Não informado',
          WhatsApp: phone || 'Não informado',
          Origem: source || 'Website',
          Mensagem: message || 'Sem mensagem'
        })
      }).catch(err => {
        console.error("Erro silencioso ao enviar notificação via FormSubmit:", err);
      });
      
      res.status(201).json({ success: true, lead: newLead });
    } catch (err) {
      console.error("Erro ao salvar lead:", err);
      res.status(500).json({ error: "Erro interno ao salvar o lead." });
    }
  });

  app.get("/api/leads", async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT * FROM leads ORDER BY created_at DESC
      `);
      res.json(result.rows);
    } catch (err) {
      console.error("Erro ao buscar leads:", err);
      res.status(500).json({ error: "Erro interno ao buscar leads." });
    }
  });

  // --- BLOG API ---
  app.get("/api/posts", async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT p.*, a.name as author_name, a.avatar_url as author_avatar, c.name as category_name 
        FROM blog_posts p
        LEFT JOIN blog_authors a ON p.author_id = a.id
        LEFT JOIN blog_categories c ON p.category_id = c.id
        WHERE p.published = true
        ORDER BY p.created_at DESC
      `);
      res.json(result.rows);
    } catch (err) {
      console.error("Erro ao buscar posts:", err);
      res.status(500).json({ error: "Erro interno ao buscar posts." });
    }
  });

  app.get("/api/posts/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const result = await pool.query(`
        SELECT p.*, a.name as author_name, a.avatar_url as author_avatar, c.name as category_name 
        FROM blog_posts p
        LEFT JOIN blog_authors a ON p.author_id = a.id
        LEFT JOIN blog_categories c ON p.category_id = c.id
        WHERE p.slug = $1 AND p.published = true
      `, [slug]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Post não encontrado." });
      }
      
      res.json(result.rows[0]);
    } catch (err) {
      console.error("Erro ao buscar post:", err);
      res.status(500).json({ error: "Erro interno ao buscar o post." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
