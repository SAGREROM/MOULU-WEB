import { useState } from 'react';
import { Coffee, Croissant, EggFried, UtensilsCrossed } from 'lucide-react';
import type { MenuItem, MenuSectionKey } from '../types/site';
import { Reveal } from './Reveal';

interface MenuSectionProps {
  menu: Record<MenuSectionKey, MenuItem[]>;
  activeTab?: MenuSectionKey;
  onTabChange?: (tab: MenuSectionKey) => void;
}

const TABS: { key: MenuSectionKey; label: string; subtitle: string; icon: typeof Coffee }[] = [
  {
    key: 'bebidas',
    label: 'Bebidas',
    subtitle: 'Espresso de especialidad, bebidas de la casa y matcha ceremonial',
    icon: Coffee,
  },
  {
    key: 'brunch',
    label: 'Brunch',
    subtitle: 'Chilaquiles, tostadas y sándwiches de desayuno al momento',
    icon: EggFried,
  },
  {
    key: 'comida',
    label: 'Comida',
    subtitle: 'Sándwiches artesanales, paninis y ensaladas frescas',
    icon: UtensilsCrossed,
  },
  {
    key: 'panaderia',
    label: 'Panadería',
    subtitle: 'Galletas horneadas, croissants de mantequilla y pan dulce del día',
    icon: Croissant,
  },
];

export function MenuSection({
  menu,
  activeTab: controlledTab,
  onTabChange,
}: MenuSectionProps) {
  const [internalTab, setInternalTab] = useState<MenuSectionKey>('bebidas');
  const activeTab = controlledTab ?? internalTab;
  const setActiveTab = (tab: MenuSectionKey) => {
    setInternalTab(tab);
    onTabChange?.(tab);
  };
  const currentItems = menu[activeTab] || [];
  const currentTabInfo = TABS.find((t) => t.key === activeTab)!;

  // Group items by category preserving insertion order
  const grouped = currentItems.reduce<Record<string, MenuItem[]>>((acc, item) => {
    const cat = item.category?.trim() || 'Especialidades';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  return (
    <section id="menu" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#C67D4E]">
            Nuestro Menú
          </span>
          <h2 className="font-display mt-2 text-4xl font-semibold text-[#231B15] sm:text-5xl">
            Barra, cocina & horno
          </h2>
        </div>
        <p className="max-w-md text-sm text-[#6B5B4D]">
          {currentTabInfo.subtitle}. Contamos con opciones de leche de soya, almendra y avena.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="mb-10 flex flex-wrap gap-2.5">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition cursor-pointer ${
                isActive
                  ? 'bg-[#231B15] text-[#FAF6F0] shadow-sm'
                  : 'border border-[#E2D9CB] bg-white/70 text-[#4A3D33] hover:border-[#C67D4E] hover:text-[#231B15]'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Grouped Items */}
      <div className="space-y-10">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category}>
            <div className="mb-4 flex items-center gap-3">
              <h3 className="font-display text-2xl font-semibold text-[#231B15]">
                {category}
              </h3>
              <div className="h-px flex-1 bg-[#E5DDD0]" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {items.map((item, idx) => {
                const pos = item.imagePosition || '50% 50%';
                const zoom = item.imageZoom ?? 1;
                return (
                  <Reveal key={item.id} delayMs={Math.min(idx * 45, 220)}>
                    <article
                      className={`group flex h-full items-stretch gap-4 overflow-hidden rounded-2xl border p-4 transition duration-300 ${
                        item.available
                          ? 'border-[#E7DFD3] bg-white/85 hover:-translate-y-0.5 hover:border-[#C67D4E]/60 hover:shadow-md'
                          : 'border-[#E7DFD3]/70 bg-[#F3ECE1]/60 opacity-65'
                      }`}
                    >
                      {item.image && (
                        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#F2ECE2]">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            style={{
                              objectPosition: pos,
                              transform: `scale(${zoom})`,
                              transformOrigin: pos,
                            }}
                          />
                        </div>
                      )}

                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-base font-semibold text-[#231B15]">
                                {item.name}
                              </h4>
                              {item.tag && (
                                <span className="rounded-full bg-[#C67D4E]/15 px-2.5 py-0.5 text-[11px] font-semibold text-[#9E592E]">
                                  {item.tag}
                                </span>
                              )}
                              {!item.available && (
                                <span className="rounded-full bg-[#231B15]/10 px-2.5 py-0.5 text-[11px] font-medium text-[#5C4D40]">
                                  Agotado hoy
                                </span>
                              )}
                            </div>
                            <span className="shrink-0 text-base font-semibold text-[#231B15]">
                              {item.price}
                            </span>
                          </div>
                          {item.description && (
                            <p className="mt-1.5 text-sm leading-relaxed text-[#6B5B4D]">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

