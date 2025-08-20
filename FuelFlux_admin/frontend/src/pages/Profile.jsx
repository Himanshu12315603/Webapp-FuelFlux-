import React from 'react';
import Sidebar from '../components/Sidebar';
import { deleteOwnProfile } from '../api/user';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const navigate = useNavigate();
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await deleteOwnProfile();
        // Clear tokens and redirect to login/home
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        navigate('/login');
      } catch (err) {
        alert('Failed to delete account: ' + err.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-4 sm:p-8 flex flex-col items-center justify-start w-full">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-8">Profile Settings</h1>
        {/* Add more profile info here if needed */}
        <button
          onClick={handleDelete}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold shadow transition mt-8"
        >
          Delete My Account
        </button>
      </main>
    </div>
  );
}
