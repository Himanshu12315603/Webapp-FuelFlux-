 

import React, { useState } from 'react';
import Carimg from '../assets/City driver-rafiki(1) 1.png';
import Inshurance from '../assets/Inshurance.png';
import Pollution from '../assets/pollutionmain.png';
import challan from '../assets/chalan.png';
import hydrotesting from '../assets/hydrotesting.png';
import { useNavigate } from "react-router-dom";
import axiosInstance from '../../Utils/axiosInstance';

const AddVehiclePage = () => {
  const [registrationno, setRegistrationno] = useState('');
  const navigate = useNavigate();

  // Handle form submission
  const handleregistration = async (e) => {
    e.preventDefault();

    if (!registrationno) {
      alert('Please fill the registration number!');
      return;
    }

    try {
      const response = await axiosInstance.post('/api/registrationno/registerno', {
        registrationno
      });

      console.log("Saved vehicle:", response.data);
      // navigate("/foundvehicle");
    localStorage.setItem("step_addvehicle", "done");
     navigate("/foundvehicle");

    } catch (error) {
      console.error("Error saving vehicle info:", error);
    }
  };

  // Handle location permission
  const handleAllowLocation = () => {
    localStorage.setItem("step_addvehicle", "done");
  localStorage.setItem("step_foundvehicle", "done");
  localStorage.setItem("step_waitscreen", "done");
    navigate('/mainpage')
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 sm:p-6">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left section with illustration */}
        <div className="flex flex-col justify-center items-center text-center md:text-left">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-poppins mb-4 text-black">
            Add your vehicle
          </h1>
          <img src={Carimg} alt="Car Illustration" className="w-72 sm:w-80 md:w-full max-w-sm" />
        </div>

        {/* Right section with form */}
        <div className="flex flex-col items-center justify-center gap-4">
          <p className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2 text-center">
            Vehicle Registration Number
          </p>

          <form
            onSubmit={handleregistration}
            className="border-2 border-orange-500 px-4 py-3 rounded-lg mb-4"
          >
            <input
              type="text"
              id="vehicleNumber"
              name="vehicleNumber"
              pattern="[A-Z]{2}-\d{2}-[A-Z]{1,2}-\d{4}"
              required
              placeholder="e.g., GJ-19-BA-4772"
              className="w-full text-xl sm:text-2xl font-bold tracking-wider text-black text-center outline-none"
              onChange={(e) => setRegistrationno(e.target.value)}
            />
            <p className="text-sm text-gray-500 mt-1 text-center">
              Format: XX-00-XX-0000 (e.g., GJ-19-BA-4772)
            </p>
            <button type="submit" className="w-full mt-3 px-5 py-2 bg-[#F69454] text-white rounded hover:bg-orange-600">
              Submit
            </button>
          </form>

          {/* Feature Icons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { img: Inshurance, label: 'Vehicle Insurance' },
              { img: Pollution, label: 'Pollution Certificate' },
              { img: challan, label: 'Traffic Challan' },
              { img: hydrotesting, label: 'CNG Hydrotesting' }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                <img src={item.img} alt={item.label} className="h-16 w-16" />
                <p className="text-[#565656] text-sm sm:text-base mt-1">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Location Button */}
          <div className="flex flex-col items-center gap-2 mt-5 w-full">
           <button
  onClick={handleAllowLocation}
  className="bg-[#E47B37] text-white px-4 py-3 rounded-md text-xl sm:text-2xl hover:bg-orange-600"
>
  If already registered click to skip  
</button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AddVehiclePage;
