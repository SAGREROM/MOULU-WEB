import { ArrowUpRight, CheckCircle2, MessageCircle, Package, Sparkles } from 'lucide-react';
import type { CateringConfig, WholesaleConfig } from '../types/site';
import { Reveal } from './Reveal';

interface ServicesSectionsProps {
  catering: CateringConfig;
  mayoreo: WholesaleConfig;
  whatsappNumber: string;
}

function buildWhatsAppUrl(phone: string, text: string): string {
  const digits = phone.replace(/\D/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export function ServicesSections({
  catering,
  mayoreo,
  whatsappNumber,
}: ServicesSectionsProps) {
  return (
    <>
      {/* Venta a Mayoreo — Bold Split Editorial Block (creto.mx style) */}
      <section id="mayoreo" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="overflow-hidden rounded-3xl bg-[#1A1714] text-[#F9F6F1]">
          <div className="grid lg:grid-cols-12">
            <div className="relative min-h-[300px] overflow-hidden lg:col-span-5">
              <img
                src={mayoreo.image}
                alt={mayoreo.title}
                className="h-full w-full object-cover"
                style={{
                  objectPosition: mayoreo.imagePosition || '50% 50%',
                  transform: `scale(${mayoreo.imageZoom ?? 1})`,
                  transformOrigin: mayoreo.imagePosition || '50% 50%',
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1714]/60 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#1A1714]/40" />
            </div>

            <div className="p-8 sm:p-12 lg:col-span-7">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-[#E0A97E]">
                <Package className="h-3.5 w-3.5" />
                Mayoreo & Negocios
              </span>
              <h2 className="font-display mt-3 text-4xl font-semibold leading-tight sm:text-5xl">
                {mayoreo.title}
              </h2>
              <p className="mt-2 text-base font-medium text-[#D8CEC0]">
                {mayoreo.subtitle}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-[#C4B7A6]">
                {mayoreo.description}
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {mayoreo.products.map((prod) => (
                  <div
                    key={prod.id}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#E0A97E]">
                      {prod.minOrder}
                    </span>
                    <h3 className="font-display mt-1 text-xl font-semibold text-white">
                      {prod.name}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-[#C4B7A6]">
                      {prod.description}
                    </p>
                  </div>
                ))}
              </div>

              <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                {mayoreo.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-[#EFE7DA]">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#E0A97E]" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <a
                href={buildWhatsAppUrl(
                  whatsappNumber,
                  '¡Hola Moulú! Me gustaría recibir información sobre Venta a Mayoreo.'
                )}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#F9F6F1] px-7 py-3.5 text-sm font-semibold text-[#1A1714] transition hover:bg-[#E0A97E]"
              >
                {mayoreo.ctaText}
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Catering Section — Split Visual + Packages */}
      <section id="catering" className="border-y border-[#E5DDD0] bg-[#F2ECE2] py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-[#C67D4E]">
                <Sparkles className="h-3.5 w-3.5" />
                Eventos & Barra Móvil
              </span>
              <h2 className="font-display mt-3 text-4xl font-semibold text-[#1A1714] sm:text-5xl">
                {catering.title}
              </h2>
              <p className="mt-2 text-lg font-medium text-[#5C4D40]">
                {catering.subtitle}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-[#6B5B4D]">
                {catering.description}
              </p>

              <ul className="mt-6 space-y-2">
                {catering.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-[#3E3228]">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#C67D4E]" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              <a
                href={buildWhatsAppUrl(
                  whatsappNumber,
                  '¡Hola Moulú! Me interesa cotizar su servicio de Catering / Barra Móvil.'
                )}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#1A1714] px-7 py-3.5 text-sm font-medium text-[#F9F6F1] transition hover:bg-[#C67D4E]"
              >
                <MessageCircle className="h-4 w-4" />
                {catering.ctaText}
              </a>
            </div>

            <div className="lg:col-span-6">
              <div className="overflow-hidden rounded-3xl border border-[#DFD4C3] bg-white shadow-xs">
                <div className="h-60 w-full overflow-hidden">
                  <img
                    src={catering.image}
                    alt={catering.title}
                    className="h-full w-full object-cover"
                    style={{
                      objectPosition: catering.imagePosition || '50% 50%',
                      transform: `scale(${catering.imageZoom ?? 1})`,
                      transformOrigin: catering.imagePosition || '50% 50%',
                    }}
                  />
                </div>
                <div className="divide-y divide-[#EFE7DA] p-6">
                  {catering.packages.map((pkg) => (
                    <div key={pkg.id} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <div>
                          <h3 className="font-display text-2xl font-semibold text-[#1A1714]">
                            {pkg.name}
                          </h3>
                          <span className="text-xs font-medium uppercase tracking-wider text-[#8C7A68]">
                            {pkg.people}
                          </span>
                        </div>
                        <span className="rounded-full bg-[#F9F6F1] px-3.5 py-1 text-xs font-semibold text-[#9E592E] border border-[#E7DFD3]">
                          {pkg.price}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-[#6B5B4D]">
                        {pkg.details}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
