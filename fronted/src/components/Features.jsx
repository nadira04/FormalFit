import React from 'react';
import { FiRefreshCw, FiCheckCircle, FiHeadphones } from 'react-icons/fi';

const Features = () => {
  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] my-20">
      <div className="flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-10">
        <div>
          <FiRefreshCw className="w-10 h-10 m-auto mb-3 text-gray-800" />
          <p className="font-semibold text-sm sm:text-base">Easy Exchange Policy</p>
          <p className="text-gray-400 text-xs sm:text-sm">We offer hassle free exchange policy</p>
        </div>
        <div>
          <FiCheckCircle className="w-10 h-10 m-auto mb-3 text-gray-800" />
          <p className="font-semibold text-sm sm:text-base">7 Days Return Policy</p>
          <p className="text-gray-400 text-xs sm:text-sm">We provide 7 days free return policy</p>
        </div>
        <div>
          <FiHeadphones className="w-10 h-10 m-auto mb-3 text-gray-800" />
          <p className="font-semibold text-sm sm:text-base">Best customer support</p>
          <p className="text-gray-400 text-xs sm:text-sm">We provide 24/7 customer support</p>
        </div>
      </div>

      <div className="text-center mt-16">
        <p className="text-2xl font-medium text-gray-800">Subscribe now & get 20% off</p>
        <p className="text-gray-400 mt-3 text-xs sm:text-sm">
          Subscribe to our newsletter and stay updated on the latest products, offers, and promotions.
        </p>
        <form onSubmit={(e) => e.preventDefault()} className="w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3">
          <input
            className="w-full sm:flex-1 outline-none text-sm"
            type="email"
            placeholder="Enter your email"
            required
          />
          <button type="submit" className="bg-black text-white text-xs px-10 py-4 font-semibold uppercase">
            SUBSCRIBE
          </button>
        </form>
      </div>
    </div>
  );
};

export default Features;