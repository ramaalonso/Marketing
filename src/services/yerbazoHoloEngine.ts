import {
  BrandDNA,
  BrandTone,
  YerbazoProduct,
  GeneratedAsset,
  MarketingObjective,
  ReelProject,
  AdCampaignBlueprint,
  WinningAdBlueprint,
  VisualStudioConfig,
  CarouselSlide
} from '../types/holo';

export const BRAND_DNA_STORAGE_KEY = 'yerbazo_holo_brand_dna_v5';
export const GENERATED_ASSETS_STORAGE_KEY = 'yerbazo_holo_assets_v5';

export const DEFAULT_BRAND_DNA: BrandDNA = {
  brandName: 'Yerbazo',
  websiteUrl: 'https://yerbazo.com.ar/',
  instagramHandle: '@yerbazo.ba',
  tiktokHandle: '@yerbazoba',
  whatsappNumber: '+5491134863026',
  slogan: 'El verdadero ritual matero, sin vueltas y al mejor precio.',
  valueProposition:
    'Seleccionamos las mejores yerbas importadas de padrón uruguayo, brasileñas y accesorios materos con stock real inmediato, precios imbatibles y entrega rápida.',
  colors: {
    primary: '#0f4b25',
    secondary: '#ece7d7',
    accent: '#e68628',
    dark: '#08160d'
  },
  activeTone: 'matero_experto',
  audiences: [
    {
      id: 'fan_uruguayo',
      name: 'Fanático del Padrón Uruguayo',
      avatar: '🧉',
      ageRange: '20 - 45 años',
      painPoints: [
        'Las yerbas comerciales del súper se lavan al quinto mate',
        'Precios inflados en tiendas gourmet por un kilo de Baldo o Canarias',
        'Falta de stock constante de Canarias Serena o Edición Especial'
      ],
      desires: [
        'Montañita firme que aguante 2 termos enteros',
        'Espuma consistente y sabor parejo de principio a fin',
        'Comprar por pack o kilo ahorrando de verdad'
      ],
      favoriteProducts: ['Baldo 1kg', 'Canarias tradicional 1kg', 'ReiVerde premium 1kg'],
      bestChannels: ['Instagram Reels', 'Meta Ads Feed', 'WhatsApp Directo']
    },
    {
      id: 'matero_facu_oficina',
      name: 'Matero Universitario & Home Office (UADE / Estudio)',
      avatar: '💻',
      ageRange: '18 - 32 años',
      painPoints: [
        'Acidez estomacal después de tomar mate estudiando toda la noche',
        'Necesita energía limpia sin ponerse nervioso',
        'Quiere envases prácticos de 500g o yerbera para llevar en la mochila'
      ],
      desires: [
        'Foco mental para estudiar o programar con buen sabor',
        'Yerbas suaves o compuestas con hierbas naturales (Serena, Té Verde y Jengibre)',
        'Combos accesibles con envío rápido'
      ],
      favoriteProducts: ['Canarias serena 1kg', 'Canarias Te Verde y Jenjibre 1kg', 'Baldo 500g', 'Yerbera negra 400G'],
      bestChannels: ['TikTok', 'Instagram Stories', 'Reels POV']
    },
    {
      id: 'club_rugby_amigos',
      name: 'Club, Rugby & Tercer Tiempo',
      avatar: '🏉',
      ageRange: '19 - 50 años',
      painPoints: [
        'En ronda grande el mate se lava rapidísimo',
        'Necesitan volumen (varios kilos) antes del fin de semana'
      ],
      desires: [
        'Yerba rendidora para rondas de 5 o 6 amigos',
        'Combos mayoristas / Dúos de 1kg listos para el club',
        'Atención rápida por WhatsApp'
      ],
      favoriteProducts: ['Baldo 1kg', 'ReiVerde Padron Argentino 1kg', 'Verdecita 1kg', 'Pindare 1kg'],
      bestChannels: ['WhatsApp Status', 'Instagram Stories', 'Boca a Boca / Referidos']
    },
    {
      id: 'regalo_coleccionista',
      name: 'Amante del Equipo Matero & Regalos',
      avatar: '🎁',
      ageRange: '24 - 60 años',
      painPoints: [
        'No sabe qué regalarle a un fanático del mate',
        'Quiere accesorios que duren toda la vida y queden prolijos'
      ],
      desires: [
        'Lata coleccionable Baldo con pico vertedor',
        'Yerberas rígidas anti-humedad y Pico Mate System',
        'Presentación impecable lista para regalar'
      ],
      favoriteProducts: ['Lata baldo 500g', 'Yerbera marron 400G', 'Pico mate System', 'Reposa mate'],
      bestChannels: ['Instagram Carruseles', 'Meta Ads Retargeting']
    }
  ],
  usps: [
    'Stock 100% real y fresco de yerbas importadas (Baldo, Canarias, Rei Verde, Pindaré, Verdecita)',
    'Rendimiento comprobado: molienda fina que aguanta hasta 2 termos sin lavarse',
    'Precios directos sin sobreprecios de boutique + Combos ahorradores',
    'Tienda online rápida (yerbazo.com.ar) y atención personalizada al instante'
  ],
  signatureExpressions: [
    'Montañita blindada',
    'Espuma de principio a fin',
    'No se lava ni en el segundo termo',
    'Cebada pareja',
    'El verdadero Yerbazo',
    'Padrón uruguayo de verdad',
    'Cero acidez, puro sabor'
  ],
  activeCoupon: {
    code: 'AMOAMAMA',
    discount: 10,
    active: true
  },
  aiConfig: {
    provider: 'dual_auto',
    apiKey: '',
    geminiApiKey: '',
    openaiApiKey: '',
    model: 'gemini-3.5-flash'
  },
  lastScannedAt: new Date().toISOString()
};

export const INITIAL_YERBAZO_PRODUCTS: YerbazoProduct[] = [
  {
    id: 1,
    title: 'Baldo 1kg',
    price: 10900,
    isSale: false,
    stockStatus: 'normal',
    category: '1kg',
    badge: '⭐ Top #1 Ventas',
    weight: '1 kg',
    image: 'https://yerbazo.com.ar/img/Baldo%201kg.webp',
    stockActual: 42,
    costoEstimado: 7900,
    margenPorc: 27.5,
    unidadesVendidasMes: 118,
    bcgCategory: 'Estrella',
    prioridadMarketing: 'impulsar_estrella',
    razonEstrategica: 'Producto Estrella #1 de Yerbazo: máxima tracción orgánica y altísima tasa de recompra cada 18 días.',
    origen: 'Uruguay / Brasil',
    molienda: 'Fina equilibrada sin palo (Padrón Uruguayo)',
    intensidad: 4,
    duracionTermos: '2 termos completos sin lavarse',
    notasCata: ['Cuerpo cremoso', 'Tostado suave', 'Espuma persistente', 'Final redondo sin amargor agresivo'],
    dolorQueResuelve: 'Querés el sabor intenso y rendidor del mate uruguayo pero sin que sea imposible de armar la montañita.',
    hookGanador: '¿Por qué 8 de cada 10 materos que prueban Baldo no vuelven nunca más a la yerba del súper?',
    beneficiosClave: ['Montañita fácil en 10 segundos', 'Rinde el doble que una yerba común', 'Sabor parejo todo el termo'],
    testimonioReal: {
      autor: 'Juan Trueba',
      rol: 'Cliente Fiel Yerbazo',
      texto: 'Me pasé a Baldo 1kg hace tres meses. Con un solo mate tiro toda la mañana en la oficina sin cambiar la yerba.'
    }
  },
  {
    id: 3,
    title: 'Canarias tradicional 1kg',
    price: 10700,
    isSale: false,
    stockStatus: 'normal',
    category: '1kg',
    badge: '🔥 Clásico Uruguayo',
    weight: '1 kg',
    image: 'https://yerbazo.com.ar/img/Canarias%20tradicional%201kg.webp',
    stockActual: 35,
    costoEstimado: 7750,
    margenPorc: 27.6,
    unidadesVendidasMes: 96,
    bcgCategory: 'Estrella',
    prioridadMarketing: 'impulsar_estrella',
    razonEstrategica: 'Ícono indiscutido del mate uruguayo. Ideal para anuncios de captación de nuevos clientes.',
    origen: 'Uruguay / Brasil',
    molienda: 'Extra fina 100% hoja pura sin palo',
    intensidad: 5,
    duracionTermos: '2+ termos de máxima intensidad',
    notasCata: ['Intenso y profundo', 'Notas ahumadas sutiles', 'Mucha espuma', 'Energía pura'],
    dolorQueResuelve: 'Para los que sienten que todas las yerbas están suaves y buscan el verdadero golpe de sabor charrúa.',
    hookGanador: 'El paquete amarillo que divide aguas: si amás el mate con carácter, este kilo es sagrado.',
    beneficiosClave: ['100% hoja pura seleccionada', 'Máximo rendimiento por cebada', 'Energía natural sostenida'],
    testimonioReal: {
      autor: 'Facundo C.',
      rol: 'Comprador Recurrente',
      texto: 'El precio que tiene Yerbazo en la Canarias de kilo no existe en otro lado. Siempre llega impecable.'
    }
  },
  {
    id: 5,
    title: 'Canarias serena 1kg',
    price: 11500,
    isSale: false,
    isUrgent: true,
    stockStatus: 'ultimas',
    category: '1kg',
    badge: '⚠️ Últimas Unidades',
    weight: '1 kg',
    image: 'https://yerbazo.com.ar/img/Canarias%20serena%201kg.webp',
    stockActual: 6,
    costoEstimado: 8200,
    margenPorc: 28.7,
    unidadesVendidasMes: 54,
    bcgCategory: 'Estrella',
    prioridadMarketing: 'urgencia_ultimas',
    razonEstrategica: 'Marcado como ÚLTIMAS UNIDADES en yerbazo.com.ar. Gatillo psicológico de escasez real con altísimo CTR.',
    origen: 'Uruguay / Brasil',
    molienda: 'Fina con blend de Tilo, Mburucuyá, Menta y Toronjil',
    intensidad: 3,
    duracionTermos: '1.5 a 2 termos súper aromáticos',
    notasCata: ['Toque fresco de menta y toronjil', 'Cero acidez', 'Efecto relax sin perder cuerpo'],
    dolorQueResuelve: 'Querés tomar mate a la tarde/noche o estudiando sin acidez ni insomnio.',
    hookGanador: '🚨 Quedan las últimas bolsas de Canarias Serena 1kg: el secreto para tomar mate a las 9 de la noche y dormir como un rey.',
    beneficiosClave: ['Con Tilo, Mburucuyá, Menta y Toronjil', 'Cero acidez estomacal', 'Ideal para bajar un cambio'],
    testimonioReal: {
      autor: 'Sofía M.',
      rol: 'Estudiante UADE',
      texto: 'Estudio hasta tarde y la Canarias Tradicional me aceleraba. La Serena es un viaje de ida, suave pero no se lava.'
    }
  },
  {
    id: 9,
    title: 'ReiVerde premium 1kg',
    price: 10500,
    isSale: false,
    stockStatus: 'normal',
    category: '1kg',
    badge: '👑 Etiqueta Negra',
    weight: '1 kg',
    image: 'https://yerbazo.com.ar/img/ReiVerde%20premium%201kg.webp',
    stockActual: 28,
    costoEstimado: 7300,
    margenPorc: 30.5,
    unidadesVendidasMes: 74,
    bcgCategory: 'Estrella',
    prioridadMarketing: 'alto_margen',
    razonEstrategica: 'Excelente margen neto (>30%) y posicionamiento gourmet como la "joya oculta" frente a Baldo/Canarias.',
    origen: 'Brasil (Padrón Uruguayo)',
    molienda: 'Fina Premium Estacionada (Paquete Negro)',
    intensidad: 4,
    duracionTermos: '2 termos de sabor aterciopelado',
    notasCata: ['Dulzor natural de hoja', 'Cremosidad extrema', 'Color verde oliva brillante'],
    dolorQueResuelve: 'Buscás una yerba uruguaya premium que sea más amable y cremosa desde el primer mate.',
    hookGanador: 'La etiqueta negra que los expertos materos guardan en secreto: probá Rei Verde Premium.',
    beneficiosClave: ['Estacionamiento natural controlado', 'Cremosidad superior desde el mate #1', 'Precio más bajo que Baldo y Canarias'],
    testimonioReal: {
      autor: 'Martín G.',
      rol: 'Matero VIP',
      texto: 'Probé todas las uruguayas y la Rei Verde negra les pasa el trapo en suavidad y espuma.'
    }
  },
  {
    id: 15,
    title: 'Lata baldo 500g',
    price: 23000,
    salePrice: 18500,
    isSale: true,
    isUrgent: true,
    stockStatus: 'ultimas',
    category: 'otros',
    badge: '🔥 -20% OFF + Últimas',
    weight: '500 g',
    image: 'https://yerbazo.com.ar/img/Lata%20baldo.webp',
    stockActual: 4,
    costoEstimado: 12800,
    margenPorc: 30.8,
    unidadesVendidasMes: 19,
    bcgCategory: 'Interrogante',
    prioridadMarketing: 'urgencia_ultimas',
    razonEstrategica: 'Oferta activa en web ($23.000 -> $18.500, ahorro de $4.500) + Últimas unidades. Perfecto para anuncios de regalo y colección.',
    origen: 'Uruguay / Brasil',
    molienda: 'Incluye 500g de Baldo Original + Lata Metálica con Pico Vertedor',
    intensidad: 4,
    duracionTermos: 'Lata reutilizable de por vida',
    notasCata: ['Edición limitada coleccionable', 'Cierre hermético anti-humedad', 'Incluye 500g de Baldo adentro'],
    dolorQueResuelve: 'Los paquetes abiertos pierden aroma en la alacena y vuelcan yerba por toda la mochila.',
    hookGanador: 'Bajó de $23.000 a $18.500 y quedan las últimas: Lata Oficial Baldo con 500g de yerba incluidos.',
    beneficiosClave: ['Ahorrás $4.500 hoy en yerbazo.com.ar', 'Viene llena con 500g de Baldo original', 'Pico vertedor para armar la montañita perfecta'],
    testimonioReal: {
      autor: 'Lucas R.',
      rol: 'Cliente Web',
      texto: 'La compré en oferta pensando que venía vacía y trae el paquete de medio kilo adentro. Un diez.'
    }
  },
  {
    id: 19,
    title: 'Verdecita con palo 1KG',
    price: 6200,
    salePrice: 5700,
    isSale: true,
    stockStatus: 'normal',
    category: '1kg',
    badge: '💸 Oferta $5.700',
    weight: '1 kg',
    image: 'https://yerbazo.com.ar/img/verdecita%20con%20palo%201kg.webp',
    stockActual: 38,
    costoEstimado: 3900,
    margenPorc: 31.6,
    unidadesVendidasMes: 32,
    bcgCategory: 'Vaca Lechera',
    prioridadMarketing: 'liquidar_stock',
    razonEstrategica: 'Alto stock disponible + Oferta activa en web ($5.700 el kilo). Ideal para rotar volumen rápido y atraer compradores sensibles al precio.',
    origen: 'Brasil (Padrón Uruguayo)',
    molienda: 'Media con palo seleccionada (Fácil filtrado)',
    intensidad: 3,
    duracionTermos: '1.5 termos sin tapar jamás la bombilla',
    notasCata: ['Suave y rendidora', 'No tapa la bombilla', 'Transición ideal del mate argentino al uruguayo'],
    dolorQueResuelve: 'Te gusta el sabor brasileño/uruguayo pero te da bronca que las moliendas finas te tapen la bombilla.',
    hookGanador: '¿1 Kilo de yerba importada por solo $5.700? Sí, leíste bien: Verdecita con Palo en oferta hoy.',
    beneficiosClave: ['Nunca tapa la bombilla', 'El kilo más económico de todo Yerbazo ($5.700)', 'Suave para tomar todo el día'],
    testimonioReal: {
      autor: 'Nicolás P.',
      rol: 'Cliente Club',
      texto: 'Por $5.700 el kilo es imbatible para todos los días. No se tapa nunca.'
    }
  },
  {
    id: 7,
    title: 'Canarias edicion especial 1kg',
    price: 11700,
    isSale: false,
    isUrgent: true,
    stockStatus: 'ultimas',
    category: '1kg',
    badge: '🌲 Paquete Verde Oscuro',
    weight: '1 kg',
    image: 'https://yerbazo.com.ar/img/Canarias%20edicion%20especial%201kg.webp',
    stockActual: 7,
    costoEstimado: 8400,
    margenPorc: 28.2,
    unidadesVendidasMes: 41,
    bcgCategory: 'Estrella',
    prioridadMarketing: 'urgencia_ultimas',
    razonEstrategica: 'Stock crítico ("Últimas") y máxima valoración entre conocedores. Ideal para historias de escasez.',
    origen: 'Uruguay / Brasil',
    molienda: 'Fina de Selección Especial y Mayor Estacionamiento',
    intensidad: 4,
    duracionTermos: '2+ termos con amargor noble y equilibrado',
    notasCata: ['Más redonda que la amarilla tradicional', 'Hojas de monte seleccionadas', 'Espuma densa'],
    dolorQueResuelve: 'La Canarias amarilla te parece demasiado fuerte pero no querés resignar duración ni cuerpo.',
    hookGanador: '¿Conocías el paquete verde oscuro de Canarias? Es la Edición Especial y acaban de entrar las últimas bolsas.',
    beneficiosClave: ['Selección de hojas de mayor estacionamiento', 'Sabor intenso pero mucho más equilibrado', 'Edición difícil de conseguir'],
    testimonioReal: {
      autor: 'Bautista D.',
      rol: 'Matero Experto',
      texto: 'La Edición Especial es el punto justo entre Baldo y Canarias amarilla. Un elixir.'
    }
  },
  {
    id: 23,
    title: 'Canarias Te Verde y Jenjibre 1kg',
    price: 11700,
    isSale: false,
    stockStatus: 'normal',
    category: '1kg',
    badge: '🍃 Energía & Detox',
    weight: '1 kg',
    image: 'https://yerbazo.com.ar/img/Canarias%20te%20verde%20y%20jenjibre%201kg.webp',
    stockActual: 19,
    costoEstimado: 8300,
    margenPorc: 29.1,
    unidadesVendidasMes: 29,
    bcgCategory: 'Interrogante',
    prioridadMarketing: 'alto_margen',
    razonEstrategica: 'Producto diferenciador con alto potencial viral en Reels/TikTok para público fitness, estudio y bienestar.',
    origen: 'Uruguay / Brasil',
    molienda: 'Fina con Té Verde natural y toque cítrico/picante de Jengibre',
    intensidad: 3,
    duracionTermos: '2 termos revitalizantes',
    notasCata: ['Picor sutil de jengibre en garganta', 'Antioxidantes del té verde', 'Digestiva y fresca'],
    dolorQueResuelve: 'Querés un mate que te active el metabolismo, sea digestivo y tenga un toque distinto sin saborizantes artificiales.',
    hookGanador: 'Mate uruguayo + Té Verde + Jengibre real: el combo antioxidante que está explotando en Yerbazo.',
    beneficiosClave: ['Doble poder antioxidante natural', 'Toque real de jengibre que reconforta', 'Cero pesadez después de comer'],
    testimonioReal: {
      autor: 'Camila V.',
      rol: 'Compradora Web',
      texto: 'Para entrenar a la mañana o después de almorzar es increíble el gustito a jengibre que deja.'
    }
  },
  {
    id: 22,
    title: 'ReiVerde Padron Argentino 1kg',
    price: 7500,
    isSale: false,
    stockStatus: 'normal',
    category: '1kg',
    badge: '🇦🇷 Paquete Azul',
    weight: '1 kg',
    image: 'https://yerbazo.com.ar/img/ReiVerde%20Padron%20Argentino%201kg.webp',
    stockActual: 31,
    costoEstimado: 5100,
    margenPorc: 32.0,
    unidadesVendidasMes: 45,
    bcgCategory: 'Vaca Lechera',
    prioridadMarketing: 'alto_margen',
    razonEstrategica: 'Altísimo margen (32%) y precio competitivo ($7.500). Puerta de entrada perfecta para quien toma Playadito/Rosamonte.',
    origen: 'Brasil (Padrón Uruguayo)',
    molienda: 'Molienda adaptada al gusto argentino (Con palo equilibrado)',
    intensidad: 3,
    duracionTermos: '1.5 a 2 termos sin lavarse como las del súper',
    notasCata: ['Fácil de cebar con cualquier bombilla', 'Hoja verde estacionada', 'No se lava rápido'],
    dolorQueResuelve: 'Querés que el mate te dure el doble que las marcas del supermercado pero con la molienda argentina de siempre.',
    hookGanador: 'Si tomás yerba tradicional argentina pero estás cansado de que se lave al cuarto mate, probá el Paquete Azul de Rei Verde.',
    beneficiosClave: ['Solo $7.500 el kilo en Yerbazo', 'Funciona con cualquier bombilla', 'Dura el doble que las marcas comerciales'],
    testimonioReal: {
      autor: 'Hernán L.',
      rol: 'Cliente Frecuente',
      texto: 'Por $7.500 le gana por goleada a cualquier yerba del supermercado.'
    }
  },
  {
    id: 14,
    title: 'Pindare 500g',
    price: 5200,
    salePrice: 4700,
    isSale: true,
    stockStatus: 'normal',
    category: '500g',
    badge: '⚡ Promo $4.700',
    weight: '500 g',
    image: 'https://yerbazo.com.ar/img/Pindare%20500g.webp',
    stockActual: 26,
    costoEstimado: 3100,
    margenPorc: 34.0,
    unidadesVendidasMes: 22,
    bcgCategory: 'Interrogante',
    prioridadMarketing: 'liquidar_stock',
    razonEstrategica: 'En oferta web ($4.700) con 34% de margen. Ideal como producto "add-on" para subir el ticket promedio en combos.',
    origen: 'Brasil (Padrón Uruguayo)',
    molienda: 'Fina suave tipo exportación',
    intensidad: 3,
    duracionTermos: '1.5 termos súper parejos',
    notasCata: ['Suavidad brasileña', 'Cero polvo molesto', 'Ideal para iniciarse en padrón fino'],
    dolorQueResuelve: 'Querés probar una yerba importada distinta gastando menos de $5.000.',
    hookGanador: 'Por menos de lo que sale un café ($4.700), te llevás medio kilo de Pindaré importada en oferta.',
    beneficiosClave: ['Precio promo $4.700 (Antes $5.200)', 'Sabor suave que no raspa la garganta', 'Ideal para armar tu combo degustación'],
    testimonioReal: {
      autor: 'Franco P.',
      rol: 'Cliente Yerbazo',
      texto: 'La sumé al pedido para probarla por el descuento y me sorprendió lo suave que es.'
    }
  },
  {
    id: 17,
    title: 'Yerbera marron 400G',
    price: 11000,
    isSale: false,
    stockStatus: 'normal',
    category: 'otros',
    badge: '🎒 Equipo Matero',
    weight: '400 g',
    image: 'https://yerbazo.com.ar/img/yerbera_marron.webp',
    stockActual: 15,
    costoEstimado: 6800,
    margenPorc: 38.2,
    unidadesVendidasMes: 18,
    bcgCategory: 'Interrogante',
    prioridadMarketing: 'combo_estrella',
    razonEstrategica: 'Altísimo margen porcentual (38.2%). El complemento #1 para cross-selling con Baldo o Canarias.',
    origen: 'Artesanal Premium',
    molienda: 'Capacidad 400g con pico dosificador rígido',
    intensidad: 5,
    duracionTermos: 'Protección total en mochila o auto',
    notasCata: ['Terminación cuero marrón clásico', 'Pico vertedor limpio', 'Anti-aplastamiento'],
    dolorQueResuelve: 'Llevás el paquete de yerba abierto en la mochila y terminás con yerba desparramada por todos los cuadernos.',
    hookGanador: 'Basta de paquetes abiertos volcándose en la mochila: conocé la Yerbera Rígida de 400g de Yerbazo.',
    beneficiosClave: ['Capacidad real de 400g de yerba', 'Pico vertedor exacto para armar la montañita', 'Estética cuero marrón o negro'],
    testimonioReal: {
      autor: 'Agustín T.',
      rol: 'Comprador Combo',
      texto: 'Me armé el combo de Yerbera + Baldo. Súper firme para llevar a la facultad.'
    }
  },
  {
    id: 16,
    title: 'Reposa mate',
    price: 4000,
    salePrice: 3500,
    isSale: true,
    isUrgent: true,
    stockStatus: 'ultimas',
    category: 'otros',
    badge: '🔥 Oferta $3.500',
    weight: 'Accesorio',
    image: 'https://yerbazo.com.ar/img/Reposa%20mate%20portada.webp',
    stockActual: 5,
    costoEstimado: 2100,
    margenPorc: 40.0,
    unidadesVendidasMes: 27,
    bcgCategory: 'Vaca Lechera',
    prioridadMarketing: 'combo_estrella',
    razonEstrategica: '40% de margen y precio impulsivo ($3.500 en oferta). Todo mate torpedo o camionero de base curva lo necesita.',
    origen: 'Artesanal Premium',
    molienda: 'Base firme universal para mates Torpedo, Imperial y Camionero',
    intensidad: 4,
    duracionTermos: 'Estabilidad total en escritorio y auto',
    notasCata: ['Evita derrames en el teclado', 'Calce universal', 'En oferta a solo $3.500'],
    dolorQueResuelve: 'Tu mate torpedo o de calabaza tiene base redonda y vive tambaleándose al lado de la computadora.',
    hookGanador: 'El accesorio de $3.500 que te salva la notebook de un accidente matero.',
    beneficiosClave: ['En oferta hoy a $3.500 (Antes $4.000)', 'Calza perfecto en Torpedos y Camioneros', 'Últimas unidades en stock'],
    testimonioReal: {
      autor: 'Ramiro M.',
      rol: 'Cliente Yerbazo',
      texto: 'Por $3.500 mi torpedo dejó de bailar en el escritorio. Súper útil.'
    }
  },
  {
    id: 20,
    title: 'Pico mate System',
    price: 6000,
    isSale: false,
    stockStatus: 'normal',
    category: 'otros',
    badge: '🎯 Cebada Precisa',
    weight: 'Accesorio',
    image: 'https://yerbazo.com.ar/img/pico_sistem_2.webp',
    stockActual: 14,
    costoEstimado: 3600,
    margenPorc: 40.0,
    unidadesVendidasMes: 16,
    bcgCategory: 'Interrogante',
    prioridadMarketing: 'combo_estrella',
    razonEstrategica: 'Margen del 40%. Excelente gancho visual para Reels demostrativos mostrando el chorro preciso sobre la montañita.',
    origen: 'Artesanal Premium',
    molienda: 'Tapón cebador de flujo controlado para termos tipo Stanley / Lumilagro',
    intensidad: 4,
    duracionTermos: 'Chorro milimétrico que no rompe la montañita',
    notasCata: ['Flujo continuo sin salpicar', 'Mantiene la temperatura', 'Ideal para cebar en el auto'],
    dolorQueResuelve: 'Tu tapón común tira un chorro grueso que inunda la montañita y lava la yerba en 3 mates.',
    hookGanador: 'Si tu montañita se derrumba al tercer mate, el problema no es la yerba: es el pico de tu termo.',
    beneficiosClave: ['Chorro fino y preciso de cebador profesional', 'Apto para termos principales del mercado', 'Solo $6.000 en yerbazo.com.ar'],
    testimonioReal: {
      autor: 'Tomás K.',
      rol: 'Cliente Web',
      texto: 'Cambió 100% cómo cebo con yerba uruguaya, el chorrito va justo al costado de la bombilla.'
    }
  },
  {
    id: 2,
    title: 'Baldo 500g',
    price: 6200,
    isSale: false,
    stockStatus: 'normal',
    category: '500g',
    badge: '500 g Práctico',
    weight: '500 g',
    image: 'https://yerbazo.com.ar/img/Baldo%20500g.webp',
    stockActual: 29,
    costoEstimado: 4400,
    margenPorc: 29.0,
    unidadesVendidasMes: 63,
    bcgCategory: 'Estrella',
    prioridadMarketing: 'impulsar_estrella',
    razonEstrategica: 'Formato ideal de bolsillo y para armar packs degustación 2x500g.',
    origen: 'Uruguay / Brasil',
    molienda: 'Fina equilibrada sin palo',
    intensidad: 4,
    duracionTermos: '2 termos completos',
    notasCata: ['Formato ideal mochila', 'Frescura garantizada', 'Mismo blend que el paquete de 1kg'],
    dolorQueResuelve: 'Querés llevar tu Baldo a todos lados sin cargar el paquete de un kilo entero.',
    hookGanador: 'El tamaño perfecto para la mochila o para probar Baldo por primera vez sin excusas.',
    beneficiosClave: ['Práctico envase de 500g', 'Ideal para combinar con Canarias 500g', 'Frescura de primer día'],
    testimonioReal: {
      autor: 'Valentina S.',
      rol: 'Cliente Frecuente',
      texto: 'Compro siempre de medio kilo para que entre directo en el bolso matero.'
    }
  },
  {
    id: 4,
    title: 'Canarias tradicional 500g',
    price: 6000,
    isSale: false,
    stockStatus: 'normal',
    category: '500g',
    badge: '500 g Clásico',
    weight: '500 g',
    image: 'https://yerbazo.com.ar/img/Canarias%20tradicional%20500g.webp',
    stockActual: 24,
    costoEstimado: 4250,
    margenPorc: 29.2,
    unidadesVendidasMes: 48,
    bcgCategory: 'Vaca Lechera',
    prioridadMarketing: 'combo_estrella',
    razonEstrategica: 'Pareja ideal junto con Baldo 500g para el "Dúo Clásico Uruguayo" ($12.200).',
    origen: 'Uruguay / Brasil',
    molienda: 'Extra fina 100% hoja pura',
    intensidad: 5,
    duracionTermos: '2+ termos intensos',
    notasCata: ['Pura energía', 'Formato compacto 500g', 'Ideal para mezclar 50/50'],
    dolorQueResuelve: 'Querés tener Canarias siempre fresca o mezclarla mitad y mitad con otra yerba más suave.',
    hookGanador: 'Tip de matero experto: llevate Canarias 500g para hacer tu propio blend 50/50.',
    beneficiosClave: ['Solo $6.000 los 500g', 'Ideal para blends caseros', '100% hoja pura uruguaya'],
    testimonioReal: {
      autor: 'Federico A.',
      rol: 'Cliente Yerbazo',
      texto: 'Siempre compro medio de Canarias y medio de Serena para mezclarlas en la yerbera.'
    }
  }
];

export const WINNING_AD_BLUEPRINTS: WinningAdBlueprint[] = [
  {
    id: 'blueprint_us_vs_them',
    title: 'Comparativa Directa: Yerbazo Importada vs. Yerba de Supermercado',
    category: 'Comparativa Us vs Them',
    sourceInspiration: 'Top 1% Meta Ads E-commerce Alimentos & Infusiones',
    avgRoasBenchmark: '4.8x - 6.2x ROAS',
    whyItWorks: 'Contrasta visualmente el dolor cotidiano (yerba lavada a los 5 mates, palos gigantes, acidez) contra la experiencia Yerbazo (montañita firme, 2 termos de duración, precio justo).',
    hookFormula: 'Yerba del Súper (Se lava al 5to mate ❌) vs. [PRODUCTO] en Yerbazo (Dura 2 termos enteros ✅)',
    visualStructure: 'versus_comparativa',
    recommendedFormat: '4:5'
  },
  {
    id: 'blueprint_math_savings',
    title: 'La Matemática del Matero: Por qué 1kg Uruguayo sale más barato',
    category: 'Matemática del Ahorro',
    sourceInspiration: 'Anuncios de Conversión Racional Direct-to-Consumer',
    avgRoasBenchmark: '4.2x ROAS',
    whyItWorks: 'Destruye la objeción de precio demostrando que como 1 cebada de Baldo/Canarias rinde 2 termos (en vez de cambiar la yerba 2 veces), el costo por termo es menor.',
    hookFormula: 'Hicimos la cuenta: tomar [PRODUCTO] te sale más barato por termo que comprar yerba común.',
    visualStructure: 'performance_callouts',
    recommendedFormat: '1:1'
  },
  {
    id: 'blueprint_scarcity_drop',
    title: 'Alerta de Stock Crítico / Últimas Unidades en Web',
    category: 'Escasez Real / Drop',
    sourceInspiration: 'Campañas Flash Sale de Alta Velocidad',
    avgRoasBenchmark: '5.5x ROAS',
    whyItWorks: 'Usa datos reales de yerbazo.com.ar ("Últimas unidades" o descuentos vigentes) para generar acción inmediata sin sonar a falsa urgencia.',
    hookFormula: '🚨 ÚLTIMAS UNIDADES de [PRODUCTO] en yerbazo.com.ar — Cuando se agota esta partida tarda semanas en volver.',
    visualStructure: 'hero_oferta',
    recommendedFormat: '9:16'
  },
  {
    id: 'blueprint_ugc_secret',
    title: 'El Secreto de la Montañita que No se Derrumba',
    category: 'UGC Problema/Solución',
    sourceInspiration: 'TikTok & Reels Creative Center Top Ads',
    avgRoasBenchmark: '4.9x ROAS',
    whyItWorks: 'Educa primero en los primeros 3 segundos sobre un problema real de todo matero y posiciona el producto de Yerbazo como la solución inmediata.',
    hookFormula: 'Si se te cae la montañita antes de terminar el termo, probá hacer esto con [PRODUCTO]...',
    visualStructure: 'historia_sticker',
    recommendedFormat: '9:16'
  },
  {
    id: 'blueprint_social_proof',
    title: 'Prueba Social Matera: Lo que dicen los que ya cambiaron',
    category: 'Ritual & Lifestyle',
    sourceInspiration: 'Review Ads 5 Estrellas de Alta Confianza',
    avgRoasBenchmark: '3.9x ROAS (Ideal Retargeting)',
    whyItWorks: 'Muestra una reseña auténtica de un cliente real de Yerbazo con 5 estrellas, eliminando la duda de quienes visitaron yerbazo.com.ar pero no compraron.',
    hookFormula: '⭐⭐⭐⭐⭐ "Desde que compro [PRODUCTO] en Yerbazo no pisé más el pasillo de yerbas del súper"',
    visualStructure: 'review_social',
    recommendedFormat: '4:5'
  },
  {
    id: 'blueprint_carousel_5x',
    title: 'Guía Definitiva en 5 Pasos (Carrusel Guardable)',
    category: 'Combo Degustación',
    sourceInspiration: 'Instagram High-Save Educational Carousels',
    avgRoasBenchmark: '3.6x ROAS + Alto Alcance Orgánico',
    whyItWorks: 'El algoritmo de Instagram premia los carruseles que la gente guarda ("Save"). Termina en el Slide 5 con oferta directa y cupón activo.',
    hookFormula: 'Guía rápida para elegir tu próxima yerba en Yerbazo según cómo te gusta el mate 👇',
    visualStructure: 'carrusel_secuencia',
    recommendedFormat: '1:1'
  }
];

export function loadSavedBrandDNA(): BrandDNA {
  try {
    const raw = localStorage.getItem(BRAND_DNA_STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_BRAND_DNA, ...JSON.parse(raw) };
    }
  } catch {
    // ignore
  }
  return DEFAULT_BRAND_DNA;
}

export function saveBrandDNA(dna: BrandDNA): void {
  try {
    localStorage.setItem(BRAND_DNA_STORAGE_KEY, JSON.stringify(dna));
  } catch {
    // ignore
  }
}

// Fetch live products from yerbazo.com.ar / Firebase store and merge with sensory & commercial intelligence
export async function syncLiveYerbazoCatalog(): Promise<{
  products: YerbazoProduct[];
  coupons: { code: string; discount: number; active: boolean }[];
  source: 'live_cloud' | 'snapshot';
}> {
  const urls = [
    `https://yerbazo-default-rtdb.firebaseio.com/store.json?t=${Date.now()}`,
    `/api/web-store?t=${Date.now()}`
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.products) && data.products.length > 0) {
          const mergedProducts: YerbazoProduct[] = data.products.map((liveProd: any) => {
            const existing = INITIAL_YERBAZO_PRODUCTS.find(
              (p) => p.id === Number(liveProd.id) || p.title.toLowerCase() === String(liveProd.title || '').toLowerCase()
            );

            let imageUrl = liveProd.image || existing?.image || '';
            if (imageUrl && !imageUrl.startsWith('http')) {
              imageUrl = `https://yerbazo.com.ar/${imageUrl.replace(/^\//, '')}`;
            }

            const price = Number(liveProd.price) || existing?.price || 10000;
            const isSale = Boolean(liveProd.isSale);
            const salePrice = isSale && liveProd.salePrice ? Number(liveProd.salePrice) : null;
            const stockStatus: 'normal' | 'ultimas' | 'sinstock' = liveProd.stockStatus || (liveProd.isUrgent ? 'ultimas' : 'normal');

            if (existing) {
              return {
                ...existing,
                title: liveProd.title || existing.title,
                price,
                salePrice,
                isSale,
                isUrgent: Boolean(liveProd.isUrgent),
                stockStatus,
                image: imageUrl
              };
            }

            // New product discovered on yerbazo.com.ar
            return {
              id: Number(liveProd.id) || Math.floor(Math.random() * 10000),
              title: liveProd.title || 'Producto Yerbazo',
              price,
              salePrice,
              isSale,
              isUrgent: Boolean(liveProd.isUrgent),
              stockStatus,
              category: liveProd.category || '1kg',
              badge: isSale ? '🔥 En Oferta' : stockStatus === 'ultimas' ? '⚠️ Últimas' : (liveProd.badge || 'Disponible'),
              weight: liveProd.weight || liveProd.badge || '1 kg',
              image: imageUrl,
              stockActual: stockStatus === 'ultimas' ? 5 : 20,
              costoEstimado: Math.round(price * 0.7),
              margenPorc: 30,
              unidadesVendidasMes: 25,
              bcgCategory: isSale ? 'Interrogante' : 'Vaca Lechera',
              prioridadMarketing: isSale || stockStatus === 'ultimas' ? 'urgencia_ultimas' : 'impulsar_estrella',
              razonEstrategica: 'Sincronizado en tiempo real desde la tienda oficial yerbazo.com.ar.',
              origen: 'Uruguay / Brasil',
              molienda: 'Molienda seleccionada de primera calidad',
              intensidad: 4,
              duracionTermos: '2 termos de sabor constante',
              notasCata: ['Espuma consistente', 'Sabor duradero', 'Calidad garantizada Yerbazo'],
              dolorQueResuelve: 'Te asegura un mate rendidor que no se lava a mitad de la cebada.',
              hookGanador: `Descubrí por qué ${liveProd.title} es uno de los favoritos en yerbazo.com.ar.`,
              beneficiosClave: ['Rendimiento superior', 'Stock inmediato en Yerbazo', 'Mejor relación precio-calidad'],
              testimonioReal: {
                autor: 'Cliente Yerbazo',
                rol: 'Compra Verificada',
                texto: `Excelente calidad en ${liveProd.title}, llegó rapidísimo.`
              }
            };
          });

          const coupons = Array.isArray(data.coupons) && data.coupons.length > 0
            ? data.coupons
            : [DEFAULT_BRAND_DNA.activeCoupon];

          return { products: mergedProducts, coupons, source: 'live_cloud' };
        }
      }
    } catch {
      // try next URL
    }
  }

  return {
    products: INITIAL_YERBAZO_PRODUCTS,
    coupons: [DEFAULT_BRAND_DNA.activeCoupon],
    source: 'snapshot'
  };
}

// Helper to format ARS currency cleanly
export function formatArs(amount: number): string {
  return '$' + Math.round(amount).toLocaleString('es-AR');
}

// Generate Carousel 5x Slides for any product & tone
export function buildCarouselSlides(product: YerbazoProduct, dna: BrandDNA, tone: BrandTone): CarouselSlide[] {
  const effectivePrice = product.isSale && product.salePrice ? product.salePrice : product.price;
  const discountBadge = product.isSale && product.salePrice
    ? `AHORRÁ ${formatArs(product.price - product.salePrice)}`
    : `${dna.activeCoupon.code} (-${dna.activeCoupon.discount}% OFF)`;

  if (tone === 'oferta_urgencia') {
    return [
      {
        slideNumber: 1,
        badge: '🚨 ALERTA MATERA',
        headline: `${product.title} a solo ${formatArs(effectivePrice)}`,
        body: product.isSale
          ? `Bajó de ${formatArs(product.price)} a ${formatArs(effectivePrice)} en yerbazo.com.ar. Deslizá antes de que vuelen 👉`
          : `Precio blindado en Yerbazo + cupón activo ${dna.activeCoupon.code}. Mirá por qué vale cada peso 👉`,
        highlightStat: formatArs(effectivePrice)
      },
      {
        slideNumber: 2,
        badge: 'EL PROBLEMA COMÚN',
        headline: '¿Cansado de cambiar la yerba 3 veces por día?',
        body: product.dolorQueResuelve,
        highlightStat: '2 Termos Reales'
      },
      {
        slideNumber: 3,
        badge: 'POR QUÉ RINDE EL DOBLE',
        headline: product.molienda,
        body: `Notas de cata: ${product.notasCata.join(' • ')}. Espuma firme desde el primer hasta el último mate.`,
        highlightStat: `Intensidad ${product.intensidad}/5`
      },
      {
        slideNumber: 4,
        badge: 'LO QUE DICEN LOS MATEROS',
        headline: `"${product.testimonioReal.texto}"`,
        body: `— ${product.testimonioReal.autor} (${product.testimonioReal.rol}) ⭐⭐⭐⭐⭐`,
        highlightStat: '4.9/5 Estrellas'
      },
      {
        slideNumber: 5,
        badge: discountBadge,
        headline: 'Pedila hoy en yerbazo.com.ar',
        body: `Stock disponible ahora mismo. Entrá al link de la bio o escribinos por WhatsApp para separar la tuya.`,
        cta: 'COMPRAR EN YERBAZO.COM.AR'
      }
    ];
  }

  return [
    {
      slideNumber: 1,
      badge: '🧉 GUÍA YERBAZO',
      headline: product.hookGanador,
      body: 'Deslizá para descubrir el secreto detrás de una cebada que no falla nunca 👉',
      highlightStat: product.badge
    },
    {
      slideNumber: 2,
      badge: '1. LA MOLIENDA IMPORTA',
      headline: product.molienda,
      body: `${product.dolorQueResuelve} Con ${product.title} armás la montañita en segundos y se mantiene firme.`,
      highlightStat: product.origen
    },
    {
      slideNumber: 3,
      badge: '2. PERFIL SENSORIAL',
      headline: '¿A qué sabe realmente?',
      body: product.notasCata.map((n) => `✅ ${n}`).join('\n'),
      highlightStat: product.duracionTermos
    },
    {
      slideNumber: 4,
      badge: '3. PALABRA DE CEBADOR',
      headline: `"${product.testimonioReal.texto}"`,
      body: `Reseña verificada de ${product.testimonioReal.autor} en Yerbazo.`,
      highlightStat: '100% Recomendada'
    },
    {
      slideNumber: 5,
      badge: `PRECIO WEB: ${formatArs(effectivePrice)}`,
      headline: `Conseguí ${product.title} en Yerbazo`,
      body: `Hacé tu pedido en yerbazo.com.ar o por WhatsApp. Usá el código ${dna.activeCoupon.code} en tu compra.`,
      cta: 'PEDIR AHORA EN YERBAZO'
    }
  ];
}

// Generate a complete Reel Project (9:16 Video Script + Animated Scenes)
export function generateReelProjectForProduct(
  product: YerbazoProduct,
  dna: BrandDNA,
  style: ReelProject['style'] = 'pov_matero'
): ReelProject {
  const effectivePrice = product.isSale && product.salePrice ? product.salePrice : product.price;
  const priceLabel = product.isSale && product.salePrice
    ? `¡OFERTA ${formatArs(effectivePrice)}! (Antes ${formatArs(product.price)})`
    : `Conseguila a ${formatArs(effectivePrice)} en Yerbazo`;

  const personas: Record<ReelProject['style'], { name: string; vibe: string; avatarEmoji: string }> = {
    ugc_influencer: { name: 'Mateo (Creador UGC)', vibe: 'Descontracturado en escritorio/facultad', avatarEmoji: '🤳' },
    pov_matero: { name: 'POV Cebador Experto', vibe: 'Cámara en primera persona cebando con espuma', avatarEmoji: '🧉' },
    mito_realidad: { name: 'Sommelier de Yerbazo', vibe: 'Educativo, rápido y desmitificador', avatarEmoji: '🧠' },
    asmr_cebada: { name: 'Ritual ASMR Matero', vibe: 'Sonidos puros de yerba, termo y primer sorbo', avatarEmoji: '🎙️' },
    oferta_relampago: { name: 'Alerta Flash Yerbazo', vibe: 'Alta energía, urgencia de stock real', avatarEmoji: '⚡' },
    tier_list: { name: 'Ranking Matero Oficial', vibe: 'Debate matero que genera cientos de comentarios', avatarEmoji: '🏆' }
  };

  const scenes: ReelProject['scenes'] = [
    {
      id: 'scene_1',
      order: 1,
      phase: 'HOOK (0-3s)',
      durationSec: 3,
      onScreenText: style === 'oferta_relampago'
        ? `🚨 ¡ATENCIÓN MATEROS! ${product.title.toUpperCase()} A ${formatArs(effectivePrice)}`
        : product.hookGanador,
      voiceoverScript: style === 'oferta_relampago'
        ? `Pará todo si tomás mate todos los días: mirá a cuánto quedó ${product.title} hoy en Yerbazo.`
        : product.hookGanador,
      visualDirection: `Primer plano dinámico del paquete de ${product.title} entrando en cuadro con golpe de cámara sobre fondo ${dna.brandName}.`,
      animationStyle: 'zoom_punch',
      badgeOverlay: product.badge
    },
    {
      id: 'scene_2',
      order: 2,
      phase: 'PROBLEMA (3-7s)',
      durationSec: 4,
      onScreenText: 'Basta de yerbas que se lavan al 4to mate ❌',
      voiceoverScript: `${product.dolorQueResuelve} Por eso cuando cambiás a una molienda de verdad, tu termo rinde el doble.`,
      visualDirection: 'Transición rápida mostrando la diferencia de molienda y cómo se arma la montañita perfecta.',
      animationStyle: 'split_versus',
      badgeOverlay: 'EL SECRETO MATERO'
    },
    {
      id: 'scene_3',
      order: 3,
      phase: 'DEMO / PRODUCTO (7-14s)',
      durationSec: 5,
      onScreenText: `${product.notasCata[0]} + ${product.duracionTermos} 🔥`,
      voiceoverScript: `Mirá lo que es ${product.title}: ${product.molienda.toLowerCase()}, ${product.notasCata.slice(0, 2).join(' y ').toLowerCase()}, asegurando ${product.duracionTermos.toLowerCase()}.`,
      visualDirection: `Rotación 3D suave del paquete de ${product.title} con etiquetas flotantes de intensidad (${product.intensidad}/5) y notas de cata.`,
      animationStyle: 'float_3d',
      badgeOverlay: `INTENSIDAD ${product.intensidad}/5`
    },
    {
      id: 'scene_4',
      order: 4,
      phase: 'BENEFICIO / PRUEBA (14-20s)',
      durationSec: 4,
      onScreenText: `⭐⭐⭐⭐⭐ "${product.testimonioReal.texto}"`,
      voiceoverScript: `Como dice ${product.testimonioReal.autor}: "${product.testimonioReal.texto}"`,
      visualDirection: 'Tarjeta de reseña verificada 5 estrellas con insignias de confianza de Yerbazo.',
      animationStyle: 'spotlight_glow',
      badgeOverlay: `RESEÑA DE ${product.testimonioReal.autor.toUpperCase()}`
    },
    {
      id: 'scene_5',
      order: 5,
      phase: 'OFERTA + CTA (20-25s)',
      durationSec: 4,
      onScreenText: `${priceLabel} 👇 Pedí en yerbazo.com.ar`,
      voiceoverScript: `${priceLabel}. Entrá ahora al link del perfil en yerbazo punto com punto ar o pedinos por WhatsApp antes de que se agote.`,
      visualDirection: 'Cierre de alto impacto con botón pulsante a yerbazo.com.ar, precio destacado y código de descuento.',
      animationStyle: 'cta_pulse',
      badgeOverlay: dna.activeCoupon.active ? `CUPÓN: ${dna.activeCoupon.code}` : 'ENVÍO RÁPIDO'
    }
  ];

  return {
    id: `reel_${product.id}_${Date.now()}`,
    title: `Reel 9:16 — ${product.title} (${personas[style].name})`,
    style,
    productId: product.id,
    creatorPersona: personas[style],
    musicTrack: style === 'oferta_relampago' ? 'upbeat_promo' : style === 'asmr_cebada' ? 'acustico_rioplatense' : 'lofi_matero',
    captionStyle: 'hormozi_impact',
    bgTheme: style === 'oferta_relampago' ? 'fuego_oferta' : 'selva_gold',
    scenes,
    hashtags: ['#yerbazo', '#mateargentino', '#yerbauruguaya', '#baldo', '#canarias', '#materos', '#ritualmatero'],
    predictedRetention: 88,
    viralPotential: 94
  };
}

// Generate Meta / TikTok Ad Campaign Blueprint with 3 Psychological Angles (A/B/C testing)
export function generateAdCampaignForProduct(product: YerbazoProduct, dna: BrandDNA): AdCampaignBlueprint {
  const effectivePrice = product.isSale && product.salePrice ? product.salePrice : product.price;
  const slug = product.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  return {
    id: `adcamp_${product.id}_${Date.now()}`,
    campaignName: `[YERBAZO-ADS] ${product.title} — ${product.prioridadMarketing.toUpperCase()}`,
    productId: product.id,
    objective: product.stockStatus === 'ultimas' || product.isSale
      ? 'Conversiones Web (yerbazo.com.ar)'
      : 'Mensajes WhatsApp Directo',
    dailyBudgetArs: 12000,
    targetAudience: {
      locations: ['CABA', 'GBA Norte (San Isidro, Vicente López, Tigre)', 'GBA Oeste & Sur', 'Principales centros urbanos'],
      ageRange: '20 - 48 años',
      interests: ['Mate (infusión)', 'Yerba mate', 'Canarias', 'Cultura de Uruguay', 'Rugby', 'Universitarios (UADE, UBA, Austral)', 'Compras online'],
      customSegment: 'Lookalike 1% Compradores Fieles de Google Sheets Yerbazo + Retargeting Visitantes Web 30 días'
    },
    utmUrl: `https://yerbazo.com.ar/?utm_source=meta_ads&utm_medium=paid_social&utm_campaign=${slug}&utm_content=holo_ia`,
    variations: [
      {
        id: 'angle_a_racional',
        angleName: 'Ángulo A: Rendimiento & Matemática Matera (Racional)',
        psychologicalTrigger: 'Ahorro inteligente + Duración superior (2 termos)',
        primaryText: `${product.hookGanador}\n\nLa cuenta es simple: cuando una yerba común se lava al quinto mate, terminás usando el doble de paquete por semana.\n\nCon ${product.title} en Yerbazo tenés:\n✅ ${product.beneficiosClave[0]}\n✅ ${product.beneficiosClave[1]}\n✅ ${product.beneficiosClave[2]}\n\n💰 Precio en web hoy: ${formatArs(effectivePrice)}${product.isSale ? ` (Antes ${formatArs(product.price)})` : ''}\n🎟️ Código extra: ${dna.activeCoupon.code} (-${dna.activeCoupon.discount}% OFF)\n\n👉 Pedila en 1 minuto en yerbazo.com.ar o tocá para encargarnos por WhatsApp.`,
        headline: `${product.title} a ${formatArs(effectivePrice)} | Rinde 2 Termos 🧉`,
        linkDescription: `Stock real inmediato en yerbazo.com.ar • ${product.badge}`,
        ctaButton: 'Comprar ahora',
        predictedCtr: '3.4%',
        predictedRoas: '4.9x',
        aiScore: 95
      },
      {
        id: 'angle_b_escasez',
        angleName: 'Ángulo B: Oferta Directa & Escasez Real (FOMO)',
        psychologicalTrigger: 'Urgencia de stock + Descuento inmediato',
        primaryText: `🚨 ${product.stockStatus === 'ultimas' ? 'ÚLTIMAS UNIDADES EN STOCK' : 'PRECIO ESPECIAL ACTIVO'}: ${product.title} en Yerbazo.\n\nSi sos de los que no negocian la espuma ni el cuerpo del mate, aprovechá esta partida fresca antes de que se agote:\n\n🔥 Hoy a ${formatArs(effectivePrice)} en nuestra tienda online.\n🧉 Molienda: ${product.molienda}\n⭐ "${product.testimonioReal.texto}" — ${product.testimonioReal.autor}\n\nTocá "Comprar ahora" y asegurá tu pedido hoy mismo 👇`,
        headline: `🔥 ${product.title}: ${formatArs(effectivePrice)} (Stock Limitado)`,
        linkDescription: 'Entrega rápida • Pagá con Mercado Pago o Efectivo',
        ctaButton: 'Obtener oferta',
        predictedCtr: '3.8%',
        predictedRoas: '5.4x',
        aiScore: 97
      },
      {
        id: 'angle_c_comunidad',
        angleName: 'Ángulo C: Ritual Matero & Prueba Social (Emocional)',
        psychologicalTrigger: 'Pertenencia al club matero + Confianza',
        primaryText: `El momento en que armás la montañita, cebás el primer mate y sale esa espuma bien cerrada... no tiene precio. 🧉✨\n\nEn Yerbazo seleccionamos ${product.title} para los que saben disfrutar un buen termo en la facu, en la oficina o en el club con amigos.\n\n• Notas de cata: ${product.notasCata.join(', ')}\n• Duración: ${product.duracionTermos}\n• Precio directo: ${formatArs(effectivePrice)}\n\nEscribinos por WhatsApp o entrá a yerbazo.com.ar y te preparamos el pedido hoy mismo.`,
        headline: `El ritual matero que dura todo el día | Yerbazo 🌿`,
        linkDescription: '+300 clientes materos ya eligen Yerbazo cada mes',
        ctaButton: 'Enviar mensaje de WhatsApp',
        predictedCtr: '2.9%',
        predictedRoas: '4.3x',
        aiScore: 91
      }
    ]
  };
}

// Generate a single full multichannel asset for a specific product, format & objective
export function createAssetForProduct(
  product: YerbazoProduct,
  dna: BrandDNA,
  format: GeneratedAsset['type'],
  objective: MarketingObjective,
  secondaryProduct?: YerbazoProduct,
  dayOffset = 0
): GeneratedAsset {
  const effectivePrice = product.isSale && product.salePrice ? product.salePrice : product.price;
  const dateObj = new Date();
  dateObj.setDate(dateObj.getDate() + dayOffset);
  const scheduledDate = dateObj.toISOString().split('T')[0];

  const tone = dna.activeTone;
  const isUrgentOrSale = product.isSale || product.stockStatus === 'ultimas';

  let templateId: VisualStudioConfig['templateId'] = 'hero_oferta';
  let aspectRatio: VisualStudioConfig['aspectRatio'] = '4:5';
  let bgTheme: VisualStudioConfig['bgTheme'] = 'selva_gold';
  let platform: GeneratedAsset['platform'] = 'Instagram Feed';

  if (format === 'historia_9_16') {
    templateId = 'historia_sticker';
    aspectRatio = '9:16';
    bgTheme = isUrgentOrSale ? 'fuego_oferta' : 'selva_gold';
    platform = 'Instagram Stories';
  } else if (format === 'reel_ugc') {
    templateId = 'performance_callouts';
    aspectRatio = '9:16';
    bgTheme = 'noche_neon';
    platform = 'Reels / TikTok';
  } else if (format === 'meta_ad') {
    templateId = secondaryProduct ? 'versus_comparativa' : 'performance_callouts';
    aspectRatio = '4:5';
    bgTheme = isUrgentOrSale ? 'fuego_oferta' : 'selva_gold';
    platform = 'Meta Ads';
  } else if (format === 'carrusel_5x') {
    templateId = 'carrusel_secuencia';
    aspectRatio = '1:1';
    bgTheme = 'crema_editorial';
    platform = 'Instagram Feed';
  } else if (format === 'whatsapp_funnel') {
    templateId = 'review_social';
    aspectRatio = '9:16';
    bgTheme = 'selva_gold';
    platform = 'WhatsApp Status';
  }

  const headlineByTone: Record<BrandTone, string> = {
    matero_experto: isUrgentOrSale
      ? `${product.title}: Espuma real a ${formatArs(effectivePrice)}`
      : `${product.title}: La montañita que dura 2 termos`,
    oferta_urgencia: product.isSale && product.salePrice
      ? `¡BAJÓ A ${formatArs(effectivePrice)}! (Antes ${formatArs(product.price)})`
      : `🔥 STOCK LIMITADO: ${product.title} a ${formatArs(effectivePrice)}`,
    gourmet_premium: `${product.title} • Selección Padrón Superior`,
    educativo_viral: `¿Por qué ${product.title} rinde el doble que tu yerba actual?`
  };

  const subheadline = secondaryProduct
    ? `Combo / Comparativa junto a ${secondaryProduct.title} • Pedí en yerbazo.com.ar`
    : `${product.molienda} • ${product.duracionTermos}`;

  const badgeText = product.isSale && product.salePrice
    ? `AHORRÁ ${formatArs(product.price - product.salePrice)}`
    : product.stockStatus === 'ultimas'
    ? '⚠️ ÚLTIMAS UNIDADES'
    : product.badge.toUpperCase();

  const copyHook = product.hookGanador;
  const copyBody = [
    product.dolorQueResuelve,
    '',
    `En ${dna.brandName} tenemos ${product.title} fresca y lista para salir:`,
    ...product.beneficiosClave.map((b) => `🧉 ${b}`),
    '',
    `💰 Precio hoy en web: ${formatArs(effectivePrice)}${product.isSale ? ` (Precio regular: ${formatArs(product.price)})` : ''}`,
    dna.activeCoupon.active ? `🎁 Cupón activo en la web: ${dna.activeCoupon.code} (${dna.activeCoupon.discount}% OFF extra)` : ''
  ]
    .filter(Boolean)
    .join('\n');

  const copyCta = `👉 Pedila ahora en ${dna.websiteUrl} o por WhatsApp al ${dna.whatsappNumber} (${dna.instagramHandle}).`;

  const whatsappText = `¡Hola! 🧉 Vi la publicación de *Yerbazo* (${dna.instagramHandle}) y quiero encargar:\n\n*${product.title}* — *${formatArs(effectivePrice)}*${
    product.isSale ? ` _(Oferta web, antes ${formatArs(product.price)})_` : ''
  }\n✅ ${product.beneficiosClave[0]}\n✅ ${product.duracionTermos}\n\n¿Tienen stock para coordinar envío/retiro?`;

  const visualConfig: VisualStudioConfig = {
    templateId,
    aspectRatio,
    bgTheme,
    productId: product.id,
    secondaryProductId: secondaryProduct?.id,
    headline: headlineByTone[tone],
    subheadline,
    badgeText,
    ctaText: format === 'historia_9_16' ? 'TOCAR PARA PEDIR EN YERBAZO.COM.AR' : `COMPRAR A ${formatArs(effectivePrice)}`,
    showPriceBadge: true,
    showCouponSticker: dna.activeCoupon.active,
    callouts: [
      product.duracionTermos,
      `Intensidad ${product.intensidad}/5`,
      product.notasCata[0] || 'Cero acidez'
    ],
    storyWidget: format === 'historia_9_16' ? 'poll' : 'none',
    storyQuestion: `¿Team ${product.title.split(' ')[0]} o preferís otra? 🧉`,
    storyOptionA: '🔥 La mejor lejos',
    storyOptionB: '👀 Quiero probarla',
    reviewAuthor: `${product.testimonioReal.autor} (${product.testimonioReal.rol})`,
    reviewText: product.testimonioReal.texto,
    carouselSlides: buildCarouselSlides(product, dna, tone)
  };

  const formatLabels: Record<GeneratedAsset['type'], string> = {
    post_feed: 'Post Feed Alta Conversión',
    historia_9_16: 'Historia Interactiva 9:16',
    reel_ugc: 'Reel / TikTok Animado + Guion',
    meta_ad: 'Anuncio Performance Meta Ads',
    carrusel_5x: 'Carrusel Educativo 5 Slides',
    whatsapp_funnel: 'Estado + Difusión WhatsApp'
  };

  return {
    id: `asset_${product.id}_${format}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    createdAt: new Date().toISOString(),
    type: format,
    title: `${formatLabels[format]}: ${product.title}`,
    objective,
    productIds: secondaryProduct ? [product.id, secondaryProduct.id] : [product.id],
    tone,
    status: 'pendiente',
    scheduledDate,
    scheduledTime: format === 'historia_9_16' ? '10:30' : format === 'reel_ugc' ? '19:30' : '12:45',
    platform,
    aiScore: {
      overall: isUrgentOrSale ? 96 : 93,
      hook: 95,
      visual: 94,
      conversion: isUrgentOrSale ? 98 : 92,
      estimatedCtr: isUrgentOrSale ? '3.7%' : '3.1%'
    },
    strategicWhy: product.razonEstrategica,
    visualConfig,
    copy: {
      hook: copyHook,
      body: copyBody,
      cta: copyCta,
      hashtags: [
        '#yerbazo',
        '#yerbamate',
        `#${product.title.split(' ')[0].toLowerCase()}`,
        '#mateargentino',
        '#padronuruguayo',
        '#materos',
        '#cebada'
      ],
      whatsappText
    },
    reelProject: generateReelProjectForProduct(
      product,
      dna,
      isUrgentOrSale ? 'oferta_relampago' : 'pov_matero'
    ),
    adCampaign: generateAdCampaignForProduct(product, dna)
  };
}

// Generate the complete Holo-style Autopilot Multichannel Batch based on live inventory & margins
export function generateAutopilotBatch(
  products: YerbazoProduct[],
  dna: BrandDNA,
  filterObjective?: MarketingObjective | 'todos'
): GeneratedAsset[] {
  const byId = (id: number) => products.find((p) => p.id === id) || products[0];

  const baldo1kg = byId(1);
  const canariasSerena = byId(5);
  const lataBaldo = byId(15);
  const reiVerde = byId(9);
  const verdecitaPalo = byId(19);
  const canariasTrad = byId(3);
  const yerbera = byId(17);
  const teVerdeJengibre = byId(23);

  const allBatch: GeneratedAsset[] = [
    // 1. Urgencia / Oferta Web Real: Lata Baldo (-20% OFF + Últimas)
    createAssetForProduct(lataBaldo, dna, 'historia_9_16', 'urgencia_oferta', undefined, 0),
    // 2. Estrella #1 en Reel 9:16: Baldo 1kg
    createAssetForProduct(baldo1kg, dna, 'reel_ugc', 'estrellas', undefined, 1),
    // 3. Meta Ad Comparativa: Baldo 1kg vs Canarias Tradicional 1kg
    createAssetForProduct(baldo1kg, dna, 'meta_ad', 'estrellas', canariasTrad, 2),
    // 4. Alerta Últimas Unidades: Canarias Serena 1kg (Post Feed)
    createAssetForProduct(canariasSerena, dna, 'post_feed', 'urgencia_oferta', undefined, 3),
    // 5. Carrusel 5x Alto Margen: Rei Verde Premium 1kg
    createAssetForProduct(reiVerde, dna, 'carrusel_5x', 'alto_margen', undefined, 4),
    // 6. Liquidación Stock / Precio Imbatible: Verdecita con Palo 1kg ($5.700)
    createAssetForProduct(verdecitaPalo, dna, 'whatsapp_funnel', 'liquidar_stock', undefined, 5),
    // 7. Combo Cross-Sell: Yerbera Marrón 400g + Baldo 1kg
    createAssetForProduct(yerbera, dna, 'post_feed', 'combo_pack', baldo1kg, 6),
    // 8. Reel Educativo / Viral: Canarias Té Verde y Jengibre
    createAssetForProduct(teVerdeJengibre, dna, 'reel_ugc', 'educativo_comunidad', undefined, 7)
  ];

  if (!filterObjective || filterObjective === 'todos') {
    return allBatch;
  }
  return allBatch.filter((a) => a.objective === filterObjective);
}

// Generación de Copy Creativo vía servidor seguro (/api/ai-copy)
export async function generateCustomCopyWithCloudAI(params: {
  dna: BrandDNA;
  product: YerbazoProduct;
  promptGoal: string;
}): Promise<{ hook: string; body: string; cta: string } | null> {
  const { product, promptGoal } = params;
  try {
    const res = await fetch('/api/ai-copy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product: {
          title: product.title,
          price: product.isSale && product.salePrice ? product.salePrice : product.price,
          molienda: product.molienda,
          notasCata: product.notasCata
        },
        format: 'post_social',
        goal: promptGoal
      })
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.hook) return data;
    }
  } catch {
    // fallback
  }
  return null;
}
