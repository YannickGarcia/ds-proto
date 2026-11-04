import type { Metadata } from "next";
import { SignalsPage } from "@/components/signals/signals-page";

export const metadata: Metadata = { title: "Signals — Proto" };

export default function Page() {
  return <SignalsPage />;
}
