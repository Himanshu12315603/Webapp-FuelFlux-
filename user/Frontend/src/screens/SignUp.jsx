// import React, { useState } from "react";
// import authentication from "/authentication.svg";
// import { FaUserCircle, FaLock } from "react-icons/fa";
// import { FaFacebook, FaGoogle, FaInstagram } from "react-icons/fa";
// import { FaEnvelope } from "react-icons/fa";
// import { useNavigate } from "react-router";
// // import {axios} from "axios" ;
// import axiosInstance from "../../Utils/axiosInstance";
// const SignUp = () => {
  // const [role, setRole] = useState("user");
  // const [email , setEmail] = useState("");
  // const [password , setPassword] = useState("");
  // const [name , setName] = useState("");

  // const handleRegister = async (e) => {
  //   e.preventDefault();
  //   console.log("registered user", email, password, name);
  
  //   try {
  //     const response = await axiosInstance.post('/api/users/register', {
  //       name,
  //       email,
  //       password,
  //     });
  
  //     alert("Registration Successfully!");
  //     // optionally redirect using navigate("/login");
  //   } catch (error) {
  //     console.error("Error during registration:", error);
  //     alert(error.response?.data?.error || "Registration failed. Please try again.");
  //   }
  // };
  
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


// <form className="w-full max-w-xs space-y-6" onSubmit={handleRegister}>
//   <h1 className="text-3xl font-medium text-[#12192C]">Welcome</h1>

  

//   {/* Username */}
//   <div className="border-b border-gray-400 pb-2 flex items-center gap-3 focus-within:border-[#12192C]">
//     <FaUserCircle className="text-gray-400 text-xl" />
    // <input
    //   type="text"
    //   placeholder="UserName"
    //   value={name}
    //   className="w-full outline-none bg-transparent text-lg text-black"
    //   onChange={(e) => setName(e.target.value)}
    // />
//   </div>

//   {/* Email */}
//   <div className="border-b border-gray-400 pb-2 flex items-center gap-3 focus-within:border-[#12192C]">
//     <FaEnvelope className="text-gray-400 text-xl" />
//     <input
//       type="text"
//       placeholder="Email"
//       value={email}
//       className="w-full outline-none bg-transparent text-lg text-black"
//       onChange={(e) => setEmail(e.target.value)}
//     />
//   </div>

//   {/* Password */}
//   <div className="border-b border-gray-400 pb-2 flex items-center gap-3 focus-within:border-[#12192C]">
//     <FaLock className="text-gray-400 text-xl" />
//     <input
//       type="password"
//       placeholder="Password"
//       value={password}
//       className="w-full outline-none bg-transparent text-lg text-black"
//       onChange={(e) => setPassword(e.target.value)}
//     />
//   </div>

// {/* Already have an account */}
// <span className="block text-right text-sm text-gray-500">
//     Already Have Account? <a className="hover:text-[#12192C]" href="/login">Login</a>
//   </span>

//   {/* Submit Button */}
//   <input
//     type="submit"
//     value="Register"
//     className="w-full bg-[#12192C] text-white py-3 rounded-lg cursor-pointer hover:shadow-lg"
//   />


// </form>
  

  
 
//       </div>
//     </div>
//   );
// };

// export default SignUp;

import React, { useState } from 'react';
import LOGO from '../assets/LOGO.png';
import axiosInstance from "../../Utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [activeTab, setActiveTab] = useState('register');
  const [email , setEmail] = useState("");
  const [password , setPassword] = useState("");
  const [username , setuserName] = useState("");
  const [phonenumber , setPhoneNumber] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
  
    // Validation for email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }
  
    // Validation for phone number (10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phonenumber)) {
      alert("Phone number must be exactly 10 digits.");
      return;
    }
  
    // Password validation: min 8 chars, 1 lowercase, 1 uppercase, 1 number, 1 special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,;:]).{8,}$/;
    if (!passwordRegex.test(password)) {
      alert("Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (e.g., @, !, %, etc.) with a minimum of 8 characters.");
      return;
    }
  
    console.log("registered user", email, password, username, phonenumber);
  
    try {
      const response = await axiosInstance.post('/api/users/register', {
        username,
        email,
        password,
        phonenumber
      });
  
      alert("Registration Successfully!");
      // optionally navigate("/login");
    } catch (error) {
      console.error("Error during registration:", error);
      alert(error.response?.data?.error || "Registration failed. Please try again.");
    }
  };
  

  return (
    <div className="flex flex-col items-center  justify-center min-h-screen bg-white px-4">
      {/* Logo and Welcome Text */}
      <div className="bg-black w-full max-w-lg p-2 ">
        <img className="w-[120px] h-[40px] md:w-[150px] md:h-[50px]" src={LOGO} alt="logo img" />
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Welcome to <span className="text-[#F69454]">FuelFlux</span>
        </h1>
        <p className="text-sm md:text-base text-white mt-2">
          Fast & Reliable fuel delivery service at your fingertips. Find the nearest fuel stations and book with ease.
        </p>
      </div>

      {/* Login/Register Form */}
      <div className="bg-[#F5F5F5] border-2 border-gray-900 p-4  shadow-md w-full max-w-lg h-[450px]">
        {/* Tabs */}
        <div className="flex gap-6 md:gap-8 text-lg md:text-2xl mb-2 font-semibold justify-center">
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

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-1 mb-4">
          <div>
          <label className="block text-black font-semibold" htmlFor="email">User Name</label>
          <input
      type="text"
      placeholder="Enter your username"
      value={username}
      className="w-full p-2 text-[16px] md:text-[18px] border border-black rounded focus:outline-none focus:ring-2"
      onChange={(e) => setuserName(e.target.value)}
    />
    <label className="block text-black font-semibold" htmlFor="email">Phone Number</label>
          <input
      type="text"
      placeholder=" Enter your phone number"
      value={phonenumber}
      className="w-full p-2 text-[16px] md:text-[18px] border border-black rounded focus:outline-none focus:ring-2"
      onChange={(e) => setPhoneNumber(e.target.value)}
    />
            <label className="block text-black font-semibold" htmlFor="email">Email Address</label>
           
            <input
              type="email"
              id="email"
              value={email}
              className="w-full p-2 text-[16px] md:text-[18px] border border-black rounded focus:outline-none focus:ring-2"
              placeholder="Enter your email address"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-black font-semibold" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 text-[16px] md:text-[18px] border border-black rounded focus:outline-none focus:ring-2 mb-4"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* <div className="flex items-center text-sm md:text-base">
            <input type="checkbox" id="remember" className="mr-2" />
            <label htmlFor="remember" className="text-gray-700">Remember me</label>
            <a href="#" className="ml-auto text-orange-500 text-sm md:text-base">Forgot Password?</a>
          </div> */}

          <button type="submit" className="w-full p-2 bg-[#F69454] text-white rounded hover:bg-orange-600  ">
            Register
          </button>
        </form>

        {/* Divider */}
        {/* <div className="flex items-center justify-center gap-2 mt-4">
          <hr className="border-gray-300 w-1/5" />
          <span className="text-gray-500 text-sm">or continue with</span>
          <hr className="border-gray-300 w-1/5" />
        </div> */}

        {/* Social login */}
        {/* <div className="mt-4 flex justify-center items-center gap-6">
          <a 
            href="http://localhost:3000/api/users/auth/google"
            className="w-10 h-10 rounded-md bg-gray-200 flex items-center justify-center hover:bg-gray-300 text-lg"
          >
            G
          </a>
          <a
            className="w-10 h-10 rounded-md bg-gray-200 flex items-center justify-center hover:bg-gray-300 text-lg"
          >
            F
          </a>
        </div> */}

        {/* Footer */}
        <p className="mt-2 text-center text-gray-500 text-sm md:text-base">
          © 2025 FuelFlux. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default SignUp;
