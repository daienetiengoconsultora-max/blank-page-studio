import { describe, expect, it } from "vitest";
import { fillTemplate, isAuthorizedEmail, needsAlert, priceFor } from "@/lib/crm";

describe("CRM rules", () => {
  it("PF costs R$850", () => expect(priceFor("PF")).toBe(850));
  it("PJ costs R$950", () => expect(priceFor("PJ")).toBe(950));
  it("only the authorized email may sign in", () => {
    expect(isAuthorizedEmail(" DaieneTiengoConsultora@gmail.com ")).toBe(true);
    expect(isAuthorizedEmail("outra@gmail.com")).toBe(false);
  });
  it("alerts 15 days before the date, not 16", () => {
    const today = new Date(2026, 10, 1);
    expect(needsAlert("2026-11-16", today)).toBe(true);
    expect(needsAlert("2026-11-17", today)).toBe(false);
    expect(needsAlert("2026-10-20", today)).toBe(true);
  });
  it("fills contract placeholders", () => {
    expect(fillTemplate("R$ {valor} - {x}", { valor: "850,00" })).toBe("R$ 850,00 - {x}");
  });
});
