// API utilities for employee-related requests

// Add a new employee
export async function addEmployee(employeeData) {
    try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const response = await fetch('/api/employees', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(employeeData)
        });
        if (!response.ok) throw new Error('Failed to add employee');
        return await response.json();
    } catch (err) {
        console.error('Error adding employee:', err);
        throw err;
    }
}

// Fetch all employees
export async function fetchEmployees() {
    try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const response = await fetch('/api/employees', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Failed to fetch employees');
        return await response.json();
    } catch (err) {
        console.error('Error fetching employees:', err);
        throw err;
    }
}

// View a single employee by ID
export async function fetchEmployeeById(id) {
    try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const response = await fetch(`/api/employees/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Failed to fetch employee');
        return await response.json();
    } catch (err) {
        console.error('Error fetching employee:', err);
        throw err;
    }
}

// Update an employee by ID
export async function updateEmployee(id, employeeData) {
    try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const response = await fetch(`/api/employees/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(employeeData)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update employee');
        }
        return await response.json();
    } catch (err) {
        console.error('Error updating employee:', err);
        throw err;
    }
}

// Delete an employee by ID
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export async function deleteEmployee(id) {
    try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const response = await fetch(`${API_BASE}/api/employees/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Failed to delete employee');
        return await response.json();
    } catch (err) {
        console.error('Error deleting employee:', err);
        throw err;
    }
}
