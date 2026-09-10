import type { Metadata } from "next";
import { IntegrationsListing } from "@/components/integrations/integrations-listing";

export const metadata: Metadata = {
  title: "Integrations — Pensero",
  description: "Connect the sources Pensero measures.",
};

export default function Page() {
  return <IntegrationsListing />;
}
