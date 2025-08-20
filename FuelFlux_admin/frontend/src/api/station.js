// API utilities for station-related requests

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

// Fetch all stations (with optional search)
export async function fetchStations(search = '') {
    try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const response = await fetch(`${API_BASE}/api/stations?search=${encodeURIComponent(search)}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Failed to fetch stations');
        return await response.json();
    } catch (err) {
        console.error('Error fetching stations:', err);
        throw err;
    }
}

// Fetch a single station by ID
export async function fetchStationById(id) {
    try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const response = await fetch(`${API_BASE}/api/stations/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Failed to fetch station');
        return await response.json();
    } catch (err) {
        console.error('Error fetching station:', err);
        throw err;
    }
}

// Add a new station
export async function addStation(stationData) {
    try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const response = await fetch('/api/stations', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(stationData)
        });
        if (!response.ok) throw new Error('Failed to add station');
        return await response.json();
    } catch (err) {
        console.error('Error adding station:', err);
        throw err;
    }
}

// Update a station by ID (for nozzle/prices)
export async function updateStation(id, updateData) {
    try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const response = await fetch(`${API_BASE}/api/stations/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        });
        if (!response.ok) throw new Error('Failed to update station');
        return await response.json();
    } catch (err) {
        console.error('Error updating station:', err);
        throw err;
    }
}

// Update station status
export async function updateStationStatus(id, statusData) {
    try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) throw new Error('No token found');
        
        const response = await fetch(`${API_BASE}/api/stations/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(statusData)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to update station status');
        }

        return await response.json();
    } catch (err) {
        console.error('Error updating station status:', err);
        throw err;
    }
}

// Delete a station by ID
export async function deleteStation(id) {
    try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const response = await fetch(`${API_BASE}/api/stations/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Failed to delete station');
        return await response.json();
    } catch (err) {
        console.error('Error deleting station:', err);
        throw err;
    }
}

// Fetch user stations for dropdowns or selectors
export async function fetchUserStations() {
    try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
            console.error('No authentication token found in localStorage or sessionStorage');
            throw new Error('Please log in to view your stations');
        }
        
        console.log('Fetching stations from:', `${API_BASE}/api/stations`);
        const response = await fetch(`${API_BASE}/api/stations`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include' // Include cookies if using session-based auth
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            console.error('Failed to fetch stations:', { status: response.status, data });
            throw new Error(data.error || 'Failed to fetch user stations');
        }
        
        console.log('Fetched stations:', data);
        return data;
    } catch (err) {
        console.error('Error in fetchUserStations:', err);
        throw err;
    }
}
