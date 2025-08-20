// import React, { useEffect, useState } from "react";
// import HeaderComp from "../components/HeaderComp";
// import { useNavigate } from "react-router";
// import axiosInstance from "../../Utils/axiosInstance";
// import Userprofile from "../profilescreens/userprofile";

// const Profile = () => {

//   const [userinfo, setUserinfo] = useState(null);

//   // const [username , setUsername] = useState('');
//   // const [phonenumber , setPhoneNumber] = useState('');
//   // const [email , setEmail] = useState(''); 
 
//   const navigate = useNavigate();


// // const handleProfile = async () => {
// //   try {
// //     const response = await axiosInstance.get('/api/users/getregister');
// //     const data = response.data?.userdata;
// //     const userdata = data?.[data.length - 1]; // latest user
// //     setGetuserinfo(userdata);
// //     console.log('Fetched booking:', data);
// //   } catch (error) {
// //     console.log("Something went wrong!", error);
// //   }
// // };
// // useEffect(()=>{
// //  handleProfile() ;
// // },[]);



//   const getUserInfo = async () => {
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
//     <div>
//      <HeaderComp/>
//     <div className="min-h-screen max-w-full bg-white flex flex-col items-center py-8 font-sans">
     
//        <Userprofile/>
//       {/* Form */}
//       <form className="w-[95%] max-w-3xl">
//         <div className="flex flex-col sm:flex-row gap-4 mb-4">
//           <div className="flex-1">
//             <label className="block mb-1 text-sm font-medium">Name</label>
//             <input
//               type="text"
//               value={userinfo?.username || 'Loading...'}
//               className="w-full border rounded-md px-3 py-2 focus:outline-none"
//               readOnly
//               />
//           </div>
//           <div className="flex-1">
//             <label className="block mb-1 text-sm font-medium">Email Address</label>
//             <input
//               type="email"
//               value={userinfo?.email || 'Loading...'}
//               className="w-full border rounded-md px-3 py-2 focus:outline-none"
//               readOnly
//               />
//           </div>
//         </div>
//         <div className="flex flex-col sm:flex-row gap-4">
//           <div className="flex-1">
//             <label className="block mb-1 text-sm font-medium">Password</label>
//             <input
//               type="password"
//               value="XXXXXXX"
//               className="w-full border rounded-md px-3 py-2 focus:outline-none"
//               readOnly
//               />
//           </div>
//           <div className="flex-1">
//             <label className="block mb-1 text-sm font-medium">Number</label>
//             <input
//               type="text"
//               value={userinfo?.phonenumber}
//               className="w-full border rounded-md px-3 py-2 focus:outline-none"
//               readOnly
//               />
//           </div>
//         </div>
//       </form>
//     </div>
//               </div>
//   );
// };

// export default Profile;



import React, { useEffect, useState } from "react";
import HeaderComp from "../components/HeaderComp";
import { useNavigate, NavLink, Outlet } from "react-router-dom";
import axiosInstance from "../../Utils/axiosInstance";
import { FaUser } from "react-icons/fa";

const Profile = () => {
  const [userinfo, setUserinfo] = useState(null);
  const navigate = useNavigate();

  const getUserInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
       alert("Please Login First ! ")  
        navigate("/login");
        return;
      }
      const response = await axiosInstance.get('/api/users/getregister', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data) {
        setUserinfo(response.data);
      }
   
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <div>
      <HeaderComp />
      <div className="min-h-screen max-w-full bg-white flex flex-col items-center py-8 font-sans">
        {/* Top Card */}
        <div className="w-full max-w-3xl border rounded-lg p-4 flex flex-col sm:flex-row items-center sm:justify-between gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-4xl border">
            <FaUser />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start gap-2">
              <span className="text-xl font-semibold">{userinfo?.username || 'Loading...'}</span>
              <span className="text-gray-400">| {userinfo?.email || 'Loading...'}</span>
              <span className="text-gray-400">| +91 {userinfo?.phonenumber}</span>
            </div>
          </div>
          {/* <button  className="bg-orange-400 text-white font-semibold px-5 py-2 rounded-md w-full sm:w-auto">
            Logout
          </button> */}
          <button
  onClick={async () => {
    try {
      // Call logout API
      await axiosInstance.get("/api/users/logout");

      // Clear localStorage & navigate
      localStorage.clear();
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }}
  className="bg-orange-400 text-white font-semibold px-5 py-2 rounded-md w-full sm:w-auto"
>
  Logout
</button>

        </div>

        {/* Tabs */}
        <div className="w-full max-w-3xl border rounded-lg flex flex-col sm:flex-row mb-6">
          <NavLink to="overview" className={({ isActive }) =>
            `flex-1 py-2 text-center font-medium border-b sm:border-b-0 sm:border-r border-gray-300 ${isActive ? "bg-orange-100" : ""}`
          }>
            Overview
          </NavLink>
          <NavLink to="history" className={({ isActive }) =>
            `flex-1 py-2 text-center font-medium border-b sm:border-b-0 sm:border-r border-gray-300 ${isActive ? "bg-orange-100" : ""}`
          }>
            History
          </NavLink>
          <NavLink to="saved" className={({ isActive }) =>
            `flex-1 py-2 text-center font-medium border-b sm:border-b-0 sm:border-r border-gray-300 ${isActive ? "bg-orange-100" : ""}`
          }>
            Saved Station
          </NavLink>
          <NavLink to="feedback" className={({ isActive }) =>
            `flex-1 py-2 text-center font-medium ${isActive ? "bg-orange-100" : ""}`
          }>
            FeedBack
          </NavLink>
        </div>

        {/* Render the nested route component here */}
        <div className="w-[95%] max-w-3xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Profile;
