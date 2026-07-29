"use client";

import { RouteError } from "@/components/RouteError";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <RouteError message={error.message} onRetry={reset} />;
}
