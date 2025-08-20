import React from 'react';

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg p-6 min-w-[300px] relative">
        <button
          className="absolute top-2 right-2 text-black hover:text-red-500 text-xl"
          onClick={onClose}
        >
          &times;
        </button>
        {title && <h2 className="text-lg font-bold mb-4 text-black">{title}</h2>}
        <div>{children}</div>
      </div>
    </div>
  );
}
