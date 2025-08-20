import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import mapimg from '../assets/Mask group.png';
import vector from '../assets/Vector.png';

const Waitscreen = () => {
  const navigate = useNavigate();

 useEffect(() => {
  localStorage.setItem("step_waitscreen", "done");
  const timer = setTimeout(() => {
    navigate('/mainpage');
  }, 1000);
  return () => clearTimeout(timer);
}, []);

  return (
    <div className='h-screen w-screen flex justify-center items-center px-4'>
      <div className='flex flex-col gap-4 justify-center items-center w-full max-w-md'>
        <img
          className='w-full max-w-xs h-auto object-contain'
          src={mapimg}
          alt="mapimg"
        />
        <div className='flex flex-row gap-2 justify-center items-center flex-wrap text-center'>
          <img className='w-8 h-8 sm:w-10 sm:h-10' src={vector} alt="vectimg" />
          <h1 className='font-poppins text-xl sm:text-2xl md:text-3xl font-bold text-[#000000]'>
            Fetching your Location
          </h1>
        </div>
        <h1 className='font-poppins text-sm sm:text-base md:text-lg text-[#7B7A7A] text-center px-2'>
          Allow FuelFlux to use your Location once, or while using the site
        </h1>
      </div>
    </div>
  );
};

export default Waitscreen;
