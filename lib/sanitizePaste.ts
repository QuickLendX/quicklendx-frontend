import type { ClipboardEvent } from "react";

/**
 * Extracts plain text from a paste event's clipboard data, ignoring any
 * `text/html` payload entirely -- so pasting from a rich-text source (an
 * email client, a web page) can never inject markup into a plain-text
 * field. Falls back to `""` when the clipboard has no `text/plain` entry
 * (e.g. an image-only paste).
 */
export function getPlainTextFromPaste(event: ClipboardEvent<HTMLElement>): string {
  return event.clipboardData?.getData("text/plain") ?? "";
}

/**
 * React `onPaste` handler that forces plain-text-only pasting on the field
 * it's attached to: prevents the browser's default paste (which would
 * carry `text/html` when the source clipboard has it) and instead inserts
 * only the `text/plain` content at the current selection, then calls
 * `onText` with the resulting value so the caller can update its own
 * (controlled) state.
 *
 * Splices the pasted text in at `selectionStart`/`selectionEnd` (replacing
 * any existing selection) rather than appending or replacing the whole
 * value, matching what a native paste does.
 */
export function createPlainTextPasteHandler(
  onText: (value: string) => void
): (event: ClipboardEvent<HTMLTextAreaElement | HTMLInputElement>) => void {
  return (event) => {
    event.preventDefault();
    const text = getPlainTextFromPaste(event);
    const target = event.currentTarget;
    const start = target.selectionStart ?? target.value.length;
    const end = target.selectionEnd ?? target.value.length;

    const nextValue = target.value.slice(0, start) + text + target.value.slice(end);
    onText(nextValue);
  };
}
