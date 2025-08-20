 

import React from 'react';
import AllowLocation from '../assets/AllowLocation.png';
import { useNavigate } from "react-router-dom";
import axiosInstance from '../../Utils/axiosInstance';
const handleAllowLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
     
        try {
          const geoRes = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=cffd4711030d452a97a1d40ddfe8e242`
          );

          const geoData = await geoRes.json();
          console.log("Full geoData:", geoData); // Debug the actual data structure

          const components = geoData?.results?.[0]?.components || {};

          const city = components.city ||
                       components.town ||
                       components.village ||
                       components.county ||
                       components.state_district ||
                       components.suburb ||
                       "Unknown";

          const country = components.country || "Unknown";

          console.log("You are in:", city, country);

          // Save to backend
          const response = await axiosInstance.post('/api/location/permission', {
            latitude,
            longitude,
            city,
            country
          });
          console.log("Saved the location", response.data);
          
        } catch (err) {
          console.error("Reverse geocoding failed:", err);
        }
      },
      (error) => {
        console.error('Error getting location:', error);
        if (error.code === 1) {
          alert("Permission denied. Please allow location access in your browser settings.");
        } else if (error.code === 2) {
          alert("Position unavailable. Try checking your internet or GPS.");
        } else if (error.code === 3) {
          alert("Request timed out. Try again.");
        } else {
          alert("An unknown error occurred.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  } else {
    alert('Geolocation is not supported by this browser.');
  }
};

const PermissonPage = () => {
  const navigate = useNavigate();

  const handleMaybelater = () => {
    navigate('/addvehicle');
  }
  return (
    <div className='bg-white flex flex-col gap-4 min-h-screen justify-center items-center text-center px-4 font-poppins'>
      <img
        className='h-[180px] w-[200px] md:h-[220px] md:w-[240px]'
        src={AllowLocation}
        alt="Location.png"
      />
      <h1 className='font-bold text-2xl md:text-3xl text-black'>
        Would you like to explore <br />
        near fuel stations?
      </h1>
      <h3 className='text-[#7B7A7A] font-semibold text-base md:text-lg'>
        Allow FuelFlux to use your location once, or while using this site
      </h3>
      <button onClick={()=>{
        handleAllowLocation();
        handleMaybelater();
      }} className='px-6 py-3 bg-[#E47B37] rounded-md text-white text-sm md:text-base hover:bg-orange-600 transition'>
        Allow Location Services
      </button>
      {/* <button onClick={handleMaybelater} className='text-[#7B7A7A] text-sm md:text-lg'>
        Maybe later
      </button> */}
    </div>
  );
};

export default PermissonPage;
