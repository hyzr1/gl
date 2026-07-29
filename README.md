# Hyzr GL

**A typed WebGL2 effects engine with live documentation, reusable shader presets, and framework-friendly APIs.**

Hyzr GL turns procedural browser graphics into a small, inspectable library rather than a collection of one-off canvas demos. The same configuration model drives the low-level renderer, React hook, preset catalog, documentation examples, and interactive settings playground.

Part of the Hyzr product family. Repository: `gl`. Reserved address: `gl.hyzr.ai`.

## Highlights

- WebGL2 renderer with explicit setup, animation, resize, pointer, and cleanup lifecycles
- Six procedural shader effects: aurora, liquid, particles, topographic lines, glass grid, and ray-marched orb
- Twelve production-ready presets with customizable palettes and motion
- Typed configuration, control metadata, and renderer contracts
- React hook and framework-independent canvas API
- Interactive preset gallery, effect gallery, and settings playground
- Documentation for shader concepts, rendering performance, framework integration, and API usage
- Reduced-motion support and bounded device-pixel-ratio rendering

## Architecture

| Layer | Responsibility |
| --- | --- |
| `src/lib/hypergl/renderer.ts` | WebGL2 lifecycle, uniforms, input, resizing, capture, and cleanup |
| `src/lib/hypergl/shaders.ts` | Fullscreen vertex shader and procedural fragment effects |
| `src/lib/hypergl/presets.ts` | Default configuration, effect labels, and curated presets |
| `src/lib/hypergl/controls.ts` | Typed control paths, ranges, groups, and descriptions |
| `src/lib/hypergl/react.ts` | React lifecycle adapter |
| `src/components/DocsLiveDemo.tsx` | Real renderer instances used by interactive documentation |
| `src/content/docs.ts` | Structured documentation content and navigation |

The product brand is **Hyzr GL**. Existing TypeScript identifiers retain the `HyperGL` prefix so the original renderer API remains stable.

## Renderer API

```tsx
"use client";

import { useHyperGL } from "@/lib/hypergl";

export function HeroBackground() {
  const { canvasRef } = useHyperGL({
    effect: "aurora",
    palette: ["#dbeafe", "#8b5cf6", "#2563eb"],
    speed: 0.32,
    bloom: 0.2,
    cursor: { enabled: true, radius: 0.34, strength: 0.5 },
  });

  return <canvas ref={canvasRef} className="hero-canvas" />;
}
```

The vanilla API exposes the same configuration model:

```ts
import { createHyperGLRenderer } from "@/lib/hypergl";

const canvas = document.querySelector("canvas");
if (!canvas) throw new Error("Canvas not found");

const renderer = createHyperGLRenderer(canvas, {
  pixelRatioLimit: 1.5,
  config: {
    effect: "glassGrid",
    density: 0.82,
    bloom: 0.22,
  },
});

renderer.setConfig({ distortion: 0.36 });
renderer.destroy();
```

## Run locally

Requirements: Node.js 22+ and npm.

```bash
npm install
npm run dev
```

Open `http://localhost:3000` for the product site or `http://localhost:3000/docs` for the documentation.

## Validation

```bash
npm run typecheck
npm test
npm run build
npm audit
```

The test suite covers configuration isolation and merging, control-schema integrity, effect coverage, preset identifiers, and valid preset values. GitHub Actions runs the full verification pipeline on every push and pull request.

## Documentation

- [Getting started](docs/getting-started.md)
- [API reference](docs/api-reference.md)
- [Effects](docs/effects.md)
- [Live examples](docs/live-examples.md)
- [Rendering](docs/rendering.md)
- [Shader concepts](docs/shader-concepts.md)
- [Framework integration](docs/frameworks.md)
- [Research notes](docs/research.md)

## Current scope

Hyzr GL is intentionally focused on a compact WebGL2 engine and its documentation. Multipass post-processing, framebuffer feedback, 3D mesh support, package publishing, and Three.js interoperability remain future work rather than implied features.

---

A project by [Kaylem](https://github.com/hyzr1).
