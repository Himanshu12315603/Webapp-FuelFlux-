// import React, { useState } from "react";
// import authentication from "/authentication.svg";
// import { FaUserCircle, FaLock } from "react-icons/fa";
// import { FaFacebook, FaGoogle, FaInstagram } from "react-icons/fa";
// import { FaEnvelope } from "react-icons/fa";
// import axiosInstance from "../../Utils/axiosInstance";
// import {useNavigate} from "react-router-dom"

// const LoginForm = () => {
//   const [role, setRole] = useState("user");
// const [password , setPassword] = useState("");
// const [email , setEmail] = useState("");
// const navigate = useNavigate();
// const handleLogin = async (e) => {
//   e.preventDefault();
//   try {
//     const response = await axiosInstance.post('/api/users/login', { email, password });
//     localStorage.setItem("token", response.data.token);
//     navigate('/profile');
//   } catch (error) {
//     alert("Please enter valid credentials");
//     console.error("Login error:", error.response?.data || error.message); // For debugging
//   }
// }


//   return (

//     <div className="relative min-h-screen bg-white overflow-hidden">
      
//       <div className="absolute w-52 h-52 top-[-7rem] left-[-3.5rem] rounded-full bg-gradient-to-b from-[#12192C] to-transparent z-0 md:w-[400px] md:h-[400px] md:top-[-11rem] md:left-[-6.5rem]"></div>
//       <div className="absolute w-52 h-52 bottom-[-6rem] right-[-5.5rem] rounded-full bg-gradient-to-b from-[#12192C] to-transparent rotate-180 z-0 md:w-[300px] md:h-[300px] md:right-[-6.5rem]"></div>

//       <div className="relative z-10 flex flex-col md:flex-row items-center justify-center min-h-screen px-4 md:px-8">
//         <img
//           src={authentication}
//           alt="Login Illustration"
//           className="hidden md:block w-[700px] mr-8"
//         />

//         <form onSubmit={handleLogin} className="w-full max-w-xs space-y-6">
//           <h1 className="text-3xl font-medium text-[#12192C]">Welcome</h1>

//           <div className="border-b border-gray-400 pb-2 flex items-center gap-3 focus-within:border-[#12192C]">
//             <FaEnvelope className="text-gray-400 text-xl" />
//             <input
//               type="text"
//               placeholder="Email"
//               value={email}
//               className="w-full outline-none bg-transparent text-lg text-black"
//                onChange={(e)=>setEmail(e.target.value)}
//             />
//           </div>

      
//           <div className="border-b border-gray-400 pb-2 flex items-center gap-3 focus-within:border-[#12192C]">
//             <FaLock className="text-gray-400 text-xl" />
//             <input
//               type="password"
//               placeholder="Password "
//               className="w-full outline-none bg-transparent text-lg  text-black"
//               value={password}
//               onChange={(e)=>setPassword(e.target.value)}
//             />
//           </div>

          

         

          
//           <span
           
//             className="block text-right text-sm text-gray-500 "
//           >
//             Don't Have Account ? <a className="hover:text-[#12192C]" href="/signup">Create New </a> 
//           </span>

//           <input
//             type="submit"
//             value="Login"
//             className="w-full bg-[#12192C] text-white py-3 rounded-lg cursor-pointer hover:shadow-lg"
//           />

//           {/* Social Icons */}
//           <div className="text-center">
//             <span className="block text-sm text-gray-600 mb-2">
//               Or login with
//             </span>
//             <div className="flex justify-center gap-6">
//               <a
//                 href="#"
//                 className="bg-gray-400 text-white p-2 rounded-full hover:bg-[#12192C]"
//               >
//                 <FaFacebook />
//               </a>
//               <a
//                 href="http://localhost:3000/api/users/auth/google"
//                 className="bg-gray-400 text-white p-2 rounded-full hover:bg-[#12192C]"
//               >
//                 <FaGoogle />
//               </a>

              

//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default LoginForm;


// src/Login.js

// import React from 'react';
// import { useState } from 'react';
// import LOGO from '../assets/LOGO.png'
// import { FaUserCircle, FaLock } from "react-icons/fa";
// import { FaFacebook, FaGoogle, FaInstagram } from "react-icons/fa";
// import { FaEnvelope } from "react-icons/fa";
// import axiosInstance from "../../Utils/axiosInstance";
// import {useNavigate} from "react-router-dom"
// const Login = () => {
//   const [activeTab, setActiveTab] = useState('login');
//   const [role, setRole] = useState("user");
// const [password , setPassword] = useState("");
// const [email , setEmail] = useState("");
// const navigate = useNavigate();
// const handleLogin = async (e) => {
//   e.preventDefault();
//   try {
//     const response = await axiosInstance.post('/api/users/login', { email, password });
//     localStorage.setItem("token", response.data.token);
//     navigate('/profile');
//   } catch (error) {
//     alert("Please enter valid credentials");
//     console.error("Login error:", error.response?.data || error.message); // For debugging
//   }
// }
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen  bg-white">
//       <div className='bg-black w-full max-w-lg p-2  '>
//  <img className='w-[150px] h-[50px]' src={LOGO} alt="logo img" />
// <h1 className="text-3xl font-bold  text-white">Welcome to <span className="text-[#F69454]">FuelFlux</span></h1>
// <p className=" text-white">Fast & Reliable fuel delivery service at your fingertips. Find the nearest fuel stations and book with ease.</p>

// </div>
//       <div className="bg-[#F5F5F5]  border-2   border-gray-900 p-4 shadow-md w-full max-w-lg h-[400px] ">
        
        
// <div className="flex gap-8  text-2xl mb-2  font-semibold ">
//           <button
//             onClick={() => setActiveTab('login')}
//             className={`${
//               activeTab === 'login' ? 'text-[#F69454] underline' : 'text-black'
//             } hover:text-[#F69454]`}
//           >
//             Login
//           </button>
//           <button
//             onClick={() => setActiveTab('register')}
//             className={`${
//               activeTab === 'register' ? 'text-[#F69454] underline' : 'text-black'
//             } hover:text-[#F69454]`}
//           >
//             Register
//           </button>
//         </div>
//         <form onSubmit={handleLogin} className="mt-1 ">
//           <div className="mb-1">
//             <label className="block text-black font-semibold" htmlFor="email">Email Address</label>
//             <input
//               type="email"
//               id="email"
//               value={email}
//               className="w-full p-2 text-[18px] border border-black rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
//               placeholder="Enter your email address"
//               required
//               onChange={(e)=>setEmail(e.target.value)}
//             />
//           </div>

//           <div className="mb-2">
//             <label className="block  text-black font-semibold" htmlFor="password">Password</label>
//             <input
//               type="password"
//               id="password"
//               className="w-full p-2 border text-[18px] border-black rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
//               placeholder="Enter your password"
//               value={password}
//               onChange={(e)=>setPassword(e.target.value)}
//               required
//             />
//           </div>

//           <div className="flex items-center mb-1">
//             <input type="checkbox" id="remember" className="mr-2" />
//             <label htmlFor="remember" className="text-gray-700">Remember me</label>
//             <a href="#" className="ml-auto text-orange-500">Forgot Password?</a>
//           </div>

//           <button type="submit" className="w-full p-2 bg-[#F69454] text-white rounded hover:bg-orange-600">
//             Login
//           </button>
//         </form>

//         <div className=" gap-2 flex items-center justify-center ">
//           <hr className="border-gray-300" />
//           <span  className="text-gray-500">or continue with</span>
//         </div>

//         <div className=" mt-2 flex justify-center items-center gap-6">
//           <a 
//            href="http://localhost:3000/api/users/auth/google"
//           className="w-10 h-10 rounded-md bg-gray-200 flex items-center justify-center hover:bg-gray-300">
//             G
//           </a>
//           <a className="w-10 h-10 rounded-md bg-gray-200 flex items-center justify-center hover:bg-gray-300">
//             F
//           </a>
//         </div>

//         <p className="mt-4 text-center text-gray-500">© 2025 FuelFlux. All rights reserved.</p>
//       </div>
//     </div>
//   );
// }

// export default Login;




// import React, { useState } from 'react';
// import LOGO from '../assets/LOGO.png';
// import axiosInstance from "../../Utils/axiosInstance";
// import { useNavigate } from "react-router-dom";

// const Login = () => {
//   const [activeTab, setActiveTab] = useState('login');
//   const [password, setPassword] = useState("");
//   const [email, setEmail] = useState("");
//   const [username, setUsername] = useState("");
//   const [showPhoneInput, setShowPhoneInput] = useState(false);
// const [phoneNumber, setPhoneNumber] = useState("");

//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axiosInstance.post('/api/users/login', { email, password });
//       localStorage.setItem("token", response.data.token);
//           localStorage.setItem("isLoggedIn", true);
//       navigate('/video');
//     } catch (error) {
//       alert("Please enter valid credentials");
//       console.error("Login error:", error.response?.data || error.message);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
//       {/* Logo and Welcome Text */}
//       <div className="bg-black w-full max-w-lg p-2 ">
//         <img className="w-[120px] h-[40px] md:w-[150px] md:h-[50px]" src={LOGO} alt="logo img" />
//         <h1 className="text-2xl md:text-3xl font-bold text-white mt-2">
//           Welcome to <span className="text-[#F69454]">FuelFlux</span>
//         </h1>
//         <p className="text-sm md:text-base text-white mt-2">
//           Fast & Reliable fuel delivery service at your fingertips. Find the nearest fuel stations and book with ease.
//         </p>
//       </div>

//       {/* Login/Register Form */}
//       <div className="bg-[#F5F5F5] border-2 border-gray-900 p-4  shadow-md w-full max-w-lg h-[470px]">
//         {/* Tabs */}
//         <div className="flex gap-6 md:gap-8 text-lg md:text-2xl mb-2 font-semibold justify-center">
//           <button
//             onClick={() => {
//               setActiveTab('login');
//               navigate('/login');


//             }}
//             className={`${
//               activeTab === 'login' ? 'text-[#F69454] underline' : 'text-black'
//             } hover:text-[#F69454]`}
//           >
            
//             Login
//           </button>
//           <button
//             onClick={() => {
//               setActiveTab('register');
//               navigate('/signup');
//             }}
//             className={`${
//               activeTab === 'register' ? 'text-[#F69454] underline' : 'text-black'
//             } hover:text-[#F69454]`}
//           >
//             Register
//           </button>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleLogin} className="space-y-1">
//           <div>
//             <label className="block text-black font-semibold" htmlFor="text">Name</label>
            
//             <input
//               type="text"
//               id="text"
//               value={username}
//               className="w-full p-2 text-[16px] md:text-[18px] border border-black rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
//               placeholder="Enter your  name"
//               required
//               onChange={(e) => setUsername(e.target.value)}
//             />
//             <label className="block text-black font-semibold" htmlFor="email">Email </label>
//             <input
//               type="email"
//               id="email"
//               value={email}
//               className="w-full p-2 text-[16px] md:text-[18px] border border-black rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
//               placeholder="Enter your email address"
//               required
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>

//           <div>
//             <label className="block text-black font-semibold" htmlFor="password">Password</label>
//             <input
//               type="password"
//               id="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full p-2 text-[16px] md:text-[18px] border border-black rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
//               placeholder="Enter your password"
//               required
//             />
//           </div>

//           {/* <div className="flex items-center text-sm md:text-base">
//             <input type="checkbox" id="remember" className="mr-2" />
//             <label htmlFor="remember" className="text-gray-700">Remember me</label>
//             <a href="#" className="ml-auto text-orange-500 text-sm md:text-base">Forgot Password?</a>
//           </div> */}

//           <button  type="submit" className="w-full mt-3 p-2 bg-[#F69454] text-white rounded hover:bg-orange-600">
//             Login
//           </button>
//         </form>

//         {/* Divider */}
//         <div className="flex items-center  justify-center gap-2 mt-4">
//           <hr className="border-gray-300 w-1/5" />
//           <span className="text-gray-500 text-sm">or continue with</span>
//           <hr className="border-gray-300 w-1/5" />
//         </div>

//         {/* Social login */}
//         {/* <div className="mt-4 flex justify-center items-center gap-6">
//           <a 
//             href="http://localhost:3000/api/users/auth/google"
//             className="w-10 h-10 rounded-md bg-gray-200 flex items-center justify-center hover:bg-gray-300 text-lg"
//           >
//             G
//           </a>
           
//         </div> */}
// <div className="mt-4 flex justify-center items-center gap-6">
// <button
//   className="w-10 h-10 rounded-md bg-gray-200 flex items-center justify-center hover:bg-gray-300 text-lg"
//   onClick={() => setShowPhoneInput(true)}
// >
//   G
// </button>
//  </div>
// {showPhoneInput && (
//   <div className="mt-4">
//     <input
//       type="text"
//       className="border p-2 rounded w-full"
//       placeholder="Enter your 10-digit phone number"
//       value={phoneNumber}
//       onChange={(e) => setPhoneNumber(e.target.value)}
//     />
//     <button
//       className="mt-2 w-full p-2 bg-[#F69454] text-white rounded"
//       onClick={() => {
//         if (!/^\d{10}$/.test(phoneNumber)) {
//           alert("Please enter a valid 10-digit phone number");
//           return;
//         }

//         // Save it temporarily
//         localStorage.setItem("pendingPhoneNumber", phoneNumber);

//         // Redirect to Google Auth
//         window.location.href = "http://localhost:3000/api/users/auth/google";
//       }}
//     >
//       Continue with Google
//     </button>
//   </div>
// )}



//         {/* Footer */}
//         <p className="mt-2 text-center text-gray-500 text-sm md:text-base">
//           © 2025 FuelFlux. All rights reserved.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;

// import React, { useState } from 'react';
// import LOGO from '../assets/LOGO.png';
// import axiosInstance from "../../Utils/axiosInstance";
// import { useNavigate } from "react-router-dom";

// const Login = () => {
//   const [activeTab, setActiveTab] = useState('login');
//   const [password, setPassword] = useState("");
//   const [email, setEmail] = useState("");
//   const [username, setUsername] = useState("");
//   const [showPhoneInput, setShowPhoneInput] = useState(false);
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axiosInstance.post('/api/users/login', { email, password });
//       localStorage.setItem("token", response.data.token);
//       localStorage.setItem("isLoggedIn", true);
//       navigate('/video');
//     } catch (error) {
//       alert("Please enter valid credentials");
//       console.error("Login error:", error.response?.data || error.message);
//     }
//   };
 
// const handlePhoneAndGoogle = async () => {
//   if (!/^\d{10}$/.test(phoneNumber)) {
//     alert("Please enter a valid 10-digit phone number");
//     return;
//   }

//   console.log("registered user", phoneNumber);

//   try {
//     const response = await axiosInstance.post('/api/users/register', {
//       username: "",        // mark empty
//       email: "",           // mark empty
//       password: "",        // mark empty
//       phonenumber: phoneNumber,
//     });

//     console.log("Mobile no response ", response);

//     // Save and redirect
//     localStorage.setItem("pendingPhoneNumber", phoneNumber);
//     // window.location.href = "http://localhost:3000/api/users/auth/google";
//     // window.location.href = `http://localhost:3000/api/users/auth/google?phonenumber=${phoneNumber}`;
// // window.location.href = `http://localhost:3000/api/users/auth/google?phonenumber=${encodeURIComponent(phoneNumber)}`;
// window.location.href = `http://localhost:3000/api/users/auth/google?phonenumber=${encodeURIComponent(phoneNumber)}`;

//   } catch (error) {
//     console.error("Error during registration:", error);
//     alert(error.response?.data?.error || "Registration failed. Please try again.");
//   }
// };

// const handlePhoneSubmit = async () => {
//   await axiosInstance.post('/api/users/update-phone', {
//     phoneNumber: phone,
//     token: tokenFromURL
//   });
//   navigate('/dashboard');
// };



//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4 py-6">
      
//       {/* Header Section */}
//       <div className="bg-black w-full max-w-lg   px-4 py-5 shadow-lg">
//         <img className="w-[120px] h-[40px] md:w-[150px] md:h-[50px]" src={LOGO} alt="logo img" />
//         <h1 className="text-2xl md:text-3xl font-bold text-white mt-3">
//           Welcome to <span className="text-[#F69454]">FuelFlux</span>
//         </h1>
//         <p className="text-sm md:text-base text-white mt-2">
//           Fast & Reliable fuel delivery service at your fingertips. Find the nearest fuel stations and book with ease.
//         </p>
//       </div>

//       {/* Login/Register Box */}
//       <div className="bg-[#F5F5F5] border-2 border-gray-900 p-5 shadow-md w-full max-w-lg   overflow-y-auto max-h-[80vh]">

//         {/* Tabs */}
//         <div className="flex gap-6 md:gap-8 text-lg md:text-2xl mb-4 font-semibold justify-center">
//           <button
//             onClick={() => {
//               setActiveTab('login');
//               navigate('/login');
//             }}
//             className={`${
//               activeTab === 'login' ? 'text-[#F69454] underline' : 'text-black'
//             } hover:text-[#F69454]`}
//           >
//             Login
//           </button>
//           <button
//             onClick={() => {
//               setActiveTab('register');
//               navigate('/signup');
//             }}
//             className={`${
//               activeTab === 'register' ? 'text-[#F69454] underline' : 'text-black'
//             } hover:text-[#F69454]`}
//           >
//             Register
//           </button>
//         </div>

//         {/* Login Form */}
//         <form onSubmit={handleLogin} className="space-y-3">
//           <div>
//             <label className="block text-black font-semibold">Name</label>
//             <input
//               type="text"
//               value={username}
//               className="w-full p-2 text-base border border-black rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
//               placeholder="Enter your name"
//               required
//               onChange={(e) => setUsername(e.target.value)}
//             />
//           </div>

//           <div>
//             <label className="block text-black font-semibold">Email</label>
//             <input
//               type="email"
//               value={email}
//               className="w-full p-2 text-base border border-black rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
//               placeholder="Enter your email address"
//               required
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>

//           <div>
//             <label className="block text-black font-semibold">Password</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full p-2 text-base border border-black rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
//               placeholder="Enter your password"
//               required
//             />
//           </div>

//           <button type="submit" className="w-full mt-2 p-2 bg-[#F69454] text-white rounded hover:bg-orange-600">
//             Login
//           </button>
//         </form>

//         {/* Divider */}
//         <div className="flex items-center justify-center gap-2 mt-4">
//           <hr className="border-gray-300 w-1/5" />
//           <span className="text-gray-500 text-sm">or continue with</span>
//           <hr className="border-gray-300 w-1/5" />
//         </div>

//         {/* Google Button */}
//         <div className="mt-4 flex justify-center items-center gap-6">
//           <button
//             className="w-10 h-10 rounded-md bg-gray-200 flex items-center justify-center hover:bg-gray-300 text-lg"
//             onClick={() => setShowPhoneInput(true)}
//           >
//             G
//           </button>
//         </div>

//         {/* Phone Input & Continue with Google */}
//         {showPhoneInput && (
//           <div className="mt-4 space-y-2">
//             <input
//               type="text"
//               className="border p-2 rounded w-full"
//               placeholder="Enter your 10-digit phone number"
//               value={phoneNumber}
//               onChange={(e) => setPhoneNumber(e.target.value)}
//             />
        
 
// {/* <button
//   type="button"
//   className="w-full p-2 bg-[#F69454] text-white rounded hover:bg-orange-600"
//   onClick={handlePhoneAndGoogle}
// >
//   Continue with Google
// </button> */}

// <button
//   onClick={() => {
//     window.location.href = 'http://localhost:3000/api/users/auth/google';
//   }}
//   className="w-full p-2 bg-[#F69454] text-white rounded hover:bg-orange-600"
// >
//   Continue with Google
// </button>



//           </div>
//         )}

//         {/* Footer */}
//         <p className="mt-4 text-center text-gray-500 text-sm md:text-base">
//           © 2025 FuelFlux. All rights reserved.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;


import React, { useState } from 'react';
import LOGO from '../assets/LOGO.png';
import axiosInstance from "../../Utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/api/users/login', { email, password });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("isLoggedIn", true);
      navigate('/video');
    } catch (error) {
      alert("Please enter valid credentials");
      console.error("Login error:", error.response?.data || error.message);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/api/users/auth/google';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4 py-6">
      {/* Header Section */}
      <div className="bg-black w-full max-w-lg px-4 py-5 shadow-lg">
        <img className="w-[120px] h-[40px] md:w-[150px] md:h-[50px]" src={LOGO} alt="logo img" />
        <h1 className="text-2xl md:text-3xl font-bold text-white mt-3">
          Welcome to <span className="text-[#F69454]">FuelFlux</span>
        </h1>
        <p className="text-sm md:text-base text-white mt-2">
          Fast & Reliable fuel delivery service at your fingertips.
        </p>
      </div>

      {/* Login/Register Box */}
      <div className="bg-[#F5F5F5] border-2 border-gray-900 p-5 shadow-md w-full max-w-lg overflow-y-auto max-h-[80vh]">

        {/* Tabs */}
        <div className="flex gap-6 md:gap-8 text-lg md:text-2xl mb-4 font-semibold justify-center">
          <button
            onClick={() => {
              setActiveTab('login');
              navigate('/login');
            }}
            className={`${
              activeTab === 'login' ? 'text-[#F69454] underline' : 'text-black'
            } hover:text-[#F69454]`}
          >
            Login
          </button>
          <button
            onClick={() => {
              setActiveTab('register');
              navigate('/signup');
            }}
            className={`${
              activeTab === 'register' ? 'text-[#F69454] underline' : 'text-black'
            } hover:text-[#F69454]`}
          >
            Register
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-3">
          <div>
            <label className="block text-black font-semibold">Name</label>
            <input
              type="text"
              value={username}
              className="w-full p-2 text-base border border-black rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter your name"
              required
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-black font-semibold">Email</label>
            <input
              type="email"
              value={email}
              className="w-full p-2 text-base border border-black rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter your email address"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-black font-semibold">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 text-base border border-black rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="w-full mt-2 p-2 bg-[#F69454] text-white rounded hover:bg-orange-600">
            Login
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <hr className="border-gray-300 w-1/5" />
          <span className="text-gray-500 text-sm">or continue with</span>
          <hr className="border-gray-300 w-1/5" />
        </div>

        {/* Google Button */}
        <div className="mt-4 flex justify-center items-center gap-6">
          <button
            className="w-10 h-10 rounded-md bg-gray-200 flex items-center justify-center hover:bg-gray-300 text-lg"
            onClick={handleGoogleLogin}
          >
            G
          </button>
        </div>

        {/* Footer */}
        <p className="mt-4 text-center text-gray-500 text-sm md:text-base">
          © 2025 FuelFlux. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
