import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Table from '../components/Table';
import { 
  FiCalendar, 
  FiCheckCircle, 
  FiClock, 
  FiXCircle, 
  FiSearch, 
  FiDownload,
  FiAlertCircle,
  FiLoader
} from 'react-icons/fi';
import { getCurrentUser } from '../api/auth';
import { fetchBookings } from '../api/booking';

const statIcons = {
  Bookings: <FiCalendar className="text-blue-500 text-2xl" />,
  Completed: <FiCheckCircle className="text-green-500 text-2xl" />,
  Pending: <FiClock className="text-orange-500 text-2xl" />,
  Cancelled: <FiXCircle className="text-red-500 text-2xl" />,
};

const tabs = [
  { label: 'All Bookings', key: 'all' },
  { label: "Today's Booking", key: 'today' },
  { label: 'Cancelled', key: 'cancelled' },
];

const columns = [
  { key: 'bookingId', label: 'Booking ID' },
  { key: 'customer', label: 'Customer' },
  { key: 'station', label: 'Station' },
  { key: 'fuelType', label: 'Fuel Type' },
  { key: 'dateTime', label: 'Date & Time' },
  { key: 'amount', label: 'Amount' },
];


export default function Booking() {
  const [activeTab, setActiveTab] = useState('today');
  const [search, setSearch] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stationId, setStationId] = useState('');
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, cancelled: 0 });
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState('');

  useEffect(() => {
    async function fetchUserStation() {
      setLoading(true);
      setError('');
      try {
        const user = await getCurrentUser();
        let sid = '';
        if (user?.stationId) sid = user.stationId;
        else if (user?.preferredStations?.length > 0) sid = user.preferredStations[0];
        setStationId(sid);
      } catch (err) {
        setError('Failed to load user station');
      } finally {
        setLoading(false);
      }
    }
    fetchUserStation();
  }, []);

  useEffect(() => {
    if (!stationId) return;
    async function loadStatsAndBookings() {
      setStatsLoading(true);
      setStatsError('');
      setLoading(true);
      setError('');
      try {
        // Fetch stats and bookings in parallel
        const [statsRes, bookingsRes] = await Promise.all([
          import('../api/booking').then(m => m.fetchBookingStats(stationId)),
          fetchBookings({ tab: activeTab, search, stationId })
        ]);
        setStats(statsRes);
        setBookings(bookingsRes.map(b => ({
          bookingId: b._id,
          customer: b.userid?.username || 'Unknown',
          station: b.station?.name || 'N/A',
          fuelType: b.fueltype,
          dateTime: `${new Date(b.dateofbook).toLocaleDateString()} ${b.time}`,
          amount: `₹${b.amount}`,
          status: b.status
        })));
      } catch (err) {
        setStatsError('Failed to load stats');
        setError('Failed to load bookings');
      } finally {
        setStatsLoading(false);
        setLoading(false);
      }
    }
    loadStatsAndBookings();
  }, [activeTab, search, stationId]);

  // Stats Card Component
  const StatCard = ({ icon: Icon, label, value, color = 'blue', loading = false }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 flex items-start">
      <div className={`p-3 rounded-lg bg-${color}-100 text-${color}-600 mr-4`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        {loading ? (
          <div className="h-8 w-16 bg-gray-200 rounded mt-1 animate-pulse"></div>
        ) : (
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-4 sm:p-6 md:p-8 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="text-center sm:text-left w-full sm:w-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Booking Management</h1>
            <p className="text-sm text-gray-500 mt-1">Manage and track all your station bookings</p>
          </div>
          <button 
            onClick={() => {}}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
          >
            <FiDownload className="mr-2" />
            Export Data
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsLoading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-6 h-24 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))
          ) : statsError ? (
            <div className="col-span-4">
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FiAlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{statsError}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            [
              { label: 'Total Bookings', value: stats.total, icon: FiCalendar, color: 'blue' },
              { label: 'Completed', value: stats.completed, icon: FiCheckCircle, color: 'green' },
              { label: 'Pending', value: stats.pending, icon: FiClock, color: 'orange' },
              { label: 'Cancelled', value: stats.cancelled, icon: FiXCircle, color: 'red' },
            ].map((stat) => (
              <StatCard
                key={stat.label}
                icon={stat.icon}
                label={stat.label}
                value={stat.value}
                color={stat.color}
                loading={statsLoading}
              />
            ))
          )}
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Search bookings..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="flex overflow-x-auto pb-2 md:pb-0">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`whitespace-nowrap px-4 py-2 text-sm font-medium rounded-md mr-2 last:mr-0 transition-colors ${
                    activeTab === tab.key
                      ? 'bg-orange-600 text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-12">
              <FiLoader className="animate-spin h-8 w-8 text-orange-500 mb-4" />
              <p className="text-gray-500">Loading bookings...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <FiAlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
              <h3 className="text-lg font-medium text-red-700">Error loading bookings</h3>
              <p className="mt-2 text-sm text-red-500">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Try Again
              </button>
            </div>
          ) : (
            <Table columns={columns} data={bookings} />
          )}
        </div>
      </main>
    </div>
  );
}
