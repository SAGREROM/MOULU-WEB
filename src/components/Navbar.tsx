import { Coffee, Menu, X, Lock } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
  brandName: string;
  isPreviewMode: boolean;
  onExitPreview: () => void;
  onOpenAdmin: () => void;
}

const NAV_LINKS = [
  { href: '#menu', label: 'Menú' },
  { href: '#catering', label: 'Catering' },
  { href: '#mayoreo', label: 'Mayoreo' },
  { href: '#novedades', label: 'Novedades' },
  { href: '#visitanos', label: 'Visítanos' },
];

export function Navbar({
  brandName,
  isPreviewMode,
  onExitPreview,
  onOpenAdmin,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[#E5DDD0] bg-[#FAF6F0]/90 backdrop-blur-md">
      {isPreviewMode && (
        <div className="bg-[#C67D4E] px-4 py-2 text-center text-xs font-medium text-white flex flex-wrap items-center justify-center gap-3">
          <span>
            Estás viendo tu <strong>borrador local</strong>. Los clientes siguen viendo la versión final publicada.
          </span>
          <button
            type="button"
            onClick={onOpenAdmin}
            className="rounded-full bg-white/20 px-3 py-0.5 text-white hover:bg-white/30 transition cursor-pointer"
          >
            Volver al editor
          </button>
          <button
            type="button"
            onClick={onExitPreview}
            className="rounded-full bg-[#231B15] px-3 py-0.5 text-white hover:bg-[#3A2E25] transition cursor-pointer"
          >
            Ver versión cliente
          </button>
        </div>
      )}

      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        <a href="#" className="flex items-center gap-2.5 group">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#231B15] text-[#FAF6F0] transition group-hover:bg-[#C67D4E]">
            <Coffee className="h-4 w-4" />
          </span>
          <div>
            <span className="font-display text-2xl font-semibold tracking-tight text-[#231B15]">
              {brandName}
            </span>
            <span className="block text-[10px] uppercase tracking-[0.2em] text-[#7A6858]">
              Mexicali
            </span>
          </div>
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[#4A3D33] transition hover:text-[#C67D4E]"
            >
              {link.label}
            </a>
          ))}
          <button
            type="button"
            onClick={onOpenAdmin}
            title="Panel de edición para el dueño"
            className="inline-flex items-center gap-1.5 rounded-full border border-[#D8CEC0] px-3.5 py-1.5 text-xs font-medium text-[#5C4D40] transition hover:border-[#231B15] hover:text-[#231B15] cursor-pointer"
          >
            <Lock className="h-3.5 w-3.5" />
            Editar
          </button>
        </nav>

        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="rounded-lg p-2 text-[#231B15] md:hidden cursor-pointer"
          aria-label="Abrir menú"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-[#E5DDD0] bg-[#FAF6F0] px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-2 py-1.5 text-sm font-medium text-[#4A3D33] hover:bg-[#EFE7DA]"
              >
                {link.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                onOpenAdmin();
              }}
              className="mt-1 inline-flex items-center justify-center gap-1.5 rounded-full border border-[#D8CEC0] px-4 py-2 text-xs font-medium text-[#5C4D40] cursor-pointer"
            >
              <Lock className="h-3.5 w-3.5" />
              Modo Editor
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

