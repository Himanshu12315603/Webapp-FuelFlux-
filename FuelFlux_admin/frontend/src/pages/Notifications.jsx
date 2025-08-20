import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { fetchNotifications } from '../api/notifications';
import { fetchUserStations } from '../api/station';

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [stations, setStations] = useState([]);
  const [stationId, setStationId] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please login to view notifications');
      setLoading(false);
      return;
    }
    
    setIsAuthenticated(true);
    loadNotifications();
    loadStations();
  }, []);

  const loadStations = async () => {
    try {
      const data = await fetchUserStations();
      setStations(data);
      if (data.length > 0) {
        setStationId(data[0]._id || data[0].id);
      } else {
        setFormError('No stations found. Please add a station first.');
      }
    } catch (err) {
      setFormError('Failed to load stations: ' + err.message);
    }
  };

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Get the first station ID for the logged-in user
      const stationsData = await fetchUserStations();
      if (stationsData.length === 0) {
        setError('No stations found for your account');
        return;
      }
      
      const userStationId = stationsData[0]._id || stationsData[0].id;
      
      // Fetch notifications only for the user's station
      const data = await fetchNotifications(userStationId);
      
      // Create a map of station IDs to names
      const stationMap = {};
      stationsData.forEach(station => {
        const stationId = station._id || station.id;
        const stationName = station.name || station.stationName;
        if (stationId && stationName) {
          stationMap[stationId] = stationName;
        }
      });
      
      // Add station names to notifications
      const notificationsWithStationNames = data.map(notification => ({
        ...notification,
        stationName: notification.stationId ? (stationMap[notification.stationId] || notification.stationId) : 'N/A'
      }));
      
      setNotifications(notificationsWithStationNames);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    setFormSuccess('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ title, message: description, stationId })
      });
      if (!res.ok) {
        let errorMsg = 'Failed to push notification';
        try {
          const errorData = await res.json();
          if (errorData && errorData.error) errorMsg = errorData.error;
        } catch (e) { /* Ignore JSON parse error */ }
        throw new Error(errorMsg);
      }
      setFormSuccess('Notification pushed successfully!');
      setTitle('');
      setDescription('');
      setShowForm(false);
      await loadNotifications();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  // Filter notifications from the last 2 hours
  const recentNotifications = notifications.filter(n => {
    if (!n.date) return true;
    const now = new Date();
    const notifDate = new Date(n.date);
    return (now - notifDate) < (2 * 60 * 60 * 1000);
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Authentication Required</h2>
          <p className="text-gray-700 mb-6">Please log in to view notifications</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      <Sidebar />
      <main className="flex-1 p-4 lg:p-8 ml-0 lg:ml-64">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 mt-2">
          <h1 className="text-3xl font-extrabold text-orange-700 tracking-tight">Notifications</h1>
          <button
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-2 rounded-lg font-semibold shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
            onClick={() => setShowForm(f => !f)}
          >
            {showForm ? 'Cancel' : '+ Add Notification'}
          </button>
        </div>
        
        {showForm && (
          <div className="w-full flex justify-center mb-10">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-orange-100 max-w-lg w-full p-8 flex flex-col gap-5">
              <div>
                <label className="font-semibold text-gray-800">Station</label>
                <select 
                  className="mt-2 border border-orange-200 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-orange-300"
                  value={stationId}
                  onChange={e => setStationId(e.target.value)}
                  required
                >
                  {stations.length === 0 ? (
                    <option value="">No stations available</option>
                  ) : (
                    stations.map(station => (
                      <option key={station._id || station.id} value={station._id || station.id}>
                        {station.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
              
              <div>
                <label className="font-semibold text-gray-800">Title</label>
                <input 
                  type="text" 
                  className="mt-2 border border-orange-200 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-orange-300" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  required 
                />
              </div>
              
              <div>
                <label className="font-semibold text-gray-800">Description</label>
                <textarea 
                  className="mt-2 border border-orange-200 rounded-lg px-4 py-2 w-full min-h-[80px] focus:ring-2 focus:ring-orange-300" 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  required 
                />
              </div>
              
              {formError && <div className="text-red-500 text-sm">{formError}</div>}
              {formSuccess && <div className="text-green-600 text-sm">{formSuccess}</div>}
              
              <button 
                type="submit" 
                disabled={formLoading} 
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-2 rounded-lg font-semibold shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:opacity-70"
              >
                {formLoading ? 'Pushing...' : 'Push Notification'}
              </button>
            </form>
          </div>
        )}
        
        <div className="overflow-x-auto mt-8">
          {loading ? (
            <div className="text-center text-gray-500 py-8">Loading notifications...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : recentNotifications.length === 0 ? (
            <div className="text-center text-gray-400 py-12 text-lg font-semibold">No notifications to display.</div>
          ) : (
            <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-orange-100 to-orange-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold text-orange-700">ID</th>
                    <th className="px-4 py-3 text-left font-bold text-orange-700">Title</th>
                    <th className="px-4 py-3 text-left font-bold text-orange-700">Message</th>
                    <th className="px-4 py-3 text-left font-bold text-orange-700">Station</th>
                    <th className="px-4 py-3 text-left font-bold text-orange-700">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentNotifications.map(n => (
                    <tr key={n.id || n._id} className="hover:bg-orange-50 transition">
                      <td className="px-4 py-3 text-orange-900 font-mono text-xs">
                        {(n.id || n._id || '').substring(0, 6)}...
                      </td>
                      <td className="px-4 py-3 text-orange-900 font-semibold">{n.title}</td>
                      <td className="px-4 py-3 text-orange-900">{n.message}</td>
                      <td className="px-4 py-3 text-orange-900 font-semibold">
                        {n.stationName || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-orange-900">
                        {n.date ? new Date(n.date).toLocaleString() : ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        <div className="h-12"></div>
      </main>
    </div>
  );
}
