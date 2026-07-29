# Rendering

Rendering documentation covers the practical pieces that decide whether a WebGL effect feels polished in a real interface.

## Sizing

Website route: `/docs/rendering/sizing`

The canvas should be styled like a layout element. HyperGL reads its CSS bounds and then sets the drawing buffer size internally.

```css
.demo-canvas {
  display: block;
  width: 100%;
  height: clamp(320px, 56vw, 620px);
}
```

Fullscreen background:

```css
.scene {
  position: relative;
  min-height: 100svh;
  overflow: hidden;
}

.scene canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
```

Rules:

- Do not rely on the canvas default `300 x 150` size.
- Use `display: block` to remove inline canvas gaps.
- Use `min-height`, `aspect-ratio`, or explicit height for predictable layouts.
- Use `pixelRatioLimit` to avoid rendering huge buffers on high-DPI screens.

## Performance

Website route: `/docs/rendering/performance`

Practical performance rules:

| Rule | Why it matters |
| --- | --- |
| Cap pixel ratio with `pixelRatioLimit` | A high-DPI display can multiply fragment work quickly. |
| Pause offscreen or decorative canvases | Animation should not run when it is not visible. |
| Prefer config updates over renderer recreation | Recreating WebGL resources is more expensive than updating uniforms. |
| Keep bloom lower for large backgrounds | Glow-heavy surfaces do more visual work and can wash out UI. |
| Test mobile viewport sizes | Fullscreen effects can be much more expensive on phones. |

Example:

```tsx
const { canvasRef, rendererRef } = useHyperGL(config, {
  pixelRatioLimit: 1.5,
});

function reduceMotion() {
  rendererRef.current?.setConfig({ speed: 0.08, bloom: 0.12 });
}
```

Future benchmark targets:

- average frame time
- resize cost
- shader compile time
- memory after repeated mount/unmount
- cost of each effect at common viewport sizes

## Capture

Website route: `/docs/rendering/capture`

`capture()` returns a canvas data URL. Use it for snapshots, thumbnails, or export tests.

```tsx
"use client";

import { useHyperGL } from "@/lib/hypergl";

export function SnapshotDemo() {
  const { canvasRef, rendererRef } = useHyperGL({
    effect: "rayOrb",
    bloom: 0.64,
  });

  function download() {
    const dataUrl = rendererRef.current?.capture();
    if (!dataUrl) return;

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "hypergl-snapshot.png";
    link.click();
  }

  return (
    <section>
      <canvas ref={canvasRef} className="snapshot-canvas" />
      <button onClick={download}>Download snapshot</button>
    </section>
  );
}
```

Capture notes:

- Capture the current rendered frame.
- Use stable canvas sizes when comparing snapshots.
- If exporting for documentation, record the config next to the image.
- For regression testing, compare screenshots at fixed viewport sizes.
