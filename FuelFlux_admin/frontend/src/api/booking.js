// API utility for booking management
export async function fetchBookings({ tab = 'all', search = '', stationId = '' }) {
  const params = new URLSearchParams();
  if (tab) params.append('tab', tab);
  if (search) params.append('search', search);
  if (stationId) params.append('stationId', stationId);
  const res = await fetch(`/api/bookings?${params.toString()}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch bookings');
  return await res.json();
}

// Fetch booking stats for a station
export async function fetchBookingStats(stationId) {
  if (!stationId) throw new Error('stationId required');
  const res = await fetch(`/api/bookings/stats?stationId=${stationId}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch booking stats');
  return await res.json();
}
