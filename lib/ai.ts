const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434/api/generate";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3";

export async function analyzeLeadWithAI(lead: any) {
  const prompt = `
  Você é um consultor estratégico de marketing digital.
  Analise este lead:

  Nicho: ${lead.niche || "Não informado"}
  Orçamento: ${lead.budget || "Não informado"}
  Objetivo: ${lead.objective || "Não informado"}
  Tráfego: ${lead.traffic || "Não informado"}
  Desafio: ${lead.challenge || "Não informado"}
  Urgência: ${lead.urgency || "Não informado"}

  Gere um JSON estrito com as seguintes chaves (não inclua nenhum texto adicional além do JSON):
  {
    "aiSummary": "resumo estratégico",
    "aiStrategy": "estratégia recomendada",
    "closeProb": 85
  }
  `;

  try {
    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: prompt,
        stream: false,
        format: "json" // Força o Ollama a retornar um JSON válido
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();
    return JSON.parse(data.response || "{}");
  } catch (e) {
    console.error("Erro ao analisar lead com Ollama:", e);
    return {};
  }
}

export async function generateProposalWithAI(lead: any) {
  const prompt = `
  Crie uma proposta profissional para este lead com base no resumo:
  ${lead.aiSummary}
  Estratégia:
  ${lead.aiStrategy}

  Inclua:
  - Diagnóstico
  - Estratégia
  - Entregáveis
  - Prazo
  - Investimento
  `;

  try {
    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: prompt,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.response;
  } catch (e) {
    console.error("Erro ao gerar proposta com Ollama:", e);
    return "Erro ao gerar proposta.";
  }
}
