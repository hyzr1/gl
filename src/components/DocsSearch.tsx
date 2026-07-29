"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, FileText, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { docPages } from "@/content/docs";

export function DocsSearch() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const ranked = docPages
      .map((page) => {
        const haystack = [
          page.title,
          page.category,
          page.description,
          page.slug,
          ...page.sections.flatMap((section) => [
            section.title,
            ...section.body,
            ...(section.items ?? []),
          ]),
        ]
          .join(" ")
          .toLowerCase();
        const titleMatch = page.title.toLowerCase().includes(normalized);
        const categoryMatch = page.category.toLowerCase().includes(normalized);
        const bodyMatch = normalized.length === 0 || haystack.includes(normalized);
        const score = titleMatch ? 3 : categoryMatch ? 2 : bodyMatch ? 1 : 0;
        return { page, score };
      })
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score || a.page.title.localeCompare(b.page.title));

    return ranked.slice(0, 9).map((result) => result.page);
  }, [query]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }

      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) return;
    setActiveIndex(0);
    window.setTimeout(() => inputRef.current?.focus(), 20);
  }, [open, query]);

  function submitActive() {
    const page = results[activeIndex];
    if (!page) return;
    setOpen(false);
    router.push(`/docs/${page.slug}`);
  }

  return (
    <>
      <button className="docs-search-trigger" onClick={() => setOpen(true)} type="button">
        <Search size={15} />
        <span>Search documentation...</span>
        <kbd>Ctrl K</kbd>
      </button>

      {open ? (
        <div className="search-dialog-backdrop" role="presentation">
          <div
            aria-label="Search documentation"
            aria-modal="true"
            className="search-dialog"
            role="dialog"
          >
            <div className="search-dialog-input">
              <Search size={18} />
              <input
                ref={inputRef}
                value={query}
                placeholder="Search docs, examples, APIs..."
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    setActiveIndex((current) => Math.min(current + 1, results.length - 1));
                  }
                  if (event.key === "ArrowUp") {
                    event.preventDefault();
                    setActiveIndex((current) => Math.max(current - 1, 0));
                  }
                  if (event.key === "Enter") {
                    event.preventDefault();
                    submitActive();
                  }
                }}
              />
              <button aria-label="Close search" onClick={() => setOpen(false)} type="button">
                <X size={16} />
              </button>
            </div>

            <div className="search-results">
              <p>{query.trim() ? "Results" : "Suggested pages"}</p>
              {results.length ? (
                results.map((page, index) => (
                  <Link
                    className={index === activeIndex ? "is-active" : ""}
                    href={`/docs/${page.slug}`}
                    key={page.slug}
                    onClick={() => setOpen(false)}
                  >
                    <FileText size={17} />
                    <span>
                      <strong>{page.title}</strong>
                      <small>{page.category} / {page.description}</small>
                    </span>
                    <ArrowRight size={16} />
                  </Link>
                ))
              ) : (
                <div className="search-empty">
                  <strong>No matching docs</strong>
                  <span>Try "config", "shader", "preset", "playground", or "Next.js".</span>
                </div>
              )}
            </div>

            <div className="search-dialog-footer">
              <span><kbd>Enter</kbd> Open</span>
              <span><kbd>Esc</kbd> Close</span>
              <span><kbd>↑</kbd><kbd>↓</kbd> Move</span>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
