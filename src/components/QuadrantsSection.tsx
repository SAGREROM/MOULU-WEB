import type { QuadrantCard } from '../types/site';
import { Reveal } from './Reveal';

interface QuadrantsSectionProps {
  quadrants: QuadrantCard[];
  onNavigateTarget: (target: string) => void;
}

export function QuadrantsSection({
  quadrants,
  onNavigateTarget,
}: QuadrantsSectionProps) {
  if (!quadrants || quadrants.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6">
      <div className="grid gap-6 md:grid-cols-2">
        {quadrants.map((card, idx) => {
          const pos = card.imagePosition || '50% 50%';
          const zoom = card.imageZoom ?? 1;
          return (
            <Reveal key={card.id} delayMs={idx * 70}>
              <article className="group grid min-h-[260px] overflow-hidden border border-[#E2D8CA] bg-white shadow-xs transition hover:shadow-md sm:grid-cols-2">
                <div className="relative min-h-[200px] overflow-hidden sm:min-h-full">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    style={{
                      objectPosition: pos,
                      transform: `scale(${zoom})`,
                      transformOrigin: pos,
                    }}
                  />
                </div>

                <div className="flex flex-col items-center justify-center bg-[#B55E2E] px-6 py-8 text-center text-white">
                  <h3 className="font-display text-2xl font-semibold tracking-wider uppercase sm:text-3xl">
                    {card.title}
                  </h3>
                  <p className="mt-3 max-w-xs text-xs leading-relaxed text-white/90 sm:text-sm">
                    {card.description}
                  </p>
                  <button
                    type="button"
                    onClick={() => onNavigateTarget(card.target)}
                    className="mt-6 bg-[#DFBE99] px-6 py-2.5 text-xs font-semibold text-[#231B15] transition hover:-translate-y-0.5 hover:bg-[#F4E6D4] cursor-pointer"
                  >
                    {card.buttonText}
                  </button>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
