import { AnimatePresence, motion } from "framer-motion";
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { useToastStore, type Toast } from "@/store/toastStore";

const icons: Record<Toast["variant"], React.ReactNode> = {
  success: <CheckCircle2 size={15} className="text-emerald-500" />,
  error:   <AlertCircle  size={15} className="text-red-500" />,
  warning: <AlertTriangle size={15} className="text-amber-500" />,
  info:    <Info size={15} className="text-blue-500" />,
  default: <Info size={15} className="text-muted-foreground" />,
};

const accents: Record<Toast["variant"], string> = {
  success: "border-l-emerald-500",
  error:   "border-l-red-500",
  warning: "border-l-amber-500",
  info:    "border-l-blue-500",
  default: "border-l-border",
};

export function ToastProvider() {
  const { toasts, dismiss } = useToastStore();

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 items-end pointer-events-none w-full max-w-sm">
      <AnimatePresence initial={false}>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 16, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.88, transition: { duration: 0.18 } }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={`pointer-events-auto w-full bg-card border border-border border-l-4 ${accents[t.variant]} rounded-xl shadow-xl shadow-black/10 px-4 py-3`}
          >
            <div className="flex items-start gap-3">
              <span className="shrink-0 mt-0.5">{icons[t.variant]}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground leading-tight">{t.title}</p>
                {t.body && <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{t.body}</p>}
                {t.action && (
                  <button
                    onClick={t.action.onClick}
                    className="mt-1.5 text-xs font-semibold text-primary hover:underline"
                  >
                    {t.action.label}
                  </button>
                )}
              </div>
              <button
                onClick={() => dismiss(t.id)}
                className="shrink-0 text-muted-foreground hover:text-foreground transition-colors -mt-0.5"
                aria-label="Dismiss"
              >
                <X size={13} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
