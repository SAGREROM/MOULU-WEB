import { useRef, useState } from 'react';
import { RotateCcw, Upload, X } from 'lucide-react';

interface ImageUploaderFieldProps {
  label: string;
  imageUrl: string;
  position?: string; // "50% 50%"
  zoom?: number; // 1 to 2
  aspectClass?: string;
  onChange: (next: { imageUrl: string; position: string; zoom: number }) => void;
}

function parsePosition(pos?: string): { x: number; y: number } {
  if (!pos) return { x: 50, y: 50 };
  const parts = pos.trim().split(/\s+/);
  const x = parseFloat(parts[0] ?? '50');
  const y = parseFloat(parts[1] ?? '50');
  return {
    x: Number.isFinite(x) ? Math.min(100, Math.max(0, x)) : 50,
    y: Number.isFinite(y) ? Math.min(100, Math.max(0, y)) : 50,
  };
}

async function compressImageToDataUrl(file: File, maxDim = 1000): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('No se pudo leer la imagen.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Formato de imagen no soportado.'));
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const width = Math.round(img.width * scale);
        const height = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Error al procesar la imagen.'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function ImageUploaderField({
  label,
  imageUrl,
  position = '50% 50%',
  zoom = 1,
  aspectClass = 'h-44',
  onChange,
}: ImageUploaderFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { x, y } = parsePosition(position);
  const safeZoom = Number.isFinite(zoom) ? Math.min(2, Math.max(1, zoom)) : 1;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const dataUrl = await compressImageToDataUrl(file, 1000);
      onChange({ imageUrl: dataUrl, position: `${x}% ${y}%`, zoom: safeZoom });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir la imagen.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const updateFraming = (nextX: number, nextY: number, nextZoom: number) => {
    onChange({
      imageUrl,
      position: `${nextX}% ${nextY}%`,
      zoom: nextZoom,
    });
  };

  return (
    <div className="rounded-xl border border-[#E5DDD0] bg-[#FAF6F0]/60 p-3.5 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-semibold text-[#4A3D33]">{label}</span>
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#231B15] px-3 py-1 text-[11px] font-medium text-white hover:bg-[#C67D4E] transition cursor-pointer disabled:opacity-50"
          >
            <Upload className="h-3 w-3" />
            {uploading ? 'Procesando...' : 'Subir foto'}
          </button>
          {imageUrl && (
            <button
              type="button"
              onClick={() => onChange({ imageUrl: '', position: '50% 50%', zoom: 1 })}
              title="Quitar imagen"
              className="inline-flex items-center gap-1 rounded-full border border-[#D8CEC0] bg-white px-2.5 py-1 text-[11px] text-[#5C4D40] hover:text-red-600 cursor-pointer"
            >
              <X className="h-3 w-3" />
              Quitar
            </button>
          )}
        </div>
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      <input
        type="text"
        value={imageUrl.startsWith('data:') ? '(Imagen subida localmente)' : imageUrl}
        onChange={(e) => {
          if (!e.target.value.startsWith('(Imagen subida')) {
            onChange({ imageUrl: e.target.value, position: `${x}% ${y}%`, zoom: safeZoom });
          }
        }}
        placeholder="O pega aquí una URL de imagen (https://...)"
        className="w-full rounded-lg border border-[#D8CEC0] bg-white px-3 py-1.5 text-xs text-[#231B15] outline-none focus:border-[#C67D4E]"
      />

      {imageUrl && (
        <div className="grid gap-3 sm:grid-cols-12 sm:items-center">
          <div className={`relative overflow-hidden rounded-xl border border-[#DFD4C3] bg-[#EFE7DA] sm:col-span-5 ${aspectClass}`}>
            <img
              src={imageUrl}
              alt="Vista previa de encuadre"
              className="h-full w-full object-cover transition-transform duration-150"
              style={{
                objectPosition: `${x}% ${y}%`,
                transform: `scale(${safeZoom})`,
                transformOrigin: `${x}% ${y}%`,
              }}
            />
          </div>

          <div className="space-y-2 sm:col-span-7">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8C7A68]">
                Encuadre & Zoom
              </span>
              <button
                type="button"
                onClick={() => updateFraming(50, 50, 1)}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-[#9E592E] hover:underline cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" />
                Centrar
              </button>
            </div>

            <label className="block text-[11px] text-[#5C4D40]">
              Horizontal (X): {Math.round(x)}%
              <input
                type="range"
                min={0}
                max={100}
                value={x}
                onChange={(e) => updateFraming(Number(e.target.value), y, safeZoom)}
                className="mt-0.5 w-full accent-[#C67D4E]"
              />
            </label>

            <label className="block text-[11px] text-[#5C4D40]">
              Vertical (Y): {Math.round(y)}%
              <input
                type="range"
                min={0}
                max={100}
                value={y}
                onChange={(e) => updateFraming(x, Number(e.target.value), safeZoom)}
                className="mt-0.5 w-full accent-[#C67D4E]"
              />
            </label>

            <label className="block text-[11px] text-[#5C4D40]">
              Zoom: {Math.round(safeZoom * 100)}%
              <input
                type="range"
                min={1}
                max={2}
                step={0.05}
                value={safeZoom}
                onChange={(e) => updateFraming(x, y, Number(e.target.value))}
                className="mt-0.5 w-full accent-[#C67D4E]"
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
}

