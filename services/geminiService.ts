import { GoogleGenAI } from "@google/genai";
import { SportType } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const M6A_SYSTEM_INSTRUCTION = `
PAPEL: Você é um Analista de Dados Esportivos de Elite implementando o "Framework M6A" (Modelo de 6 Atributos).
OBJETIVO: Quantificar performance (0-100) baseado em evidências estatísticas, removendo subjetividade.

OS 6 ATRIBUTOS E MÉTRICAS POR ESPORTE:

[FUTEBOL]
1. Defesa: Desarmes, Interceptações, Duelos Aéreos.
2. Ataque: xG, Gols, Assistências, SCA.
3. Físico: Distância percorrida, Velocidade, Lesões.

[BASQUETE]
1. Defesa: Defensive Rating, Tocos, Roubos.
2. Ataque: TS%, Pontos/Jogo, Assistências.
3. Físico: Minutagem, Explosão.

[VÔLEI]
1. Defesa: Digs (Manchete), Recepção (Passe A/B), Bloqueios.
2. Ataque: % de Ataque (Virada de bola), Aces, Pontos por set.
3. Físico: Altura de alcance, Salto vertical, Resistência.

[GERAL - TODOS OS ESPORTES]
4. Mentalidade: Clutch (pontos decisivos), Disciplina, Liderança.
5. Técnica: Qualidade do fundamento (Passe, Toque, Mecânica).
6. Talento: Valor de Mercado, Potencial Futuro, "Fator X".

REGRAS DE FORMATAÇÃO (JSON CRÍTICO):
1. Responda APENAS com um JSON válido.
2. IMPORTANTE: NÃO use aspas duplas (") dentro dos valores de texto (strings). Isso quebra a sintaxe do JSON.
   - ERRADO: "justificativa": "O jogador é "clutch" em finais."
   - CORRETO: "justificativa": "O jogador é 'clutch' em finais."
3. Use aspas simples (') para ênfase, apelidos ou citações dentro das strings.

REGRAS GERAIS:
- Intervalo: 0-100.
- Contexto: Data Atual (Tempo Real). Verifique status do elenco (lesões, transferências) usando a PESQUISA DO GOOGLE.
- Tom: Analítico mas com gírias leves do esporte ("Resenha de alto nível").
- Idioma: Português do Brasil.
`;

// Helper to extract clean JSON from response
const parseJSON = (text: string) => {
  try {
    // Remove markdown code blocks
    let cleaned = text.replace(/```json/g, '').replace(/```/g, '');
    
    // Find the outer-most JSON object brackets to handle conversational filler
    const firstOpen = cleaned.indexOf('{');
    const lastClose = cleaned.lastIndexOf('}');
    
    if (firstOpen !== -1 && lastClose !== -1 && lastClose > firstOpen) {
      cleaned = cleaned.substring(firstOpen, lastClose + 1);
    }
    
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("Failed to parse JSON", e, text);
    throw new Error("Erro ao processar dados da IA. A resposta não veio no formato JSON esperado. Tente novamente.");
  }
};

// Helper to extract grounding metadata
const extractReferences = (candidate: any) => {
  const chunks = candidate?.groundingMetadata?.groundingChunks || [];
  return chunks
    .map((c: any) => c.web ? { title: c.web.title, url: c.web.uri } : null)
    .filter((r: any) => r !== null);
};

export const analyzeEntity = async (query: string, sport: SportType) => {
  const prompt = `Analise a seguinte entidade de ${sport} (Jogador ou Time): "${query}".
  Forneça uma análise detalhada M6A com justificativas métricas específicas.
  Use o Google Search para encontrar estatísticas recentes e uma URL de imagem representativa.
  
  ATENÇÃO: Responda EXCLUSIVAMENTE com um JSON válido. Evite aspas duplas dentro dos textos (use aspas simples).
  
  Formato esperado:
  {
    "entityName": "Nome",
    "role": "Posição ou 'Time'",
    "team": "Time Atual",
    "age": 25 (se jogador),
    "imageUrl": "URL da imagem encontrada (priorize imagens oficiais ou de veículos de imprensa)",
    "overallScore": 85,
    "attributes": {
      "defense": 80, "attack": 80, "physical": 80, "mentality": 80, "technique": 80, "talent": 80
    },
    "justification": "Texto em markdown detalhado... use aspas simples para 'citações'.",
    "keyMetrics": ["xG: 0.5", "Passes: 90%"]
  }`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      systemInstruction: M6A_SYSTEM_INSTRUCTION,
      tools: [{ googleSearch: {} }]
    }
  });

  const text = response.text || "{}";
  const data = parseJSON(text);
  data.references = extractReferences(response.candidates?.[0]);
  
  return data;
};

export const comparePlayers = async (playerA: string, playerB: string, sport: SportType) => {
  const prompt = `Realize um COMPARAÇÃO DIRETA (Head-to-Head) entre os jogadores de ${sport}: "${playerA}" vs "${playerB}".
  Use o Google Search para encontrar estatísticas recentes e imagens para AMBOS.
  Determine quem é melhor no geral e compare atributo por atributo.

  ATENÇÃO: Responda EXCLUSIVAMENTE com um JSON válido. Evite aspas duplas dentro dos textos.

  Formato esperado:
  {
    "playerA": {
      "entityName": "Nome A",
      "role": "Posição",
      "team": "Time A",
      "imageUrl": "URL Imagem A",
      "overallScore": 85,
      "attributes": { "defense": 0, "attack": 0, "physical": 0, "mentality": 0, "technique": 0, "talent": 0 },
      "keyMetrics": ["Stat 1", "Stat 2"]
    },
    "playerB": {
      "entityName": "Nome B",
      "role": "Posição",
      "team": "Time B",
      "imageUrl": "URL Imagem B",
      "overallScore": 82,
      "attributes": { "defense": 0, "attack": 0, "physical": 0, "mentality": 0, "technique": 0, "talent": 0 },
      "keyMetrics": ["Stat 1", "Stat 2"]
    },
    "winner": "Nome do Vencedor",
    "comparisonAnalysis": "Texto em markdown comparando os pontos fortes e fracos de cada um. Explique por que o vencedor ganhou. Use aspas simples."
  }`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      systemInstruction: M6A_SYSTEM_INSTRUCTION,
      tools: [{ googleSearch: {} }]
    }
  });

  const text = response.text || "{}";
  const data = parseJSON(text);
  data.references = extractReferences(response.candidates?.[0]);

  return data;
};

export const predictMatchup = async (teamA: string, teamB: string, sport: SportType) => {
  const prompt = `Analise um confronto hipotético entre ${teamA} e ${teamB} no ${sport}.
  Compare seus atributos M6A e preveja o resultado baseado em encaixe tático e força estatística.
  Use o Google Search para verificar forma recente, desfalques e imagens dos times.

  ATENÇÃO: Responda EXCLUSIVAMENTE com um JSON válido.

  Formato esperado:
  {
    "teamA": { "entityName": "Nome A", "imageUrl": "URL Logo A", "overallScore": 0, "attributes": { ... } },
    "teamB": { "entityName": "Nome B", "imageUrl": "URL Logo B", "overallScore": 0, "attributes": { ... } },
    "predictedScore": "2-1",
    "analysis": "Análise detalhada em markdown... use aspas simples para 'citações'."
  }`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      systemInstruction: M6A_SYSTEM_INSTRUCTION,
      tools: [{ googleSearch: {} }]
    }
  });

  const text = response.text || "{}";
  const data = parseJSON(text);
  data.references = extractReferences(response.candidates?.[0]);

  return data;
};

export const scoutPlayer = async (team: string, problemArea: string, sport: SportType) => {
  const prompt = `O time de ${sport} "${team}" tem uma fraqueza em "${problemArea}".
  Identifique o atributo específico necessário para corrigir isso.
  Sugira uma contratação realista (financeiramente e contratualmente viável) que tenha nota Elite (90+) nesse atributo.
  Use o Google Search para validar valores de mercado, contratos e buscar imagem do jogador.

  ATENÇÃO: Responda EXCLUSIVAMENTE com um JSON válido.

  Formato esperado:
  {
    "targetAttribute": "Atributo Alvo",
    "suggestedPlayer": "Nome do Jogador",
    "imageUrl": "URL de imagem do jogador",
    "currentTeam": "Time Atual",
    "reasoning": "Justificativa em markdown... use aspas simples para 'citações'.",
    "viabilityScore": 85
  }`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      systemInstruction: M6A_SYSTEM_INSTRUCTION,
      tools: [{ googleSearch: {} }]
    }
  });

  const text = response.text || "{}";
  const data = parseJSON(text);
  data.references = extractReferences(response.candidates?.[0]);

  return data;
};