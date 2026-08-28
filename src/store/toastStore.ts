import { create } from "zustand";

export type ToastVariant = "default" | "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  title: string;
  body?: string;
  variant: ToastVariant;
  duration: number;
  action?: { label: string; onClick: () => void };
}

interface ToastStore {
  toasts: Toast[];
  push: (toast: Omit<Toast, "id">) => string;
  dismiss: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  push: (toast) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    set(s => ({ toasts: [...s.toasts, { ...toast, id }] }));
    if (toast.duration > 0) {
      setTimeout(() => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })), toast.duration);
    }
    return id;
  },
  dismiss: (id) => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })),
}));

/** Convenience helper — use outside React components too */
export const toast = {
  success: (title: string, body?: string, action?: Toast["action"]) =>
    useToastStore.getState().push({ title, body, variant: "success", duration: 4000, action }),
  error: (title: string, body?: string) =>
    useToastStore.getState().push({ title, body, variant: "error", duration: 6000 }),
  warning: (title: string, body?: string) =>
    useToastStore.getState().push({ title, body, variant: "warning", duration: 5000 }),
  info: (title: string, body?: string, action?: Toast["action"]) =>
    useToastStore.getState().push({ title, body, variant: "info", duration: 4500, action }),
  show: (t: Omit<Toast, "id">) => useToastStore.getState().push(t),
};
