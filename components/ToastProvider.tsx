"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { log } from "@/lib/logger";

export interface Toast {
  id: string;
  message: string;
}

export type DismissReason = "manual" | "auto";

interface ToastContextValue {
  toasts: Toast[];
  showToast: (message: string) => void;
  dismissToast: (id: string, reason: DismissReason) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const dismissToast = useCallback((id: string, reason: DismissReason) => {
    setToasts((current) => {
      const existed = current.some((toast) => toast.id === id);
      if (existed) {
        // Log the id and dismiss reason only -- never the toast's message,
        // which may contain arbitrary (and possibly sensitive) UI text.
        log("info", "toast_dismissed", { toastId: id, reason });
      }
      return current.filter((toast) => toast.id !== id);
    });
  }, []);

  const showToast = useCallback((message: string) => {
    const id = `toast_${nextId.current++}`;
    setToasts((current) => [...current, { id, message }]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
      {children}
      <div aria-live="polite" aria-atomic="false" className="toast-region">
        {toasts.map((toast) => (
          <div key={toast.id} role="status" className="toast">
            <span>{toast.message}</span>
            <button
              type="button"
              onClick={() => dismissToast(toast.id, "manual")}
              aria-label="Dismiss"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}
