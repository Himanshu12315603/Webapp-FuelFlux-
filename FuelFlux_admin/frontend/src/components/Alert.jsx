import React from 'react';

export default function Alert({ type = 'info', message }) {
  const color =
    type === 'success' ? 'bg-green-100 text-green-800 border-green-400' :
    type === 'error' ? 'bg-red-100 text-red-800 border-red-400' :
    'bg-blue-100 text-blue-800 border-blue-400';

  return (
    <div className={`border-l-4 p-4 mb-4 ${color} rounded`}>{message}</div>
  );
}
