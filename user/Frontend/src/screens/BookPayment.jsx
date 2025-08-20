import React from 'react'
import { useState , useEffect } from 'react';
 
import { Car, Calendar, Clock, MapPin, Fuel, Funnel, StampIcon, FunnelX, SatelliteIcon, FuelIcon, Currency, CurrencyIcon } from "lucide-react";
 import Map from '../assets/map.png'; // adjust path as needed
import HeaderComp from "../components/HeaderComp";
import { useNavigate } from "react-router-dom";
import FooterComp from "../components/FooterComp";
import axios from "axios";
import axiosInstance from "../../Utils/axiosInstance";
import { FaRupeeSign } from 'react-icons/fa';
import { loadRazorpay } from '../../Utils/loadRazorpay';


const BookPayment = () => {

  const navigate = useNavigate(); 
  
    const [bookingData, setBookingdata] = useState('');
    const [stationData, setStationdata] = useState('');
    const [registerno , setRegistrationno] = useState('');
    // Get selected fueltype and prices from localStorage
    const selectedFuelType = localStorage.getItem('selectedFuelType');
    const selectedPrices = JSON.parse(localStorage.getItem('selectedPrices') || '{}');
    const selectedQuantity = Number(localStorage.getItem('selectedQuantity')) || bookingData?.quantity || 0;
    const pricePerLiter = selectedPrices[selectedFuelType] || 0;
    const handleHistorypage = async () => {
      try {
        const response = await axiosInstance.get('/api/booking/getbookings');
        const data = response.data?.bookingdata;
        const booking = data?.[0];
        setBookingdata(booking);
        console.log('Fetched booking:', booking);
      } catch (error) {
        console.log("Something went wrong!", error);
      }
    };
  
    useEffect(() => {
      handleHistorypage();
    }, []);
  
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
        console.log("you booking data" , response.data)
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
  
     const getRegisterno = async () => {
  try {
    const response = await axiosInstance.get('/api/registrationno/getregisterno');
    const dataArray = response.data?.registernodata;

    if (Array.isArray(dataArray) && dataArray.length > 0) {
      const latest = dataArray[0]; // Get the latest created registration
      setRegistrationno(latest.registrationno);
      console.log('Latest register no:', latest);
    } else {
      console.warn("No registration data found");
    }
  } catch (error) {
    console.log("Something went wrong!", error);
  }
};

  useEffect(() => {
   getRegisterno();
  }, []);


  
  const [user, setUser] = useState({});
  
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const response = await axiosInstance.get("/api/users/getregister", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data) {
      setUser(response.data);
    }
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.clear();
      navigate("/login");
    }
  }
};

useEffect(() => {
  fetchUser();
}, []);
const handlePayment = () =>{
  if(!selectedQuantity || !pricePerLiter) {
    alert('Missing quantity or price');
    return;
  }
  const advancePayment = selectedQuantity * pricePerLiter * 0.2;
  const amountInPaise = Math.round(advancePayment * 100);
  loadRazorpay({amountInPaise , user , navigate}) ;
}

return (
  <div>

      <HeaderComp/>
    <div className="relative w-full min-h-screen bg-white">
      
      <div className="absolute inset-0 z-0">
        <img src={Map} alt="Map" className="w-full h-full object-cover opacity-40" />
      </div>

      {/* Foreground content */}
      <div className="relative z-10 p-4 md:p-6 pt-10 max-w-[1000px] mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-center md:text-left">View Booking</h1>

        <div className="border-2 border-orange-300 rounded-lg bg-white shadow-md">
          <div className="p-4 space-y-4">
            {/* Station Info */}
          

           

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Current Price per Liter ({selectedFuelType?.toUpperCase()}):</label>
                <div className="flex w-72 items-center rounded px-2">
                  <FaRupeeSign className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="font-medium">{pricePerLiter || 'loading...'} Rs</span>
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1"> Station Name : </label>
                <div className="flex w-72 items-center    px-2">
                  <FuelIcon className="w-4 h-4 mr-2 text-gray-500" />
                   <span className="font-medium">{stationData?.[0]?.name || 'loading...'}</span>

                </div>
              </div>

              <div  >
                <label className="block font-semibold mb-1"> Your Vehicle : </label>
                <div className="flex w-72 items-center    px-2">
                  <Car className="w-4 h-4 mr-2 text-gray-500" />
                   <p>{registerno || 'Loading...'}</p>
                </div>
              </div>

               <div>
                <label className="block font-semibold mb-1">Date : </label>
                <div className="flex w-72 items-center   px-2">
                  <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                    <p>{bookingData?.dateofbook || 'loading...'}</p>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Quantity : </label>
                <div className="flex w-72 items-center   px-2">
                  <Funnel className="w-4 h-4 mr-2 text-gray-500" />
                    {bookingData?.quantity || 'loading...'} Ltr
                </div>
              </div>

              <div >
                <label className="block font-semibold mb-1">Time : </label>
                <div className="flex  w-72 items-center  rounded px-2">
                  <Clock className="w-4 h-4 mr-2 text-gray-500" />
                    <p>{bookingData?.time || 'loading...'}</p>

                </div>
              </div>

              <div className=" w-72">
                <label className="block font-semibold mb-1">Location :</label>
                <div className="flex items-center     px-2">
                  <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                    <p>{stationData?.[0]?.address || 'loading...'}</p>
                </div>
              </div>

              <div className="md:col-span-2 w-72 ">
                <label className="block font-semibold mb-1">Counter Number :</label>
                <div className="flex items-center  rounded px-2">
                  <Fuel className="w-4 h-4 mr-2 text-gray-500" />
                    <p>{bookingData?.nofnozel || 'loading...'}</p>
                </div>
              </div>

                 <div>
                  
  <label className="block font-semibold mb-1">Advance amount need to pay for booking :</label>
  <div className="flex w-72 items-center rounded px-2">
    <FaRupeeSign className="w-4 h-4 mr-2 text-gray-500" />
    <p>{selectedQuantity * pricePerLiter * 0.2 || 'loading...'} Rs</p>
  </div>
</div>

 <div>
  <label className="block font-semibold mb-1">Total amount need to pay :</label>
  <div className="flex w-72 items-center rounded px-2">
    <FaRupeeSign className="w-4 h-4 mr-2 text-gray-500" />
    <p>{selectedQuantity * pricePerLiter || 'loading...'} Rs</p>
  </div>
</div>


            </div>

            {/* Confirm Button */}
            <div className="pt-4 flex justify-center">
           <button onClick={ handlePayment }
       
  className="w-full md:w-auto px-6 py-3 bg-orange-400 hover:bg-orange-500 text-black font-semibold rounded"
>
 Click to pay 
</button>

            </div>
          </div>
        </div>
      </div>
    </div>
  <FooterComp/>
      </div>
  )
}

export default BookPayment