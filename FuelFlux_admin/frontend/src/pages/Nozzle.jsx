import React, { useEffect, useState } from 'react';
import { fetchUserStations, fetchStationById, updateStation } from '../api/station';
import Sidebar from '../components/Sidebar';

const FUEL_TYPES = [
  { key: 'petrol', label: 'Petrol', unit: 'Litre' },
  { key: 'diesel', label: 'Diesel', unit: 'Litre' },
  { key: 'cng', label: 'CNG', unit: 'Kg' },
  { key: 'electric', label: 'Electric', unit: 'kWh' },
  { key: 'other', label: 'Other', unit: 'Unit' }
];

export default function Nozzle() {
  const [stations, setStations] = useState([]);
  const [stationId, setStationId] = useState('');
  const [nozzleCounts, setNozzleCounts] = useState({});
  const [prices, setPrices] = useState({});
  const [stationName, setStationName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [savedConfigs, setSavedConfigs] = useState({});
  const [notFound, setNotFound] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [availableFuelTypes, setAvailableFuelTypes] = useState([]);

  // Fetch all stations and their configs on component mount
  useEffect(() => {
    const fetchAll = async () => {
      const stationsData = await fetchUserStations();
      setStations(stationsData);
      
      const configs = {};
      for (const station of stationsData) {
        try {
          const data = await fetchStationById(station._id || station.id);
          configs[station._id || station.id] = {
            petrol: Array.from({length: data.nozzles?.petrol || 0}, (_,i) => ({nozzleNumber: i+1, price: data.prices?.petrol || 0})),
            diesel: Array.from({length: data.nozzles?.diesel || 0}, (_,i) => ({nozzleNumber: i+1, price: data.prices?.diesel || 0})),
            cng: Array.from({length: data.nozzles?.cng || 0}, (_,i) => ({nozzleNumber: i+1, price: data.prices?.cng || 0})),
            electric: Array.from({length: data.nozzles?.electric || 0}, (_,i) => ({nozzleNumber: i+1, price: data.prices?.electric || 0})),
            other: Array.from({length: data.nozzles?.other || 0}, (_,i) => ({nozzleNumber: i+1, price: data.prices?.other || 0})),
            stationName: data.name || data.stationName || station.name || station.stationName || 'Unnamed Station'
          };
        } catch (err) {
          console.error(`Failed to fetch station ${station._id || station.id}:`, err);
        }
      }
      setSavedConfigs(configs);
    };
    fetchAll();
  }, []);

  // Fetch station config when stationId changes
  useEffect(() => {
    if (!stationId) return;
    
    const fetchStationConfig = async () => {
      setNotFound(false);
      
      try {
        const station = await fetchStationById(stationId);
        
        // Set available fuel types from station data
        const fuels = station.fuelTypes || [];
        setAvailableFuelTypes(fuels);
        
        // Initialize nozzle counts and prices only for available fuel types
        const initialNozzleCounts = {};
        const initialPrices = {};
        
        fuels.forEach(fuel => {
          initialNozzleCounts[fuel] = station.nozzles?.[fuel]?.length || 0;
          initialPrices[fuel] = station.prices?.[fuel]?.[0]?.price || '';
        });
        
        setNozzleCounts(initialNozzleCounts);
        setPrices(initialPrices);
        
        // Update saved configs
        setSavedConfigs(prv => ({
          ...prv,
          [stationId]: {
            ...Object.fromEntries(fuels.map(fuel => [
              fuel,
              Array.from({ length: station.nozzles?.[fuel] || 0 }, (_, i) => ({
                nozzleNumber: i + 1,
                price: station.prices?.[fuel]?.[0]?.price || 0
              }))
            ])),
            stationName: station.name || station.stationName || ''
          }
        }));
      } catch (err) {
        console.error('Error fetching station:', err);
        setNotFound(true);
      }
    };
    
    fetchStationConfig();
  }, [stationId]);

  // Populate form with existing config for editing
  const fillEditForm = (config, stationId) => {
    // Show the form
    setShowForm(true);
    
    // Set the station ID if provided
    if (stationId) {
      setStationId(stationId);
    }
    
    // Set the nozzle counts and prices only for available fuel types
    const updatedNozzleCounts = {};
    const updatedPrices = {};
    
    availableFuelTypes.forEach(fuel => {
      updatedNozzleCounts[fuel] = config[fuel]?.length || 0;
      updatedPrices[fuel] = config[fuel]?.[0]?.price || '';
    });
    
    setNozzleCounts(updatedNozzleCounts);
    setPrices(updatedPrices);
    
    // Set the station name and success message
    setStationName(config.stationName || '');
    setSuccess('Form loaded for editing. Make changes and Save.');
    
    // Scroll to the form for better UX
    setTimeout(() => {
      const formElement = document.querySelector('form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Handle nozzle count changes
  const handleCountChange = (fuel, count) => {
    setNozzleCounts({ ...nozzleCounts, [fuel]: count });
    setPrices(prv => {
      if (count > 0) {
        return { ...prv, [fuel]: prv[fuel] || '' };
      } else {
        const copy = { ...prv };
        delete copy[fuel];
        return copy;
      }
    });
  };

  // Show the configuration form
  const handleShowForm = () => {
    setShowForm(true);
    setSuccess('');
    setError('');
    // Don't reset the form state when showing the form
    // This will preserve the existing configurations
    if (savedConfigs[stationId]) {
      setNozzleCounts({
        petrol: savedConfigs[stationId].petrol?.length || 0,
        diesel: savedConfigs[stationId].diesel?.length || 0,
        cng: savedConfigs[stationId].cng?.length || 0,
        electric: savedConfigs[stationId].electric?.length || 0,
        other: savedConfigs[stationId].other?.length || 0
      });
      setPrices({
        petrol: savedConfigs[stationId].petrol?.[0]?.price || '',
        diesel: savedConfigs[stationId].diesel?.[0]?.price || '',
        cng: savedConfigs[stationId].cng?.[0]?.price || '',
        electric: savedConfigs[stationId].electric?.[0]?.price || '',
        other: savedConfigs[stationId].other?.[0]?.price || ''
      });
    } else {
      setNozzleCounts({});
      setPrices({});
    }
  };

  // Handle form submission
  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    
    // Validate only the available fuel types
    for (const fuel of availableFuelTypes) {
      if (nozzleCounts[fuel] > 0 && (!prices[fuel] || isNaN(parseFloat(prices[fuel])))) {
        setError(`Please enter a valid price for ${fuel.charAt(0).toUpperCase() + fuel.slice(1)}`);
        setLoading(false);
        return;
      }
    }
    
    // Prepare payload with only available fuel types
    const updatePayload = {
      nozzles: {},
      prices: {}
    };
    
    // Only include available fuel types in the payload
    availableFuelTypes.forEach(fuel => {
      updatePayload.nozzles[fuel] = nozzleCounts[fuel] || 0;
      updatePayload.prices[fuel] = Number(prices[fuel]) || 0;
    });
    updateStation(stationId, updatePayload)
      .then(() => fetchStationById(stationId))
      .then(station => {
        setSavedConfigs(prv => ({ ...prv, [stationId]: {
          petrol: Array.from({ length: station.nozzles?.petrol || 0 }, (_, i) => ({ nozzleNumber: i + 1, price: station.prices?.petrol || 0 })),
          diesel: Array.from({ length: station.nozzles?.diesel || 0 }, (_, i) => ({ nozzleNumber: i + 1, price: station.prices?.diesel || 0 })),
          cng: Array.from({ length: station.nozzles?.cng || 0 }, (_, i) => ({ nozzleNumber: i + 1, price: station.prices?.cng || 0 })),
          electric: Array.from({ length: station.nozzles?.electric || 0 }, (_, i) => ({ nozzleNumber: i + 1, price: station.prices?.electric || 0 })),
          other: Array.from({ length: station.nozzles?.other || 0 }, (_, i) => ({ nozzleNumber: i + 1, price: station.prices?.other || 0 })),
          stationName: station.name || station.stationName || ''
        } }));
        setSuccess('Nozzle configuration saved successfully!');
        setShowForm(false);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to save nozzle configuration.');
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8 w-full">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
            <div className="text-center sm:text-left w-full sm:w-auto">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-orange-700">Nozzle Management</h1>
              <p className="text-sm text-gray-500 mt-1">Configure and manage fuel nozzles for your stations</p>
            </div>
            {!showForm && (
              <button
                onClick={handleShowForm}
                className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-2.5 rounded-lg font-semibold shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Add Nozzle Config
              </button>
            )}
          </div>
          {showForm && (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-orange-100 w-full p-4 sm:p-6 lg:p-8 flex flex-col gap-6 max-w-4xl mx-auto">
              <label className="font-semibold text-gray-800">Select Station
                <select
                  className="mt-2 border border-orange-200 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-orange-300"
                  value={stationId}
                  onChange={e => setStationId(e.target.value)}
                  required
                >
                  {stations.map(st => (
                    <option key={st._id || st.id} value={st._id || st.id}>{st.name || st.stationName}</option>
                  ))}
                </select>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {FUEL_TYPES.filter(fuel => availableFuelTypes.includes(fuel.key)).map(fuel => (
                  <div key={fuel.key} className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl p-4 sm:p-5 border border-orange-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <label className="block font-semibold text-orange-700 mb-2">
                      {fuel.label} Nozzles
                      <input
                        type="number"
                        min="0"
                        value={nozzleCounts[fuel.key] || ''}
                        onChange={e => handleCountChange(fuel.key, Number(e.target.value))}
                        className="mt-1 border border-orange-200 rounded px-3 py-1 w-full focus:ring-2 focus:ring-orange-300"
                        placeholder={`Enter number of ${fuel.label.toLowerCase()} nozzles`}
                      />
                    </label>
                    {nozzleCounts[fuel.key] > 0 && (
                      <label className="block mt-2 text-orange-600">
                        Price per {fuel.unit}
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={prices[fuel.key] || ''}
                          onChange={e => setPrices(prv => ({ ...prv, [fuel.key]: e.target.value }))}
                          className="mt-1 border border-orange-200 rounded px-3 py-1 w-full focus:ring-2 focus:ring-orange-300"
                          placeholder={`Enter price per ${fuel.unit}`}
                        />
                      </label>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="submit"
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-bold mt-6 shadow-lg"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Nozzle Configuration'}
              </button>
              {error && <div className="text-red-600 font-semibold mt-2">{error}</div>}
            </form>
          )}
          {success && !showForm && (
            <div className="text-green-600 font-semibold mt-2">{success}</div>
          )}
          <h2 className="text-xl font-bold text-orange-700 mb-4">All Stations' Nozzle Configurations</h2>
          {Object.entries(savedConfigs).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(savedConfigs).map(([id, config]) => (
                <div key={id} className="bg-white rounded-2xl shadow border border-orange-100 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-orange-700">{config.stationName}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => fillEditForm(config, id)}
                        className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm transition-colors duration-200 flex items-center gap-1"
                        title="Edit this configuration"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {FUEL_TYPES.filter(({key}) => config[key]?.length > 0).map(({key, label, unit}) => (
                      <div key={key} className="bg-orange-50 p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{label}</span>
                          <span className="text-sm text-gray-600">{unit}</span>
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-xs text-gray-500">Nozzles</p>
                            <p className="font-bold">{config[key].length}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Price</p>
                            <p className="font-bold">{config[key][0]?.price || 0} / {unit}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              <p>No nozzle configurations found for any stations.</p>
              <button
                onClick={() => handleShowForm()}
                className="mt-3 text-orange-600 hover:text-orange-700 font-medium text-sm inline-flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Add Nozzle Configuration
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}