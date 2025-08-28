
import React, { useRef } from "react";

export type ToastKind = "success" | "error" | "info";
export interface ToastState { kind: ToastKind; message: string }

export function InlineToast({
  toast,
  onClose,
  duration = 3500,
}: {
  toast: ToastState | null;
  onClose: () => void;
  duration?: number;
}) {
  const timerRef = useRef<number | null>(null);

  // Auto-cierre
  React.useEffect(() => {
    if (!toast) return;
    timerRef.current = window.setTimeout(onClose, duration);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [toast, duration, onClose]);

  // Paleta básica por tipo
  const styleByKind: Record<ToastKind, string> = {
    success:
      "bg-emerald-600/95 text-white ring-1 ring-emerald-300/50",
    error:
      "bg-red-600/95 text-white ring-1 ring-red-300/50",
    info:
      "bg-zinc-900/95 text-white ring-1 ring-white/10",
  };

  // Montado/no-montado para la transición
  const visible = !!toast;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed inset-x-0 bottom-4 z-[1000] flex justify-center px-4"
    >
      <div
        className={[
          "pointer-events-auto max-w-md w-full rounded-xl shadow-2xl px-4 py-3",
          "transition-all duration-300",
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
          toast ? styleByKind[toast.kind] : "bg-transparent",
        ].join(" ")}
        role="status"
      >
        <div className="flex items-start gap-3">
          {/* Icono simple por tipo (opcional) */}
          <span
            aria-hidden
            className="mt-0.5 inline-block h-5 w-5"
          >
            {toast?.kind === "success" ? "✅" : toast?.kind === "error" ? "❌" : "ℹ️"}
          </span>
          <p className="text-sm leading-5 flex-1">{toast?.message}</p>
          <button
            type="button"
            onClick={onClose}
            className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-md bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}