import { CheckCircle2, MessageCircle, Package, Sparkles } from 'lucide-react';
import type { CateringConfig, WholesaleConfig } from '../types/site';

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
      {/* Catering Section */}
      <section id="catering" className="border-y border-[#E5DDD0] bg-[#F4ECE1]/70 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-5">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-[#C67D4E]">
                <Sparkles className="h-3.5 w-3.5" />
                Eventos & Barra Móvil
              </span>
              <h2 className="font-display mt-3 text-4xl font-semibold text-[#231B15] sm:text-5xl">
                {catering.title}
              </h2>
              <p className="mt-2 text-lg font-medium text-[#5C4D40]">
                {catering.subtitle}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-[#6B5B4D]">
                {catering.description}
              </p>

              <ul className="mt-6 space-y-2.5">
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
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#231B15] px-6 py-3 text-sm font-medium text-[#FAF6F0] transition hover:bg-[#C67D4E]"
              >
                <MessageCircle className="h-4 w-4" />
                {catering.ctaText}
              </a>
            </div>

            <div className="grid gap-4 sm:grid-cols-1 lg:col-span-7">
              {catering.packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="rounded-2xl border border-[#E2D8CA] bg-white/90 p-6 shadow-xs transition hover:border-[#C67D4E]/60"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div>
                      <h3 className="font-display text-2xl font-semibold text-[#231B15]">
                        {pkg.name}
                      </h3>
                      <span className="text-xs font-medium uppercase tracking-wider text-[#8C7A68]">
                        {pkg.people}
                      </span>
                    </div>
                    <span className="rounded-full bg-[#FAF6F0] px-3.5 py-1 text-sm font-semibold text-[#9E592E] border border-[#E7DFD3]">
                      {pkg.price}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-[#6B5B4D]">
                    {pkg.details}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Venta a Mayoreo Section */}
      <section id="mayoreo" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="rounded-3xl bg-[#231B15] p-8 text-[#FAF6F0] sm:p-12">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-[#E0A97E]">
                <Package className="h-3.5 w-3.5" />
                B2B & Negocios
              </span>
              <h2 className="font-display mt-3 text-4xl font-semibold sm:text-5xl">
                {mayoreo.title}
              </h2>
              <p className="mt-2 text-base font-medium text-[#D8CEC0]">
                {mayoreo.subtitle}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-[#C4B7A6]">
                {mayoreo.description}
              </p>

              <ul className="mt-6 space-y-2">
                {mayoreo.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-[#EFE7DA]">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#E0A97E]" />
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
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#C67D4E] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#B26A3D]"
              >
                <MessageCircle className="h-4 w-4" />
                {mayoreo.ctaText}
              </a>
            </div>

            <div className="grid gap-4 lg:col-span-7">
              {mayoreo.products.map((prod) => (
                <div
                  key={prod.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-display text-2xl font-semibold text-white">
                      {prod.name}
                    </h3>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-[#E0A97E]">
                      {prod.minOrder}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-[#C4B7A6]">
                    {prod.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
