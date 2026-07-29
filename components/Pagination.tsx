export interface PaginationProps {
  /** 1-indexed current page. */
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

/** Extracted, standalone pager for any paginated list/table -- previously
 * this kind of prev/next control lived inline wherever a table needed one.
 * Renders nothing for a single page, since there's nothing to page
 * through. Behavior is a pure function of `page`/`pageCount`; the caller
 * owns the current page and the sliced data. */
export function Pagination({ page, pageCount, onPageChange }: PaginationProps) {
  if (pageCount <= 1) return null;

  return (
    <nav aria-label="Pagination" className="pagination">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        Previous
      </button>
      <span aria-live="polite">
        Page {page} of {pageCount}
      </span>
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= pageCount}
      >
        Next
      </button>
    </nav>
  );
}
