import Link from "next/link";
import { ArrowRight, Beaker, Boxes, Cpu, Orbit, ScanLine } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";

const milestones = [
  {
    icon: <Cpu size={19} />,
    title: "Renderer foundation",
    text: "Shader compilation, uniforms, pointer fields, animation loop, cleanup, and presets.",
  },
  {
    icon: <ScanLine size={19} />,
    title: "Multipass pipeline",
    text: "Framebuffers for bloom, trails, feedback, blur, masks, and post-processing chains.",
  },
  {
    icon: <Boxes size={19} />,
    title: "2D layer system",
    text: "Masks, vector-like SDF shapes, text layers, blend modes, and procedural materials.",
  },
  {
    icon: <Orbit size={19} />,
    title: "3D mode",
    text: "Three.js interop for meshes, cameras, lighting, orbit controls, and shader materials.",
  },
  {
    icon: <Beaker size={19} />,
    title: "Research publication",
    text: "Document experiments, failures, findings, benchmarks, and examples for the GitHub repo.",
  },
];

export default function ResearchPage() {
  return (
    <>
      <SiteHeader />
      <main className="content-page">
        <section className="page-hero compact">
          <p className="pill">Research</p>
          <h1>Research</h1>
          <p>
            The goal is not only to ship a nice site. It is to prove growth in graphics
            programming, API design, frontend systems, and technical writing.
          </p>
          <Link className="primary-button large" href="/docs/roadmap">
            Open roadmap
            <ArrowRight size={18} />
          </Link>
        </section>

        <section className="timeline">
          {milestones.map((milestone, index) => (
            <article className="timeline-item" key={milestone.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div className="feature-icon">{milestone.icon}</div>
              <div>
                <h2>{milestone.title}</h2>
                <p>{milestone.text}</p>
              </div>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}
