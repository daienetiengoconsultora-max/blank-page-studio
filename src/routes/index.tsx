import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Descomplica Crédito | Soluções para seus planos" },
      { name: "description", content: "Soluções de crédito com clareza e planejamento." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen bg-[#FCFAF7] text-[#252321]">
      <header className="bg-[#541D2B] px-6 py-5 text-white">
        <h1 className="text-xl font-semibold">Descomplica Crédito</h1>
      </header>
      <section className="mx-auto max-w-5xl px-6 py-24">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#A47B36]">Crédito com clareza e planejamento</p>
        <h2 className="mt-4 max-w-3xl text-5xl font-medium leading-tight text-[#541D2B]">Seus planos merecem caminhos claros.</h2>
        <p className="mt-6 max-w-2xl leading-8 text-[#655D55]">Conheça possibilidades para conquistar, financiar ou planejar. Atendimento próximo, explicações simples e decisões no seu ritmo.</p>
        <a href="#solucoes" className="mt-8 inline-block rounded-full bg-[#B58A45] px-7 py-3 font-semibold text-white">Conhecer soluções</a>
      </section>
      <section id="solucoes" className="bg-[#F3EEE7] px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-semibold text-[#541D2B]">Soluções</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {["Consórcios","Financiamento de veículos","Financiamento imobiliário","Investimentos"].map((name) => <article key={name} className="rounded-2xl bg-white p-6"><h3 className="font-semibold text-[#541D2B]">{name}</h3><p className="mt-3 text-sm leading-6 text-[#766D64]">Conheça alternativas e avalie possibilidades para seu objetivo.</p></article>)}
          </div>
        </div>
      </section>
      <footer className="bg-[#32131C] px-6 py-8 text-xs text-white/60"><p>As condições dependem das instituições responsáveis e da análise de cada operação.</p><a href="/acesso-vendedor" className="mt-5 inline-block text-white/40 hover:text-white/80">Acesso do Vendedor</a></footer>
    </main>
  );
}
