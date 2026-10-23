import React, { useEffect, useRef, useState } from 'react';
import {
  Brain,
  Search,
  Sparkles,
  Image as ImageIcon,
  Mic,
  Film,
  Download,
  Copy,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Loader2,
  Play,
  Wand2,
  Eye,
  Volume2,
  CheckCircle2
} from 'lucide-react';
import { BrandDNA, YerbazoProduct } from '../types/holo';
import { formatArs } from '../services/yerbazoHoloEngine';
import { loadSafeImage } from '../utils/canvasRenderer';
import { renderAgencyPhotoPiece } from '../utils/photoStudioComposer';
import { INITIAL_STRATEGIC_PLAN } from '../data/initialStrategicPlan';

interface ReelScene {
  seconds: string;
  visual: string;
  on_screen: string;
  voiceover: string;
}

export interface StrategyItem {
  day: number;
  date: string;
  time: string;
  format: 'reel' | 'historia' | 'carrusel' | 'post' | 'anuncio';
  funnel: string;
  visual_mode?: 'product_scene' | 'editorial_concept';
  objective: string;
  product_id: number;
  concept: string;
  competitor_reference: string;
  why_it_works: string;
  hook: string;
  headline: string;
  subline?: string;
  scene_backdrop_prompt?: string;
  image_prompt?: string;
  aspect: '1:1' | '4:5' | '9:16';
  voice_persona?: string;
  caption: string;
  hashtags: string[];
  cta: string;
  kpi: string;
  reel_script: ReelScene[];
  // Generados en vivo
  backdropUrl?: string;
  imageEngine?: string;
  audioUrl?: string;
  voiceEngine?: string;
}

interface StrategyPlan {
  strategy_summary: string;
  key_insights: string[];
  items: StrategyItem[];
  research?: {
    report: string;
    sources: { title: string; url: string }[];
    live?: boolean;
    error?: string;
  };
  generatedAt?: string;
}

const PLAN_KEY = 'yerbazo_ai_strategy_plan_v3';

const FORMAT_LABEL: Record<string, string> = {
  reel: '🎬 Reel 9:16',
  historia: '📱 Historia 9:16',
  carrusel: '📑 Carrusel',
  post: '📌 Post Editorial',
  anuncio: '🎯 Meta Ad Conversión'
};

const FUNNEL_BADGE: Record<string, { style: string; desc: string }> = {
  TOFU: {
    style: 'bg-sky-950/80 text-sky-300 border-sky-500/40',
    desc: 'Alcance Viral · Estética orgánica sin cartel de precio'
  },
  MOFU: {
    style: 'bg-violet-950/80 text-violet-300 border-violet-500/40',
    desc: 'Educación & Autoridad · Ficha sensorial limpia'
  },
  BOFU: {
    style: 'bg-orange-950/80 text-orange-300 border-orange-500/40',
    desc: 'Cierre Directo · Precio real + Escasez honesta'
  },
  Recompra: {
    style: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40',
    desc: 'Fidelización & Combos'
  }
};

export const ARGENTINE_VOICES = [
  { id: 'tomas', label: '🧉 Tomás (Porteño joven, ágil y natural)' },
  { id: 'nico', label: '🎙️ Nico (Experto matero, grave y sereno)' },
  { id: 'sofi', label: '✨ Sofi (Creadora porteña cálida y cercana)' },
  { id: 'cami', label: '⚡ Cami (Dinámica estilo TikTok UGC)' },
  { id: 'fede', label: '🔥 Fede (Enérgico para drops y ofertas)' }
];

async function postJSON(url: string, body: unknown) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || `Error ${res.status}`);
  return data;
}

function wrapTextLines(ctx: CanvasRenderingContext2D, text: string, maxW: number) {
  const words = (text || '').split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const t = line ? `${line} ${w}` : w;
    if (ctx.measureText(t).width > maxW && line) {
      lines.push(line);
      line = w;
    } else line = t;
  }
  if (line) lines.push(line);
  return lines;
}

// Reproductor y Exportador de Reel 9:16 con Fotografía Real + Movimiento de Cámara Ken Burns + Voz Humana Neural
const ReelVideoComposer: React.FC<{
  item: StrategyItem;
  product?: YerbazoProduct;
  dna: BrandDNA;
}> = ({ item, product, dna }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [recording, setRecording] = useState(false);
  const rafRef = useRef<number>();

  const scenes = item.reel_script?.length
    ? item.reel_script
    : [{ seconds: '0-6', visual: '', on_screen: item.headline || item.hook, voiceover: item.hook }];

  const sceneTimes = scenes.map((s, idx) => {
    const [a, b] = (s.seconds || '').split('-').map((n) => parseFloat(n));
    const start = isNaN(a) ? idx * 4 : a;
    const end = isNaN(b) ? start + 4 : b;
    return { start, end };
  });
  const scriptDuration = Math.max(...sceneTimes.map((t) => t.end), 6);

  const renderReelFrame = (
    t: number,
    totalDur: number,
    bgImg: HTMLImageElement | null,
    prodImg: HTMLImageElement | null
  ) => {
    const c = canvasRef.current;
    if (!c) return;
    const W = 720;
    const H = 1280;
    if (c.width !== W) c.width = W;
    if (c.height !== H) c.height = H;
    const ctx = c.getContext('2d')!;

    ctx.fillStyle = '#07140c';
    ctx.fillRect(0, 0, W, H);

    // Movimiento cinematográfico suave (Ken Burns) sobre la fotografía realista
    const progress = Math.min(1, t / Math.max(1, totalDur));
    if (bgImg) {
      const zoom = 1.04 + progress * 0.14;
      const scale = Math.max(W / bgImg.width, H / bgImg.height) * zoom;
      const dw = bgImg.width * scale;
      const dh = bgImg.height * scale;
      const panX = Math.sin(progress * Math.PI) * -18;
      const panY = -progress * 26;
      ctx.drawImage(bgImg, (W - dw) / 2 + panX, (H - dh) / 2 + panY, dw, dh);
    }

    // Producto real integrado con sombra de contacto si el modo es product_scene
    if ((item.visual_mode || 'product_scene') === 'product_scene' && prodImg) {
      const floatScale = 1 + Math.sin(t * 1.8) * 0.015;
      const ph = H * 0.42 * floatScale;
      const pw = (prodImg.width / prodImg.height) * ph;
      const px = (W - pw) / 2;
      const baseY = H * 0.65;
      const py = baseY - ph;

      // Sombra de contacto realista
      ctx.save();
      const sh = ctx.createRadialGradient(W / 2, baseY - 4, 6, W / 2, baseY - 4, pw * 0.58);
      sh.addColorStop(0, 'rgba(0,0,0,0.85)');
      sh.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.setTransform(1, 0, 0, 0.16, 0, baseY * 0.84);
      ctx.fillStyle = sh;
      ctx.beginPath();
      ctx.arc(W / 2, baseY, pw * 0.58, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.48)';
      ctx.shadowBlur = 28;
      ctx.shadowOffsetY = 12;
      ctx.drawImage(prodImg, px, py, pw, ph);
      ctx.restore();
    }

    // Degradado editorial inferior para legibilidad impecable
    const grad = ctx.createLinearGradient(0, H * 0.55, 0, H);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(1, 'rgba(5,14,9,0.92)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, H * 0.55, W, H * 0.45);

    // Barra superior de progreso
    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    ctx.fillRect(32, 28, W - 64, 5);
    ctx.fillStyle = '#e68628';
    ctx.fillRect(32, 28, (W - 64) * progress, 5);

    // Subtítulo sincronizado por escena
    const mappedT = progress * scriptDuration;
    const idx = sceneTimes.findIndex((s) => mappedT >= s.start && mappedT < s.end);
    const sc = scenes[idx >= 0 ? idx : scenes.length - 1];

    ctx.textAlign = 'center';
    ctx.font = '900 44px "Plus Jakarta Sans", Inter, sans-serif';
    const captionLines = wrapTextLines(ctx, (sc.on_screen || '').toUpperCase(), W - 110).slice(0, 3);
    let y = H - 250 - (captionLines.length - 1) * 52;
    for (const l of captionLines) {
      ctx.lineWidth = 9;
      ctx.strokeStyle = 'rgba(0,0,0,0.85)';
      ctx.strokeText(l, W / 2, y);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(l, W / 2, y);
      y += 54;
    }

    ctx.font = '700 23px Inter, sans-serif';
    ctx.fillStyle = '#e68628';
    ctx.fillText(`${dna.instagramHandle}  ·  yerbazo.com.ar`, W / 2, H - 72);
  };

  useEffect(() => {
    let active = true;
    Promise.all([
      loadSafeImage(item.backdropUrl || ''),
      product?.image ? loadSafeImage(product.image) : Promise.resolve(null)
    ]).then(([bg, prod]) => {
      if (active) renderReelFrame(0, scriptDuration, bg, prod);
    });
    return () => {
      active = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [item.backdropUrl, item.visual_mode, product]);

  const startPlayback = async (record: boolean) => {
    const [bgImg, prodImg] = await Promise.all([
      loadSafeImage(item.backdropUrl || ''),
      product?.image ? loadSafeImage(product.image) : Promise.resolve(null)
    ]);

    const audio = audioRef.current;
    let recorder: MediaRecorder | null = null;
    const chunks: BlobPart[] = [];

    if (record && canvasRef.current) {
      const stream = canvasRef.current.captureStream(30);
      if (audio && item.audioUrl) {
        try {
          const actx = new AudioContext();
          const src = actx.createMediaElementSource(audio);
          const dest = actx.createMediaStreamDestination();
          src.connect(dest);
          src.connect(actx.destination);
          dest.stream.getAudioTracks().forEach((tr) => stream.addTrack(tr));
        } catch {
          // Si ya estaba conectado al AudioContext previo, continúa grabando video
        }
      }
      recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      recorder.ondataavailable = (e) => e.data.size && chunks.push(e.data);
      recorder.onstop = () => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob(chunks, { type: 'video/webm' }));
        a.download = `yerbazo-reel-${item.date}.webm`;
        a.click();
        setRecording(false);
      };
      recorder.start();
      setRecording(true);
    }

    setPlaying(true);
    const totalDur =
      audio && item.audioUrl && isFinite(audio.duration) && audio.duration > 1
        ? audio.duration
        : scriptDuration;

    if (audio && item.audioUrl) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }

    const t0 = performance.now();
    const tick = () => {
      const elapsed = (performance.now() - t0) / 1000;
      renderReelFrame(elapsed, totalDur, bgImg, prodImg);
      if (elapsed < totalDur) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setPlaying(false);
        if (recorder && recorder.state === 'recording') recorder.stop();
      }
    };
    tick();
  };

  return (
    <div className="space-y-2.5 pt-2 border-t border-white/10">
      <div className="text-[11px] font-bold text-[#e68628] flex items-center justify-between">
        <span>🎬 Vista Previa de Reel Animado 9:16</span>
        {item.audioUrl && <span className="text-emerald-400">✓ Voz humana sincronizada</span>}
      </div>
      <canvas
        ref={canvasRef}
        className="w-full max-w-[250px] mx-auto rounded-xl border border-white/15 shadow-2xl"
      />
      {item.audioUrl && <audio ref={audioRef} src={item.audioUrl} preload="auto" />}
      <div className="flex gap-2 justify-center">
        <button
          onClick={() => startPlayback(false)}
          disabled={playing}
          className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold flex items-center gap-1.5 transition"
        >
          <Play className="w-3.5 h-3.5 text-[#e68628]" />
          {playing ? 'Reproduciendo…' : 'Reproducir Reel'}
        </button>
        <button
          onClick={() => startPlayback(true)}
          disabled={playing || recording}
          className="px-3.5 py-2 rounded-xl bg-[#e68628] hover:bg-[#f39c42] text-white text-xs font-extrabold flex items-center gap-1.5 shadow-lg transition"
        >
          <Download className="w-3.5 h-3.5" />
          {recording ? 'Exportando…' : 'Descargar Reel (.webm)'}
        </button>
      </div>
    </div>
  );
};

const StrategyPieceCard: React.FC<{
  item: StrategyItem;
  index: number;
  autoGenerateOnMount?: boolean;
  product?: YerbazoProduct;
  dna: BrandDNA;
  onChange: (updated: StrategyItem) => void;
  onError: (msg: string) => void;
}> = ({ item, index, autoGenerateOnMount, product, dna, onChange, onError }) => {
  const [open, setOpen] = useState(index === 0);
  const [busyImg, setBusyImg] = useState(false);
  const [busyVoice, setBusyVoice] = useState(false);
  const [showTextOverlay, setShowTextOverlay] = useState(true);
  const [voice, setVoice] = useState(item.voice_persona || 'tomas');
  const [copied, setCopied] = useState(false);

  const finalCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const didAutoGen = useRef(false);

  const visualMode = item.visual_mode || 'product_scene';
  const promptText =
    item.scene_backdrop_prompt ||
    item.image_prompt ||
    'Sunlit rustic wooden table in a Buenos Aires apartment balcony, steaming leather mate gourd and thermos in soft bokeh background, 50mm lens';

  // Renderizar pieza fotográfica de agencia cada vez que cambia el fondo, modo visual o titular
  useEffect(() => {
    if (!item.backdropUrl || !finalCanvasRef.current || !open) return;
    renderAgencyPhotoPiece({
      canvas: finalCanvasRef.current,
      backdropUrl: item.backdropUrl,
      aspect: item.aspect || (item.format === 'reel' || item.format === 'historia' ? '9:16' : '4:5'),
      visualMode,
      funnel: item.funnel,
      headline: item.headline || item.hook,
      subline: item.subline,
      cta: item.cta,
      product,
      dna,
      showTextOverlay
    });
  }, [
    item.backdropUrl,
    item.headline,
    item.subline,
    item.visual_mode,
    item.funnel,
    showTextOverlay,
    open,
    product,
    dna
  ]);

  const handleGeneratePhoto = async () => {
    setBusyImg(true);
    try {
      const out = await postJSON('/api/ai-image', {
        prompt: promptText,
        aspect:
          item.aspect || (item.format === 'reel' || item.format === 'historia' ? '9:16' : '4:5'),
        referenceUrl: product?.image,
        seed: Math.floor(100000 + Math.random() * 899999)
      });
      onChange({ ...item, backdropUrl: out.image, imageEngine: out.engine });
      setOpen(true);
    } catch (e: any) {
      onError(e.message);
    }
    setBusyImg(false);
  };

  // Auto-generar la primera foto realista al abrir para que el usuario vea el resultado real de inmediato
  useEffect(() => {
    if (autoGenerateOnMount && !item.backdropUrl && !didAutoGen.current) {
      didAutoGen.current = true;
      handleGeneratePhoto();
    }
  }, [autoGenerateOnMount]);

  const handleGenerateVoice = async () => {
    setBusyVoice(true);
    try {
      const spokenScript = item.reel_script?.length
        ? item.reel_script.map((s) => s.voiceover).join(' ')
        : item.hook;

      const res = await fetch('/api/ai-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: spokenScript, voice })
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.error || 'Error al generar la locución');
      }
      const engine = res.headers.get('X-Voice-Engine') || 'Gemini Neural TTS';
      const blob = await res.blob();
      onChange({
        ...item,
        voice_persona: voice,
        audioUrl: URL.createObjectURL(blob),
        voiceEngine: engine
      });
      setOpen(true);
    } catch (e: any) {
      onError(e.message);
    }
    setBusyVoice(false);
  };

  const handleDownloadPNG = () => {
    if (!finalCanvasRef.current) return;
    const a = document.createElement('a');
    a.href = finalCanvasRef.current.toDataURL('image/png');
    a.download = `yerbazo-${item.date}-${item.format}-${item.funnel.toLowerCase()}.png`;
    a.click();
  };

  const funnelInfo = FUNNEL_BADGE[item.funnel] || {
    style: 'bg-white/10 text-white border-white/20',
    desc: item.funnel
  };
  const fullCaption = `${item.caption}\n\n${(item.hashtags || []).join(' ')}`;

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d2415] overflow-hidden shadow-xl">
      {/* Encabezado colapsable de la pieza */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left p-4 flex items-center gap-4 hover:bg-white/[0.03] transition"
      >
        <div className="text-center shrink-0 w-14 py-1 rounded-xl bg-black/30 border border-white/10">
          <div className="text-[10px] uppercase font-bold text-[#ece7d7]/60">
            {new Date((item.date || new Date().toISOString().slice(0, 10)) + 'T12:00:00').toLocaleDateString(
              'es-AR',
              { weekday: 'short' }
            )}
          </div>
          <div className="text-lg font-black text-[#ece7d7]">{item.date?.slice(8, 10)}</div>
          <div className="text-[10px] text-[#e68628] font-bold">{item.time}</div>
        </div>

        {item.backdropUrl ? (
          <img
            src={item.backdropUrl}
            alt={item.concept}
            className="w-14 h-14 rounded-xl object-cover border border-[#e68628]/50 shrink-0"
          />
        ) : product ? (
          <img
            src={product.image}
            alt={product.title}
            className="w-14 h-14 rounded-xl object-contain bg-black/35 p-1.5 border border-white/10 shrink-0"
          />
        ) : null}

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-1">
            <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-md bg-[#0f4b25] text-[#e68628] border border-[#e68628]/30">
              {FORMAT_LABEL[item.format] || item.format}
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${funnelInfo.style}`}>
              {item.funnel} · {funnelInfo.desc}
            </span>
            {product && (
              <span className="text-[11px] font-semibold text-[#ece7d7]/70">
                · {product.title} (
                {formatArs(product.isSale && product.salePrice ? product.salePrice : product.price)})
              </span>
            )}
          </div>
          <div className="font-extrabold text-sm sm:text-base text-[#ece7d7]">{item.concept}</div>
          <div className="text-xs text-[#ece7d7]/75 line-clamp-1 mt-0.5">“{item.hook}”</div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {item.backdropUrl && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
              <CheckCircle2 className="w-3 h-3" /> Foto Lista
            </span>
          )}
          {item.audioUrl && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
              <Volume2 className="w-3 h-3" /> Voz Lista
            </span>
          )}
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Detalle expandido: Inteligencia Estratégica + Estudio Fotográfico & Voz Natural */}
      {open && (
        <div className="p-5 pt-2 border-t border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Izquierda: Razonamiento de Competencia, Guion y Copy (7 cols) */}
          <div className="lg:col-span-7 space-y-3.5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-black/30 border border-white/10">
                <div className="font-extrabold text-[#e68628] mb-1">🎯 Objetivo Comercial & KPI</div>
                <div className="text-[#ece7d7]/90 leading-relaxed">{item.objective}</div>
                <div className="text-emerald-400/90 font-semibold mt-1.5">📊 Meta: {item.kpi}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-black/30 border border-white/10">
                <div className="font-extrabold text-[#e68628] mb-1">
                  🔍 Análisis de Competencia Aplicado
                </div>
                <div className="text-[#ece7d7]/85 leading-relaxed">{item.competitor_reference}</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0f4b25]/35 border border-[#e68628]/25">
              <div className="font-extrabold text-[#e68628] mb-1">
                🧠 Por qué esta idea supera un post común (Datos + Psicología)
              </div>
              <div className="text-[#ece7d7]/90 leading-relaxed">{item.why_it_works}</div>
            </div>

            {/* Guion plano por plano */}
            {item.reel_script?.length > 0 && (
              <div className="p-4 rounded-xl bg-black/30 border border-white/10 space-y-2.5">
                <div className="font-extrabold text-[#e68628] flex items-center justify-between">
                  <span>🎬 Guion Plano por Plano + Locución Rioplatense</span>
                  <span className="text-[11px] text-[#ece7d7]/60">Editable antes de generar voz</span>
                </div>
                {item.reel_script.map((s, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-black/35 border-l-2 border-[#e68628] space-y-1"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-black text-[#e68628]">{s.seconds}s</span>
                      <span className="text-[#ece7d7]/65">🎥 {s.visual}</span>
                    </div>
                    <input
                      value={s.on_screen}
                      onChange={(e) => {
                        const next = [...item.reel_script];
                        next[idx] = { ...s, on_screen: e.target.value };
                        onChange({ ...item, reel_script: next });
                      }}
                      className="w-full px-2 py-1 rounded bg-white/5 border border-white/10 font-bold text-[#ece7d7]"
                      title="Texto en pantalla"
                    />
                    <input
                      value={s.voiceover}
                      onChange={(e) => {
                        const next = [...item.reel_script];
                        next[idx] = { ...s, voiceover: e.target.value };
                        onChange({ ...item, reel_script: next });
                      }}
                      className="w-full px-2 py-1 rounded bg-black/40 border border-white/10 text-[#ece7d7]/90 italic"
                      title="Locución hablada"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Copy listo para publicar */}
            <div className="p-4 rounded-xl bg-black/30 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-[#e68628]">✍️ Copy Listo para Publicar</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(fullCaption);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1800);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" /> {copied ? '¡Copiado!' : 'Copiar Copy'}
                </button>
              </div>
              <div className="whitespace-pre-line text-[#ece7d7]/90 leading-relaxed">
                {item.caption}
              </div>
              <div className="text-emerald-400/80 font-medium">{(item.hashtags || []).join(' ')}</div>
            </div>

            {/* Controles finos de Dirección de Arte */}
            <details className="p-3.5 rounded-xl bg-black/20 border border-white/10">
              <summary className="cursor-pointer font-bold text-[#ece7d7]/75">
                🎨 Ajustar Dirección de Arte Fotográfica y Titular
              </summary>
              <div className="mt-3 space-y-2.5">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#ece7d7]/60 mb-1">
                    Titular Editorial sobre la Foto
                  </label>
                  <input
                    value={item.headline}
                    onChange={(e) => onChange({ ...item, headline: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-xs font-bold text-[#ece7d7]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#ece7d7]/60 mb-1">
                    Prompt Fotográfico de Escena (Inglés)
                  </label>
                  <textarea
                    value={promptText}
                    onChange={(e) =>
                      onChange({
                        ...item,
                        scene_backdrop_prompt: e.target.value,
                        image_prompt: e.target.value
                      })
                    }
                    className="w-full h-24 p-2.5 rounded-lg bg-black/40 border border-white/15 text-[11px] text-[#ece7d7]"
                  />
                </div>
              </div>
            </details>
          </div>

          {/* Derecha: Estudio Fotográfico Realista + Locución Humana Neural (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Selector de Modo Fotográfico según Objetivo */}
            <div className="p-3.5 rounded-xl bg-black/30 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#ece7d7]">
                  📸 Fotografía Publicitaria IA
                </span>
                <label className="inline-flex items-center gap-1.5 text-[11px] text-[#ece7d7]/80 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showTextOverlay}
                    onChange={(e) => setShowTextOverlay(e.target.checked)}
                    className="accent-[#e68628]"
                  />
                  Titular editorial
                </label>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onChange({ ...item, visual_mode: 'product_scene' })}
                  className={`py-2 px-2.5 rounded-lg text-[11px] font-bold border transition ${
                    visualMode === 'product_scene'
                      ? 'bg-[#0f4b25] border-[#e68628] text-white'
                      : 'bg-black/30 border-white/10 text-[#ece7d7]/70'
                  }`}
                >
                  📦 Paquete Real en Escena
                </button>
                <button
                  onClick={() => onChange({ ...item, visual_mode: 'editorial_concept' })}
                  className={`py-2 px-2.5 rounded-lg text-[11px] font-bold border transition ${
                    visualMode === 'editorial_concept'
                      ? 'bg-[#0f4b25] border-[#e68628] text-white'
                      : 'bg-black/30 border-white/10 text-[#ece7d7]/70'
                  }`}
                >
                  ✨ Escena / Arte Puro IA
                </button>
              </div>

              <button
                onClick={handleGeneratePhoto}
                disabled={busyImg}
                className="w-full py-2.5 px-4 rounded-xl bg-[#e68628] hover:bg-[#f39c42] text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg transition disabled:opacity-60"
              >
                {busyImg ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Wand2 className="w-4 h-4" />
                )}
                {busyImg
                  ? 'Revelando fotografía realista (≈10-20s)…'
                  : item.backdropUrl
                  ? 'Generar Otra Escena Fotográfica'
                  : 'Generar Fotografía Realista HD'}
              </button>

              {item.backdropUrl && (
                <div className="space-y-2.5 pt-1">
                  <canvas
                    ref={finalCanvasRef}
                    className="w-full rounded-xl border border-white/15 shadow-2xl"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#ece7d7]/55">{item.imageEngine}</span>
                    <button
                      onClick={handleDownloadPNG}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold flex items-center gap-1.5 shadow"
                    >
                      <Download className="w-3.5 h-3.5" /> Descargar PNG 1080p
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Estudio de Voz Humana Neural Rioplatense + Reel */}
            <div className="p-3.5 rounded-xl bg-black/30 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#ece7d7]">
                  🎙️ Locución Humana Natural (Acento Argentino)
                </span>
                {item.voiceEngine && (
                  <span className="text-[10px] text-emerald-400 font-bold">{item.voiceEngine}</span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  value={voice}
                  onChange={(e) => setVoice(e.target.value)}
                  className="flex-1 px-2.5 py-2 rounded-xl bg-black/45 border border-white/15 text-xs font-bold text-[#ece7d7]"
                >
                  {ARGENTINE_VOICES.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.label}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleGenerateVoice}
                  disabled={busyVoice}
                  className="px-4 py-2 rounded-xl bg-[#0f4b25] hover:bg-[#176936] border border-[#e68628]/60 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 transition shrink-0 disabled:opacity-60"
                >
                  {busyVoice ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Mic className="w-3.5 h-3.5 text-[#e68628]" />
                  )}
                  {busyVoice ? 'Grabando voz…' : item.audioUrl ? 'Re-grabar Voz' : 'Generar Voz Natural'}
                </button>
              </div>

              {item.audioUrl && (
                <div className="space-y-1.5">
                  <audio controls src={item.audioUrl} className="w-full h-9 rounded-lg" />
                  <a
                    href={item.audioUrl}
                    download={`yerbazo-locucion-${item.date}.wav`}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#e68628] hover:underline"
                  >
                    <Download className="w-3 h-3" /> Descargar audio de locución (.wav)
                  </a>
                </div>
              )}

              {item.backdropUrl && (
                <ReelVideoComposer item={item} product={product} dna={dna} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const AIStrategist: React.FC<{ products: YerbazoProduct[]; dna: BrandDNA }> = ({
  products,
  dna
}) => {
  const [plan, setPlan] = useState<StrategyPlan>(() => {
    try {
      const raw = localStorage.getItem(PLAN_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.items?.length) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_STRATEGIC_PLAN;
  });

  const [goal, setGoal] = useState('');
  const [days, setDays] = useState(14);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResearch, setShowResearch] = useState(false);
  const [step, setStep] = useState('');

  useEffect(() => {
    if (!plan) return;
    // Guardar estructura liviana en localStorage sin saturar la cuota con base64 pesados
    const light = {
      ...plan,
      items: plan.items.map(({ backdropUrl, audioUrl, ...rest }) => rest)
    };
    try {
      localStorage.setItem(PLAN_KEY, JSON.stringify(light));
    } catch {
      // ignore
    }
  }, [plan]);

  const handleBuildNewStrategy = async () => {
    setLoading(true);
    setError('');
    const steps = [
      '1/4 · Rastreado señales en vivo de tiendas materas, precios y tendencias en Argentina…',
      '2/4 · Analizando qué formatos y ganchos están convirtiendo en la competencia…',
      '3/4 · Cruzando oportunidades con tu stock real, ofertas web y márgenes de Yerbazo…',
      '4/4 · Diseñando conceptos creativos, dirección fotográfica por objetivo y guiones rioplatenses…'
    ];
    let idx = 0;
    setStep(steps[0]);
    const timer = setInterval(() => {
      idx = Math.min(idx + 1, steps.length - 1);
      setStep(steps[idx]);
    }, 9000);

    try {
      const data = await postJSON('/api/ai-strategy', {
        products: products.map((p) => ({
          id: p.id,
          title: p.title,
          price: p.price,
          salePrice: p.salePrice,
          isSale: p.isSale,
          margenPorc: p.margenPorc,
          stockStatus: p.stockStatus,
          bcgCategory: p.bcgCategory,
          molienda: p.molienda
        })),
        days,
        goal,
        startDate: new Date().toISOString().slice(0, 10)
      });
      setPlan({ ...data, generatedAt: new Date().toISOString() });
    } catch (e: any) {
      setError(e.message);
    }
    clearInterval(timer);
    setLoading(false);
  };

  const updateItem = (idx: number, updated: StrategyItem) => {
    const next = [...plan.items];
    next[idx] = updated;
    setPlan({ ...plan, items: next });
  };

  return (
    <div className="space-y-6">
      {/* Cabecera del Director Estratégico IA */}
      <div className="rounded-2xl border border-[#e68628]/40 bg-gradient-to-br from-[#0f4b25] via-[#0b351a] to-[#08160d] p-6 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e68628]/20 border border-[#e68628]/40 text-xs font-extrabold uppercase tracking-wider text-[#e68628]">
            <Brain className="w-4 h-4" /> Director Creativo & Estratega Competitivo IA
          </div>
          <span className="text-xs text-emerald-400 font-bold">
            ● Voz Neural Argentina (Gemini 3.8 TTS) + Estudio Fotográfico Flux HD Activos
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-[#ece7d7] mt-3">
          Calendario inteligente basado en la competencia, tus márgenes y tu stock real
        </h2>
        <p className="text-sm text-[#ece7d7]/80 mt-1.5 max-w-4xl leading-relaxed">
          Cada pieza nace de un patrón real que funciona en el mercado matero, adapta la{' '}
          <strong className="text-[#ece7d7]">dirección fotográfica según el objetivo</strong> (sin
          carteles de precio en contenido viral TOFU; con urgencia y precio real en cierres BOFU),
          integra tu paquete real con sombras físicas sobre fotografía auténtica y locuta con{' '}
          <strong className="text-[#ece7d7]">voz humana porteña natural</strong>.
        </p>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-3">
          <input
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Escribí un foco puntual o dejalo libre: ej. 'Semana de parciales UADE + liquidar Lata Baldo y empujar Rei Verde Negra'…"
            className="md:col-span-7 px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-sm text-[#ece7d7] placeholder:text-[#ece7d7]/45"
          />
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="md:col-span-2 px-3 py-3 rounded-xl bg-black/40 border border-white/15 text-sm font-bold text-[#ece7d7]"
          >
            <option value={7}>Plan 7 días</option>
            <option value={14}>Plan 14 días</option>
            <option value={30}>Plan 30 días</option>
          </select>
          <button
            onClick={handleBuildNewStrategy}
            disabled={loading}
            className="md:col-span-3 px-4 py-3 rounded-xl bg-[#e68628] hover:bg-[#f39c42] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl transition disabled:opacity-65"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            {loading ? 'Investigando…' : 'Investigar & Rehacer Plan'}
          </button>
        </div>

        {loading && (
          <div className="mt-4 p-3 rounded-xl bg-black/35 border border-[#e68628]/40 text-xs sm:text-sm text-[#e68628] font-semibold animate-pulse">
            {step}
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-amber-500/50 bg-amber-950/40 p-4 flex items-start gap-3 text-sm">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-[#ece7d7]/90">{error}</div>
        </div>
      )}

      {/* Resumen Ejecutivo + Insights de Competencia */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-[#0d2415] p-5 space-y-2">
          <div className="text-xs font-extrabold uppercase text-[#e68628] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> Tesis Estratégica del Calendario
          </div>
          <p className="text-sm text-[#ece7d7]/90 leading-relaxed">{plan.strategy_summary}</p>
        </div>

        <div className="lg:col-span-5 rounded-2xl border border-white/10 bg-[#0d2415] p-5 space-y-2">
          <div className="text-xs font-extrabold uppercase text-[#e68628]">
            Ventajas Competitivas Detectadas
          </div>
          <ul className="text-xs space-y-2 text-[#ece7d7]/85 leading-relaxed">
            {(plan.key_insights || []).map((k, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-[#e68628] font-black">▸</span>
                <span>{k}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Informe completo desplegable */}
      {plan.research?.report && (
        <div className="rounded-2xl border border-white/10 bg-[#0d2415] p-5">
          <button
            onClick={() => setShowResearch(!showResearch)}
            className="w-full flex justify-between items-center text-sm font-extrabold text-[#ece7d7]"
          >
            <span>
              📊 Ver Informe Completo de Inteligencia de Competencia y Reglas Visuales (
              {plan.research.sources?.length || 0} fuentes rastreadas)
            </span>
            {showResearch ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {showResearch && (
            <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
              <div className="text-xs whitespace-pre-line text-[#ece7d7]/85 leading-relaxed max-h-96 overflow-y-auto pr-2">
                {plan.research.report}
              </div>
              {plan.research.sources?.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {plan.research.sources.map((s, i) => (
                    <a
                      key={i}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-black/35 border border-white/10 text-[#e68628] hover:underline"
                    >
                      🔗 {s.title || 'Fuente'}
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Lista de Piezas del Calendario Inteligente */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-extrabold text-[#ece7d7]">
            <Film className="w-4 h-4 text-[#e68628]" />
            <span>
              Plan Acción por Acción ({plan.items?.length || 0} piezas) — Abrí cualquiera para
              revelar su fotografía realista y locución porteña
            </span>
          </div>
        </div>

        {(plan.items || []).map((it, idx) => (
          <StrategyPieceCard
            key={`${it.date}_${idx}`}
            index={idx}
            autoGenerateOnMount={idx === 0}
            item={it}
            product={products.find((p) => p.id === Number(it.product_id)) || products[0]}
            dna={dna}
            onChange={(updated) => updateItem(idx, updated)}
            onError={setError}
          />
        ))}
      </div>
    </div>
  );
};
