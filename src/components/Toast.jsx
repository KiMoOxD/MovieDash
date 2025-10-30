import React from 'react';

function ToastItem({ toast, onClose }) {
  const base = 'max-w-sm w-full shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden';
  const color = toast.type === 'success' ? 'bg-white border-l-4 border-emerald-500' : 'bg-white border-l-4 border-red-500';

  return (
    <div className={`${base} ${color} mb-3`}>
      <div className="p-3">
        <div className="flex items-start">
          <div className="flex-1 w-0">
            <p className="text-sm font-medium text-gray-900">{toast.type === 'success' ? 'Success' : 'Error'}</p>
            <p className="mt-1 text-sm text-gray-700">{toast.message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button onClick={() => onClose(toast.id)} className="inline-flex text-gray-400 hover:text-gray-600">
              ×
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ToastList({ toasts = [], onClose = () => {} }) {
  return (
    <div aria-live="assertive" className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 z-50">
      <div className="w-full flex flex-col items-end space-y-4">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={onClose} />
        ))}
      </div>
    </div>
  );
}
