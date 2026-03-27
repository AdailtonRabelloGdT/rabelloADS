import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function initDB() {
  try {
    console.log("Iniciando a criação das tabelas no banco de dados Neon...");
    
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
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Tabela 'leads' verificada/criada.");

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
    console.log("✅ Tabela 'blog_authors' verificada/criada.");

    // Tabela de Categorias do Blog
    await pool.query(`
      CREATE TABLE IF NOT EXISTS blog_categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Tabela 'blog_categories' verificada/criada.");

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
    console.log("✅ Tabela 'blog_posts' verificada/criada.");

    console.log("🎉 Todas as tabelas foram criadas com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao criar as tabelas:", error);
  } finally {
    await pool.end();
  }
}

initDB();
