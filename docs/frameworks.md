# Frameworks

HyperGL is currently an in-repo library. These examples import from `@/lib/hypergl`, but the API is written so it can become a package later.

## React

Website route: `/docs/frameworks/react`

Use `useHyperGL` when React owns the canvas element.

```tsx
"use client";

import { useHyperGL } from "@/lib/hypergl";

export function ReactBackground() {
  const { canvasRef } = useHyperGL({
    effect: "aurora",
    palette: ["#dbeafe", "#8b5cf6", "#2563eb"],
    speed: 0.24,
    bloom: 0.18,
  });

  return <canvas ref={canvasRef} className="background-canvas" />;
}
```

Use a wrapper component when a page needs several scenes:

```tsx
"use client";

import { useHyperGL } from "@/lib/hypergl";
import type { HyperGLConfigInput } from "@/lib/hypergl";

export function HyperGLCanvas({
  config,
  className,
  label = "HyperGL WebGL preview",
}: {
  config: HyperGLConfigInput;
  className?: string;
  label?: string;
}) {
  const { canvasRef } = useHyperGL(config, { pixelRatioLimit: 1.5 });

  return <canvas ref={canvasRef} aria-label={label} className={className} />;
}
```

## Next.js

Website route: `/docs/frameworks/nextjs`

WebGL needs the browser, so the canvas component must be a client component in the App Router.

```tsx
// src/components/MarketingCanvas.tsx
"use client";

import { HyperGLCanvas } from "@/components/HyperGLCanvas";

export function MarketingCanvas() {
  return <HyperGLCanvas config={{ effect: "liquid", bloom: 0.24 }} />;
}
```

Then import it from a page or server component:

```tsx
// src/app/page.tsx
import { MarketingCanvas } from "@/components/MarketingCanvas";

export default function Page() {
  return (
    <main>
      <MarketingCanvas />
      <h1>HyperGL</h1>
    </main>
  );
}
```

Next.js notes:

- Keep WebGL code behind `"use client";`.
- Give the canvas a stable CSS size.
- Avoid reading `window`, `document`, or WebGL contexts in server components.
- Use dynamic state in the client component that owns the hook.

## Vanilla JavaScript

Website route: `/docs/frameworks/vanilla-js`

Use `createHyperGLRenderer` when React is not involved.

```html
<canvas id="hypergl"></canvas>
```

```css
#hypergl {
  display: block;
  width: 100%;
  height: 480px;
}
```

```ts
import { createHyperGLRenderer } from "@/lib/hypergl";

const canvas = document.querySelector<HTMLCanvasElement>("#hypergl");

if (!canvas) {
  throw new Error("Missing #hypergl canvas");
}

const renderer = createHyperGLRenderer(canvas, {
  pixelRatioLimit: 1.5,
  config: {
    effect: "topographic",
    palette: ["#ffffff", "#94a3b8", "#111827"],
    density: 0.82,
    bloom: 0.04,
  },
});

document.querySelector("#pause")?.addEventListener("click", () => {
  renderer.pause();
});

document.querySelector("#play")?.addEventListener("click", () => {
  renderer.play();
});

window.addEventListener("beforeunload", () => {
  renderer.destroy();
});
```

## Future Package Shape

When HyperGL becomes installable, imports should move toward this package-style shape:

```tsx
import {
  HyperGLCanvas,
  createHyperGLRenderer,
  useHyperGL,
  HYPERGL_PRESETS,
} from "hypergl";
```

The current local imports are temporary while the API is still being researched.
