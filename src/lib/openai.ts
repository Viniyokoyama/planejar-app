import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeGeomarketing(params: {
  address: string;
  segment: string;
  targetAudience: string;
  avgTicket?: number;
}) {
  const prompt = `Você é um especialista em geomarketing brasileiro com profundo conhecimento em análise de pontos comerciais.

Analise o seguinte endereço para abertura de um negócio:

**Endereço:** ${params.address}
**Segmento:** ${params.segment}
**Público-alvo:** ${params.targetAudience}
**Ticket médio:** ${params.avgTicket ? `R$ ${params.avgTicket}` : "não informado"}

Gere uma análise completa com notas de 0 a 10 para cada critério e justificativas técnicas baseadas no contexto brasileiro.

Responda SOMENTE com um JSON válido no seguinte formato:
{
  "scores": {
    "fluxo_pessoas": { "nota": 7.5, "justificativa": "..." },
    "perfil_economico": { "nota": 8.0, "justificativa": "..." },
    "acessibilidade": { "nota": 7.0, "justificativa": "..." },
    "concorrencia": { "nota": 6.5, "justificativa": "..." },
    "seguranca": { "nota": 7.5, "justificativa": "..." },
    "potencial_receita": { "nota": 8.0, "justificativa": "..." }
  },
  "nota_geral": 7.4,
  "resumo": "Análise geral do endereço em 2-3 frases.",
  "pontos_fortes": ["ponto forte 1", "ponto forte 2"],
  "pontos_atencao": ["ponto de atenção 1", "ponto de atenção 2"],
  "recomendacao": "Recomendação final objetiva sobre viabilidade."
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.3,
  });

  return JSON.parse(response.choices[0].message.content || "{}");
}

export async function analyzeDiagnostico(params: {
  businessName: string;
  segment: string;
  description: string;
  targetAudience: string;
  avgTicket?: number;
}) {
  const prompt = `Você é um consultor empresarial sênior especialista em PMEs brasileiras com expertise em benchmarking setorial.

Faça um diagnóstico empresarial completo para o seguinte negócio:

**Nome:** ${params.businessName}
**Segmento:** ${params.segment}
**Descrição da operação:** ${params.description}
**Público-alvo:** ${params.targetAudience}
**Ticket médio:** ${params.avgTicket ? `R$ ${params.avgTicket}` : "não informado"}

Compare com empresas de referência do setor no Brasil e gere um diagnóstico detalhado.

Responda SOMENTE com JSON válido:
{
  "scores": {
    "operacoes": { "nota": 7.0, "descricao": "..." },
    "marketing": { "nota": 6.0, "descricao": "..." },
    "financeiro": { "nota": 7.5, "descricao": "..." },
    "digital": { "nota": 5.5, "descricao": "..." },
    "atendimento": { "nota": 8.0, "descricao": "..." }
  },
  "nota_geral": 6.8,
  "nivel_maturidade": "Em desenvolvimento",
  "benchmark_setor": "Comparação com o mercado em 2 frases.",
  "recomendacoes": [
    { "prioridade": "alta", "categoria": "Marketing", "acao": "Ação específica", "impacto": "Impacto esperado" },
    { "prioridade": "alta", "categoria": "Digital", "acao": "Ação específica", "impacto": "Impacto esperado" },
    { "prioridade": "media", "categoria": "Operações", "acao": "Ação específica", "impacto": "Impacto esperado" },
    { "prioridade": "media", "categoria": "Financeiro", "acao": "Ação específica", "impacto": "Impacto esperado" },
    { "prioridade": "baixa", "categoria": "Atendimento", "acao": "Ação específica", "impacto": "Impacto esperado" }
  ],
  "resumo_executivo": "Resumo geral do diagnóstico em 3-4 frases."
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.3,
  });

  return JSON.parse(response.choices[0].message.content || "{}");
}

export async function analyzeConcorrencia(params: {
  segment: string;
  address: string;
  businessName: string;
}) {
  const prompt = `Você é um analista de inteligência competitiva especialista no mercado brasileiro.

Simule uma análise de concorrência para o seguinte negócio:

**Negócio:** ${params.businessName}
**Segmento:** ${params.segment}
**Localização:** ${params.address}

Com base em padrões típicos do mercado brasileiro para este segmento e região, gere uma análise realista de concorrência.

Responda SOMENTE com JSON válido:
{
  "concorrentes": [
    {
      "nome": "Nome do Concorrente",
      "tipo": "direto",
      "rating": 4.2,
      "avaliacoes": 187,
      "pontos_fortes": ["ponto forte 1", "ponto forte 2"],
      "pontos_fracos": ["ponto fraco 1", "ponto fraco 2"],
      "sentimento_positivo": 78,
      "sentimento_negativo": 22,
      "diferenciais": "O que os clientes mais elogiam"
    }
  ],
  "oportunidades": [
    "Oportunidade estratégica 1 baseada nas fraquezas da concorrência",
    "Oportunidade estratégica 2",
    "Oportunidade estratégica 3"
  ],
  "ameacas": ["Ameaça 1", "Ameaça 2"],
  "posicionamento_recomendado": "Como se diferenciar da concorrência local.",
  "resumo": "Análise geral do panorama competitivo em 2-3 frases."
}

Crie 3 a 5 concorrentes realistas e típicos para este segmento.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.5,
  });

  return JSON.parse(response.choices[0].message.content || "{}");
}

export async function analyzeRiscos(params: {
  address: string;
  segment: string;
}) {
  const prompt = `Você é um especialista em gestão de riscos para negócios físicos no Brasil.

Gere uma análise preditiva de riscos para um negócio do segmento ${params.segment} localizado em: ${params.address}

Considere riscos típicos brasileiros: obras públicas, sazonalidade, eventos locais, clima regional, concorrência futura.

Responda SOMENTE com JSON válido:
{
  "alertas": [
    {
      "tipo": "obra|clima|evento|sazonalidade|economico",
      "severidade": "alta|media|baixa",
      "titulo": "Título do alerta",
      "descricao": "Descrição detalhada do risco",
      "impacto_estimado": 25,
      "periodo": "Período de risco estimado",
      "mitigacao": "Como minimizar este risco"
    }
  ],
  "score_risco_geral": 6.5,
  "periodo_mais_critico": "Mês ou período com maior risco",
  "resumo": "Avaliação geral de risco em 2-3 frases."
}

Gere de 3 a 5 alertas realistas.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.4,
  });

  return JSON.parse(response.choices[0].message.content || "{}");
}
