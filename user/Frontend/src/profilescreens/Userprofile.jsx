// import React, { useEffect, useState } from "react";
// import HeaderComp from "../components/HeaderComp";
// import { useNavigate } from "react-router";
// import axiosInstance from "../../Utils/axiosInstance";
// import { FaUser } from "react-icons/fa";
// const Userprofile = () => {
//   const [userinfo, setUserinfo] = useState(null);
//     const navigate = useNavigate();

//       const getUserInfo = async () => {
//     try {
//       console.log("Fetching User Info...");

//       const token = localStorage.getItem("token");
//       if (!token) {
//         console.log("No Token Found");
//         navigate("/login");
//         return;
//       }

//       console.log("Token from Local Storage:", token);

//       const response = await axiosInstance.get('/api/users/getregister', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       console.log("Full Response:", response);

//       if (response.data) {
//         setUserinfo(response.data); // Storing User Data in State
//         console.log("User Info Found :", response.data);
//       } else {
//         console.log("No User Data Found ");
//       }
//     } catch (error) {
//       console.error("Error fetching user info:", error);
//       if (error.response && error.response.status === 401) {
//         console.log("Unauthorized! Redirecting...");
//         localStorage.clear();
//         navigate("/login");
//       }
//     }
//   };

//  useEffect(() => {
//   console.log("Fetching User Info...");
//   getUserInfo(); 
// }, []);  

//   return (
//     <div  > 
//         <div className="  max-w-3xl border rounded-lg  p-3 gap-4   flex  items-center justify-between mb-6">
//         {/* Photo */}
//          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-4xl border">
//             <FaUser  className="text-2xl text-center flex justify-center"/>
//           </div>
//         {/* Info */}
//         <div className="flex-1">
//           <div className="flex flex-col sm:flex-row sm:items-center">
//             <span className="text-2xl font-semibold mr-3">{userinfo?.username || 'Loading...'} </span>
//             <span className="text-gray-400 sm:ml-0 ml-0 mt-1 sm:mt-0">
//              | {userinfo?.email || 'Loading...' } | 
//             </span>
//             <span className="text-gray-400 ml-2 hidden sm:inline">
              
//             </span>
//             <span className="text-gray-400 ml-2">
//               +91 {userinfo?.phonenumber}
//             </span>
//           </div>
//         </div>
//         {/* Logout Button */}
//         <button className="bg-orange-400 text-white font-semibold px-6 py-2 rounded-md ml-4">
//           Logout
//         </button>
//       </div>

//       {/* Tabs */}
//       <div className="w-[95%] max-w-3xl border rounded-lg flex mb-6">
//         <button className="flex-1 py-2 font-medium border-r last:border-r-0 border-gray-300 focus:outline-none">
//           Overview
//         </button>
//         <button className="flex-1 py-2 font-medium border-r last:border-r-0 border-gray-300 focus:outline-none">
//           History
//         </button>
//         <button className="flex-1 py-2 font-medium border-r last:border-r-0 border-gray-300 focus:outline-none">
//           Saved Station
//         </button>
//         <button className="flex-1 py-2 font-medium focus:outline-none">
//           Payment Methos
//         </button>
//       </div>
//       </div>
//   )
// }

// export default Userprofile



import React, { useEffect, useState } from "react";
import HeaderComp from "../components/HeaderComp";
import { useNavigate } from "react-router";
import axiosInstance from "../../Utils/axiosInstance";
import { FaUser } from "react-icons/fa";

const Userprofile = () => {
  const [userinfo, setUserinfo] = useState(null);
  const navigate = useNavigate();

  const getUserInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axiosInstance.get('/api/users/getregister', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        setUserinfo(response.data);
      }
      console.log("getting phone number ..... " , response.data) ;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  const handlelogout = async() =>{
  await axiosInstance.get('/api/users/logout'); // adjust path as needed
  localStorage.clear();
  sessionStorage.clear();
  navigate('/login');
  alert("User Logged Out SuccesFully! ")
};

  }


  return (
    <div className="p-4 w-full flex flex-col items-center">
      {/* User Info Card */}
      <div className="w-full max-w-3xl border rounded-lg p-4 flex flex-col sm:flex-row items-center sm:justify-between gap-4 mb-6">
        {/* Photo */}
        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-4xl border">
          <FaUser />
        </div>

        {/* Info */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start gap-2">
            <span className="text-xl font-semibold">{userinfo?.username || 'Loading...'}</span>
            <span className="text-gray-400">| {userinfo?.email || 'Loading...'}</span>
            <span className="text-gray-400">|  {userinfo?.phonenumber || 'Loading...'}</span>
            
          </div>
        </div>

        {/* Logout */}
        <div  className="mt-2 sm:mt-0">
          <button onClick={handlelogout} className="bg-orange-400 text-white font-semibold px-5 py-2 rounded-md w-full sm:w-auto">
            Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="w-full max-w-3xl border rounded-lg flex flex-col sm:flex-row mb-6">
        <button className="flex-1 py-2 font-medium border-b sm:border-b-0 sm:border-r border-gray-300">
          Overview
        </button>
        <button className="flex-1 py-2 font-medium border-b sm:border-b-0 sm:border-r border-gray-300">
          History
        </button>
        <button className="flex-1 py-2 font-medium border-b sm:border-b-0 sm:border-r border-gray-300">
          Saved Station
        </button>
        <button className="flex-1 py-2 font-medium">
          Payment Methods
        </button>
      </div>
    </div>
  );
 

export default Userprofile;
