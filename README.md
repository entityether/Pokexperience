# PokExperience — migración GitHub

Base: **PokExperience v0.44.8**

Esta carpeta es una migración 1:1 del prototipo monolítico a una estructura apta para GitHub.
No se han rediseñado mecánicas intencionalmente en esta migración.

## Estructura

- `index.html` — entrada del juego
- `css/pokexperience.css` — estilos
- `js/pokexperience.js` — lógica actual del juego
- `assets/` — imágenes extraídas del antiguo Base64
- `assets_manifest.json` — listado técnico de recursos extraídos

## Probar localmente

Podés abrir `index.html` directamente en el navegador.

Para GitHub Pages:
1. Subí todo el contenido de esta carpeta al repositorio.
2. En GitHub: Settings → Pages.
3. Source: Deploy from a branch.
4. Branch: `main` / `(root)`.
5. Guardá.

## Importante

La v0.44.8 original tenía las imágenes incrustadas en Base64 dentro del HTML y superaba los 25 MB.
En esta versión los recursos son archivos independientes, por lo que GitHub puede manejarlos normalmente.
