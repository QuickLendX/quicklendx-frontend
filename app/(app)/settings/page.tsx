import dynamic from "next/dynamic";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";

// Code-split: SettingsPanel (and anything it later pulls in) ships in its
// own chunk instead of the shared route-group bundle, so /dashboard and
// /portfolio don't pay for settings-only code on every visit.
const SettingsPanel = dynamic(
  () => import("@/components/SettingsPanel").then((mod) => mod.SettingsPanel),
  { loading: () => <LoadingSkeleton rows={2} /> }
);

export default function SettingsPage() {
  return (
    <>
      <h1>Settings</h1>
      <SettingsPanel />
    </>
  );
}
