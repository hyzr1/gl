# Live Examples

The website docs contain real WebGL canvases. GitHub Markdown cannot run those canvases, so this page documents the same examples and points to their live local routes.

## Preset Gallery

Website route: `/docs/examples/preset-gallery`

Live route:

```txt
http://localhost:3000/docs/examples/preset-gallery
```

What it teaches:

- how each bundled preset looks
- which effect a preset uses
- how to copy the config into application code
- how small overrides can change the final scene

Minimal preset preview:

```tsx
"use client";

import { HyperGLCanvas } from "@/components/HyperGLCanvas";
import { HYPERGL_PRESETS } from "@/lib/hypergl";

const preset = HYPERGL_PRESETS.find((item) => item.id === "blue-hour")!;

export function PresetPreview() {
  return <HyperGLCanvas config={preset.config} className="demo-canvas" />;
}
```

Preset override:

```tsx
<HyperGLCanvas
  config={{
    ...preset.config,
    speed: 0.16,
    bloom: 0.12,
    cursor: { ...preset.config.cursor, strength: 0.2 },
  }}
/>
```

## Effect Gallery

Website route: `/docs/examples/effect-gallery`

Live route:

```txt
http://localhost:3000/docs/examples/effect-gallery
```

What it teaches:

- how the same config structure drives six different shader effects
- which controls matter most for each effect
- how to switch `effect` without changing the renderer

Effect switcher pattern:

```tsx
"use client";

import { useState } from "react";
import { HyperGLCanvas } from "@/components/HyperGLCanvas";
import type { HyperGLEffect } from "@/lib/hypergl";

const effects: HyperGLEffect[] = [
  "aurora",
  "liquid",
  "particles",
  "topographic",
  "glassGrid",
  "rayOrb",
];

export function EffectSwitcher() {
  const [effect, setEffect] = useState<HyperGLEffect>("aurora");

  return (
    <section>
      <HyperGLCanvas config={{ effect, bloom: 0.28, distortion: 0.4 }} />
      {effects.map((name) => (
        <button key={name} onClick={() => setEffect(name)}>
          {name}
        </button>
      ))}
    </section>
  );
}
```

## Settings Playground

Website route: `/docs/examples/setting-playground`

Live route:

```txt
http://localhost:3000/docs/examples/setting-playground
```

What it teaches:

- every supported setting
- slider ranges from `HYPERGL_CONTROLS`
- how config changes affect the same running renderer
- how to generate a copyable config object

State-driven setting editor:

```tsx
"use client";

import { useState } from "react";
import { HyperGLCanvas } from "@/components/HyperGLCanvas";
import { HYPERGL_CONTROLS, HYPERGL_PRESETS } from "@/lib/hypergl";
import type { HyperGLConfig, HyperGLControlPath } from "@/lib/hypergl";

function readByPath(config: HyperGLConfig, path: HyperGLControlPath) {
  return path.split(".").reduce<unknown>((value, key) => {
    if (typeof value !== "object" || value === null) return undefined;
    return (value as Record<string, unknown>)[key];
  }, config) as number;
}

function setByPath(
  config: HyperGLConfig,
  path: HyperGLControlPath,
  value: number
): HyperGLConfig {
  const [first, second] = path.split(".") as [keyof HyperGLConfig, string?];

  if (!second) {
    return { ...config, [first]: value };
  }

  const nested = config[first] as Record<string, unknown>;
  return {
    ...config,
    [first]: { ...nested, [second]: value },
  };
}

export function SettingPlayground() {
  const [config, setConfig] = useState(HYPERGL_PRESETS[7].config);

  function update(path: HyperGLControlPath, value: number) {
    setConfig((current) => setByPath(current, path, value));
  }

  return (
    <section>
      <HyperGLCanvas config={config} />
      {HYPERGL_CONTROLS.map((control) => (
        <label key={control.path}>
          {control.label}
          <input
            type="range"
            min={control.min}
            max={control.max}
            step={control.step}
            value={readByPath(config, control.path)}
            onChange={(event) => update(control.path, Number(event.target.value))}
          />
        </label>
      ))}
      <pre>{JSON.stringify(config, null, 2)}</pre>
    </section>
  );
}
```

## Hero Background

Website route: `/docs/examples/hero-background`

Use this pattern when HyperGL is the page background but text must stay readable.

```tsx
"use client";

import { HyperGLCanvas } from "@/components/HyperGLCanvas";

export function ProductHero() {
  return (
    <section className="hero">
      <HyperGLCanvas
        className="hero-canvas"
        config={{
          effect: "aurora",
          palette: ["#dbeafe", "#8b5cf6", "#2563eb"],
          speed: 0.18,
          intensity: 0.48,
          bloom: 0.14,
          grain: 0.02,
        }}
      />
      <div className="hero-content">
        <p>HyperGL Library</p>
        <h1>Procedural WebGL backgrounds for modern interfaces.</h1>
      </div>
    </section>
  );
}
```

```css
.hero {
  position: relative;
  min-height: 620px;
  overflow: hidden;
}

.hero-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 760px;
  padding: 120px 32px;
}
```

## Product Panel

Website route: `/docs/examples/product-panel`

Use this pattern when HyperGL should live inside a compact surface like a dashboard panel, card preview, or feature module.

```tsx
"use client";

import { HyperGLCanvas } from "@/components/HyperGLCanvas";

export function SignalPanel() {
  return (
    <article className="signal-panel">
      <HyperGLCanvas
        className="panel-canvas"
        config={{
          effect: "glassGrid",
          palette: ["#f8fafc", "#60a5fa", "#a78bfa"],
          density: 0.88,
          distortion: 0.18,
          bloom: 0.26,
          grain: 0.06,
        }}
      />
      <div className="panel-copy">
        <h2>Signal Glass</h2>
        <p>Crisp WebGL texture for product UI previews.</p>
      </div>
    </article>
  );
}
```

```css
.signal-panel {
  position: relative;
  min-height: 360px;
  overflow: hidden;
  border: 1px solid rgba(148, 163, 184, 0.24);
  border-radius: 8px;
}

.panel-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.panel-copy {
  position: relative;
  z-index: 1;
  padding: 24px;
}
```
