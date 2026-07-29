import { describe, expect, it } from "vitest";
import { DEFAULT_HYPERGL_CONFIG } from "../src/lib/hypergl/presets";
import { resolveConfig } from "../src/lib/hypergl/renderer";

describe("resolveConfig", () => {
  it("returns an isolated copy of the default configuration", () => {
    const first = resolveConfig();
    const second = resolveConfig();

    first.cursor.radius = 0.8;
    first.palette[0] = "#000000";

    expect(second.cursor.radius).toBe(DEFAULT_HYPERGL_CONFIG.cursor.radius);
    expect(second.palette[0]).toBe(DEFAULT_HYPERGL_CONFIG.palette[0]);
    expect(DEFAULT_HYPERGL_CONFIG.cursor.radius).toBe(0.34);
  });

  it("merges top-level and nested overrides without dropping defaults", () => {
    const config = resolveConfig({
      effect: "glassGrid",
      speed: 0,
      cursor: { strength: 0.25 },
      shape: { count: 12 },
    });

    expect(config.effect).toBe("glassGrid");
    expect(config.speed).toBe(0);
    expect(config.cursor.strength).toBe(0.25);
    expect(config.cursor.radius).toBe(DEFAULT_HYPERGL_CONFIG.cursor.radius);
    expect(config.shape.count).toBe(12);
    expect(config.shape.depth).toBe(DEFAULT_HYPERGL_CONFIG.shape.depth);
  });

  it("copies palette input instead of retaining the caller's array", () => {
    const palette: [string, string, string] = ["#111111", "#222222", "#333333"];
    const config = resolveConfig({ palette });

    palette[0] = "#ffffff";

    expect(config.palette).toEqual(["#111111", "#222222", "#333333"]);
  });
});
