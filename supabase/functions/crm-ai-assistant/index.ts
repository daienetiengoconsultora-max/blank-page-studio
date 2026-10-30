import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  try {
    const authorization = req.headers.get("Authorization");
    if (!authorization) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authorization } } });
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) return new Response(JSON.stringify({ error: "AI service not configured" }), { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const body = await req.json();
    const question = String(body?.question ?? "").trim().slice(0, 4000);
    const context = body?.context ?? {};
    if (!question) return new Response(JSON.stringify({ error: "Question required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const system = `Você é a Assistente IA da Daiene Descomplica Crédito, uma consultora experiente em consórcios, financiamento, atendimento comercial e organização de CRM no Brasil.
Responda sempre em português brasileiro, com clareza, objetividade, tom acolhedor e orientação prática.
Ajude em TODAS as áreas do CRM: visão geral e indicadores, clientes e funil, follow-up, agenda, propostas, simuladores, investidores, parceiros, documentos e relatórios.
Para simulações: explique premissas e fórmulas, confira valores e prazos, diferencie taxa administrativa total de taxa mensal, fundo de reserva, lance, seguros, reajustes e custos adicionais. Nunca invente taxa de administradora nem trate estimativa como proposta oficial. Se faltarem dados, diga exatamente quais faltam.
Para vendas: sugira próximos passos, perguntas de qualificação e mensagens curtas de WhatsApp sem pressão ou promessas.
Nunca prometa contemplação, aprovação, rentabilidade ou resultado garantido. Não dê aconselhamento jurídico definitivo; recomende análise humana/jurídica quando necessário.
Use somente os dados agregados e de simulação fornecidos no contexto. Não invente dados nem peça CPF, senhas ou informações financeiras sigilosas. Se o pedido envolver dados individuais de cliente que não foram fornecidos, oriente a usuária a abrir o cadastro e compartilhar apenas o necessário.
Seja específica, organize respostas longas em tópicos e termine com uma ação prática.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.35,
        max_tokens: 900,
        messages: [
          { role: "system", content: system },
          { role: "user", content: "Contexto resumido do CRM (dados pessoais foram omitidos): " + JSON.stringify(context).slice(0, 12000) + "\n\nSolicitação: " + question }
        ]
      })
    });
    const result = await response.json();
    if (!response.ok) {
      console.error("OpenAI error", response.status, result?.error?.type);
      return new Response(JSON.stringify({ error: "AI provider error" }), { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const answer = result?.choices?.[0]?.message?.content ?? "Não consegui formular uma resposta agora.";
    return new Response(JSON.stringify({ answer }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (_error) {
    return new Response(JSON.stringify({ error: "Unexpected error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
