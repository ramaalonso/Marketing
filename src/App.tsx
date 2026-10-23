import React, { useEffect, useState } from 'react';
import {
  Zap,
  Sliders,
  Film,
  Target,
  Calendar,
  Dna,
  RefreshCw,
  ExternalLink,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import {
  BrandDNA,
  GeneratedAsset,
  MarketingObjective,
  VisualStudioConfig,
  YerbazoProduct
} from './types/holo';
import {
  createAssetForProduct,
  GENERATED_ASSETS_STORAGE_KEY,
  generateAutopilotBatch,
  INITIAL_YERBAZO_PRODUCTS,
  loadSavedBrandDNA,
  saveBrandDNA,
  syncLiveYerbazoCatalog
} from './services/yerbazoHoloEngine';
import { AutopilotFeed } from './components/AutopilotFeed';
import { VisualStudio } from './components/VisualStudio';
import { ReelsAndVideoStudio } from './components/ReelsAndVideoStudio';
import { AdCampaignCenter } from './components/AdCampaignCenter';
import { SmartCalendarAndCatalog } from './components/SmartCalendarAndCatalog';
import { BrandDNAHub } from './components/BrandDNAHub';
import { AIStrategist } from './components/AIStrategist';

type ActiveTab = 'strategist' | 'autopilot' | 'studio' | 'reels' | 'ads' | 'calendar' | 'dna';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('strategist');
  const [dna, setDna] = useState<BrandDNA>(() => loadSavedBrandDNA());
  const [products, setProducts] = useState<YerbazoProduct[]>(INITIAL_YERBAZO_PRODUCTS);
  const [syncSource, setSyncSource] = useState<'live_cloud' | 'snapshot'>('snapshot');
  const [isScanning, setIsScanning] = useState(false);

  const [assets, setAssets] = useState<GeneratedAsset[]>(() => {
    try {
      const saved = localStorage.getItem(GENERATED_ASSETS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return generateAutopilotBatch(INITIAL_YERBAZO_PRODUCTS, loadSavedBrandDNA(), 'todos');
  });

  const [selectedAssetForEdit, setSelectedAssetForEdit] = useState<GeneratedAsset | null>(null);

  // Sync live catalog from yerbazo.com.ar on mount
  const handleSyncCatalog = async () => {
    setIsScanning(true);
    const result = await syncLiveYerbazoCatalog();
    setProducts(result.products);
    setSyncSource(result.source);
    if (result.coupons.length > 0) {
      const activeC = result.coupons.find((c) => c.active) || result.coupons[0];
      if (activeC) {
        const updatedDna: BrandDNA = {
          ...dna,
          activeCoupon: activeC,
          lastScannedAt: new Date().toISOString()
        };
        setDna(updatedDna);
        saveBrandDNA(updatedDna);
      }
    }
    setIsScanning(false);
  };

  useEffect(() => {
    handleSyncCatalog();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(GENERATED_ASSETS_STORAGE_KEY, JSON.stringify(assets));
    } catch {
      // ignore
    }
  }, [assets]);

  const handleUpdateDNA = (updated: BrandDNA) => {
    setDna(updated);
    saveBrandDNA(updated);
  };

  const handleUpdateAsset = (updated: GeneratedAsset) => {
    setAssets((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
  };

  const handleAddAsset = (newAsset: GeneratedAsset) => {
    setAssets((prev) => [newAsset, ...prev]);
  };

  const handleAddMultipleAssets = (newAssets: GeneratedAsset[]) => {
    setAssets((prev) => [...newAssets, ...prev]);
  };

  const handleDeleteAsset = (id: string) => {
    setAssets((prev) => prev.filter((a) => a.id !== id));
  };

  const handleRegenerateBatch = (objective: MarketingObjective | 'todos') => {
    const freshBatch = generateAutopilotBatch(products, dna, objective);
    setAssets(freshBatch);
  };

  const handleOpenInVisualStudio = (asset: GeneratedAsset) => {
    setSelectedAssetForEdit(asset);
    setActiveTab('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenInReelStudio = (asset: GeneratedAsset) => {
    setSelectedAssetForEdit(asset);
    setActiveTab('reels');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveStudioConfigToFeed = (
    config: VisualStudioConfig,
    product: YerbazoProduct
  ) => {
    const newAsset = createAssetForProduct(
      product,
      dna,
      config.aspectRatio === '9:16'
        ? 'historia_9_16'
        : config.templateId === 'carrusel_secuencia'
        ? 'carrusel_5x'
        : 'post_feed',
      'estrellas',
      undefined,
      0
    );
    newAsset.visualConfig = config;
    newAsset.status = 'aprobado';
    setAssets((prev) => [newAsset, ...prev]);
  };

  const navItems: { id: ActiveTab; label: string; badge?: string; icon: React.ReactNode }[] = [
    {
      id: 'strategist',
      label: 'Estratega IA',
      badge: 'NUEVO',
      icon: <Sparkles className="w-4 h-4" />
    },
    {
      id: 'autopilot',
      label: 'Plantillas rápidas',
      badge: `${assets.length}`,
      icon: <Zap className="w-4 h-4" />
    },
    {
      id: 'studio',
      label: 'Estudio Visual HD',
      badge: '1080p',
      icon: <Sliders className="w-4 h-4" />
    },
    {
      id: 'reels',
      label: 'Reels & Videos UGC',
      badge: '9:16',
      icon: <Film className="w-4 h-4" />
    },
    {
      id: 'ads',
      label: 'Meta/TikTok Ads & AdSpy',
      badge: 'ROAS',
      icon: <Target className="w-4 h-4" />
    },
    {
      id: 'calendar',
      label: 'Calendario & Catálogo',
      icon: <Calendar className="w-4 h-4" />
    },
    {
      id: 'dna',
      label: 'ADN de Marca (Holo DNA)',
      icon: <Dna className="w-4 h-4" />
    }
  ];

  const approvedCount = assets.filter((a) => a.status === 'aprobado' || a.status === 'publicado').length;

  return (
    <div className="min-h-screen bg-[#08160d] text-[#ece7d7] flex flex-col">
      {/* Top Sticky Navigation Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#08160d]/90 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Brand Logo + Title */}
            <div className="flex items-center gap-3">
              <img
                src="/logo.webp"
                alt="Yerbazo"
                className="w-11 h-11 rounded-full object-cover border-2 border-[#e68628] shadow-lg"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-black tracking-tight text-[#ece7d7]">
                    YERBAZO <span className="text-[#e68628]">HOLO IA</span>
                  </h1>
                  <span className="px-2 py-0.5 rounded-full bg-[#e68628]/20 border border-[#e68628]/40 text-[10px] font-extrabold text-[#e68628] uppercase">
                    Autonomous Marketing Studio 2.0
                  </span>
                </div>
                <p className="text-xs text-[#ece7d7]/70">
                  Publicaciones, Reels 9:16, Historias, Carruseles y Anuncios conectados en vivo con{' '}
                  <a
                    href="https://yerbazo.com.ar/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#e68628] font-bold hover:underline"
                  >
                    yerbazo.com.ar
                  </a>
                </p>
              </div>
            </div>

            {/* Right Status & Quick Tone Switcher */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0f4b25] border border-white/10 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-bold text-[#ece7d7]">
                  {approvedCount} piezas aprobadas
                </span>
              </div>

              <select
                value={dna.activeTone}
                onChange={(e) =>
                  handleUpdateDNA({ ...dna, activeTone: e.target.value as any })
                }
                title="Cambiar tono activo del ADN de Marca"
                className="px-3 py-1.5 rounded-xl bg-black/40 border border-[#e68628]/40 text-xs font-bold text-[#ece7d7]"
              >
                <option value="matero_experto">🧉 Tono: Matero Experto</option>
                <option value="oferta_urgencia">🔥 Tono: Oferta & Urgencia</option>
                <option value="gourmet_premium">✨ Tono: Gourmet Premium</option>
                <option value="educativo_viral">📚 Tono: Educativo Viral</option>
              </select>

              <button
                onClick={handleSyncCatalog}
                disabled={isScanning}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#e68628] hover:bg-[#f39c42] text-white text-xs font-extrabold shadow-md transition"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                <span>{isScanning ? 'Sincronizando...' : `Web Live (${products.length})`}</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {navItems.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`whitespace-nowrap px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${
                    active
                      ? 'bg-[#0f4b25] text-white border border-[#e68628] shadow-lg'
                      : 'text-[#ece7d7]/75 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <span className={active ? 'text-[#e68628]' : 'text-[#ece7d7]/60'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                        active ? 'bg-[#e68628] text-white' : 'bg-white/10 text-[#ece7d7]/80'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'strategist' && <AIStrategist products={products} dna={dna} />}
        {activeTab === 'autopilot' && (
          <AutopilotFeed
            assets={assets}
            products={products}
            dna={dna}
            onUpdateAsset={handleUpdateAsset}
            onAddAsset={handleAddAsset}
            onRegenerateBatch={handleRegenerateBatch}
            onOpenInVisualStudio={handleOpenInVisualStudio}
            onOpenInReelStudio={handleOpenInReelStudio}
          />
        )}

        {activeTab === 'studio' && (
          <VisualStudio
            products={products}
            dna={dna}
            initialAsset={selectedAssetForEdit}
            onSaveToFeed={handleSaveStudioConfigToFeed}
          />
        )}

        {activeTab === 'reels' && (
          <ReelsAndVideoStudio
            products={products}
            dna={dna}
            initialAsset={selectedAssetForEdit}
          />
        )}

        {activeTab === 'ads' && (
          <AdCampaignCenter
            products={products}
            dna={dna}
            onCloneBlueprintToStudio={handleOpenInVisualStudio}
          />
        )}

        {activeTab === 'calendar' && (
          <SmartCalendarAndCatalog
            assets={assets}
            products={products}
            dna={dna}
            onUpdateAsset={handleUpdateAsset}
            onDeleteAsset={handleDeleteAsset}
            onAddMultipleAssets={handleAddMultipleAssets}
            onOpenInVisualStudio={handleOpenInVisualStudio}
            onOpenInReelStudio={handleOpenInReelStudio}
          />
        )}

        {activeTab === 'dna' && (
          <BrandDNAHub
            dna={dna}
            onUpdateDNA={handleUpdateDNA}
            products={products}
            onRescanStore={handleSyncCatalog}
            isScanning={isScanning}
            syncSource={syncSource}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/30 py-4 px-6 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#ece7d7]/60">
          <div>
            🌿 <strong>Yerbazo Holo IA 2.0</strong> — Plataforma Independiente de Marketing Autónomo lista para la nube (Vercel / Render)
          </div>
          <div>
            Paleta Oficial: Verde Selva <code className="text-emerald-400">#0f4b25</code> • Crema Matero{' '}
            <code className="text-[#ece7d7]">#ece7d7</code> • Naranja Energía{' '}
            <code className="text-[#e68628]">#e68628</code>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
