# Toque Dulce May Gra - Landing

Sitio de una sola pagina para reposteria artesanal en Dorrego, Guaymallén, Mendoza. Objetivo: generar consultas por WhatsApp. Sin backend, sin pagos, sin build.

## Stack
- `index.html` autocontenido: HTML + CSS + JavaScript embebidos.
- Sin frameworks, sin dependencias JS, sin CDN de animacion.
- Fuentes: DM Serif Display (titulos) e Inter (cuerpo) via Google Fonts.
- Animaciones: CSS keyframes + `IntersectionObserver`; respetan `prefers-reduced-motion`.

## Estructura
```
index.html                 landing principal
404.html
aviso-legal.html
politica-privacidad.html
politica-cookies.html
robots.txt
assets/                    fotos reales, logo y favicons
```

## Secciones
1. Header sticky con navegacion y menu movil.
2. Hero dividido: texto a la izquierda, imagen enmarcada a la derecha.
3. Productos: 6 tarjetas con consulta directa por WhatsApp.
4. Selector de consulta: checkboxes que arman un mensaje de WhatsApp.
5. Historia de la marca.
6. Como pedir en tres pasos.
7. Galeria: 8 fotos reales de trabajos y pedidos.
8. Preguntas frecuentes con `<details>` nativo.
9. CTA final, footer y boton flotante de WhatsApp.

## Identidad
- Logo: assets/logo.jpg (360x360) en header y footer.
- Favicon: assets/logo-64.png; icono Apple: assets/logo-180.png.
- Marca escrita: logo + Toque Dulce + May Gra - Mendoza.

## Datos de la marca
- WhatsApp: +54 9 261 565-0989 (`5492615650989` en los enlaces `wa.me`).
- Instagram: https://www.instagram.com/toquedulcemaygra/
- Ubicacion: Dorrego, Guaymallén, Mendoza, Argentina.

Anticipacion, envios y medios de pago se coordinan por WhatsApp. No hay plazos ni precios fijos publicados.

## Estado
- Catalogo confirmado por la clienta.
- Logo integrado en header, footer y favicon.
- Los testimonios se retiraron por no ser verificables.
- El sitio aun no tiene dominio asignado.

## Conversion
Todos los CTA abren `https://wa.me/5492615650989` con mensaje precargado. El selector de productos construye el texto con `encodeURIComponent`.

## Accesibilidad y SEO
- Un solo `<h1>`, skip link, foco visible y navegacion por teclado.
- Contraste de texto AA.
- `prefers-reduced-motion` desactiva las animaciones de entrada.
- Titulo y meta description unicos, Open Graph, Twitter Card y Schema.org `Bakery` en JSON-LD.
- `robots.txt` incluido.

## Publicar
Subir la carpeta a cualquier hosting estatico (GitHub Pages, Netlify, Vercel, cPanel). No requiere build ni base de datos.

## Editar productos
Cada tarjeta esta en `#productos` dentro de `index.html`. Cambiar nombre, descripcion y el enlace `wa.me` de la tarjeta. Actualizar tambien el valor del checkbox en el selector de consulta.
