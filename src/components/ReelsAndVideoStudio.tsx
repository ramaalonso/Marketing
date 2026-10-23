import React, { useEffect, useRef, useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Video,
  Volume2,
  VolumeX,
  Copy,
  Sparkles,
  Tv,
  Download,
  CheckCircle2,
  Mic,
  Film
} from 'lucide-react';
import { BrandDNA, GeneratedAsset, ReelProject, YerbazoProduct } from '../types/holo';
import {
  formatArs,
  generateReelProjectForProduct
} from '../services/yerbazoHoloEngine';
import { loadSafeImage } from '../utils/canvasRenderer';
import { ARGENTINE_VOICES } from './AIStrategist';

interface ReelsAndVideoStudioProps {
  products: YerbazoProduct[];
  dna: BrandDNA;
  initialAsset?: GeneratedAsset | null;
}

export const ReelsAndVideoStudio: React.FC<ReelsAndVideoStudioProps> = ({
  products,
  dna,
  initialAsset
}) => {
  const defaultProd =
    products.find((p) => p.id === initialAsset?.productIds?.[0]) || products[0];

  const [selectedProdId, setSelectedProdId] = useState<number>(defaultProd.id);
  const [selectedStyle, setSelectedStyle] = useState<ReelProject['style']>(
    initialAsset?.reelProject?.style || 'pov_matero'
  );
  const [reel, setReel] = useState<ReelProject>(() =>
    initialAsset?.reelProject ||
    generateReelProjectForProduct(defaultProd, dna, 'pov_matero')
  );

  const [activeSceneIdx, setActiveSceneIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [selectedVoice, setSelectedVoice] = useState<string>('tomas');
  const [reelBackdropUrl, setReelBackdropUrl] = useState<string>('');
  const [loadingReelBg, setLoadingReelBg] = useState(false);
  const [teleprompterOpen, setTeleprompterOpen] = useState(false);
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(performance.now());

  const currentProduct =
    products.find((p) => p.id === selectedProdId) || products[0];

  useEffect(() => {
    if (initialAsset?.reelProject) {
      setReel(initialAsset.reelProject);
      setSelectedProdId(initialAsset.reelProject.productId);
      setSelectedStyle(initialAsset.reelProject.style);
      setActiveSceneIdx(0);
    }
  }, [initialAsset]);

  const handleRegenerateReel = (prodId: number, style: ReelProject['style']) => {
    const prod = products.find((p) => p.id === prodId) || products[0];
    const nextReel = generateReelProjectForProduct(prod, dna, style);
    setReel(nextReel);
    setActiveSceneIdx(0);
    setIsPlaying(false);
    audioElRef.current?.pause();
  };

  // Voz humana neural rioplatense (Gemini 3.8 TTS vía servidor)
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const speakSceneText = async (text: string) => {
    if (!voiceEnabled) return;
    try {
      audioElRef.current?.pause();
      const res = await fetch('/api/ai-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice: selectedVoice })
      });
      if (!res.ok) return;
      const url = URL.createObjectURL(await res.blob());
      audioElRef.current = new Audio(url);
      audioElRef.current.play();
    } catch {
      // ignore
    }
  };

  const handleGenerateReelBackdrop = async () => {
    setLoadingReelBg(true);
    try {
      const res = await fetch('/api/ai-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt:
            'Warm morning sunlight on a wooden Buenos Aires balcony table, steaming leather imperial mate gourd and thermos softly blurred in bokeh background, clean foreground surface, vertical 9:16 commercial photography, 50mm f1.8',
          aspect: '9:16',
          seed: Math.floor(100000 + Math.random() * 899999)
        })
      });
      const data = await res.json();
      if (data?.image) setReelBackdropUrl(data.image);
    } catch {
      // ignore
    }
    setLoadingReelBg(false);
  };

  // Playback controller across scenes
  useEffect(() => {
    if (!isPlaying) return;
    const currentScene = reel.scenes[activeSceneIdx];
    if (!currentScene) {
      setIsPlaying(false);
      return;
    }

    speakSceneText(currentScene.voiceoverScript);

    const timer = setTimeout(() => {
      if (activeSceneIdx < reel.scenes.length - 1) {
        setActiveSceneIdx((i) => i + 1);
      } else {
        setIsPlaying(false);
        setActiveSceneIdx(0);
      }
    }, currentScene.durationSec * 1000);

    return () => clearTimeout(timer);
  }, [isPlaying, activeSceneIdx, reel]);

  // 30fps Animated 9:16 Reel Canvas Renderer
  useEffect(() => {
    let mounted = true;
    let prodImg: HTMLImageElement | null = null;
    let logoImg: HTMLImageElement | null = null;
    let bgPhotoImg: HTMLImageElement | null = null;

    Promise.all([
      loadSafeImage(currentProduct.image),
      loadSafeImage('/logo.webp'),
      reelBackdropUrl ? loadSafeImage(reelBackdropUrl) : Promise.resolve(null)
    ]).then(([pImg, lImg, bImg]) => {
      prodImg = pImg;
      logoImg = lImg;
      bgPhotoImg = bImg;
    });

    startTimeRef.current = performance.now();

    const renderFrame = (now: number) => {
      if (!mounted || !canvasRef.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const W = 540;
      const H = 960;
      if (canvas.width !== W) canvas.width = W;
      if (canvas.height !== H) canvas.height = H;

      const elapsed = (now - startTimeRef.current) / 1000;
      const scene = reel.scenes[activeSceneIdx] || reel.scenes[0];

      if (bgPhotoImg) {
        const zoom = 1.05 + Math.sin(elapsed * 0.4) * 0.04;
        const sc = Math.max(W / bgPhotoImg.width, H / bgPhotoImg.height) * zoom;
        const dw = bgPhotoImg.width * sc;
        const dh = bgPhotoImg.height * sc;
        ctx.drawImage(bgPhotoImg, (W - dw) / 2, (H - dh) / 2, dw, dh);
        ctx.fillStyle = 'rgba(5, 16, 9, 0.35)';
        ctx.fillRect(0, 0, W, H);
      } else {
        // Dynamic background gradient
        const bgGrad = ctx.createLinearGradient(0, 0, W, H);
        if (reel.style === 'oferta_relampago') {
          bgGrad.addColorStop(0, '#300f06');
          bgGrad.addColorStop(1, '#0f4b25');
        } else {
          bgGrad.addColorStop(0, '#0f4b25');
          bgGrad.addColorStop(1, '#06170b');
        }
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, W, H);
      }

      // Animated radial pulse
      const pulseRadius = 220 + Math.sin(elapsed * 3) * 28;
      const glow = ctx.createRadialGradient(W / 2, H * 0.44, 15, W / 2, H * 0.44, pulseRadius);
      glow.addColorStop(0, 'rgba(230, 134, 40, 0.35)');
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);

      // Top Story/Reel Progress Segments
      const segW = (W - 48 - (reel.scenes.length - 1) * 6) / reel.scenes.length;
      reel.scenes.forEach((_, idx) => {
        const x = 24 + idx * (segW + 6);
        ctx.fillStyle = idx <= activeSceneIdx ? '#e68628' : 'rgba(255,255,255,0.22)';
        ctx.fillRect(x, 22, segW, 5);
      });

      // Brand Header
      if (logoImg) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(46, 62, 18, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(logoImg, 28, 44, 36, 36);
        ctx.restore();
      }
      ctx.fillStyle = '#ece7d7';
      ctx.font = '800 16px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(dna.instagramHandle || '@yerbazo.ar', 72, 60);
      ctx.fillStyle = '#e68628';
      ctx.font = '700 12px Inter, sans-serif';
      ctx.fillText(scene.phase, 72, 76);

      // Top Badge Overlay
      if (scene.badgeOverlay) {
        ctx.fillStyle = '#e68628';
        ctx.beginPath();
        ctx.roundRect(W / 2 - 130, 102, 260, 34, 17);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = '900 14px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(scene.badgeOverlay, W / 2, 124);
      }

      // Animated Product Image in center
      if (prodImg) {
        const floatY = Math.sin(elapsed * 2.6) * 12;
        const scale =
          scene.animationStyle === 'zoom_punch'
            ? 1 + Math.min(0.14, (elapsed % 3) * 0.05)
            : 1 + Math.sin(elapsed * 2) * 0.03;

        const baseH = 340 * scale;
        const baseW = (prodImg.width / prodImg.height) * baseH;

        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.6)';
        ctx.shadowBlur = 30;
        ctx.drawImage(prodImg, W / 2 - baseW / 2, H * 0.42 - baseH / 2 + floatY, baseW, baseH);
        ctx.restore();
      }

      // Price Sticker
      const effectivePrice =
        currentProduct.isSale && currentProduct.salePrice
          ? currentProduct.salePrice
          : currentProduct.price;
      ctx.fillStyle = '#e68628';
      ctx.beginPath();
      ctx.roundRect(W - 175, H * 0.54, 145, 56, 16);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 24px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(formatArs(effectivePrice), W - 102, H * 0.54 + 37);

      // Hormozi-style Dynamic Captions Box at bottom
      const captionBoxY = H - 270;
      ctx.fillStyle = 'rgba(8, 22, 13, 0.88)';
      ctx.strokeStyle = '#e68628';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(28, captionBoxY, W - 56, 145, 22);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fbbf24';
      ctx.font = '900 22px "Plus Jakarta Sans", Inter, sans-serif';
      ctx.textAlign = 'center';

      // Wrap caption text
      const words = scene.onScreenText.split(' ');
      let line = '';
      let y = captionBoxY + 46;
      for (let i = 0; i < words.length; i++) {
        const test = line + words[i] + ' ';
        if (ctx.measureText(test).width > W - 96 && i > 0) {
          ctx.fillText(line.trim(), W / 2, y);
          line = words[i] + ' ';
          y += 30;
        } else {
          line = test;
        }
      }
      if (line.trim()) ctx.fillText(line.trim(), W / 2, y);

      // Bottom CTA Button
      ctx.fillStyle = '#e68628';
      ctx.beginPath();
      ctx.roundRect(44, H - 96, W - 88, 56, 28);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 17px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(
        `PEDIR EN YERBAZO.COM.AR • CUPÓN ${dna.activeCoupon.code}`,
        W / 2,
        H - 62
      );

      animFrameRef.current = requestAnimationFrame(renderFrame);
    };

    animFrameRef.current = requestAnimationFrame(renderFrame);
    return () => {
      mounted = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [reel, activeSceneIdx, currentProduct, dna, reelBackdropUrl]);

  // Export Animated Reel as Downloadable Video (.webm) using MediaRecorder
  const handleExportVideo = async () => {
    if (!canvasRef.current || isRecordingVideo) return;
    setIsRecordingVideo(true);
    setActiveSceneIdx(0);
    setIsPlaying(true);

    try {
      const stream = canvasRef.current.captureStream(30);
      const recorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
          ? 'video/webm;codecs=vp9'
          : 'video/webm'
      });

      const chunks: BlobPart[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `yerbazo-reel-${currentProduct.title.toLowerCase().replace(/\s+/g, '-')}.webm`;
        a.click();
        setIsRecordingVideo(false);
      };

      recorder.start();
      // Record 8 seconds showcase of the animated reel
      setTimeout(() => {
        if (recorder.state === 'recording') recorder.stop();
      }, 8000);
    } catch {
      setIsRecordingVideo(false);
    }
  };

  const fullScriptText = reel.scenes
    .map(
      (s) =>
        `[${s.phase}]\n🎬 Visual: ${s.visualDirection}\n🗣️ Voz: "${s.voiceoverScript}"\n📱 Texto en pantalla: ${s.onScreenText}`
    )
    .join('\n\n');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Column: Script & Scene Editor (7 cols) */}
      <div className="lg:col-span-7 space-y-5">
        <div className="rounded-2xl border border-white/10 bg-[#0d2415] p-5 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#e68628]">
                Fábrica de Reels, TikToks & Videos UGC (Estilo Creatify + Holo Video)
              </span>
              <h2 className="text-xl font-extrabold text-[#ece7d7]">
                Generador de Guiones, Escenas Animadas y Teleprompter
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setTeleprompterOpen(!teleprompterOpen)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#ece7d7] text-xs font-bold border border-white/15 transition"
              >
                <Tv className="w-4 h-4 text-[#e68628]" />
                {teleprompterOpen ? 'Cerrar Teleprompter' : 'Modo Teleprompter'}
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(fullScriptText);
                  setCopiedScript(true);
                  setTimeout(() => setCopiedScript(false), 2000);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#e68628] hover:bg-[#f39c42] text-white text-xs font-extrabold transition"
              >
                <Copy className="w-4 h-4" />
                {copiedScript ? '¡Guion Copiado!' : 'Copiar Guion Completo'}
              </button>
            </div>
          </div>

          {/* Voice & Photorealistic Backdrop Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 rounded-xl bg-black/30 border border-[#e68628]/30">
            <div>
              <label className="block text-xs font-bold text-[#e68628] mb-1">
                🎙️ Voz Humana Neural Rioplatense (Gemini 3.8 TTS)
              </label>
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/15 text-xs font-bold text-[#ece7d7]"
              >
                {ARGENTINE_VOICES.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleGenerateReelBackdrop}
                disabled={loadingReelBg}
                className="w-full py-2 px-3 rounded-lg bg-[#0f4b25] hover:bg-[#176936] border border-[#e68628]/50 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#e68628]" />
                {loadingReelBg
                  ? 'Creando fondo realista…'
                  : reelBackdropUrl
                  ? 'Cambiar Escena Fotográfica 9:16'
                  : 'Generar Escena Fotográfica Real 9:16'}
              </button>
            </div>
          </div>

          {/* Product & Reel Format Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#ece7d7]/80 mb-1.5">
                Producto Protagonista del Reel
              </label>
              <select
                value={selectedProdId}
                onChange={(e) => {
                  const id = Number(e.target.value);
                  setSelectedProdId(id);
                  handleRegenerateReel(id, selectedStyle);
                }}
                className="w-full px-3 py-2.5 rounded-xl bg-black/35 border border-white/15 text-xs font-bold text-[#ece7d7]"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} — {formatArs(p.isSale && p.salePrice ? p.salePrice : p.price)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#ece7d7]/80 mb-1.5">
                Estilo de Creador / Formato Viral
              </label>
              <select
                value={selectedStyle}
                onChange={(e) => {
                  const st = e.target.value as ReelProject['style'];
                  setSelectedStyle(st);
                  handleRegenerateReel(selectedProdId, st);
                }}
                className="w-full px-3 py-2.5 rounded-xl bg-black/35 border border-white/15 text-xs font-bold text-[#ece7d7]"
              >
                <option value="pov_matero">🧉 POV Cebador Experto (Primera Persona)</option>
                <option value="ugc_influencer">🤳 Influencer / Reseña UGC Descontracturada</option>
                <option value="oferta_relampago">⚡ Alerta Flash de Oferta / Últimas Unidades</option>
                <option value="mito_realidad">🧠 Mito vs. Realidad Matera (Educativo)</option>
                <option value="asmr_cebada">🎙️ Ritual ASMR Matero (Sonido + Espuma)</option>
                <option value="tier_list">🏆 Ranking / Debate Matero (Viral en Comentarios)</option>
              </select>
            </div>
          </div>

          {/* Teleprompter View if Open */}
          {teleprompterOpen && (
            <div className="rounded-2xl bg-black/90 border-2 border-[#e68628] p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/15 pb-3">
                <span className="text-xs font-extrabold uppercase text-[#e68628]">
                  🎙️ Teleprompter Listo para Grabar con tu Celular
                </span>
                <span className="text-xs text-[#ece7d7]/60">
                  Duración total: ~20 segundos
                </span>
              </div>
              <div className="space-y-4 text-lg sm:text-xl font-bold text-[#ece7d7] leading-relaxed">
                {reel.scenes.map((s) => (
                  <p key={s.id} className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-xs font-extrabold text-[#e68628] block mb-1">
                      {s.phase} — ({s.visualDirection})
                    </span>
                    "{s.voiceoverScript}"
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* 5 Interactive Scenes Breakdown */}
          <div className="space-y-3">
            {reel.scenes.map((scene, idx) => {
              const isCurrent = idx === activeSceneIdx;
              return (
                <div
                  key={scene.id}
                  onClick={() => setActiveSceneIdx(idx)}
                  className={`p-4 rounded-xl border transition cursor-pointer ${
                    isCurrent
                      ? 'bg-[#0f4b25] border-[#e68628] shadow-lg ring-1 ring-[#e68628]'
                      : 'bg-black/25 border-white/10 hover:border-white/25'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#e68628] text-white text-[11px] font-black">
                        Escena {idx + 1}: {scene.phase}
                      </span>
                      <span className="text-xs text-[#ece7d7]/60">{scene.durationSec}s</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveSceneIdx(idx);
                        speakSceneText(scene.voiceoverScript);
                      }}
                      className="text-xs font-bold text-[#e68628] hover:underline flex items-center gap-1"
                    >
                      <Mic className="w-3.5 h-3.5" /> Escuchar Voz
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#ece7d7]/60 mb-1">
                        Subtítulo en Pantalla (Captions)
                      </label>
                      <input
                        type="text"
                        value={scene.onScreenText}
                        onChange={(e) => {
                          const nextScenes = [...reel.scenes];
                          nextScenes[idx] = { ...scene, onScreenText: e.target.value };
                          setReel({ ...reel, scenes: nextScenes });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-black/35 border border-white/15 text-xs font-bold text-[#ece7d7]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#ece7d7]/60 mb-1">
                        Locución / Guion Hablado
                      </label>
                      <input
                        type="text"
                        value={scene.voiceoverScript}
                        onChange={(e) => {
                          const nextScenes = [...reel.scenes];
                          nextScenes[idx] = { ...scene, voiceoverScript: e.target.value };
                          setReel({ ...reel, scenes: nextScenes });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-black/35 border border-white/15 text-xs text-[#ece7d7]"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Column: Live 9:16 Animated Reel Player & Exporter (5 cols) */}
      <div className="lg:col-span-5 sticky top-20 space-y-4">
        <div className="rounded-2xl border border-[#e68628]/40 bg-[#0d2415] p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4 text-[#e68628]" />
              <span className="text-sm font-extrabold text-[#ece7d7]">
                Reproductor de Reel 9:16 en Vivo
              </span>
            </div>

            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border ${
                voiceEnabled
                  ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40'
                  : 'bg-black/40 text-[#ece7d7]/60 border-white/10'
              }`}
            >
              {voiceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              {voiceEnabled ? 'Voz IA Activa' : 'Silenciado'}
            </button>
          </div>

          <div className="bg-black/70 rounded-xl p-3 flex items-center justify-center border border-white/10">
            <canvas
              ref={canvasRef}
              className="max-h-[470px] w-auto rounded-xl shadow-2xl object-contain"
            />
          </div>

          {/* Playback & Video Export Controls */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="py-3 px-4 rounded-xl bg-[#0f4b25] hover:bg-[#176936] border border-[#e68628]/50 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg transition"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? 'Pausar Reel' : 'Reproducir Reel + Voz'}
            </button>

            <button
              onClick={handleExportVideo}
              disabled={isRecordingVideo}
              className="py-3 px-4 rounded-xl bg-[#e68628] hover:bg-[#f39c42] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-xl transition disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {isRecordingVideo ? 'Grabando Video (8s)...' : 'Descargar Video (.webm)'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
