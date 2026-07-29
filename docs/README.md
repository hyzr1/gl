# Hyzr GL Documentation

This folder mirrors the website documentation in GitHub-friendly Markdown. The website version has live WebGL canvases; the GitHub version has the same concepts, examples, config snippets, and links back to the local interactive routes.

Run the site locally:

```bash
npm install
npm run dev
```

Then open:

```txt
http://localhost:3000/docs
```

## Documentation Map

| Website route | GitHub page | What it covers |
| --- | --- | --- |
| `/docs/getting-started/installation` | [Getting Started](getting-started.md#installation) | Local setup and project goals. |
| `/docs/getting-started/project-structure` | [Getting Started](getting-started.md#project-structure) | Repo layout and library boundary. |
| `/docs/getting-started/quick-start` | [Getting Started](getting-started.md#quick-start) | First canvas and mental model. |
| `/docs/getting-started/troubleshooting` | [Getting Started](getting-started.md#troubleshooting) | Blank canvas, stale dev server, and config debugging. |
| `/docs/api/config` | [API Reference](api-reference.md#config-api) | Full `HyperGLConfig` shape and control metadata. |
| `/docs/api/create-renderer` | [API Reference](api-reference.md#createhyperglrenderer) | Low-level renderer lifecycle. |
| `/docs/api/use-hypergl` | [API Reference](api-reference.md#usehypergl) | React hook usage. |
| `/docs/api/presets` | [API Reference](api-reference.md#presets) | Built-in preset catalog. |
| `/docs/examples/preset-gallery` | [Live Examples](live-examples.md#preset-gallery) | Every bundled preset with a live route. |
| `/docs/examples/effect-gallery` | [Live Examples](live-examples.md#effect-gallery) | Effect switcher and starter configs. |
| `/docs/examples/setting-playground` | [Live Examples](live-examples.md#settings-playground) | Interactive controls and generated config. |
| `/docs/examples/hero-background` | [Live Examples](live-examples.md#hero-background) | Full-bleed background pattern. |
| `/docs/examples/product-panel` | [Live Examples](live-examples.md#product-panel) | Compact product/card canvas pattern. |
| `/docs/effects/aurora-field` | [Effects](effects.md#aurora-field) | Soft aurora bands. |
| `/docs/effects/liquid-warp` | [Effects](effects.md#liquid-warp) | Domain-warped liquid trails. |
| `/docs/effects/particle-bloom` | [Effects](effects.md#particle-bloom) | Cellular particles and glow. |
| `/docs/effects/topo-lines` | [Effects](effects.md#topo-lines) | Noise threshold contour lines. |
| `/docs/effects/glass-grid` | [Effects](effects.md#glass-grid) | Glass grid and chromatic structure. |
| `/docs/effects/ray-orb` | [Effects](effects.md#ray-orb) | Pseudo-3D orb/ring shading. |
| `/docs/frameworks/react` | [Frameworks](frameworks.md#react) | React component patterns. |
| `/docs/frameworks/nextjs` | [Frameworks](frameworks.md#nextjs) | Next.js App Router client boundaries. |
| `/docs/frameworks/vanilla-js` | [Frameworks](frameworks.md#vanilla-javascript) | Plain browser renderer usage. |
| `/docs/rendering/sizing` | [Rendering](rendering.md#sizing) | Canvas sizing and pixel ratio. |
| `/docs/rendering/performance` | [Rendering](rendering.md#performance) | Practical performance rules. |
| `/docs/rendering/capture` | [Rendering](rendering.md#capture) | Snapshot/export pattern. |
| `/docs/shaders/uniforms` | [Shader Concepts](shader-concepts.md#uniforms) | Config values as uniforms. |
| `/docs/shaders/noise` | [Shader Concepts](shader-concepts.md#noise) | Noise and domain warping. |
| `/docs/shaders/debugging` | [Shader Concepts](shader-concepts.md#debugging) | Shader debugging checklist. |
| `/docs/research/webgl-pipeline` | [Research](research.md#webgl-pipeline) | Renderer pipeline stages. |
| `/docs/research/benchmarks` | [Research](research.md#benchmarks) | Measurement plan. |
| `/docs/research/roadmap` | [Research](research.md#roadmap) | Library roadmap. |

## Recommended Reading Order

1. [Getting Started](getting-started.md)
2. [API Reference](api-reference.md)
3. [Live Examples](live-examples.md)
4. [Effects](effects.md)
5. [Frameworks](frameworks.md)
6. [Rendering](rendering.md)
7. [Shader Concepts](shader-concepts.md)
8. [Research](research.md)

## GitHub Versus Website

GitHub cannot execute the live WebGL demos inside Markdown. To keep the docs honest, every visual section includes:

- the local website route for the interactive version
- the copyable code used by the library or docs
- the exact config values needed to reproduce the effect
- notes about what each example is meant to teach

The goal is that a reviewer can read the GitHub docs without running the app, then run the site and see the same structure come alive.
