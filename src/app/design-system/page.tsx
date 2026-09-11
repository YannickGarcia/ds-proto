import type { Metadata } from "next";
import { DesignSystemPage } from "@/components/design-system/design-system-page";

export const metadata: Metadata = {
  title: "Design system — Proto",
  description:
    "Foundations, components and patterns behind the Proto interface.",
};

export default function Page() {
  return <DesignSystemPage />;
}
