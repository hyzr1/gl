import { describe, expect, it } from "vitest";
import { HYPERGL_CONTROLS } from "../src/lib/hypergl/controls";
import {
  EFFECT_LABELS,
  HYPERGL_PRESETS,
} from "../src/lib/hypergl/presets";

describe("effect catalog", () => {
  it("includes at least one preset for every renderer effect", () => {
    const configuredEffects = new Set(HYPERGL_PRESETS.map((preset) => preset.config.effect));

    expect(configuredEffects).toEqual(new Set(Object.keys(EFFECT_LABELS)));
  });

  it("uses unique, URL-safe preset identifiers", () => {
    const ids = HYPERGL_PRESETS.map((preset) => preset.id);

    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every((id) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id))).toBe(true);
  });

  it("keeps every preset palette and numeric setting valid", () => {
    for (const preset of HYPERGL_PRESETS) {
      expect(preset.config.palette).toHaveLength(3);
      expect(preset.config.palette.every((color) => /^#[0-9a-f]{6}$/i.test(color))).toBe(true);

      for (const value of [
        preset.config.speed,
        preset.config.intensity,
        preset.config.density,
        preset.config.scale,
        preset.config.distortion,
        preset.config.bloom,
        preset.config.grain,
      ]) {
        expect(Number.isFinite(value)).toBe(true);
        expect(value).toBeGreaterThanOrEqual(0);
      }
    }
  });
});

describe("control schema", () => {
  it("uses unique paths and coherent numeric bounds", () => {
    const paths = HYPERGL_CONTROLS.map((control) => control.path);

    expect(new Set(paths).size).toBe(paths.length);
    for (const control of HYPERGL_CONTROLS) {
      expect(control.min).toBeLessThan(control.max);
      expect(control.step).toBeGreaterThan(0);
      expect(control.description.length).toBeGreaterThan(20);
    }
  });
});
