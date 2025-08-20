import React, { useEffect, useState } from 'react';
import Right from '../assets/right.png';
import HeaderComp from '../components/HeaderComp';
import FooterComp from '../components/FooterComp';
import Map from '../assets/map.png';
import axiosInstance from '../../Utils/axiosInstance';

const Bookconfirmed = () => {
  const [bookingData, setBookingdata] = useState(null);

  const handleBookconfirmed = async () => {
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
    handleBookconfirmed();
  }, []);

  return (
    <div>
      <HeaderComp />
      <div className="relative w-full min-h-screen bg-white">
       
        <div className="absolute inset-0 z-0">
          <img src={Map} alt="Map" className="w-full h-full object-cover opacity-40" />
        </div>

        <div className="relative z-10 p-4 md:p-6 pt-10 max-w-[1000px] mx-auto">
          <h1 className="text-3xl font-bold mb-4 text-center md:text-left">Booking Confirmed</h1>

          <div className="border-2 border-orange-300 rounded-lg bg-white shadow-md">
            <div className="p-4 space-y-4 flex flex-col justify-center items-center">
              <img className='w-36 h-36' src={Right} alt="Confirmation" />
              <h1>Your Booking is Confirmed</h1>

              <div className='space-y-2'>
                <h1 className='border-2 border-gray-600 p-1'>Booking Id:
                  <span className='text-[#7B7A7A]'> {bookingData?._id || 'Loading...'}</span>
                </h1>
                <h1 className='border-2 border-gray-600 p-1'>Station Name:
                  <span className='text-[#7B7A7A]'> {bookingData?.stationname || 'Loading...'}</span>
                </h1>

                <h1 className='border-2 border-gray-600 p-1'>Date and Time : 
                  <span className='text-[#7B7A7A]'>
                    {bookingData ? `${bookingData.dateofbook} at ${formatTime(bookingData.time)}` : 'Loading...'}
                  </span>
                </h1>
              </div>

              <button className="w-full md:w-auto px-6 py-3 bg-orange-400 hover:bg-orange-500 text-black font-semibold rounded">
                Start to navigate
              </button>
            </div>
          </div>
        </div>
      </div>
      <FooterComp />
    </div>
  );
};

const formatTime = (timeStr) => {
  if (!timeStr || timeStr.length !== 4) return timeStr;
  const hour = parseInt(timeStr.slice(0, 2), 10); // convert to number to remove leading 0
  const minute = timeStr.slice(2);
  return `${hour}:${minute}`;
};

export default Bookconfirmed;
