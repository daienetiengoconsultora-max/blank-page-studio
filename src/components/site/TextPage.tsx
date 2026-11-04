import type { ReactNode } from "react";
import { PageHero, SiteLayout } from "./SiteLayout";

export function TextPage({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro?: string; children: ReactNode }) {
  return (
    <SiteLayout>
      <PageHero eyebrow={eyebrow} title={title} text={intro} />
      <section className="mx-auto max-w-3xl space-y-5 px-5 py-16 leading-7 [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-wine">{children}</section>
    </SiteLayout>
  );
}
