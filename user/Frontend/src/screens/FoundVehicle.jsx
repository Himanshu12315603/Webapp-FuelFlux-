// import { useState } from 'react';
// import { CheckIcon, PlusIcon, Flame, Zap } from 'lucide-react';
// import bike from '../assets/bike.png';
// import { useNavigate } from 'react-router-dom';
// const FoundVehicle = () => {
//   const [agreed, setAgreed] = useState(true); // checkbox is ticked
//   const navigate = useNavigate();
//   const handleonfinish =()=>{
//    navigate('/waitscreen');
//   }
//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white font-sans">
//       <h2 className="text-2xl sm:text-3xl font-semibold text-black mb-6 text-center">
//         Found your Vehicle !
//       </h2>

//       <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full max-w-6xl">
//         <div className="w-full md:w-[400px] border-2 bg-[#F3F3F3] border-black rounded-md p-4 shadow-md">
//           <div className="flex flex-col md:flex-row gap-3 items-center justify-center   ">
//             <img
//               src={bike}
//               alt="bike"
//               className="h-40 w-40 object-contain mb-3"
//             />
//             <div className="text-sm text-gray-600 text-left w-full mt-2">
//               <h3 className="text-md md:text-xl font-bold tracking-widest text-black mb-1">
//                 GJ-19-BA-4772
//               </h3>
//               <p className="font-poppins md:text-[13px] text-[10px]">
//                 <span className="font-poppins font-semibold md:text-xl text-sm">
//                   Chassis Number:{' '}
//                 </span>
//                 1HGCM82633A123456
//               </p>
//               <p className="font-poppins md:text-[13px] text-[10px]">
//                 <span className="font-poppins font-semibold md:text-xl text-sm">
//                   Model:
//                 </span>{' '}
//                 BAJAJ AUTO LTD - 135 - LS
//               </p>
//               <p className="font-poppins md:text-[13px] text-[10px]">
//                 <span className="font-poppins font-semibold md:text-xl text-sm">
//                   Registration Date:
//                 </span>{' '}
//                 MARCH 2022
//               </p>
//               <p className="font-poppins md:text-[13px] text-[10px]">
//                 <span className="font-poppins font-semibold md:text-xl text-sm">
//                   Vehicle Class:
//                 </span>{' '}
//                 BIKE
//               </p>

//               <div className="flex flex-wrap gap-3 mt-4">
//                 <button className="flex items-center gap-1 bg-orange-100 border border-orange-500 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
//                   <Flame size={14} /> Petrol
//                 </button>
//                 <button className="flex items-center gap-1 bg-yellow-100 border border-yellow-500 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
//                   <Zap size={14} /> Electric
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

      
//         {/* <div className="w-full md:w-[400px] md:h-[220px] border-2 border-dashed border-orange-500 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-orange-50 transition">
//           <div className="flex items-center justify-center border-2 border-orange-500 rounded-full h-16 w-16 mb-2">
//             <PlusIcon className="text-orange-500" size={28} />
//           </div>
//           <p className="text-orange-600 font-semibold text-lg">Add New Vehicle</p>
//         </div> */}
//       </div>
 
//       <div className="flex flex-col items-center gap-4 mt-10">
//         <button onClick={()=>{
//           handleonfinish();
//         }} className="bg-[#E47B37] text-white text-lg w-full py-2 rounded-md hover:bg-orange-600">
//           Finish
//         </button>
//         <label className="flex items-center text-sm text-gray-600 cursor-pointer select-none">
//           <input
//             type="checkbox"
//             checked={agreed}
//             onChange={() => setAgreed(!agreed)}
//             className="hidden"
//           />
//           <span className="w-5 h-5 mr-2 border border-gray-400 rounded-sm flex items-center justify-center">
//             {agreed && <CheckIcon className="w-4 h-4 text-gray-700" />}
//           </span>
//           I agree to the T & C
//         </label>
//       </div>
//     </div>
//   );
// };

// export default FoundVehicle;
// import { useEffect, useState } from 'react';
// import { CheckIcon, Flame, Zap } from 'lucide-react';
// import bike from '../assets/bike.png';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import axiosInstance from '../../Utils/axiosInstance';

// const FoundVehicle = () => {
//   const [agreed, setAgreed] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState('');
//   const [registration , setRegistration] = useState(' ');
  
//   const navigate = useNavigate();

//   const handleonfinish = async () => {
//     if (!agreed) return alert('You must agree to the terms and conditions.');
//     setLoading(true);
//     try {
//       const res = await axios.post(
//         'http://localhost:3000/api/registration/createregistration',
//         formData
//       );
//       console.log('Submitted:', res.data);
//       navigate('/waitscreen');
//     } catch (err) {
//       console.error('Error submitting:', err);
//       alert('Error while submitting form');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//     const getRegistrationno = aync () => {
//     await axiosInstance.get('/api/registration/getregistration')
//   .then((response) => {
//     const data = response.data?.registrationdata;
//     setRegistration(data);
//     setFormData((prev) => ({
//       ...prev,
//       registrationno: data?.registrationno
//     }));
//   })
//   .catch((error) => {
//     console.error('Error fetching registration:', error);
//   });

//     };
//     useEffect(()=>{
//       getRegistrationno() ;
//     } , []);

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white font-sans">
//       <h2 className="text-2xl sm:text-3xl font-semibold text-black mb-6 text-center">
//         Found your Vehicle !
//       </h2>

//       <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full max-w-6xl">
//         <div className="w-full md:w-[400px] border-2 bg-[#F3F3F3] border-black rounded-md p-4 shadow-md">
//           <div className="flex flex-col md:flex-row gap-3 items-center justify-center">
//             <img
//               src={bike}
//               alt="bike"
//               className="h-40 w-40 object-contain mb-3"
//             />
//             <div className="text-sm text-gray-600 text-left w-full mt-2">
//               {/* <input
//                 name="registrationno"
//                 value={formData.registrationno}
//                 onChange={handleChange}
//                 className="text-md md:text-xl font-bold tracking-widest text-black mb-1 w-full bg-transparent border-b border-gray-400 focus:outline-none"
//               /> */}
//               <h1 className="text-md md:text-xl font-bold tracking-widest text-black mb-1 w-full bg-transparent border-b border-gray-400 focus:outline-none">
//                   {registrationno?.registrationno || 'Loading...'}
//               </h1>
               

//               <div className="mt-1">
//                 <label className="font-semibold md:text-xl text-sm">Model:</label>
//                 <input
//                   name="modelofvehicle"
//                   value={formData.modelofvehicle}
//                   onChange={handleChange}
//                   className="font-poppins md:text-[13px] text-[10px] w-full bg-transparent border-b border-gray-400 focus:outline-none"
//                 />
//               </div>

              

//               <div className="mt-1">
//                 <label className="font-semibold md:text-xl text-sm">Vehicle Class:</label>
//                 <input
//                   name="vehicleclass"
//                   value={formData.vehicleclass}
//                   onChange={handleChange}
//                   className="font-poppins md:text-[13px] text-[10px] w-full bg-transparent border-b border-gray-400 focus:outline-none"
//                 />
//               </div>

//               <div className="flex flex-wrap gap-3 mt-4">
//                 {['Petrol', 'Electric', 'Diesel'].map((type) => (
//                   <button
//                     key={type}
//                     type="button"
//                     onClick={() =>
//                       setFormData((prev) => ({ ...prev, vehicletype: type }))
//                     }
//                     className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${
//                       formData.vehicletype === type
//                         ? 'bg-orange-500 text-white border-orange-500'
//                         : 'bg-gray-100 text-gray-700 border-gray-300'
//                     }`}
//                   >
//                     {type === 'Petrol' && <Flame size={14} />}
//                     {type === 'Electric' && <Zap size={14} />}
//                     {type}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="flex flex-col items-center gap-4 mt-10">
//         <button
//           onClick={handleonfinish}
//           className="bg-[#E47B37] text-white text-lg w-full py-2 px-6 rounded-md hover:bg-orange-600"
//           disabled={loading}
//         >
//           {loading ? 'Submitting...' : 'Finish'}
//         </button>

//         <label className="flex items-center text-sm text-gray-600 cursor-pointer select-none">
//           <input
//             type="checkbox"
//             checked={agreed}
//             onChange={() => setAgreed(!agreed)}
//             className="hidden"
//           />
//           <span className="w-5 h-5 mr-2 border border-gray-400 rounded-sm flex items-center justify-center">
//             {agreed && <CheckIcon className="w-4 h-4 text-gray-700" />}
//           </span>
//           I agree to the T & C
//         </label>
//       </div>
//     </div>
//   );
// };

// export default FoundVehicle;



import { useEffect, useState } from 'react';
import { CheckIcon, Flame, Zap, Droplet, CircleDot } from 'lucide-react';

import bike from '../assets/bike.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../Utils/axiosInstance';

const FoundVehicle = () => {
  const [agreed, setAgreed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    modelofvehicle: '',
    vehicleclass: '',
    vehicletype: '',
  });
  
 const [registerno , setRegistrationno] = useState('');
  const navigate = useNavigate();

  const handleonfinish = async () => {
    if (!agreed) return alert('You must agree to the terms and conditions.');
    setLoading(true);
    try {
      const res = await axiosInstance.post('/api/registration/createregistration',
        formData
      );
      console.log('Submitted:', res.data);
      // navigate('/waitscreen');
      localStorage.setItem("step_foundvehicle", "done");
     navigate("/waitscreen");

    } catch (err) {
      console.error('Error submitting:', err);
      alert('Error while submitting form');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
 
// useEffect(() => {
//   const fetchLatestRegistration = async () => {
//     try {
//       const response = await axiosInstance.get('/api/registration/getregistration');
//       console.log("Fetched registration:", response.data.registrationdata);

//       const data = response.data.registrationdata;
//       if (data) {
//         setRegistration(data.registrationno);
//         setFormData({
//           modelofvehicle: data.modelofvehicle || '',
//           vehicleclass: data.vehicleclass || '',
//           vehicletype: data.vehicletype || '',
//         });
//       } else {
//         console.warn("No latest registration found");
//       }
//     } catch (err) {
//       console.error("Failed to fetch registration:", err);
//     }
//   };

//   fetchLatestRegistration();
// }, []);


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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white font-sans">
      <h2 className="text-2xl sm:text-3xl font-semibold text-black mb-6 text-center">
        Found your Vehicle!
      </h2>

      <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full max-w-6xl">
        <div className="w-full md:w-[400px] border-2 bg-[#F3F3F3] border-black rounded-md p-4 shadow-md">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-center">
            <img
              src={bike}
              alt="bike"
              className="h-40 w-40 object-contain mb-3"
            />
            <div className="text-sm text-gray-600 text-left w-full mt-2">
              <h1 className="text-md md:text-xl font-bold tracking-widest text-black mb-1 w-full">
  {registerno || 'Loading...'}
</h1>


              <div className="mt-1">
                <label className="font-semibold md:text-xl text-sm">Model:</label>
                <input
                  name="modelofvehicle"
                  value={formData.modelofvehicle}
                  onChange={handleChange}
                  className="font-poppins md:text-[13px] text-[10px] w-full bg-transparent border-b border-gray-400 focus:outline-none"
                />
              </div>

              <div className="mt-1">
                <label className="font-semibold md:text-xl text-sm">Vehicle Class:</label>
                <input
                  name="vehicleclass"
                  value={formData.vehicleclass}
                  onChange={handleChange}
                  className="font-poppins md:text-[13px] text-[10px] w-full bg-transparent border-b border-gray-400 focus:outline-none"
                />
              </div>

              {/* <div className="flex flex-wrap gap-3 mt-4">
                {['Petrol', 'Electric', 'Diesel', 'CNG', 'Other'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, vehicletype: type }))
                    }
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${
                      formData.vehicletype === type
                        ? 'bg-orange-500 text-white border-orange-500'
                        : 'bg-gray-100 text-gray-700 border-gray-300'
                    }`}
                  >
                    {type === 'Petrol' && <Flame size={14} />}
{type === 'Electric' && <Zap size={14} />}
{type === 'Diesel' && <Droplet size={14} />}
{type === 'CNG' && <CircleDot size={14} />}
{type === 'Other' && <Zap size={14} />}

                  </button>
                ))}
              </div> */}

<div className="flex flex-wrap gap-3 mt-4">
  {['Petrol', 'Electric', 'Diesel', 'CNG', 'Other'].map((type) => (
    <button
      key={type}
      type="button"
      onClick={() => setFormData((prev) => ({ ...prev, vehicletype: type }))}
      className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${
        formData.vehicletype === type
          ? 'bg-orange-500 text-white border-orange-500'
          : 'bg-gray-100 text-gray-700 border-gray-300'
      }`}
    >
      {type === 'Petrol' && <Flame size={14} />}
      {type === 'Electric' && <Zap size={14} />}
      {type === 'Diesel' && <Droplet size={14} />}
      {type === 'CNG' && <CircleDot size={14} />}
      {type === 'Other' && <Zap size={14} />}
      {type}
    </button>
  ))}
</div>


            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 mt-10 w-full max-w-md">
        <button
          onClick={handleonfinish}
          className="bg-[#E47B37] text-white text-lg w-full py-2 rounded-md hover:bg-orange-600"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Finish'}
        </button>

        <label className="flex items-center text-sm text-gray-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={agreed}
            onChange={() => setAgreed(!agreed)}
            className="hidden"
          />
          <span className="w-5 h-5 mr-2 border border-gray-400 rounded-sm flex items-center justify-center">
            {agreed && <CheckIcon className="w-4 h-4 text-gray-700" />}
          </span>
          I agree to the T & C
        </label>
      </div>
    </div>
  );
};

export default FoundVehicle;
