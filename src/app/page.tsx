import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Box,
  Code2,
  GalleryHorizontalEnd,
  Settings2,
  Sparkles,
  Terminal,
} from "lucide-react";
import { HyperGLCanvas } from "@/components/HyperGLCanvas";
import { SiteHeader } from "@/components/SiteHeader";
import { HYPERGL_PRESETS } from "@/lib/hypergl";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="hero">
          <HyperGLCanvas
            className="hero-canvas"
            config={{
              ...HYPERGL_PRESETS[4].config,
              effect: "liquid",
              palette: ["#dbeafe", "#8b5cf6", "#2563eb"],
              speed: 0.28,
              intensity: 0.52,
              density: 0.38,
              scale: 0.36,
              distortion: 0.42,
              bloom: 0.18,
              grain: 0.02,
            }}
            label="Hyzr GL animated hero background"
          />
          <div className="hero-scrim" />
          <div className="hero-content">
            <div className="hero-logo" aria-hidden="true">
              <Sparkles size={40} />
              <Terminal size={28} />
            </div>
            <h1>Hyzr GL</h1>
            <p>
              A customizable WebGL effects library for polished browser visuals, shader learning,
              and reusable React, Next.js, and vanilla JavaScript code.
            </p>
            <div className="hero-actions">
              <Link className="primary-button large" href="/docs/examples/preset-gallery">
                Explore Presets
                <ArrowRight size={18} />
              </Link>
              <Link className="secondary-button large" href="/docs/examples/setting-playground">
                Open Playground
              </Link>
            </div>
            <p className="hero-note">Built for React, Next.js, and vanilla JavaScript.</p>
          </div>
          <div className="hero-window" aria-hidden="true">
            <span />
            <span />
            <span />
            <strong>Hyzr GL scene export</strong>
            <code>effect/liquid-field</code>
          </div>
        </section>

        <section className="home-band">
          <div className="section-heading">
            <p className="eyebrow">System</p>
            <h2>A library with visible proof.</h2>
            <p>
              The repo is structured around a typed renderer, reusable presets, live examples,
              framework docs, and a public research trail.
            </p>
          </div>
          <div className="feature-grid">
            <FeatureCard
              icon={<GalleryHorizontalEnd size={20} />}
              title="Preset Catalog"
              text="Twelve built-in presets show distinct looks that users can copy, inspect, and customize."
            />
            <FeatureCard
              icon={<Code2 size={20} />}
              title="Typed Library"
              text="Use the same config, renderer, React hook, and control metadata across every example."
            />
            <FeatureCard
              icon={<BookOpen size={20} />}
              title="Live Docs"
              text="Interactive docs render real WebGL canvases for presets, effects, and settings."
            />
            <FeatureCard
              icon={<Settings2 size={20} />}
              title="Control Schema"
              text="Every major setting has a typed path, range, group, and practical description."
            />
            <FeatureCard
              icon={<Box size={20} />}
              title="3D Direction"
              text="Future milestones can add Three.js interop, meshes, cameras, and procedural materials."
            />
          </div>
        </section>
      </main>
    </>
  );
}

function FeatureCard({
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
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}
