import { create } from "zustand";
import { nanoid } from "nanoid"

export interface ToastPayload {
  type: "success" | "error" | "info" | "warning";
  message: string;
  duration?: number;
}

interface Toast {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
  duration?: number;
  timerId: ReturnType<typeof setTimeout>;
}

interface ToastState {
  toasts: Toast[];
  addToast: (toast: ToastPayload) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  addToast: (toast: ToastPayload) => {
    const id = nanoid();

    const timerId = setTimeout(() => {
      set((state: ToastState) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, toast.duration ?? 8000);

    set((state: ToastState) => ({
      toasts: [...state.toasts, { ...toast, id, timerId }],
    }));
  },
  removeToast: (id: string) => {
    const toast = get().toasts.find((t) => t.id === id);
    if (toast) {
      clearTimeout(toast.timerId);
    }
    set((state: ToastState) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
}));
