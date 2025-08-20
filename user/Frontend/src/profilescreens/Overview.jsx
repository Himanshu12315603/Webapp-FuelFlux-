 
// import React, { useEffect, useState } from 'react';
// import axiosInstance from '../../Utils/axiosInstance';
// import { useNavigate } from 'react-router';
// const Overview = () => {
//   const [overview, setOverview] = useState(null);
//    const [registerno , setRegistrationno] = useState('');
//   const navigate = useNavigate();
//   const handleOverview = async () => {
//   try {
//     const response = await axiosInstance.get('/api/registration/getregistration');
//     const data = response.data?.registrationdata;  
//     // setOverview(data);
//     setOverview(Array.isArray(data) ? data[0] : data);

//     console.log('overview info:', data);
//   } catch (error) {
//     console.error('Something went wrong!', error);
//   }
// };


//   useEffect(() => {
//     handleOverview();
//   }, []);


//   const handleAdd = () =>{
//     navigate('/foundvehicle') ;
//   }
//   const getRegisterno = async () => {
//   try {
//     const response = await axiosInstance.get('/api/registrationno/getregisterno');
//     const dataArray = response.data?.registernodata;

//     if (Array.isArray(dataArray) && dataArray.length > 0) {
//       const latest = dataArray[0]; // Get the latest created registration
//       setRegistrationno(latest.registrationno);
//       console.log('Latest register no:', latest);
//     } else {
//       console.warn("No registration data found");
//     }
//   } catch (error) {
//     console.log("Something went wrong!", error);
//   }
// };

//   useEffect(() => {
//    getRegisterno();
//   }, []);
//   return (
//     <div className="p-4 rounded-md w-full max-w-md border border-black mx-auto">
//       <div className="flex flex-col gap-4">
//         <div>
//           <h1 className="font-bold text-2xl">Vehicle Information</h1>
//           <div className="h-[2px] w-full bg-black mt-1" />
//         </div>

//         <h1 className="text-md">
//           Primary Vehicle:{' '}
//           <span className="font-medium">
//            {overview?.modelofvehicle || 'Not Provided'}
//           </span>
//         </h1>
//         <h1 className="text-md">
//           License Plate:{' '}
//           <span className="font-medium">
//               {registerno}
//           </span>
//         </h1>
//         <h1 className="text-md">
//           Fuel Type:{' '}
//           <span className="font-medium">
//             {overview?.vehicletype || 'Not Provided'}
//           </span>
//         </h1>

//         <button onClick={handleAdd} className="border-2 border-orange-500 text-orange-500 px-4 py-2 rounded-md bg-transparent hover:bg-orange-50 transition-all duration-200 self-start">
//           Add Vehicle
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Overview;








// THIS IS FOR ALL THE OVERVIEW INFO USER CREATED : 

 
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../Utils/axiosInstance';
import { useNavigate } from 'react-router';
const Overview = () => {
  const [overview, setOverview] = useState([]);
  const [registernos, setRegisternos] = useState([]); // updated state
 
  const navigate = useNavigate();
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


  const handleAdd = () =>{
    navigate('/foundvehicle') ;
  }

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
  return (
    <div className="p-4 rounded-md w-full max-w-md border border-black mx-auto">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="font-bold text-2xl">Vehicle Information</h1>
          <div className="h-[2px] w-full bg-black mt-1" />
        </div>
        
        {overview.length === 0 || registernos.length === 0 ? (
  <p>No vehicle registrations found.</p>
) : (
  overview.map((item, index) => (
    <div key={index} className="border p-2 rounded-md bg-gray-50">
      <h1 className="text-md">
        License Plate:{' '}
        <span className="font-medium">
          {registernos[index]?.registrationno || 'N/A'}
        </span>
      </h1>
      <h1 className="text-md">
        Primary Vehicle:{' '}
        <span className="font-medium">
          {item.modelofvehicle || 'Not Provided'}
        </span>
      </h1>
      <h1 className="text-md">
        Fuel Type:{' '}
        <span className="font-medium">
          {item.vehicletype || 'Not Provided'}
        </span>
      </h1>
    </div>
  ))
)}


        <button onClick={handleAdd} className="border-2 border-orange-500 text-orange-500 px-4 py-2 rounded-md bg-transparent hover:bg-orange-50 transition-all duration-200 self-start">
          Add Vehicle
        </button>
      </div>
    </div>
  );
};

export default Overview;
