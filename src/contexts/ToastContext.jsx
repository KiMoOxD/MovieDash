import React, { createContext, useContext, useState, useCallback } from 'react';
import ToastList from '../components/Toast';

const ToastContext = createContext(null);

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, options = {}) => {
    const id = Date.now() + Math.random();
    const toast = {
      id,
      message,
      type: options.type || 'error',
    };
    setToasts((t) => [toast, ...t]);

    const duration = typeof options.duration === 'number' ? options.duration : 5000;
    if (duration > 0) {
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), duration);
    }
    return id;
  }, []);

  const removeToast = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastList toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
}

export default ToastContext;
