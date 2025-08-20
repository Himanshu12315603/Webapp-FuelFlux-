// API utilities for notification-related requests

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

// Fetch all notifications
export async function fetchNotifications(stationId) {
  try {
    console.log('Fetching notifications for station:', stationId);
    
    // Get token and clean it
    let token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found');
      throw new Error('Please log in to view notifications');
    }
    
    // Clean the token (remove any quotes and trim whitespace)
    token = token.toString().replace(/^"|"$/g, '').trim();
    
    const url = stationId ? `${API_BASE}/api/notifications?stationId=${stationId}` : `${API_BASE}/api/notifications`;
    console.log('API URL:', url);
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include' // Important for cookies
    });
    
    // Check for HTTP error status
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch (e) {
        // If we can't parse the error JSON, use the status text
        errorMessage = response.statusText || errorMessage;
      }
      console.error('API Error:', errorMessage);
      throw new Error(errorMessage);
    }
    
    // Parse the response
    const data = await response.json();
    console.log('Notifications fetched successfully:', data.length || 0);
    return data;
    
    console.log('Successfully fetched notifications:', data);
    return data;
  } catch (err) {
    console.error('Error in fetchNotifications:', {
      error: err.message,
      stationId,
      stack: err.stack
    });
    throw err;
  }
}

// Delete a notification by ID
export async function deleteNotification(id) {
    try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const response = await fetch(`${API_BASE}/api/notifications/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Failed to delete notification');
        return await response.json();
    } catch (err) {
        console.error('Error deleting notification:', err);
        throw err;
    }
}

// Optionally add more notification-related API functions as needed
