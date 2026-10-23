import React, { useState } from 'react';
import {
  Sparkles,
  Globe,
  Palette,
  MessageSquare,
  Users,
  CheckCircle2,
  RefreshCw,
  Tag,
  Cpu,
  Plus,
  Trash2,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { BrandDNA, BrandTone, YerbazoProduct } from '../types/holo';
import { formatArs } from '../services/yerbazoHoloEngine';

interface BrandDNAHubProps {
  dna: BrandDNA;
  onUpdateDNA: (updated: BrandDNA) => void;
  products: YerbazoProduct[];
  onRescanStore: () => Promise<void>;
  isScanning: boolean;
  syncSource: 'live_cloud' | 'snapshot';
}

const TONE_OPTIONS: {
  id: BrandTone;
  title: string;
  badge: string;
  desc: string;
  sample: string;
}[] = [
  {
    id: 'matero_experto',
    title: '🧉 Matero Experto & Cercano',
    badge: 'Recomendado',
    desc: 'Voseo argentino natural, apasionado por la montañita perfecta, la espuma que no afloja y el ritual compartido en la facu, oficina o club.',
    sample: '"Si probás cómo rinde este kilo de Baldo en el segundo termo, no pisás más el pasillo de yerbas del súper."'
  },
  {
    id: 'oferta_urgencia',
    title: '🔥 Comercial & Urgencia Real',
    badge: 'Máximo CTR',
    desc: 'Directo al ahorro, remarcando descuentos activos en yerbazo.com.ar, combos y alertas reales de últimas unidades en stock.',
    sample: '"🚨 Bajó de $23.000 a $18.500 y quedan las últimas 4 latas en stock. Pedila hoy antes de que vuele."'
  },
  {
    id: 'gourmet_premium',
    title: '✨ Sommelier & Selección Gourmet',
    badge: 'Alto Ticket',
    desc: 'Sofisticado y sensorial: destaca el estacionamiento natural, notas herbales, molienda fina uruguaya y accesorios artesanales.',
    sample: '"Notas de cata cremosas, hoja pura seleccionada y un estacionamiento que garantiza cero acidez."'
  },
  {
    id: 'educativo_viral',
    title: '📚 Educativo, Mitos & Viral TikTok',
    badge: 'Alcance Orgánico',
    desc: 'Hooks de curiosidad, tutoriales de cebado, comparativas honestas y trucos materos que generan guardados y comentarios.',
    sample: '"3 errores que hacen que tu montañita de yerba uruguaya se derrumbe al tercer mate (y cómo solucionarlo)."'
  }
];

export const BrandDNAHub: React.FC<BrandDNAHubProps> = ({
  dna,
  onUpdateDNA,
  products,
  onRescanStore,
  isScanning,
  syncSource
}) => {
  const [newExpression, setNewExpression] = useState('');
  const [newUsp, setNewUsp] = useState('');
  const [savedToast, setSavedToast] = useState(false);

  const saleProducts = products.filter((p) => p.isSale);
  const urgentProducts = products.filter((p) => p.stockStatus === 'ultimas');

  const triggerToast = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const handleToneSelect = (tone: BrandTone) => {
    onUpdateDNA({ ...dna, activeTone: tone });
    triggerToast();
  };

  const handleAddExpression = () => {
    if (!newExpression.trim()) return;
    onUpdateDNA({
      ...dna,
      signatureExpressions: [...dna.signatureExpressions, newExpression.trim()]
    });
    setNewExpression('');
    triggerToast();
  };

  const handleRemoveExpression = (idx: number) => {
    onUpdateDNA({
      ...dna,
      signatureExpressions: dna.signatureExpressions.filter((_, i) => i !== idx)
    });
  };

  const handleAddUsp = () => {
    if (!newUsp.trim()) return;
    onUpdateDNA({
      ...dna,
      usps: [...dna.usps, newUsp.trim()]
    });
    setNewUsp('');
    triggerToast();
  };

  return (
    <div className="space-y-6">
      {/* Top Hero Banner - Holo URL Scanner */}
      <div className="relative overflow-hidden rounded-2xl border border-[#e68628]/40 bg-gradient-to-br from-[#0f4b25] via-[#0b351a] to-[#08160d] p-6 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e68628]/20 border border-[#e68628]/40 text-[#e68628] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Motor Brand DNA Activo (Estilo Holo IA + Datos Reales)
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#ece7d7]">
              ADN de Marca & Cerebro Comercial de {dna.brandName}
            </h2>
            <p className="text-sm text-[#ece7d7]/80 leading-relaxed">
              A diferencia de Holo IA tradicional que solo lee texto estático, este cerebro escanea en vivo{' '}
              <span className="text-[#e68628] font-semibold">yerbazo.com.ar</span> y tu inventario para que cada Reel,
              Historia, Post y Anuncio use precios reales, ofertas vigentes y el tono exacto de Yerbazo.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-black/30 p-3 rounded-xl border border-white/10">
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
              <Globe className="w-4 h-4 text-[#e68628]" />
              <div>
                <div className="text-[10px] uppercase tracking-wider text-[#ece7d7]/60 font-semibold">
                  Sitio Web Conectado
                </div>
                <input
                  type="text"
                  value={dna.websiteUrl}
                  onChange={(e) => onUpdateDNA({ ...dna, websiteUrl: e.target.value })}
                  className="bg-transparent text-sm font-bold text-[#ece7d7] focus:outline-none w-48"
                />
              </div>
            </div>

            <button
              onClick={onRescanStore}
              disabled={isScanning}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#e68628] hover:bg-[#f39c42] text-white font-bold text-sm shadow-lg transition disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Escaneando Tienda...' : 'Re-Escanear Tienda Web'}</span>
            </button>
          </div>
        </div>

        {/* Live Store Absorption Bar */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 border-t border-white/10">
          <div className="bg-black/25 rounded-xl p-3 border border-white/10">
            <div className="text-xs text-[#ece7d7]/70">Catálogo Absorbido</div>
            <div className="text-xl font-black text-[#ece7d7] mt-0.5">{products.length} Productos</div>
            <div className="text-[11px] text-emerald-400 font-medium mt-0.5">
              {syncSource === 'live_cloud' ? '● Fotos y precios en vivo' : '● Snapshot verificado'}
            </div>
          </div>
          <div className="bg-black/25 rounded-xl p-3 border border-white/10">
            <div className="text-xs text-[#ece7d7]/70">Ofertas Web Detectadas</div>
            <div className="text-xl font-black text-[#e68628] mt-0.5">{saleProducts.length} en Promo</div>
            <div className="text-[11px] text-[#ece7d7]/70 truncate mt-0.5">
              {saleProducts.map((p) => p.title).join(', ')}
            </div>
          </div>
          <div className="bg-black/25 rounded-xl p-3 border border-white/10">
            <div className="text-xs text-[#ece7d7]/70">Alertas "Últimas Unidades"</div>
            <div className="text-xl font-black text-amber-400 mt-0.5">{urgentProducts.length} Críticos</div>
            <div className="text-[11px] text-[#ece7d7]/70 truncate mt-0.5">
              {urgentProducts.map((p) => p.title).join(', ')}
            </div>
          </div>
          <div className="bg-black/25 rounded-xl p-3 border border-white/10">
            <div className="text-xs text-[#ece7d7]/70">Cupón Activo Sincronizado</div>
            <div className="text-xl font-black text-emerald-400 mt-0.5">
              {dna.activeCoupon.code} (-{dna.activeCoupon.discount}%)
            </div>
            <div className="text-[11px] text-[#ece7d7]/70 mt-0.5">Se inyecta en los CTAs</div>
          </div>
        </div>
      </div>

      {savedToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl border border-emerald-400 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-bold">ADN de Marca actualizado en todas las piezas</span>
        </div>
      )}

      {/* Tone Selector */}
      <div className="rounded-2xl border border-white/10 bg-[#0d2415] p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <MessageSquare className="w-5 h-5 text-[#e68628]" />
            <h3 className="text-lg font-bold text-[#ece7d7]">
              Personalidad y Voz de la IA (Selector Multitono)
            </h3>
          </div>
          <span className="text-xs text-[#ece7d7]/60">
            Cambia cómo redacta copys, guiones de Reels y titulares
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TONE_OPTIONS.map((option) => {
            const isSelected = dna.activeTone === option.id;
            return (
              <button
                key={option.id}
                onClick={() => handleToneSelect(option.id)}
                className={`text-left p-4 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-[#0f4b25] border-[#e68628] shadow-lg ring-2 ring-[#e68628]/40'
                    : 'bg-black/25 border-white/10 hover:border-white/25'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-extrabold text-base text-[#ece7d7]">{option.title}</span>
                  <span
                    className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold ${
                      isSelected ? 'bg-[#e68628] text-white' : 'bg-white/10 text-[#ece7d7]/70'
                    }`}
                  >
                    {isSelected ? '✓ ACTIVO' : option.badge}
                  </span>
                </div>
                <p className="text-xs text-[#ece7d7]/80 mb-3 leading-relaxed">{option.desc}</p>
                <div className="p-2.5 rounded-lg bg-black/30 border border-white/5 text-xs italic text-[#e68628]">
                  {option.sample}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Visual Identity + Contact & Vocabulary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visual Palette & Channels */}
        <div className="rounded-2xl border border-white/10 bg-[#0d2415] p-6 space-y-5">
          <div className="flex items-center gap-2.5">
            <Palette className="w-5 h-5 text-[#e68628]" />
            <h3 className="text-lg font-bold text-[#ece7d7]">
              Identidad Visual Oficial & Canales de Conversión
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-black/30 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="color"
                  value={dna.colors.primary}
                  onChange={(e) =>
                    onUpdateDNA({ ...dna, colors: { ...dna.colors, primary: e.target.value } })
                  }
                  className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                />
                <div>
                  <div className="text-xs font-bold text-[#ece7d7]">Verde Selva</div>
                  <div className="text-[11px] font-mono text-[#ece7d7]/60">{dna.colors.primary}</div>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-black/30 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="color"
                  value={dna.colors.secondary}
                  onChange={(e) =>
                    onUpdateDNA({ ...dna, colors: { ...dna.colors, secondary: e.target.value } })
                  }
                  className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                />
                <div>
                  <div className="text-xs font-bold text-[#ece7d7]">Crema Matero</div>
                  <div className="text-[11px] font-mono text-[#ece7d7]/60">{dna.colors.secondary}</div>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-black/30 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="color"
                  value={dna.colors.accent}
                  onChange={(e) =>
                    onUpdateDNA({ ...dna, colors: { ...dna.colors, accent: e.target.value } })
                  }
                  className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                />
                <div>
                  <div className="text-xs font-bold text-[#ece7d7]">Naranja Energía</div>
                  <div className="text-[11px] font-mono text-[#ece7d7]/60">{dna.colors.accent}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#ece7d7]/70 mb-1">
                Instagram Handle Oficial
              </label>
              <input
                type="text"
                value={dna.instagramHandle}
                onChange={(e) => onUpdateDNA({ ...dna, instagramHandle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-black/30 border border-white/15 text-sm font-bold text-[#ece7d7]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#ece7d7]/70 mb-1">
                TikTok Handle Oficial
              </label>
              <input
                type="text"
                value={dna.tiktokHandle}
                onChange={(e) => onUpdateDNA({ ...dna, tiktokHandle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-black/30 border border-white/15 text-sm font-bold text-[#ece7d7]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#ece7d7]/70 mb-1">
                WhatsApp Oficial de Pedidos
              </label>
              <input
                type="text"
                value={dna.whatsappNumber}
                onChange={(e) => onUpdateDNA({ ...dna, whatsappNumber: e.target.value })}
                placeholder="+5491134863026"
                className="w-full px-3 py-2 rounded-xl bg-black/30 border border-white/15 text-sm font-bold text-emerald-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#ece7d7]/70 mb-1">
                Código de Cupón Web Activo
              </label>
              <input
                type="text"
                value={dna.activeCoupon.code}
                onChange={(e) =>
                  onUpdateDNA({
                    ...dna,
                    activeCoupon: { ...dna.activeCoupon, code: e.target.value.toUpperCase() }
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-black/30 border border-white/15 text-sm font-bold text-[#e68628]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#ece7d7]/70 mb-1">
                % Descuento del Cupón
              </label>
              <input
                type="number"
                value={dna.activeCoupon.discount}
                onChange={(e) =>
                  onUpdateDNA({
                    ...dna,
                    activeCoupon: { ...dna.activeCoupon, discount: Number(e.target.value) || 0 }
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-black/30 border border-white/15 text-sm text-[#ece7d7]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#ece7d7]/70 mb-1">
              Slogan Principal de Marca
            </label>
            <input
              type="text"
              value={dna.slogan}
              onChange={(e) => onUpdateDNA({ ...dna, slogan: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-black/30 border border-white/15 text-sm text-[#ece7d7]"
            />
          </div>
        </div>

        {/* Vocabulary & Cloud AI Connector */}
        <div className="rounded-2xl border border-white/10 bg-[#0d2415] p-6 space-y-5">
          <div className="flex items-center gap-2.5">
            <Tag className="w-5 h-5 text-[#e68628]" />
            <h3 className="text-lg font-bold text-[#ece7d7]">
              Diccionario Matero & Frases Insignia de Yerbazo
            </h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {dna.signatureExpressions.map((expr, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0f4b25] border border-[#e68628]/40 text-xs font-semibold text-[#ece7d7]"
              >
                <span>"{expr}"</span>
                <button
                  onClick={() => handleRemoveExpression(idx)}
                  className="text-[#ece7d7]/50 hover:text-red-400"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newExpression}
              onChange={(e) => setNewExpression(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddExpression()}
              placeholder="Agregar frase propia (ej: 'Molienda charrúa sin humo')..."
              className="flex-1 px-3 py-2 rounded-xl bg-black/30 border border-white/15 text-sm text-[#ece7d7]"
            />
            <button
              onClick={handleAddExpression}
              className="px-4 py-2 rounded-xl bg-[#e68628] hover:bg-[#f39c42] text-white font-bold text-xs flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Agregar
            </button>
          </div>

          {/* Hybrid AI Engine Config */}
          <div className="pt-4 border-t border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#e68628]" />
                <span className="text-sm font-bold text-[#ece7d7]">
                  Motor Generativo IA (Híbrido Cloud)
                </span>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Operativo sin llaves
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'dual_auto', label: '🔥 Dual Auto (Gemini + OpenAI)' },
                { id: 'gemini', label: '✨ Solo Gemini' },
                { id: 'openai', label: '🤖 Solo OpenAI' },
                { id: 'yerbazo_neural', label: '⚡ Yerbazo Neural (Sin API)' }
              ].map((prov) => (
                <button
                  key={prov.id}
                  onClick={() =>
                    onUpdateDNA({
                      ...dna,
                      aiConfig: { ...dna.aiConfig, provider: prov.id as any }
                    })
                  }
                  className={`px-2.5 py-2 rounded-xl text-xs font-bold border transition ${
                    dna.aiConfig.provider === prov.id
                      ? 'bg-[#e68628] text-white border-[#e68628]'
                      : 'bg-black/30 text-[#ece7d7]/70 border-white/10'
                  }`}
                >
                  {prov.label}
                </button>
              ))}
            </div>

            {dna.aiConfig.provider !== 'yerbazo_neural' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs text-[#ece7d7]/80 font-semibold mb-1">
                    ✨ API Key de Google Gemini (AI Studio)
                  </label>
                  <input
                    type="password"
                    value={dna.aiConfig.geminiApiKey || ''}
                    onChange={(e) =>
                      onUpdateDNA({
                        ...dna,
                        aiConfig: {
                          ...dna.aiConfig,
                          geminiApiKey: e.target.value,
                          apiKey: e.target.value || dna.aiConfig.apiKey
                        }
                      })
                    }
                    placeholder="AIzaSy..."
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-[#e68628]/50 text-xs text-[#ece7d7]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#ece7d7]/80 font-semibold mb-1">
                    🤖 API Key de OpenAI (GPT-4o)
                  </label>
                  <input
                    type="password"
                    value={dna.aiConfig.openaiApiKey || ''}
                    onChange={(e) =>
                      onUpdateDNA({
                        ...dna,
                        aiConfig: {
                          ...dna.aiConfig,
                          openaiApiKey: e.target.value
                        }
                      })
                    }
                    placeholder="sk-proj-..."
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-[#e68628]/50 text-xs text-[#ece7d7]"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Buyer Personas Matrix */}
      <div className="rounded-2xl border border-white/10 bg-[#0d2415] p-6">
        <div className="flex items-center gap-2.5 mb-4">
          <Users className="w-5 h-5 text-[#e68628]" />
          <h3 className="text-lg font-bold text-[#ece7d7]">
            Arquetipos de Clientes (Buyer Personas Detectados en Ventas de Yerbazo)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {dna.audiences.map((aud) => (
            <div
              key={aud.id}
              className="rounded-xl bg-black/25 border border-white/10 p-4 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{aud.avatar}</span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white/10 text-[#ece7d7]/80">
                    {aud.ageRange}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-[#ece7d7] mb-2">{aud.name}</h4>

                <div className="text-[11px] font-bold uppercase text-red-400/90 mb-1">
                  Dolores que resolvemos:
                </div>
                <ul className="text-xs text-[#ece7d7]/75 space-y-1 mb-3">
                  {aud.painPoints.map((pt, i) => (
                    <li key={i}>• {pt}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-white/10">
                <div className="text-[11px] font-bold text-[#e68628] mb-1">Productos Favoritos:</div>
                <div className="flex flex-wrap gap-1">
                  {aud.favoriteProducts.map((fp, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded bg-[#0f4b25] text-[#ece7d7] border border-white/10"
                    >
                      {fp}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
