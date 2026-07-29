"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GitBranch, Moon, Sparkles, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { DocsSearch } from "@/components/DocsSearch";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/docs", label: "Docs" },
  { href: "/library", label: "Library" },
  { href: "/docs/examples/preset-gallery", label: "Examples" },
  { href: "/research", label: "Research" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("hypergl-theme");
    const nextDark = stored ? stored === "dark" : false;
    setDark(nextDark);
    document.documentElement.classList.toggle("dark", nextDark);
  }, []);

  function toggleTheme() {
    setDark((current) => {
      const next = !current;
      document.documentElement.classList.toggle("dark", next);
      window.localStorage.setItem("hypergl-theme", next ? "dark" : "light");
      return next;
    });
  }

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link className="brand" href="/">
          <span className="brand-mark">
            <Sparkles size={16} strokeWidth={2.4} />
          </span>
          <span>Hyzr GL</span>
        </Link>

        <nav className="main-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              className={isActive(pathname, item.href) ? "is-active" : ""}
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <DocsSearch />
          <a
            aria-label="GitHub repository"
            className="icon-button"
            href="https://github.com/hyzr1/gl"
            rel="noreferrer"
            target="_blank"
            title="GitHub repository"
          >
            <GitBranch size={18} />
          </a>
          <button
            aria-label="Toggle theme"
            className="icon-button"
            onClick={toggleTheme}
            title="Toggle theme"
            type="button"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link className="primary-button" href="/docs/examples/preset-gallery">View Examples</Link>
        </div>
      </div>
    </header>
  );
}

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
