import express from "express";
import { createServer as createViteServer } from "vite";
import pg from "pg";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import nodemailer from "nodemailer";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Configuração do Nodemailer (Ethereal para testes)
let transporter: nodemailer.Transporter;
nodemailer.createTestAccount((err, account) => {
  if (err) {
    console.error('Failed to create a testing account. ' + err.message);
    return;
  }
  transporter = nodemailer.createTransport({
    host: account.smtp.host,
    port: account.smtp.port,
    secure: account.smtp.secure,
    auth: {
      user: account.user,
      pass: account.pass
    }
  });
});

async function sendWelcomeEmail(leadEmail: string, leadName: string) {
  if (!transporter) return;
  
  try {
    const info = await transporter.sendMail({
      from: '"Rabello Ads" <contato@rabelloads.com.br>',
      to: leadEmail,
      subject: "Recebemos sua solicitação de diagnóstico! 🚀",
      text: `Olá ${leadName},\n\nRecebemos suas informações e já estamos analisando o seu cenário.\n\nEm breve, entraremos em contato para agendar nossa conversa e apresentar um diagnóstico inicial.\n\nAbraços,\nEquipe Rabello Ads`,
      html: `<p>Olá <strong>${leadName}</strong>,</p><p>Recebemos suas informações e já estamos analisando o seu cenário.</p><p>Em breve, entraremos em contato para agendar nossa conversa e apresentar um diagnóstico inicial.</p><p>Abraços,<br>Equipe Rabello Ads</p>`
    });
    console.log("Email de boas-vindas enviado: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.error("Erro ao enviar email:", err);
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function calculateScore(data: any) {
  let score = 0;
  if (data.budget === "10000+") score += 30;
  if (data.traffic === "Já roda anúncios") score += 20;
  if (data.objective) score += 15;
  if (data.urgency === "Alta") score += 10;
  return score;
}

async function initializeDatabase() {
  try {
    console.log("Iniciando a verificação/criação das tabelas no banco de dados...");
    
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

async function sendFollowUpEmail(leadEmail: string, leadName: string) {
  if (!transporter) return;
  
  try {
    const info = await transporter.sendMail({
      from: '"Rabello Ads" <contato@rabelloads.com.br>',
      to: leadEmail,
      subject: "Ainda tem interesse em escalar suas vendas? 🚀",
      text: `Olá ${leadName},\n\nTudo bem?\n\nVi que você solicitou um diagnóstico recentemente, mas ainda não conseguimos conversar.\n\nGostaria de agendar um bate-papo rápido de 15 minutos para entender melhor o seu cenário e te mostrar como podemos ajudar?\n\nAbraços,\nEquipe Rabello Ads`,
      html: `<p>Olá <strong>${leadName}</strong>,</p><p>Tudo bem?</p><p>Vi que você solicitou um diagnóstico recentemente, mas ainda não conseguimos conversar.</p><p>Gostaria de agendar um bate-papo rápido de 15 minutos para entender melhor o seu cenário e te mostrar como podemos ajudar?</p><p>Abraços,<br>Equipe Rabello Ads</p>`
    });
    console.log("Email de follow-up enviado: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.error("Erro ao enviar email de follow-up:", err);
  }
}

// --- BACKGROUND TASKS ---
function startBackgroundTasks() {
  // Executa a cada 1 hora (3600000 ms)
  setInterval(async () => {
    try {
      console.log("[Background Task] Verificando leads para follow-up...");
      
      // Buscar leads com status 'new' ou 'contacted' criados há mais de 24h
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const leadsToFollowUp = await prisma.lead.findMany({
        where: {
          status: { in: ['new', 'contacted'] },
          createdAt: { lte: yesterday }
        }
      });
      
      if (leadsToFollowUp.length > 0) {
        console.log(`[Background Task] Encontrados ${leadsToFollowUp.length} leads precisando de atenção.`);
        for (const lead of leadsToFollowUp) {
          if (lead.email) {
            await sendFollowUpEmail(lead.email, lead.name);
            // Atualizar o status para evitar enviar o mesmo email várias vezes
            await prisma.lead.update({
              where: { id: lead.id },
              data: { status: 'follow_up_sent' }
            });
          }
        }
      }
    } catch (err) {
      console.error("[Background Task] Erro ao verificar leads:", err);
    }
  }, 3600000);
}

async function startServer() {
  // Inicializa o banco de dados antes de subir o servidor
  await initializeDatabase();
  
  // Inicia as tarefas em background
  startBackgroundTasks();

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

  // --- LEADS API (CRM) ---
  app.post("/api/leads", async (req, res) => {
    try {
      const body = req.body;
      
      if (!body.name) {
        return res.status(400).json({ error: "O nome é obrigatório." });
      }

      const score = calculateScore(body);

      const lead = await prisma.lead.create({
        data: {
          name: body.name,
          email: body.email || "",
          phone: body.phone || "",
          niche: body.niche,
          budget: body.budget,
          objective: body.objective,
          traffic: body.traffic,
          challenge: body.challenge,
          urgency: body.urgency,
          score,
        },
      });
      
      // Enviar notificação por email via FormSubmit (Zero Configuração)
      try {
        fetch("https://formsubmit.co/ajax/adailtonrabellogestaodetrafego@gmail.com", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            _subject: `🚀 Novo Lead Recebido: ${body.name}`,
            Nome: body.name,
            Email: body.email || 'Não informado',
            WhatsApp: body.phone || 'Não informado',
            Nicho: body.niche || 'Não informado',
            Verba_Ads: body.budget || 'Não informado',
            Score: score
          })
        }).catch(err => {
          console.error("Erro silencioso ao enviar notificação via FormSubmit:", err);
        });
      } catch (fetchErr) {
        console.error("Erro ao tentar usar fetch:", fetchErr);
      }
      
      // Enviar email de boas-vindas automatizado para o lead
      if (body.email) {
        sendWelcomeEmail(body.email, body.name);
      }
      
      res.status(201).json({ success: true, lead });
    } catch (err: any) {
      console.error("Erro ao salvar lead:", err);
      res.status(500).json({ error: "Erro interno ao salvar o lead: " + (err.message || String(err)) });
    }
  });

  app.get("/api/leads", async (req, res) => {
    try {
      const leads = await prisma.lead.findMany({
        orderBy: { createdAt: "desc" },
      });
      res.json(leads);
    } catch (err) {
      console.error("Erro ao buscar leads:", err);
      res.status(500).json({ error: "Erro interno ao buscar leads." });
    }
  });

  app.put("/api/leads/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const lead = await prisma.lead.update({
        where: { id },
        data,
      });
      res.json({ success: true, lead });
    } catch (err) {
      console.error("Erro ao atualizar lead:", err);
      res.status(500).json({ error: "Erro interno ao atualizar o lead." });
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
      configFile: path.resolve(__dirname, "vite.config.ts"),
      server: {
        middlewareMode: true,
        hmr: false,
        ws: false,
        port: 3000,
        watch: {
          usePolling: true,
          interval: 1000
        }
      },
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
