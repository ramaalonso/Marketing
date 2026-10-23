export type BrandTone = 'matero_experto' | 'oferta_urgencia' | 'gourmet_premium' | 'educativo_viral';

export type MarketingObjective =
  | 'estrellas'
  | 'alto_margen'
  | 'liquidar_stock'
  | 'urgencia_oferta'
  | 'educativo_comunidad'
  | 'combo_pack';

export type AssetFormatType =
  | 'post_feed'
  | 'historia_9_16'
  | 'reel_ugc'
  | 'meta_ad'
  | 'carrusel_5x'
  | 'whatsapp_funnel';

export type VisualTemplateId =
  | 'hero_oferta'
  | 'versus_comparativa'
  | 'historia_sticker'
  | 'review_social'
  | 'performance_callouts'
  | 'carrusel_secuencia';

export type AspectRatioType = '1:1' | '4:5' | '9:16';

export type BgThemeId = 'selva_gold' | 'crema_editorial' | 'noche_neon' | 'fuego_oferta';

export interface AudiencePersona {
  id: string;
  name: string;
  avatar: string;
  ageRange: string;
  painPoints: string[];
  desires: string[];
  favoriteProducts: string[];
  bestChannels: string[];
}

export interface BrandDNA {
  brandName: string;
  websiteUrl: string;
  instagramHandle: string;
  tiktokHandle: string;
  whatsappNumber: string;
  slogan: string;
  valueProposition: string;
  colors: {
    primary: string;   // #0f4b25 Verde Selva
    secondary: string; // #ece7d7 Crema Matero
    accent: string;    // #e68628 Naranja Energia
    dark: string;      // #08160d Selva Profunda
  };
  activeTone: BrandTone;
  audiences: AudiencePersona[];
  usps: string[];
  signatureExpressions: string[];
  activeCoupon: {
    code: string;
    discount: number;
    active: boolean;
  };
  aiConfig: {
    provider: 'dual_auto' | 'gemini' | 'openai' | 'yerbazo_neural';
    apiKey: string;
    geminiApiKey?: string;
    openaiApiKey?: string;
    model: string;
  };
  lastScannedAt: string;
}

export interface LocalMediaItem {
  name: string;
  url: string;
  folder: 'root' | 'mates' | 'productos' | 'cebadas' | 'web';
  updatedAt?: string;
}

export interface YerbazoProduct {
  id: number;
  title: string;
  price: number;
  salePrice?: number | null;
  isSale: boolean;
  isUrgent?: boolean;
  stockStatus: 'normal' | 'ultimas' | 'sinstock';
  category: '1kg' | '500g' | 'otros' | 'mates';
  badge: string;
  weight?: string;
  image: string;
  // Enriched Commercial & Sheet Intelligence
  stockActual: number;
  costoEstimado: number;
  margenPorc: number;
  unidadesVendidasMes: number;
  bcgCategory: 'Estrella' | 'Vaca Lechera' | 'Interrogante' | 'Perro';
  prioridadMarketing: 'impulsar_estrella' | 'liquidar_stock' | 'alto_margen' | 'urgencia_ultimas' | 'combo_estrella';
  razonEstrategica: string;
  // Sensory & Copywriting DNA
  origen: 'Uruguay / Brasil' | 'Brasil (Padrón Uruguayo)' | 'Argentina / Selección' | 'Artesanal Premium';
  molienda: string;
  intensidad: number; // 1 to 5
  duracionTermos: string;
  notasCata: string[];
  dolorQueResuelve: string;
  hookGanador: string;
  beneficiosClave: string[];
  testimonioReal: {
    autor: string;
    rol: string;
    texto: string;
  };
}

export interface CarouselSlide {
  slideNumber: number;
  badge: string;
  headline: string;
  body: string;
  highlightStat?: string;
  cta?: string;
}

export interface VisualStudioConfig {
  templateId: VisualTemplateId;
  aspectRatio: AspectRatioType;
  bgTheme: BgThemeId;
  productId: number;
  secondaryProductId?: number;
  customImageUrl?: string;
  headline: string;
  subheadline: string;
  badgeText: string;
  ctaText: string;
  showPriceBadge: boolean;
  showCouponSticker: boolean;
  callouts: string[];
  storyWidget: 'poll' | 'emoji_slider' | 'countdown' | 'link_sticker' | 'none';
  storyQuestion?: string;
  storyOptionA?: string;
  storyOptionB?: string;
  reviewAuthor?: string;
  reviewText?: string;
  carouselSlides: CarouselSlide[];
}

export interface ReelScene {
  id: string;
  order: number;
  phase: 'HOOK (0-3s)' | 'PROBLEMA (3-7s)' | 'DEMO / PRODUCTO (7-14s)' | 'BENEFICIO / PRUEBA (14-20s)' | 'OFERTA + CTA (20-25s)';
  durationSec: number;
  onScreenText: string;
  voiceoverScript: string;
  visualDirection: string;
  animationStyle: 'zoom_punch' | 'float_3d' | 'split_versus' | 'spotlight_glow' | 'cta_pulse';
  badgeOverlay?: string;
}

export interface ReelProject {
  id: string;
  title: string;
  style: 'ugc_influencer' | 'pov_matero' | 'mito_realidad' | 'asmr_cebada' | 'oferta_relampago' | 'tier_list';
  productId: number;
  secondaryProductId?: number;
  creatorPersona: {
    name: string;
    vibe: string;
    avatarEmoji: string;
  };
  musicTrack: 'lofi_matero' | 'urbano_chill' | 'acustico_rioplatense' | 'upbeat_promo';
  captionStyle: 'hormozi_impact' | 'yerbazo_emerald' | 'minimal_cream';
  bgTheme: BgThemeId;
  scenes: ReelScene[];
  hashtags: string[];
  predictedRetention: number; // %
  viralPotential: number; // 0-100
}

export interface AdAngleVariation {
  id: string;
  angleName: string;
  psychologicalTrigger: string;
  primaryText: string;
  headline: string;
  linkDescription: string;
  ctaButton: 'Comprar ahora' | 'Enviar mensaje de WhatsApp' | 'Más información' | 'Obtener oferta';
  predictedCtr: string;
  predictedRoas: string;
  aiScore: number;
}

export interface AdCampaignBlueprint {
  id: string;
  campaignName: string;
  productId: number;
  objective: 'Conversiones Web (yerbazo.com.ar)' | 'Mensajes WhatsApp Directo' | 'Retargeting Carrito / Recompra' | 'Tráfico Perfil Instagram';
  dailyBudgetArs: number;
  targetAudience: {
    locations: string[];
    ageRange: string;
    interests: string[];
    customSegment: string;
  };
  utmUrl: string;
  variations: AdAngleVariation[];
}

export interface GeneratedAsset {
  id: string;
  createdAt: string;
  type: AssetFormatType;
  title: string;
  objective: MarketingObjective;
  productIds: number[];
  tone: BrandTone;
  status: 'pendiente' | 'aprobado' | 'agendado' | 'publicado';
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:mm
  platform: 'Instagram Feed' | 'Instagram Stories' | 'Reels / TikTok' | 'Meta Ads' | 'WhatsApp Status';
  aiScore: {
    overall: number;
    hook: number;
    visual: number;
    conversion: number;
    estimatedCtr: string;
  };
  strategicWhy: string;
  visualConfig: VisualStudioConfig;
  copy: {
    hook: string;
    body: string;
    cta: string;
    hashtags: string[];
    whatsappText: string;
  };
  reelProject?: ReelProject;
  adCampaign?: AdCampaignBlueprint;
}

export interface WinningAdBlueprint {
  id: string;
  title: string;
  category: 'Comparativa Us vs Them' | 'Matemática del Ahorro' | 'UGC Problema/Solución' | 'Escasez Real / Drop' | 'Ritual & Lifestyle' | 'Combo Degustación';
  sourceInspiration: string;
  avgRoasBenchmark: string;
  whyItWorks: string;
  hookFormula: string;
  visualStructure: VisualTemplateId;
  recommendedFormat: AspectRatioType;
}
