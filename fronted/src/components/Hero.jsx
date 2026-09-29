import React from 'react';
import homeModelImg from '../assets/homemodel.webp';

const Hero = () => {
  return (
    <div className="flex flex-col sm:flex-row border border-gray-300 my-6 mx-4 sm:mx-[5vw] md:mx-[7vw] lg:mx-[9vw]">
      {/* Hero Left Side */}
      <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0">
        <div className="text-[#414141]">
          <div className="flex items-center gap-2">
            <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
            <p className="font-medium text-sm md:text-base">OUR BESTSELLERS</p>
          </div>
          <h1 className="text-3xl sm:py-3 lg:text-5xl leading-relaxed font-serif">
            Latest Arrivals
          </h1>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm md:text-base cursor-pointer">SHOP NOW</p>
            <p className="w-8 md:w-11 h-[1px] bg-[#414141]"></p>
          </div>
        </div>
      </div>

      {/* Hero Right Side */}
      <div className="w-full sm:w-1/2 bg-[#fde1d3] flex justify-center items-end">
        <img
          src={homeModelImg}
          alt="Hero Model"
          className="w-full h-auto object-cover"
        />
      </div>
    </div>
  );
};

export default Hero;