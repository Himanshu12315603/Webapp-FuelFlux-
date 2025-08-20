import React from 'react';

export default function Button({ children, onClick, type = 'button', className = '' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition ${className}`}
    >
      {children}
    </button>
  );
}
