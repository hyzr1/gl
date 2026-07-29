import type { HyperGLConfigInput } from "./types";

export type HyperGLControlPath =
  | "speed"
  | "intensity"
  | "density"
  | "scale"
  | "distortion"
  | "bloom"
  | "grain"
  | "cursor.radius"
  | "cursor.strength"
  | "cursor.smoothing"
  | "shape.count"
  | "shape.depth"
  | "shape.rotation";

export interface HyperGLControlDefinition {
  path: HyperGLControlPath;
  label: string;
  group: "Motion" | "Structure" | "Interaction" | "Render";
  min: number;
  max: number;
  step: number;
  description: string;
}

export const HYPERGL_CONTROLS: HyperGLControlDefinition[] = [
  {
    path: "speed",
    label: "Speed",
    group: "Motion",
    min: 0,
    max: 1.5,
    step: 0.01,
    description: "Animation time multiplier. Keep low for ambient surfaces and higher for energetic hero moments.",
  },
  {
    path: "intensity",
    label: "Intensity",
    group: "Render",
    min: 0,
    max: 1.25,
    step: 0.01,
    description: "Primary contrast and energy control. Raise it when the effect feels flat.",
  },
  {
    path: "density",
    label: "Density",
    group: "Structure",
    min: 0,
    max: 1,
    step: 0.01,
    description: "Controls how much visual structure appears in grids, particles, contours, and noise bands.",
  },
  {
    path: "scale",
    label: "Scale",
    group: "Structure",
    min: 0.05,
    max: 1.2,
    step: 0.01,
    description: "Spatial zoom for procedural patterns. Lower values feel broad; higher values reveal detail.",
  },
  {
    path: "distortion",
    label: "Distortion",
    group: "Motion",
    min: 0,
    max: 1,
    step: 0.01,
    description: "Domain-warp strength. This is the main control for liquid, noisy, and organic movement.",
  },
  {
    path: "bloom",
    label: "Bloom",
    group: "Render",
    min: 0,
    max: 1,
    step: 0.01,
    description: "Glow response. Use carefully on text-heavy pages so the background does not overpower content.",
  },
  {
    path: "grain",
    label: "Grain",
    group: "Render",
    min: 0,
    max: 0.35,
    step: 0.01,
    description: "Fine texture overlay that can reduce banding and make gradients feel less synthetic.",
  },
  {
    path: "cursor.radius",
    label: "Cursor radius",
    group: "Interaction",
    min: 0,
    max: 0.8,
    step: 0.01,
    description: "How wide the pointer influence should feel around the cursor.",
  },
  {
    path: "cursor.strength",
    label: "Cursor strength",
    group: "Interaction",
    min: 0,
    max: 1,
    step: 0.01,
    description: "How strongly pointer motion bends or energizes the effect.",
  },
  {
    path: "cursor.smoothing",
    label: "Cursor smoothing",
    group: "Interaction",
    min: 0.01,
    max: 0.5,
    step: 0.01,
    description: "Interpolation amount for pointer motion. Low values feel smooth; high values feel snappy.",
  },
  {
    path: "shape.count",
    label: "Shape count",
    group: "Structure",
    min: 1,
    max: 16,
    step: 1,
    description: "Repeating primitive count for effects that use orbital, particle, or layered structure.",
  },
  {
    path: "shape.depth",
    label: "Shape depth",
    group: "Structure",
    min: 0,
    max: 1,
    step: 0.01,
    description: "Pseudo-3D depth used by orb and layered effects.",
  },
  {
    path: "shape.rotation",
    label: "Shape rotation",
    group: "Motion",
    min: 0,
    max: 1,
    step: 0.01,
    description: "Rotational phase for shape-heavy effects.",
  },
];

export const HYPERGL_PALETTES = [
  ["#dbeafe", "#8b5cf6", "#2563eb"],
  ["#22d3ee", "#facc15", "#c084fc"],
  ["#bef264", "#38bdf8", "#f472b6"],
  ["#f8fafc", "#60a5fa", "#a78bfa"],
  ["#fde68a", "#f97316", "#7c2d12"],
  ["#ffffff", "#94a3b8", "#111827"],
] as const;

export function defineHyperGLConfig(config: HyperGLConfigInput) {
  return config;
}
