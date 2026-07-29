# API Reference

HyperGL has one core customization contract: `HyperGLConfig`. Presets, live examples, React components, and vanilla renderers all use the same shape.

## Config API

Website route: `/docs/api/config`

User code can pass a partial config. The renderer merges it with `DEFAULT_HYPERGL_CONFIG` so examples stay small.

```ts
export interface HyperGLConfig {
  effect: HyperGLEffect;
  palette: [string, string, string];
  speed: number;
  intensity: number;
  density: number;
  scale: number;
  distortion: number;
  bloom: number;
  grain: number;
  cursor: {
    enabled: boolean;
    radius: number;
    strength: number;
    smoothing: number;
  };
  shape: {
    count: number;
    depth: number;
    rotation: number;
  };
}
```

Supported effects:

```ts
type HyperGLEffect =
  | "aurora"
  | "liquid"
  | "particles"
  | "topographic"
  | "glassGrid"
  | "rayOrb";
```

### Control Metadata

The library exports `HYPERGL_CONTROLS` so documentation, tests, and future UI controls share one source of truth.

| Path | Group | Min | Max | Step | Description |
| --- | --- | --- | --- | --- | --- |
| `speed` | Motion | `0` | `1.5` | `0.01` | Animation time multiplier. |
| `intensity` | Render | `0` | `1.25` | `0.01` | Primary contrast and energy. |
| `density` | Structure | `0` | `1` | `0.01` | Amount of visual structure. |
| `scale` | Structure | `0.05` | `1.2` | `0.01` | Spatial zoom for procedural patterns. |
| `distortion` | Motion | `0` | `1` | `0.01` | Domain-warp strength. |
| `bloom` | Render | `0` | `1` | `0.01` | Glow response. |
| `grain` | Render | `0` | `0.35` | `0.01` | Fine texture overlay. |
| `cursor.radius` | Interaction | `0` | `0.8` | `0.01` | Width of pointer influence. |
| `cursor.strength` | Interaction | `0` | `1` | `0.01` | Strength of pointer influence. |
| `cursor.smoothing` | Interaction | `0.01` | `0.5` | `0.01` | Pointer interpolation amount. |
| `shape.count` | Structure | `1` | `16` | `1` | Repeating primitive count. |
| `shape.depth` | Structure | `0` | `1` | `0.01` | Pseudo-3D depth. |
| `shape.rotation` | Motion | `0` | `1` | `0.01` | Rotational phase. |

Example control renderer:

```tsx
import { HYPERGL_CONTROLS } from "@/lib/hypergl";
import type { HyperGLConfig, HyperGLControlPath } from "@/lib/hypergl";

function readByPath(config: HyperGLConfig, path: HyperGLControlPath) {
  return path.split(".").reduce<unknown>((value, key) => {
    if (typeof value !== "object" || value === null) return undefined;
    return (value as Record<string, unknown>)[key];
  }, config) as number;
}

export function Controls({
  config,
  update,
}: {
  config: HyperGLConfig;
  update: (path: HyperGLControlPath, value: number) => void;
}) {
  return HYPERGL_CONTROLS.map((control) => (
    <label key={control.path}>
      <span>{control.label}</span>
      <input
        type="range"
        min={control.min}
        max={control.max}
        step={control.step}
        value={readByPath(config, control.path)}
        onChange={(event) => update(control.path, Number(event.target.value))}
      />
    </label>
  ));
}
```

## createHyperGLRenderer

Website route: `/docs/api/create-renderer`

Use the low-level renderer when React is not involved or when another framework owns the canvas lifecycle.

```ts
import { createHyperGLRenderer } from "@/lib/hypergl";

const canvas = document.querySelector("canvas")!;
const renderer = createHyperGLRenderer(canvas, {
  pixelRatioLimit: 1.5,
  config: {
    effect: "glassGrid",
    density: 0.82,
    bloom: 0.22,
  },
});

renderer.setConfig({ distortion: 0.36 });

// Later, before removing the canvas:
renderer.destroy();
```

Renderer responsibilities:

- creates and owns the WebGL2 context
- compiles the fullscreen shader program
- owns fullscreen geometry
- maps config into uniforms
- listens for pointer input
- resizes the drawing buffer
- runs the animation loop
- captures snapshots
- cleans up listeners and WebGL resources

Renderer methods:

| Method | Purpose |
| --- | --- |
| `play()` | Resume the animation loop. |
| `pause()` | Stop animation without destroying the renderer. |
| `resize()` | Recalculate the drawing buffer from the element bounds. |
| `setConfig(partial)` | Merge partial config into the current config. |
| `getConfig()` | Return a cloned config for export or debugging. |
| `capture()` | Return a data URL snapshot from the canvas. |
| `destroy()` | Remove listeners and free WebGL resources. |

## useHyperGL

Website route: `/docs/api/use-hypergl`

`useHyperGL` is the React hook for mounting, updating, and cleaning up HyperGL scenes.

```tsx
"use client";

import { useMemo, useState } from "react";
import { useHyperGL } from "@/lib/hypergl";

export function InteractiveHero() {
  const [bloom, setBloom] = useState(0.28);
  const config = useMemo(() => ({ effect: "liquid" as const, bloom }), [bloom]);
  const { canvasRef, rendererRef } = useHyperGL(config);

  return (
    <>
      <canvas ref={canvasRef} className="hero-canvas" />
      <button onClick={() => rendererRef.current?.pause()}>Pause</button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={bloom}
        onChange={(event) => setBloom(Number(event.target.value))}
      />
    </>
  );
}
```

Use the hook when:

- React owns the canvas mount/unmount lifecycle.
- Config is driven by state.
- You need an easy `ref` to pause, resume, capture, or export.

Use `createHyperGLRenderer` instead when:

- You are writing plain JavaScript.
- Another framework owns the DOM lifecycle.
- You want to test the renderer without React.

## Presets

Website route: `/docs/api/presets`

Presets are complete `HyperGLConfig` objects. They are examples, regression targets, and design starting points.

Live route:

```txt
http://localhost:3000/docs/examples/preset-gallery
```

| ID | Name | Effect | Good for |
| --- | --- | --- | --- |
| `starter-aurora` | Starter Aurora | `aurora` | Soft procedural bands with pointer drift. |
| `signal-glass` | Signal Glass | `glassGrid` | Crisp grid, chromatic edges, scanline motion. |
| `particle-lab` | Particle Lab | `particles` | Cellular particles and pointer radius experiments. |
| `research-topo` | Research Topo | `topographic` | Noise and thresholding studies. |
| `liquid-type` | Liquid Type | `liquid` | Domain-warped color fields for hero sections. |
| `orb-space` | Orb Space | `rayOrb` | Pseudo-3D lighting and depth controls. |
| `blue-hour` | Blue Hour | `aurora` | Calm product backgrounds. |
| `neon-ribbons` | Neon Ribbons | `liquid` | Kinetic hero sections. |
| `soft-dust` | Soft Dust | `particles` | Cards, dashboards, and loading states. |
| `mono-contours` | Mono Contours | `topographic` | Readable monochrome research diagrams. |
| `prism-grid` | Prism Grid | `glassGrid` | Glass-panel grid backgrounds. |
| `solar-orb` | Solar Orb | `rayOrb` | Warm pseudo-3D orb lighting. |

Use a preset by ID:

```tsx
import { HyperGLCanvas } from "@/components/HyperGLCanvas";
import { HYPERGL_PRESETS } from "@/lib/hypergl";

const preset = HYPERGL_PRESETS.find((item) => item.id === "neon-ribbons")!;

export function Background() {
  return <HyperGLCanvas config={{ ...preset.config, bloom: 0.4 }} />;
}
```

Use the exported palette list:

```ts
import { HYPERGL_PALETTES } from "@/lib/hypergl";

const coolBluePurple = HYPERGL_PALETTES[0];
const neon = HYPERGL_PALETTES[1];
```
