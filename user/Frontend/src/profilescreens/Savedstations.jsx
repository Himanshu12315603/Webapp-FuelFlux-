import React, { useState , useEffect } from 'react';

import { useNavigate } from 'react-router';
import axiosInstance from '../../Utils/axiosInstance';
const Savedstations = () => {
  const navigate = useNavigate() ;
  const [activeView, setActiveView] = useState('list');
    const [stationData, setStationdata] = useState('');
   const handlemap = () =>{
    navigate('/stations')
   }

  const handlestationname = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate('/login');  
        return;
      }
      const response = await axiosInstance.get('/api/stations/getpetrolpumps', {
        headers: {
       Authorization: `Bearer ${token}`,
 
        },
      });
      if (response.data) {
        setStationdata(response.data.pumps || []);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    handlestationname();
  }, []);


  return (
    <div className="min-h-screen bg-white p-4 space-y-6">
      
      {/* Toggle View Buttons */}
      <div className="flex justify-center flex-wrap gap-2">
        <button
           onClick={() => {
    setActiveView('list');
    // handlemap();
  }}
          className={`px-6 py-2 rounded border transition ${
            activeView === 'list' ? 'bg-orange-400 text-white' : 'bg-white text-black'
          }`}
        >
          List View
        </button>
        <button
           onClick={() => {
    setActiveView('map');
    handlemap();
  }}
          className={`px-6 py-2 rounded border transition ${
            activeView === 'map' ? 'bg-orange-400 text-white' : 'bg-white text-black'
          }`}
        >
          Map View
        </button>
      </div>

      {/* Saved Stations List */}
      {activeView === 'list' && (
        <div className="border rounded-md p-4 space-y-4">
          <h2 className="text-lg font-semibold text-center sm:text-left">Saved Stations</h2>

         {stationData?.length > 0 ? (
  stationData.map((station, index) => (
    <div key={station._id || index} className="flex flex-col sm:flex-row items-center bg-orange-50 p-4 rounded gap-4">
      <div className="flex-1 text-center sm:text-left">
        <span className="font-medium">{station.name}</span>
        <p className="text-sm text-gray-600">
          address : {station.address}
        </p>
        {/* <p className="text-sm text-gray-600">operator: {station.operator}</p> */}
        <p className="text-xs text-gray-400">Saved at: {new Date(station.createdAt).toLocaleString()}</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm">★</div>
        {/* <button className="bg-orange-500 text-white px-4 py-1 rounded text-sm">Book</button> */}
      </div>
    </div>
  ))
) : (
  <p className="text-center text-gray-500">No saved stations found.</p>
)}


          
        </div>
      )}
    </div>
  );
};

export default Savedstations;
