import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { BRAND, WHATSAPP_DISPLAY, whatsappLink } from "@/lib/site";

const NAV = [
  { to: "/", label: "Início" },
  { to: "/servicos", label: "Serviços" },
  { to: "/como-funciona", label: "Como funciona" },
  { to: "/valores", label: "Valores e condições" },
  { to: "/perguntas-frequentes", label: "FAQ" },
  { to: "/sobre", label: "Sobre" },
  { to: "/blog", label: "Blog" },
  { to: "/contato", label: "Fale conosco" },
] as const;

export function SiteLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="dtm-site-watermark min-h-screen bg-background font-sans text-foreground">
      <header className="sticky top-0 z-40 border-b-2 border-brand-gold bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-2">
          <Link to="/" className="flex min-w-0 shrink-0 items-center gap-2" aria-label={`${BRAND} - Início`}>
            <img
              src="/logo-dtm-consultoria-financeira.svg"
              alt="Logo DTM Assessoria e Consultoria em Regularização de Dados de Crédito"
              width="260"
              height="241"
              className="h-auto w-12 shrink-0 object-contain object-center sm:w-14"
              fetchPriority="high"
            />
            <span className="max-w-[130px] text-xs font-bold leading-tight text-brand-purple sm:max-w-none sm:text-sm">{BRAND}</span>
          </Link>
          <nav className="hidden items-center gap-4 text-sm font-medium lg:flex">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="text-muted-foreground transition-colors hover:text-brand-purple"
                activeOptions={{ exact: true }}
                activeProps={{ className: "font-semibold text-brand-purple" }}
              >
                {n.label}
              </Link>
            ))}
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-brand-spectrum px-5 py-2.5 text-white shadow-elegant hover:opacity-90"
            >
              WhatsApp
            </a>
          </nav>
          <button
            className="rounded-md border border-brand-purple px-3 py-2 text-sm text-brand-purple lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Abrir menu"
          >
            Menu
          </button>
        </div>
        {open && (
          <nav className="flex flex-col gap-1 border-t border-brand-pink/40 bg-brand-cream px-5 py-3 lg:hidden">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="py-2 text-sm font-medium"
              >
                {n.label}
              </Link>
            ))}
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-brand-spectrum px-5 py-2.5 text-center text-sm font-semibold text-white"
            >
              WhatsApp
            </a>
          </nav>
        )}
      </header>
      <main>{children}</main>
      <footer className="bg-brand-spectrum px-5 py-12 text-sm text-white">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
          <div className="min-w-0">
            <div className="mb-3 inline-flex max-w-full items-center justify-center rounded-xl border border-brand-gold bg-brand-cream p-2">
              <img
                src="/logo-dtm-consultoria-financeira.svg"
                alt="Logo DTM Assessoria e Consultoria em Regularização de Dados de Crédito"
                width="260"
                height="241"
                className="block h-auto w-28 max-w-full object-contain object-center sm:w-36"
                loading="lazy"
              />
            </div>
            <p className="mt-3 leading-6">
              Consultoria em regularização de nome, rating comercial e bancário e diagnóstico
              financeiro. Atendimento em todo o Brasil.
            </p>
            <p className="mt-3 text-xs leading-5">
              Não garantimos aprovação de crédito, aumento de score ou exclusão de dívidas. Cada
              caso depende de análise individual.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Link className="transition-colors hover:text-accent" to="/valores">
              Valores e condições
            </Link>
            <Link className="transition-colors hover:text-accent" to="/servicos">
              Serviços
            </Link>
            <Link className="transition-colors hover:text-accent" to="/como-funciona">
              Como funciona
            </Link>
            <Link className="transition-colors hover:text-accent" to="/blog">
              Blog DTM
            </Link>
            <Link className="transition-colors hover:text-accent" to="/sobre">
              Sobre nós
            </Link>
            <Link className="transition-colors hover:text-accent" to="/privacidade">
              Política de privacidade
            </Link>
            <Link className="transition-colors hover:text-accent" to="/termos">
              Termos de uso
            </Link>
          </div>
          <div className="flex flex-col items-start gap-3">
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-brand-gold px-5 py-2.5 font-semibold text-[#17264f] transition-colors hover:bg-brand-pink hover:text-white"
            >
              WhatsApp {WHATSAPP_DISPLAY}
            </a>
            <p className="text-xs opacity-80">Atendimento digital • Todo o Brasil</p>
          </div>
        </div>
        <p className="mx-auto mt-10 max-w-6xl text-xs opacity-60">
          © {new Date().getFullYear()} {BRAND}. Todos os direitos reservados. A DTM não é escritório
          de advocacia.{" "}
          <Link to="/acesso" className="underline-offset-4 hover:underline">
            Área restrita
          </Link>
        </p>
      </footer>
      <a
        href={whatsappLink()}
        target="_blank"
        rel="noreferrer"
        aria-label="Falar pelo WhatsApp"
        className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-[#1DA851] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#25D366]"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-current">
          <path d="M20.52 3.48A11.86 11.86 0 0 0 12.08 0C5.5 0 .15 5.35.15 11.93c0 2.1.55 4.15 1.6 5.96L0 24l6.27-1.64a11.9 11.9 0 0 0 5.8 1.48h.01c6.58 0 11.93-5.35 11.93-11.93 0-3.19-1.24-6.19-3.49-8.43ZM12.08 21.8a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.72.97.99-3.63-.23-.37a9.86 9.86 0 0 1-1.51-5.25c0-5.46 4.44-9.9 9.9-9.9 2.65 0 5.14 1.03 7.01 2.9a9.84 9.84 0 0 1 2.9 7c0 5.46-4.44 9.9-9.9 9.9Zm5.43-7.41c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.21 5.08 4.5.71.31 1.26.5 1.69.64.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35Z"/>
        </svg>
        WhatsApp
      </a>
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text?: string | undefined;
}) {
  return (
    <section className="dtm-purple-panel relative overflow-hidden px-5 py-16 md:py-20">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold">{eyebrow}</p>
        <h1 className="mt-3 font-display text-4xl font-semibold leading-tight md:text-5xl">
          {title}
        </h1>
        {text && <p className="mt-4 max-w-2xl text-base leading-7 opacity-90">{text}</p>}
      </div>
    </section>
  );
}
