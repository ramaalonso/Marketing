import { BrandDNA, VisualStudioConfig, YerbazoProduct } from '../types/holo';
import { formatArs } from '../services/yerbazoHoloEngine';

const imageCache = new Map<string, HTMLImageElement>();

export async function loadSafeImage(url: string): Promise<HTMLImageElement | null> {
  if (!url) return null;
  if (imageCache.has(url)) {
    return imageCache.get(url)!;
  }

  const tryLoad = (src: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(e);
      img.src = src;
    });

  // 1. Try via local/cloud CORS proxy first so canvas.toDataURL('image/png') never taints
  if (url.startsWith('https://')) {
    try {
      const proxied = await tryLoad(`/api/image-proxy?url=${encodeURIComponent(url)}`);
      imageCache.set(url, proxied);
      return proxied;
    } catch {
      // Fallback to direct
    }
  }

  try {
    const direct = await tryLoad(url);
    imageCache.set(url, direct);
    return direct;
  } catch {
    return null;
  }
}

export function getCanvasDimensions(aspectRatio: VisualStudioConfig['aspectRatio']): {
  width: number;
  height: number;
} {
  if (aspectRatio === '1:1') return { width: 1080, height: 1080 };
  if (aspectRatio === '4:5') return { width: 1080, height: 1350 };
  return { width: 1080, height: 1920 }; // 9:16
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines = 4
): number {
  const words = (text || '').split(' ');
  let line = '';
  let currentY = y;
  let linesCount = 0;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      linesCount++;
      if (linesCount >= maxLines) {
        ctx.fillText(line.trim() + '...', x, currentY);
        return currentY + lineHeight;
      }
      ctx.fillText(line.trim(), x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line.trim()) {
    ctx.fillText(line.trim(), x, currentY);
    currentY += lineHeight;
  }
  return currentY;
}

export async function renderMarketingCanvas(params: {
  canvas: HTMLCanvasElement;
  config: VisualStudioConfig;
  product: YerbazoProduct;
  secondaryProduct?: YerbazoProduct;
  dna: BrandDNA;
  activeSlideIndex?: number;
}): Promise<void> {
  const { canvas, config, product, secondaryProduct, dna, activeSlideIndex = 0 } = params;
  const { width, height } = getCanvasDimensions(config.aspectRatio);
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Theme palette
  const themes = {
    selva_gold: {
      bgStart: '#0f4b25',
      bgEnd: '#06200f',
      textPrimary: '#ece7d7',
      textMuted: '#b9ceb8',
      accent: '#e68628',
      cardBg: 'rgba(255, 255, 255, 0.08)',
      cardBorder: 'rgba(230, 134, 40, 0.45)'
    },
    crema_editorial: {
      bgStart: '#ece7d7',
      bgEnd: '#dfd6be',
      textPrimary: '#0f4b25',
      textMuted: '#365842',
      accent: '#e68628',
      cardBg: 'rgba(15, 75, 37, 0.08)',
      cardBorder: 'rgba(15, 75, 37, 0.25)'
    },
    noche_neon: {
      bgStart: '#09110c',
      bgEnd: '#0f2d19',
      textPrimary: '#ffffff',
      textMuted: '#a3c9b0',
      accent: '#f59e0b',
      cardBg: 'rgba(245, 158, 11, 0.12)',
      cardBorder: 'rgba(245, 158, 11, 0.5)'
    },
    fuego_oferta: {
      bgStart: '#2d0e07',
      bgEnd: '#0f4b25',
      textPrimary: '#fff8eb',
      textMuted: '#fed7aa',
      accent: '#f97316',
      cardBg: 'rgba(249, 115, 22, 0.16)',
      cardBorder: 'rgba(251, 146, 60, 0.6)'
    }
  };

  const theme = themes[config.bgTheme] || themes.selva_gold;

  // 1. Background Gradient
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, theme.bgStart);
  grad.addColorStop(1, theme.bgEnd);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Decorative studio glow behind center
  const glow = ctx.createRadialGradient(
    width * 0.5,
    height * 0.46,
    40,
    width * 0.5,
    height * 0.46,
    width * 0.55
  );
  glow.addColorStop(0, config.bgTheme === 'crema_editorial' ? 'rgba(230, 134, 40, 0.22)' : 'rgba(230, 134, 40, 0.28)');
  glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  // Subtle decorative grid pattern
  ctx.strokeStyle = config.bgTheme === 'crema_editorial' ? 'rgba(15,75,37,0.05)' : 'rgba(236,231,215,0.04)';
  ctx.lineWidth = 2;
  for (let x = 0; x < width; x += 90) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += 90) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // 2. Top Brand Header Bar
  const topY = config.aspectRatio === '9:16' ? 88 : 56;
  const logoImg = await loadSafeImage('/logo.webp');

  if (logoImg) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(92, topY + 28, 36, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(logoImg, 56, topY - 8, 72, 72);
    ctx.restore();
  }

  ctx.fillStyle = theme.textPrimary;
  ctx.font = '900 32px "Plus Jakarta Sans", Inter, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(dna.brandName.toUpperCase(), logoImg ? 142 : 64, topY + 26);

  ctx.fillStyle = theme.textMuted;
  ctx.font = '600 20px Inter, sans-serif';
  ctx.fillText(dna.websiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, ''), logoImg ? 142 : 64, topY + 52);

  // Top Right Badge Pill
  if (config.badgeText) {
    ctx.font = '800 22px Inter, sans-serif';
    const badgeMetrics = ctx.measureText(config.badgeText);
    const pillW = badgeMetrics.width + 48;
    const pillH = 52;
    const pillX = width - pillW - 60;
    const pillY = topY + 2;

    ctx.fillStyle = theme.accent;
    drawRoundedRect(ctx, pillX, pillY, pillW, pillH, 26);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(config.badgeText, pillX + pillW / 2, pillY + 34);
  }

  // Load main product image (and secondary if Versus/Combo)
  const mainImgUrl = config.customImageUrl || product.image;
  const prodImg = await loadSafeImage(mainImgUrl);
  const secImg = secondaryProduct ? await loadSafeImage(secondaryProduct.image) : null;

  const effectivePrice = product.isSale && product.salePrice ? product.salePrice : product.price;

  // Handle CAROUSEL 5x Template specifically
  if (config.templateId === 'carrusel_secuencia') {
    const slides = config.carouselSlides || [];
    const slide = slides[activeSlideIndex] || slides[0] || {
      slideNumber: 1,
      badge: 'YERBAZO',
      headline: config.headline,
      body: config.subheadline
    };

    // Slide counter indicator
    ctx.fillStyle = theme.cardBg;
    drawRoundedRect(ctx, 64, topY + 95, 190, 44, 22);
    ctx.fill();
    ctx.fillStyle = theme.accent;
    ctx.font = '800 20px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`SLIDE ${slide.slideNumber} DE ${slides.length || 5}`, 159, topY + 124);

    // Headline
    ctx.fillStyle = theme.textPrimary;
    ctx.font = '900 54px "Plus Jakarta Sans", Inter, sans-serif';
    ctx.textAlign = 'left';
    const nextY = wrapText(ctx, slide.headline, 64, topY + 215, width - 128, 64, 3);

    // Body card
    ctx.fillStyle = theme.cardBg;
    ctx.strokeStyle = theme.cardBorder;
    ctx.lineWidth = 3;
    drawRoundedRect(ctx, 64, nextY + 20, width - 128, 220, 28);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = theme.textPrimary;
    ctx.font = '600 30px Inter, sans-serif';
    wrapText(ctx, slide.body.replace(/\n/g, ' • '), 96, nextY + 80, width - 192, 42, 4);

    // Product image on bottom right
    if (prodImg) {
      const imgH = height * 0.36;
      const imgW = (prodImg.width / prodImg.height) * imgH;
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.45)';
      ctx.shadowBlur = 35;
      ctx.drawImage(prodImg, width - imgW - 80, height - imgH - 95, imgW, imgH);
      ctx.restore();
    }

    // Highlight stat badge on bottom left
    if (slide.highlightStat) {
      ctx.fillStyle = theme.accent;
      drawRoundedRect(ctx, 64, height - 220, 440, 110, 24);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 42px "Plus Jakarta Sans", Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(slide.highlightStat, 284, height - 150);
    }
    return;
  }

  // 3. Headline & Subheadline Block
  const headlineY = config.aspectRatio === '9:16' ? topY + 135 : topY + 115;
  ctx.fillStyle = theme.textPrimary;
  ctx.font = config.aspectRatio === '1:1'
    ? '900 50px "Plus Jakarta Sans", Inter, sans-serif'
    : '900 58px "Plus Jakarta Sans", Inter, sans-serif';
  ctx.textAlign = 'center';

  const afterHeadlineY = wrapText(ctx, config.headline, width / 2, headlineY, width - 120, 66, 3);

  ctx.fillStyle = theme.textMuted;
  ctx.font = '600 27px Inter, sans-serif';
  wrapText(ctx, config.subheadline, width / 2, afterHeadlineY + 12, width - 150, 36, 2);

  // 4. Central Visual Stage (Product Image + Template Overlays)
  const stageCenterY = config.aspectRatio === '9:16' ? height * 0.52 : height * 0.54;
  const maxProdHeight = config.aspectRatio === '1:1' ? 430 : config.aspectRatio === '4:5' ? 540 : 680;

  if (config.templateId === 'versus_comparativa' && secondaryProduct && prodImg && secImg) {
    // Draw two products side by side with a glowing VS badge
    const singleH = maxProdHeight * 0.85;
    const w1 = (prodImg.width / prodImg.height) * singleH;
    const w2 = (secImg.width / secImg.height) * singleH;

    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 40;
    ctx.drawImage(prodImg, width * 0.27 - w1 / 2, stageCenterY - singleH / 2, w1, singleH);
    ctx.drawImage(secImg, width * 0.73 - w2 / 2, stageCenterY - singleH / 2, w2, singleH);
    ctx.restore();

    // VS Circle
    ctx.fillStyle = theme.accent;
    ctx.beginPath();
    ctx.arc(width / 2, stageCenterY, 54, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 38px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('VS', width / 2, stageCenterY + 14);
  } else if (prodImg) {
    const prodW = (prodImg.width / prodImg.height) * maxProdHeight;
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.55)';
    ctx.shadowBlur = 48;
    ctx.shadowOffsetY = 22;
    ctx.drawImage(prodImg, width / 2 - prodW / 2, stageCenterY - maxProdHeight / 2, prodW, maxProdHeight);
    ctx.restore();
  }

  // Callout Pills around product (for performance_callouts or hero_oferta)
  if (
    (config.templateId === 'performance_callouts' || config.templateId === 'hero_oferta') &&
    config.callouts.length > 0
  ) {
    const calloutPositions = [
      { x: 64, y: stageCenterY - 150, align: 'left' as const },
      { x: width - 64, y: stageCenterY - 30, align: 'right' as const },
      { x: 64, y: stageCenterY + 110, align: 'left' as const }
    ];

    config.callouts.slice(0, 3).forEach((text, idx) => {
      const pos = calloutPositions[idx];
      if (!pos || !text) return;
      ctx.font = '800 23px Inter, sans-serif';
      const label = `✓ ${text}`;
      const w = ctx.measureText(label).width + 44;
      const boxX = pos.align === 'left' ? pos.x : pos.x - w;

      ctx.fillStyle = config.bgTheme === 'crema_editorial' ? '#0f4b25' : 'rgba(8, 22, 13, 0.9)';
      ctx.strokeStyle = theme.accent;
      ctx.lineWidth = 3;
      drawRoundedRect(ctx, boxX, pos.y, w, 56, 28);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ece7d7';
      ctx.textAlign = 'center';
      ctx.fillText(label, boxX + w / 2, pos.y + 36);
    });
  }

  // Price Tag Sticker on Product
  if (config.showPriceBadge) {
    const priceBoxX = width - 320;
    const priceBoxY = stageCenterY + maxProdHeight * 0.22;

    ctx.save();
    ctx.fillStyle = theme.accent;
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur = 24;
    drawRoundedRect(ctx, priceBoxX, priceBoxY, 260, product.isSale ? 126 : 96, 26);
    ctx.fill();
    ctx.restore();

    ctx.textAlign = 'center';
    if (product.isSale && product.salePrice) {
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.font = '700 22px Inter, sans-serif';
      const oldText = `ANTES ${formatArs(product.price)}`;
      ctx.fillText(oldText, priceBoxX + 130, priceBoxY + 36);
      // Strikethrough line
      const oldW = ctx.measureText(oldText).width;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(priceBoxX + 130 - oldW / 2, priceBoxY + 28);
      ctx.lineTo(priceBoxX + 130 + oldW / 2, priceBoxY + 28);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 46px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(formatArs(effectivePrice), priceBoxX + 130, priceBoxY + 94);
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.font = '700 18px Inter, sans-serif';
      ctx.fillText('PRECIO YERBAZO', priceBoxX + 130, priceBoxY + 32);
      ctx.font = '900 44px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(formatArs(effectivePrice), priceBoxX + 130, priceBoxY + 78);
    }
  }

  // 5. Template-Specific Bottom Interactive / Review Widget
  if (config.templateId === 'review_social') {
    const cardY = height - 370;
    ctx.fillStyle = 'rgba(12, 34, 20, 0.92)';
    ctx.strokeStyle = theme.accent;
    ctx.lineWidth = 3;
    drawRoundedRect(ctx, 72, cardY, width - 144, 190, 28);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#fbbf24';
    ctx.font = '700 28px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('★ ★ ★ ★ ★   COMPRA VERIFICADA EN YERBAZO', width / 2, cardY + 46);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'italic 600 26px Inter, sans-serif';
    wrapText(ctx, `"${config.reviewText || product.testimonioReal.texto}"`, width / 2, cardY + 92, width - 210, 34, 2);

    ctx.fillStyle = theme.accent;
    ctx.font = '800 22px Inter, sans-serif';
    ctx.fillText(`— ${config.reviewAuthor || product.testimonioReal.autor}`, width / 2, cardY + 165);
  } else if (config.aspectRatio === '9:16' && config.storyWidget !== 'none') {
    // Interactive Story Sticker (Poll / Slider / Countdown)
    const stickerY = height - 430;
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0,0,0,0.35)';
    ctx.shadowBlur = 30;
    drawRoundedRect(ctx, 130, stickerY, width - 260, 210, 32);
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = '#0f4b25';
    ctx.font = '900 28px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(
      config.storyQuestion || `¿Ya probaste ${product.title}? 🧉`,
      width / 2,
      stickerY + 56
    );

    // Poll options
    ctx.fillStyle = '#0f4b25';
    drawRoundedRect(ctx, 165, stickerY + 86, (width - 360) / 2, 92, 20);
    ctx.fill();

    ctx.fillStyle = '#e68628';
    drawRoundedRect(ctx, width / 2 + 15, stickerY + 86, (width - 360) / 2, 92, 20);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = '800 24px Inter, sans-serif';
    ctx.fillText(config.storyOptionA || '🔥 La mejor lejos', 165 + (width - 360) / 4, stickerY + 140);
    ctx.fillText(config.storyOptionB || '👀 Quiero probarla', width / 2 + 15 + (width - 360) / 4, stickerY + 140);
  }

  // 6. Bottom CTA Bar + Coupon Badge
  const ctaY = height - 145;
  ctx.fillStyle = theme.accent;
  drawRoundedRect(ctx, 72, ctaY, width - 144, 88, 44);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 30px "Plus Jakarta Sans", Inter, sans-serif';
  ctx.textAlign = 'center';
  const ctaFinal = config.showCouponSticker && dna.activeCoupon.active
    ? `${config.ctaText} • CUPÓN ${dna.activeCoupon.code} (-${dna.activeCoupon.discount}%)`
    : config.ctaText;
  ctx.fillText(ctaFinal, width / 2, ctaY + 55);
}
