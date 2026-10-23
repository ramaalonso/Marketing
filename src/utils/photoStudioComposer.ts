import { BrandDNA, YerbazoProduct } from '../types/holo';
import { formatArs } from '../services/yerbazoHoloEngine';
import { loadSafeImage } from './canvasRenderer';

export interface StudioComposeParams {
  canvas: HTMLCanvasElement;
  backdropUrl: string;
  aspect: '1:1' | '4:5' | '9:16';
  visualMode: 'product_scene' | 'editorial_concept';
  funnel: 'TOFU' | 'MOFU' | 'BOFU' | 'Recompra' | string;
  headline: string;
  subline?: string;
  cta?: string;
  product?: YerbazoProduct;
  dna: BrandDNA;
  showTextOverlay?: boolean;
}

function getTargetDims(aspect: '1:1' | '4:5' | '9:16') {
  if (aspect === '1:1') return { w: 1080, h: 1080 };
  if (aspect === '4:5') return { w: 1080, h: 1350 };
  return { w: 1080, h: 1920 };
}

function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  w: number,
  h: number,
  scaleBoost = 1,
  offsetY = 0
) {
  const scale = Math.max(w / img.width, h / img.height) * scaleBoost;
  const dw = img.width * scale;
  const dh = img.height * scale;
  ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2 + offsetY, dw, dh);
}

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = (text || '').trim().split(/\s+/);
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const rad = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.arcTo(x + w, y, x + w, y + h, rad);
  ctx.arcTo(x + w, y + h, x, y + h, rad);
  ctx.arcTo(x, y + h, x, y, rad);
  ctx.arcTo(x, y, x + w, y, rad);
  ctx.closePath();
}

// Micro-grano fotográfico sutil para unificar el paquete real con la fotografía de fondo
function applySubtleFilmGrain(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const grainCanvas = document.createElement('canvas');
  grainCanvas.width = 180;
  grainCanvas.height = 180;
  const gctx = grainCanvas.getContext('2d');
  if (!gctx) return;
  const imgData = gctx.createImageData(180, 180);
  const d = imgData.data;
  for (let i = 0; i < d.length; i += 4) {
    const v = Math.random() * 255;
    d[i] = v;
    d[i + 1] = v;
    d[i + 2] = v;
    d[i + 3] = 9; // muy sutil
  }
  gctx.putImageData(imgData, 0, 0);
  const pattern = ctx.createPattern(grainCanvas, 'repeat');
  if (pattern) {
    ctx.save();
    ctx.globalCompositeOperation = 'overlay';
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }
}

export async function renderAgencyPhotoPiece(params: StudioComposeParams): Promise<void> {
  const {
    canvas,
    backdropUrl,
    aspect,
    visualMode,
    funnel,
    headline,
    subline,
    cta,
    product,
    dna,
    showTextOverlay = true
  } = params;

  const { w, h } = getTargetDims(aspect);
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 1. Fondo fotográfico realista
  const bgImg = await loadSafeImage(backdropUrl);
  if (bgImg) {
    drawCoverImage(ctx, bgImg, w, h);
  } else {
    const fallbackGrad = ctx.createLinearGradient(0, 0, w, h);
    fallbackGrad.addColorStop(0, '#123520');
    fallbackGrad.addColorStop(1, '#07140c');
    ctx.fillStyle = fallbackGrad;
    ctx.fillRect(0, 0, w, h);
  }

  // Viñeteado óptico suave de lente full-frame
  const vignette = ctx.createRadialGradient(w / 2, h * 0.45, w * 0.25, w / 2, h * 0.5, h * 0.78);
  vignette.addColorStop(0, 'rgba(0,0,0,0)');
  vignette.addColorStop(1, 'rgba(4,12,7,0.48)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, w, h);

  // 2. Integración física del paquete real de Yerbazo (cuando es escena de producto)
  if (visualMode === 'product_scene' && product?.image) {
    const prodImg = await loadSafeImage(product.image);
    if (prodImg) {
      const targetProdH = aspect === '1:1' ? h * 0.52 : aspect === '4:5' ? h * 0.48 : h * 0.43;
      const targetProdW = (prodImg.width / prodImg.height) * targetProdH;
      const prodX = (w - targetProdW) / 2;
      const prodBaseY = aspect === '9:16' ? h * 0.66 : h * 0.7;
      const prodY = prodBaseY - targetProdH;

      // A) Sombra proyectada amplia y difusa sobre la superficie
      ctx.save();
      const castShadow = ctx.createRadialGradient(
        w / 2 + 24,
        prodBaseY - 8,
        12,
        w / 2 + 24,
        prodBaseY - 8,
        targetProdW * 0.78
      );
      castShadow.addColorStop(0, 'rgba(5, 10, 6, 0.72)');
      castShadow.addColorStop(0.55, 'rgba(5, 10, 6, 0.32)');
      castShadow.addColorStop(1, 'rgba(5, 10, 6, 0)');
      ctx.setTransform(1, 0, 0, 0.24, 0, prodBaseY * 0.76);
      ctx.fillStyle = castShadow;
      ctx.beginPath();
      ctx.arc(w / 2 + 24, prodBaseY, targetProdW * 0.78, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // B) Sombra de contacto estrecha (Ambient Occlusion justo en la base del paquete)
      ctx.save();
      const contactShadow = ctx.createRadialGradient(
        w / 2,
        prodBaseY - 4,
        4,
        w / 2,
        prodBaseY - 4,
        targetProdW * 0.48
      );
      contactShadow.addColorStop(0, 'rgba(0, 0, 0, 0.88)');
      contactShadow.addColorStop(0.7, 'rgba(0, 0, 0, 0.42)');
      contactShadow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.setTransform(1, 0, 0, 0.12, 0, prodBaseY * 0.88);
      ctx.fillStyle = contactShadow;
      ctx.beginPath();
      ctx.arc(w / 2, prodBaseY, targetProdW * 0.48, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // C) Luz cálida ambiental detrás del producto (integra bordes con la escena)
      const rimGlow = ctx.createRadialGradient(
        w / 2,
        prodY + targetProdH * 0.45,
        20,
        w / 2,
        prodY + targetProdH * 0.45,
        targetProdW * 0.85
      );
      rimGlow.addColorStop(0, 'rgba(255, 214, 153, 0.18)');
      rimGlow.addColorStop(1, 'rgba(255, 214, 153, 0)');
      ctx.fillStyle = rimGlow;
      ctx.fillRect(0, 0, w, h);

      // D) Dibujar paquete real nítido con sombra suave
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.42)';
      ctx.shadowBlur = 32;
      ctx.shadowOffsetY = 14;
      ctx.drawImage(prodImg, prodX, prodY, targetProdW, targetProdH);
      ctx.restore();
    }
  }

  // Aplicar micro-grano fotográfico antes de la tipografía editorial
  applySubtleFilmGrain(ctx, w, h);

  if (!showTextOverlay) return;

  // 3. Dirección de Arte Editorial adaptada al Objetivo del Embudo (TOFU vs MOFU vs BOFU)
  const gradTopStart = aspect === '9:16' ? h * 0.54 : h * 0.52;
  const bottomGrad = ctx.createLinearGradient(0, gradTopStart, 0, h);
  bottomGrad.addColorStop(0, 'rgba(6, 16, 10, 0)');
  bottomGrad.addColorStop(0.45, 'rgba(6, 16, 10, 0.68)');
  bottomGrad.addColorStop(1, 'rgba(5, 14, 9, 0.94)');
  ctx.fillStyle = bottomGrad;
  ctx.fillRect(0, gradTopStart, w, h - gradTopStart);

  // Marca de agua editorial sutil arriba
  const logoImg = await loadSafeImage('/logo.webp');
  const topPad = aspect === '9:16' ? 86 : 54;
  if (logoImg) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(82, topPad + 24, 28, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(logoImg, 54, topPad - 4, 56, 56);
    ctx.restore();
  }
  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  ctx.font = '800 24px "Plus Jakarta Sans", Inter, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('YERBAZO', logoImg ? 124 : 58, topPad + 32);

  // Insignia superior derecha SOLO en MOFU/BOFU (en TOFU se mantiene 100% orgánico sin pinta de anuncio)
  if ((funnel === 'BOFU' || funnel === 'Recompra') && product) {
    const effectivePrice =
      product.isSale && product.salePrice ? product.salePrice : product.price;
    const tagText =
      product.stockStatus === 'ultimas'
        ? `ÚLTIMAS UNIDADES · ${formatArs(effectivePrice)}`
        : product.isSale
        ? `OFERTA WEB · ${formatArs(effectivePrice)}`
        : `${product.weight || '1 KG'} · ${formatArs(effectivePrice)}`;

    ctx.font = '800 22px Inter, sans-serif';
    const tw = ctx.measureText(tagText).width + 44;
    const tx = w - tw - 54;
    ctx.fillStyle = 'rgba(230, 134, 40, 0.95)';
    roundRectPath(ctx, tx, topPad - 2, tw, 50, 25);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(tagText, tx + tw / 2, topPad + 31);
  } else if (funnel === 'MOFU' && product) {
    const infoTag = `${product.origen.toUpperCase()} · ${product.duracionTermos.toUpperCase()}`;
    ctx.font = '700 19px Inter, sans-serif';
    const tw = Math.min(w - 280, ctx.measureText(infoTag).width + 40);
    const tx = w - tw - 54;
    ctx.fillStyle = 'rgba(10, 28, 17, 0.72)';
    ctx.strokeStyle = 'rgba(236, 231, 215, 0.35)';
    ctx.lineWidth = 2;
    roundRectPath(ctx, tx, topPad - 2, tw, 46, 23);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#ece7d7';
    ctx.textAlign = 'center';
    ctx.fillText(infoTag, tx + tw / 2, topPad + 28);
  }

  // Bloque tipográfico inferior estilo campaña internacional
  const marginX = 68;
  const bottomSafe = aspect === '9:16' ? 190 : 86;

  ctx.textAlign = 'left';
  ctx.font = '900 66px "Plus Jakarta Sans", Inter, sans-serif';
  const cleanHeadline = (headline || '').replace(/^["“]|["”]$/g, '');
  const headLines = wrapLines(ctx, cleanHeadline, w - marginX * 2).slice(0, 3);
  const lineH = 74;

  const subText =
    subline ||
    (funnel === 'BOFU' && product
      ? `Pedí hoy en yerbazo.com.ar · ${product.duracionTermos}`
      : `${dna.instagramHandle}  ·  yerbazo.com.ar`);

  let yCursor = h - bottomSafe - (funnel === 'BOFU' ? 92 : 42) - (headLines.length - 1) * lineH;

  // Línea de acento editorial naranja arriba del titular
  ctx.fillStyle = '#e68628';
  roundRectPath(ctx, marginX, yCursor - 76, 68, 7, 3.5);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  for (const line of headLines) {
    ctx.fillText(line, marginX, yCursor);
    yCursor += lineH;
  }

  if (funnel === 'BOFU' && cta) {
    // Barra CTA limpia de conversión para piezas BOFU
    const btnY = yCursor + 8;
    ctx.font = '800 24px "Plus Jakarta Sans", Inter, sans-serif';
    const btnLabel = `${cta.toUpperCase()}  →  YERBAZO.COM.AR`;
    const btnW = Math.min(w - marginX * 2, ctx.measureText(btnLabel).width + 64);
    ctx.fillStyle = '#e68628';
    roundRectPath(ctx, marginX, btnY, btnW, 60, 30);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillText(btnLabel, marginX + 32, btnY + 39);
  } else {
    ctx.font = '600 27px Inter, sans-serif';
    ctx.fillStyle = 'rgba(236, 231, 215, 0.86)';
    ctx.fillText(subText, marginX, yCursor + 6);
  }
}
