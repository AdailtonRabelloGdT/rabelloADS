import express from "express";
import { createServer as createViteServer } from "vite";
import pg from "pg";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { analyzeLeadWithAI } from "./lib/ai";

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

// Middleware de Autenticação
const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: "Acesso negado. Token não fornecido." });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret', (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Token inválido ou expirado." });
    }
    (req as any).user = user;
    next();
  });
};

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
  console.log("Iniciando o servidor...");
  await initializeDatabase();
  console.log("Banco de dados inicializado.");
  
  // Inicia as tarefas em background
  startBackgroundTasks();
  console.log("Tarefas em background iniciadas.");

  // Security Check
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'uma_chave_secreta_muito_longa_e_aleatoria') {
      console.warn("⚠️ AVISO DE SEGURANÇA: JWT_SECRET não está configurado corretamente para produção!");
    }
    if (!process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD === 'sua_senha_super_segura_aqui') {
      console.warn("⚠️ AVISO DE SEGURANÇA: ADMIN_PASSWORD não está configurado corretamente para produção!");
    }
  }

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

  // --- AUTH API ---
  app.post("/api/admin/login", (req, res) => {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123"; // Fallback para dev

    if (password === adminPassword) {
      const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '24h' });
      res.json({ success: true, token });
    } else {
      res.status(401).json({ error: "Senha incorreta." });
    }
  });

  // --- LEADS API (CRM) ---
  // Rota pública (recebe leads do formulário)
  app.post("/api/leads", async (req, res) => {
    try {
      const body = req.body;
      
      if (!body.name) {
        return res.status(400).json({ error: "O nome é obrigatório." });
      }

      const score = calculateScore(body);

      let lead = await prisma.lead.create({
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

      // 4. Call analyzeLeadWithAI() & 5. Update lead with AI results
      // --- IA DESATIVADA TEMPORARIAMENTE POR SEGURANÇA ---
      /*
      try {
        const aiResult = await analyzeLeadWithAI(body);
        if (aiResult && Object.keys(aiResult).length > 0) {
          lead = await prisma.lead.update({
            where: { id: lead.id },
            data: {
              aiSummary: aiResult.aiSummary,
              aiStrategy: aiResult.aiStrategy,
              closeProb: aiResult.closeProb
            }
          });
        }
      } catch (aiError) {
        console.error("Erro na análise de IA:", aiError);
      }
      */
      
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

  // Rotas protegidas (Admin)
  app.get("/api/leads", authenticateToken, async (req, res) => {
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

  app.put("/api/leads/:id", authenticateToken, async (req, res) => {
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

  app.post("/api/leads/:id/analyze", authenticateToken, async (req, res) => {
    return res.status(503).json({ error: "Recurso de IA temporariamente desativado por segurança." });
    /*
    try {
      const { id } = req.params;
      const lead = await prisma.lead.findUnique({ where: { id } });
      
      if (!lead) {
        return res.status(404).json({ error: "Lead não encontrado." });
      }

      const aiResult = await analyzeLeadWithAI(lead);
      
      if (aiResult && Object.keys(aiResult).length > 0) {
        const updatedLead = await prisma.lead.update({
          where: { id },
          data: {
            aiSummary: aiResult.aiSummary,
            aiStrategy: aiResult.aiStrategy,
            closeProb: aiResult.closeProb
          }
        });
        res.json({ success: true, lead: updatedLead });
      } else {
        res.status(500).json({ error: "Falha ao analisar lead com IA." });
      }
    } catch (err) {
      console.error("Erro ao analisar lead:", err);
      res.status(500).json({ error: "Erro interno ao analisar o lead." });
    }
    */
  });

  app.post("/api/leads/:id/proposal", authenticateToken, async (req, res) => {
    return res.status(503).json({ error: "Recurso de IA temporariamente desativado por segurança." });
    /*
    try {
      const { id } = req.params;
      const lead = await prisma.lead.findUnique({ where: { id } });
      
      if (!lead) {
        return res.status(404).json({ error: "Lead não encontrado." });
      }

      if (!lead.aiSummary || !lead.aiStrategy) {
        return res.status(400).json({ error: "Lead precisa ser analisado antes de gerar proposta." });
      }

      const { generateProposalWithAI } = await import('./lib/ai.js');
      const proposal = await generateProposalWithAI(lead);
      
      res.json({ success: true, proposal });
    } catch (err) {
      console.error("Erro ao gerar proposta:", err);
      res.status(500).json({ error: "Erro interno ao gerar a proposta." });
    }
    */
  });

  // --- BLOG API ---
  // Rotas públicas
  app.get("/api/posts", async (req, res) => {
    try {
      const posts = await prisma.post.findMany({
        where: { published: true }, // Apenas posts publicados na rota pública
        include: { author: true, category: true },
        orderBy: { createdAt: "desc" },
      });
      res.json(posts);
    } catch (err) {
      console.error("Erro ao buscar posts:", err);
      res.status(500).json({ error: "Erro interno ao buscar posts." });
    }
  });

  app.get("/api/posts/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const post = await prisma.post.findUnique({
        where: { slug },
        include: { author: true, category: true },
      });
      
      if (!post || (!post.published && !(req as any).user)) {
        return res.status(404).json({ error: "Post não encontrado." });
      }
      
      res.json(post);
    } catch (err) {
      console.error("Erro ao buscar post:", err);
      res.status(500).json({ error: "Erro interno ao buscar o post." });
    }
  });

  // Rotas protegidas (Admin)
  app.get("/api/admin/posts", authenticateToken, async (req, res) => {
    try {
      const posts = await prisma.post.findMany({
        include: { author: true, category: true },
        orderBy: { createdAt: "desc" },
      });
      res.json(posts);
    } catch (err) {
      console.error("Erro ao buscar posts:", err);
      res.status(500).json({ error: "Erro interno ao buscar posts." });
    }
  });

  app.post("/api/posts", authenticateToken, async (req, res) => {
    try {
      const data = req.body;
      const post = await prisma.post.create({
        data: {
          title: data.title,
          slug: data.slug,
          content: data.content,
          excerpt: data.excerpt,
          coverImage: data.coverImage,
          published: data.published || false,
        }
      });
      res.status(201).json(post);
    } catch (err: any) {
      console.error("Erro ao criar post:", err);
      res.status(500).json({ error: "Erro ao criar post: " + err.message });
    }
  });

  app.put("/api/posts/:id", authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const post = await prisma.post.update({
        where: { id: Number(id) },
        data: {
          title: data.title,
          slug: data.slug,
          content: data.content,
          excerpt: data.excerpt,
          coverImage: data.coverImage,
          published: data.published,
        }
      });
      res.json(post);
    } catch (err: any) {
      console.error("Erro ao atualizar post:", err);
      res.status(500).json({ error: "Erro ao atualizar post: " + err.message });
    }
  });

  app.delete("/api/posts/:id", authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      await prisma.post.delete({
        where: { id: Number(id) }
      });
      res.json({ success: true });
    } catch (err: any) {
      console.error("Erro ao excluir post:", err);
      res.status(500).json({ error: "Erro ao excluir post: " + err.message });
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
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
