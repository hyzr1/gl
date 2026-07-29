import Link from "next/link";
import { ArrowRight, BookOpen, Code2, GalleryHorizontalEnd, Route } from "lucide-react";
import { DocsFooter } from "@/components/DocsShell";
import { SiteHeader } from "@/components/SiteHeader";
import { docPages, docsNav } from "@/content/docs";

export default function DocsPage() {
  const exampleCount = docPages.reduce(
    (total, page) => total + page.sections.reduce((sum, section) => sum + (section.examples?.length ?? 0), 0),
    0,
  );

  return (
    <>
      <SiteHeader />
      <main className="docs-index">
        <section className="page-hero compact">
          <p className="pill">Documentation</p>
          <h1>Hyzr GL Docs</h1>
          <p>
            A detailed manual for the renderer, config API, live examples, effects, framework
            integrations, shader concepts, research notes, and open-source plan.
          </p>
          <div className="docs-stats" aria-label="Documentation scale">
            <span><strong>{docPages.length}</strong> curated pages</span>
            <span><strong>{docsNav.length}</strong> sections</span>
            <span><strong>{exampleCount}</strong> practical examples</span>
          </div>
          <Link className="primary-button large" href="/docs/getting-started/installation">
            Start with installation
            <ArrowRight size={18} />
          </Link>
        </section>

        <section className="doc-card-grid">
          <DocIndexCard
            icon={<Route size={20} />}
            title="Getting Started"
            href="/docs/getting-started/installation"
            text="Install locally, understand the file structure, and render your first scene."
          />
          <DocIndexCard
            icon={<GalleryHorizontalEnd size={20} />}
            title="Live Examples"
            href="/docs/examples/preset-gallery"
            text="Use live canvases to compare presets, effects, and setting changes."
          />
          <DocIndexCard
            icon={<Code2 size={20} />}
            title="Library API"
            href="/docs/api/config"
            text="Study the typed config, renderer lifecycle, presets, hook, and control metadata."
          />
          <DocIndexCard
            icon={<BookOpen size={20} />}
            title="Research Notes"
            href="/docs/research/webgl-pipeline"
            text="Study WebGL pipeline concepts and future renderer milestones."
          />
        </section>

        <section className="docs-directory">
          {docsNav.map((group) => (
            <div key={group.label}>
              <h2>{group.label}</h2>
              <p>{group.description}</p>
              {group.items.map((item) => (
                <Link href={`/docs/${item.slug}`} key={item.slug}>
                  {item.title}
                  <ArrowRight size={15} />
                </Link>
              ))}
            </div>
          ))}
        </section>
      </main>
      <DocsFooter />
    </>
  );
}

function DocIndexCard({
  icon,
  title,
  text,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  href: string;
}) {
  return (
    <Link className="doc-index-card" href={href}>
      <div className="feature-icon">{icon}</div>
      <h2>{title}</h2>
      <p>{text}</p>
    </Link>
  );
}
