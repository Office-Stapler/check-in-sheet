import { useEffect, useState } from 'react';
import {
  removeToast,
  subscribeToasts,
  type Toast,
} from '../../toast/toastStore';
import './ToastHost.css';

export function ToastHost() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => subscribeToasts(setToasts), []);

  if (toasts.length === 0) {return null;}

  return (
    <div className="toast-host no-print" aria-live="polite">
      {toasts.map((toast) => (
        <div className="toast" key={toast.id} role="status">
          <span className="toast-message">{toast.message}</span>
          {toast.action && (
            <button
              type="button"
              className="toast-action"
              onClick={() => {
                toast.action?.onClick();
                removeToast(toast.id);
              }}
            >
              {toast.action.label}
            </button>
          )}
          <button
            type="button"
            className="toast-dismiss"
            onClick={() => removeToast(toast.id)}
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
