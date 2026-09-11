import type { Metadata } from "next";
import { RepositorySyncSettings } from "@/components/integrations/repository-sync-settings";

export const metadata: Metadata = { title: "Repository sync — Proto" };

export default function Page() {
  return <RepositorySyncSettings />;
}
