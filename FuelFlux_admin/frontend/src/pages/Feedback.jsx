import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';

export default function Feedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch('/api/feedback', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch feedback');
      const data = await res.json();
      setFeedbacks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-800 flex flex-col lg:flex-row">
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-8 flex flex-col items-center bg-gray-50 min-h-screen">
        <div className="w-full max-w-5xl">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 w-full">
            <div className="text-center sm:text-left w-full sm:w-auto">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-orange-700">Feedback</h1>
              <p className="text-sm text-gray-500 mt-1">Customer feedback and reviews</p>
            </div>
            <span className="text-orange-700 font-semibold bg-orange-100 rounded-full px-4 py-1.5 text-sm shadow w-full sm:w-auto text-center">
              {feedbacks.length} Feedback{feedbacks.length !== 1 && 's'}
            </span>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-6">
            {loading && <div className="text-orange-600 font-semibold py-8 text-center">Loading feedback...</div>}
            {error && <div className="text-red-500 font-semibold py-8 text-center">{error}</div>}
            {!loading && !error && feedbacks.length === 0 && (
              <div className="text-gray-400 text-center py-12 flex flex-col items-center">
                <svg className="w-14 h-14 mb-4 text-orange-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 14h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z" /></svg>
                <span className="font-semibold">No feedback found.</span>
              </div>
            )}
            {feedbacks.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm rounded-xl border border-orange-100">
                  <thead className="bg-orange-50 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3 text-left font-bold text-orange-700">ID</th>
                      <th className="px-4 py-3 text-left font-bold text-orange-700">User</th>
                      <th className="px-4 py-3 text-left font-bold text-orange-700">Message</th>
                      <th className="px-4 py-3 text-left font-bold text-orange-700">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feedbacks.map((fb, i) => (
                      <tr key={fb.id || i} className={i % 2 === 0 ? 'bg-white' : 'bg-orange-50'}>
                        <td className="border-b border-orange-100 px-4 py-3 text-orange-900 font-semibold">{fb.id}</td>
                        <td className="border-b border-orange-100 px-4 py-3 text-orange-900">{fb.user}</td>
                        <td className="border-b border-orange-100 px-4 py-3 text-orange-900">{fb.message}</td>
                        <td className="border-b border-orange-100 px-4 py-3 text-orange-900">{new Date(fb.date).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
