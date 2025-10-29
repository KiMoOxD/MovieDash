// Modal.jsx
import React from 'react';

export default function Modal({ isOpen, onClose, title, children, footer }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-700/5 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-lg mx-auto">
        <div className="flex justify-between items-center px-6 py-3">
          <h2 className="text-lg font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>
        <div className="px-6 py-4">
          {children}
        </div>
        {footer && (
          <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}