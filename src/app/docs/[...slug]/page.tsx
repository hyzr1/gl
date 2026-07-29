import { notFound } from "next/navigation";
import { DocsShell } from "@/components/DocsShell";
import { SiteHeader } from "@/components/SiteHeader";
import { docPages, getDocPage } from "@/content/docs";

export function generateStaticParams() {
  return docPages.map((page) => ({ slug: page.slug.split("/") }));
}

export default async function DocsArticlePage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const page = getDocPage(slug.join("/"));

  if (!page) notFound();

  return (
    <>
      <SiteHeader />
      <DocsShell page={page} />
    </>
  );
}
