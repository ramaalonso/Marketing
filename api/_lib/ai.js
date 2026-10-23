// Núcleo de Inteligencia Estratégica, Fotografía Realista y Voz Natural Rioplatense — Yerbazo Holo IA
const OPENAI_KEY = () => process.env.OPENAI_API_KEY || '';
const GEMINI_KEY = () => process.env.GEMINI_API_KEY || '';

const BRAND_CONTEXT = `MARCA: Yerbazo (https://yerbazo.com.ar) — tienda online especializada en yerba mate importada (padrón uruguayo y brasileño: Baldo, Canarias Tradicional, Canarias Serena, Canarias Edición Especial, Canarias Té Verde y Jengibre, Rei Verde Premium, Rei Verde Padrón Argentino, Verdecita, Pindaré) y accesorios materos (Lata Baldo, Yerberas 400g, Reposa Mate, Pico Mate System) en Buenos Aires, Argentina.
Contacto real: Web https://yerbazo.com.ar · WhatsApp +5491134863026 · Instagram @yerbazo.ba · TikTok @yerbazoba.
Identidad visual: Verde Selva (#0f4b25), Crema Matero (#ece7d7), Naranja Energía (#e68628).
Audiencia real: Materos de 18 a 48 años en CABA y GBA (estudiantes universitarios UADE/UBA/UTN, oficinas, clubes de rugby/fútbol, fanáticos del mate uruguayo que buscan que no se lave al cuarto mate).
Voz de marca: Español rioplatense auténtico de Buenos Aires (voseo natural: "probá", "fijate", "mirá", "cebás"), inteligente, directo, experto pero cero pretencioso. PROHIBIDO sonar a locutor neutro o usar frases genéricas de agencia ("descubrí la excelencia", "calidad inigualable").
REGLA ESTRICTA DE VERACIDAD: NO inventes locales a la calle, direcciones físicas, envíos gratis que no existan ni descuentos inventados. Usá únicamente los precios, ofertas y estados de stock reales del catálogo provisto, y como canales de compra yerbazo.com.ar o WhatsApp +5491134863026.`;

const GEMINI_TEXT_CHAIN = [
  'gemini-3.5-flash',
  'gemini-3-flash-preview',
  'gemini-flash-latest'
];

async function geminiGenerate(model, body) {
  const key = GEMINI_KEY();
  if (!key) throw new Error('Falta GEMINI_API_KEY en el servidor');
  const chain = GEMINI_TEXT_CHAIN.includes(model)
    ? [model, ...GEMINI_TEXT_CHAIN.filter((m) => m !== model)]
    : [model];

  let lastErr;
  for (const m of chain) {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${encodeURIComponent(key)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(body)
      }
    );
    if (res.ok) return res.json();
    const txt = await res.text();
    lastErr = new Error(`Gemini ${m} (${res.status}): ${txt.slice(0, 260)}`);
    if (![429, 500, 503, 404].includes(res.status)) break;
  }
  throw lastErr;
}

async function openaiChatJSON(system, user, model = 'gpt-5.4-mini') {
  const key = OPENAI_KEY();
  if (!key) throw new Error('Sin OPENAI_API_KEY');
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user }
      ]
    })
  });
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${(await res.text()).slice(0, 240)}`);
  const data = await res.json();
  return JSON.parse(data.choices[0].message.content);
}

// Búsqueda web en vivo (RSS multi-consulta sin límites de cuota) para alimentar al analista con datos reales del mercado argentino
async function fetchLiveMarketSignals(extraFocus = '') {
  const queries = [
    'yerba mate canarias baldo rei verde argentina tienda precios combos',
    'mates imperiales yerba uruguaya instagram tiktok tendencias argentina',
    'como armar montañita yerba uruguaya sin que se lave trucos',
    extraFocus ? `yerba mate argentina ${extraFocus}` : 'fechas comerciales ecommerce argentina cybermonday noviembre'
  ];

  const items = [];
  const seenUrls = new Set();

  await Promise.all(
    queries.map(async (q) => {
      try {
        const url = `https://www.bing.com/search?q=${encodeURIComponent(q)}&format=rss`;
        const res = await fetch(url, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });
        if (!res.ok) return;
        const xml = await res.text();
        const matches = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)];
        for (const m of matches.slice(0, 5)) {
          const block = m[1];
          const title = (block.match(/<title>([\s\S]*?)<\/title>/)?.[1] || '')
            .replace(/<!\[CDATA\[|\]\]>/g, '')
            .replace(/&amp;/g, '&')
            .replace(/&#39;/g, "'")
            .replace(/&quot;/g, '"')
            .trim();
          const link = (block.match(/<link>([\s\S]*?)<\/link>/)?.[1] || '').trim();
          const desc = (block.match(/<description>([\s\S]*?)<\/description>/)?.[1] || '')
            .replace(/<!\[CDATA\[|\]\]>/g, '')
            .replace(/<[^>]+>/g, '')
            .replace(/&amp;/g, '&')
            .trim();
          if (link && title && !seenUrls.has(link)) {
            seenUrls.add(link);
            items.push({ title, url: link, snippet: desc });
          }
        }
      } catch {
        // continuar con el resto
      }
    })
  );

  return items.slice(0, 14);
}

// 1) Investigación real de competencia y mercado matero en Argentina
export async function researchCompetition(focus = '') {
  const liveSignals = await fetchLiveMarketSignals(focus);
  const signalsContext = liveSignals.length
    ? liveSignals.map((s, i) => `[${i + 1}] ${s.title} (${s.url})\n    Resumen: ${s.snippet}`).join('\n')
    : 'Sin resultados externos adicionales.';

  const todayStr = new Date().toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const prompt = `${BRAND_CONTEXT}

Fecha actual: ${todayStr}.
SEÑALES EN VIVO RASTREADAS HOY EN LA WEB ARGENTINA:
${signalsContext}

Actuá como Director de Inteligencia Competitiva y Estratega Creativo especializado en e-commerce de consumo recurrente y mundo matero en Argentina (analizando referentes reales como Todo Mates, Matesur, cuentas oficiales de Canarias/Baldo, creadores materos virales de TikTok/Reels en Argentina y anuncios ganadores de Meta Ads Library).
${focus ? `Foco especial pedido por el dueño de Yerbazo: "${focus}"` : ''}

Elaborá un informe estratégico concreto, profundo y accionable en español rioplatense con:
1. **Qué está funcionando de verdad en la competencia hoy (6-8 formatos/ángulos ganadores):** explicá el gancho exacto de los primeros 3 segundos, la puesta en escena visual (por qué frena el scroll), qué tipo de cuenta lo usa y cómo Yerbazo puede superarlo.
2. **Oportunidades estacionales y contexto cultural de las próximas semanas en Argentina** (ej. clima, época de parciales/finales universitarios, eventos de e-commerce como CyberMonday, juntadas al aire libre, tercer tiempo).
3. **Puntos débiles de las tiendas materas competidoras** (ej. venden el mate caro como objeto de lujo inaccesible, esconden precios en "info al MD", suben fotos aburridas de catálogo blanco) y cómo Yerbazo gana mostrando transparencia de precios, cercanía urbana y rendimiento real por termo.
4. **Reglas visuales según objetivo:** cómo debe verse una imagen/video para atraer gente nueva (TOFU) vs. educar/comparar (MOFU) vs. cerrar ventas inmediatas (BOFU).`;

  const data = await geminiGenerate('gemini-3.5-flash', {
    contents: [{ role: 'user', parts: [{ text: prompt }] }]
  });

  const report = (data.candidates?.[0]?.content?.parts || [])
    .map((p) => p.text || '')
    .join('\n');

  return {
    report,
    sources: liveSignals.map(({ title, url }) => ({ title, url })),
    live: liveSignals.length > 0
  };
}

// 2) Estratega Creativo Autónomo: construye el calendario superior cruzando competencia + inventario/márgenes + dirección de arte por objetivo
export async function buildStrategy({ products, research, days = 14, goal = '', startDate }) {
  const catalog = (products || [])
    .map(
      (p) =>
        `- id:${p.id} | "${p.title}" | precio:${
          p.isSale && p.salePrice ? `$${p.salePrice} (EN OFERTA WEB, antes $${p.price})` : `$${p.price}`
        } | margen:${p.margenPorc}% | stock:${p.stockStatus}${
          p.stockStatus === 'ultimas' ? ' (ALERTA ÚLTIMAS UNIDADES)' : ''
        } | matriz_BCG:${p.bcgCategory} | molienda:${p.molienda}`
    )
    .join('\n');

  const pieceCount = days <= 7 ? 7 : days <= 14 ? 12 : 18;

  const system = `${BRAND_CONTEXT}

Sos el Director Creativo y Estratega de Growth #1 de Argentina. Tu misión es diseñar un calendario editorial y comercial para Yerbazo que supere por completo cualquier calendario hecho a mano: ideas memorables, ganchos psicológicos afilados, variedad real de ángulos y dirección de arte fotográfica adaptada a cada objetivo.

CÓMO MODIFICÁS LA IMAGEN Y EL VIDEO SEGÚN EL OBJETIVO DE CADA PIEZA:
- Si la pieza es **TOFU (Alcance / Viral / Atraer nuevos materos)**:
  * Objetivo: frenar el scroll y generar comentarios/guardados. NO pongas cartelones de precio agresivos.
  * visual_mode: elegí "editorial_concept" (escena fotográfica impactante/curiosa sin recorte publicitario) o "product_scene" con estética súper orgánica de vida real porteña.
- Si la pieza es **MOFU (Consideración / Educación / Autoridad / Alto Margen)**:
  * Objetivo: demostrar por qué rinde más, no da acidez o vale lo que cuesta (ej. Rei Verde etiqueta negra, Canarias Serena para estudiar de noche, Pico Mate System para no derrumbar la montañita).
  * visual_mode: "product_scene" en contexto real de uso (escritorio con apuntes y laptop, mesa de madera al sol, comparación táctil de molienda).
- Si la pieza es **BOFU (Conversión Directa / Oferta Web / Últimas Unidades / Combos)**:
  * Objetivo: clics a yerbazo.com.ar y mensajes de WhatsApp hoy mismo usando escasez honesta ("últimas unidades" reales o descuentos vigentes en web).
  * visual_mode: "product_scene" con iluminación dramática de estudio publicitario comercial premium, contraste alto y foco total en el paquete real.

REGLAS PARA "scene_backdrop_prompt" (EN INGLÉS):
- Nuestro estudio fotográfico genera primero el FONDO/ESCENA FOTOGRÁFICA REALISTA en alta resolución y luego apoya encima el paquete REAL de Yerbazo con sombras físicas (cuando visual_mode es "product_scene"), o usa la fotografía pura (cuando visual_mode es "editorial_concept").
- Por lo tanto, en "scene_backdrop_prompt" describí en inglés una FOTOGRAFÍA HIPERREALISTA digna de campaña internacional (cámara Sony A7R V, lente 50mm f/1.8, iluminación natural o de estudio, texturas reales).
- Si visual_mode es "product_scene": dejá una superficie real despejada en el centro-frente (ej. "clean warm rustic parota wood table surface in the foreground ready for product placement, while in soft bokeh background sits a steaming leather imperial mate gourd and silver bombilla, golden morning sunlight through Buenos Aires balcony window, NO packages, NO text, NO bottles in center").
- Si visual_mode es "editorial_concept": describí la escena completa llamativa que frene el scroll (ej. macro cinematográfico de una montañita perfecta de yerba fina con espuma cremosa y vapor cálido al amanecer, o escena visual impactante del ritual matero porteño, SIN paquetes con letras inventadas ni texto).

REGLAS PARA GUIONES DE REEL / VOZ:
- Locución escrita en español rioplatense hablado real: frases cortas, naturales, con ritmo, muletillas sutiles reales ("Che, hacé la prueba...", "Posta, fijate esto...", "Te tiro la data sin humo..."), CERO tono robótico o de radio AM.
- Respondé ÚNICAMENTE con un objeto JSON válido.`;

  const user = `INFORME DE COMPETENCIA Y MERCADO ACTUAL:
${(research || '').slice(0, 4500)}

CATÁLOGO EN VIVO DE YERBAZO (precios, ofertas, márgenes y stock real):
${catalog}

Objetivo prioritario pedido por el dueño: ${
    goal ||
    'Multiplicar ventas y alcance orgánico combinando Reels virales de cultura matera uruguaya, educación sobre productos de alto margen (>30%) y cierre agresivo en ofertas web y últimas unidades.'
  }
Fecha de inicio del calendario: ${startDate}. Horizonte: ${days} días. Generá exactamente ${pieceCount} piezas distribuidas estratégicamente.

Estructura JSON obligatoria:
{
  "strategy_summary": "Resumen ejecutivo claro de 3-4 oraciones explicando la lógica comercial y creativa del plan.",
  "key_insights": [
    "Insight concreto 1 detectado de la competencia aplicado a Yerbazo",
    "Insight concreto 2 sobre qué producto empujar por margen/stock",
    "Insight concreto 3 sobre formatos y ganchos que retienen hoy",
    "Insight concreto 4 sobre conversión en WhatsApp y yerbazo.com.ar"
  ],
  "items": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "time": "HH:MM",
      "format": "reel|historia|carrusel|post|anuncio",
      "funnel": "TOFU|MOFU|BOFU|Recompra",
      "visual_mode": "product_scene|editorial_concept",
      "objective": "Objetivo concreto y medible de esta pieza",
      "product_id": 1,
      "concept": "Título memorable de la idea creativa",
      "competitor_reference": "Qué formato/cuenta de la competencia inspira esta pieza y qué vuelta de tuerca superior le damos en Yerbazo",
      "why_it_works": "Por qué vende o viraliza cruzando psicología del matero + datos de margen/stock de este producto",
      "hook": "Gancho exacto de los primeros 3 segundos o primera línea (frena el scroll)",
      "headline": "Titular editorial corto para la pieza visual (máx 6 palabras, sin emojis)",
      "subline": "Bajada breve opcional o dato clave (máx 8 palabras)",
      "scene_backdrop_prompt": "Detailed photorealistic photography prompt in English following the visual_mode rules, NO text or fake labels",
      "aspect": "1:1|4:5|9:16",
      "voice_persona": "tomas|nico|sofi|cami|fede",
      "caption": "Copy completo listo para publicar en Instagram/TikTok con estructura clara y llamado real a yerbazo.com.ar o WhatsApp",
      "hashtags": ["#yerbazo", "#mateargentino"],
      "cta": "Texto corto de llamado a la acción",
      "kpi": "Métrica clave de éxito (ej. Guardados > 4%, CTR > 2.5%, respuestas a historia)",
      "reel_script": [
        {
          "seconds": "0-3",
          "visual": "Acción visual concreta plano por plano",
          "on_screen": "Texto corto en pantalla",
          "voiceover": "Frase hablada bien porteña y natural"
        }
      ]
    }
  ]
}
Nota: "reel_script" debe traer 4 a 5 escenas dinámicas cuando format es "reel" o "historia" o "anuncio" en video; en posts estáticos aún incluí 1 escena breve por si quiere convertirlo en audio/historia.`;

  try {
    return await openaiChatJSON(system, user, 'gpt-5.4');
  } catch {
    const data = await geminiGenerate('gemini-3.5-flash', {
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ role: 'user', parts: [{ text: user }] }],
      generationConfig: { responseMimeType: 'application/json' }
    });
    const raw = (data.candidates?.[0]?.content?.parts || []).map((p) => p.text || '').join('');
    return JSON.parse(raw);
  }
}

// Dimensiones exactas por formato
const PIXEL_DIMS = {
  '1:1': { w: 1080, h: 1080, openaiSize: '1024x1024' },
  '4:5': { w: 1080, h: 1350, openaiSize: '1024x1536' },
  '9:16': { w: 1080, h: 1920, openaiSize: '1024x1536' }
};

// 3) Generador de Fotografía Realista (Multi-Motor: OpenAI gpt-image -> Gemini Image -> Flux.1 Photorealism HD)
export async function generateImage({ prompt, aspect = '4:5', referenceUrl, seed }) {
  const dims = PIXEL_DIMS[aspect] || PIXEL_DIMS['4:5'];
  const cleanPrompt = `${prompt}. Ultra-realistic commercial photography, shot on 35mm full-frame camera, 50mm f/1.8 lens, natural skin and material textures, realistic shadows, authentic lighting, zero text, zero watermarks, zero distorted objects.`;

  // Intento 1: OpenAI gpt-image si la cuenta tiene crédito cargado
  if (OPENAI_KEY()) {
    try {
      const res = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_KEY()}`
        },
        body: JSON.stringify({
          model: 'gpt-image-1',
          prompt: cleanPrompt,
          size: dims.openaiSize,
          quality: 'high'
        })
      });
      if (res.ok) {
        const data = await res.json();
        const b64 = data.data?.[0]?.b64_json;
        if (b64) return { image: `data:image/png;base64,${b64}`, engine: 'OpenAI GPT-Image HD' };
      }
    } catch {
      // Continúa al motor Flux Photorealism
    }
  }

  // Intento 2: Motor Flux.1 Photorealism HD (100% operativo, fotografías reales de alta resolución)
  const chosenSeed = seed || Math.floor(100000 + Math.random() * 899999);
  const fluxModels = ['flux', 'turbo'];

  for (const fluxModel of fluxModels) {
    try {
      const fluxUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
        cleanPrompt
      )}?width=${dims.w}&height=${dims.h}&seed=${chosenSeed}&nologo=true&enhance=true&model=${fluxModel}`;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 45000);
      const res = await fetch(fluxUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        signal: controller.signal
      });
      clearTimeout(timeout);

      if (res.ok) {
        const ct = res.headers.get('content-type') || 'image/jpeg';
        const buf = Buffer.from(await res.arrayBuffer());
        if (buf.length > 8000) {
          return {
            image: `data:${ct};base64,${buf.toString('base64')}`,
            engine: `Flux Photorealism Studio (${dims.w}x${dims.h})`,
            seed: chosenSeed
          };
        }
      }
    } catch {
      // probar siguiente variante
    }
  }

  throw new Error('Los motores de imagen están ocupados en este instante. Probá de nuevo en unos segundos.');
}

// Empaqueta PCM crudo (16-bit signed LE mono 24kHz) en un archivo WAV estándar si algún modelo devuelve audio/L16
function pcm16ToWavBuffer(pcmBuffer, sampleRate = 24000, numChannels = 1) {
  const byteRate = sampleRate * numChannels * 2;
  const blockAlign = numChannels * 2;
  const wav = Buffer.alloc(44 + pcmBuffer.length);

  wav.write('RIFF', 0);
  wav.writeUInt32LE(36 + pcmBuffer.length, 4);
  wav.write('WAVE', 8);
  wav.write('fmt ', 12);
  wav.writeUInt32LE(16, 16); // PCM chunk size
  wav.writeUInt16LE(1, 20);  // AudioFormat = 1 (PCM)
  wav.writeUInt16LE(numChannels, 22);
  wav.writeUInt32LE(sampleRate, 24);
  wav.writeUInt32LE(byteRate, 28);
  wav.writeUInt16LE(blockAlign, 32);
  wav.writeUInt16LE(16, 34); // BitsPerSample
  wav.write('data', 36);
  wav.writeUInt32LE(pcmBuffer.length, 40);
  pcmBuffer.copy(wav, 44);
  return wav;
}

// Mapeo de personalidades rioplatenses a voces neurales expresivas de Gemini 3.8 TTS y OpenAI
const VOICE_PROFILES = {
  tomas: {
    geminiVoice: 'Puck',
    openaiVoice: 'ash',
    direction:
      'Hablá con acento argentino porteño de Buenos Aires súper natural, como un pibe matero de 27 años charlando con un amigo en un reel de Instagram. Usá voseo rioplatense real (entonación porteña en las preguntas y cierres), ritmo ágil, cálido y cero tono de locutor comercial:'
  },
  nico: {
    geminiVoice: 'Charon',
    openaiVoice: 'ballad',
    direction:
      'Hablá con acento argentino de Buenos Aires tranquilo, seguro y conocedor de yerba mate, como un amigo experto que te recomienda una buena yerba cebando un mate a la mañana. Pausas reales y naturales, cero robot:'
  },
  sofi: {
    geminiVoice: 'Kore',
    openaiVoice: 'coral',
    direction:
      'Hablá como una chica argentina de Buenos Aires de 25 años, súper cercana, fresca y auténtica grabando un storytime o recomendación matera para TikTok. Entonación porteña natural y expresiva:'
  },
  cami: {
    geminiVoice: 'Aoede',
    openaiVoice: 'nova',
    direction:
      'Hablá con acento porteño joven, dinámico y con buena onda, ritmo rápido de creadora UGC en Reels, natural y espontánea:'
  },
  fede: {
    geminiVoice: 'Fenrir',
    openaiVoice: 'echo',
    direction:
      'Hablá con acento argentino enérgico y directo de Buenos Aires, transmitiendo entusiasmo genuino por una oportunidad u oferta matera sin sonar a publicidad vieja de radio:'
  },
  // Compatibilidad con IDs anteriores
  ash: {
    geminiVoice: 'Puck',
    openaiVoice: 'ash',
    direction:
      'Hablá con acento argentino porteño natural de Buenos Aires, cercano, ágil y auténtico como creador de contenido matero:'
  },
  coral: {
    geminiVoice: 'Kore',
    openaiVoice: 'coral',
    direction:
      'Hablá como creadora argentina de Buenos Aires, súper cálida, natural y auténtica:'
  }
};

// 4) Voz Humana Neural Rioplatense (Gemini 3.8 Native Neural TTS + Fallback automático)
export async function generateVoice({ text, voice = 'tomas' }) {
  const profile = VOICE_PROFILES[voice] || VOICE_PROFILES.tomas;
  const cleanText = String(text || '').trim();
  if (!cleanText) throw new Error('Falta el texto para locutar');

  // Motor Principal: Gemini Neural Audio TTS (100% activo con tu GEMINI_API_KEY)
  const geminiTtsModels = [
    'gemini-3.8-flash-tts',
    'gemini-3.8-flash-lite-tts',
    'gemini-2.5-flash-preview-tts',
    'gemini-3.1-flash-tts-preview'
  ];

  if (GEMINI_KEY()) {
    for (const model of geminiTtsModels) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(
            GEMINI_KEY()
          )}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `${profile.direction}\n"${cleanText}"`
                    }
                  ]
                }
              ],
              generationConfig: {
                responseModalities: ['AUDIO'],
                speechConfig: {
                  voiceConfig: {
                    prebuiltVoiceConfig: {
                      voiceName: profile.geminiVoice
                    }
                  }
                }
              }
            })
          }
        );

        if (res.ok) {
          const data = await res.json();
          const part = (data.candidates?.[0]?.content?.parts || []).find(
            (p) => p.inlineData || p.inline_data
          );
          const inline = part?.inlineData || part?.inline_data;
          if (inline?.data) {
            const rawBuf = Buffer.from(inline.data, 'base64');
            const mime = (inline.mimeType || inline.mime_type || 'audio/wav').toLowerCase();
            if (mime.includes('l16') || mime.includes('pcm')) {
              return {
                buffer: pcm16ToWavBuffer(rawBuf, 24000, 1),
                contentType: 'audio/wav',
                engine: model
              };
            }
            return {
              buffer: rawBuf,
              contentType: mime.includes('wav') ? 'audio/wav' : mime,
              engine: model
            };
          }
        }
      } catch {
        // intentar siguiente modelo neural
      }
    }
  }

  // Respaldo: OpenAI TTS si tiene saldo
  if (OPENAI_KEY()) {
    const res = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_KEY()}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini-tts',
        voice: profile.openaiVoice,
        input: cleanText,
        instructions: profile.direction,
        response_format: 'mp3'
      })
    });
    if (res.ok) {
      return {
        buffer: Buffer.from(await res.arrayBuffer()),
        contentType: 'audio/mpeg',
        engine: 'gpt-4o-mini-tts'
      };
    }
  }

  throw new Error('No se pudo sintetizar la voz natural en este momento.');
}

// 5) Redactor puntual con IA para variaciones rápidas
export async function generateCopy({ product, goal, format }) {
  const sys = `${BRAND_CONTEXT}\nSos un copywriter creativo top de Argentina. Escribí con gancho real, cero frases cliché. Respondé SOLO JSON con claves: {"hook","body","cta","headline","scene_backdrop_prompt","hashtags":[]}.`;
  const usr = `Producto: ${JSON.stringify(product)}\nFormato: ${format}\nObjetivo específico: ${goal}`;
  try {
    return await openaiChatJSON(sys, usr, 'gpt-5.4-mini');
  } catch {
    const data = await geminiGenerate('gemini-3.5-flash', {
      systemInstruction: { parts: [{ text: sys }] },
      contents: [{ role: 'user', parts: [{ text: usr }] }],
      generationConfig: { responseMimeType: 'application/json' }
    });
    return JSON.parse(data.candidates[0].content.parts[0].text);
  }
}

export function friendlyError(msg = '') {
  if (/credits|insufficient_quota/i.test(msg)) {
    return 'La cuenta de OpenAI no tiene crédito disponible; el sistema usó automáticamente Gemini / Flux.';
  }
  return msg;
}
