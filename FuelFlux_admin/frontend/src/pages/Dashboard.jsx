import React, { useEffect, useState } from 'react';
import { logout } from '../api/auth';
import Sidebar from '../components/Sidebar';
import { getCurrentUser } from '../api/auth';
import { fetchDashboardStats } from '../api/dashboard';
import { FiAlertCircle, FiCalendar, FiUsers, FiPackage, FiClock } from 'react-icons/fi';

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getCurrentUser().then(setCurrentUser);
    fetchDashboardStats()
      .then(data => {
        setDashboard(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load dashboard stats');
        setLoading(false);
      });
  }, []);

  // Stats card component
  const StatCard = ({ icon: Icon, title, value, color = 'blue' }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 flex items-start">
      <div className={`p-3 rounded-lg bg-${color}-100 text-${color}-600 mr-4`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-4 sm:p-6 md:p-8 w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="text-center sm:text-left w-full sm:w-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
            {currentUser && (
              <p className="text-sm text-gray-500 mt-1">
                Welcome back, <span className="font-medium text-orange-600">
                  {currentUser.username || (currentUser.email ? currentUser.email.split('@')[0] : 'User')}
                </span>
              </p>
            )}
          </div>
          <button 
            onClick={logout}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
          >
            Logout
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 bg-orange-200 rounded-full mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-3 bg-gray-100 rounded w-24"></div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiAlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : dashboard && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard 
                icon={FiPackage} 
                title="Total Stations" 
                value={dashboard.totalStations} 
                color="orange" 
              />
              <StatCard 
                icon={FiUsers} 
                title="Total Users" 
                value={dashboard.totalUsers} 
                color="blue" 
              />
              <StatCard 
                icon={FiCalendar} 
                title="Today's Bookings" 
                value={dashboard.todaysBookings} 
                color="green" 
              />
              <StatCard 
                icon={FiAlertCircle} 
                title="Active Alerts" 
                value={dashboard.activeAlerts} 
                color="red" 
              />
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Bookings */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
                </div>
                <div className="p-6">
                  {dashboard.recentBookings && dashboard.recentBookings.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                      {dashboard.recentBookings.map((b, idx) => (
                        <li key={idx} className="py-3">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                              <FiClock size={18} />
                            </div>
                            <div className="ml-4 flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {b.vehicle} <span className="text-gray-500">({b.fueltype})</span>
                              </p>
                              <p className="text-sm text-gray-500 truncate">
                                {b.location}
                              </p>
                              <div className="mt-1 flex items-center text-xs text-gray-500">
                                <span>{b.dateofbook}</span>
                                <span className="mx-1">•</span>
                                <span>By: {b.userid?.username || 'Unknown'}</span>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No recent bookings found</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Notifications */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
                </div>
                <div className="p-6">
                  {dashboard.latestNotification ? (
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <FiAlertCircle className="h-5 w-5 text-blue-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-blue-700">{dashboard.latestNotification}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No new notifications</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

      </main>
    </div>
  );
}