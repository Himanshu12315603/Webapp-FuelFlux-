/**
 * API utility for nozzle management
 * Provides: fetch, create, update, and delete nozzle configurations.
 */

/**
 * Fetch nozzle configuration for a station.
 * @param {string} stationId
 * @returns {Promise<Object>}
 */
async function fetchNozzleConfig(stationId) {
    if (!stationId) throw new Error('stationId is required');
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) throw new Error('No token found');
    const response = await fetch(`/api/nozzles/${stationId}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        let msg = await response.text();
        if (response.status === 404) {
            throw new Error('Nozzle config not found for this station.');
        } else if (response.status === 500 && msg.includes('E11000')) {
            throw new Error('Duplicate nozzle config for this station. Please contact admin or clean up duplicates.');
        } else if (msg) {
            throw new Error(msg);
        } else {
            throw new Error('Failed to fetch nozzle config.');
        }
    }
    return await response.json();
}

/**
 * Create or upsert nozzle configuration for a station.
 * @param {Object} config
 * @returns {Promise<Object>}
 */
async function saveNozzleConfig({ stationId, petrol, diesel, cng, electric, other }) {
    if (!stationId) throw new Error('stationId is required');
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) throw new Error('No token found');
    const response = await fetch('/api/nozzles', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ stationId, petrol, diesel, cng, electric, other })
    });
    if (!response.ok) {
        let msg = 'Failed to save nozzle config';
        try {
            const data = await response.json();
            if (data && data.error) msg = data.error;
        } catch {}
        throw new Error(msg);
    }
    return await response.json();
}

/**
 * Update nozzle configuration for a station.
 * @param {Object} config
 * @returns {Promise<Object>}
 */
async function updateNozzleConfig({ stationId, petrol, diesel, cng, electric, other }) {
    if (!stationId) throw new Error('stationId is required');
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) throw new Error('No token found');
    const response = await fetch(`/api/nozzles/${stationId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ stationId, petrol, diesel, cng, electric, other })
    });
    if (!response.ok) {
        let msg = 'Failed to update nozzle config';
        try {
            const data = await response.json();
            if (data && data.error) msg = data.error;
        } catch {}
        throw new Error(msg);
    }
    return await response.json();
}

/**
 * Delete nozzle configuration for a station.
 * @param {string} stationId
 * @returns {Promise<Object>}
 */
async function deleteNozzleConfig(stationId) {
    if (!stationId) throw new Error('stationId is required');
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) throw new Error('No token found');
    const response = await fetch(`/api/nozzles/${stationId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        let msg = 'Failed to delete nozzle config';
        try {
            const data = await response.json();
            if (data && data.error) msg = data.error;
        } catch {}
        throw new Error(msg);
    }
    return await response.json();
}

export {
    fetchNozzleConfig,
    saveNozzleConfig,
    updateNozzleConfig,
    deleteNozzleConfig
};


