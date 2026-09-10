import type { Metadata } from "next";
import { RepositoryDetail } from "@/components/integrations/repository-detail";

export const metadata: Metadata = { title: "Repository — Pensero" };

/** Params are async in this version of Next. */
export default async function Page({
  params,
}: {
  params: Promise<{ owner: string; repo: string }>;
}) {
  const { owner, repo } = await params;
  return <RepositoryDetail owner={owner} repo={repo} />;
}
