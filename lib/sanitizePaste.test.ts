import { describe, it, expect, vi } from "vitest";
import { getPlainTextFromPaste, createPlainTextPasteHandler } from "./sanitizePaste";

function makePasteEvent(opts: {
  plainText?: string;
  value: string;
  selectionStart: number;
  selectionEnd: number;
}) {
  const clipboardData = {
    getData: (type: string) => (type === "text/plain" ? (opts.plainText ?? "") : ""),
  };
  const target = {
    value: opts.value,
    selectionStart: opts.selectionStart,
    selectionEnd: opts.selectionEnd,
  } as HTMLTextAreaElement;

  return {
    preventDefault: vi.fn(),
    clipboardData,
    currentTarget: target,
  } as unknown as React.ClipboardEvent<HTMLTextAreaElement>;
}

describe("getPlainTextFromPaste", () => {
  it("returns the text/plain payload", () => {
    const event = makePasteEvent({ plainText: "hello", value: "", selectionStart: 0, selectionEnd: 0 });
    expect(getPlainTextFromPaste(event)).toBe("hello");
  });

  it("never reads text/html -- only text/plain is ever consulted", () => {
    const event = {
      clipboardData: {
        getData: (type: string) => (type === "text/html" ? "<b>evil</b>" : ""),
      },
    } as unknown as React.ClipboardEvent<HTMLElement>;
    expect(getPlainTextFromPaste(event)).toBe("");
  });

  it("returns an empty string when there is no clipboard data", () => {
    const event = { clipboardData: null } as unknown as React.ClipboardEvent<HTMLElement>;
    expect(getPlainTextFromPaste(event)).toBe("");
  });
});

describe("createPlainTextPasteHandler", () => {
  it("prevents the default paste", () => {
    const onText = vi.fn();
    const handler = createPlainTextPasteHandler(onText);
    const event = makePasteEvent({ plainText: "x", value: "", selectionStart: 0, selectionEnd: 0 });

    handler(event);

    expect(event.preventDefault).toHaveBeenCalledTimes(1);
  });

  it("splices the pasted plain text in at the selection, discarding any HTML", () => {
    const onText = vi.fn();
    const handler = createPlainTextPasteHandler(onText);
    // "Hello  world" with the cursor between the two spaces (selection empty)
    const event = makePasteEvent({
      plainText: "there",
      value: "Hello  world",
      selectionStart: 6,
      selectionEnd: 6,
    });

    handler(event);

    expect(onText).toHaveBeenCalledWith("Hello there world");
  });

  it("replaces an existing selection with the pasted text", () => {
    const onText = vi.fn();
    const handler = createPlainTextPasteHandler(onText);
    // "Hello world", selecting "world" (indices 6-11)
    const event = makePasteEvent({
      plainText: "there",
      value: "Hello world",
      selectionStart: 6,
      selectionEnd: 11,
    });

    handler(event);

    expect(onText).toHaveBeenCalledWith("Hello there");
  });
});
