import type { Metadata } from "next";
import { SyncLog } from "@/components/integrations/sync-log";

export const metadata: Metadata = { title: "Sync log — Pensero" };

export default function Page() {
  return <SyncLog />;
}
