import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChevronRight,
  CircleHelp,
  ExternalLink,
  GitBranch,
  ScrollText,
  Smile,
} from "lucide-react";
import { CodeBlock } from "@/components/CodeBlock";
import { DocsLiveDemo } from "@/components/DocsLiveDemo";
import { docsNav, getDocNeighbors, getDocPage, type DocPage } from "@/content/docs";

export function DocsShell({ page }: { page: DocPage }) {
  const neighbors = getDocNeighbors(page.slug);

  return (
    <>
      <main className="docs-layout" id="top">
        <aside className="docs-sidebar" aria-label="Documentation sections">
          <div className="docs-side-card">
            <BookOpen size={18} />
            <div>
              <strong>Hyzr GL Manual</strong>
              <span>{page.level} level documentation</span>
            </div>
          </div>
          {docsNav.map((group) => (
            <div className="docs-nav-group" key={group.label}>
              <p>{group.label}</p>
              <span>{group.description}</span>
              {group.items.map((item) => (
                <Link
                  className={item.slug === page.slug ? "is-active" : ""}
                  href={`/docs/${item.slug}`}
                  key={item.slug}
                >
                  {item.title}
                  {item.badge ? <em>{item.badge}</em> : null}
                </Link>
              ))}
            </div>
          ))}
        </aside>

        <article className="docs-article">
          <div className="breadcrumb">
            <Link href="/docs">Docs</Link>
            <ChevronRight size={14} />
            <span>{page.category}</span>
            <ChevronRight size={14} />
            {page.title}
          </div>
          <header className="docs-heading">
            <p className="eyebrow">{page.category}</p>
            <h1>{page.title}</h1>
            <p>{page.description}</p>
            <div className="docs-meta-row">
              <span>{page.level}</span>
              <span>{page.sections.length} sections</span>
              <span>{page.related?.length ?? 0} related pages</span>
            </div>
          </header>

          {page.sections.map((section) => (
            <section className="docs-section" id={section.id} key={section.id}>
              <h2>{section.title}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.callout ? <div className="callout">{section.callout}</div> : null}
              {section.items ? (
                <ul className="docs-list">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
              {section.code ? (
                <CodeBlock code={section.code} language={section.language ?? "ts"} />
              ) : null}
              {section.demo ? <DocsLiveDemo kind={section.demo} /> : null}
              {section.examples?.map((example) => (
                <CodeBlock
                  code={example.code}
                  description={example.description}
                  key={`${section.id}-${example.title}`}
                  language={example.language}
                  title={example.title}
                />
              ))}
            </section>
          ))}

          {page.related?.length ? (
            <section className="related-docs" aria-label="Related documentation">
              <h2>Related documentation</h2>
              <div>
                {page.related.map((slug) => (
                  <Link href={`/docs/${slug}`} key={slug}>
                    <ScrollText size={16} />
                    {titleFromSlug(slug)}
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          <nav className="docs-pager" aria-label="Documentation pagination">
            {neighbors.previous ? (
              <Link href={`/docs/${neighbors.previous.slug}`}>
                <ArrowLeft size={18} />
                <span>
                  Previous
                  <strong>{neighbors.previous.title}</strong>
                </span>
              </Link>
            ) : <span />}
            {neighbors.next ? (
              <Link href={`/docs/${neighbors.next.slug}`}>
                <span>
                  Next
                  <strong>{neighbors.next.title}</strong>
                </span>
                <ArrowRight size={18} />
              </Link>
            ) : <span />}
          </nav>

          <section className="docs-feedback">
            <span>Was this page useful?</span>
            <button type="button"><Smile size={17} />Yes</button>
            <button type="button"><CircleHelp size={17} />Needs work</button>
          </section>
        </article>

        <aside className="docs-toc" aria-label="On this page">
          <p>On This Page</p>
          {page.sections.map((section) => (
            <a href={`#${section.id}`} key={section.id}>
              {section.title}
            </a>
          ))}
          <div className="docs-toc-actions">
            <a href="#top">
              <ArrowRight size={14} />
              Scroll to top
            </a>
            <a href="https://github.com/hyzr1/gl" rel="noreferrer" target="_blank">
              <GitBranch size={14} />
              Edit on GitHub
            </a>
            <a href="/research">
              <ExternalLink size={14} />
              Research log
            </a>
          </div>
        </aside>
      </main>
      <DocsFooter />
    </>
  );
}

export function DocsFooter() {
  return (
    <footer className="docs-footer">
      <div className="footer-brand">
        <strong>Hyzr GL</strong>
        <p>A customizable WebGL effects library with live docs for browser graphics.</p>
      </div>
      <div>
        <h2>Resources</h2>
        <Link href="/docs/getting-started/installation">Installation</Link>
        <Link href="/docs/examples/preset-gallery">Preset Gallery</Link>
        <Link href="/docs/api/config">Config API</Link>
        <Link href="/docs/examples/hero-background">Examples</Link>
      </div>
      <div>
        <h2>Research</h2>
        <Link href="/docs/research/roadmap">Roadmap</Link>
        <Link href="/docs/research/webgl-pipeline">WebGL Pipeline</Link>
        <Link href="/docs/research/benchmarks">Benchmarks</Link>
        <Link href="/docs/rendering/performance">Performance</Link>
      </div>
      <div>
        <h2>Subscribe to updates</h2>
        <p>Track new demos, shader notes, and library milestones.</p>
        <label>
          <input placeholder="you@example.com" />
          <button type="button">Subscribe</button>
        </label>
      </div>
    </footer>
  );
}

function titleFromSlug(slug: string) {
  return getDocPage(slug)?.title ?? slug
    .split("/")
    .at(-1)
    ?.split("-")
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ") ?? slug;
}
