"use client";

import { useHyperGL } from "@/lib/hypergl";
import type { HyperGLConfigInput } from "@/lib/hypergl";

export function HyperGLCanvas({
  config,
  className,
  label = "HyperGL WebGL preview",
}: {
  config: HyperGLConfigInput;
  className?: string;
  label?: string;
}) {
  const { canvasRef } = useHyperGL(config, { pixelRatioLimit: 1.5 });

  return <canvas ref={canvasRef} aria-label={label} className={className} />;
}
