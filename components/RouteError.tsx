"use client";

export interface RouteErrorProps {
  message: string;
  onRetry: () => void;
}

/** Full-page fallback for unexpected route failures. Keeps the failure
 * visible to the user and offers one explicit recovery action. */
export function RouteError({ message, onRetry }: RouteErrorProps) {
  return (
    <section role="alert" className="empty-state">
      <h2>We could not load this page</h2>
      <p>{message}</p>
      <button type="button" className="btn btn-primary" onClick={onRetry}>
        Try again
      </button>
    </section>
  );
}
