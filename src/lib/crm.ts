// Regras de negócio do CRM DTM (valores e prazos informados pela cliente).
export const AUTHORIZED_EMAIL = "daienetiengoconsultora@gmail.com";

export const isAuthorizedEmail = (email: string | null | undefined) =>
  (email ?? "").trim().toLowerCase() === AUTHORIZED_EMAIL;

export const PRICES = { PF: 850, PJ: 950 } as const;
export type ClientType = keyof typeof PRICES;
export const priceFor = (t: string): number => (t === "PJ" ? PRICES.PJ : PRICES.PF);

export const LEAD_STAGES = [
  { value: "novo", label: "Novo" },
  { value: "em_atendimento", label: "Em atendimento" },
  { value: "contrato_enviado", label: "Contrato enviado" },
  { value: "assinado", label: "Assinado" },
  { value: "em_processo", label: "Em processo" },
  { value: "concluido", label: "Concluído" },
  { value: "nao_fechou", label: "Não fechou" },
] as const;
export const stageLabel = (v: string) => LEAD_STAGES.find((s) => s.value === v)?.label ?? v;

export const CONTRACT_STATUS = [
  { value: "rascunho", label: "Rascunho" },
  { value: "enviado", label: "Enviado" },
  { value: "assinado", label: "Assinado" },
  { value: "arquivado", label: "Arquivado" },
] as const;

export const PROCESS_STATUS = [
  { value: "aguardando", label: "Aguardando andamento" },
  { value: "suspensao_iniciada", label: "Suspensão iniciada" },
  { value: "vigencia_suspensao", label: "Vigência da suspensão" },
  { value: "concluido", label: "Processo concluído" },
] as const;
export const processLabel = (v: string) => PROCESS_STATUS.find((s) => s.value === v)?.label ?? v;

export const ALERT_DAYS = 15;

/** Dias até a data (YYYY-MM-DD), contando a partir de `today`. */
export function daysUntil(date: string, today: Date = new Date()): number {
  const [y, m, d] = date.split("-").map(Number);
  const target = Date.UTC(y!, m! - 1, d!);
  const base = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((target - base) / 86_400_000);
}

/** Alerta visual: a partir de 15 dias antes da data cadastrada (inclui atrasadas). */
export function needsAlert(date: string | null | undefined, today: Date = new Date()): boolean {
  if (!date) return false;
  return daysUntil(date, today) <= ALERT_DAYS;
}

export const brl = (n: number | null | undefined) =>
  (n ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const fmtDate = (d: string | null | undefined) =>
  d ? new Date(d.length === 10 ? `${d}T12:00:00` : d).toLocaleDateString("pt-BR") : "—";

/** Substitui {chaves} pelo valor correspondente; chaves ausentes ficam visíveis. */
export function fillTemplate(body: string, vars: Record<string, string | null | undefined>) {
  return body.replace(/\{(\w+)\}/g, (m, k: string) => {
    const v = vars[k];
    return v == null || v === "" ? m : v;
  });
}

export const onlyDigits = (s: string) => s.replace(/\D/g, "");
