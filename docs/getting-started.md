# Getting Started

HyperGL is a local TypeScript WebGL library and documentation site. The project is intentionally library-first: the renderer, presets, controls, and examples live together while the API matures before npm publishing.

## Installation

Website route: `/docs/getting-started/installation`

Install dependencies and start the documentation lab:

```bash
npm install
npm run dev
```

Open the main docs:

```txt
http://localhost:3000/docs
```

Useful live routes:

```txt
http://localhost:3000/docs/examples/preset-gallery
http://localhost:3000/docs/examples/effect-gallery
http://localhost:3000/docs/examples/setting-playground
```

The current goal is library quality: predictable config, useful presets, framework examples, shader notes, and docs that show the visual result of each setting.

## Project Structure

Website route: `/docs/getting-started/project-structure`

The repo is organized so a GitHub reviewer can scan it quickly:

```bash
src/app             # Next.js routes
src/components      # Docs UI, live demos, canvas wrapper
src/content/docs.ts # Typed website docs map and navigation
src/lib/hypergl     # Public library API, renderer, shaders, presets
docs                # GitHub Markdown docs
```

The library boundary is `src/lib/hypergl`. Site code should import from that public API the same way a user would. That keeps examples honest because docs, components, and demos use the real renderer.

Public entry point:

```ts
export {
  createHyperGLRenderer,
  useHyperGL,
  HYPERGL_PRESETS,
  HYPERGL_CONTROLS,
  HYPERGL_PALETTES,
  EFFECT_LABELS,
  DEFAULT_HYPERGL_CONFIG,
} from "@/lib/hypergl";
```

## Quick Start

Website route: `/docs/getting-started/quick-start`

The React hook is the fastest way to render a first scene. It creates the renderer after the canvas mounts, sends config updates into WebGL uniforms, and destroys the renderer when the component unmounts.

```tsx
"use client";

import { useHyperGL } from "@/lib/hypergl";

export function FirstHyperGLScene() {
  const { canvasRef } = useHyperGL({
    effect: "aurora",
    palette: ["#dbeafe", "#8b5cf6", "#2563eb"],
    speed: 0.32,
    bloom: 0.2,
    cursor: { enabled: true, radius: 0.34, strength: 0.5 },
  });

  return <canvas ref={canvasRef} className="hypergl-canvas" />;
}
```

The canvas must have a real CSS size. HyperGL reads the element bounds and resizes the drawing buffer to match.

```css
.hypergl-canvas {
  display: block;
  width: 100%;
  height: min(520px, 70vh);
}
```

Mental model:

| Config area | What it does |
| --- | --- |
| `effect` | Selects the shader branch. |
| `palette` | Supplies three RGB colors used by the shader. |
| `speed` | Multiplies animation time. |
| `scale` | Changes the spatial zoom of the procedural field. |
| `density` | Adds or removes repeated visual structure. |
| `distortion` | Warps coordinates before the effect is evaluated. |
| `cursor` | Adds pointer response. |
| `bloom` and `grain` | Tune the final visual finish. |

## Troubleshooting

Website route: `/docs/getting-started/troubleshooting`

### Blank Canvas

A blank canvas is usually caused by sizing, client/server boundaries, or WebGL support before it is caused by shader math.

Check these first:

- The `canvas` element exists in the DOM.
- The canvas CSS width and height are greater than zero.
- The component using `useHyperGL` has `"use client";` at the top.
- `canvas.getContext("webgl2")` returns a context in the browser.
- The browser console does not show a shader compilation error.

### Stale Development Server

After running production builds or changing generated output, restart the dev server:

```bash
# Stop the current dev server terminal, then run:
npm run dev
```

### Config Debugging

When an effect looks too strong, reduce these first:

| Symptom | First values to reduce |
| --- | --- |
| Too bright | `bloom`, then `intensity` |
| Too chaotic | `distortion`, then `speed` |
| Too busy | `density`, then `scale` |
| Pointer feels jumpy | `cursor.strength`, then increase `cursor.smoothing` slowly |
| Background competes with text | `bloom`, `intensity`, and `grain` |

The fastest debugging route is:

```txt
http://localhost:3000/docs/examples/setting-playground
```
