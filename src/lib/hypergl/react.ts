"use client";

import { useEffect, useRef } from "react";
import { createHyperGLRenderer } from "./renderer";
import type { HyperGLConfigInput, HyperGLRenderer, HyperGLRendererOptions } from "./types";

export function useHyperGL(
  config: HyperGLConfigInput,
  options: Omit<HyperGLRendererOptions, "config"> = {},
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<HyperGLRenderer | null>(null);
  const optionsRef = useRef(options);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const renderer = createHyperGLRenderer(canvas, {
      ...optionsRef.current,
      config,
    });
    rendererRef.current = renderer;

    return () => {
      renderer.destroy();
      rendererRef.current = null;
    };
  }, []);

  useEffect(() => {
    rendererRef.current?.setConfig(config);
  }, [config]);

  return { canvasRef, rendererRef };
}
