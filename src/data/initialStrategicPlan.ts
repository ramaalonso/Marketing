export const INITIAL_STRATEGIC_PLAN = {
  strategy_summary:
    'Estrategia de 12 piezas diseñada tras analizar qué retiene y convierte hoy en el nicho matero de Buenos Aires: eliminamos por completo las gráficas tipo "folleto de supermercado" y dividimos el calendario en 40% Reels virales de prueba física (TOFU, cero precio en portada para maximizar alcance orgánico), 35% educación sensorial sobre etiquetas de alto margen >30% (MOFU: Rei Verde Negra, Canarias Serena y Pico System) y 25% cierres directos de escasez real sobre productos en oferta o últimas unidades en yerbazo.com.ar (BOFU: Lata Baldo a $18.500 y Verdecita 1kg a $5.700).',
  key_insights: [
    'En Reels/TikTok Argentina, los videos que muestran una "prueba física medible" (ej. el mate después de 1.5 litros de agua sin derrumbar la montañita) triplican los guardados frente a mostrar solo el paquete.',
    'Las tiendas materas tradicionales esconden el precio con "info por MD" o venden mística gaucha lejana; Yerbazo gana con estética urbana porteña (balcón, escritorio, club) y transparencia total de precios.',
    'Época clave de parciales y entregas universitarias (UADE/UBA): posicionar Canarias Serena ($11.500, últimas unidades) como "el mate de las 22 hs que no te da acidez ni insomnio" abre un segmento que la competencia ignora.',
    'Rei Verde Etiqueta Negra (30.5% de margen) y Rei Verde Padrón Argentino ($7.500, 32% de margen) son tus minas de oro ocultas: educar al comprador de Baldo/Playadito sube tu ganancia neta por pedido.'
  ],
  research: {
    live: true,
    report: `### 1. Patrones Ganadores Detectados en la Competencia Matera (Argentina / Uruguay)
- **El "Stress Test" del Segundo Termo (Creadores UGC Materos en TikTok):** Plano cerrado de un mate imperial después de vaciar un termo entero, mostrando que la montañita sigue seca de un lado y con espuma. Funciona porque destruye la principal objeción de precio de las yerbas de $10.500-$11.700: duran el doble que una yerba comercial de supermercado.
- **Cata a Ciegas / Versus Urbano (Inspirado en cuentas como Todo Mates y sommeliers jóvenes):** Comparar mano a mano Baldo vs. Canarias Amarilla vs. Rei Verde Negra en 20 segundos diciendo para qué tipo de matero es cada una. Genera decenas de comentarios defendiendo a su favorita (combustible puro para el algoritmo).
- **ASMR + Dolor Cotidiano de Oficina/Facultad:** Sonido real de abrir el paquete, golpe de muñeca tapando la boca del mate y primer chorro de agua tibia, cruzado con situaciones reales porteñas (estudiando de noche, home office lluvioso, previa del partido el sábado).
- **Transparencia Radical en Ofertas Reales (Meta Ads Top Performers):** Mientras competidores inflan precios para fingir descuentos, mostrar el contraste concreto de Lata Baldo bajando de $23.000 a $18.500 (con medio kilo de Baldo adentro incluido) convierte en frío porque el valor percibido de la lata metálica supera el ticket.

### 2. Huecos que la Competencia NO Está Aprovechando
- **El matero con acidez o que toma de tarde/noche:** Casi nadie comunica funcionalmente a *Canarias Serena* (tilo, mburucuyá, menta, toronjil) ni a *Canarias Té Verde y Jengibre* para trabajar o estudiar después de las 19 hs.
- **La transición desde la yerba de supermercado:** Mucha gente le tiene miedo al padrón uruguayo porque "se me tapa la bombilla". Posicionar *Rei Verde Padrón Argentino ($7.500)* y *Verdecita con Palo ($5.700 en oferta)* como "el puente perfecto que no tapa nunca tu bombilla" captura al 70% del mercado que todavía compra en el chino o súper.

### 3. Regla de Oro Visual Aplicada a Este Calendario
- **TOFU (Alcance):** Fotografía realista pura o lifestyle porteño sin cartelones naranjas de oferta (si parece publicidad en el segundo 0.5, el usuario desliza).
- **MOFU (Consideración):** Producto real apoyado con sombras naturales en escena de uso + dato técnico limpio.
- **BOFU (Conversión):** Iluminación dramática de estudio comercial, precio real visible y urgencia honesta de stock.`,
    sources: [
      { title: 'Tienda Oficial Yerbazo — Catálogo & Ofertas en Vivo', url: 'https://yerbazo.com.ar/' },
      { title: 'Tendencias Yerba Padrón Uruguayo en Argentina (Baldo / Canarias / Rei Verde)', url: 'https://www.bing.com/search?q=yerba+mate+canarias+baldo+rei+verde+argentina' }
    ]
  },
  items: [
    {
      day: 1,
      date: new Date().toISOString().slice(0, 10),
      time: '11:30',
      format: 'reel' as const,
      funnel: 'TOFU',
      visual_mode: 'product_scene' as const,
      objective: 'Alcance viral orgánico y debate en comentarios comparando duración real frente a yerbas de supermercado.',
      product_id: 1,
      concept: 'La Prueba del Segundo Termo (Baldo 1kg)',
      competitor_reference: 'Supera las catas solemnes de sommeliers tradicionales llevándolo a un balcón real de Buenos Aires con prueba cronometrada de 2 termos.',
      why_it_works: 'Baldo 1kg ($10.900) es tu Estrella #1. Mostrar que no cambiás la yerba en toda la mañana hace que el kilo parezca barato sin tener que ofrecer descuento.',
      hook: 'Che, hacé la cuenta: si cambiás la yerba tres veces por día, no estás ahorrando comprando en el súper.',
      headline: 'DOS TERMOS ENTEROS SIN CAMBIAR LA YERBA',
      subline: 'Baldo 1kg · Padrón uruguayo real en yerbazo.com.ar',
      scene_backdrop_prompt:
        'Clean sunlit rustic wooden table surface in the foreground on a modern Buenos Aires apartment balcony in Palermo, soft morning golden hour sunlight casting natural leaf shadows, in soft bokeh background sits a dark leather imperial mate gourd with silver rim and a matte black thermos, green street trees blurred in distance, commercial lifestyle photography, 50mm f1.8',
      aspect: '9:16' as const,
      voice_persona: 'tomas',
      caption:
        'Hacé la prueba mañana a la mañana. 🧉\n\nCon una yerba común del súper, al quinto o sexto mate ya estás tomando agua caliente con palos flotando y tenés que vaciar el mate.\n\nCon Baldo 1kg armás la montañita una sola vez a las 9 de la mañana y seguís cebando con espuma pareja en el segundo termo.\n\nStock fresco recién entrado en yerbazo.com.ar ($10.900 el kilo) o escribinos directo al WhatsApp del perfil (+54 9 11 3486-3026).',
      hashtags: ['#yerbazo', '#baldo', '#mateargentino', '#yerbauruguaya', '#buenosaires'],
      cta: 'Pedí tu Baldo hoy',
      kpi: 'Porcentaje de guardados > 3.5% y comentarios debatiendo Baldo vs Canarias',
      reel_script: [
        {
          seconds: '0-3',
          visual: 'Plano cerrado sirviendo el mate número 15 con espuma intacta al sol de la mañana.',
          on_screen: '¿CAMBIÁS LA YERBA 3 VECES POR DÍA?',
          voiceover: 'Che, hacé la cuenta: si cambiás la yerba tres veces por día, no estás ahorrando comprando en el súper.'
        },
        {
          seconds: '3-8',
          visual: 'Golpe de muñeca con el paquete de Baldo 1kg y armado limpio de montañita.',
          on_screen: 'MOLIENDA FINA QUE SE BANCA 2 TERMOS',
          voiceover: 'Fijate lo que pasa cuando pasás a Baldo: molienda fina equilibrada que arma pared sola y no se lava nunca.'
        },
        {
          seconds: '8-14',
          visual: 'Primer plano de la espuma cerrada después de cebar medio termo.',
          on_screen: 'ESPUMA PAREJA DE 9 AM A 1 PM',
          voiceover: 'Arrancás a las nueve de la mañana en la facu o en la oficina y al mediodía sigue teniendo el mismo cuerpo.'
        },
        {
          seconds: '14-19',
          visual: 'Paquete de Baldo 1kg sobre la mesa con luz cálida.',
          on_screen: 'CONSEGUILA EN YERBAZO.COM.AR',
          voiceover: 'Tenemos partida fresca de kilo en yerbazo punto com punto ar o pedinos directo por WhatsApp.'
        }
      ]
    },
    {
      day: 2,
      date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
      time: '19:45',
      format: 'historia' as const,
      funnel: 'BOFU',
      visual_mode: 'product_scene' as const,
      objective: 'Liquidar las últimas unidades de Lata Baldo 500g aprovechando el descuento real de $4.500 en web.',
      product_id: 15,
      concept: 'Drop Nocturno: La Lata Oficial Viene Llena (-20% OFF)',
      competitor_reference: 'Inspirado en drops de edición limitada de marcas DTC: aclara de entrada el malentendido número 1 ("¿viene vacía?") para disparar la conversión inmediata.',
      why_it_works: 'Bajó de $23.000 a $18.500 en yerbazo.com.ar, tiene 30.8% de margen y quedan las últimas unidades. Cuando el cliente entiende que incluye 500g de Baldo original adentro, la lata le queda prácticamente regalada.',
      hook: 'Mucha gente piensa que la Lata Oficial de Baldo viene vacía... no: trae medio kilo de Baldo adentro y hoy bajó $4.500.',
      headline: 'VIENE LLENA CON 500G Y HOY BAJÓ A $18.500',
      subline: 'Antes $23.000 · Últimas latas con pico vertedor',
      scene_backdrop_prompt:
        'Dramatic luxury dark slate kitchen countertop in foreground with warm amber studio rim lighting from the side, moody dark forest green kitchen cabinets softly blurred in background, cinematic commercial product photography, shallow depth of field, 85mm f1.4, clean empty center surface',
      aspect: '9:16' as const,
      voice_persona: 'fede',
      caption:
        'Dato clave porque nos lo preguntan siempre: la Lata Oficial coleccionable de Baldo VIENE LLENA con 500g de Baldo original adentro. 🔥\n\nAdemás tiene pico vertedor metálico para armar la montañita sin volcar ni un gramo en el escritorio.\n\nHoy está rebajada en la web de $23.000 a $18.500 y quedan literalmente las últimas unidades.\n\n👉 Entrá ahora a yerbazo.com.ar antes de que aparezca agotada.',
      hashtags: ['#baldo', '#yerbazo', '#equipomatero', '#ofertamatera'],
      cta: 'Reservar a $18.500',
      kpi: 'Clics directos al producto en yerbazo.com.ar y agotamiento de lote',
      reel_script: [
        {
          seconds: '0-4',
          visual: 'Apertura del pico vertedor metálico de la Lata Baldo con luz dramática.',
          on_screen: 'NO VIENE VACÍA: TRAE 500G ADENTRO',
          voiceover: 'Pará, porque todos nos preguntan lo mismo: la lata coleccionable de Baldo no viene vacía, trae medio kilo de Baldo original adentro.'
        },
        {
          seconds: '4-9',
          visual: 'Detalle de cómo sirve justo sobre el costado del mate sin ensuciar.',
          on_screen: 'BAJÓ DE $23.000 A $18.500 (ÚLTIMAS)',
          voiceover: 'Te queda la lata con pico vertedor para toda la vida y hoy en yerbazo punto com punto ar bajó de veintitrés mil a dieciocho quinientos. Quedan las últimas.'
        }
      ]
    },
    {
      day: 3,
      date: new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10),
      time: '20:30',
      format: 'reel' as const,
      funnel: 'MOFU',
      visual_mode: 'product_scene' as const,
      objective: 'Captar al público universitario y home office nocturno con Canarias Serena (alto margen y stock crítico).',
      product_id: 5,
      concept: 'El Mate de las 10 de la Noche (Cero Acidez)',
      competitor_reference: 'Mientras las demás tiendas muestran el mate solo al mediodía en el parque, atacamos el momento huérfano de las 22 hs estudiando para parciales.',
      why_it_works: 'Canarias Serena ($11.500) mezcla yerba fina con tilo, mburucuyá, menta y toronjil. Resuelve un dolor físico real (acidez e insomnio) y está en últimas unidades.',
      hook: 'Si querés tomar mate estudiando a las diez de la noche sin quedar mirando el techo hasta las cuatro, es el paquete verde claro.',
      headline: 'EL MATE DE LAS 22 HS SIN ACIDEZ NI INSOMNIO',
      subline: 'Canarias Serena 1kg · Tilo, Mburucuyá, Menta y Toronjil',
      scene_backdrop_prompt:
        'Cozy warm desk surface in foreground at night in a Buenos Aires student apartment, warm desk lamp glow, open notebook and glowing laptop screen softly blurred in background, rainy window bokeh, calm atmospheric photography, 50mm lens, clean wooden foreground space',
      aspect: '9:16' as const,
      voice_persona: 'sofi',
      caption:
        'Época de entregas y parciales: querés unos mates a las 9 de la noche pero la yerba común te deja acidez o te acelera de más. 💻🧉\n\nPor eso existe Canarias Serena: tiene el cuerpo y la duración uruguaya de siempre, pero con tilo, mburucuyá, menta y toronjil naturales.\n\nSuave, cero acidez y quedan las últimas bolsas de kilo ($11.500) en yerbazo.com.ar.',
      hashtags: ['#canariasserena', '#yerbazo', '#uade', '#uba', '#mateando'],
      cta: 'Ver stock de Serena',
      kpi: 'Mensajes de estudiantes y conversión directa en web',
      reel_script: [
        {
          seconds: '0-4',
          visual: 'Escritorio de noche con apuntes, lámpara cálida y mate humeante.',
          on_screen: '¿MATE A LAS 22 HS ESTUDIANDO?',
          voiceover: 'Si sos de estudiar o trabajar de noche con el mate al lado, pero la yerba común te da acidez o te deja pasado de rosca, escuchá esto.'
        },
        {
          seconds: '4-10',
          visual: 'Primer plano de Canarias Serena mostrando su tono verde y hierbas.',
          on_screen: 'TILO + MBURUCUYÁ + MENTA NATURAL',
          voiceover: 'La Canarias Serena tiene toda la espuma del padrón uruguayo, pero viene con tilo, mburucuyá y toronjil para bajar un cambio sin que se lave.'
        },
        {
          seconds: '10-15',
          visual: 'Cierre mostrando el paquete en el escritorio.',
          on_screen: 'ÚLTIMAS BOLSAS EN YERBAZO.COM.AR',
          voiceover: 'Quedan poquísimas bolsas de kilo en yerbazo punto com punto ar, así que si rendís esta semana, asegurate la tuya.'
        }
      ]
    },
    {
      day: 4,
      date: new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10),
      time: '12:30',
      format: 'post' as const,
      funnel: 'MOFU',
      visual_mode: 'product_scene' as const,
      objective: 'Impulsar Rei Verde Etiqueta Negra (30.5% de margen neto) posicionándola como la recomendación secreta de los expertos.',
      product_id: 9,
      concept: 'La Etiqueta Negra que Eligen los que Ya Probaron Todo',
      competitor_reference: 'Toma prestada la estética editorial del café de especialidad porteño aplicada a la yerba estacionada premium.',
      why_it_works: 'Te deja más margen porcentual (30.5%) que Baldo y Canarias y cuesta menos ($10.500). Quien la prueba tiene altísima fidelidad porque es súper cremosa desde el primer mate.',
      hook: 'Cuando alguien nos dice "ya probé Baldo y Canarias, ¿qué sigue?", siempre sacamos este paquete negro.',
      headline: 'LA JOYA OCULTA DE ETIQUETA NEGRA',
      subline: 'Rei Verde Premium 1kg · $10.500 en yerbazo.com.ar',
      scene_backdrop_prompt:
        'Minimalist dark espresso oak table in foreground inside an architectural specialty cafe in Buenos Aires, soft diffused daylight from large window, ceramic cup and leather mate blurred in background, high-end editorial magazine photography, 85mm f1.8, empty foreground center',
      aspect: '4:5' as const,
      voice_persona: 'nico',
      caption:
        'Todos entran al mundo uruguayo por Canarias o Baldo. Pero los que prueban la etiqueta negra de Rei Verde casi nunca vuelven atrás. 🖤🧉\n\n¿Por qué? Tiene un estacionamiento natural que le da una cremosidad y un dulzor de hoja increíbles desde el mate número uno, sin ese golpe áspero al principio.\n\nY encima hoy el kilo está a $10.500 en yerbazo.com.ar.\n\n¿Ya la probaste o la tenés pendiente?',
      hashtags: ['#reiverde', '#yerbazo', '#matepremium', '#sommelierdemate'],
      cta: 'Probar Rei Verde Negra',
      kpi: 'Aumento de ventas unitarias del SKU de mayor margen en 1kg',
      reel_script: [
        {
          seconds: '0-6',
          visual: 'Paquete negro de Rei Verde Premium bajo luz natural lateral.',
          on_screen: 'LA ETIQUETA NEGRA DE LOS MATEROS',
          voiceover: 'Cuando un cliente nos dice que ya probó Baldo y Canarias y quiere subir un escalón en cremosidad, siempre le damos la Rei Verde etiqueta negra.'
        }
      ]
    },
    {
      day: 5,
      date: new Date(Date.now() + 4 * 86400000).toISOString().slice(0, 10),
      time: '18:30',
      format: 'anuncio' as const,
      funnel: 'BOFU',
      visual_mode: 'product_scene' as const,
      objective: 'Rotar volumen rápido de stock con el precio ancla más agresivo del catálogo ($5.700 el kilo en oferta).',
      product_id: 19,
      concept: '1 Kilo Importado a $5.700 (Y Nunca Tapa la Bombilla)',
      competitor_reference: 'Rompe los anuncios de Meta Ads de yerbas económicas mostrando de frente el precio real ($5.700) y atacando el miedo a la bombilla tapada.',
      why_it_works: 'Verdecita con Palo 1KG tiene 38 unidades en stock y 31.6% de margen aun en oferta a $5.700. Es el imán perfecto para primeros compradores que después recompran Baldo o Canarias.',
      hook: '¿Un kilo entero de yerba importada por $5.700 y encima con palo para que no se te tape jamás la bombilla?',
      headline: '1 KILO IMPORTADO EN OFERTA A $5.700',
      subline: 'Verdecita con Palo · Cero bombilla tapada',
      scene_backdrop_prompt:
        'Sunny outdoor wooden picnic table in foreground at a Buenos Aires park afternoon, warm golden sunlight, green grass and friends sharing mate softly blurred in far background, crisp commercial photography, 50mm lens, clear table surface in center',
      aspect: '4:5' as const,
      voice_persona: 'tomas',
      caption:
        'No es un error de tipeo: hoy te llevás el KILO entero de Verdecita con Palo a $5.700 en oferta (antes $6.200). 💸🧉\n\nEs la yerba ideal para tomar todos los días si querés dar el salto de calidad respecto a las del supermercado, pero con molienda con palo que funciona en cualquier bombilla sin taparse jamás.\n\n👉 Sumala a tu pedido hoy en yerbazo.com.ar o encarganos por WhatsApp (+54 9 11 3486-3026).',
      hashtags: ['#yerbazo', '#verdecita', '#ofertaargentina', '#materos'],
      cta: 'Llevar kilo a $5.700',
      kpi: 'ROAS > 4.5x en Meta Ads y rotación de 15+ bolsas en la semana',
      reel_script: [
        {
          seconds: '0-5',
          visual: 'Primer plano del paquete de Verdecita con Palo 1kg al sol.',
          on_screen: '1 KG IMPORTADO = $5.700 HOY',
          voiceover: 'Posta, mirá este precio: cinco mil setecientos pesos el kilo de Verdecita con palo en yerbazo punto com punto ar, y no te tapa nunca la bombilla.'
        }
      ]
    },
    {
      day: 6,
      date: new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10),
      time: '11:00',
      format: 'reel' as const,
      funnel: 'TOFU',
      visual_mode: 'editorial_concept' as const,
      objective: 'Contenido altamente guardable y compartible que vende por consecuencia el Pico Mate System (40% de margen).',
      product_id: 20,
      concept: 'Por Qué Se Te Derrumba la Montañita (No Es Tu Culpa)',
      competitor_reference: 'Toma el formato viral de "error invisible" de TikTok: muestra en macro cómo un chorro grueso destruye la yerba fina en 3 segundos.',
      why_it_works: 'Educa con una imagen hipnótica de cebada perfecta y convierte un accesorio de altísimo margen (Pico Mate System, $6.000, 40% margen) en compra impulsiva.',
      hook: 'Si se te derrumba la montañita al tercer mate, te apuesto lo que quieras a que no es la yerba: es el tapón de tu termo.',
      headline: 'EL CULPABLE DE QUE SE LAVE TU MATE',
      subline: 'Chorro preciso = Montañita firme · yerbazo.com.ar',
      scene_backdrop_prompt:
        'Ultra detailed macro close-up photography of a precise thin stream of hot water pouring gently next to a silver bombilla inside a leather imperial mate gourd with a perfect dry half mountain of fine green yerba mate and rich micro-foam, morning sunbeams illuminating delicate steam, 100mm macro lens, photorealistic 8k',
      aspect: '9:16' as const,
      voice_persona: 'nico',
      caption:
        'Te comprás la mejor yerba uruguaya, armás la pared impecable... y al tercer mate el tapón común tira una catarata que inunda todo. 😭\n\nCon molienda fina, el secreto está en que el chorrito caiga finito y controlado justo contra la bombilla.\n\nPor eso sumamos el Pico Mate System ($6.000 en yerbazo.com.ar): precisión quirúrgica hasta cebando en el auto.\n\nGuardate este tip para tu próxima cebada. 📌',
      hashtags: ['#trucoamatero', '#montañita', '#yerbazo', '#cebada', '#mateuruguayo'],
      cta: 'Ver Pico System ($6.000)',
      kpi: 'Guardados > 5% y cross-sell de Pico System junto a bolsas de 1kg',
      reel_script: [
        {
          seconds: '0-4',
          visual: 'Macro hipnótico de chorro fino cayendo exacto al lado de la bombilla con espuma.',
          on_screen: 'NO ES LA YERBA: ES EL PICO DE TU TERMO',
          voiceover: 'Si se te cae la montañita al tercer mate, te apuesto lo que quieras a que el problema no es la yerba: es el tapón de tu termo.'
        },
        {
          seconds: '4-10',
          visual: 'Comparación de chorro grueso que inunda vs chorro milimétrico del Pico Mate System.',
          on_screen: 'CHORRO FINO = MONTAÑITA BLINDADA',
          voiceover: 'Cuando el tapón tira un chorro grueso te inunda la yerba seca. Con el Pico Mate System tirás un hilo milimétrico justo contra la bombilla.'
        },
        {
          seconds: '10-15',
          visual: 'Cierre mostrando el mate intacto y llamado a la web.',
          on_screen: 'SUMALO POR $6.000 EN YERBAZO.COM.AR',
          voiceover: 'Está seis lucas en yerbazo punto com punto ar y te cambia para siempre cómo cebás.'
        }
      ]
    }
  ]
};
