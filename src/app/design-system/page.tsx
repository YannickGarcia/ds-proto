import type { Metadata } from "next";
import { DesignSystemPage } from "@/components/design-system/design-system-page";

export const metadata: Metadata = {
  title: "Design system — Pensero",
  description:
    "Foundations, components and patterns behind the Pensero interface.",
};

export default function Page() {
  return <DesignSystemPage />;
}
