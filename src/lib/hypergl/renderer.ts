import { DEFAULT_HYPERGL_CONFIG } from "./presets";
import { FULLSCREEN_VERTEX_SHADER, HYPERGL_FRAGMENT_SHADER } from "./shaders";
import type {
  HyperGLConfig,
  HyperGLConfigInput,
  HyperGLEffect,
  HyperGLRenderer,
  HyperGLRendererOptions,
} from "./types";

const EFFECT_INDEX: Record<HyperGLEffect, number> = {
  aurora: 0,
  liquid: 1,
  particles: 2,
  topographic: 3,
  glassGrid: 4,
  rayOrb: 5,
};

const FULLSCREEN_TRIANGLE_STRIP = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);

export function createHyperGLRenderer(
  canvas: HTMLCanvasElement,
  options: HyperGLRendererOptions = {},
): HyperGLRenderer {
  if (!canvas) {
    throw new Error("HyperGL needs a canvas element.");
  }

  const context = canvas.getContext("webgl2", {
    alpha: false,
    antialias: true,
    depth: false,
    stencil: false,
    premultipliedAlpha: false,
  });

  if (!context) {
    throw new Error("HyperGL needs WebGL 2 support.");
  }

  const gl: WebGL2RenderingContext = context;

  const boundsElement = options.boundsElement ?? canvas;
  const pixelRatioLimit = options.pixelRatioLimit ?? 1.5;
  const config = resolveConfig(options.config);
  const program = createProgram(gl, FULLSCREEN_VERTEX_SHADER, HYPERGL_FRAGMENT_SHADER);
  const uniforms = createUniformMap(gl, program, [
    "uResolution",
    "uPointer",
    "uPointerStrength",
    "uTime",
    "uEffect",
    "uSpeed",
    "uIntensity",
    "uDensity",
    "uScale",
    "uDistortion",
    "uBloom",
    "uGrain",
    "uCursorRadius",
    "uShapeCount",
    "uDepth",
    "uRotation",
    "uColorA",
    "uColorB",
    "uColorC",
  ]);
  const buffer = gl.createBuffer();

  if (!buffer) {
    throw new Error("HyperGL could not create a vertex buffer.");
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, FULLSCREEN_TRIANGLE_STRIP, gl.STATIC_DRAW);

  const pointer = {
    x: 0.5,
    y: 0.5,
    targetX: 0.5,
    targetY: 0.5,
    strength: 0,
    targetStrength: 0,
  };

  let width = 1;
  let height = 1;
  let frameId = 0;
  let running = false;
  let startedAt = performance.now();
  let destroyed = false;

  function resize() {
    const rect = boundsElement.getBoundingClientRect();
    width = Math.max(1, Math.round(rect.width || canvas.clientWidth || 1));
    height = Math.max(1, Math.round(rect.height || canvas.clientHeight || 1));
    const pixelRatio = Math.min(window.devicePixelRatio || 1, pixelRatioLimit);
    const pixelWidth = Math.max(1, Math.round(width * pixelRatio));
    const pixelHeight = Math.max(1, Math.round(height * pixelRatio));

    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
    }

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    gl.viewport(0, 0, pixelWidth, pixelHeight);
  }

  function render(now: number) {
    if (!running || destroyed) return;

    const smoothing = clamp(config.cursor.smoothing, 0.01, 1);
    const elapsed = (now - startedAt) / 1000;
    pointer.x += (pointer.targetX - pointer.x) * smoothing;
    pointer.y += (pointer.targetY - pointer.y) * smoothing;
    pointer.strength += (pointer.targetStrength - pointer.strength) * smoothing;

    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.viewport(0, 0, canvas.width, canvas.height);

    uniform2f(gl, uniforms.uResolution, canvas.width, canvas.height);
    uniform2f(gl, uniforms.uPointer, pointer.x, pointer.y);
    uniform1f(gl, uniforms.uPointerStrength, config.cursor.enabled ? pointer.strength * config.cursor.strength : 0);
    uniform1f(gl, uniforms.uTime, elapsed * Math.max(config.speed, 0));
    uniform1f(gl, uniforms.uEffect, EFFECT_INDEX[config.effect]);
    uniform1f(gl, uniforms.uSpeed, config.speed);
    uniform1f(gl, uniforms.uIntensity, config.intensity);
    uniform1f(gl, uniforms.uDensity, config.density);
    uniform1f(gl, uniforms.uScale, config.scale);
    uniform1f(gl, uniforms.uDistortion, config.distortion);
    uniform1f(gl, uniforms.uBloom, config.bloom);
    uniform1f(gl, uniforms.uGrain, config.grain);
    uniform1f(gl, uniforms.uCursorRadius, config.cursor.radius);
    uniform1f(gl, uniforms.uShapeCount, config.shape.count);
    uniform1f(gl, uniforms.uDepth, config.shape.depth);
    uniform1f(gl, uniforms.uRotation, config.shape.rotation);
    uniform3f(gl, uniforms.uColorA, parseColor(config.palette[0]));
    uniform3f(gl, uniforms.uColorB, parseColor(config.palette[1]));
    uniform3f(gl, uniforms.uColorC, parseColor(config.palette[2]));

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    frameId = requestAnimationFrame(render);
  }

  function movePointer(event: PointerEvent) {
    const rect = boundsElement.getBoundingClientRect();
    const localX = clamp((event.clientX - rect.left) / Math.max(rect.width, 1), 0, 1);
    const localY = clamp((event.clientY - rect.top) / Math.max(rect.height, 1), 0, 1);
    pointer.targetX = localX;
    pointer.targetY = 1 - localY;
    pointer.targetStrength = 1;
  }

  function releasePointer() {
    pointer.targetStrength = 0;
  }

  function play() {
    if (running || destroyed) return;
    running = true;
    startedAt = performance.now();
    frameId = requestAnimationFrame(render);
  }

  function pause() {
    running = false;
    cancelAnimationFrame(frameId);
  }

  function destroy() {
    destroyed = true;
    pause();
    window.removeEventListener("resize", resize);
    boundsElement.removeEventListener("pointermove", movePointer);
    boundsElement.removeEventListener("pointerdown", movePointer);
    boundsElement.removeEventListener("pointerleave", releasePointer);
    boundsElement.removeEventListener("pointercancel", releasePointer);
    gl.deleteBuffer(buffer);
    gl.deleteProgram(program);
  }

  window.addEventListener("resize", resize);
  boundsElement.addEventListener("pointermove", movePointer, { passive: true });
  boundsElement.addEventListener("pointerdown", movePointer, { passive: true });
  boundsElement.addEventListener("pointerleave", releasePointer, { passive: true });
  boundsElement.addEventListener("pointercancel", releasePointer, { passive: true });

  resize();

  if (options.autoStart !== false) {
    play();
  }

  return {
    canvas,
    play,
    pause,
    resize,
    destroy,
    capture: (type = "image/png", quality) => canvas.toDataURL(type, quality),
    setConfig: (nextConfig) => {
      mergeConfig(config, nextConfig);
    },
    getConfig: () => cloneConfig(config),
  };
}

export function resolveConfig(input: HyperGLConfigInput = {}): HyperGLConfig {
  const config = cloneConfig(DEFAULT_HYPERGL_CONFIG);
  mergeConfig(config, input);
  return config;
}

function mergeConfig(target: HyperGLConfig, input: HyperGLConfigInput) {
  if (input.effect) target.effect = input.effect;
  if (typeof input.speed === "number") target.speed = input.speed;
  if (typeof input.intensity === "number") target.intensity = input.intensity;
  if (typeof input.density === "number") target.density = input.density;
  if (typeof input.scale === "number") target.scale = input.scale;
  if (typeof input.distortion === "number") target.distortion = input.distortion;
  if (typeof input.bloom === "number") target.bloom = input.bloom;
  if (typeof input.grain === "number") target.grain = input.grain;

  if (input.palette) {
    target.palette = [
      input.palette[0] ?? target.palette[0],
      input.palette[1] ?? target.palette[1],
      input.palette[2] ?? target.palette[2],
    ];
  }

  if (input.cursor) {
    target.cursor = { ...target.cursor, ...input.cursor };
  }

  if (input.shape) {
    target.shape = { ...target.shape, ...input.shape };
  }
}

function cloneConfig(config: HyperGLConfig): HyperGLConfig {
  return {
    ...config,
    palette: [...config.palette],
    cursor: { ...config.cursor },
    shape: { ...config.shape },
  };
}

function createProgram(gl: WebGL2RenderingContext, vertexSource: string, fragmentSource: string) {
  const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();

  if (!program) {
    throw new Error("HyperGL could not create a shader program.");
  }

  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const message = gl.getProgramInfoLog(program) || "Unknown WebGL program link error.";
    gl.deleteProgram(program);
    throw new Error(message);
  }

  return program;
}

function compileShader(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);

  if (!shader) {
    throw new Error("HyperGL could not create a shader.");
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader) || "Unknown WebGL shader compile error.";
    gl.deleteShader(shader);
    throw new Error(message);
  }

  return shader;
}

function createUniformMap(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  names: string[],
): Record<string, WebGLUniformLocation | null> {
  return names.reduce<Record<string, WebGLUniformLocation | null>>((map, name) => {
    map[name] = gl.getUniformLocation(program, name);
    return map;
  }, {});
}

function uniform1f(gl: WebGL2RenderingContext, location: WebGLUniformLocation | null, value: number) {
  if (location) gl.uniform1f(location, value);
}

function uniform2f(
  gl: WebGL2RenderingContext,
  location: WebGLUniformLocation | null,
  x: number,
  y: number,
) {
  if (location) gl.uniform2f(location, x, y);
}

function uniform3f(
  gl: WebGL2RenderingContext,
  location: WebGLUniformLocation | null,
  value: [number, number, number],
) {
  if (location) gl.uniform3f(location, value[0], value[1], value[2]);
}

function parseColor(color: string): [number, number, number] {
  if (color.startsWith("#")) {
    const normalized = color.length === 4
      ? `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`
      : color;
    const value = Number.parseInt(normalized.slice(1), 16);
    return [
      ((value >> 16) & 255) / 255,
      ((value >> 8) & 255) / 255,
      (value & 255) / 255,
    ];
  }

  const channels = color
    .split(",")
    .map((channel) => Number.parseFloat(channel.trim()))
    .filter((channel) => Number.isFinite(channel));

  if (channels.length >= 3) {
    const needsNormalize = channels.some((channel) => channel > 1);
    return [
      needsNormalize ? channels[0] / 255 : channels[0],
      needsNormalize ? channels[1] / 255 : channels[1],
      needsNormalize ? channels[2] / 255 : channels[2],
    ];
  }

  return [1, 1, 1];
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
