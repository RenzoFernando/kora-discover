# KORA-Discover

Landing estática de KORA Discover preparada para recibir tráfico desde Meta Ads y desplegarse con Cloudflare Pages.

## Estructura

- `index.html`: landing principal.
- `musica-local/`, `artistas-emergentes/`, `escenas-urbanas/`: páginas de contenido interconectadas con meta-títulos y meta-descripciones propios.
- `page/`: ruta desindexada con `noindex`.
- `robots.txt`, `sitemap.xml`, `llms.txt`: archivos de descubrimiento e indexación.
- `_headers`: encabezados HTTP para Cloudflare Pages.
- `assets/js/analytics.js`: integración opcional con Meta Pixel.
- `assets/js/site.js`: conservación de UTMs, tracking del CTA y botón de compartir.

## Despliegue en Cloudflare Pages

La URL prevista para el proyecto es:

`https://kora-discover.pages.dev/`

Cloudflare Pages utiliza el dominio `*.pages.dev`, no `*.pages.app`.

Configuración recomendada al conectar el repositorio de GitHub:

- **Project name:** `cora-discover`
- **Production branch:** `main`
- **Framework preset:** None
- **Build command:** `exit 0`
- **Build output directory:** `.`

El repositorio debe tener `index.html` en la raíz.

Si Cloudflare asigna otro nombre porque `kora-discover.pages.dev` no está disponible, actualizar en los archivos los `canonical`, `og:url`, las URLs de Schema, `robots.txt`, `sitemap.xml` y `llms.txt`.

## Meta Pixel

La landing funciona sin Pixel. Para activarlo, reemplazar el contenido vacío de:

```html
<meta name="facebook-pixel-id" content="">
```

por el ID real en las cuatro páginas indexables. `assets/js/analytics.js` cargará el Pixel y enviará `PageView`. Los botones que llevan al prototipo envían además el evento personalizado `TryKora`.

No se incluyó un ID inventado porque debe provenir de la cuenta publicitaria real del equipo.

## UTMs para Meta Ads

Los parámetros `utm_source`, `utm_medium`, `utm_campaign`, `utm_content` y `utm_term` se conservan durante la sesión y se transfieren al enlace del prototipo junto con `ref=kora-discover`.

Ejemplo:

`https://kora-discover.pages.dev/?utm_source=meta&utm_medium=paid_social&utm_campaign=validacion_kora&utm_content=video_ugc`

## Ruta `/page/`

La ruta incluye `meta robots="noindex,nofollow,noarchive"`. No se bloquea en `robots.txt` para que los rastreadores puedan leer la directiva `noindex`.
