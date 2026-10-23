import React, { useState } from 'react';
import {
  Calendar,
  Sparkles,
  CheckCircle2,
  Clock,
  Sliders,
  Film,
  ShoppingBag,
  Zap,
  Trash2,
  Copy
} from 'lucide-react';
import { BrandDNA, GeneratedAsset, YerbazoProduct } from '../types/holo';
import { createAssetForProduct, formatArs } from '../services/yerbazoHoloEngine';

interface SmartCalendarAndCatalogProps {
  assets: GeneratedAsset[];
  products: YerbazoProduct[];
  dna: BrandDNA;
  onUpdateAsset: (asset: GeneratedAsset) => void;
  onDeleteAsset: (id: string) => void;
  onAddMultipleAssets: (newAssets: GeneratedAsset[]) => void;
  onOpenInVisualStudio: (asset: GeneratedAsset) => void;
  onOpenInReelStudio: (asset: GeneratedAsset) => void;
}

export const SmartCalendarAndCatalog: React.FC<SmartCalendarAndCatalogProps> = ({
  assets,
  products,
  dna,
  onUpdateAsset,
  onDeleteAsset,
  onAddMultipleAssets,
  onOpenInVisualStudio,
  onOpenInReelStudio
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleAutoFillWeek = () => {
    const formats: GeneratedAsset['type'][] = [
      'historia_9_16',
      'reel_ugc',
      'post_feed',
      'meta_ad',
      'carrusel_5x',
      'whatsapp_funnel',
      'reel_ugc'
    ];
    const generatedWeek: GeneratedAsset[] = formats.map((fmt, dayIdx) => {
      const prod = products[dayIdx % products.length];
      const asset = createAssetForProduct(
        prod,
        dna,
        fmt,
        prod.isSale || prod.stockStatus === 'ultimas' ? 'urgencia_oferta' : 'estrellas',
        undefined,
        dayIdx
      );
      asset.status = 'aprobado';
      return asset;
    });

    onAddMultipleAssets(generatedWeek);
  };

  const handleLaunch360ForProduct = (prod: YerbazoProduct) => {
    const pack: GeneratedAsset[] = [
      createAssetForProduct(prod, dna, 'historia_9_16', 'urgencia_oferta', undefined, 0),
      createAssetForProduct(prod, dna, 'reel_ugc', 'estrellas', undefined, 1),
      createAssetForProduct(prod, dna, 'post_feed', 'alto_margen', undefined, 2)
    ];
    onAddMultipleAssets(pack);
    onOpenInVisualStudio(pack[0]);
  };

  const sortedAssets = [...assets].sort((a, b) =>
    `${a.scheduledDate} ${a.scheduledTime}`.localeCompare(`${b.scheduledDate} ${b.scheduledTime}`)
  );

  return (
    <div className="space-y-8">
      {/* Section 1: Editorial Calendar Planner */}
      <div className="rounded-2xl border border-white/10 bg-[#0d2415] p-6 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#e68628]">
              Planificador Multicanal & Calendario Editorial (Estilo Predis.ai + Holo)
            </span>
            <h2 className="text-xl font-extrabold text-[#ece7d7]">
              Agenda de Publicaciones, Reels, Historias y Campañas ({assets.length} piezas)
            </h2>
          </div>

          <button
            onClick={handleAutoFillWeek}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#e68628] hover:bg-[#f39c42] text-white text-xs font-extrabold shadow-lg transition"
          >
            <Sparkles className="w-4 h-4" />
            Autocompletar Semana Perfecta (7 Días IA)
          </button>
        </div>

        <div className="space-y-3">
          {sortedAssets.map((asset) => {
            const prod = products.find((p) => p.id === asset.productIds[0]) || products[0];
            return (
              <div
                key={asset.id}
                className="p-4 rounded-xl bg-black/30 border border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:border-white/25 transition"
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={prod.image}
                    alt={prod.title}
                    className="w-14 h-14 rounded-xl object-contain bg-[#0f4b25]/50 p-1.5 border border-white/10 shrink-0"
                  />
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-md bg-[#0f4b25] text-[#e68628] text-[11px] font-extrabold border border-[#e68628]/30">
                        {asset.platform}
                      </span>
                      <span className="text-xs font-bold text-[#ece7d7]/70 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#e68628]" />
                        <input
                          type="date"
                          value={asset.scheduledDate}
                          onChange={(e) =>
                            onUpdateAsset({ ...asset, scheduledDate: e.target.value })
                          }
                          className="bg-transparent text-xs font-bold text-[#ece7d7] focus:outline-none"
                        />
                        • {asset.scheduledTime} hs
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-[#ece7d7]">{asset.title}</h4>
                    <p className="text-xs text-[#ece7d7]/70 line-clamp-1">{asset.copy.hook}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => onOpenInVisualStudio(asset)}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-[#ece7d7] flex items-center gap-1"
                  >
                    <Sliders className="w-3.5 h-3.5 text-[#e68628]" /> Diseño
                  </button>

                  <button
                    onClick={() => onOpenInReelStudio(asset)}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-[#ece7d7] flex items-center gap-1"
                  >
                    <Film className="w-3.5 h-3.5 text-[#e68628]" /> Reel
                  </button>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${asset.copy.hook}\n\n${asset.copy.body}\n\n${asset.copy.cta}`
                      );
                      setCopiedId(asset.id);
                      setTimeout(() => setCopiedId(null), 2000);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-[#ece7d7] flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5 text-emerald-400" />
                    {copiedId === asset.id ? '¡Copiado!' : 'Copy'}
                  </button>

                  <button
                    onClick={() =>
                      onUpdateAsset({
                        ...asset,
                        status: asset.status === 'aprobado' ? 'publicado' : 'aprobado'
                      })
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1 ${
                      asset.status === 'publicado'
                        ? 'bg-emerald-600 text-white'
                        : asset.status === 'aprobado'
                        ? 'bg-[#e68628] text-white'
                        : 'bg-white/10 text-[#ece7d7]'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {asset.status === 'publicado'
                      ? 'Publicado'
                      : asset.status === 'aprobado'
                      ? 'Aprobado'
                      : 'Aprobar'}
                  </button>

                  <button
                    onClick={() => onDeleteAsset(asset.id)}
                    className="p-1.5 rounded-lg bg-red-950/50 hover:bg-red-900/70 text-red-300"
                    title="Eliminar de la agenda"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Live Yerbazo Product Matrix with 1-Click 360° Campaign Launcher */}
      <div className="rounded-2xl border border-white/10 bg-[#0d2415] p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#e68628]">
              Catálogo Sincronizado con yerbazo.com.ar + Inteligencia Comercial
            </span>
            <h3 className="text-lg font-extrabold text-[#ece7d7]">
              Lanzador Rápido de Campañas 360° por Producto (Post + Historia + Reel en 1 Clic)
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((prod) => {
            const effectivePrice =
              prod.isSale && prod.salePrice ? prod.salePrice : prod.price;
            return (
              <div
                key={prod.id}
                className="rounded-xl bg-black/30 border border-white/10 p-4 flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={prod.image}
                    alt={prod.title}
                    className="w-16 h-16 rounded-xl object-contain bg-[#0f4b25]/40 p-1.5 border border-white/10 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-[#e68628]/20 text-[#e68628]">
                        {prod.badge}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-400">
                        Margen {prod.margenPorc}%
                      </span>
                    </div>
                    <h4 className="font-extrabold text-sm text-[#ece7d7] truncate mt-1">
                      {prod.title}
                    </h4>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-base font-black text-[#ece7d7]">
                        {formatArs(effectivePrice)}
                      </span>
                      {prod.isSale && (
                        <span className="text-xs line-through text-[#ece7d7]/50">
                          {formatArs(prod.price)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[#ece7d7]/75 line-clamp-2">{prod.razonEstrategica}</p>

                <button
                  onClick={() => handleLaunch360ForProduct(prod)}
                  className="w-full py-2 px-3 rounded-xl bg-[#0f4b25] hover:bg-[#e68628] border border-[#e68628]/40 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Zap className="w-3.5 h-3.5" />
                  Lanzar Pack 360° (Post + Story + Reel)
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
