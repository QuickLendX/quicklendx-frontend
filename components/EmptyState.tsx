export interface EmptyStateProps {
  title: string;
  description?: string;
}

/** Generic placeholder for any list view with zero items, so a missing
 * dataset never just renders a blank screen. */
export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div role="status" className="empty-state">
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
  );
}
