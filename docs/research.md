# Research

HyperGL is also a computer science research project. The docs should show the learning process, not only the finished API.

## WebGL Pipeline

Website route: `/docs/research/webgl-pipeline`

Current renderer stages:

```ts
const canvas = getCanvas();
const gl = canvas.getContext("webgl2");
const program = compileProgram(gl, vertexShader, fragmentShader);
const geometry = createFullscreenGeometry(gl);

function frame(time: number) {
  resizeCanvasToDisplaySize(canvas, gl);
  setUniforms(gl, program, config, time);
  drawFullscreen(gl, geometry);
  requestAnimationFrame(frame);
}
```

Research questions:

- How does WebGL2 map JavaScript values into shader uniforms?
- What work happens once per renderer versus once per frame?
- How much performance changes with pixel ratio?
- Which effects are fragment-heavy?
- What cleanup is required when canvases unmount?

## Benchmarks

Website route: `/docs/research/benchmarks`

Benchmark plan:

| Metric | Why it matters |
| --- | --- |
| Average frame time | Shows whether effects stay smooth. |
| Resize cost | Reveals expensive canvas buffer changes. |
| Shader compile time | Helps explain initial load behavior. |
| Mount/unmount memory | Verifies cleanup and avoids leaks. |
| Mobile viewport FPS | Shows practical usability on smaller devices. |

Suggested benchmark matrix:

| Viewport | Pixel ratio limit | Effects |
| --- | --- | --- |
| `390 x 844` | `1` and `1.5` | All six effects |
| `768 x 1024` | `1` and `1.5` | All six effects |
| `1440 x 900` | `1`, `1.5`, and `2` | All six effects |

Data to record:

```json
{
  "effect": "liquid",
  "viewport": "1440x900",
  "pixelRatioLimit": 1.5,
  "averageFrameMs": 8.7,
  "notes": "High distortion, moderate bloom"
}
```

## Roadmap

Website route: `/docs/research/roadmap`

1. Stabilize `HyperGLConfig` and `HYPERGL_CONTROLS`.
2. Expand presets with a consistent quality bar.
3. Make every example route visually interactive and copyable.
4. Add screenshot/export examples for docs and testing.
5. Add benchmarks and publish results in the research docs.
6. Research multipass rendering with framebuffers.
7. Explore trails, bloom chains, feedback, and post-processing.
8. Add 2D composition concepts such as masks, signed distance fields, and layer blending.
9. Explore 3D concepts and Three.js interop once the 2D renderer is stable.
10. Package the library for external projects after the API feels durable.

## Development Journal

Use [research-log.md](research-log.md) as the chronological log. The research page explains the structured plan; the log records what changed, what worked, and what needs more study.

Entry format:

```md
## Entry NN: Short Title

Date: YYYY-MM-DD

What changed:
- ...

What I learned:
- ...

Open questions:
- ...
```
