import type { Metadata } from "next";
import { IntegrationsListing } from "@/components/integrations/integrations-listing";

export const metadata: Metadata = {
  title: "Integrations — Proto",
  description: "Connect the sources Proto measures.",
};

export default function Page() {
  return <IntegrationsListing />;
}
