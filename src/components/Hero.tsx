import { IconArrowRight } from "@tabler/icons-react";
import { Button } from "./ui/button";

interface HeroProps {
  headline: string;
  headlineAccent: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
}

export default function Hero({
  headline,
  headlineAccent,
  description,
  primaryCta,
  secondaryCta,
}: HeroProps) {
  return (
    <section className="bg-primary ring-foreground/5 overflow-hidden rounded-2xl px-8 py-16 text-center ring-1 md:px-16 md:py-24">
      <h1 className="font-heading mt-4 text-4xl leading-tight font-bold tracking-tight text-white md:text-6xl">
        {headline}
        {headlineAccent && (
          <>
            <br />
            <span className="text-brand-accent">{headlineAccent}</span>
          </>
        )}
      </h1>
      {description && (
        <p className="mx-auto mt-6 max-w-lg text-base text-white/70">
          {description}
        </p>
      )}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {primaryCta && (
          <Button size="lg" variant="accent" asChild>
            <a href="/produits">
              {primaryCta}
              <IconArrowRight data-icon="inline-end" size={16} />
            </a>
          </Button>
        )}
        {secondaryCta && (
          <Button size="lg" variant="outline" asChild>
            <a href="/contact">{secondaryCta}</a>
          </Button>
        )}
      </div>
    </section>
  );
}
