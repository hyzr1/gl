import Link from "next/link";
import { ArrowRight, Code2, FileJson, Package, SlidersHorizontal, Workflow } from "lucide-react";
import { CodeBlock } from "@/components/CodeBlock";
import { SiteHeader } from "@/components/SiteHeader";

const reactCode = `"use client";

import { useHyperGL } from "@/lib/hypergl";

export function HeroScene() {
  const { canvasRef } = useHyperGL({
    effect: "rayOrb",
    palette: ["#f97316", "#22c55e", "#38bdf8"],
    bloom: 0.55,
  });

  return <canvas ref={canvasRef} />;
}`;

const vanillaCode = `import { createHyperGLRenderer } from "@/lib/hypergl";

const renderer = createHyperGLRenderer(canvas, {
  config: { effect: "glassGrid", density: 0.7 },
});

renderer.setConfig({ distortion: 0.42 });`;

export default function LibraryPage() {
  return (
    <>
      <SiteHeader />
      <main className="content-page">
        <section className="page-hero compact">
          <p className="pill">Library</p>
          <h1>Library</h1>
          <p>
            HyperGL is local today, but the API is now shaped as a customizable open-source
            library with typed presets, control metadata, and framework entry points.
          </p>
          <Link className="primary-button large" href="/docs/getting-started/quick-start">
            View quick start
            <ArrowRight size={18} />
          </Link>
        </section>

        <section className="feature-grid library-grid">
          <LibraryCard
            icon={<Workflow size={20} />}
            title="createHyperGLRenderer"
            text="Low-level canvas lifecycle for vanilla JavaScript and custom frameworks."
          />
          <LibraryCard
            icon={<Code2 size={20} />}
            title="useHyperGL"
            text="React hook that creates, updates, and destroys the renderer."
          />
          <LibraryCard
            icon={<FileJson size={20} />}
            title="Typed Config"
            text="Shared config schema for effects, palette, motion, cursor, render, and shape controls."
          />
          <LibraryCard
            icon={<SlidersHorizontal size={20} />}
            title="Control Metadata"
            text="Documented ranges and descriptions for rendering sliders, docs demos, and future tools."
          />
          <LibraryCard
            icon={<Package size={20} />}
            title="Local Package"
            text="Kept in-repo until the docs, examples, and API stability are ready for npm."
          />
        </section>

        <section className="two-column-section">
          <div>
            <h2>React usage</h2>
            <p>Use the hook for component-driven apps.</p>
            <CodeBlock code={reactCode} />
          </div>
          <div>
            <h2>Vanilla usage</h2>
            <p>Use the renderer directly for plain JavaScript projects.</p>
            <CodeBlock code={vanillaCode} />
          </div>
        </section>
      </main>
    </>
  );
}

function LibraryCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <article className="feature-card">
      <div className="feature-icon">{icon}</div>
      <h2>{title}</h2>
      <p>{text}</p>
    </article>
  );
}
