import { createContext, useContext, useMemo, useRef, useState } from 'react';
import { CheckCircle2, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const counter = useRef(0);

  const value = useMemo(() => {
    function dismiss(id) {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }

    function showToast(message, type = 'success') {
      const id = ++counter.current;
      setToasts((current) => [...current, { id, message, type }]);
      setTimeout(() => dismiss(id), 3200);
    }

    return { showToast };
  }, []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-6 right-6 z-[60] flex w-[min(360px,calc(100vw-3rem))] flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex animate-fade-in items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-card-hover"
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
            ) : (
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" />
            )}
            <p className="flex-1 text-sm font-medium text-slate-700">{toast.message}</p>
            <button
              onClick={() =>
                setToasts((current) => current.filter((item) => item.id !== toast.id))
              }
              className="text-slate-400 transition hover:text-slate-600"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside ToastProvider');
  return context;
}
