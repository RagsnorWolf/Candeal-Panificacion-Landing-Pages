# Candeal · landing mejorada

Sitio estático (HTML + CSS + JS). No necesita Node, npm ni compilar. Se sube tal cual a cualquier hosting.

## 1. Antes de publicar: reemplazos obligatorios

Buscá y reemplazá estos textos en todos los archivos (en cualquier editor, "buscar en carpeta"):

| Texto a buscar | Reemplazar por | Dónde está |
|---|---|---|
| `__WHATSAPP__` | Número de WhatsApp sin signos ni espacios, formato `549` + código de área sin 0 + número sin 15. Ej.: `5492611234567` | `index.html`, `404.html` |
| `__GA4_ID__` | ID de medición de Google Analytics 4 (`G-XXXXXXXXXX`) | `js/main.js` (primeras líneas) |
| `__RAZON_SOCIAL__` | Nombre o razón social del titular | `aviso-legal.html`, `politica-de-privacidad.html` |
| `__CUIT__` | CUIT del titular | `aviso-legal.html`, `politica-de-privacidad.html` |
| `https://candeal.com.ar` | Tu dominio real, si es otro | `index.html`, páginas legales, `sitemap.xml`, `robots.txt` |

Para comprobar que no quedó nada sin reemplazar, desde la carpeta del sitio:

    grep -rn "__[A-Z0-9_]*__" .

Si `__GA4_ID__` queda sin reemplazar, el sitio funciona igual pero no mide visitas.
Si `__WHATSAPP__` queda sin reemplazar, el botón abre una página de error.

## 2. Publicar con HTTPS forzado

| Hosting | Qué usar |
|---|---|
| Apache (cPanel, Hostinger, DonWeb, etc.) | Subí todo, incluido `.htaccess` (archivo oculto). Redirige http a https, comprime, cachea y agrega cabeceras de seguridad. |
| Netlify o Cloudflare Pages | Usa `_headers`. El HTTPS es automático: activá "Force HTTPS" en el panel. |
| Vercel | Usa `vercel.json`. El HTTPS es automático. |
| GitHub Pages | En Settings > Pages activá "Enforce HTTPS". Las cabeceras no aplican. |

Antes de subir, confirmá que el certificado SSL ya está activo en tu dominio. El archivo manda la cabecera HSTS, que le dice al navegador que use solo HTTPS durante 12 meses.
Después de publicar, probá: `http://tudominio` debe saltar a `https://`, y una URL inexistente debe mostrar la página 404.

El sitio espera estar en la raíz del dominio (no en una subcarpeta).

## 3. Ficha de Google (Google Business Profile)

La ficha se crea con tu cuenta de Google, no se puede automatizar desde el sitio. Pasos:

1. Entrá a business.google.com y buscá "Candeal Panificación". Si ya existe (el sitio enlaza a una), reclamala. Si no, creala.
2. Verificá la ficha (llamada, SMS o postal, según te ofrezca Google).
3. Completá: categoría principal "Panadería", secundarias "Cafetería" y "Pastelería"; dirección Lamadrid 1528, Dorrego; horarios lunes a sábado 8 a 21 h, domingo cerrado; teléfono; sitio web `https://tudominio`.
4. Subí fotos del local, del mostrador y de los productos. Publicá novedades con frecuencia y respondé las reseñas.
5. Usá exactamente el mismo nombre, dirección y teléfono que figuran en el sitio.

El sitio ya incluye datos estructurados (`Bakery` y `CafeOrCoffeeShop`) con dirección, horarios y el enlace a tu ficha.

## 4. Analítica y buscadores

- Creá una propiedad en Google Analytics 4 y copiá el ID `G-...`. En Administrar datos > Retención, elegí 14 meses.
- El sitio mide un evento llamado `whatsapp_click` (con el lugar del botón). Marcalo como "evento clave" en GA4 para ver cuánta gente te escribe.
- Google Analytics solo se carga si la persona acepta las cookies.
- En Google Search Console verificá el dominio y enviá `https://tudominio/sitemap.xml`.

## 5. Qué se corrigió y mejoró

Errores del original:
- Faltaba el favicon propio: se usaba el de Vite. Ahora es la espiga del logo.
- Los enlaces legales y el crédito apuntaban a `#`. Ahora hay tres páginas reales.
- El QR del menú era un dibujo de relleno que no se podía escanear. Se quitó.
- Las fotos venían de Unsplash (no eran de Candeal y dependían de un sitio externo). Ahora son cuadros de tus propios videos.
- Los videos son verticales (720x1280) y se estiraban a pantalla completa en escritorio, borrosos. En escritorio ahora van en un panel a la derecha; en móvil ocupan toda la pantalla.
- El titular del hero se rompía en una etiqueta por letra con JavaScript. Ahora es texto normal con animación CSS.
- La galería se movía sola sin poder pausarse y sin descripciones. Ahora se desliza a mano, con botones y texto alternativo.
- Contraste insuficiente (terracota 4,27:1). Ahora todos los textos cumplen AA (mínimo 4,5:1).
- El texto "tostados con manteca" tenía error de concordancia.
- El proyecto traía una plantilla de React/Vite sin usar y `node_modules` (86 MB). Se eliminó.

Lo que se agregó, punto por punto:
- Aviso legal, política de privacidad y política de cookies (basadas en la Ley 25.326), más aviso de cookies con Aceptar y Rechazar y botón "Configurar cookies" en el pie.
- HTTPS forzado, cabeceras de seguridad y caché (archivos de la sección 2).
- Meta título y descripción, canonical, Open Graph, Twitter Card, datos estructurados JSON-LD, `sitemap.xml`, `robots.txt`.
- Favicon, apple-touch-icon y manifest.
- Texto alternativo en todas las imágenes, con ancho y alto declarados.
- Imágenes en WebP y videos recomprimidos: de 29 MB a menos de 2 MB en total.
- Carga rápida: sin GSAP ni Lenis, scripts con `defer`, imágenes y videos con carga diferida, videos que se pausan fuera de pantalla, sin video con ahorro de datos o movimiento reducido.
- Diseño adaptable y probado en móvil (390 px) y escritorio (1440 px).
- Página 404 personalizada. No hay enlaces rotos internos (verificado).
- Un único llamado a la acción en todo el sitio: "Escribinos por WhatsApp" (barra superior, hero, contacto y botón flotante).
- Correo protegido contra bots de spam. El sitio no tiene formularios, así que no hay nada que spamear. Si más adelante querés uno, hay que sumarlo con honeypot y Cloudflare Turnstile.

## 6. Pendientes que dependen de vos

- Revisión de los textos legales por un abogado o contador antes de publicar. Son una base, no asesoramiento legal.
- Reemplazar las imágenes por fotos reales del local cuando las tengas. Las actuales parecen generadas con IA y las páginas legales las declaran como ilustrativas.
- Si querés evitar que Google reciba la IP de los visitantes, descargá las fuentes Figtree y Fraunces y servilas desde `/fonts`. Hoy se cargan desde Google Fonts y está declarado en la política de privacidad.
- Las afirmaciones del texto ("masa madre", "fermentó toda la noche", etc.) son las del original: confirmá que sean ciertas.
- Un menú digital real, si lo querés, se puede sumar como página o enlace aparte.
