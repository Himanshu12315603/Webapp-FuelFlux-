// import React, { useEffect } from 'react'
// import { FaCheckCircle } from "react-icons/fa";
// import { FaRegCalendarAlt, FaMapMarkerAlt  } from "react-icons/fa";
// import { Fuel } from "lucide-react";
// import axiosInstance from '../../Utils/axiosInstance';
// import { useState } from 'react';
// import { useNavigate } from 'react-router';
 
// const Historypage = () => {
//   const navigate = useNavigate(); //  

  
//   const [bookingData, setBookingdata] = useState([]);

//   const [stationData, setStationdata] = useState([]);
// const [selectedBooking, setSelectedBooking] = useState(null);
// const [showModal, setShowModal] = useState(false);

  


//   const handleHistorypage = async () => {
//   try {
//     const response = await axiosInstance.get('/api/booking/getbookings');
//     // const data = response.data?.bookingdata || [];
//     const data = response.data?.bookingdata ;
//     // setBookingdata(data);
//      setBookingdata(Array.isArray(data) ? data : []);
//     console.log('Fetched bookings:', data);
//   } catch (error) {
//     console.log("Something went wrong!", error);
//   }
// };


//   useEffect(() => {
//     handleHistorypage();
//   }, []);

//  const handlestationname = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         navigate('/login');  
//         return;
//       }
//       const response = await axiosInstance.get('/api/stations/getpetrolpumps', {
//         headers: {
//        Authorization: `Bearer ${token}`,
 
//         },
//       });
      
//       const dataArray = response.data?.pumps;
//       if (Array.isArray(dataArray)) {
//       setStationdata(dataArray); // store full array
//       console.log('All registerno:', dataArray);
//     } else {
//       console.warn("No registration data found");
//     }
//     } catch (error) {
//       if (error.response && error.response.status === 401) {
//         localStorage.clear();
//         navigate("/login");
//       }
//     }
//   };

//   useEffect(() => {
//     handlestationname();
//   }, []);


   


//   return (
//     <div className="min-h-screen bg-white flex flex-col items-center pt-8">
       

      
//      {stationData.length === 0 || bookingData.length === 0 ? (
//   <p>No vehicle registrations found.</p>
// ) : (
      
//   bookingData.map((booking, index) => (

//     <div key={index} className="w-full max-w-2xl border rounded-lg shadow-sm p-5 bg-white mb-4">
      
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <span className="text-3xl font-bold text-black">{booking.quantity} Ltr</span>
//           <div className="flex items-center mt-1">
//             <FaCheckCircle className="text-green-500 mr-2" />
//             <span className="text-green-500 font-semibold">Order Completed</span>
//           </div>
//           <div className="mt-2 text-black text-base">Amount: 2500</div>
//         </div>

//         <div className="mt-4 sm:mt-0 flex flex-col gap-2">
//           <div className="flex items-center text-black">
//             <FaRegCalendarAlt className="mr-2 text-xl" />
//             <span className="font-medium">{booking.time} | {booking.dateofbook}</span>
//           </div>

          
//            <div className="flex items-center text-black">
//             <FaMapMarkerAlt className="mr-2 text-xl" />
//             <span className="font-medium">  {stationData[index]?.name || 'N/A'}</span>
//           </div> 

//           <div className="flex items-center text-black">
//             <Fuel className="mr-2 text-xl" />
//             <span className="font-medium">{booking.fueltype}</span>
//           </div>
//         </div>
//       </div>




//     </div>
//   ))
// )  
// }
//     </div>
//   )
// }

   

// export default Historypage


import React, { useEffect, useState } from 'react';
import { FaCheckCircle } from "react-icons/fa";
import { FaRegCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import { Fuel } from "lucide-react";
import axiosInstance from '../../Utils/axiosInstance';
import { useNavigate } from 'react-router';

const Historypage = () => {
  const navigate = useNavigate();
  const [bookingData, setBookingdata] = useState([]);
  const [stationData, setStationdata] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [registernos, setRegisternos] = useState([]); // updated state
  const [overview, setOverview] = useState([]);
  const [paymentid , setPaymentid] = useState([]) ;
  const handleHistorypage = async () => {
    try {
      const response = await axiosInstance.get('/api/booking/getbookings');
      const data = response.data?.bookingdata;
      setBookingdata(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Something went wrong!", error);
    }
  };

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
      const dataArray = response.data?.pumps;
      if (Array.isArray(dataArray)) {
        setStationdata(dataArray);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    handleHistorypage();
    handlestationname();
  }, []);


 const getRegisterno = async () => {
  try {
    const response = await axiosInstance.get('/api/registrationno/getregisterno');
    const dataArray = response.data?.registernodata;

    if (Array.isArray(dataArray)) {
      setRegisternos(dataArray); // store full array
      console.log('All registerno:', dataArray);
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

    const handleOverview = async () => {
    try {
      const response = await axiosInstance.get('/api/registration/getregistration');
      const data = response.data?.registrationdata;  
      // setOverview(data);
      setOverview(Array.isArray(data) ? data : []);
  
      console.log('overview info:', data);
    } catch (error) {
      console.error('Something went wrong!', error);
    }
  };
  
  
    useEffect(() => {
      handleOverview();
    }, []);
  
   const handlePayment = async () => {
  try {
    const response = await axiosInstance.get('/api/payments/getpayment');
    const dataArray = response.data?.paymentdetail;

    if (Array.isArray(dataArray)) {
      setPaymentid(dataArray);
      console.log("All paymentid:", dataArray);
    } else {
      console.log("No Payment id found");
    }
  } catch (error) {
    console.log("Something went wrong!", error);
  }
};

useEffect(() => {
   handlePayment();
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-8">

      {stationData.length === 0 || bookingData.length === 0 ? (
        <p>No vehicle registrations found.</p>
      ) : (
        bookingData.map((booking, index) => (
          <div
            key={index}
            onClick={() => {
              setSelectedBooking({ booking: bookingData[index], station: stationData[index] , register: registernos[index] , vehicleinfo: overview[index] , paymentinfo: paymentid[index]   });
              setShowModal(true);
            }}
            className="cursor-pointer w-full max-w-2xl border rounded-lg shadow-sm p-5 bg-white mb-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="text-3xl font-bold text-black">{booking.quantity} Ltr</span>
                <div className="flex items-center mt-1">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  <span className="text-green-500 font-semibold">Order Completed</span>
                </div>
                <div className="mt-2 text-black text-base">Amount: ₹{booking.quantity * 100}</div>
              </div>

              <div className="mt-4 sm:mt-0 flex flex-col gap-2">
                <div className="flex items-center text-black">
                  <FaRegCalendarAlt className="mr-2 text-xl" />
                  <span className="font-medium">{booking.time} | {booking.dateofbook}</span>
                </div>

                <div className="flex items-center text-black">
                  <FaMapMarkerAlt className="mr-2 text-xl" />
                  <span className="font-medium">{stationData[index]?.name || 'N/A'}</span>
                </div>

                <div className="flex items-center text-black">
                  <Fuel className="mr-2 text-xl" />
                  <span className="font-medium">{booking.fueltype}</span>
                </div>
              </div>
            </div>
          </div>
        ))
      )}

      {/* ✅ Modal */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-2">
          <div className="relative bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-lg p-4 shadow-xl">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-4 text-2xl font-bold text-gray-700 hover:text-red-600"
            >
              &times;
            </button>

            {/* Modal Content */}
            <h2 className="text-xl font-bold mb-4 text-center">Order Details</h2>

            {/* Vehicle Details */}
            <div className="mb-4">
              <h3 className="font-semibold">Vehicle Details</h3>
              <p><strong>Registration No : </strong> {selectedBooking.register.registrationno}</p>
              <p><strong>Vehicle Model : </strong> {selectedBooking.vehicleinfo.modelofvehicle}</p>
              <p><strong>Vehicle Type : </strong> {selectedBooking.vehicleinfo.vehicletype}</p>

              
              
            </div>

            {/* Shipping Info */}
            <div className="mb-4">
              <h3 className="font-semibold">Petrol Pump Information</h3>
              <p><strong>Pump Name : </strong>{selectedBooking.station.name}   </p>
              <p><strong>Pump Location : </strong> {selectedBooking.station.address} </p>
            </div>

            {/* Cargo Info */}
            <div className="mb-4">
              <h3 className="font-semibold">Cargo Information</h3>
              <p><strong>Fuel Type : </strong> {selectedBooking.booking.fueltype}</p>
              <p><strong>Quantity : </strong> {selectedBooking.booking.quantity} Ltr</p>
              <p><strong>Date Of Booking : </strong>{selectedBooking.booking.dateofbook}</p>
              <p><strong>Time of Booking :  </strong>{selectedBooking.booking.time} </p>
            </div>

            {/* Payment Info */}
            <div>
              <h3 className="font-semibold">Payment Details</h3>
              <p><strong>Total Amount : </strong> ₹{selectedBooking.booking.quantity * 100}</p>
              <p><strong>Remaining Amount : </strong> ₹{selectedBooking.booking.quantity * 100 * 0.8}</p>
              <p><strong>AdvancePayment Amount : </strong> ₹{selectedBooking.booking.quantity * 100 - selectedBooking.booking.quantity * 100 * 0.8}</p>
              <p><strong>Payment Mode : </strong> Advance</p>
              <p><strong>Status : </strong> <span className="text-yellow-600 font-semibold">Partially Paid</span></p>
              <p><strong>Booking Date : </strong> {selectedBooking.booking.dateofbook}</p>
              <p><strong>Payment Id  : </strong> {selectedBooking.paymentinfo?.payment_id || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Historypage;
