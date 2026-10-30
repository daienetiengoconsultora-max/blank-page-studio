import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Página em branco" },
      { name: "description", content: "Uma página em branco pronta para começar." },
      { property: "og:title", content: "Página em branco" },
      { property: "og:description", content: "Uma página em branco pronta para começar." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <div className="h-40 w-40 bg-green-600" aria-label="Quadrado verde" />
    </main>
  );
}
