import { useState, useEffect } from 'react';
import { toastManager, Toast } from '../lib/notifications/toast';

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const unsubscribe = toastManager.subscribe(setToasts);
    return unsubscribe;
  }, []);

  const getToastColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-success text-white';
      case 'error':
        return 'bg-error text-white';
      case 'warning':
        return 'bg-warning text-white';
      case 'info':
      default:
        return 'bg-primary text-white';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${getToastColor(toast.type)} px-4 py-3 rounded-lg shadow-lg animate-slide-in pointer-events-auto`}
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium">{toast.message}</p>
            <button
              onClick={() => toastManager.dismiss(toast.id)}
              className="text-lg leading-none opacity-70 hover:opacity-100 transition"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
