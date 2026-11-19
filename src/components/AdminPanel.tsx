import { useState } from 'react';
import {
  ArrowLeft,
  Check,
  Download,
  Eye,
  Github,
  Lock,
  Plus,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import type {
  GalleryPhoto,
  MenuItem,
  MenuSectionKey,
  NewsItem,
  SiteData,
} from '../types/site';
import { ImageUploaderField } from './ImageUploaderField';
import {
  downloadSiteDataJson,
  loadGitHubConfig,
  publishToGitHub,
  saveGitHubConfig,
} from '../utils/siteStore';

interface AdminPanelProps {
  draftData: SiteData;
  onUpdateDraft: (next: SiteData) => void;
  onDiscardDraft: () => void;
  onPreviewDraft: () => void;
  onCloseAdmin: () => void;
}

type AdminTab =
  | 'general'
  | 'cuadrantes'
  | 'bebidas'
  | 'brunch'
  | 'comida'
  | 'panaderia'
  | 'catering'
  | 'mayoreo'
  | 'novedades'
  | 'resena'
  | 'publicar';

const ADMIN_TABS: { key: AdminTab; label: string }[] = [
  { key: 'general', label: 'General & Contacto' },
  { key: 'cuadrantes', label: 'Cuadrantes' },
  { key: 'bebidas', label: 'Bebidas' },
  { key: 'brunch', label: 'Brunch' },
  { key: 'comida', label: 'Comida' },
  { key: 'panaderia', label: 'Panadería' },
  { key: 'catering', label: 'Catering' },
  { key: 'mayoreo', label: 'Mayoreo' },
  { key: 'novedades', label: 'Novedades' },
  { key: 'resena', label: 'Reseña & Regalo' },
  { key: 'publicar', label: 'Publicar Versión Final' },
];

export function AdminPanel({
  draftData,
  onUpdateDraft,
  onDiscardDraft,
  onPreviewDraft,
  onCloseAdmin,
}: AdminPanelProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('bebidas');

  const [ghConfig, setGhConfig] = useState(() => loadGitHubConfig());
  const [publishStatus, setPublishStatus] = useState<{
    type: 'idle' | 'loading' | 'success' | 'error';
    message?: string;
    url?: string;
  }>({ type: 'idle' });

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const expectedPin = draftData.brand.adminPin || '1234';
    if (pinInput.trim() === expectedPin) {
      setUnlocked(true);
      setPinError('');
    } else {
      setPinError('PIN incorrecto. (Por defecto es 1234 si no lo has cambiado)');
    }
  };

  if (!unlocked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF6F0] px-4">
        <div className="w-full max-w-md rounded-3xl border border-[#E5DDD0] bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#231B15] text-white">
              <Lock className="h-4 w-4" />
            </span>
            <div>
              <h1 className="font-display text-2xl font-semibold text-[#231B15]">
                Modo Editor — Moulú
              </h1>
              <p className="text-xs text-[#6B5B4D]">
                Edita tu borrador y publica la versión final para clientes
              </p>
            </div>
          </div>

          <form onSubmit={handleUnlock} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#4A3D33]">
                PIN de administrador
              </label>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Ingresa tu PIN (por defecto: 1234)"
                className="mt-1.5 w-full rounded-xl border border-[#D8CEC0] px-4 py-2.5 text-sm outline-none focus:border-[#C67D4E]"
                autoFocus
              />
              {pinError && (
                <p className="mt-1.5 text-xs text-red-600">{pinError}</p>
              )}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 rounded-full bg-[#231B15] py-2.5 text-sm font-medium text-white hover:bg-[#C67D4E] transition cursor-pointer"
              >
                Entrar al editor
              </button>
              <button
                type="button"
                onClick={onCloseAdmin}
                className="rounded-full border border-[#D8CEC0] px-4 py-2.5 text-sm font-medium text-[#4A3D33] hover:bg-[#F4ECE1] cursor-pointer"
              >
                Volver
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const updateBrand = (field: keyof SiteData['brand'], value: string) => {
    onUpdateDraft({
      ...draftData,
      brand: { ...draftData.brand, [field]: value },
    });
  };

  const updateMenuItem = (
    section: MenuSectionKey,
    id: string,
    patch: Partial<MenuItem>
  ) => {
    onUpdateDraft({
      ...draftData,
      menu: {
        ...draftData.menu,
        [section]: draftData.menu[section].map((item) =>
          item.id === id ? { ...item, ...patch } : item
        ),
      },
    });
  };

  const addMenuItem = (section: MenuSectionKey) => {
    const newItem: MenuItem = {
      id: `${section}-${Date.now()}`,
      name: 'Nuevo producto',
      category: 'Especialidades',
      price: '$0',
      description: 'Descripción del producto.',
      tag: '',
      available: true,
    };
    onUpdateDraft({
      ...draftData,
      menu: {
        ...draftData.menu,
        [section]: [newItem, ...draftData.menu[section]],
      },
    });
  };

  const removeMenuItem = (section: MenuSectionKey, id: string) => {
    onUpdateDraft({
      ...draftData,
      menu: {
        ...draftData.menu,
        [section]: draftData.menu[section].filter((item) => item.id !== id),
      },
    });
  };

  const addNewsItem = () => {
    const item: NewsItem = {
      id: `nov-${Date.now()}`,
      title: 'Nueva novedad',
      date: 'Este mes',
      badge: 'Nuevo',
      description: 'Cuéntales a tus clientes qué hay de nuevo en Moulú.',
      active: true,
    };
    onUpdateDraft({
      ...draftData,
      novedades: [item, ...draftData.novedades],
    });
  };

  const handleGitHubPublish = async () => {
    saveGitHubConfig(ghConfig);
    setPublishStatus({ type: 'loading', message: 'Publicando versión final en GitHub...' });
    try {
      const res = await publishToGitHub(draftData, ghConfig);
      setPublishStatus({
        type: 'success',
        message: '¡Versión final publicada en GitHub! Se actualizará en unos momentos.',
        url: res.commitUrl,
      });
    } catch (err) {
      setPublishStatus({
        type: 'error',
        message: err instanceof Error ? err.message : 'Error al publicar en GitHub.',
      });
    }
  };

  const isMenuTab = (t: AdminTab): t is MenuSectionKey =>
    t === 'bebidas' || t === 'brunch' || t === 'comida' || t === 'panaderia';

  return (
    <div className="min-h-screen bg-[#FAF6F0] pb-20">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 border-b border-[#E5DDD0] bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onCloseAdmin}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#D8CEC0] px-3.5 py-1.5 text-xs font-medium text-[#4A3D33] hover:bg-[#F4ECE1] cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Vista Cliente
            </button>
            <div>
              <h1 className="font-display text-xl font-semibold text-[#231B15]">
                Editor de Moulú Café
              </h1>
              <p className="text-[11px] text-[#7A6858]">
                Tus cambios se guardan automáticamente como borrador local
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onPreviewDraft}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#C67D4E] px-4 py-1.5 text-xs font-medium text-[#9E592E] hover:bg-[#C67D4E]/10 cursor-pointer"
            >
              <Eye className="h-3.5 w-3.5" />
              Previsualizar borrador
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('publicar')}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#231B15] px-4 py-1.5 text-xs font-medium text-white hover:bg-[#C67D4E] transition cursor-pointer"
            >
              <Check className="h-3.5 w-3.5" />
              Publicar versión final
            </button>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="mx-auto flex max-w-6xl gap-1.5 overflow-x-auto px-4 pb-3 sm:px-6">
          {ADMIN_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition cursor-pointer ${
                activeTab === tab.key
                  ? 'bg-[#C67D4E] text-white'
                  : 'bg-[#F4ECE1] text-[#4A3D33] hover:bg-[#E7DFD3]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto mt-8 max-w-5xl px-4 sm:px-6">
        {/* General & Brand */}
        {activeTab === 'general' && (
          <div className="space-y-5 rounded-2xl border border-[#E5DDD0] bg-white p-6">
            <h2 className="font-display text-2xl font-semibold text-[#231B15]">
              Información General & Contacto
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Nombre de la cafetería"
                value={draftData.brand.name}
                onChange={(v) => updateBrand('name', v)}
              />
              <Field
                label="Badge superior (Hero)"
                value={draftData.brand.heroBadge}
                onChange={(v) => updateBrand('heroBadge', v)}
              />
              <Field
                label="Título principal (Hero)"
                value={draftData.brand.heroTitle}
                onChange={(v) => updateBrand('heroTitle', v)}
                full
              />
              <TextAreaField
                label="Subtítulo principal (Hero)"
                value={draftData.brand.heroSubtitle}
                onChange={(v) => updateBrand('heroSubtitle', v)}
                full
              />
              <Field
                label="Dirección"
                value={draftData.brand.address}
                onChange={(v) => updateBrand('address', v)}
              />
              <Field
                label="Ciudad"
                value={draftData.brand.city}
                onChange={(v) => updateBrand('city', v)}
              />
              <Field
                label="Horarios"
                value={draftData.brand.hours}
                onChange={(v) => updateBrand('hours', v)}
                full
              />
              <Field
                label="Usuario Instagram"
                value={draftData.brand.instagramHandle}
                onChange={(v) => updateBrand('instagramHandle', v)}
              />
              <Field
                label="URL Instagram"
                value={draftData.brand.instagramUrl}
                onChange={(v) => updateBrand('instagramUrl', v)}
              />
              <Field
                label="Feed automático de Instagram (URL JSON de Behold.so, opcional)"
                value={draftData.brand.instagramFeedUrl || ''}
                onChange={(v) => updateBrand('instagramFeedUrl', v)}
                placeholder="https://feeds.behold.so/..."
                full
              />
              <Field
                label="WhatsApp (con código de país, ej. 526861234567)"
                value={draftData.brand.whatsappNumber}
                onChange={(v) => updateBrand('whatsappNumber', v)}
              />
              <Field
                label="PIN de administrador"
                value={draftData.brand.adminPin}
                onChange={(v) => updateBrand('adminPin', v)}
              />
              <Field
                label="Nota Pet Friendly"
                value={draftData.brand.petFriendlyNote}
                onChange={(v) => updateBrand('petFriendlyNote', v)}
                full
              />
              <Field
                label="Texto de la cinta en movimiento (Marquee)"
                value={draftData.brand.marqueeText || ''}
                onChange={(v) => updateBrand('marqueeText', v)}
                full
              />
            </div>

            <ImageUploaderField
              label="Foto principal (Hero)"
              imageUrl={draftData.brand.heroImage || ''}
              position={draftData.brand.heroPosition}
              zoom={draftData.brand.heroZoom}
              aspectClass="h-44"
              onChange={({ imageUrl, position, zoom }) =>
                onUpdateDraft({
                  ...draftData,
                  brand: {
                    ...draftData.brand,
                    heroImage: imageUrl,
                    heroPosition: position,
                    heroZoom: zoom,
                  },
                })
              }
            />

            <div className="space-y-3 border-t border-[#EFE7DA] pt-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#231B15]">
                  Galería &ldquo;Sigue tu antojo&rdquo;
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    const current: GalleryPhoto[] =
                      draftData.brand.galleryPhotos && draftData.brand.galleryPhotos.length > 0
                        ? draftData.brand.galleryPhotos
                        : (draftData.brand.galleryImages || []).map((url, idx) => ({
                            id: `gal-${idx}`,
                            url,
                            position: '50% 50%',
                            zoom: 1,
                          }));
                    onUpdateDraft({
                      ...draftData,
                      brand: {
                        ...draftData.brand,
                        galleryPhotos: [
                          ...current,
                          {
                            id: `gal-${Date.now()}`,
                            url: '',
                            position: '50% 50%',
                            zoom: 1,
                          },
                        ],
                      },
                    });
                  }}
                  className="inline-flex items-center gap-1 rounded-full bg-[#231B15] px-3 py-1.5 text-xs text-white cursor-pointer"
                >
                  <Plus className="h-3 w-3" /> Agregar foto
                </button>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {(draftData.brand.galleryPhotos && draftData.brand.galleryPhotos.length > 0
                  ? draftData.brand.galleryPhotos
                  : (draftData.brand.galleryImages || []).map((url, idx) => ({
                      id: `gal-${idx}`,
                      url,
                      position: '50% 50%',
                      zoom: 1,
                    }))
                ).map((photo, idx, arr) => (
                  <div key={photo.id} className="space-y-2">
                    <ImageUploaderField
                      label={`Foto galería #${idx + 1}`}
                      imageUrl={photo.url}
                      position={photo.position}
                      zoom={photo.zoom}
                      aspectClass="h-36"
                      onChange={({ imageUrl, position, zoom }) => {
                        const updated = arr.map((p) =>
                          p.id === photo.id ? { ...p, url: imageUrl, position, zoom } : p
                        );
                        onUpdateDraft({
                          ...draftData,
                          brand: {
                            ...draftData.brand,
                            galleryPhotos: updated,
                            galleryImages: updated.map((p) => p.url).filter(Boolean),
                          },
                        });
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = arr.filter((p) => p.id !== photo.id);
                        onUpdateDraft({
                          ...draftData,
                          brand: {
                            ...draftData.brand,
                            galleryPhotos: updated,
                            galleryImages: updated.map((p) => p.url).filter(Boolean),
                          },
                        });
                      }}
                      className="inline-flex items-center gap-1 text-xs text-red-600 hover:underline cursor-pointer"
                    >
                      <Trash2 className="h-3 w-3" /> Eliminar foto #{idx + 1}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Cuadrantes Editor */}
        {activeTab === 'cuadrantes' && (
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-semibold text-[#231B15]">
              Cuadrantes Principales (2x2)
            </h2>
            {(draftData.quadrants || []).map((card, idx) => (
              <div
                key={card.id}
                className="rounded-2xl border border-[#E5DDD0] bg-white p-5 space-y-3"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-[#C67D4E]">
                  Cuadrante #{idx + 1}
                </p>
                <div className="grid gap-3 sm:grid-cols-3">
                  <Field
                    label="Título"
                    value={card.title}
                    onChange={(v) =>
                      onUpdateDraft({
                        ...draftData,
                        quadrants: (draftData.quadrants || []).map((q) =>
                          q.id === card.id ? { ...q, title: v } : q
                        ),
                      })
                    }
                  />
                  <Field
                    label="Texto del botón"
                    value={card.buttonText}
                    onChange={(v) =>
                      onUpdateDraft({
                        ...draftData,
                        quadrants: (draftData.quadrants || []).map((q) =>
                          q.id === card.id ? { ...q, buttonText: v } : q
                        ),
                      })
                    }
                  />
                  <Field
                    label="Destino (#menu:bebidas, #menu:brunch, #catering...)"
                    value={card.target}
                    onChange={(v) =>
                      onUpdateDraft({
                        ...draftData,
                        quadrants: (draftData.quadrants || []).map((q) =>
                          q.id === card.id ? { ...q, target: v } : q
                        ),
                      })
                    }
                  />
                </div>
                <TextAreaField
                  label="Descripción"
                  value={card.description}
                  onChange={(v) =>
                    onUpdateDraft({
                      ...draftData,
                      quadrants: (draftData.quadrants || []).map((q) =>
                        q.id === card.id ? { ...q, description: v } : q
                      ),
                    })
                  }
                />
                <ImageUploaderField
                  label="Foto del cuadrante (subir o pegar URL + encuadre)"
                  imageUrl={card.image}
                  position={card.imagePosition}
                  zoom={card.imageZoom}
                  aspectClass="h-40"
                  onChange={({ imageUrl, position, zoom }) =>
                    onUpdateDraft({
                      ...draftData,
                      quadrants: (draftData.quadrants || []).map((q) =>
                        q.id === card.id
                          ? { ...q, image: imageUrl, imagePosition: position, imageZoom: zoom }
                          : q
                      ),
                    })
                  }
                />
              </div>
            ))}
          </div>
        )}

        {/* Menu Editor */}
        {isMenuTab(activeTab) && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-semibold capitalize text-[#231B15]">
                Menú de {activeTab === 'panaderia' ? 'Panadería' : activeTab}
              </h2>
              <button
                type="button"
                onClick={() => addMenuItem(activeTab)}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#231B15] px-4 py-2 text-xs font-medium text-white hover:bg-[#C67D4E] cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                Agregar platillo / bebida
              </button>
            </div>

            {draftData.menu[activeTab].map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-[#E5DDD0] bg-white p-5 space-y-4"
              >
                <div className="grid gap-3 sm:grid-cols-4">
                  <Field
                    label="Nombre"
                    value={item.name}
                    onChange={(v) => updateMenuItem(activeTab, item.id, { name: v })}
                  />
                  <Field
                    label="Categoría"
                    value={item.category}
                    onChange={(v) => updateMenuItem(activeTab, item.id, { category: v })}
                  />
                  <Field
                    label="Precio"
                    value={item.price}
                    onChange={(v) => updateMenuItem(activeTab, item.id, { price: v })}
                  />
                  <Field
                    label="Etiqueta (opcional)"
                    value={item.tag || ''}
                    onChange={(v) => updateMenuItem(activeTab, item.id, { tag: v })}
                  />
                </div>
                <TextAreaField
                  label="Descripción"
                  value={item.description}
                  onChange={(v) => updateMenuItem(activeTab, item.id, { description: v })}
                />
                <ImageUploaderField
                  label="Foto del platillo / bebida (opcional)"
                  imageUrl={item.image || ''}
                  position={item.imagePosition}
                  zoom={item.imageZoom}
                  aspectClass="h-32"
                  onChange={({ imageUrl, position, zoom }) =>
                    updateMenuItem(activeTab, item.id, {
                      image: imageUrl,
                      imagePosition: position,
                      imageZoom: zoom,
                    })
                  }
                />
                <div className="flex items-center justify-between pt-1">
                  <label className="inline-flex items-center gap-2 text-xs font-medium text-[#4A3D33] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.available}
                      onChange={(e) =>
                        updateMenuItem(activeTab, item.id, { available: e.target.checked })
                      }
                      className="accent-[#C67D4E]"
                    />
                    Disponible hoy
                  </label>
                  <button
                    type="button"
                    onClick={() => removeMenuItem(activeTab, item.id)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:underline cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Catering Editor */}
        {activeTab === 'catering' && (
          <div className="space-y-6 rounded-2xl border border-[#E5DDD0] bg-white p-6">
            <h2 className="font-display text-2xl font-semibold text-[#231B15]">
              Servicio de Catering
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Título"
                value={draftData.catering.title}
                onChange={(v) =>
                  onUpdateDraft({
                    ...draftData,
                    catering: { ...draftData.catering, title: v },
                  })
                }
              />
              <Field
                label="Subtítulo"
                value={draftData.catering.subtitle}
                onChange={(v) =>
                  onUpdateDraft({
                    ...draftData,
                    catering: { ...draftData.catering, subtitle: v },
                  })
                }
              />
              <TextAreaField
                label="Descripción"
                value={draftData.catering.description}
                onChange={(v) =>
                  onUpdateDraft({
                    ...draftData,
                    catering: { ...draftData.catering, description: v },
                  })
                }
                full
              />
              <Field
                label="Texto del botón WhatsApp"
                value={draftData.catering.ctaText}
                onChange={(v) =>
                  onUpdateDraft({
                    ...draftData,
                    catering: { ...draftData.catering, ctaText: v },
                  })
                }
                full
              />
            </div>

            <ImageUploaderField
              label="Foto de Catering (subir o pegar URL + encuadre)"
              imageUrl={draftData.catering.image || ''}
              position={draftData.catering.imagePosition}
              zoom={draftData.catering.imageZoom}
              aspectClass="h-44"
              onChange={({ imageUrl, position, zoom }) =>
                onUpdateDraft({
                  ...draftData,
                  catering: {
                    ...draftData.catering,
                    image: imageUrl,
                    imagePosition: position,
                    imageZoom: zoom,
                  },
                })
              }
            />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#231B15]">Paquetes</h3>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateDraft({
                      ...draftData,
                      catering: {
                        ...draftData.catering,
                        packages: [
                          ...draftData.catering.packages,
                          {
                            id: `cat-${Date.now()}`,
                            name: 'Nuevo Paquete',
                            people: '20 personas',
                            price: 'Desde $0 MXN',
                            details: 'Detalles del paquete.',
                          },
                        ],
                      },
                    })
                  }
                  className="inline-flex items-center gap-1 rounded-full bg-[#231B15] px-3 py-1.5 text-xs text-white cursor-pointer"
                >
                  <Plus className="h-3 w-3" /> Agregar paquete
                </button>
              </div>
              {draftData.catering.packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="rounded-xl border border-[#E5DDD0] bg-[#FAF6F0]/60 p-4 space-y-3"
                >
                  <div className="grid gap-3 sm:grid-cols-3">
                    <Field
                      label="Nombre"
                      value={pkg.name}
                      onChange={(v) =>
                        onUpdateDraft({
                          ...draftData,
                          catering: {
                            ...draftData.catering,
                            packages: draftData.catering.packages.map((p) =>
                              p.id === pkg.id ? { ...p, name: v } : p
                            ),
                          },
                        })
                      }
                    />
                    <Field
                      label="Capacidad"
                      value={pkg.people}
                      onChange={(v) =>
                        onUpdateDraft({
                          ...draftData,
                          catering: {
                            ...draftData.catering,
                            packages: draftData.catering.packages.map((p) =>
                              p.id === pkg.id ? { ...p, people: v } : p
                            ),
                          },
                        })
                      }
                    />
                    <Field
                      label="Precio"
                      value={pkg.price}
                      onChange={(v) =>
                        onUpdateDraft({
                          ...draftData,
                          catering: {
                            ...draftData.catering,
                            packages: draftData.catering.packages.map((p) =>
                              p.id === pkg.id ? { ...p, price: v } : p
                            ),
                          },
                        })
                      }
                    />
                  </div>
                  <TextAreaField
                    label="Detalles"
                    value={pkg.details}
                    onChange={(v) =>
                      onUpdateDraft({
                        ...draftData,
                        catering: {
                          ...draftData.catering,
                          packages: draftData.catering.packages.map((p) =>
                            p.id === pkg.id ? { ...p, details: v } : p
                          ),
                        },
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Wholesale Editor */}
        {activeTab === 'mayoreo' && (
          <div className="space-y-6 rounded-2xl border border-[#E5DDD0] bg-white p-6">
            <h2 className="font-display text-2xl font-semibold text-[#231B15]">
              Venta a Mayoreo
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Título"
                value={draftData.mayoreo.title}
                onChange={(v) =>
                  onUpdateDraft({
                    ...draftData,
                    mayoreo: { ...draftData.mayoreo, title: v },
                  })
                }
              />
              <Field
                label="Subtítulo"
                value={draftData.mayoreo.subtitle}
                onChange={(v) =>
                  onUpdateDraft({
                    ...draftData,
                    mayoreo: { ...draftData.mayoreo, subtitle: v },
                  })
                }
              />
              <TextAreaField
                label="Descripción"
                value={draftData.mayoreo.description}
                onChange={(v) =>
                  onUpdateDraft({
                    ...draftData,
                    mayoreo: { ...draftData.mayoreo, description: v },
                  })
                }
                full
              />
              <Field
                label="Texto del botón WhatsApp"
                value={draftData.mayoreo.ctaText}
                onChange={(v) =>
                  onUpdateDraft({
                    ...draftData,
                    mayoreo: { ...draftData.mayoreo, ctaText: v },
                  })
                }
                full
              />
            </div>

            <ImageUploaderField
              label="Foto de Mayoreo (subir o pegar URL + encuadre)"
              imageUrl={draftData.mayoreo.image || ''}
              position={draftData.mayoreo.imagePosition}
              zoom={draftData.mayoreo.imageZoom}
              aspectClass="h-44"
              onChange={({ imageUrl, position, zoom }) =>
                onUpdateDraft({
                  ...draftData,
                  mayoreo: {
                    ...draftData.mayoreo,
                    image: imageUrl,
                    imagePosition: position,
                    imageZoom: zoom,
                  },
                })
              }
            />

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-[#231B15]">
                Líneas de producto a mayoreo
              </h3>
              {draftData.mayoreo.products.map((prod) => (
                <div
                  key={prod.id}
                  className="rounded-xl border border-[#E5DDD0] bg-[#FAF6F0]/60 p-4 space-y-3"
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field
                      label="Producto"
                      value={prod.name}
                      onChange={(v) =>
                        onUpdateDraft({
                          ...draftData,
                          mayoreo: {
                            ...draftData.mayoreo,
                            products: draftData.mayoreo.products.map((p) =>
                              p.id === prod.id ? { ...p, name: v } : p
                            ),
                          },
                        })
                      }
                    />
                    <Field
                      label="Pedido mínimo"
                      value={prod.minOrder}
                      onChange={(v) =>
                        onUpdateDraft({
                          ...draftData,
                          mayoreo: {
                            ...draftData.mayoreo,
                            products: draftData.mayoreo.products.map((p) =>
                              p.id === prod.id ? { ...p, minOrder: v } : p
                            ),
                          },
                        })
                      }
                    />
                  </div>
                  <TextAreaField
                    label="Descripción"
                    value={prod.description}
                    onChange={(v) =>
                      onUpdateDraft({
                        ...draftData,
                        mayoreo: {
                          ...draftData.mayoreo,
                          products: draftData.mayoreo.products.map((p) =>
                            p.id === prod.id ? { ...p, description: v } : p
                          ),
                        },
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Novedades Editor */}
        {activeTab === 'novedades' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-semibold text-[#231B15]">
                Novedades & Anuncios
              </h2>
              <button
                type="button"
                onClick={addNewsItem}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#231B15] px-4 py-2 text-xs font-medium text-white hover:bg-[#C67D4E] cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                Agregar novedad
              </button>
            </div>

            {draftData.novedades.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-[#E5DDD0] bg-white p-5 space-y-4"
              >
                <div className="grid gap-3 sm:grid-cols-3">
                  <Field
                    label="Título"
                    value={item.title}
                    onChange={(v) =>
                      onUpdateDraft({
                        ...draftData,
                        novedades: draftData.novedades.map((n) =>
                          n.id === item.id ? { ...n, title: v } : n
                        ),
                      })
                    }
                  />
                  <Field
                    label="Fecha / Vigencia"
                    value={item.date}
                    onChange={(v) =>
                      onUpdateDraft({
                        ...draftData,
                        novedades: draftData.novedades.map((n) =>
                          n.id === item.id ? { ...n, date: v } : n
                        ),
                      })
                    }
                  />
                  <Field
                    label="Etiqueta"
                    value={item.badge}
                    onChange={(v) =>
                      onUpdateDraft({
                        ...draftData,
                        novedades: draftData.novedades.map((n) =>
                          n.id === item.id ? { ...n, badge: v } : n
                        ),
                      })
                    }
                  />
                </div>
                <TextAreaField
                  label="Descripción"
                  value={item.description}
                  onChange={(v) =>
                    onUpdateDraft({
                      ...draftData,
                      novedades: draftData.novedades.map((n) =>
                        n.id === item.id ? { ...n, description: v } : n
                      ),
                    })
                  }
                />
                <div className="flex items-center justify-between">
                  <label className="inline-flex items-center gap-2 text-xs font-medium text-[#4A3D33] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.active}
                      onChange={(e) =>
                        onUpdateDraft({
                          ...draftData,
                          novedades: draftData.novedades.map((n) =>
                            n.id === item.id ? { ...n, active: e.target.checked } : n
                          ),
                        })
                      }
                      className="accent-[#C67D4E]"
                    />
                    Visible para clientes
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateDraft({
                        ...draftData,
                        novedades: draftData.novedades.filter((n) => n.id !== item.id),
                      })
                    }
                    className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:underline cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reseña & Regalo Editor */}
        {activeTab === 'resena' && (
          <div className="space-y-5 rounded-2xl border border-[#E5DDD0] bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-semibold text-[#231B15]">
                Reseña en Google Maps & Recompensa
              </h2>
              <label className="inline-flex items-center gap-2 text-xs font-medium text-[#4A3D33] cursor-pointer">
                <input
                  type="checkbox"
                  checked={draftData.reviewReward?.enabled ?? true}
                  onChange={(e) =>
                    onUpdateDraft({
                      ...draftData,
                      reviewReward: {
                        enabled: e.target.checked,
                        title: draftData.reviewReward?.title || 'Tu reseña en Google Maps tiene regalo',
                        subtitle:
                          draftData.reviewReward?.subtitle ||
                          'Cuéntanos qué te pareció tu visita a Moulú y recibe una recompensa.',
                        rewardText:
                          draftData.reviewReward?.rewardText ||
                          '1 Galleta Chunk gratis o 10% de descuento',
                        terms:
                          draftData.reviewReward?.terms ||
                          'Válido mostrando este cupón y tu reseña en barra.',
                        googleMapsReviewUrl:
                          draftData.reviewReward?.googleMapsReviewUrl ||
                          'https://www.google.com/maps',
                        couponPrefix: draftData.reviewReward?.couponPrefix || 'MOULU',
                      },
                    })
                  }
                  className="accent-[#C67D4E]"
                />
                Sección activa
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Título"
                value={draftData.reviewReward?.title || ''}
                onChange={(v) =>
                  onUpdateDraft({
                    ...draftData,
                    reviewReward: {
                      ...(draftData.reviewReward || {
                        enabled: true,
                        title: '',
                        subtitle: '',
                        rewardText: '',
                        terms: '',
                        googleMapsReviewUrl: '',
                        couponPrefix: 'MOULU',
                      }),
                      title: v,
                    },
                  })
                }
              />
              <Field
                label="Prefijo del cupón (ej. MOULU)"
                value={draftData.reviewReward?.couponPrefix || 'MOULU'}
                onChange={(v) =>
                  onUpdateDraft({
                    ...draftData,
                    reviewReward: {
                      ...(draftData.reviewReward || {
                        enabled: true,
                        title: '',
                        subtitle: '',
                        rewardText: '',
                        terms: '',
                        googleMapsReviewUrl: '',
                        couponPrefix: 'MOULU',
                      }),
                      couponPrefix: v,
                    },
                  })
                }
              />
              <TextAreaField
                label="Subtítulo"
                value={draftData.reviewReward?.subtitle || ''}
                onChange={(v) =>
                  onUpdateDraft({
                    ...draftData,
                    reviewReward: {
                      ...(draftData.reviewReward || {
                        enabled: true,
                        title: '',
                        subtitle: '',
                        rewardText: '',
                        terms: '',
                        googleMapsReviewUrl: '',
                        couponPrefix: 'MOULU',
                      }),
                      subtitle: v,
                    },
                  })
                }
                full
              />
              <Field
                label="Regalo o descuento (ej. 1 Galleta gratis o 10% OFF)"
                value={draftData.reviewReward?.rewardText || ''}
                onChange={(v) =>
                  onUpdateDraft({
                    ...draftData,
                    reviewReward: {
                      ...(draftData.reviewReward || {
                        enabled: true,
                        title: '',
                        subtitle: '',
                        rewardText: '',
                        terms: '',
                        googleMapsReviewUrl: '',
                        couponPrefix: 'MOULU',
                      }),
                      rewardText: v,
                    },
                  })
                }
                full
              />
              <Field
                label="Enlace directo de reseñas en Google Maps"
                value={draftData.reviewReward?.googleMapsReviewUrl || ''}
                onChange={(v) =>
                  onUpdateDraft({
                    ...draftData,
                    reviewReward: {
                      ...(draftData.reviewReward || {
                        enabled: true,
                        title: '',
                        subtitle: '',
                        rewardText: '',
                        terms: '',
                        googleMapsReviewUrl: '',
                        couponPrefix: 'MOULU',
                      }),
                      googleMapsReviewUrl: v,
                    },
                  })
                }
                full
              />
              <TextAreaField
                label="Términos y condiciones del cupón"
                value={draftData.reviewReward?.terms || ''}
                onChange={(v) =>
                  onUpdateDraft({
                    ...draftData,
                    reviewReward: {
                      ...(draftData.reviewReward || {
                        enabled: true,
                        title: '',
                        subtitle: '',
                        rewardText: '',
                        terms: '',
                        googleMapsReviewUrl: '',
                        couponPrefix: 'MOULU',
                      }),
                      terms: v,
                    },
                  })
                }
                full
              />
            </div>
          </div>
        )}

        {/* Publish Final Version */}
        {activeTab === 'publicar' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-[#E5DDD0] bg-white p-6">
              <h2 className="font-display text-2xl font-semibold text-[#231B15]">
                Establecer Versión Final para el Cliente
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#6B5B4D]">
                Mientras editas, tus cambios viven solo en tu navegador como borrador. Los
                clientes que visitan la página ven únicamente el archivo publicado{' '}
                <code className="rounded bg-[#F4ECE1] px-1.5 py-0.5 text-xs">
                  public/data/siteData.json
                </code>
                .
              </p>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                {/* Option 1: Direct GitHub Publish */}
                <div className="rounded-2xl border border-[#E5DDD0] bg-[#FAF6F0]/60 p-5 space-y-3">
                  <div className="flex items-center gap-2 font-semibold text-[#231B15]">
                    <Github className="h-5 w-5 text-[#C67D4E]" />
                    <span>Opción 1: Publicar directo en GitHub</span>
                  </div>
                  <p className="text-xs text-[#6B5B4D]">
                    Actualiza <code className="font-mono">public/data/siteData.json</code>{' '}
                    en tu repositorio con un clic (tu token se guarda solo en tu navegador).
                  </p>
                  <Field
                    label="Repositorio (usuario/repo)"
                    value={ghConfig.repo}
                    onChange={(v) => setGhConfig({ ...ghConfig, repo: v })}
                    placeholder="tu-usuario/moulu-cafe"
                  />
                  <Field
                    label="Rama (branch)"
                    value={ghConfig.branch}
                    onChange={(v) => setGhConfig({ ...ghConfig, branch: v })}
                    placeholder="main"
                  />
                  <Field
                    label="GitHub Personal Access Token"
                    type="password"
                    value={ghConfig.token}
                    onChange={(v) => setGhConfig({ ...ghConfig, token: v })}
                    placeholder="ghp_..."
                  />
                  <button
                    type="button"
                    onClick={handleGitHubPublish}
                    disabled={publishStatus.type === 'loading'}
                    className="w-full rounded-full bg-[#231B15] py-2.5 text-xs font-medium text-white hover:bg-[#C67D4E] transition cursor-pointer disabled:opacity-60"
                  >
                    {publishStatus.type === 'loading'
                      ? 'Publicando...'
                      : 'Publicar versión final en GitHub'}
                  </button>
                  {publishStatus.type !== 'idle' && (
                    <p
                      className={`text-xs ${
                        publishStatus.type === 'error'
                          ? 'text-red-600'
                          : 'text-emerald-700'
                      }`}
                    >
                      {publishStatus.message}{' '}
                      {publishStatus.url && (
                        <a
                          href={publishStatus.url}
                          target="_blank"
                          rel="noreferrer"
                          className="underline"
                        >
                          Ver commit
                        </a>
                      )}
                    </p>
                  )}
                </div>

                {/* Option 2: Download JSON */}
                <div className="flex flex-col justify-between rounded-2xl border border-[#E5DDD0] bg-[#FAF6F0]/60 p-5 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 font-semibold text-[#231B15]">
                      <Download className="h-5 w-5 text-[#C67D4E]" />
                      <span>Opción 2: Descargar archivo final</span>
                    </div>
                    <p className="text-xs leading-relaxed text-[#6B5B4D]">
                      Descarga el archivo <code className="font-mono">siteData.json</code>{' '}
                      listo y reemplázalo en la carpeta{' '}
                      <code className="font-mono">public/data/</code> de tu proyecto en
                      GitHub.
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    <button
                      type="button"
                      onClick={() => downloadSiteDataJson(draftData)}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#C67D4E] py-2.5 text-xs font-medium text-white hover:bg-[#B26A3D] transition cursor-pointer"
                    >
                      <Download className="h-4 w-4" />
                      Descargar siteData.json final
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (
                          window.confirm(
                            '¿Descartar tu borrador local y volver a la versión publicada actual?'
                          )
                        ) {
                          onDiscardDraft();
                        }
                      }}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#D8CEC0] py-2.5 text-xs font-medium text-[#5C4D40] hover:bg-white cursor-pointer"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Descartar borrador local
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  full = false,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: string;
  full?: boolean;
}) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <label className="block text-xs font-medium text-[#5C4D40]">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-[#D8CEC0] bg-white px-3.5 py-2 text-sm text-[#231B15] outline-none focus:border-[#C67D4E]"
      />
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  full = false,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  full?: boolean;
}) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <label className="block text-xs font-medium text-[#5C4D40]">{label}</label>
      <textarea
        rows={2}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-[#D8CEC0] bg-white px-3.5 py-2 text-sm text-[#231B15] outline-none focus:border-[#C67D4E]"
      />
    </div>
  );
}

