import React from 'react';
import { FiSearch, FiUser, FiShoppingBag } from 'react-icons/fi';

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between py-5 font-medium border-b border-gray-200 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <div className="text-2xl font-bold tracking-wider">
        FOREVER<span className="text-pink-500">.</span>
      </div>
      <ul className="hidden sm:flex gap-6 text-sm text-gray-700">
        <li className="flex flex-col items-center gap-1 cursor-pointer">
          <p>HOME</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700" />
        </li>
        <li className="cursor-pointer">COLLECTION</li>
        <li className="cursor-pointer">ABOUT</li>
        <li className="cursor-pointer">CONTACT</li>
      </ul>
      <div className="flex items-center gap-6">
        <FiSearch className="w-5 h-5 cursor-pointer text-gray-700" />
        <FiUser className="w-5 h-5 cursor-pointer text-gray-700" />
        <div className="relative cursor-pointer">
          <FiShoppingBag className="w-5 h-5 text-gray-700" />
          <span className="absolute -right-1 -bottom-1 w-4 h-4 bg-black text-white rounded-full text-[10px] flex items-center justify-center">
            0
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;