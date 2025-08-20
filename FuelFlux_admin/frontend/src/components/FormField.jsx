import React from 'react';

export default function FormField({ label, type = 'text', value, onChange, name, placeholder, className = '', ...props }) {
  return (
    <div className={`mb-4 ${className}`}>
      {label && <label className="block mb-1 font-medium text-white" htmlFor={name}>{label}</label>}
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-black"
        {...props}
      />
    </div>
  );
}
