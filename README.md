# 🧉 Yerbazo Holo IA 2.0 | Estudio Autónomo de Marketing, Reels, Historias y Ads

Plataforma web **100% independiente y lista para subir a la nube (Vercel / Render / Netlify)** diseñada exclusivamente para **Yerbazo** (`https://yerbazo.com.ar/`).

Integra y supera las capacidades de **Holo IA (`tryholo.ai`)**, **AdCreative.ai**, **Creatify** y **Predis.ai**, conectándose en vivo con el catálogo, fotos, precios, cupones y stock real de Yerbazo.

---

## 🚀 Cómo Iniciar Localmente o Subir a la Nube

### Opción 1: Un Clic en Windows
Ejecuta **`iniciar-holo.bat`** dentro de la carpeta `yerbazo-holo-ia`. Se abrirá automáticamente en `http://localhost:3002`.

### Opción 2: Subir a la Nube (Vercel / Render)
Esta carpeta (`yerbazo-holo-ia`) es un proyecto independiente completo:
1. Súbela a un nuevo repositorio de GitHub o impórtala directo en **Vercel** con `vercel --prod`.
2. Incluye funciones serverless en `/api/web-store.js`, `/api/sheet.js` y `/api/image-proxy.js` más `vercel.json` preconfigurado para que la sincronización en vivo con `yerbazo.com.ar` y la descarga de imágenes HD funcionen en la nube sin bloqueos CORS.
