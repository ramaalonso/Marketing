import React, { useEffect, useRef, useState } from 'react';
import {
  Download,
  Sparkles,
  Image as ImageIcon,
  Layers,
  Upload,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Sliders,
  Wand2,
  Eye
} from 'lucide-react';
import {
  AspectRatioType,
  BgThemeId,
  BrandDNA,
  GeneratedAsset,
  VisualStudioConfig,
  VisualTemplateId,
  YerbazoProduct
} from '../types/holo';
import { buildCarouselSlides, formatArs } from '../services/yerbazoHoloEngine';
import { renderMarketingCanvas } from '../utils/canvasRenderer';
import { renderAgencyPhotoPiece } from '../utils/photoStudioComposer';

interface VisualStudioProps {
  products: YerbazoProduct[];
  dna: BrandDNA;
  initialAsset?: GeneratedAsset | null;
  onSaveToFeed: (config: VisualStudioConfig, product: YerbazoProduct) => void;
}

const TEMPLATES: { id: VisualTemplateId; name: string; desc: string }[] = [
  { id: 'hero_oferta', name: '🔥 Hero Oferta & Precio', desc: 'Foco en producto, precio y beneficios' },
  { id: 'performance_callouts', name: '🎯 Callouts Meta Ads', desc: 'Etiquetas flotantes de alto CTR' },
  { id: 'historia_sticker', name: '📱 Historia Interactiva 9:16', desc: 'Con encuesta / sticker tipo Instagram' },
  { id: 'versus_comparativa', name: '⚔️ Versus / Dúo Combo', desc: 'Compara o combina 2 productos en pantalla' },
  { id: 'review_social', name: '⭐ Reseña 5 Estrellas', desc: 'Prueba social con testimonio real' },
  { id: 'carrusel_secuencia', name: '📑 Carrusel 5 Slides', desc: 'Secuencia completa deslizable (1 a 5)' }
];

const THEMES: { id: BgThemeId; name: string; swatch: string }[] = [
  { id: 'selva_gold', name: 'Verde Selva Oficial', swatch: 'bg-[#0f4b25]' },
  { id: 'crema_editorial', name: 'Crema Matero Editorial', swatch: 'bg-[#ece7d7]' },
  { id: 'fuego_oferta', name: 'Fuego Oferta Urgente', swatch: 'bg-orange-800' },
  { id: 'noche_neon', name: 'Noche Premium Dark', swatch: 'bg-zinc-900' }
];

export const VisualStudio: React.FC<VisualStudioProps> = ({
  products,
  dna,
  initialAsset,
  onSaveToFeed
}) => {
  const defaultProd = products[0];
  const [config, setConfig] = useState<VisualStudioConfig>(() => {
    if (initialAsset?.visualConfig) {
      return initialAsset.visualConfig;
    }
    return {
      templateId: 'hero_oferta',
      aspectRatio: '4:5',
      bgTheme: 'selva_gold',
      productId: defaultProd.id,
      secondaryProductId: products[1]?.id || defaultProd.id,
      headline: `${defaultProd.title}: La montañita que dura 2 termos`,
      subheadline: `${defaultProd.molienda} • ${defaultProd.duracionTermos}`,
      badgeText: defaultProd.badge.toUpperCase(),
      ctaText: `PEDIR A ${formatArs(defaultProd.isSale && defaultProd.salePrice ? defaultProd.salePrice : defaultProd.price)}`,
      showPriceBadge: true,
      showCouponSticker: true,
      callouts: [
        defaultProd.duracionTermos,
        `Intensidad ${defaultProd.intensidad}/5`,
        defaultProd.notasCata[0] || 'Cero acidez'
      ],
      storyWidget: 'poll',
      storyQuestion: `¿Team ${defaultProd.title.split(' ')[0]} o preferís otra? 🧉`,
      storyOptionA: '🔥 La mejor lejos',
      storyOptionB: '👀 Quiero probarla',
      reviewAuthor: `${defaultProd.testimonioReal.autor} (${defaultProd.testimonioReal.rol})`,
      reviewText: defaultProd.testimonioReal.texto,
      carouselSlides: buildCarouselSlides(defaultProd, dna, dna.activeTone)
    };
  });

  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [savedNotice, setSavedNotice] = useState(false);
  const [localImages, setLocalImages] = useState<{ name: string; url: string; folder: string }[]>([]);
  const [aiBackdropUrl, setAiBackdropUrl] = useState<string>('');
  const [aiPhotoPrompt, setAiPhotoPrompt] = useState<string>(
    'Clean warm rustic parota wood table surface in foreground on a sunlit Palermo Buenos Aires balcony, steaming leather imperial mate gourd and matte black thermos in soft bokeh background, 50mm f1.8 commercial photography'
  );
  const [aiFunnelMode, setAiFunnelMode] = useState<'TOFU' | 'MOFU' | 'BOFU'>('BOFU');
  const [isGeneratingAiPhoto, setIsGeneratingAiPhoto] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    fetch('/api/local-images')
      .then((r) => (r.ok ? r.json() : { images: [] }))
      .then((data) => {
        if (Array.isArray(data?.images)) setLocalImages(data.images);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (initialAsset?.visualConfig) {
      setConfig(initialAsset.visualConfig);
      setActiveSlideIndex(0);
    }
  }, [initialAsset]);

  const currentProduct =
    products.find((p) => p.id === config.productId) || products[0];
  const secondaryProduct =
    products.find((p) => p.id === config.secondaryProductId) || products[1] || products[0];

  useEffect(() => {
    if (!canvasRef.current || !currentProduct) return;
    if (aiBackdropUrl && config.templateId !== 'carrusel_secuencia') {
      renderAgencyPhotoPiece({
        canvas: canvasRef.current,
        backdropUrl: aiBackdropUrl,
        aspect: config.aspectRatio,
        visualMode: 'product_scene',
        funnel: aiFunnelMode,
        headline: config.headline,
        subline: config.subheadline,
        cta: config.ctaText,
        product: config.customImageUrl
          ? { ...currentProduct, image: config.customImageUrl }
          : currentProduct,
        dna,
        showTextOverlay: true
      });
      return;
    }
    renderMarketingCanvas({
      canvas: canvasRef.current,
      config,
      product: currentProduct,
      secondaryProduct,
      dna,
      activeSlideIndex
    });
  }, [config, currentProduct, secondaryProduct, dna, activeSlideIndex, aiBackdropUrl, aiFunnelMode]);

  const handleGenerateStudioBackdrop = async () => {
    setIsGeneratingAiPhoto(true);
    try {
      const res = await fetch('/api/ai-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiPhotoPrompt,
          aspect: config.aspectRatio,
          seed: Math.floor(100000 + Math.random() * 899999)
        })
      });
      const data = await res.json();
      if (data?.image) setAiBackdropUrl(data.image);
    } catch {
      // ignore
    }
    setIsGeneratingAiPhoto(false);
  };

  const handleProductChange = (newProdId: number) => {
    const prod = products.find((p) => p.id === newProdId);
    if (!prod) return;
    const effectivePrice = prod.isSale && prod.salePrice ? prod.salePrice : prod.price;
    setConfig((prev) => ({
      ...prev,
      productId: prod.id,
      customImageUrl: undefined,
      headline: prod.isSale
        ? `¡OFERTA! ${prod.title} a ${formatArs(effectivePrice)}`
        : `${prod.title}: ${prod.duracionTermos}`,
      subheadline: `${prod.molienda} • Stock real en yerbazo.com.ar`,
      badgeText: prod.badge.toUpperCase(),
      ctaText: `COMPRAR A ${formatArs(effectivePrice)}`,
      callouts: [
        prod.duracionTermos,
        `Intensidad ${prod.intensidad}/5`,
        prod.notasCata[0] || 'Espuma firme'
      ],
      storyQuestion: `¿Ya probaste ${prod.title}? 🧉`,
      reviewAuthor: `${prod.testimonioReal.autor} (${prod.testimonioReal.rol})`,
      reviewText: prod.testimonioReal.texto,
      carouselSlides: buildCarouselSlides(prod, dna, dna.activeTone)
    }));
  };

  const handleUploadCustomImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setConfig((prev) => ({ ...prev, customImageUrl: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDownloadPNG = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    const slideSuffix =
      config.templateId === 'carrusel_secuencia' ? `-slide-${activeSlideIndex + 1}` : '';
    link.download = `yerbazo-${currentProduct.title.toLowerCase().replace(/\s+/g, '-')}-${config.aspectRatio.replace(':', 'x')}${slideSuffix}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const handleDownloadAllCarouselSlides = async () => {
    if (!canvasRef.current) return;
    for (let i = 0; i < config.carouselSlides.length; i++) {
      setActiveSlideIndex(i);
      await renderMarketingCanvas({
        canvas: canvasRef.current,
        config,
        product: currentProduct,
        secondaryProduct,
        dna,
        activeSlideIndex: i
      });
      const link = document.createElement('a');
      link.download = `yerbazo-carrusel-${currentProduct.title.toLowerCase().replace(/\s+/g, '-')}-slide-${i + 1}.png`;
      link.href = canvasRef.current.toDataURL('image/png');
      link.click();
      await new Promise((r) => setTimeout(r, 250));
    }
  };

  const handleMagicHookRewrite = () => {
    const hooks = [
      currentProduct.hookGanador,
      `🔥 ${currentProduct.title}: ${currentProduct.duracionTermos}`,
      `¿Todavía comprando yerba que se lava al 4to mate? Pasate a ${currentProduct.title}`,
      `Stock recién ingresado de ${currentProduct.title} en yerbazo.com.ar 🧉`
    ];
    const nextHook = hooks[Math.floor(Math.random() * hooks.length)];
    setConfig((prev) => ({ ...prev, headline: nextHook.slice(0, 68) }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Controls Column (7 cols) */}
      <div className="lg:col-span-7 space-y-5">
        <div className="rounded-2xl border border-white/10 bg-[#0d2415] p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#e68628]">
                Estudio Gráfico HD (1080p Nativo)
              </span>
              <h2 className="text-xl font-extrabold text-[#ece7d7]">
                Diseñador de Posts, Historias 9:16, Anuncios y Carruseles
              </h2>
            </div>

            <button
              onClick={() => {
                onSaveToFeed(config, currentProduct);
                setSavedNotice(true);
                setTimeout(() => setSavedNotice(false), 2500);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-lg transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              {savedNotice ? '¡Guardado en Calendario!' : 'Guardar en Calendario'}
            </button>
          </div>

          {/* Nuevo Bloque: Escenario Fotográfico Realista IA */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#0f4b25] to-black/50 border border-[#e68628]/40 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-extrabold text-[#e68628] uppercase tracking-wider">
                📸 Escena Fotográfica Realista IA (Con Sombra Física en tu Paquete)
              </span>
              {aiBackdropUrl && (
                <button
                  onClick={() => setAiBackdropUrl('')}
                  className="text-[11px] text-[#ece7d7]/70 hover:text-white underline"
                >
                  Volver a fondo gráfico
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              {[
                {
                  label: '☀️ Balcón Palermo',
                  prompt:
                    'Clean warm rustic parota wood table surface in foreground on a sunlit Palermo Buenos Aires balcony, steaming leather imperial mate gourd and thermos in soft bokeh background, 50mm f1.8'
                },
                {
                  label: '🔥 Estudio Oscuro',
                  prompt:
                    'Dramatic luxury dark slate stone countertop in foreground with warm amber rim lighting, moody dark green studio backdrop with subtle yerba leaves bokeh, 85mm f1.4'
                },
                {
                  label: '💻 Noche Facu',
                  prompt:
                    'Cozy wooden study desk surface in foreground at night with warm desk lamp light, open notebook and laptop softly blurred in background, rainy window bokeh, 50mm lens'
                },
                {
                  label: '🌿 Parque & Sol',
                  prompt:
                    'Sunny outdoor rustic wooden table surface in foreground at a Buenos Aires park at golden hour, warm natural sunlight and green trees bokeh, 50mm f1.8'
                }
              ].map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => setAiPhotoPrompt(preset.prompt)}
                  className="px-2.5 py-1.5 rounded-lg bg-black/35 hover:bg-black/55 border border-white/15 text-[11px] font-bold text-[#ece7d7] transition"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={aiFunnelMode}
                onChange={(e) => setAiFunnelMode(e.target.value as any)}
                className="px-3 py-2 rounded-xl bg-black/45 border border-white/15 text-xs font-bold text-[#ece7d7]"
              >
                <option value="TOFU">Objetivo TOFU (Editorial sin precio)</option>
                <option value="MOFU">Objetivo MOFU (Educativo + Ficha)</option>
                <option value="BOFU">Objetivo BOFU (Precio + CTA)</option>
              </select>

              <button
                onClick={handleGenerateStudioBackdrop}
                disabled={isGeneratingAiPhoto}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#e68628] hover:bg-[#f39c42] text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg transition disabled:opacity-60"
              >
                <Sparkles className="w-4 h-4" />
                {isGeneratingAiPhoto
                  ? 'Revelando foto realista (≈10-20s)…'
                  : 'Generar Escena Fotográfica Realista'}
              </button>
            </div>
          </div>

          {/* 1. Product & Aspect Ratio Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#ece7d7]/80 mb-1.5">
                Producto Principal de Yerbazo
              </label>
              <select
                value={config.productId}
                onChange={(e) => handleProductChange(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-black/35 border border-white/15 text-sm font-bold text-[#ece7d7]"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({formatArs(p.isSale && p.salePrice ? p.salePrice : p.price)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#ece7d7]/80 mb-1.5">
                Formato / Relación de Aspecto
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { id: '1:1', label: '1:1 Feed' },
                    { id: '4:5', label: '4:5 Ads' },
                    { id: '9:16', label: '9:16 Story' }
                  ] as { id: AspectRatioType; label: string }[]
                ).map((ar) => (
                  <button
                    key={ar.id}
                    onClick={() =>
                      setConfig((prev) => ({
                        ...prev,
                        aspectRatio: ar.id,
                        storyWidget: ar.id === '9:16' ? 'poll' : prev.storyWidget
                      }))
                    }
                    className={`py-2 px-2 rounded-xl text-xs font-extrabold border transition ${
                      config.aspectRatio === ar.id
                        ? 'bg-[#e68628] text-white border-[#e68628]'
                        : 'bg-black/30 text-[#ece7d7]/70 border-white/10'
                    }`}
                  >
                    {ar.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Secondary Product if Versus / Combo */}
          {config.templateId === 'versus_comparativa' && (
            <div className="p-3.5 rounded-xl bg-[#e68628]/10 border border-[#e68628]/30">
              <label className="block text-xs font-bold text-[#e68628] mb-1">
                Segundo Producto para Comparativa / Combo (Lado Derecho)
              </label>
              <select
                value={config.secondaryProductId || products[1]?.id}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, secondaryProductId: Number(e.target.value) }))
                }
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-xs font-bold text-[#ece7d7]"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({formatArs(p.isSale && p.salePrice ? p.salePrice : p.price)})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* 2. Visual Template Selector */}
          <div>
            <label className="block text-xs font-bold text-[#ece7d7]/80 mb-2">
              Plantilla de Conversión
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() =>
                    setConfig((prev) => ({
                      ...prev,
                      templateId: tpl.id,
                      aspectRatio: tpl.id === 'historia_sticker' ? '9:16' : prev.aspectRatio
                    }))
                  }
                  className={`p-3 rounded-xl border text-left transition ${
                    config.templateId === tpl.id
                      ? 'bg-[#0f4b25] border-[#e68628] ring-1 ring-[#e68628]'
                      : 'bg-black/25 border-white/10 hover:border-white/25'
                  }`}
                >
                  <div className="text-xs font-extrabold text-[#ece7d7]">{tpl.name}</div>
                  <div className="text-[10px] text-[#ece7d7]/65 mt-0.5">{tpl.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Color Theme Selector + Upload Custom Photo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#ece7d7]/80 mb-1.5">
                Tema de Color Yerbazo
              </label>
              <div className="grid grid-cols-2 gap-2">
                {THEMES.map((th) => (
                  <button
                    key={th.id}
                    onClick={() => setConfig((prev) => ({ ...prev, bgTheme: th.id }))}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition ${
                      config.bgTheme === th.id
                        ? 'border-[#e68628] bg-white/10 text-white'
                        : 'border-white/10 bg-black/25 text-[#ece7d7]/75'
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full border border-white/40 ${th.swatch}`} />
                    <span className="truncate">{th.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#ece7d7]/80 mb-1">
                Foto de Producto (Web, Carpeta /img de GitHub o Subir Propia)
              </label>
              <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-black/30 hover:bg-black/50 border border-dashed border-[#e68628]/50 text-xs font-bold text-[#ece7d7] cursor-pointer transition">
                <Upload className="w-4 h-4 text-[#e68628]" />
                <span>Subir Foto Propia desde tu PC/Celular</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadCustomImage}
                  className="hidden"
                />
              </label>
              {localImages.length > 0 && (
                <select
                  value={config.customImageUrl || ''}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      customImageUrl: e.target.value || undefined
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs font-bold text-[#ece7d7]"
                >
                  <option value="">📂 Usar foto oficial del catálogo ({currentProduct.title})</option>
                  {localImages.map((img, i) => (
                    <option key={i} value={img.url}>
                      📁 /img/{img.folder !== 'root' ? `${img.folder}/` : ''}{img.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* 4. Text & Copy Controls */}
          <div className="space-y-3 pt-2 border-t border-white/10">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#ece7d7]/80">
                Titular Principal en Imagen
              </label>
              <button
                onClick={handleMagicHookRewrite}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#e68628] hover:underline"
              >
                <Wand2 className="w-3.5 h-3.5" /> Sugerir otro Gancho IA
              </button>
            </div>
            <input
              type="text"
              value={config.headline}
              onChange={(e) => setConfig((prev) => ({ ...prev, headline: e.target.value }))}
              className="w-full px-3.5 py-2 rounded-xl bg-black/35 border border-white/15 text-sm font-bold text-[#ece7d7]"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#ece7d7]/80 mb-1">
                  Subtítulo / Bajada
                </label>
                <input
                  type="text"
                  value={config.subheadline}
                  onChange={(e) => setConfig((prev) => ({ ...prev, subheadline: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-black/35 border border-white/15 text-xs text-[#ece7d7]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#ece7d7]/80 mb-1">
                  Insignia Superior & Botón CTA
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={config.badgeText}
                    onChange={(e) => setConfig((prev) => ({ ...prev, badgeText: e.target.value }))}
                    placeholder="Insignia"
                    className="px-2.5 py-2 rounded-xl bg-black/35 border border-white/15 text-xs text-[#ece7d7]"
                  />
                  <input
                    type="text"
                    value={config.ctaText}
                    onChange={(e) => setConfig((prev) => ({ ...prev, ctaText: e.target.value }))}
                    placeholder="Texto Botón CTA"
                    className="px-2.5 py-2 rounded-xl bg-black/35 border border-white/15 text-xs text-[#ece7d7]"
                  />
                </div>
              </div>
            </div>

            {/* Callout Badges */}
            <div>
              <label className="block text-xs font-bold text-[#ece7d7]/80 mb-1">
                3 Etiquetas de Beneficios Rápidos (Callouts Flotantes)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[0, 1, 2].map((idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={config.callouts[idx] || ''}
                    onChange={(e) => {
                      const next = [...config.callouts];
                      next[idx] = e.target.value;
                      setConfig((prev) => ({ ...prev, callouts: next }));
                    }}
                    className="px-2.5 py-2 rounded-xl bg-black/35 border border-white/15 text-xs text-[#ece7d7]"
                  />
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <label className="inline-flex items-center gap-2 text-xs font-bold text-[#ece7d7] cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showPriceBadge}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, showPriceBadge: e.target.checked }))
                  }
                  className="rounded accent-[#e68628]"
                />
                Mostrar Etiqueta de Precio ({formatArs(currentProduct.isSale && currentProduct.salePrice ? currentProduct.salePrice : currentProduct.price)})
              </label>

              <label className="inline-flex items-center gap-2 text-xs font-bold text-[#ece7d7] cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showCouponSticker}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, showCouponSticker: e.target.checked }))
                  }
                  className="rounded accent-[#e68628]"
                />
                Incluir Cupón {dna.activeCoupon.code} (-{dna.activeCoupon.discount}%)
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Right Live High-Res Canvas Preview Column (5 cols) */}
      <div className="lg:col-span-5 sticky top-20 space-y-4">
        <div className="rounded-2xl border border-[#e68628]/40 bg-[#0d2415] p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#e68628]" />
              <span className="text-sm font-extrabold text-[#ece7d7]">
                Vista Previa en Vivo ({config.aspectRatio})
              </span>
            </div>

            {config.templateId === 'carrusel_secuencia' && (
              <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-xl border border-white/10">
                <button
                  onClick={() => setActiveSlideIndex((i) => Math.max(0, i - 1))}
                  className="p-1 hover:text-[#e68628]"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-[#ece7d7]">
                  Slide {activeSlideIndex + 1}/{config.carouselSlides.length}
                </span>
                <button
                  onClick={() =>
                    setActiveSlideIndex((i) => Math.min(config.carouselSlides.length - 1, i + 1))
                  }
                  className="p-1 hover:text-[#e68628]"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="bg-black/60 rounded-xl p-3 flex items-center justify-center border border-white/10">
            <canvas
              ref={canvasRef}
              className="max-h-[480px] w-auto rounded-lg shadow-2xl object-contain"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={handleDownloadPNG}
              className="flex-1 py-3 px-4 rounded-xl bg-[#e68628] hover:bg-[#f39c42] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl transition"
            >
              <Download className="w-4 h-4" />
              Descargar Imagen PNG (1080p)
            </button>

            {config.templateId === 'carrusel_secuencia' && (
              <button
                onClick={handleDownloadAllCarouselSlides}
                className="py-3 px-4 rounded-xl bg-[#0f4b25] hover:bg-[#176936] border border-[#e68628]/50 text-[#ece7d7] font-extrabold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <Layers className="w-4 h-4 text-[#e68628]" />
                Descargar los 5 Slides
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
