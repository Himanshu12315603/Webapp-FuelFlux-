// API utilities for user-related requests

// Delete own user profile/account
export async function deleteOwnProfile() {
    try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const response = await fetch('/api/user/profile', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Failed to delete account');
        return await response.json();
    } catch (err) {
        console.error('Error deleting account:', err);
        throw err;
    }
}
