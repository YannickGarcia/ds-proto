import type { Metadata } from "next";
import { GithubRepositories } from "@/components/integrations/github-repositories";

export const metadata: Metadata = { title: "GitHub repositories — Proto" };

export default function Page() {
  return <GithubRepositories />;
}
