import React from 'react';

export default function Loader() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="w-8 h-8 border-4 border-white border-t-black rounded-full animate-spin"></div>
    </div>
  );
}
