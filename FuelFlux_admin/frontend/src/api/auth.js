// API utilities for authentication-related requests
// Converts legacy auth.js logic to React-usable functions

export async function checkAuth() {
    try {
        const response = await fetch('/api/auth/verify', {
            credentials: 'same-origin',
        });
        if (!response.ok) return false;
        const data = await response.json();
        return data.success && data.user.type === 'admin';
    } catch (error) {
        console.error('Auth check failed:', error);
        return false;
    }
}

export async function logout() {
    try {
        const response = await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'same-origin',
        });
        if (!response.ok) throw new Error('Logout failed');
        sessionStorage.clear();
        window.location.href = '/'; // React router path
    } catch (error) {
        console.error('Logout failed:', error);
        // Optionally use a toast or UI message in React
    }
}

// You can add more helper functions for login/register as needed

// Fetch current user info (e.g., name, email) from backend session
export async function getCurrentUser() {
    try {
        const response = await fetch('/api/auth/verify', {
            credentials: 'same-origin',
        });
        if (!response.ok) return null;
        const data = await response.json();
        if (data.success && data.user) {
            return data.user; // { name, email, ... }
        }
        return null;
    } catch (error) {
        console.error('Failed to fetch current user:', error);
        return null;
    }
}

