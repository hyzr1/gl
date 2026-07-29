"use client";

import { useMemo, useState } from "react";
import { CodeBlock } from "@/components/CodeBlock";
import { HyperGLCanvas } from "@/components/HyperGLCanvas";
import {
  DEFAULT_HYPERGL_CONFIG,
  EFFECT_LABELS,
  HYPERGL_CONTROLS,
  HYPERGL_PALETTES,
  HYPERGL_PRESETS,
  resolveConfig,
  type HyperGLConfig,
  type HyperGLControlPath,
  type HyperGLEffect,
  type HyperGLPreset,
} from "@/lib/hypergl";

export type DocsDemoKind = "preset-gallery" | "effect-gallery" | "setting-playground";

const effectOrder = Object.keys(EFFECT_LABELS) as HyperGLEffect[];

export function DocsLiveDemo({ kind }: { kind: DocsDemoKind }) {
  if (kind === "preset-gallery") return <PresetGalleryDemo />;
  if (kind === "effect-gallery") return <EffectGalleryDemo />;
  return <SettingPlaygroundDemo />;
}

function PresetGalleryDemo() {
  const [activeId, setActiveId] = useState(HYPERGL_PRESETS[0].id);
  const activePreset = HYPERGL_PRESETS.find((preset) => preset.id === activeId) ?? HYPERGL_PRESETS[0];
  const code = presetCode(activePreset);

  return (
    <div className="docs-demo">
      <div className="docs-demo-preview is-large">
        <HyperGLCanvas config={activePreset.config} label={`${activePreset.name} live preview`} />
        <div>
          <strong>{activePreset.name}</strong>
          <span>{activePreset.description}</span>
        </div>
      </div>
      <div className="preset-demo-grid" aria-label="Preset previews">
        {HYPERGL_PRESETS.map((preset) => (
          <button
            className={preset.id === activeId ? "is-active" : ""}
            key={preset.id}
            onClick={() => setActiveId(preset.id)}
            type="button"
          >
            <HyperGLCanvas config={preset.config} label={`${preset.name} thumbnail`} />
            <span>{preset.name}</span>
          </button>
        ))}
      </div>
      <CodeBlock code={code} language="tsx" title="Use this preset" />
    </div>
  );
}

function EffectGalleryDemo() {
  const [effect, setEffect] = useState<HyperGLEffect>("aurora");
  const config = useMemo(
    () =>
      resolveConfig({
        ...DEFAULT_HYPERGL_CONFIG,
        effect,
        palette: paletteForEffect(effect),
        speed: effect === "topographic" ? 0.24 : 0.5,
        distortion: effect === "liquid" ? 0.84 : 0.32,
        density: effect === "particles" || effect === "glassGrid" ? 0.82 : 0.56,
        bloom: effect === "rayOrb" || effect === "particles" ? 0.62 : 0.28,
      }),
    [effect],
  );

  return (
    <div className="docs-demo">
      <div className="effect-demo-shell">
        <div className="docs-demo-preview">
          <HyperGLCanvas config={config} label={`${EFFECT_LABELS[effect]} effect preview`} />
        </div>
        <div className="effect-demo-controls">
          {effectOrder.map((item) => (
            <button
              className={item === effect ? "is-active" : ""}
              key={item}
              onClick={() => setEffect(item)}
              type="button"
            >
              <strong>{EFFECT_LABELS[item]}</strong>
              <span>{effectNote(item)}</span>
            </button>
          ))}
        </div>
      </div>
      <CodeBlock code={effectCode(config)} language="tsx" title="Effect config" />
    </div>
  );
}

function SettingPlaygroundDemo() {
  const [config, setConfig] = useState<HyperGLConfig>(
    resolveConfig({
      ...HYPERGL_PRESETS[7].config,
      effect: "liquid",
    }),
  );

  function updateControl(path: HyperGLControlPath, value: number) {
    setConfig((current) => setConfigPath(current, path, value));
  }

  return (
    <div className="docs-demo">
      <div className="settings-demo-layout">
        <div className="docs-demo-preview">
          <HyperGLCanvas config={config} label="Interactive settings playground preview" />
        </div>
        <div className="settings-demo-panel">
          <div className="setting-palette-row" aria-label="Palette presets">
            {HYPERGL_PALETTES.map((palette) => (
              <button
                key={palette.join("-")}
                onClick={() => setConfig((current) => ({ ...current, palette: [...palette] }))}
                type="button"
              >
                {palette.map((color) => (
                  <span key={color} style={{ background: color }} />
                ))}
              </button>
            ))}
          </div>
          {HYPERGL_CONTROLS.map((control) => (
            <label className="demo-slider" key={control.path}>
              <span>
                <strong>{control.label}</strong>
                <em>{readConfigPath(config, control.path).toFixed(control.step === 1 ? 0 : 2)}</em>
              </span>
              <input
                max={control.max}
                min={control.min}
                onChange={(event) => updateControl(control.path, Number(event.target.value))}
                step={control.step}
                type="range"
                value={readConfigPath(config, control.path)}
              />
              <small>{control.description}</small>
            </label>
          ))}
        </div>
      </div>
      <CodeBlock code={effectCode(config)} language="tsx" title="Live config output" />
    </div>
  );
}

function setConfigPath(config: HyperGLConfig, path: HyperGLControlPath, value: number): HyperGLConfig {
  if (path === "cursor.radius" || path === "cursor.strength" || path === "cursor.smoothing") {
    const key = path.split(".")[1] as keyof HyperGLConfig["cursor"];
    return { ...config, cursor: { ...config.cursor, [key]: value } };
  }

  if (path === "shape.count" || path === "shape.depth" || path === "shape.rotation") {
    const key = path.split(".")[1] as keyof HyperGLConfig["shape"];
    return { ...config, shape: { ...config.shape, [key]: value } };
  }

  return { ...config, [path]: value };
}

function readConfigPath(config: HyperGLConfig, path: HyperGLControlPath) {
  if (path === "cursor.radius") return config.cursor.radius;
  if (path === "cursor.strength") return config.cursor.strength;
  if (path === "cursor.smoothing") return config.cursor.smoothing;
  if (path === "shape.count") return config.shape.count;
  if (path === "shape.depth") return config.shape.depth;
  if (path === "shape.rotation") return config.shape.rotation;
  return config[path];
}

function presetCode(preset: HyperGLPreset) {
  return `"use client";

import { HyperGLCanvas } from "@/components/HyperGLCanvas";
import { HYPERGL_PRESETS } from "@/lib/hypergl";

const preset = HYPERGL_PRESETS.find((item) => item.id === "${preset.id}")!;

export function ${pascalCase(preset.id)}Preview() {
  return <HyperGLCanvas config={preset.config} className="demo-canvas" />;
}`;
}

function effectCode(config: HyperGLConfig) {
  return `"use client";

import { defineHyperGLConfig } from "@/lib/hypergl";

export const config = defineHyperGLConfig(${JSON.stringify(config, null, 2)});`;
}

function paletteForEffect(effect: HyperGLEffect) {
  const palettes: Record<HyperGLEffect, [string, string, string]> = {
    aurora: ["#dbeafe", "#8b5cf6", "#2563eb"],
    liquid: ["#22d3ee", "#facc15", "#c084fc"],
    particles: ["#bef264", "#38bdf8", "#f472b6"],
    topographic: ["#ffffff", "#94a3b8", "#111827"],
    glassGrid: ["#f8fafc", "#60a5fa", "#a78bfa"],
    rayOrb: ["#fde68a", "#f97316", "#7c2d12"],
  };
  return palettes[effect];
}

function effectNote(effect: HyperGLEffect) {
  const notes: Record<HyperGLEffect, string> = {
    aurora: "soft bands, ambient hero fields",
    liquid: "domain-warped motion and color flow",
    particles: "cellular points and pointer energy",
    topographic: "contours for noise and threshold study",
    glassGrid: "crisp grids, scanlines, chromatic edges",
    rayOrb: "pseudo-3D rings, depth, and glow",
  };
  return notes[effect];
}

function pascalCase(value: string) {
  return value
    .split("-")
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join("");
}
