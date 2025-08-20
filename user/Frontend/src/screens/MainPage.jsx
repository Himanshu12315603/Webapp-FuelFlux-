// import React from 'react'
// import HeaderComp from '../components/HeaderComp'
// import Map from '../assets/mapmain.png'
// const MainPage = () => {
//   return (
//  <div>

//     <div className=" min-h-screen bg-gray-100">
//            <HeaderComp/>
      
//       <div className="  mt-10 gap-6 flex flex-col justify-center items-center">
   
//       <img src={Map} alt="map" />

//         <h1 className="text-3xl md:text-5xl font-bold text-center text-black">
//           FIND FUEL STATIONS NEAR YOU
//         </h1>

//         {/* Search and Book Button */}
//         <div className="flex mt-6">
//           <input
//             type="text"
//             placeholder="Search.."
//             className="px-4 py-2 rounded-l-lg border border-black text-lg w-64"
//           />
//           <button className="bg-orange-500 text-white px-6 py-2 rounded-r-lg border border-black hover:bg-orange-600">
//             Book Now
//           </button>
//         </div>
      

//       {/* Fuel Prices */}
//       <div className="bg-white  mx-auto mt-6 shadow rounded-lg p-6">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold">TODAY'S FUEL PRICES</h2>
//           <p className="text-sm text-gray-500">Last updated: 10: 30 AM</p>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
//           {/* Petrol */}
//           <div className="bg-gray-100 p-4 rounded">
//             <h3 className="text-lg font-medium">Petrol</h3>
//             <p className="text-orange-600 text-2xl font-bold">₹90.10</p>
//             <p className="text-green-500 text-sm mt-1">↓ 0.03 since yesterday</p>
//           </div>

//           {/* Diesel */}
//           <div className="bg-gray-100 p-4 rounded">
//             <h3 className="text-lg font-medium">Diesel</h3>
//             <p className="text-orange-600 text-2xl font-bold">₹85.10</p>
//             <p className="text-green-500 text-sm mt-1">↓ 0.02 since yesterday</p>
//           </div>

//           {/* CNG */}
//           <div className="bg-gray-100 p-4 rounded">
//             <h3 className="text-lg font-medium">CNG</h3>
//             <p className="text-orange-600 text-2xl font-bold">₹70.11</p>
//             <p className="text-red-500 text-sm mt-1">↑ 0.03 since yesterday</p>
//           </div>
//         </div>
//       </div>
//       </div>
//       </div>
//       {/* Footer */}
//       <footer className="bg-black text-white mt-8 py-4 px-4 md:px-10 text-sm flex flex-wrap justify-between items-center">
//         <a href="#" className="mb-2 md:mb-0">About Us</a>
//         <a href="#" className="mb-2 md:mb-0">Terms and Conditions</a>
//         <a href="#" className="mb-2 md:mb-0">Privacy Policy</a>
//         <a href="#" className="mb-2 md:mb-0">Contact Us</a>
//         <a href="#">Help</a>
//       </footer>
   
      
//  </div>
    
//   )
// }

// export default MainPage



import React from 'react';
import HeaderComp from '../components/HeaderComp';
import Map from '../assets/map.png';
import FooterComp from '../components/FooterComp';
import { useNavigate } from 'react-router';


const MainPage = () => {
  
  const navigate = useNavigate() ;
  const handlebook = () =>{
    
    navigate('/stations')
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <HeaderComp />
   
      {/* Background Wrapper */}
        <div className="relative w-full min-h-screen bg-white">
            {/* Background image with reduced opacity */}
            <div className="absolute inset-0 z-0">
              <img src={Map} alt="Map" className="w-full h-full object-cover opacity-40" />
            </div>
        {/* Overlay and Main Content */}
        <div className="backdrop-brightness-95 py-10 px-4 flex flex-col items-center gap-6">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-center text-black">
            FIND FUEL STATIONS NEAR YOU
          </h1>

          {/* Search Section */}
          <div className="w-full max-w-md flex flex-col sm:flex-row justify-center items-center sm:items-stretch mt-4 gap-2 sm:gap-0">
            {/* <input
              type="text"
              placeholder="Search.."
              className="px-4 py-2 rounded-lg sm:rounded-l-lg sm:rounded-r-none border border-black text-base w-full"
            /> */}
            <button onClick={handlebook} className="bg-orange-500 text-white px-6 py-2 w-full sm:w-96 rounded-lg   border border-black hover:bg-orange-600">
              Book Now
            </button>
          </div>

          {/* Fuel Prices Card */}
          <div className="bg-white bg-opacity-90 w-full max-w-4xl mt-6 shadow rounded-lg p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
              <h2 className="text-lg sm:text-xl font-semibold">TODAY'S FUEL PRICES</h2>
              <p className="text-sm text-gray-500">Last updated: 10:30 AM</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-center">
              {/* Petrol */}
              <div className="bg-gray-100 p-4 rounded">
                <h3 className="text-lg font-medium">Petrol</h3>
                <p className="text-orange-600 text-2xl font-bold">₹90.10</p>
                <p className="text-green-500 text-sm mt-1">↓ 0.03 since yesterday</p>
              </div>

              {/* Diesel */}
              <div className="bg-gray-100 p-4 rounded">
                <h3 className="text-lg font-medium">Diesel</h3>
                <p className="text-orange-600 text-2xl font-bold">₹85.10</p>
                <p className="text-green-500 text-sm mt-1">↓ 0.02 since yesterday</p>
              </div>

              {/* CNG */}
              <div className="bg-gray-100 p-4 rounded">
                <h3 className="text-lg font-medium">CNG</h3>
                <p className="text-orange-600 text-2xl font-bold">₹70.11</p>
                <p className="text-red-500 text-sm mt-1">↑ 0.03 since yesterday</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
     <FooterComp/>
    </div>
  );
};

export default MainPage;
