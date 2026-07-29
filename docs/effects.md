# Effects

Each effect uses the same `HyperGLConfig` shape. The difference is how the shader interprets motion, density, distortion, palette, and shape controls.

Live effect route:

```txt
http://localhost:3000/docs/examples/effect-gallery
```

## Aurora Field

Website route: `/docs/effects/aurora-field`

Best for:

- soft hero backgrounds
- documentation headers
- ambient sections behind text
- blue/purple product themes

Starter config:

```ts
import { defineHyperGLConfig } from "@/lib/hypergl";

export const auroraField = defineHyperGLConfig({
  effect: "aurora",
  palette: ["#dbeafe", "#8b5cf6", "#2563eb"],
  speed: 0.24,
  intensity: 0.56,
  distortion: 0.28,
});
```

Tuning notes:

- Keep `bloom` low when text sits on top.
- Increase `distortion` for more organic movement.
- Lower `speed` for a calmer product/documentation feel.
- Use blue and purple palettes when you want a polished technical mood.

## Liquid Warp

Website route: `/docs/effects/liquid-warp`

Best for:

- energetic hero sections
- brand moments
- animated masks
- color-rich interactive panels

Starter config:

```ts
import { defineHyperGLConfig } from "@/lib/hypergl";

export const liquidWarp = defineHyperGLConfig({
  effect: "liquid",
  palette: ["#22d3ee", "#facc15", "#c084fc"],
  speed: 0.5,
  distortion: 0.78,
  bloom: 0.34,
});
```

Tuning notes:

- `distortion` is the main control for the liquid feel.
- `scale` changes whether the surface feels broad or detailed.
- Higher `speed` feels kinetic but can become distracting.
- Use `grain` lightly to reduce synthetic-looking gradients.

## Particle Bloom

Website route: `/docs/effects/particle-bloom`

Best for:

- loading states
- product cards
- data/AI-themed ambience
- pointer-reactive demos

Starter config:

```ts
import { defineHyperGLConfig } from "@/lib/hypergl";

export const particleBloom = defineHyperGLConfig({
  effect: "particles",
  palette: ["#bef264", "#38bdf8", "#f472b6"],
  density: 0.86,
  bloom: 0.7,
  cursor: { enabled: true, strength: 0.62 },
});
```

Tuning notes:

- `density` controls how many particle cells appear.
- `cursor.radius` and `cursor.strength` make the effect feel interactive.
- `bloom` sells the glow but can overpower dark text.
- `shape.count` changes the repeated primitive count.

## Topo Lines

Website route: `/docs/effects/topo-lines`

Best for:

- research diagrams
- procedural texture studies
- monochrome visuals
- shader math explanations

Starter config:

```ts
import { defineHyperGLConfig } from "@/lib/hypergl";

export const topoLines = defineHyperGLConfig({
  effect: "topographic",
  palette: ["#ffffff", "#94a3b8", "#111827"],
  density: 0.82,
  scale: 0.86,
  bloom: 0.04,
});
```

Tuning notes:

- Lower `bloom` keeps contour lines readable.
- `density` controls line frequency.
- `scale` changes how zoomed-in the noise field feels.
- Monochrome palettes are useful when the effect is explaining structure instead of brand mood.

## Glass Grid

Website route: `/docs/effects/glass-grid`

Best for:

- product dashboards
- grid overlays
- technology UI backgrounds
- panels that need structure without heavy motion

Starter config:

```ts
import { defineHyperGLConfig } from "@/lib/hypergl";

export const glassGrid = defineHyperGLConfig({
  effect: "glassGrid",
  palette: ["#f8fafc", "#60a5fa", "#a78bfa"],
  density: 0.88,
  distortion: 0.18,
  grain: 0.06,
});
```

Tuning notes:

- `density` adds or removes grid repetition.
- Keep `distortion` low if you want clean product UI structure.
- `grain` can make the surface feel more tactile.
- Use `bloom` carefully so grid lines do not wash out.

## Ray Orb

Website route: `/docs/effects/ray-orb`

Best for:

- pseudo-3D research experiments
- spherical light studies
- orbital/ring visuals
- high-impact thumbnails

Starter config:

```ts
import { defineHyperGLConfig } from "@/lib/hypergl";

export const rayOrb = defineHyperGLConfig({
  effect: "rayOrb",
  palette: ["#fde68a", "#f97316", "#7c2d12"],
  bloom: 0.74,
  shape: { count: 5, depth: 0.92, rotation: 0.42 },
});
```

Tuning notes:

- `shape.depth` gives the orb its dimensional feeling.
- `shape.rotation` changes orbital phase.
- `shape.count` changes repeated ring/primitive structure.
- Warm palettes make the orb feel more like a light source.

## Effect Selection Guide

| Goal | Start with |
| --- | --- |
| Calm documentation background | `aurora` |
| High-energy hero visual | `liquid` |
| Pointer-reactive particles | `particles` |
| Research/math diagram | `topographic` |
| Structured product surface | `glassGrid` |
| Pseudo-3D focal object | `rayOrb` |
