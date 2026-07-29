import type { DocsDemoKind } from "@/components/DocsLiveDemo";

export interface DocCodeExample {
  title: string;
  language: "tsx" | "ts" | "js" | "json" | "glsl" | "css" | "bash";
  code: string;
  description?: string;
}

export interface DocSection {
  id: string;
  title: string;
  body: string[];
  code?: string;
  language?: DocCodeExample["language"];
  examples?: DocCodeExample[];
  items?: string[];
  callout?: string;
  demo?: DocsDemoKind;
}

export interface DocPage {
  slug: string;
  title: string;
  description: string;
  category: string;
  level: "Start" | "Build" | "Reference" | "Research";
  sections: DocSection[];
  related?: string[];
}

export interface DocNavGroup {
  label: string;
  description: string;
  items: Array<{ slug: string; title: string; badge?: string }>;
}

const categoryDescriptions: Record<string, string> = {
  "Getting Started": "Install HyperGL locally, understand the repo, and render the first canvas.",
  "Library API": "Typed config, renderer lifecycle, React hook, presets, and control metadata.",
  "Live Examples": "Interactive docs pages with real canvases, preset previews, and setting controls.",
  Effects: "Effect-specific tuning notes and reusable starting configs.",
  Frameworks: "Use HyperGL in React, Next.js, and vanilla browser projects.",
  Rendering: "Sizing, capture, performance, and production rendering decisions.",
  "Shader Concepts": "The WebGL ideas behind the library controls.",
  Research: "Project process, benchmarking, and the open-source roadmap.",
};

export const docPages: DocPage[] = [
  {
    slug: "getting-started/installation",
    title: "Installation",
    description: "Run HyperGL locally while the library matures before npm publishing.",
    category: "Getting Started",
    level: "Start",
    sections: [
      {
        id: "overview",
        title: "Overview",
        body: [
          "HyperGL is now focused as a local TypeScript WebGL library with a documentation site. The renderer lives in src/lib/hypergl, while the site demonstrates real presets and interactive configuration in docs.",
          "Keeping the library in-repo is intentional during research. It lets the API, examples, shader notes, and visual demos evolve together before the package is published.",
        ],
        callout: "The current goal is library quality: predictable config, useful presets, framework examples, and docs that show the visual result of each setting.",
      },
      {
        id: "commands",
        title: "Local Commands",
        body: ["Use the app like a documentation lab. Start the dev server, open the docs, and test every config against a live canvas."],
        examples: [
          {
            title: "Development setup",
            language: "bash",
            code: `npm install
npm run dev

# Primary routes
http://localhost:3000
http://localhost:3000/docs
http://localhost:3000/docs/examples/preset-gallery`,
          },
        ],
      },
      {
        id: "next",
        title: "What To Read Next",
        body: [],
        items: [
          "Quick Start shows the smallest React canvas.",
          "Config API explains every top-level setting.",
          "Preset Gallery shows every built-in preset visually.",
          "Settings Playground lets you move sliders and copy the generated config.",
        ],
      },
    ],
    related: ["getting-started/quick-start", "api/config", "examples/preset-gallery"],
  },
  {
    slug: "getting-started/project-structure",
    title: "Project Structure",
    description: "See how the docs app and reusable WebGL library are separated.",
    category: "Getting Started",
    level: "Start",
    sections: [
      {
        id: "map",
        title: "Repo Map",
        body: [
          "The repo should be easy for a GitHub reviewer to scan. App routes are presentation, components are reusable UI, content owns documentation data, and lib/hypergl owns the library.",
          "The strongest signal is that users can ignore the site and still understand the renderer API from src/lib/hypergl.",
        ],
        examples: [
          {
            title: "Folder responsibilities",
            language: "bash",
            code: `src/app             # Next.js routes
src/components      # Docs UI, live demos, canvas wrapper
src/content/docs.ts # Typed docs map and navigation
src/lib/hypergl     # Public library API, renderer, shaders, presets`,
          },
        ],
      },
      {
        id: "library-boundary",
        title: "Library Boundary",
        body: [
          "The public API should stay concentrated in src/lib/hypergl/index.ts. That file exports renderer creation, the React hook, preset data, typed config, control metadata, and helper utilities.",
          "Docs and examples should import from the same API a user would import. That keeps the documentation honest because every sample is using the real library.",
        ],
      },
    ],
    related: ["api/create-renderer", "api/use-hypergl", "api/presets"],
  },
  {
    slug: "getting-started/quick-start",
    title: "Quick Start",
    description: "Render a live HyperGL canvas with a typed config.",
    category: "Getting Started",
    level: "Start",
    sections: [
      {
        id: "first-canvas",
        title: "First Canvas",
        body: [
          "The React hook is the fastest first path. It creates the renderer after the canvas mounts, pushes config updates into WebGL uniforms, and destroys the renderer when the component unmounts.",
          "The canvas must have a real CSS size. HyperGL reads the canvas bounds and resizes the drawing buffer to match the element.",
        ],
        examples: [
          {
            title: "React component",
            language: "tsx",
            code: `"use client";

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
}`,
          },
          {
            title: "Canvas CSS",
            language: "css",
            code: `.hypergl-canvas {
  display: block;
  width: 100%;
  height: min(520px, 70vh);
}`,
          },
        ],
      },
      {
        id: "mental-model",
        title: "Mental Model",
        body: [],
        items: [
          "effect selects which shader branch renders.",
          "palette supplies three RGB colors used by the shader.",
          "speed, scale, density, and distortion shape the motion field.",
          "cursor settings determine pointer response.",
          "bloom and grain control the final visual finish.",
        ],
      },
    ],
    related: ["frameworks/react", "api/config", "examples/setting-playground"],
  },
  {
    slug: "getting-started/troubleshooting",
    title: "Troubleshooting",
    description: "Fix blank canvases, stale dev output, and config values that do not look right.",
    category: "Getting Started",
    level: "Start",
    sections: [
      {
        id: "blank-canvas",
        title: "Blank Canvas",
        body: [
          "A blank HyperGL canvas is usually not a shader mystery. Start with sizing and browser support before changing fragment code.",
          "The renderer needs a mounted canvas with nonzero CSS dimensions and WebGL2 support.",
        ],
        items: [
          "Confirm the canvas element exists in the DOM.",
          "Confirm its CSS width and height are greater than zero.",
          "Confirm the component using useHyperGL is a client component.",
          "Confirm canvas.getContext('webgl2') returns a context.",
        ],
      },
      {
        id: "stale-dev-server",
        title: "Stale Dev Server",
        body: [
          "After running a production build, restarting the dev server can clear stale generated assets. This is a normal Next.js development hygiene step.",
          "If docs content changes but the browser still shows an old route, reload the page after the dev server recompiles.",
        ],
        examples: [
          {
            title: "Restart locally",
            language: "bash",
            code: `# Stop the dev server terminal, then run:
npm run dev`,
          },
        ],
      },
      {
        id: "config-debugging",
        title: "Config Debugging",
        body: [
          "When a preset looks too intense, reduce bloom and intensity first. When motion feels messy, reduce distortion and speed before editing shader source.",
          "The Settings Playground is the fastest way to learn which control is causing the visual issue.",
        ],
      },
    ],
    related: ["rendering/sizing", "shaders/debugging", "examples/setting-playground"],
  },
  {
    slug: "api/config",
    title: "Config API",
    description: "The typed contract that makes HyperGL customizable.",
    category: "Library API",
    level: "Reference",
    sections: [
      {
        id: "shape",
        title: "Config Shape",
        body: [
          "HyperGLConfig is the central API. Presets, demos, React components, and vanilla renderers all use the same shape.",
          "User code usually passes HyperGLConfigInput, which is a partial config. The renderer merges it with DEFAULT_HYPERGL_CONFIG so small examples stay readable.",
        ],
        examples: [
          {
            title: "Typed config",
            language: "ts",
            code: `export interface HyperGLConfig {
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
}`,
          },
        ],
      },
      {
        id: "controls",
        title: "Control Metadata",
        body: [
          "The library exports HYPERGL_CONTROLS so docs, future UI controls, and tests can agree on ranges and descriptions.",
          "This is the library-first replacement for a giant editor: the customization model is explicit and reusable instead of hidden in a one-off interface.",
        ],
        examples: [
          {
            title: "Render controls from metadata",
            language: "tsx",
            code: `import { HYPERGL_CONTROLS } from "@/lib/hypergl";

export function Controls({ config, update }) {
  return HYPERGL_CONTROLS.map((control) => (
    <label key={control.path}>
      {control.label}
      <input
        type="range"
        min={control.min}
        max={control.max}
        step={control.step}
        value={read(config, control.path)}
        onChange={(event) => update(control.path, Number(event.target.value))}
      />
    </label>
  ));
}`,
          },
        ],
      },
    ],
    related: ["api/presets", "examples/setting-playground", "api/create-renderer"],
  },
  {
    slug: "api/create-renderer",
    title: "createHyperGLRenderer",
    description: "Use the low-level renderer in vanilla JavaScript or custom frameworks.",
    category: "Library API",
    level: "Reference",
    sections: [
      {
        id: "lifecycle",
        title: "Lifecycle",
        body: [
          "createHyperGLRenderer owns the WebGL2 context, shader program, fullscreen geometry, uniforms, pointer listeners, resize handling, animation loop, capture, and cleanup.",
          "Use this API when you do not want React involved, or when another framework owns canvas lifecycle.",
        ],
        examples: [
          {
            title: "Vanilla renderer",
            language: "ts",
            code: `import { createHyperGLRenderer } from "@/lib/hypergl";

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
renderer.destroy();`,
          },
        ],
      },
      {
        id: "methods",
        title: "Methods",
        body: [],
        items: [
          "play resumes the requestAnimationFrame loop.",
          "pause stops animation without destroying the renderer.",
          "resize recalculates the drawing buffer from element bounds.",
          "setConfig merges partial config into the current config.",
          "getConfig returns a cloned config for export or debugging.",
          "capture returns a data URL snapshot from the canvas.",
          "destroy removes listeners and frees WebGL resources.",
        ],
      },
    ],
    related: ["frameworks/vanilla-js", "rendering/capture", "api/config"],
  },
  {
    slug: "api/use-hypergl",
    title: "useHyperGL",
    description: "The React hook for mounting, updating, and cleaning up HyperGL scenes.",
    category: "Library API",
    level: "Reference",
    sections: [
      {
        id: "hook",
        title: "Hook Usage",
        body: [
          "useHyperGL returns a canvasRef and rendererRef. The ref pattern keeps the renderer outside React render work while still letting config changes update the scene.",
          "In Next.js App Router, the component that calls useHyperGL must be a client component.",
        ],
        examples: [
          {
            title: "State-driven config",
            language: "tsx",
            code: `"use client";

import { useMemo, useState } from "react";
import { useHyperGL } from "@/lib/hypergl";

export function InteractiveHero() {
  const [bloom, setBloom] = useState(0.28);
  const config = useMemo(() => ({ effect: "liquid" as const, bloom }), [bloom]);
  const { canvasRef } = useHyperGL(config);

  return (
    <>
      <canvas ref={canvasRef} className="hero-canvas" />
      <input type="range" min="0" max="1" step="0.01" value={bloom}
        onChange={(event) => setBloom(Number(event.target.value))} />
    </>
  );
}`,
          },
        ],
      },
    ],
    related: ["frameworks/react", "frameworks/nextjs", "examples/setting-playground"],
  },
  {
    slug: "api/presets",
    title: "Presets",
    description: "Reusable named configs that make the library feel complete.",
    category: "Library API",
    level: "Reference",
    sections: [
      {
        id: "why-presets",
        title: "Why Presets Matter",
        body: [
          "Presets are not just examples. They are regression targets, design starting points, docs previews, and a quick way to show what the library can do.",
          "Each preset is a complete HyperGLConfig, so users can start from a known look and override only the values they need.",
        ],
        demo: "preset-gallery",
      },
      {
        id: "use-preset",
        title: "Use A Preset",
        body: [],
        examples: [
          {
            title: "Find by id",
            language: "tsx",
            code: `import { HYPERGL_PRESETS } from "@/lib/hypergl";

const preset = HYPERGL_PRESETS.find((item) => item.id === "neon-ribbons")!;

export function Background() {
  return <HyperGLCanvas config={{ ...preset.config, bloom: 0.4 }} />;
}`,
          },
        ],
      },
    ],
    related: ["examples/preset-gallery", "api/config", "effects/liquid-warp"],
  },
  {
    slug: "examples/preset-gallery",
    title: "Preset Gallery",
    description: "Every bundled preset rendered as a live, clickable WebGL preview.",
    category: "Live Examples",
    level: "Build",
    sections: [
      {
        id: "gallery",
        title: "Live Presets",
        body: [
          "Click a preset to inspect the visual result and copy the usage snippet. These canvases use the same HYPERGL_PRESETS array exported by the library.",
          "A strong preset gallery makes the GitHub project immediately legible: viewers can see the library range without reading shader code first.",
        ],
        demo: "preset-gallery",
      },
    ],
    related: ["api/presets", "examples/effect-gallery", "examples/setting-playground"],
  },
  {
    slug: "examples/effect-gallery",
    title: "Effect Gallery",
    description: "Switch between every shader effect with live visuals and copyable config.",
    category: "Live Examples",
    level: "Build",
    sections: [
      {
        id: "effects",
        title: "Live Effect Switcher",
        body: [
          "Each effect uses the same renderer and config contract. The only difference is the effect branch and a few useful starter values.",
          "This page is useful when deciding which effect belongs in a product surface: ambient, liquid, particle, contour, grid, or pseudo-3D.",
        ],
        demo: "effect-gallery",
      },
    ],
    related: ["effects/aurora-field", "effects/liquid-warp", "effects/ray-orb"],
  },
  {
    slug: "examples/setting-playground",
    title: "Settings Playground",
    description: "Move every library control and copy the generated config.",
    category: "Live Examples",
    level: "Build",
    sections: [
      {
        id: "playground",
        title: "Interactive Controls",
        body: [
          "This is the docs replacement for a heavy editor surface. It proves that the library itself is customizable and that the control metadata is useful.",
          "Change speed, density, scale, distortion, bloom, grain, cursor response, shape count, depth, rotation, and palettes. The code output updates with the live config.",
        ],
        demo: "setting-playground",
      },
    ],
    related: ["api/config", "api/use-hypergl", "rendering/performance"],
  },
  {
    slug: "examples/hero-background",
    title: "Hero Background",
    description: "Use HyperGL as a restrained full-bleed product hero background.",
    category: "Live Examples",
    level: "Build",
    sections: [
      {
        id: "pattern",
        title: "Pattern",
        body: [
          "Hero backgrounds need restraint. Keep bloom low, reduce intensity, and place readable content above a scrim or solid content band.",
          "The canvas should be absolutely positioned and decorative unless the user interacts with it directly.",
        ],
        examples: [
          {
            title: "Hero component",
            language: "tsx",
            code: `<section className="hero">
  <HyperGLCanvas
    className="hero-canvas"
    config={{
      effect: "aurora",
      palette: ["#dbeafe", "#8b5cf6", "#2563eb"],
      intensity: 0.48,
      bloom: 0.14,
      speed: 0.24,
    }}
  />
  <div className="hero-content">...</div>
</section>`,
          },
        ],
      },
    ],
    related: ["examples/preset-gallery", "rendering/sizing", "frameworks/nextjs"],
  },
  {
    slug: "examples/product-panel",
    title: "Product Panel",
    description: "Place a compact HyperGL canvas inside a card or dashboard panel.",
    category: "Live Examples",
    level: "Build",
    sections: [
      {
        id: "pattern",
        title: "Pattern",
        body: [
          "Small panels need sharper composition than full-screen backgrounds. Choose grid, particle, or topo effects because their structure stays readable at smaller sizes.",
          "Limit pixel ratio and animation speed if the panel appears inside a dashboard with many other components.",
        ],
        examples: [
          {
            title: "Panel preview",
            language: "tsx",
            code: `<article className="metric-panel">
  <HyperGLCanvas
    className="panel-canvas"
    config={{ effect: "glassGrid", density: 0.82, bloom: 0.18 }}
  />
  <strong>Realtime signal map</strong>
</article>`,
          },
        ],
      },
    ],
    related: ["effects/glass-grid", "rendering/performance", "api/create-renderer"],
  },
  ...effectPages(),
  {
    slug: "frameworks/react",
    title: "React",
    description: "Use HyperGL in component-driven React apps.",
    category: "Frameworks",
    level: "Build",
    sections: [
      {
        id: "approach",
        title: "Approach",
        body: [
          "React should own state and layout, while HyperGL owns the canvas renderer. Keep the renderer in a ref and pass config changes through setConfig.",
          "Avoid recreating the renderer on every slider movement. useHyperGL already handles config updates after mount.",
        ],
        examples: [
          {
            title: "React wrapper",
            language: "tsx",
            code: `"use client";

import { useHyperGL, type HyperGLConfigInput } from "@/lib/hypergl";

export function HyperGLReactCanvas({ config }: { config: HyperGLConfigInput }) {
  const { canvasRef } = useHyperGL(config, { pixelRatioLimit: 1.5 });
  return <canvas ref={canvasRef} className="hypergl-canvas" />;
}`,
          },
        ],
      },
    ],
    related: ["api/use-hypergl", "examples/setting-playground", "frameworks/nextjs"],
  },
  {
    slug: "frameworks/nextjs",
    title: "Next.js",
    description: "Use HyperGL safely in the App Router.",
    category: "Frameworks",
    level: "Build",
    sections: [
      {
        id: "client-boundary",
        title: "Client Boundary",
        body: [
          "WebGL depends on browser APIs, so the component that calls useHyperGL must be a client component. Server components can still choose configs and pass serializable props into the client boundary.",
          "This structure keeps the page mostly server-rendered while isolating the canvas work.",
        ],
        examples: [
          {
            title: "Client canvas",
            language: "tsx",
            code: `"use client";

import { HyperGLCanvas } from "@/components/HyperGLCanvas";

export function HeroBackground() {
  return <HyperGLCanvas config={{ effect: "liquid", bloom: 0.24 }} />;
}`,
          },
        ],
      },
    ],
    related: ["frameworks/react", "rendering/sizing", "getting-started/quick-start"],
  },
  {
    slug: "frameworks/vanilla-js",
    title: "Vanilla JavaScript",
    description: "Use HyperGL without React.",
    category: "Frameworks",
    level: "Build",
    sections: [
      {
        id: "plain-browser",
        title: "Plain Browser Usage",
        body: [
          "The renderer API is framework-agnostic. React is optional; the core library only needs a canvas element.",
          "This path is important for open-source credibility because it proves HyperGL is not only a Next.js site component.",
        ],
        examples: [
          {
            title: "Plain module",
            language: "js",
            code: `import { createHyperGLRenderer } from "./hypergl.js";

const renderer = createHyperGLRenderer(document.querySelector("canvas"), {
  config: { effect: "particles", density: 0.76 },
});

document.querySelector("#bloom").addEventListener("input", (event) => {
  renderer.setConfig({ bloom: Number(event.target.value) });
});`,
          },
        ],
      },
    ],
    related: ["api/create-renderer", "rendering/capture", "api/config"],
  },
  {
    slug: "rendering/sizing",
    title: "Sizing",
    description: "Give the canvas stable bounds so WebGL renders crisply.",
    category: "Rendering",
    level: "Reference",
    sections: [
      {
        id: "css",
        title: "CSS Rules",
        body: [
          "A blank or stretched canvas is usually a sizing problem. HyperGL uses getBoundingClientRect, so the canvas or bounds element needs nonzero width and height.",
          "Prefer CSS sizing over hard-coded drawing buffer dimensions. The renderer handles pixel ratio internally.",
        ],
        examples: [
          {
            title: "Responsive canvas",
            language: "css",
            code: `.hypergl-canvas {
  display: block;
  width: 100%;
  height: clamp(280px, 52vw, 620px);
}`,
          },
        ],
      },
    ],
    related: ["rendering/performance", "getting-started/troubleshooting", "examples/hero-background"],
  },
  {
    slug: "rendering/performance",
    title: "Performance",
    description: "Tune pixel ratio, density, bloom, and canvas count.",
    category: "Rendering",
    level: "Reference",
    sections: [
      {
        id: "rules",
        title: "Practical Rules",
        body: [
          "Procedural effects are cheap compared with video, but every canvas still has a WebGL context, animation loop, and drawing buffer.",
          "Use one large hero canvas freely. For grids of previews, keep pixelRatioLimit low and keep canvas heights compact.",
        ],
        items: [
          "Use pixelRatioLimit around 1 to 1.5 for docs grids.",
          "Pause or unmount canvases that are not visible in long pages.",
          "Lower bloom, density, and distortion for background usage.",
          "Measure frame time before adding more shader branches.",
        ],
      },
    ],
    related: ["research/benchmarks", "examples/preset-gallery", "rendering/sizing"],
  },
  {
    slug: "rendering/capture",
    title: "Capture",
    description: "Export a canvas snapshot from the renderer.",
    category: "Rendering",
    level: "Reference",
    sections: [
      {
        id: "snapshot",
        title: "Snapshot",
        body: [
          "The renderer exposes capture so demos and tests can grab the current canvas frame as a data URL.",
          "Capture is useful for documentation thumbnails, regression notes, and README assets once the project starts publishing releases.",
        ],
        examples: [
          {
            title: "Download snapshot",
            language: "ts",
            code: `const href = renderer.capture("image/png");
const anchor = document.createElement("a");
anchor.href = href;
anchor.download = "hypergl-scene.png";
anchor.click();`,
          },
        ],
      },
    ],
    related: ["api/create-renderer", "rendering/performance", "research/benchmarks"],
  },
  {
    slug: "shaders/uniforms",
    title: "Uniforms",
    description: "Understand how config becomes shader data.",
    category: "Shader Concepts",
    level: "Research",
    sections: [
      {
        id: "mapping",
        title: "Config To Uniforms",
        body: [
          "Every frame, HyperGL uploads time, resolution, pointer, effect id, color palette, and numeric controls into the fragment shader.",
          "That mapping is the bridge between a friendly TypeScript config and GPU code.",
        ],
        examples: [
          {
            title: "Uniform examples",
            language: "glsl",
            code: `uniform vec2 uResolution;
uniform vec2 uPointer;
uniform float uTime;
uniform float uEffect;
uniform float uDistortion;
uniform vec3 uColorA;`,
          },
        ],
      },
    ],
    related: ["api/config", "shaders/noise", "research/webgl-pipeline"],
  },
  {
    slug: "shaders/noise",
    title: "Noise",
    description: "Use procedural noise as the base for organic motion.",
    category: "Shader Concepts",
    level: "Research",
    sections: [
      {
        id: "why",
        title: "Why Noise",
        body: [
          "Noise makes HyperGL feel alive without image assets. Aurora, liquid, contour, and particle effects all use noise-like fields in different ways.",
          "The best learning path is to compare how scale, density, and distortion change the same underlying field.",
        ],
      },
    ],
    related: ["examples/setting-playground", "effects/topo-lines", "shaders/uniforms"],
  },
  {
    slug: "shaders/debugging",
    title: "Shader Debugging",
    description: "Debug blank canvases, compile errors, and bad config values.",
    category: "Shader Concepts",
    level: "Research",
    sections: [
      {
        id: "checklist",
        title: "Debug Checklist",
        body: [
          "Shader debugging is easier when you separate browser setup from GPU logic. First check that the canvas is sized and WebGL2 exists, then inspect shader compile logs.",
          "When a visual is black, simplify the fragment shader to a solid color before changing uniforms.",
        ],
        items: [
          "Canvas has nonzero dimensions.",
          "getContext('webgl2') returns a context.",
          "Shader compile and program link logs are empty.",
          "Uniform names match the shader source exactly.",
          "Config values are within the documented ranges.",
        ],
      },
    ],
    related: ["getting-started/troubleshooting", "shaders/uniforms", "rendering/sizing"],
  },
  {
    slug: "research/webgl-pipeline",
    title: "WebGL Pipeline",
    description: "Map HyperGL source code to the browser graphics pipeline.",
    category: "Research",
    level: "Research",
    sections: [
      {
        id: "pipeline",
        title: "Pipeline Stages",
        body: [
          "HyperGL is a good computer science research project because it exposes the full WebGL path: context creation, shader compilation, program linking, buffer setup, uniform upload, and draw calls.",
          "The project should keep explaining these stages in docs so the library is educational, not just decorative.",
        ],
        examples: [
          {
            title: "Renderer stages",
            language: "ts",
            code: `const stages = [
  "create WebGL2 context",
  "compile vertex and fragment shaders",
  "link the program",
  "bind fullscreen geometry",
  "upload uniforms",
  "draw a frame",
];`,
          },
        ],
      },
    ],
    related: ["shaders/uniforms", "research/benchmarks", "api/create-renderer"],
  },
  {
    slug: "research/benchmarks",
    title: "Benchmarks",
    description: "Measure frame time and effect cost instead of guessing.",
    category: "Research",
    level: "Research",
    sections: [
      {
        id: "plan",
        title: "Benchmark Plan",
        body: [
          "A strong GitHub project should include evidence. Benchmark each preset at a few canvas sizes and pixel ratio limits, then document the results.",
          "This can become a research section that shows how shader settings affect performance.",
        ],
        items: [
          "Measure average frame time for each preset.",
          "Compare pixelRatioLimit values of 1, 1.5, and 2.",
          "Record browser, device, viewport, and number of active canvases.",
          "Use the results to mark presets as background-safe or showcase-only.",
        ],
      },
    ],
    related: ["rendering/performance", "research/webgl-pipeline", "examples/preset-gallery"],
  },
  {
    slug: "research/roadmap",
    title: "Roadmap",
    description: "The path from local research library to open-source package.",
    category: "Research",
    level: "Research",
    sections: [
      {
        id: "phases",
        title: "Phases",
        body: [
          "The standalone editor has been intentionally removed from the product scope. HyperGL should earn trust as a highly customizable library first.",
          "The next milestones are API stability, more preset coverage, better docs demos, benchmark notes, and packaging work.",
        ],
        items: [
          "Stabilize HyperGLConfig and HYPERGL_CONTROLS.",
          "Add more presets with screenshots and benchmark notes.",
          "Document every effect with visual demos.",
          "Prepare package exports for React and vanilla JavaScript.",
          "Publish only when examples and API names feel stable.",
        ],
      },
    ],
    related: ["api/config", "api/presets", "research/benchmarks"],
  },
];

function effectPages(): DocPage[] {
  const effects = [
    {
      slug: "effects/aurora-field",
      title: "Aurora Field",
      effect: "aurora",
      description: "Soft procedural bands for ambient backgrounds.",
      best: "Use aurora when the effect should support text and layout rather than dominate the page.",
      config: `{
  effect: "aurora",
  palette: ["#dbeafe", "#8b5cf6", "#2563eb"],
  speed: 0.24,
  intensity: 0.56,
  distortion: 0.28,
}`,
    },
    {
      slug: "effects/liquid-warp",
      title: "Liquid Warp",
      effect: "liquid",
      description: "Domain-warped color motion for kinetic surfaces.",
      best: "Use liquid when the page needs energy, motion, or a colorful mask-like field.",
      config: `{
  effect: "liquid",
  palette: ["#22d3ee", "#facc15", "#c084fc"],
  speed: 0.5,
  distortion: 0.78,
  bloom: 0.34,
}`,
    },
    {
      slug: "effects/particle-bloom",
      title: "Particle Bloom",
      effect: "particles",
      description: "Cellular particles with pointer-reactive glow.",
      best: "Use particles for interactive demos, loading states, and data-inspired surfaces.",
      config: `{
  effect: "particles",
  palette: ["#bef264", "#38bdf8", "#f472b6"],
  density: 0.86,
  bloom: 0.7,
  cursor: { enabled: true, strength: 0.62 },
}`,
    },
    {
      slug: "effects/topo-lines",
      title: "Topo Lines",
      effect: "topographic",
      description: "Contour-style noise mapping for diagrams and research visuals.",
      best: "Use topo lines when you want the shader field to be readable and educational.",
      config: `{
  effect: "topographic",
  palette: ["#ffffff", "#94a3b8", "#111827"],
  density: 0.82,
  scale: 0.86,
  bloom: 0.04,
}`,
    },
    {
      slug: "effects/glass-grid",
      title: "Glass Grid",
      effect: "glassGrid",
      description: "Crisp grid, scanline, and chromatic-edge composition.",
      best: "Use glass grid for dashboards, technical product cards, and precise UI backgrounds.",
      config: `{
  effect: "glassGrid",
  palette: ["#f8fafc", "#60a5fa", "#a78bfa"],
  density: 0.88,
  distortion: 0.18,
  grain: 0.06,
}`,
    },
    {
      slug: "effects/ray-orb",
      title: "Ray Orb",
      effect: "rayOrb",
      description: "Pseudo-3D rings, depth, and orb lighting.",
      best: "Use ray orb for object-focused showcases where the effect can be the main visual.",
      config: `{
  effect: "rayOrb",
  palette: ["#fde68a", "#f97316", "#7c2d12"],
  bloom: 0.74,
  shape: { count: 5, depth: 0.92, rotation: 0.42 },
}`,
    },
  ] as const;

  return effects.map((effect) => ({
    slug: effect.slug,
    title: effect.title,
    description: effect.description,
    category: "Effects",
    level: "Build",
    sections: [
      {
        id: "usage",
        title: "When To Use It",
        body: [effect.best],
      },
      {
        id: "starter-config",
        title: "Starter Config",
        body: ["Start with this config, then use the Settings Playground to adjust the shared controls visually."],
        examples: [
          {
            title: `${effect.title} config`,
            language: "ts",
            code: `import { defineHyperGLConfig } from "@/lib/hypergl";

export const config = defineHyperGLConfig(${effect.config});`,
          },
        ],
      },
      {
        id: "tuning",
        title: "Tuning Notes",
        body: [],
        items: [
          "Lower speed for ambient backgrounds.",
          "Lower bloom when text sits above the canvas.",
          "Use palette changes before changing shader code.",
          "Compare the effect in the Effect Gallery before committing to a page pattern.",
        ],
      },
    ],
    related: ["examples/effect-gallery", "examples/setting-playground", "api/config"],
  }));
}

export const docsNav: DocNavGroup[] = Object.entries(categoryDescriptions)
  .map(([label, description]) => ({
    label,
    description,
    items: docPages
      .filter((page) => page.category === label)
      .map((page, index) => ({
        slug: page.slug,
        title: page.title,
        badge: index === 0 ? "Start" : undefined,
      })),
  }))
  .filter((group) => group.items.length > 0);

export function getDocPage(slug: string) {
  const normalized = slug.replace(/^docs\//, "");
  const aliases: Record<string, string> = {
    installation: "getting-started/installation",
    "quick-start": "getting-started/quick-start",
    concepts: "shaders/uniforms",
    effects: "examples/effect-gallery",
    examples: "examples/preset-gallery",
    presets: "examples/preset-gallery",
    playground: "examples/setting-playground",
    exporting: "rendering/capture",
    react: "frameworks/react",
    nextjs: "frameworks/nextjs",
    vanilla: "frameworks/vanilla-js",
    "webgl-pipeline": "research/webgl-pipeline",
    roadmap: "research/roadmap",
  };
  return docPages.find((page) => page.slug === (aliases[normalized] ?? normalized));
}

export function getDocNeighbors(slug: string) {
  const index = docPages.findIndex((page) => page.slug === slug);
  return {
    previous: index > 0 ? docPages[index - 1] : undefined,
    next: index >= 0 && index < docPages.length - 1 ? docPages[index + 1] : undefined,
  };
}
