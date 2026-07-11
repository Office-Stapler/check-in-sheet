export type ToastAction = {
  label: string
  onClick: () => void
}

export type ToastInput = {
  message: string
  action?: ToastAction
  /** Auto-dismiss in ms. Use 0 to keep until dismissed. Default 6000. */
  duration?: number
}

export type Toast = ToastInput & {
  id: string
}

type Listener = (toasts: Toast[]) => void

let toasts: Toast[] = [];
const listeners = new Set<Listener>();
const timers = new Map<string, ReturnType<typeof setTimeout>>();

function emit() {
  for (const listener of listeners) {
    listener(toasts);
  }
}

export function subscribeToasts(listener: Listener): () => void {
  listeners.add(listener);
  listener(toasts);
  return () => {
    listeners.delete(listener);
  };
}

export function removeToast(id: string) {
  const timer = timers.get(id);
  if (timer != null) {
    clearTimeout(timer);
    timers.delete(id);
  }
  const next = toasts.filter((t) => t.id !== id);
  if (next.length === toasts.length) {return;}
  toasts = next;
  emit();
}

export function addToast(input: ToastInput): string {
  const id = crypto.randomUUID();
  const toast: Toast = { ...input, id };
  toasts = [...toasts, toast];
  emit();

  const duration = input.duration ?? 6000;
  if (duration > 0) {
    timers.set(
      id,
      setTimeout(() => {
        removeToast(id);
      }, duration),
    );
  }

  return id;
}
