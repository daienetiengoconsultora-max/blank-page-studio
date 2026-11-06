// Regras de negócio do CRM DTM (valores e prazos informados pela cliente).
export const AUTHORIZED_EMAIL = "daienetiengoconsultora@gmail.com";

export const isAuthorizedEmail = (email: string | null | undefined) =>
  (email ?? "").trim().toLowerCase() === AUTHORIZED_EMAIL;

export const PRICES = { PF: 850, PJ: 950 } as const;
export type ClientType = keyof typeof PRICES;
export const priceFor = (t: string): number => (t === "PJ" ? PRICES.PJ : PRICES.PF);

/** Etapas do caso alinhadas ao fluxo real de atendimento DTM. */
export const LEAD_STAGES = [
  { value: "novo", label: "Novo" },
  { value: "diagnostico", label: "Diagnóstico" },
  { value: "proposta", label: "Proposta" },
  { value: "em_atendimento", label: "Em andamento" },
  { value: "aguardando_cliente", label: "Aguardando cliente" },
  { value: "contrato_enviado", label: "Contrato enviado" },
  { value: "assinado", label: "Assinado" },
  { value: "em_processo", label: "Em processo" },
  { value: "concluido", label: "Concluído" },
  { value: "nao_fechou", label: "Perdido" },
] as const;
export const stageLabel = (v: string) => LEAD_STAGES.find((s) => s.value === v)?.label ?? v;

export const LOSS_REASONS = [
  { value: "nao_respondeu", label: "Não respondeu" },
  { value: "preco", label: "Preço" },
  { value: "resolveu_sozinho", label: "Resolveu sozinho" },
  { value: "concorrente", label: "Foi para concorrente" },
  { value: "sem_perfil", label: "Sem perfil / fora do escopo" },
  { value: "outro", label: "Outro" },
] as const;
export const lossReasonLabel = (v: string) => LOSS_REASONS.find((r) => r.value === v)?.label ?? v;

export const LEAD_SOURCES = [
  { value: "Site", label: "Site" },
  { value: "WhatsApp", label: "WhatsApp" },
  { value: "Instagram", label: "Instagram" },
  { value: "Indicação", label: "Indicação" },
  { value: "Google", label: "Google / busca" },
  { value: "Anúncio", label: "Anúncio" },
  { value: "Outro", label: "Outro" },
] as const;

/** Dias sem contato para destacar follow-up. */
export const FOLLOWUP_DAYS = 3;

export function needsFollowUp(
  lastContactAt: string | null | undefined,
  status: string,
  today: Date = new Date(),
): boolean {
  if (["concluido", "nao_fechou", "assinado", "em_processo"].includes(status)) return false;
  const base = lastContactAt ? new Date(lastContactAt) : null;
  if (!base || Number.isNaN(base.getTime())) return true;
  const diff = Math.floor((today.getTime() - base.getTime()) / 86_400_000);
  return diff >= FOLLOWUP_DAYS;
}

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

/** Link do WhatsApp a partir do telefone do lead. */
export function leadWhatsAppLink(phone: string, text?: string) {
  const digits = onlyDigits(phone);
  const n = digits.length <= 11 ? `55${digits}` : digits;
  const q = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${n}${q}`;
}
