import React, { useEffect, useState } from 'react';
import { addStation, deleteStation, fetchUserStations, updateStationStatus, updateStation } from '../api/station';
import { getCurrentUser } from '../api/auth';
import Sidebar from '../components/Sidebar';

export default function Station() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStation, setNewStation] = useState({ name: '', location: '', contact: '', upiId: '', status: 'active', fuelTypes: [] });
  const [currentUser, setCurrentUser] = useState(null);
  const [viewedStation, setViewedStation] = useState(null);
  const [userStations, setUserStations] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingStationId, setEditingStationId] = useState(null);

  useEffect(() => {
    loadStations();
  }, []);
  
  // Set user stations when they are loaded
  useEffect(() => {
    if (stations.length > 0) {
      setUserStations(stations);
    }
  }, [stations]);

  // Fetch current user info when modal opens
  useEffect(() => {
    if (showAddModal) {
      getCurrentUser().then(setCurrentUser);
    }
  }, [showAddModal]);

  const loadStations = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchUserStations();
      setStations(data);
    } catch (err) {
      console.error('Error loading stations:', err);
      setError(err.message || 'Failed to load stations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this station?')) return;
    try {
      setMessage('');
      await deleteStation(id);
      setMessage('Station deleted successfully.');
      loadStations();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err?.message || (err?.response?.data?.error) || 'Failed to delete station.');
    }
  };

  const handleStatusUpdate = async (stationId, newStatus) => {
    try {
      setLoading(true);
      setError('');
      
      // Call the API to update the status
      const updatedStation = await updateStationStatus(stationId, { status: newStatus });
      
      // Update the stations list
      setStations(prevStations => 
        prevStations.map(station => 
          station._id === stationId ? { ...station, status: newStatus } : station
        )
      );
      
      // Update the viewed station if it's currently open
      if (viewedStation && viewedStation._id === stationId) {
        setViewedStation(prev => ({ ...prev, status: newStatus }));
      }
      
      setMessage('Status updated successfully!');
      setTimeout(() => setMessage(''), 3000);
      
      // If this was an edit operation, redirect to nozzle page
      if (isEditMode) {
        window.location.href = `/nozzle?stationId=${stationId}`;
      }
      
    } catch (err) {
      console.error('Error updating status:', err);
      setError(err.response?.data?.message || err.message || 'Failed to update status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStation = async (e) => {
    e.preventDefault();
    try {
      console.log('handleAddStation called');
      console.log('isEditMode:', isEditMode);
      console.log('editingStationId:', editingStationId);
      console.log('updateStation function:', updateStation);
      
      setMessage('');
      setError('');
      const userId = currentUser?.id || currentUser?._id;
      if (!userId) {
        throw new Error('User not authenticated. Please log in again.');
      }
      
      const stationData = {
        ...newStation,
        userid: userId,
        status: newStation.status || 'active'
      };
      
      if (!stationData.upiId) {
        throw new Error('UPI ID is required');
      }
      
      let response;
      if (isEditMode && editingStationId) {
        // Update existing station
        console.log('Attempting to update station with ID:', editingStationId);
        console.log('Station data to update:', stationData);
        try {
          response = await updateStation(editingStationId, stationData);
          console.log('Update station response:', response);
          setMessage('Station updated successfully!');
        } catch (updateErr) {
          console.error('Error in updateStation call:', updateErr);
          throw updateErr;
        }
      } else {
        // Add new station
        response = await addStation(stationData);
        setMessage('Station added successfully!');
      }
      
      setShowAddModal(false);
      setIsEditMode(false);
      setEditingStationId(null);
      setNewStation({ name: '', location: '', contact: '', upiId: '', status: 'active', fuelTypes: [] });
      await loadStations();
      
      // Redirect to Nozzle page with the station ID, including the base path
      const basePath = window.location.pathname.split('/').slice(0, -1).join('/');
      window.location.href = `${basePath}/nozzle?stationId=${response._id || response.id || editingStationId}`;
    } catch (err) {
      console.error('Error adding station:', err);
      setError(err.message || 'Failed to add station. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Sidebar */}
      <Sidebar />
      {/* Main content */}
      <main className="flex-1 lg:ml-64 p-4 sm:p-6 md:p-8 flex flex-col items-start w-full bg-white">
        <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <div className="text-center sm:text-left w-full sm:w-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Station Management</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your fuel stations</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)} 
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 sm:px-6 py-2 rounded-lg font-medium text-sm sm:text-base shadow transition w-full sm:w-auto text-center"
          >
            + Add Station
          </button>
        </div>
        
        {loading && <div className="w-full text-center py-4">Loading stations...</div>}
        {error && <div className="w-full text-red-500 p-3 bg-red-50 rounded-lg mb-4">{error}</div>}
        {message && <div className="w-full text-green-600 p-3 bg-green-50 rounded-lg mb-4">{message}</div>}
        
        <div className="w-full overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Location</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stations.map(station => (
                <tr key={station._id || station.id} className="hover:bg-gray-50">
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{station.name}</div>
                    <div className="text-xs text-gray-500 sm:hidden">{station.location}</div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                    <div className="text-sm text-gray-900">{station.location}</div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{station.contact}</div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-wrap gap-2">
                      <button 
                        onClick={async () => {
                          try {
                            // First, ensure we have the latest station data
                            const response = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:3000'}/api/stations/${station._id}`, {
                              headers: {
                                'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`,
                                'Accept': 'application/json'
                              }
                            });
                            
                            if (!response.ok) throw new Error('Failed to fetch station details');
                            
                            const stationData = await response.json();
                            
                            // Format the data for the view modal
                            const formattedStation = {
                              ...stationData,
                              // Handle location (combine lat and lon if they exist)
                              location: stationData.location || (stationData.lat && stationData.lon ? `${stationData.lat},${stationData.lon}` : ''),
                              // Ensure fuelTypes is an array
                              fuelTypes: Array.isArray(stationData.fuelTypes) 
                                ? stationData.fuelTypes 
                                : (stationData.fuelTypes ? Object.entries(stationData.fuelTypes)
                                    .filter(([_, value]) => value === true)
                                    .map(([key]) => key) 
                                  : []),
                              // Ensure other fields have default values
                              upiId: stationData.upiId || '',
                              status: stationData.status || 'active',
                              contact: stationData.contact || '',
                              name: stationData.name || 'Unnamed Station'
                            };
                            
                            console.log('Viewing station data:', formattedStation);
                            setViewedStation(formattedStation);
                          } catch (err) {
                            console.error('Error loading station details:', err);
                            // Fallback to the basic data if API call fails
                            const fallbackStation = {
                              ...station,
                              fuelTypes: station.fuelTypes || [],
                              upiId: station.upiId || station.upi_id || station.upi || '',
                              status: station.status || 'active',
                              contact: station.contact || '',
                              location: station.location || (station.lat && station.lon ? `${station.lat},${station.lon}` : ''),
                              name: station.name || 'Unnamed Station'
                            };
                            setViewedStation(fallbackStation);
                          }
                        }} 
                        className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md text-xs sm:text-sm transition"
                      >
                        View
                      </button>
                      <button 
                        onClick={async () => {
                          try {
                            // First, ensure we have the latest station data
                            const response = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:3000'}/api/stations/${station._id}`, {
                              headers: {
                                'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`,
                                'Accept': 'application/json'
                              }
                            });
                            
                            if (!response.ok) throw new Error('Failed to fetch station details');
                            
                            const stationData = await response.json();
                            
                            // Format the data for the form
                            const formattedStation = {
                              ...stationData,
                              // Handle location (combine lat and lon if they exist)
                              location: stationData.location || (stationData.lat && stationData.lon ? `${stationData.lat},${stationData.lon}` : ''),
                              // Ensure fuelTypes is an array
                              fuelTypes: Array.isArray(stationData.fuelTypes) 
                                ? stationData.fuelTypes 
                                : (stationData.fuelTypes ? Object.entries(stationData.fuelTypes)
                                    .filter(([_, value]) => value === true)
                                    .map(([key]) => key) 
                                  : []),
                              // Ensure UPI ID is properly set
                              upiId: stationData.upiId || stationData.upi_id || stationData.upi || '',
                              // Ensure other fields have default values
                              status: stationData.status || 'active',
                              contact: stationData.contact || '',
                              name: stationData.name || ''
                            };
                            
                            console.log('Editing station data:', formattedStation);
                            setNewStation(formattedStation);
                            setEditingStationId(station._id);
                            setIsEditMode(true);
                            setShowAddModal(true);
                          } catch (err) {
                            console.error('Error loading station details for edit:', err);
                            // Fallback to the basic data if API call fails
                            const fallbackStation = {
                              ...station,
                              fuelTypes: station.fuelTypes || [],
                              upiId: station.upiId || station.upi_id || station.upi || '',
                              status: station.status || 'active',
                              contact: station.contact || '',
                              location: station.location || (station.lat && station.lon ? `${station.lat},${station.lon}` : ''),
                              name: station.name || ''
                            };
                            setNewStation(fallbackStation);
                            setEditingStationId(station._id);
                            setIsEditMode(true);
                            setShowAddModal(true);
                          }
                        }} 
                        className="text-yellow-600 hover:text-yellow-900 bg-yellow-50 hover:bg-yellow-100 px-2.5 py-1 rounded-md text-xs sm:text-sm transition"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(station.originalId || station.id)} 
                        className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-md text-xs sm:text-sm transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {stations.length === 0 && !loading && (
          <div className="w-full text-center py-8 text-gray-500">
            No stations found. Add your first station to get started.
          </div>
        )}

      {/* Modal for adding/editing a station */}
      {(showAddModal || isEditMode) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative animate-fade-in border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                {isEditMode ? 'Edit Station' : 'Add New Station'}
              </h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label="Close modal"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-4 sm:p-6">
              <form onSubmit={handleAddStation} className="space-y-4">
                {/* Current user name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">User Name</label>
                  <input
                    type="text"
                    value={currentUser ? currentUser.username || currentUser.name || '' : 'Loading...'}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 bg-gray-50"
                  />
                </div>

                {/* Station Name */}
                <div>
                  <label htmlFor="stationName" className="block text-sm font-medium text-gray-700 mb-1">Station Name</label>
                  <input
                    id="stationName"
                    type="text"
                    placeholder="Enter station name"
                    value={newStation.name}
                    onChange={e => setNewStation({ ...newStation, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>

                {/* Location */}
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <div className="flex rounded-md shadow-sm">
                    <input
                      id="location"
                      type="text"
                      placeholder="Enter address or coordinates"
                      value={newStation.location}
                      onChange={e => setNewStation({ ...newStation, location: e.target.value })}
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md border border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={async () => {
                        if (navigator.geolocation) {
                          navigator.geolocation.getCurrentPosition(
                            pos => {
                              setNewStation(ns => ({ ...ns, location: `${pos.coords.latitude},${pos.coords.longitude}` }));
                            },
                            err => {
                              alert('Unable to retrieve your location. Please enable location services and try again.');
                              console.error('Geolocation error:', err);
                            },
                            { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
                          );
                        } else {
                          alert('Geolocation is not supported by your browser');
                        }
                      }}
                      className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                      title="Use current location"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* UPI ID */}
                <div>
                  <label htmlFor="upiId" className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.97 1.5 2.89 3.55 3.4 1.85.45 2.33.99 2.33 1.81 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-3.12-3.66-3.56z"/>
                      </svg>
                    </div>
                    <input
                      id="upiId"
                      type="text"
                      placeholder="Enter UPI ID (e.g., name@upi)"
                      value={newStation.upiId}
                      onChange={e => setNewStation({ ...newStation, upiId: e.target.value })}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Example: yourname@upi</p>
                </div>

                {/* Fuel Types */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Types</label>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {['petrol', 'diesel', 'cng', 'electric', 'other'].map((fuel) => (
                      <label key={fuel} className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={newStation.fuelTypes.includes(fuel)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewStation(prev => ({
                                ...prev,
                                fuelTypes: [...prev.fuelTypes, fuel],
                              }));
                            } else {
                              setNewStation(prev => ({
                                ...prev,
                                fuelTypes: prev.fuelTypes.filter((f) => f !== fuel),
                              }));
                            }
                          }}
                          className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">{fuel}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Contact */}
                <div>
                  <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                  <input
                    id="contact"
                    type="tel"
                    placeholder="Enter contact number"
                    value={newStation.contact}
                    onChange={e => setNewStation({ ...newStation, contact: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                {/* Status */}
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    id="status"
                    value={newStation.status}
                    onChange={e => setNewStation({ ...newStation, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">Select status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="maintenance">Under Maintenance</option>
                  </select>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row-reverse gap-3 pt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  >
                    Add Station
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="w-full sm:w-auto inline-flex justify-center py-2 px-6 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

{/* Station Card Preview (shows after adding a station) */}
{message && newStation.name && (
  <div className="w-full max-w-md mt-6">
    <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-3 border border-gray-200 animate-fade-in">
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-orange-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold">
          {newStation.name[0]?.toUpperCase()}
        </div>
        <div>
          <div className="font-bold text-xl text-orange-700">{newStation.name}</div>
          <div className="text-sm text-gray-500 mt-1">
            <svg className="h-4 w-4 inline-block mr-1 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {newStation.location}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mt-1">
        {newStation.fuelTypes?.map(fuel => (
          <span key={fuel} className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-700 border border-orange-400 text-xs font-semibold">
            {fuel.charAt(0).toUpperCase() + fuel.slice(1)}
          </span>
        ))}
      </div>
      <div className="text-gray-700 mt-1"><span className="font-semibold">Contact:</span> {newStation.contact}</div>
      <div className="text-gray-700"><span className="font-semibold">UPI ID:</span> {newStation.upiId}</div>
      <div className="text-gray-700"><span className="font-semibold">Status:</span> {newStation.status}</div>
    </div>
  </div>
)}

      {/* Station Details Modal */}
      {viewedStation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md relative max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Station Details</h2>
              <button 
                onClick={() => setViewedStation(null)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label="Close modal"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0">
                  <div className="bg-orange-100 text-orange-600 rounded-full w-14 h-14 flex items-center justify-center text-2xl font-bold">
                    {viewedStation.name[0]?.toUpperCase()}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xl font-bold text-gray-900 truncate">{viewedStation.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    <svg className="h-4 w-4 inline-block mr-1 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {viewedStation.location}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Fuel Types */}
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Fuel Types</h4>
                  <div className="flex flex-wrap gap-2">
                    {viewedStation.fuelTypes?.length > 0 ? (
                      Array.isArray(viewedStation.fuelTypes) ? (
                        viewedStation.fuelTypes.map((fuel) => (
                          <span 
                            key={fuel} 
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
                          >
                            {typeof fuel === 'string' ? fuel.charAt(0).toUpperCase() + fuel.slice(1) : fuel}
                          </span>
                        ))
                      ) : (
                        Object.entries(viewedStation.fuelTypes).map(([fuel, value]) => (
                          value && (
                            <span 
                              key={fuel} 
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
                            >
                              {fuel.charAt(0).toUpperCase() + fuel.slice(1)}
                            </span>
                          )
                        ))
                      )
                    ) : (
                      <p className="text-sm text-gray-500">No fuel types specified</p>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Contact Information</h4>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center text-sm text-gray-700">
                      <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {viewedStation.contact || 'Not provided'}
                    </div>
                  </div>
                </div>

                {/* UPI ID */}
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">UPI ID</h4>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center text-sm text-gray-700">
                      <svg className="h-5 w-5 text-gray-600 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.97 1.5 2.89 3.55 3.4 1.85.45 2.33.99 2.33 1.81 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-3.12-3.66-3.56z"/>
                      </svg>
                      <span className="font-mono break-all">
                        {viewedStation.upiId || viewedStation.upi_id || viewedStation.upi || 'Not provided'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Display */}
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Status</h4>
                  <div className="relative">
                    <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                      viewedStation.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : viewedStation.status === 'inactive'
                        ? 'bg-red-100 text-red-800'
                        : viewedStation.status === 'maintenance'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {viewedStation.status === 'active' && 'Active'}
                      {viewedStation.status === 'inactive' && 'Inactive'}
                      {viewedStation.status === 'maintenance' && 'Under Maintenance'}
                      {!['active', 'inactive', 'maintenance'].includes(viewedStation.status) && 'Unknown'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setViewedStation(null)}
                  className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </main>
    </div>
  );
}
