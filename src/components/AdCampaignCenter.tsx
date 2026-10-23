import React, { useState } from 'react';
import {
  Target,
  Copy,
  TrendingUp,
  Award,
  Sparkles,
  ExternalLink,
  Calculator,
  CheckCircle2,
  Zap,
  Sliders,
  Users
} from 'lucide-react';
import {
  BrandDNA,
  GeneratedAsset,
  WinningAdBlueprint,
  YerbazoProduct
} from '../types/holo';
import {
  createAssetForProduct,
  formatArs,
  generateAdCampaignForProduct,
  WINNING_AD_BLUEPRINTS
} from '../services/yerbazoHoloEngine';

interface AdCampaignCenterProps {
  products: YerbazoProduct[];
  dna: BrandDNA;
  onCloneBlueprintToStudio: (asset: GeneratedAsset) => void;
}

export const AdCampaignCenter: React.FC<AdCampaignCenterProps> = ({
  products,
  dna,
  onCloneBlueprintToStudio
}) => {
  const [selectedProdId, setSelectedProdId] = useState<number>(products[0]?.id || 1);
  const [dailyBudget, setDailyBudget] = useState<number>(15000);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const currentProduct =
    products.find((p) => p.id === selectedProdId) || products[0];
  const campaign = generateAdCampaignForProduct(currentProduct, dna);

  const effectivePrice =
    currentProduct.isSale && currentProduct.salePrice
      ? currentProduct.salePrice
      : currentProduct.price;
  const unitProfit = Math.round(effectivePrice * (currentProduct.margenPorc / 100));
  const breakEvenOrdersPerDay = Math.max(1, Math.ceil(dailyBudget / Math.max(1000, unitProfit)));
  const estimatedDailyOrders = Math.max(2, Math.round((dailyBudget * 4.6) / effectivePrice));
  const estimatedMonthlyRevenue = estimatedDailyOrders * effectivePrice * 30;

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRemixBlueprint = (bp: WinningAdBlueprint) => {
    const secondProd = products.find((p) => p.id !== currentProduct.id) || products[1];
    const format =
      bp.visualStructure === 'carrusel_secuencia'
        ? 'carrusel_5x'
        : bp.recommendedFormat === '9:16'
        ? 'historia_9_16'
        : 'meta_ad';

    const asset = createAssetForProduct(
      currentProduct,
      dna,
      format,
      'estrellas',
      bp.visualStructure === 'versus_comparativa' ? secondProd : undefined,
      0
    );

    asset.visualConfig.templateId = bp.visualStructure;
    asset.visualConfig.aspectRatio = bp.recommendedFormat;
    asset.visualConfig.headline = bp.hookFormula.replace('[PRODUCTO]', currentProduct.title).slice(0, 68);
    onCloneBlueprintToStudio(asset);
  };

  return (
    <div className="space-y-6">
      {/* Top Selector & ROAS Simulator */}
      <div className="rounded-2xl border border-[#e68628]/40 bg-gradient-to-br from-[#0f4b25] via-[#0c351b] to-[#08160d] p-6 shadow-2xl space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#e68628]">
              <Target className="w-4 h-4" />
              Centro de Performance Ads & Clonador de Anuncios (Estilo AdCreative.ai + Holo Ads)
            </div>
            <h2 className="text-2xl font-extrabold text-[#ece7d7] mt-1">
              Estructura de Campañas Meta/TikTok Ads con Test A/B/C y Simulador ROAS
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#ece7d7]/70 mb-1">
                Producto a Pautar
              </label>
              <select
                value={selectedProdId}
                onChange={(e) => setSelectedProdId(Number(e.target.value))}
                className="px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-xs font-bold text-[#ece7d7]"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} — {formatArs(p.isSale && p.salePrice ? p.salePrice : p.price)} (Margen {p.margenPorc}%)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-[#ece7d7]/70 mb-1">
                Presupuesto Diario (ARS)
              </label>
              <input
                type="number"
                step={2500}
                value={dailyBudget}
                onChange={(e) => setDailyBudget(Math.max(2000, Number(e.target.value) || 10000))}
                className="w-36 px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 text-sm font-black text-[#e68628]"
              />
            </div>
          </div>
        </div>

        {/* Live ROAS & Margin Break-Even Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-4 border-t border-white/10">
          <div className="p-3.5 rounded-xl bg-black/30 border border-white/10">
            <div className="text-xs text-[#ece7d7]/70">Ganancia Neta por Unidad</div>
            <div className="text-xl font-black text-emerald-400 mt-0.5">
              {formatArs(unitProfit)} ({currentProduct.margenPorc}%)
            </div>
            <div className="text-[11px] text-[#ece7d7]/60 mt-0.5">
              Precio venta: {formatArs(effectivePrice)}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-black/30 border border-white/10">
            <div className="text-xs text-[#ece7d7]/70">Punto de Equilibrio Diario</div>
            <div className="text-xl font-black text-[#ece7d7] mt-0.5">
              {breakEvenOrdersPerDay} {breakEvenOrdersPerDay === 1 ? 'venta/día' : 'ventas/día'}
            </div>
            <div className="text-[11px] text-[#ece7d7]/60 mt-0.5">
              Para cubrir {formatArs(dailyBudget)} de pauta
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-black/30 border border-white/10">
            <div className="text-xs text-[#ece7d7]/70">Pedidos Diarios Proyectados</div>
            <div className="text-xl font-black text-[#e68628] mt-0.5">
              ~{estimatedDailyOrders} pedidos/día
            </div>
            <div className="text-[11px] text-[#ece7d7]/60 mt-0.5">
              Con ROAS promedio 4.6x
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-black/30 border border-white/10">
            <div className="text-xs text-[#ece7d7]/70">Facturación Mensual Estimada</div>
            <div className="text-xl font-black text-emerald-400 mt-0.5">
              {formatArs(estimatedMonthlyRevenue)}
            </div>
            <div className="text-[11px] text-[#ece7d7]/60 mt-0.5">
              Tráfico a yerbazo.com.ar + WhatsApp
            </div>
          </div>
        </div>
      </div>

      {/* Audience Targeting & UTM Configuration Card */}
      <div className="rounded-2xl border border-white/10 bg-[#0d2415] p-5 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        <div className="lg:col-span-8 space-y-2">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#e68628]" />
            <h3 className="text-sm font-extrabold text-[#ece7d7]">
              Segmentación Recomendada en Meta Ads Manager ({campaign.objective})
            </h3>
          </div>
          <p className="text-xs text-[#ece7d7]/80">
            <strong>Ubicaciones:</strong> {campaign.targetAudience.locations.join(' • ')} |{' '}
            <strong>Edades:</strong> {campaign.targetAudience.ageRange}
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {campaign.targetAudience.interests.map((interest, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-full bg-black/35 border border-white/10 text-[11px] font-semibold text-[#ece7d7]"
              >
                🎯 {interest}
              </span>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 bg-black/30 p-3.5 rounded-xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-[#e68628]">
              URL de Destino con Tracking UTM
            </span>
            <button
              onClick={() => handleCopy('utm', campaign.utmUrl)}
              className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
            >
              <Copy className="w-3 h-3" />
              {copiedKey === 'utm' ? '¡Copiada!' : 'Copiar URL'}
            </button>
          </div>
          <div className="text-[11px] font-mono text-[#ece7d7]/75 break-all bg-black/40 p-2 rounded-lg">
            {campaign.utmUrl}
          </div>
        </div>
      </div>

      {/* 3 A/B/C Ad Angle Variations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {campaign.variations.map((v) => (
          <div
            key={v.id}
            className="rounded-2xl border border-white/10 bg-[#0d2415] p-5 flex flex-col justify-between space-y-4 shadow-xl"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-[#e68628]/20 border border-[#e68628]/40 text-xs font-extrabold text-[#e68628]">
                  {v.angleName}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-950 border border-emerald-500/40 text-xs font-black text-emerald-400">
                  Score {v.aiScore}/100
                </span>
              </div>

              <div className="text-xs text-[#ece7d7]/70">
                <strong>Gatillo Psicológico:</strong> {v.psychologicalTrigger}
              </div>

              <div className="p-3.5 rounded-xl bg-black/35 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-[#ece7d7]/60">
                    Texto Principal (Primary Text)
                  </span>
                  <button
                    onClick={() => handleCopy(v.id, v.primaryText)}
                    className="text-xs font-bold text-[#e68628] hover:underline flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    {copiedKey === v.id ? '¡Copiado!' : 'Copiar'}
                  </button>
                </div>
                <p className="text-xs text-[#ece7d7]/90 whitespace-pre-line leading-relaxed">
                  {v.primaryText}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-black/25 border border-white/10 space-y-1">
                <div className="text-[10px] uppercase font-bold text-[#ece7d7]/50">
                  Título (Headline) & CTA
                </div>
                <div className="text-xs font-extrabold text-[#ece7d7]">{v.headline}</div>
                <div className="text-[11px] text-[#ece7d7]/70">{v.linkDescription}</div>
                <div className="pt-1">
                  <span className="inline-block px-2.5 py-0.5 rounded bg-white/10 text-[11px] font-bold text-[#e68628]">
                    Botón: {v.ctaButton}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/10 text-center">
              <div className="p-2 rounded-lg bg-black/30">
                <div className="text-[10px] text-[#ece7d7]/60">CTR Predicho</div>
                <div className="text-sm font-black text-emerald-400">{v.predictedCtr}</div>
              </div>
              <div className="p-2 rounded-lg bg-black/30">
                <div className="text-[10px] text-[#ece7d7]/60">ROAS Estimado</div>
                <div className="text-sm font-black text-[#e68628]">{v.predictedRoas}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Winning Ad Blueprints Library (AdSpy & Remix) */}
      <div className="rounded-2xl border border-white/10 bg-[#0d2415] p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#e68628]">
              Biblioteca AdSpy & Clonador de Estructuras Ganadoras
            </span>
            <h3 className="text-lg font-extrabold text-[#ece7d7]">
              Cloná los formatos de anuncios con mayor ROAS adaptados a {currentProduct.title}
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {WINNING_AD_BLUEPRINTS.map((bp) => (
            <div
              key={bp.id}
              className="rounded-xl bg-black/30 border border-white/10 p-4 flex flex-col justify-between space-y-3 hover:border-[#e68628]/50 transition"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#0f4b25] text-[#e68628] border border-[#e68628]/30">
                    {bp.category}
                  </span>
                  <span className="text-xs font-black text-emerald-400">
                    {bp.avgRoasBenchmark}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-[#ece7d7]">{bp.title}</h4>
                <p className="text-xs text-[#ece7d7]/75 leading-relaxed">{bp.whyItWorks}</p>

                <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 text-xs italic text-[#e68628]">
                  "{bp.hookFormula.replace('[PRODUCTO]', currentProduct.title)}"
                </div>
              </div>

              <button
                onClick={() => handleRemixBlueprint(bp)}
                className="w-full py-2.5 px-3 rounded-xl bg-[#e68628] hover:bg-[#f39c42] text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md transition"
              >
                <Sliders className="w-3.5 h-3.5" />
                Clonar con {currentProduct.title} en Estudio
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
