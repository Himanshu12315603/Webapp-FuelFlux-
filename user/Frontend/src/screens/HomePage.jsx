import React from 'react';
import LOGO from '../assets/LOGO.png';
import Petrolpipe from '../assets/Pterolpipe.png';
import { useNavigate } from 'react-router';
const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-black min-h-screen flex flex-col items-center justify-center">
      {/* Logo Section - Aligned to the left */}
      <div className="w-full p-5 pl-8 sm:pl-16 md:pl-32 flex justify-start">
        <img className="w-[170px] h-[55px]" src={LOGO} alt="Logo img" />
      </div>

      {/* Main Content Section - Centered */}
      <div className="text-white text-center gap-3 flex flex-col items-center justify-center">
        <img className="w-[250px] h-[170px] sm:w-[430px] sm:h-[290px]" src={Petrolpipe} alt="Petrolpipe" />
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-semibold text-[#FFFFFF]">
          Welcome to <span className="text-[#F69454]">FuelFlux</span>
        </h1>
        <h2 className="text-xl sm:text-2xl text-[#F69454]">
          Fast & <span className="border-text">Reliable</span>
        </h2>
        <h1 className="font-Poppins text-[#7B7A7A] text-sm sm:text-base md:text-lg">Fuel Up Fast - Locate, Book, and Go!</h1>
        
        {/* Button Section */}
        <button className="mt-2 px-8 py-2 sm:px-10 sm:py-3 border border-[#F69454] border-2 flex text-center justify-center text-white rounded-lg   transition-all"
        onClick={()=>
          navigate('/login')
        }
        >
          GET STARTED
        </button>
      </div>
    </div>
  );
};

export default HomePage;
