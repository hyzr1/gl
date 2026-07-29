export type HyperGLEffect =
  | "aurora"
  | "liquid"
  | "particles"
  | "topographic"
  | "glassGrid"
  | "rayOrb";

export type HyperGLPalette = [string, string, string];

export interface HyperGLCursorConfig {
  enabled: boolean;
  radius: number;
  strength: number;
  smoothing: number;
}

export interface HyperGLShapeConfig {
  count: number;
  depth: number;
  rotation: number;
}

export interface HyperGLConfig {
  effect: HyperGLEffect;
  palette: HyperGLPalette;
  speed: number;
  intensity: number;
  density: number;
  scale: number;
  distortion: number;
  bloom: number;
  grain: number;
  cursor: HyperGLCursorConfig;
  shape: HyperGLShapeConfig;
}

export type HyperGLConfigInput = Partial<
  Omit<HyperGLConfig, "cursor" | "shape" | "palette">
> & {
  palette?: Partial<HyperGLPalette> | HyperGLPalette;
  cursor?: Partial<HyperGLCursorConfig>;
  shape?: Partial<HyperGLShapeConfig>;
};

export interface HyperGLRendererOptions {
  config?: HyperGLConfigInput;
  boundsElement?: HTMLElement;
  pixelRatioLimit?: number;
  autoStart?: boolean;
}

export interface HyperGLRenderer {
  canvas: HTMLCanvasElement;
  play: () => void;
  pause: () => void;
  resize: () => void;
  destroy: () => void;
  capture: (type?: string, quality?: number) => string;
  setConfig: (config: HyperGLConfigInput) => void;
  getConfig: () => HyperGLConfig;
}
