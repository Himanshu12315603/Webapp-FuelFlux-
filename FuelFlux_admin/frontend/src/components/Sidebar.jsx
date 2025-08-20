import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const navItems = [
    { label: 'Dashboard', to: '/admin/dashboard', icon: (
      <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="13" width="7" height="8" fill="#1abc9c"/><rect x="14" y="3" width="7" height="18" fill="#1abc9c"/></svg>
    ), color: 'bg-orange-500 text-white' },
    { label: 'Stations', to: '/admin/station', icon: (
      <svg className="w-6 h-6 mr-2 text-pink-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a2 2 0 00-2 2v2H5a2 2 0 00-2 2v8a2 2 0 002 2h10a2 2 0 002-2v-8a2 2 0 00-2-2h-3V4a2 2 0 00-2-2zm0 2h4a1 1 0 011 1v2H5V5a1 1 0 011-1h4zm-6 4h12v8a1 1 0 01-1 1H5a1 1 0 01-1-1V6zm2 2a1 1 0 100 2 1 1 0 000-2z" /></svg>
    ) },
    { label: 'Employees', to: '/admin/employee', icon: (
      <svg className="w-6 h-6 mr-2 text-purple-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 10a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 1114 0H3z" /></svg>
    ) },
    { label: 'Bookings', to: '/admin/booking', icon: (
      <svg className="w-6 h-6 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path d="M6 2a1 1 0 00-1 1v1H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H8V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 2v1h8V4H6z" /></svg>
    ) },
    { label: 'Notifications', to: '/admin/notifications', icon: (
      <svg className="w-6 h-6 mr-2 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 016 6v3.586l.707.707A1 1 0 0116 14H4a1 1 0 01-.707-1.707L4 11.586V8a6 6 0 016-6zm-1 13h2a2 2 0 11-4 0h2z" /></svg>
    ) },
    { label: 'Nozzles', to: '/admin/nozzle', icon: (
      <svg className="w-6 h-6 mr-2 text-pink-600" fill="currentColor" viewBox="0 0 20 20"><path d="M13 7H7v6h6V7z" /></svg>
    ) },
    { label: 'Feedback', to: '/admin/feedback', icon: (
      <svg className="w-6 h-6 mr-2 text-orange-400" fill="currentColor" viewBox="0 0 20 20"><path d="M18 13V7a2 2 0 00-2-2H4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2z" /></svg>
    ) },
  ];
  // Sidebar content
  const sidebarContent = (
    <div className="h-full w-64 bg-black flex flex-col py-4 px-2">
      <div className="flex justify-center items-center mb-8 px-2">
        <img 
          src="/src/assets/LOGO.png" 
          alt="FuelFlux Logo" 
          className="h-12 w-auto object-contain"
        />
      </div>
      <nav className="flex-1">
        {navItems.map(item => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) => `flex items-center px-4 py-3 mb-2 rounded-lg font-semibold text-lg transition-colors duration-200 hover:bg-orange-700 hover:text-white ${isActive ? 'bg-orange-500 text-white' : 'text-white'}`}
            onClick={() => setOpen(false)}
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="flex-grow"></div>
      <div className="text-xs text-gray-400 px-2">Admin-Main Screen</div>
    </div>
  );

  return (
    <>
      {/* Hamburger for mobile */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-black text-white p-2 rounded focus:outline-none"
        onClick={() => setOpen(true)}
        aria-label="Open sidebar"
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>
      {/* Sidebar overlay for mobile */}
      {open && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setOpen(false)}></div>
          <div className="fixed top-0 left-0 h-full w-64 bg-black z-50 shadow-xl animate-slide-in">
            <button className="absolute top-4 right-4 text-white text-2xl" onClick={() => setOpen(false)} aria-label="Close sidebar">&times;</button>
            {sidebarContent}
          </div>
        </>
      )}
      {/* Sidebar for desktop */}
      <div className="hidden lg:block fixed top-0 left-0 h-full w-64 z-40">
        {sidebarContent}
      </div>
    </>
  );
}

// Add this to your tailwind.config.js for animation:
// theme: {
//   extend: {
//     keyframes: {
//       'slide-in': {
//         '0%': { transform: 'translateX(-100%)' },
//         '100%': { transform: 'translateX(0)' },
//       },
//     },
//     animation: {
//       'slide-in': 'slide-in 0.2s ease-out',
//     },
//   },
// },

