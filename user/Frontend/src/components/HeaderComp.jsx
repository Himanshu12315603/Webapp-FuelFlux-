import React, { useState } from 'react';
import LOGO from '../assets/LOGO.png';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // Lucide icons (or use any other)

const HeaderComp = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const NavItems = [
    { path: '/mainpage', label: 'Home' },
    { path: '/stations', label: 'Stations' },
    { path: '/bookings', label: 'Booking' },
    { path: '/pressure', label: 'Pressure' },
    { path: '/profile', label: 'Profile' },
  ];

  return (
    <div className='bg-black flex justify-between items-center p-4'>
      {/* Logo */}
      <div className='w-[190px] h-[65px]'>
        <img className='p-2' src={LOGO} alt='Logo' />
      </div>

      {/* Desktop Nav */}
      <div className='hidden md:flex flex-row gap-6'>
        {NavItems.map(({ path, label }) => (
          <Link
            key={path}
            to={path}
            className={`text-white font-inter ${
              location.pathname === path
                ? 'text-2xl underline decoration-[#F69454]'
                : 'text-2xl hover:underline decoration-[#F69454]'
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Hamburger Toggle */}
      <div className='md:hidden'>
        <button onClick={() => setIsOpen(!isOpen)} className='text-white'>
          {isOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className='absolute top-20 right-4 bg-black border border-gray-700 rounded-lg p-4 flex flex-col gap-4 z-50 md:hidden'>
          {NavItems.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setIsOpen(false)}
              className={`text-white font-inter ${
                location.pathname === path
                  ? 'text-xl underline decoration-[#F69454]'
                  : 'text-xl hover:underline decoration-[#F69454]'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default HeaderComp;
