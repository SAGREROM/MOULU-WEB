import { useState } from 'react';
import { Check, CheckCircle2, ExternalLink, Gift, ShieldCheck } from 'lucide-react';
import type { ReviewRewardConfig } from '../types/site';
import { Reveal } from './Reveal';

interface ReviewRewardSectionProps {
  config?: ReviewRewardConfig;
}

interface SavedCoupon {
  code: string;
  name: string;
  googleEmail: string;
  createdAt: string;
  redeemed?: boolean;
  redeemedAt?: string;
}

const COUPON_STORAGE_KEY = 'moulu_review_coupon_v1';
const USED_EMAILS_KEY = 'moulu_review_emails_v1';

function generateCouponCodeForEmail(prefix: string, email: string): string {
  const cleanPrefix = (prefix || 'MOULU')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 8);
  const normalized = email.trim().toLowerCase();
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = (hash * 31 + normalized.charCodeAt(i)) >>> 0;
  }
  const codePart = hash.toString(36).toUpperCase().padStart(5, '0').slice(0, 5);
  return `${cleanPrefix}-${codePart}`;
}

export function ReviewRewardSection({ config }: ReviewRewardSectionProps) {
  const [customerName, setCustomerName] = useState('');
  const [googleEmail, setGoogleEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [openedMaps, setOpenedMaps] = useState(false);
  const [confirmedPublished, setConfirmedPublished] = useState(false);
  const [coupon, setCoupon] = useState<SavedCoupon | null>(() => {
    try {
      const raw = localStorage.getItem(COUPON_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as SavedCoupon) : null;
    } catch {
      return null;
    }
  });

  if (!config || !config.enabled) return null;

  const handleClaimCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = googleEmail.trim().toLowerCase();
    if (!customerName.trim() || !cleanEmail.includes('@') || !openedMaps || !confirmedPublished) {
      setEmailError('Ingresa un correo de Google válido.');
      return;
    }
    try {
      const usedRaw = localStorage.getItem(USED_EMAILS_KEY);
      const usedList: string[] = usedRaw ? (JSON.parse(usedRaw) as string[]) : [];
      if (usedList.includes(cleanEmail)) {
        setEmailError('Esta cuenta de Google ya generó su cupón en este dispositivo.');
        return;
      }
      localStorage.setItem(USED_EMAILS_KEY, JSON.stringify([...usedList, cleanEmail]));
    } catch {
      // Ignore storage read errors
    }

    setEmailError('');
    const nextCoupon: SavedCoupon = {
      code: generateCouponCodeForEmail(config.couponPrefix, cleanEmail),
      name: customerName.trim(),
      googleEmail: cleanEmail,
      createdAt: new Date().toLocaleDateString('es-MX'),
      redeemed: false,
    };
    localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(nextCoupon));
    setCoupon(nextCoupon);
  };

  const handleRedeemInStore = () => {
    if (!coupon || coupon.redeemed) return;
    if (
      !window.confirm(
        'Solo presionar frente al barista/cajero al momento de entregar tu regalo. ¿Marcar cupón como CANJEADO?'
      )
    ) {
      return;
    }
    const updated: SavedCoupon = {
      ...coupon,
      redeemed: true,
      redeemedAt: new Date().toLocaleString('es-MX'),
    };
    localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(updated));
    setCoupon(updated);
  };

  return (
    <section id="resena" className="border-t border-[#E5DDD0] bg-[#FAF6F0] py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Reveal>
          <div className="overflow-hidden rounded-3xl border border-[#DFD4C3] bg-white shadow-xs">
            <div className="grid lg:grid-cols-12">
              {/* Left info */}
              <div className="flex flex-col justify-between bg-[#B55E2E] p-8 text-white sm:p-10 lg:col-span-5">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                    <Gift className="h-3.5 w-3.5" />
                    Recompensa Moulú
                  </span>
                  <h2 className="font-display mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
                    {config.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-white/90">
                    {config.subtitle}
                  </p>
                </div>

                <div className="mt-8 rounded-2xl bg-[#1A1714]/25 p-4 backdrop-blur-xs">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#DFBE99]">
                    Tu regalo al publicar tu reseña:
                  </p>
                  <p className="font-display mt-1 text-2xl font-semibold text-white">
                    {config.rewardText}
                  </p>
                </div>
              </div>

              {/* Right 2-step flow or coupon */}
              <div className="flex flex-col justify-center p-8 sm:p-10 lg:col-span-7">
                {coupon ? (
                  <div className="text-center">
                    <div
                      className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${
                        coupon.redeemed
                          ? 'bg-neutral-200 text-neutral-600'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {coupon.redeemed ? (
                        <CheckCircle2 className="h-6 w-6" />
                      ) : (
                        <Check className="h-6 w-6" />
                      )}
                    </div>
                    <h3 className="font-display mt-4 text-3xl font-semibold text-[#1A1714]">
                      {coupon.redeemed
                        ? `Cupón ya canjeado (${coupon.name})`
                        : `¡Gracias por tu reseña, ${coupon.name}!`}
                    </h3>
                    <p className="mt-2 text-sm text-[#6B5B4D]">
                      {coupon.redeemed
                        ? `Este beneficio fue utilizado el ${coupon.redeemedAt}. Válido 1 por persona.`
                        : 'Para hacerlo válido en barra, muestra este código Y tu reseña publicada en Google Maps:'}
                    </p>

                    <div
                      className={`mx-auto mt-5 w-full max-w-sm rounded-2xl border-2 border-dashed p-5 ${
                        coupon.redeemed
                          ? 'border-neutral-300 bg-neutral-100 opacity-70'
                          : 'border-[#C67D4E] bg-[#FAF6F0]'
                      }`}
                    >
                      <p className="text-xs font-semibold uppercase tracking-widest text-[#9E592E]">
                        {coupon.redeemed ? 'CANJEADO' : 'Código de regalo (1 por persona)'}
                      </p>
                      <p
                        className={`mt-1 font-mono text-3xl font-bold tracking-wider ${
                          coupon.redeemed ? 'line-through text-neutral-500' : 'text-[#1A1714]'
                        }`}
                      >
                        {coupon.code}
                      </p>
                      <p className="mt-2 text-sm font-medium text-[#4A3D33]">
                        {config.rewardText}
                      </p>
                      <p className="mt-1 text-[11px] text-[#8C7A68]">
                        Titular: {coupon.name} ({coupon.googleEmail}) • {coupon.createdAt}
                      </p>
                    </div>

                    {!coupon.redeemed && (
                      <div className="mt-5 flex flex-col items-center gap-2">
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-medium text-amber-800 border border-amber-200">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          El barista validará tu reseña visible en Google Maps
                        </div>
                        <button
                          type="button"
                          onClick={handleRedeemInStore}
                          className="mt-1 rounded-full border border-[#231B15] px-5 py-2 text-xs font-semibold text-[#231B15] transition hover:bg-[#231B15] hover:text-white cursor-pointer"
                        >
                          Canjear en barra (presionar frente al cajero)
                        </button>
                      </div>
                    )}

                    <p className="mt-4 text-xs text-[#7A6858]">{config.terms}</p>
                  </div>
                ) : (
                  <form onSubmit={handleClaimCoupon} className="space-y-6">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#C67D4E]">
                        Paso 1 • Deja tu reseña directo en Google Maps
                      </span>
                      <p className="mt-1.5 text-sm text-[#5C4D40]">
                        Si ya tienes tu cuenta de Google abierta, se abrirá directo la ficha para publicar tu opinión:
                      </p>
                      <div className="mt-3">
                        <a
                          href={config.googleMapsReviewUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => setOpenedMaps(true)}
                          className="inline-flex items-center gap-2 rounded-full bg-[#1A1714] px-6 py-3 text-xs font-semibold text-white transition hover:bg-[#C67D4E]"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Dejar mi reseña en Google Maps
                        </a>
                      </div>
                    </div>

                    <div className="border-t border-[#EFE7DA] pt-5 space-y-3">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#C67D4E]">
                        Paso 2 • Genera tu cupón (1 por persona)
                      </span>
                      <label className="flex items-start gap-2 text-xs text-[#4A3D33] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={confirmedPublished}
                          onChange={(e) => setConfirmedPublished(e.target.checked)}
                          className="mt-0.5 accent-[#C67D4E]"
                        />
                        <span>
                          Confirmo que ya publiqué mi reseña en Google Maps y sé que deberé mostrarla en barra para validar mi regalo.
                        </span>
                      </label>
                      <div className="grid gap-2.5 sm:grid-cols-2">
                        <input
                          type="text"
                          required
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="Tu nombre (como aparece en Google)"
                          className="rounded-full border border-[#D8CEC0] px-4 py-2.5 text-sm outline-none focus:border-[#C67D4E]"
                        />
                        <input
                          type="email"
                          required
                          value={googleEmail}
                          onChange={(e) => {
                            setGoogleEmail(e.target.value);
                            setEmailError('');
                          }}
                          placeholder="Tu correo de Google (ej. @gmail.com)"
                          className="rounded-full border border-[#D8CEC0] px-4 py-2.5 text-sm outline-none focus:border-[#C67D4E]"
                        />
                      </div>
                      {emailError && (
                        <p className="text-xs text-red-600">{emailError}</p>
                      )}
                      <div>
                        <button
                          type="submit"
                          disabled={!openedMaps || !confirmedPublished}
                          className="w-full rounded-full bg-[#B55E2E] px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-[#9B4E23] disabled:opacity-45 cursor-pointer disabled:cursor-not-allowed sm:w-auto"
                        >
                          Obtener mi regalo
                        </button>
                      </div>
                      {!openedMaps && (
                        <p className="text-[11px] text-[#8C7A68]">
                          Primero abre Google Maps en el Paso 1 para desbloquear tu cupón.
                        </p>
                      )}
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
