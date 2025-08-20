import React from 'react';
import { Link } from 'react-router-dom';
import { FaTachometerAlt, FaUsers, FaGasPump, FaTools, FaBook, FaCommentDots, FaBell, FaSignInAlt } from 'react-icons/fa';

export default function Navbar() {
  return (
    <nav className="bg-black p-4 text-white flex justify-between items-center">
      <div className="font-bold text-lg flex items-center gap-2">
        <FaGasPump className="inline-block text-2xl" />
        <Link to="/" className="hover:underline">FuelFlux</Link>
      </div>
      <div className="flex items-center gap-4">
        <Link to="/dashboard" className="flex items-center gap-1 hover:underline">
          <FaTachometerAlt /> Dashboard
        </Link>
        <Link to="/employee" className="flex items-center gap-1 hover:underline">
          <FaUsers /> Employees
        </Link>
        <Link to="/station" className="flex items-center gap-1 hover:underline">
          <FaGasPump /> Stations
        </Link>
        <Link to="/nozzle" className="flex items-center gap-1 hover:underline">
          <FaTools /> Nozzles
        </Link>
        <Link to="/booking" className="flex items-center gap-1 hover:underline">
          <FaBook /> Bookings
        </Link>
        <Link to="/feedback" className="flex items-center gap-1 hover:underline">
          <FaCommentDots /> Feedback
        </Link>
        <Link to="/notifications" className="flex items-center gap-1 hover:underline">
          <FaBell /> Notifications
        </Link>
        <Link to="/" className="flex items-center gap-1 hover:underline">
          <FaSignInAlt /> Login
        </Link>
      </div>
    </nav>
  );
}
