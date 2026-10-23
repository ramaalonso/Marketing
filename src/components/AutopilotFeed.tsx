import React, { useEffect, useRef, useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Copy,
  Download,
  Sliders,
  Film,
  Calendar,
  TrendingUp,
  Flame,
  Zap,
  RefreshCw,
  MessageCircle,
  Layers,
  Award,
  PlusCircle
} from 'lucide-react';
import {
  AssetFormatType,
  BrandDNA,
  GeneratedAsset,
  MarketingObjective,
  YerbazoProduct
} from '../types/holo';
import {
  createAssetForProduct,
  formatArs,
  generateCustomCopyWithCloudAI
} from '../services/yerbazoHoloEngine';
import { renderMarketingCanvas } from '../utils/canvasRenderer';

interface AutopilotFeedProps {
  assets: GeneratedAsset[];
  products: YerbazoProduct[];
  dna: BrandDNA;
  onUpdateAsset: (updated: GeneratedAsset) => void;
  onAddAsset: (newAsset: GeneratedAsset) => void;
  onRegenerateBatch: (objective: MarketingObjective | 'todos') => void;
  onOpenInVisualStudio: (asset: GeneratedAsset) => void;
  onOpenInReelStudio: (asset: GeneratedAsset) => void;
}

const AssetCanvasCardPreview: React.FC<{
  asset: GeneratedAsset;
  product: YerbazoProduct;
  secondaryProduct?: YerbazoProduct;
  dna: BrandDNA;
}> = ({ asset, product, secondaryProduct, dna }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !product) return;
    renderMarketingCanvas({
      canvas: canvasRef.current,
      config: asset.visualConfig,
      product,
      secondaryProduct,
      dna,
      activeSlideIndex: 0
    });
  }, [asset, product, secondaryProduct, dna]);

  const handleDownloadDirect = () => {
    if (!canvasRef.current) return;
    try {
      const link = document.createElement('a');
      link.download = `yerbazo-${product.title.toLowerCase().replace(/\s+/g, '-')}-${asset.type}.png`;
      link.href = canvasRef.current.toDataURL('image/png');
      link.click();
    } catch {
      // ignore
    }
  };

  return (
    <div className="relative group bg-black/50 rounded-xl overflow-hidden border border-white/10 flex items-center justify-center p-2">
      <canvas
        ref={canvasRef}
        className="max-h-72 w-auto rounded-lg shadow-xl object-contain transition-transform duration-300 group-hover:scale-[1.02]"
      />
      <button
        onClick={handleDownloadDirect}
        title="Descargar PNG en Alta Resolución (1080p)"
        className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition bg-[#e68628] hover:bg-[#f39c42] text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xl"
      >
        <Download className="w-3.5 h-3.5" />
        PNG 1080p
      </button>
    </div>
  );
};

export const AutopilotFeed: React.FC<AutopilotFeedProps> = ({
  assets,
  products,
  dna,
  onUpdateAsset,
  onAddAsset,
  onRegenerateBatch,
  onOpenInVisualStudio,
  onOpenInReelStudio
}) => {
  const [filterObjective, setFilterObjective] = useState<MarketingObjective | 'todos'>('todos');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Instant Custom Generator bar state
  const [selectedProdId, setSelectedProdId] = useState<number>(products[0]?.id || 1);
  const [selectedFormat, setSelectedFormat] = useState<AssetFormatType>('historia_9_16');
  const [customGoal, setCustomGoal] = useState('');
  const [isGeneratingSingle, setIsGeneratingSingle] = useState(false);

  const filteredAssets =
    filterObjective === 'todos'
      ? assets
      : assets.filter((a) => a.objective === filterObjective);

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleQuickCreate = async () => {
    const prod = products.find((p) => p.id === selectedProdId) || products[0];
    if (!prod) return;
    setIsGeneratingSingle(true);

    const newAsset = createAssetForProduct(
      prod,
      dna,
      selectedFormat,
      prod.isSale || prod.stockStatus === 'ultimas' ? 'urgencia_oferta' : 'estrellas',
      undefined,
      0
    );

    if (customGoal.trim()) {
      const cloudCopy = await generateCustomCopyWithCloudAI({
        dna,
        product: prod,
        promptGoal: customGoal.trim()
      });
      if (cloudCopy) {
        newAsset.copy.hook = cloudCopy.hook || newAsset.copy.hook;
        newAsset.copy.body = cloudCopy.body || newAsset.copy.body;
        newAsset.copy.cta = cloudCopy.cta || newAsset.copy.cta;
        newAsset.visualConfig.headline = cloudCopy.hook.slice(0, 65);
      } else {
        newAsset.visualConfig.headline = customGoal.trim().slice(0, 65);
        newAsset.copy.hook = `🔥 ${customGoal.trim()} — ${prod.title} en Yerbazo`;
      }
    }

    onAddAsset(newAsset);
    setCustomGoal('');
    setIsGeneratingSingle(false);
  };

  const objectiveFilters: { id: MarketingObjective | 'todos'; label: string; icon: string }[] = [
    { id: 'todos', label: 'Todo el Pack Diario', icon: '⚡' },
    { id: 'urgencia_oferta', label: 'Ofertas Web & Últimas Unidades', icon: '🚨' },
    { id: 'estrellas', label: 'Estrellas Top Ventas (Baldo/Canarias)', icon: '⭐' },
    { id: 'alto_margen', label: 'Maximizar Margen (>30%)', icon: '💰' },
    { id: 'liquidar_stock', label: 'Rotar Stock Inmovilizado', icon: '📦' },
    { id: 'combo_pack', label: 'Combos & Accesorios', icon: '🎁' },
    { id: 'educativo_comunidad', label: 'Viral / Educativo', icon: '🧠' }
  ];

  return (
    <div className="space-y-6">
      {/* Instant Generator Bar (Holo Prompt + Product Selector) */}
      <div className="rounded-2xl border border-[#e68628]/40 bg-gradient-to-r from-[#0f4b25] via-[#0c3b1d] to-[#0d2415] p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#e68628]">
              <Zap className="w-4 h-4" />
              Piloto Automático Multicanal (Flujo Holo IA + Datos de Stock en Vivo)
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#ece7d7] mt-0.5">
              Tus campañas del día ya están diseñadas, redactadas y listas para aprobar
            </h2>
          </div>

          <button
            onClick={() => onRegenerateBatch(filterObjective)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#ece7d7] text-xs font-bold border border-white/15 transition"
          >
            <RefreshCw className="w-4 h-4 text-[#e68628]" />
            Regenerar Lote Diario IA
          </button>
        </div>

        {/* 1-Click Custom Piece Creator */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-black/30 p-3.5 rounded-xl border border-white/10">
          <div className="md:col-span-3">
            <label className="block text-[10px] font-bold uppercase text-[#ece7d7]/60 mb-1">
              1. Elegir Producto Real
            </label>
            <select
              value={selectedProdId}
              onChange={(e) => setSelectedProdId(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg bg-[#08160d] border border-white/15 text-xs font-bold text-[#ece7d7]"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} — {formatArs(p.isSale && p.salePrice ? p.salePrice : p.price)}{' '}
                  {p.isSale ? '(OFERTA)' : p.stockStatus === 'ultimas' ? '(ÚLTIMAS)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <label className="block text-[10px] font-bold uppercase text-[#ece7d7]/60 mb-1">
              2. Formato de Pieza
            </label>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value as AssetFormatType)}
              className="w-full px-3 py-2 rounded-lg bg-[#08160d] border border-white/15 text-xs font-bold text-[#ece7d7]"
            >
              <option value="historia_9_16">📱 Historia Interactiva 9:16</option>
              <option value="post_feed">📌 Post Feed Conversión 4:5</option>
              <option value="reel_ugc">🎬 Reel / TikTok Animado 9:16</option>
              <option value="meta_ad">🎯 Anuncio Meta Ads (3 Ángulos)</option>
              <option value="carrusel_5x">📑 Carrusel Secuencial 5 Slides</option>
              <option value="whatsapp_funnel">💬 Estado + Difusión WhatsApp</option>
            </select>
          </div>

          <div className="md:col-span-4">
            <label className="block text-[10px] font-bold uppercase text-[#ece7d7]/60 mb-1">
              3. Ángulo o Promo Especial (Opcional)
            </label>
            <input
              type="text"
              value={customGoal}
              onChange={(e) => setCustomGoal(e.target.value)}
              placeholder="Ej: Promo Viernes Matero envío gratis en CABA..."
              className="w-full px-3 py-2 rounded-lg bg-[#08160d] border border-white/15 text-xs text-[#ece7d7]"
            />
          </div>

          <div className="md:col-span-2 flex items-end">
            <button
              onClick={handleQuickCreate}
              disabled={isGeneratingSingle}
              className="w-full py-2 px-3 rounded-lg bg-[#e68628] hover:bg-[#f39c42] text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-lg transition"
            >
              <PlusCircle className="w-4 h-4" />
              {isGeneratingSingle ? 'Creando...' : 'Crear Pieza IA'}
            </button>
          </div>
        </div>
      </div>

      {/* Commercial Objective Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {objectiveFilters.map((f) => {
          const active = filterObjective === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setFilterObjective(f.id)}
              className={`whitespace-nowrap px-3.5 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
                active
                  ? 'bg-[#e68628] text-white border-[#e68628] shadow-md'
                  : 'bg-[#0d2415] text-[#ece7d7]/80 border-white/10 hover:border-white/25'
              }`}
            >
              <span>{f.icon}</span>
              <span>{f.label}</span>
            </button>
          );
        })}
      </div>

      {/* Feed Grid of Generated Assets */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredAssets.map((asset) => {
          const product =
            products.find((p) => p.id === asset.productIds[0]) || products[0];
          const secondaryProduct = asset.productIds[1]
            ? products.find((p) => p.id === asset.productIds[1])
            : undefined;

          const fullCopyText = `${asset.copy.hook}\n\n${asset.copy.body}\n\n${asset.copy.cta}\n\n${asset.copy.hashtags.join(' ')}`;

          return (
            <div
              key={asset.id}
              className="rounded-2xl border border-white/10 bg-[#0d2415] overflow-hidden shadow-xl flex flex-col justify-between"
            >
              {/* Card Header */}
              <div className="p-4 bg-black/25 border-b border-white/10 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-lg bg-[#0f4b25] border border-[#e68628]/40 text-xs font-extrabold text-[#e68628]">
                    {asset.platform}
                  </span>
                  <div>
                    <h3 className="font-bold text-sm text-[#ece7d7]">{asset.title}</h3>
                    <div className="text-[11px] text-[#ece7d7]/60">
                      Programado sugerido: {asset.scheduledDate} • {asset.scheduledTime} hs
                    </div>
                  </div>
                </div>

                {/* AdCreative-style AI Conversion Score */}
                <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-500/40 px-3 py-1.5 rounded-xl">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <div className="text-right">
                    <div className="text-xs font-black text-emerald-400">
                      AI Score {asset.aiScore.overall}/100
                    </div>
                    <div className="text-[10px] text-emerald-300/80">
                      CTR est. {asset.aiScore.estimatedCtr}
                    </div>
                  </div>
                </div>
              </div>

              {/* Strategic Commercial Justification Bar */}
              <div className="px-4 py-2 bg-[#e68628]/10 border-b border-[#e68628]/20 flex items-center gap-2 text-xs text-[#ece7d7]/90">
                <TrendingUp className="w-4 h-4 text-[#e68628] shrink-0" />
                <span className="truncate">
                  <strong className="text-[#e68628]">Por qué la IA creó esto hoy:</strong>{' '}
                  {asset.strategicWhy}
                </span>
              </div>

              {/* Card Body: Visual Canvas Preview + Copywriting */}
              <div className="p-4 grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
                <div className="sm:col-span-5">
                  <AssetCanvasCardPreview
                    asset={asset}
                    product={product}
                    secondaryProduct={secondaryProduct}
                    dna={dna}
                  />
                </div>

                <div className="sm:col-span-7 space-y-3">
                  <div className="p-3 rounded-xl bg-black/30 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#e68628]">
                        Copy Persuasivo + Hashtags
                      </span>
                      <button
                        onClick={() => handleCopyText(asset.id, fullCopyText)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        {copiedId === asset.id ? '¡Copiado!' : 'Copiar Copy'}
                      </button>
                    </div>
                    <p className="text-xs font-bold text-[#ece7d7]">{asset.copy.hook}</p>
                    <p className="text-xs text-[#ece7d7]/80 whitespace-pre-line line-clamp-5 leading-relaxed">
                      {asset.copy.body}
                    </p>
                    <p className="text-xs font-semibold text-[#e68628]">{asset.copy.cta}</p>
                    <div className="text-[11px] text-emerald-400/80 truncate">
                      {asset.copy.hashtags.join(' ')}
                    </div>
                  </div>

                  {/* Quick metrics row */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-lg bg-black/25 border border-white/5">
                      <div className="text-[10px] text-[#ece7d7]/60">Precio Web</div>
                      <div className="text-xs font-black text-[#ece7d7]">
                        {formatArs(product.isSale && product.salePrice ? product.salePrice : product.price)}
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-black/25 border border-white/5">
                      <div className="text-[10px] text-[#ece7d7]/60">Margen Est.</div>
                      <div className="text-xs font-black text-emerald-400">
                        {product.margenPorc}%
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-black/25 border border-white/5">
                      <div className="text-[10px] text-[#ece7d7]/60">Cuadrante BCG</div>
                      <div className="text-xs font-black text-[#e68628]">
                        {product.bcgCategory}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-3.5 bg-black/30 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => onOpenInVisualStudio(asset)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#ece7d7] text-xs font-bold transition"
                  >
                    <Sliders className="w-3.5 h-3.5 text-[#e68628]" />
                    Editar Diseño / Carrusel
                  </button>

                  <button
                    onClick={() => onOpenInReelStudio(asset)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#ece7d7] text-xs font-bold transition"
                  >
                    <Film className="w-3.5 h-3.5 text-[#e68628]" />
                    Ver Reel 9:16 Animado
                  </button>

                  <button
                    onClick={() => handleCopyText(`${asset.id}_wa`, asset.copy.whatsappText)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-900/40 hover:bg-emerald-900/70 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    {copiedId === `${asset.id}_wa` ? '¡Texto Copiado!' : 'Copiar WhatsApp'}
                  </button>

                  <a
                    href={`https://wa.me/${dna.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(asset.copy.whatsappText)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-200 border border-emerald-400/30 text-xs font-bold transition"
                    title={`Abrir en WhatsApp (${dna.whatsappNumber})`}
                  >
                    <span>📲 Abrir WA</span>
                  </a>
                </div>

                <button
                  onClick={() =>
                    onUpdateAsset({
                      ...asset,
                      status: asset.status === 'aprobado' ? 'pendiente' : 'aprobado'
                    })
                  }
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold transition shadow-md ${
                    asset.status === 'aprobado'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#e68628] hover:bg-[#f39c42] text-white'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {asset.status === 'aprobado' ? 'Aprobado en Calendario' : 'Aprobar & Agendar'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
