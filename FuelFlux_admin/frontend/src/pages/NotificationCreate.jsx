import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';

import { useEffect } from 'react';
import { fetchUserStations } from '../api/station';

export default function NotificationCreate() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userStations, setUserStations] = useState([]);
  const [stationId, setStationId] = useState('');

  useEffect(() => {
    fetchUserStations().then(stations => {
      setUserStations(stations);
      if (stations.length > 0) setStationId(stations[0]._id || stations[0].id);
    }).catch(err => setError('Failed to fetch stations: ' + err.message));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    if (!stationId) {
      setError('Please select a station');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, message: description, stationId })
      });
      if (!res.ok) throw new Error('Failed to push notification');
      setSuccess('Notification pushed successfully!');
      setTitle('');
      setDescription('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <h1 className="text-2xl font-bold mb-4">Notifications</h1>
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow border border-gray-100 max-w-lg mx-auto p-6 flex flex-col gap-4">
          <label className="font-semibold">Station
            <select className="mt-1 border border-gray-300 rounded px-4 py-2 w-full" value={stationId} onChange={e => setStationId(e.target.value)} required>
              {userStations.length === 0 && <option value="">No stations found</option>}
              {userStations.map(station => (
                <option key={station._id || station.id} value={station._id || station.id}>{station.name}</option>
              ))}
            </select>
          </label>
          <label className="font-semibold">Title
            <input type="text" className="mt-1 border border-gray-300 rounded px-4 py-2 w-full" value={title} onChange={e => setTitle(e.target.value)} required />
          </label>
          <label className="font-semibold">Description
            <textarea className="mt-1 border border-gray-300 rounded px-4 py-2 w-full min-h-[100px]" value={description} onChange={e => setDescription(e.target.value)} required />
          </label>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <button type="submit" disabled={loading || userStations.length === 0} className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded font-semibold shadow transition disabled:opacity-70">
            {loading ? 'Pushing...' : 'Push Notification'}
          </button>
        </form>
      </main>
    </div>
  );
}
