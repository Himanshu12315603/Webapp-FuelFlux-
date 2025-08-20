import React, { useState, useEffect } from "react";
import { Car, Calendar, Clock, MapPin, Fuel } from "lucide-react";
 import Map from '../assets/map.png'; // adjust path as needed
import HeaderComp from "../components/HeaderComp";
import { useNavigate , useLocation } from "react-router-dom";
import FooterComp from "../components/FooterComp";
import axios from "axios";
import axiosInstance from "../../Utils/axiosInstance";

const Bookings = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pump = location.state?.pump || {};
  // Debug: log pump data on mount
  useEffect(() => {
    console.log('Selected pump data:', pump);
    console.log('Available fuel types:', pump.fuelTypes);
  }, [pump]);

  // Normalize fuel types to lowercase for comparison
  const availableFuelTypes = Array.isArray(pump.fuelTypes) ? pump.fuelTypes.map(f => f.toLowerCase()) : [];
  // Set default selected fuel type to first available
  const [fueltype, setFueltype] = useState(
    pump.selectedFuelType?.toLowerCase() || availableFuelTypes[0] || ""
  );
  const [error, setError] = useState("");

  // Only allow selection of available fuel types
  const handleFuelTypeSelect = (type) => {
    // Compare in lowercase
    if (availableFuelTypes.includes(type.toLowerCase())) {
      setFueltype(type.toLowerCase());
      setError("");
    } else {
      setError(`${type} is not available at this pump.`);
    }
  };

    // const [vehicle , setVehicle] = useState('');
    const [quantity ,setQuantity]  = useState('');
    const [dateofbook , setDateofbook] = useState('');
    const [time , setTime ] = useState('');
    
    const[nofnozel , setnonozel] = useState('');
      
    
const handlebooking = async (e) => {
  e.preventDefault();

  const today = new Date();
  const selectedDate = new Date(dateofbook);
  const [selectedHour, selectedMinute] = time.split(":").map(Number);
  selectedDate.setHours(selectedHour);
  selectedDate.setMinutes(selectedMinute);

  const todayDateString = today.toISOString().split("T")[0];

  // Validation
  if (
    !quantity || quantity <= 0 ||
    !dateofbook || dateofbook.trim() === '' ||
    !time || time.trim() === '' ||
    !nofnozel || nofnozel <= 0 ||
    !fueltype || fueltype.trim() === ''
  ) {
    alert("Please fill in all fields before booking.");
    return;
  }

  // Check if date is in the past
  if (new Date(dateofbook) < new Date(todayDateString)) {
    alert("Selected date is in the past. Please choose a valid date.");
    return;
  }

  // Check if time is in the past for today
  if (dateofbook === todayDateString) {
    const currentHour = today.getHours();
    const currentMinute = today.getMinutes();

    if (
      selectedHour < currentHour ||
      (selectedHour === currentHour && selectedMinute <= currentMinute)
    ) {
      alert("Selected time is in the past. Please choose a valid time.");
      return;
    }
  }

  try {
    const response = await axiosInstance.post('/api/booking/bookingconfirmed', {
      quantity: Number(quantity),
      dateofbook: dateofbook.trim(),
      time: time.trim(),
      nofnozel: Number(nofnozel),
      fueltype: fueltype,
      station: {
        name: pump.name,
        address: pump.address,
        operator: pump.operator,
        id: pump._id
      }
    });
    console.log("booking info:", response.data);
    localStorage.setItem("step_booking", "done");
    // Save selected fueltype and prices to localStorage for payment page
    localStorage.setItem('selectedFuelType', fueltype);
    localStorage.setItem('selectedPrices', JSON.stringify(pump.prices || {}));
    localStorage.setItem('selectedQuantity', quantity);
    navigate('/bookpayment');
  } catch (error) {
    console.log('Something went wrong!', error);
    alert("Booking failed. Please try again.");
  }
};


 const [stationData, setStationdata] = useState({}); // initialize as object

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

    if (response.data && Array.isArray(response.data.pumps) && response.data.pumps.length > 0) {
      // Get the latest pump by createdAt (optional: sort)
      const sortedPumps = response.data.pumps.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      const latestPump = sortedPumps[0];
      setStationdata(latestPump); // Store latest pump only
    }
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.clear();
      navigate("/login");
    } else {
      console.error("Failed to fetch stations", error);
    }
  }
};

 useEffect(() => {
    handlestationname();
  }, []);

   const [registerno , setRegistrationno] = useState('');
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


  return (
    <div>

      <HeaderComp/>
    <div className="relative w-full min-h-screen bg-white">
      
      <div className="absolute inset-0 z-0">
        <img src={Map} alt="Map" className="w-full h-full object-cover opacity-40" />
      </div>

      {/* Foreground content */}
      <div className="relative z-10 p-4 md:p-6 pt-10 max-w-[1000px] mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-center md:text-left">Booking</h1>

        <div className="border-2 border-orange-300 rounded-lg bg-white shadow-md">
          <div className="p-4 space-y-4">
            {/* Station Info */}
            <div    className="flex flex-col sm:flex-row items-center sm:space-x-4 border-2 border-black rounded-md p-2">
            <img
  src="https://cdn.pixabay.com/photo/2024/02/25/07/50/ai-generated-8595365_1280.jpg"
  alt="station"
  className="w-32 h-20 object-cover rounded mb-2 sm:mb-0 cursor-pointer"
    
/>

              <div className="flex items-center">
                <MapPin  className="w-6 h-6 mr-2 text-black" />
                <h2  className="text-lg font-semibold">Selected   Station : {stationData.address} </h2>
              </div>
            </div>

            {/* Services */}
            <div>
              <label className="block font-semibold mb-1">Select Available Fuel Type</label>
              <div className="flex flex-wrap gap-2">
                {availableFuelTypes.length > 0 ? (
                  availableFuelTypes.map((type) => (
                    <button
                      key={type}
                      className={`px-4 py-2 border rounded hover:bg-orange-100 ${fueltype === type ? "bg-orange-500" : ""}`}
                      onClick={() => handleFuelTypeSelect(type)}
                      style={{
                        opacity: 1,
                        cursor: "pointer"
                      }}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))
                ) : (
                  <span className="text-red-500">No fuel types available for this pump.</span>
                )}
              </div>
              {error && <div className="text-red-500 mt-2">{error}</div>}
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div  >
                <label className="block mb-1">Enter Your Vehicle Number</label>
                <div className="flex w-72 items-center border border-black rounded px-2">
                  <Car className="w-4 h-4 mr-2 text-gray-500" />
                  {/* <input
  type="text"
  placeholder="Enter Vehicle Number"
  value={vehicle}
  onChange={(e) => setVehicle(e.target.value)}
  className="w-full py-1 outline-none"
  required
/> */}
{registerno || 'Loading...'}
                
                </div>
              </div>

              <div className="w-72">   
                <label className="block mb-1">Select Quantity</label>
           <input
  type="number"
  min="1"
  placeholder="Enter Liters"
  value={quantity}
  onChange={(e) => setQuantity(Number(e.target.value))}
  className="w-full border text-black border-black rounded px-2 py-1"
  required
/>

              </div>

              <div>
                <label className="block mb-1">Select Date</label>
                <div className="flex w-72 items-center border border-black rounded px-2">
                  <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                  {/* <input
  type="date"
  value={dateofbook}
  onChange={(e) => setDateofbook(e.target.value)}
  className="w-full py-1 outline-none"
  required
/> */}
<input
  type="date"
  value={dateofbook}
  min={new Date().toISOString().split("T")[0]} // Today's date as minimum
  onChange={(e) => setDateofbook(e.target.value)}
  className="w-full py-1 outline-none"
  required
/>

                </div>
              </div>

              <div>
                <label className="block mb-1">Select Time</label>
                <div className="flex  w-72 items-center border border-black rounded px-2">
                  {/* <Clock className="w-4 h-4 mr-2 text-gray-500" />
    <input
  type="time"
  value={time}
  onChange={(e) => setTime(e.target.value)}
  className="w-full py-1 outline-none"
  required
/> */}
<Clock className="w-4 h-4 mr-2 text-gray-500" />
<input
  type="time"
  value={time}
  min={dateofbook === new Date().toISOString().split("T")[0] 
    ? `${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`
    : undefined
  }
  onChange={(e) => setTime(e.target.value)}
  className="w-full py-1 outline-none"
  required
/>

                </div>
              </div>

              {/* <div className="md:col-span-2 w-72">
                <label className="block mb-1">Select Location</label>
                
              </div> */}

              <div className="md:col-span-2 w-72 ">
                <label className="block mb-1">Select Counter Number</label>
                <div className="flex items-center border border-black rounded px-2">
                  <Fuel className="w-4 h-4 mr-2 text-gray-500" />
                 <select
  className="w-full py-1 outline-none"
  value={nofnozel}
  onChange={(e) => setnonozel(Number(e.target.value))}
  required
>
  <option value="">Select</option>
  <option value="1">1</option>
  <option value="2">2</option>
  <option value="3">3</option>
  <option value="4">4</option>
</select>
                </div>
              </div>
            </div>

            {/* Confirm Button */}
            <div className="pt-4 flex justify-center">
              <button
                onClick={handlebooking}
                className="w-full md:w-auto px-6 py-3 bg-orange-400 hover:bg-orange-500 text-black font-semibold rounded"
                disabled={availableFuelTypes.length === 0}
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  <FooterComp/>
      </div>
  );
};

export default Bookings;
















// import React, { useState } from "react";
// import { Car, Calendar, Clock, MapPin, Fuel } from "lucide-react";
//  import Map from '../assets/map.png'; // adjust path as needed
// import HeaderComp from "../components/HeaderComp";
// import { useNavigate } from "react-router-dom";
// import FooterComp from "../components/FooterComp";
// import axios from "axios";
// import axiosInstance from "../../Utils/axiosInstance";
// import { useEffect } from "react";
// const Bookings = () => {

//    const navigate = useNavigate();
    
     

//     // const [vehicle , setVehicle] = useState('');
//     const [quantity ,setQuantity]  = useState('');
//     const [dateofbook , setDateofbook] = useState('');
//     const [time , setTime ] = useState('');
    
//     const[nofnozel , setnonozel] = useState('');
//     const [fueltype , setFueltype] = useState('');
      
   
// // const handlebooking = async (e) => {
 
// //   e.preventDefault();

    

// // if (
// //   // vehicle.trim() === '' ||
// //   quantity <= 0 ||
// //   dateofbook.trim() === '' ||
// //   time.trim() === '' ||
// //   nofnozel <= 0 ||
// //   fueltype.trim() === ''
// // ) {
// //   alert("Please fill in all fields before booking.");
// //   return;
// // }



// //   try {
   
// // const formattedTime = time.trim(); // preserves "HH:MM"

// // const response = await axiosInstance.post('/api/booking/bookingconfirmed', {
// //   // vehicle: vehicle.trim(),
// //   quantity: Number(quantity),
// //   dateofbook: dateofbook.trim(),
// //   time: formattedTime, // keep as string in "HH:MM" format
// //   nofnozel: Number(nofnozel),
// //   fueltype: fueltype.trim()
// // });


// //     console.log("booking info:", response.data);
// //      localStorage.setItem("step_booking", "done");
// //     navigate('/bookpayment');
// //   } catch (error) {
// //     console.log('Something went wrong!', error);
// //     alert("Booking failed. Please try again.");
// //   }
// // };


// // const handlebooking = async (e) => {
// //   e.preventDefault();

// //   const today = new Date();
// //   const selectedDate = new Date(dateofbook);
// //   const [hours, minutes] = time.split(":").map(Number);
// //   selectedDate.setHours(hours);
// //   selectedDate.setMinutes(minutes);

// //   if (
// //     quantity <= 0 ||
// //     dateofbook.trim() === '' ||
// //     time.trim() === '' ||
// //     nofnozel <= 0 ||
// //     fueltype.trim() === ''
// //   ) {
// //     alert("Please fill in all fields before booking.");
// //     return;
// //   }

// //   if (new Date(dateofbook) < new Date(today.toDateString())) {
// //     alert("Selected date is in the past. Please choose a valid date.");
// //     return;
// //   }

// //   if (
// //     dateofbook === today.toISOString().split("T")[0] &&
// //     (hours < today.getHours() ||
// //       (hours === today.getHours() && minutes <= today.getMinutes()))
// //   ) {
// //     alert("Selected time is in the past. Please choose a valid time.");
// //     return;
// //   }

// //   try {
// //     const formattedTime = time.trim();

// //     const response = await axiosInstance.post('/api/booking/bookingconfirmed', {
// //       quantity: Number(quantity),
// //       dateofbook: dateofbook.trim(),
// //       time: formattedTime,
// //       nofnozel: Number(nofnozel),
// //       fueltype: fueltype.trim()
// //     });

// //     console.log("booking info:", response.data);
// //     localStorage.setItem("step_booking", "done");
// //     navigate('/bookpayment');
// //   } catch (error) {
// //     console.log('Something went wrong!', error);
// //     alert("Booking failed. Please try again.");
// //   }
// // };


// const handlebooking = async (e) => {
//   e.preventDefault();

//   const today = new Date();
//   const selectedDate = new Date(dateofbook);
//   const [selectedHour, selectedMinute] = time.split(":").map(Number);
//   selectedDate.setHours(selectedHour);
//   selectedDate.setMinutes(selectedMinute);

 