import React, { useState, useEffect } from 'react';
import { addEmployee, fetchEmployees, deleteEmployee } from '../api/employee';
import { fetchUserStations } from '../api/station';
import Sidebar from '../components/Sidebar';

export default function Employee() {
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);

  // Fetch employees on mount or after deletion
  const loadEmployees = async () => {
    setLoadingEmployees(true);
    try {
      const employeesData = await fetchEmployees();
      const stationsData = await fetchUserStations();
      
      // Create a map of station IDs to names
      const stationMap = {};
      stationsData.forEach(station => {
        stationMap[station._id] = station.name;
      });
      
      // Add station names to employees
      const employeesWithStationNames = employeesData.map(emp => ({
        ...emp,
        stationName: stationMap[emp.station] || emp.station
      }));
      
      setEmployees(employeesWithStationNames);
    } catch (error) {
      setEmployees([]);
      console.error('Error loading employees:', error);
    } finally {
      setLoadingEmployees(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    setError('');
    setMessage('');
    try {
      await deleteEmployee(id);
      setMessage('Employee deleted successfully.');
      loadEmployees();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete employee.');
    }
  };


  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [stations, setStations] = useState([]);
  const [loadingStations, setLoadingStations] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    mobile: '',
    role: 'Staff',
    shift: '9 AM to 6 PM',
    station: ''
  });

  // Fetch stations when modal opens
  useEffect(() => {
    if (showAddModal) {
      setLoadingStations(true);
      fetchUserStations()
        .then(sts => {
          console.log('Fetched stations:', sts);
          setStations(sts);
        })
        .catch(() => setStations([]))
        .finally(() => setLoadingStations(false));
    }
  }, [showAddModal]);

  const handleEditEmployee = (employee) => {
    setCurrentEmployee(employee);
    setNewEmployee({
      name: employee.name,
      mobile: employee.mobile,
      role: employee.role,
      shift: employee.shift,
      station: employee.station
    });
    setEditMode(true);
    setShowAddModal(true);
  };

  const resetForm = () => {
    setNewEmployee({
      name: '',
      mobile: '',
      role: 'Staff',
      shift: '9 AM to 6 PM',
      station: ''
    });
    setEditMode(false);
    setCurrentEmployee(null);
    setError('');
    setMessage('');
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    const { name, mobile, role, shift, station } = newEmployee;
    if (!name || !mobile || !role || !shift || !station) {
      setError('All fields are required.');
      return;
    }
    if (!/^[0-9]{10}$/.test(newEmployee.mobile)) {
      setError('Mobile number must be exactly 10 digits.');
      return;
    }
    // Validate that station is a valid MongoDB ObjectId (24 hex chars)
    if (!/^[a-fA-F0-9]{24}$/.test(newEmployee.station)) {
      setError('Selected station is not valid. Please contact admin or fix the backend to return _id.');
      return;
    }
    try {
      setError('');
      setMessage('');
      let response;
      if (editMode && currentEmployee) {
        // Update existing employee
        response = await updateEmployee(currentEmployee._id, newEmployee);
        setMessage('Employee updated successfully.');
      } else {
        // Add new employee
        response = await addEmployee(newEmployee);
        setMessage('Employee added successfully.');
      }
      
      if (response && response.message) {
        setShowAddModal(false);
        resetForm();
        loadEmployees();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.error('Add employee error:', err);
      setError(err.message || 'Failed to add employee.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-8 flex flex-col items-center justify-start w-full min-h-screen">
        <div className="w-full max-w-5xl flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 w-full">
            <div className="text-center sm:text-left w-full sm:w-auto">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">Employee Management</h1>
              <p className="text-sm text-gray-500 mt-1">Manage your station employees</p>
            </div>
            <button
              className="bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 text-white px-6 py-2 rounded-xl font-bold shadow-lg transition-all duration-200 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-orange-400 w-full sm:w-auto"
              onClick={() => setShowAddModal(true)}
            >
              + Add New Employee
            </button>
          </div>
          {message && <div className="mb-4 text-green-700 font-semibold bg-green-100 border border-green-200 rounded p-3 w-full text-center animate-fade-in-down shadow">{message}</div>}
          {error && <div className="mb-4 text-red-700 font-semibold bg-red-100 border border-red-200 rounded p-3 w-full text-center animate-fade-in-down shadow">{error}</div>}
        </div>
        {/* Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative border border-gray-200 animate-fade-in">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-3xl font-bold"
                onClick={() => setShowAddModal(false)}
                aria-label="Close"
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold mb-4 text-center">
                {editMode ? 'Edit Employee' : 'Add New Employee'}
              </h2>
              <form onSubmit={handleAddEmployee} className="flex flex-col gap-5">
                <div>
                  <label className="block font-semibold mb-1">Employee Name</label>
                  <input
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    type="text"
                    value={newEmployee.name}
                    onChange={e => setNewEmployee({ ...newEmployee, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Contact Number</label>
                  <input
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    type="tel"
                    value={newEmployee.mobile}
                    onChange={e => setNewEmployee({ ...newEmployee, mobile: e.target.value })}
                    pattern="[0-9]{10}"
                    maxLength={10}
                    minLength={10}
                    required
                  />
                  <span className="text-xs text-gray-500">10 digits only</span>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Station</label>
                  <select
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    value={newEmployee.station}
                    onChange={e => setNewEmployee({ ...newEmployee, station: e.target.value })}
                    required
                    disabled={loadingStations || stations.length === 0}
                  >
                    <option value="">{loadingStations ? 'Loading stations...' : 'Select Station'}</option>
                    {stations.map(station => (
                      <option key={station._id} value={station._id}>{station.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Role</label>
                  <select
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    value={newEmployee.role}
                    onChange={e => setNewEmployee({ ...newEmployee, role: e.target.value })}
                    required
                  >
                    <option value="Staff">Staff</option>
                    <option value="Manager">Manager</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Shift</label>
                  <select
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    value={newEmployee.shift}
                    onChange={e => setNewEmployee({ ...newEmployee, shift: e.target.value })}
                    required
                  >
                    <option value="9 AM to 6 PM">9 AM to 6 PM</option>
                    <option value="6 PM to 9 AM">6 PM to 9 AM</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-semibold shadow transition mt-2"
                >
                  {editMode ? 'Update Employee' : 'Add Employee'}
                </button>
              </form>
            </div>
          </div>
        )}
      {/* Employee Table */}
      <section className="w-full max-w-5xl mt-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Employee List</h2>
        {loadingEmployees ? (
          <div className="flex justify-center items-center py-10">
            <span className="text-lg text-gray-500">Loading employees...</span>
          </div>
        ) : employees.length === 0 ? (
          <div className="flex justify-center items-center py-10">
            <span className="text-lg text-gray-400">No employees found.</span>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl shadow-xl border border-gray-100 bg-white animate-fade-in mt-2">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gradient-to-r from-orange-600 to-orange-500 text-white sticky top-0 z-10">
                <tr>
                  <th className="py-3 px-4 font-semibold rounded-tl-2xl">Name</th>
                  <th className="py-3 px-4 font-semibold">Mobile</th>
                  <th className="py-3 px-4 font-semibold">Role</th>
                  <th className="py-3 px-4 font-semibold">Shift</th>
                  <th className="py-3 px-4 font-semibold">Station</th>
                  <th className="py-3 px-4 font-semibold text-center rounded-tr-2xl">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp, idx) => (
                  <tr
                    key={emp._id}
                    className={`transition-all duration-150 ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-orange-50`}
                  >
                    <td className="py-3 px-4 font-medium text-gray-900">{emp.name}</td>
                    <td className="py-3 px-4 text-gray-700">{emp.mobile}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${emp.role === 'Manager' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>{emp.role}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{emp.shift}</td>
                    <td className="py-3 px-4 text-gray-700">{emp.stationName || '—'}</td>
                    <td className="py-3 px-4 text-center space-x-2">
                      <button
                        onClick={() => handleEditEmployee(emp)}
                        className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-3 py-1.5 rounded-lg font-semibold text-xs shadow transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        Edit
                      </button>
                      <button
                        className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white px-3 py-1.5 rounded-lg font-semibold text-xs shadow transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-red-400"
                        onClick={() => handleDelete(emp._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      </main>
    </div>
  );
}
