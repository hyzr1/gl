"use client";

import { useMemo, useState } from "react";
import { Check, Copy, Terminal } from "lucide-react";
import Prism from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-css";
import "prismjs/components/prism-json";

export function CodeBlock({
  code,
  language = "ts",
  title,
  description,
}: {
  code: string;
  language?: string;
  title?: string;
  description?: string;
}) {
  const [copied, setCopied] = useState(false);
  const highlighted = useMemo(() => highlightCode(code, language), [code, language]);

  async function copyCode() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div className="code-card">
      <div className="code-toolbar">
        <div>
          <Terminal size={15} />
          <span>{title ?? labelFor(language)}</span>
        </div>
        <button aria-label="Copy code" className="code-copy" onClick={copyCode} type="button">
          <span>{language}</span>
          {copied ? <Check size={15} /> : <Copy size={15} />}
        </button>
      </div>
      {description ? <p className="code-description">{description}</p> : null}
      <pre className={`code-block language-${grammarFor(language)}`}>
        <code dangerouslySetInnerHTML={{ __html: highlighted }} />
      </pre>
    </div>
  );
}

function highlightCode(code: string, language: string) {
  const grammarName = grammarFor(language);
  const grammar = Prism.languages[grammarName] ?? Prism.languages.javascript;
  const highlighted = Prism.highlight(code.trimEnd(), grammar, grammarName);
  return highlighted
    .split("\n")
    .map((line, index) => `<span class="code-line" data-line="${index + 1}">${line || " "}</span>`)
    .join("\n");
}

function grammarFor(language: string) {
  if (language === "ts") return "typescript";
  if (language === "tsx") return "tsx";
  if (language === "js") return "javascript";
  if (language === "bash") return "bash";
  if (language === "glsl") return "clike";
  if (language === "json") return "json";
  if (language === "css") return "css";
  return "typescript";
}

function labelFor(language: string) {
  if (language === "bash") return "Terminal";
  if (language === "json") return "JSON";
  if (language === "glsl") return "Fragment shader";
  if (language === "css") return "CSS";
  if (language === "tsx") return "React component";
  return "Code";
}
