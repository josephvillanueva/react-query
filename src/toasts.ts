import { useSyncExternalStore } from "react";

export type ToastTone = "success" | "error" | "info";

export interface Toast {
  id: number;
  tone: ToastTone;
  message: string;
}

let toasts: Toast[] = [];
let nextId = 1;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function dismissToast(id: number) {
  toasts = toasts.filter((toast) => toast.id !== id);
  emit();
}

export function showToast(message: string, tone: ToastTone = "info") {
  const id = nextId++;
  toasts = [...toasts, { id, tone, message }].slice(-4);
  emit();
  setTimeout(() => dismissToast(id), tone === "error" ? 6000 : 3500);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useToasts() {
  return useSyncExternalStore(subscribe, () => toasts);
}
