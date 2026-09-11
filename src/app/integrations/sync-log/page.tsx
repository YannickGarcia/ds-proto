import type { Metadata } from "next";
import { SyncLog } from "@/components/integrations/sync-log";

export const metadata: Metadata = { title: "Sync log — Proto" };

export default function Page() {
  return <SyncLog />;
}
