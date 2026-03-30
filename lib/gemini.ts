import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeLead(lead: any) {
  const prompt = `
  Você é um consultor estratégico de marketing digital.
  Analise este lead:

  Nicho: ${lead.niche || "Não informado"}
  Orçamento: ${lead.budget || "Não informado"}
  Objetivo: ${lead.objective || "Não informado"}
  Tráfego: ${lead.traffic || "Não informado"}
  Desafio: ${lead.challenge || "Não informado"}
  Urgência: ${lead.urgency || "Não informado"}

  Gere um JSON com as seguintes chaves:
  - "aiSummary": resumo estratégico (string)
  - "aiStrategy": estratégia recomendada (string)
  - "closeProb": probabilidade de fechamento de 0 a 100 (number)
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    }
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Erro ao fazer parse do JSON do Gemini", e);
    return {};
  }
}

export async function generateProposal(lead: any) {
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

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });

  return response.text;
}
