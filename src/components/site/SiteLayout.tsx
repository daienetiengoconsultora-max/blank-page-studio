import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { BRAND, WHATSAPP_DISPLAY, whatsappLink } from "@/lib/site";

const NAV = [
  { to: "/servicos", label: "Serviços" },
  { to: "/como-funciona", label: "Como funciona" },
  { to: "/sobre", label: "Sobre nós" },
  { to: "/blog", label: "Blog DTM" },
  { to: "/perguntas-frequentes", label: "Dúvidas" },
] as const;

export function SiteLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <header className="sticky top-0 z-40 border-b-2 border-accent bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-primary font-display text-sm font-bold text-primary-foreground ring-2 ring-accent ring-offset-2 ring-offset-background">DTM</span>
            <span className="border-b-2 border-accent pb-1 font-display text-lg font-semibold text-primary">Consultoria Financeira</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} className="text-muted-foreground transition-colors hover:text-brand-purple" activeProps={{ className: "font-semibold text-brand-purple" }}>{n.label}</Link>
            ))}
            <Link to="/" hash="diagnostico" className="rounded-full bg-primary px-5 py-2.5 text-primary-foreground shadow-elegant hover:opacity-90">Diagnóstico</Link>
          </nav>
          <button className="md:hidden rounded-md border border-border px-3 py-2 text-sm" onClick={() => setOpen(!open)} aria-label="Abrir menu">Menu</button>
        </div>
        {open && (
          <nav className="flex flex-col gap-1 border-t border-border px-5 py-3 md:hidden">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="py-2 text-sm font-medium">{n.label}</Link>
            ))}
            <Link to="/" hash="diagnostico" onClick={() => setOpen(false)} className="mt-2 rounded-full bg-primary px-5 py-2.5 text-center text-sm font-semibold text-primary-foreground">Fazer diagnóstico</Link>
          </nav>
        )}
      </header>
      <main>{children}</main>
      <footer className="bg-primary px-5 py-12 text-sm text-primary-foreground/90">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
          <div>
            <p className="font-display text-xl font-semibold text-primary-foreground decoration-accent underline decoration-2 underline-offset-8">{BRAND}</p>
            <p className="mt-3 leading-6">Consultoria em regularização de nome e diagnóstico financeiro. Atendimento em todo o Brasil.</p>
            <p className="mt-3 text-xs leading-5">Não garantimos aprovação de crédito, aumento de score ou exclusão de dívidas. Cada caso depende de análise.</p>
          </div>
          <div className="flex flex-col gap-2">
            <Link className="transition-colors hover:text-accent" to="/servicos">Serviços</Link><Link className="transition-colors hover:text-accent" to="/blog">Blog DTM</Link><Link className="transition-colors hover:text-accent" to="/sobre">Sobre nós</Link>
            <Link className="transition-colors hover:text-accent" to="/privacidade">Política de privacidade</Link><Link className="transition-colors hover:text-accent" to="/termos">Termos de uso</Link>
          </div>
          <div className="flex flex-col items-start gap-3">
            <a href={whatsappLink()} target="_blank" rel="noreferrer" className="rounded-full bg-accent px-5 py-2.5 font-semibold text-primary transition-colors hover:bg-brand-purple hover:text-primary-foreground">WhatsApp {WHATSAPP_DISPLAY}</a>
          </div>
        </div>
        <p className="mx-auto mt-10 max-w-6xl text-xs opacity-60">© {new Date().getFullYear()} {BRAND}. Todos os direitos reservados.</p>
      </footer>
      <a href={whatsappLink()} target="_blank" rel="noreferrer" aria-label="Falar pelo WhatsApp" className="fixed bottom-5 right-5 z-50 rounded-full bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-elegant">WhatsApp</a>
    </div>
  );
}

export function PageHero({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string | undefined }) {
  return (
    <section className="dtm-purple-panel relative overflow-hidden px-5 py-16 md:py-20">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">{eyebrow}</p>
        <h1 className="mt-3 font-display text-4xl font-semibold leading-tight md:text-5xl">{title}</h1>
        {text && <p className="mt-4 max-w-2xl text-base leading-7 opacity-90">{text}</p>}
      </div>
    </section>
  );
}
