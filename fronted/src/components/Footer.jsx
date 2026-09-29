import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 mt-20 pt-10 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 text-sm">
        <div>
          <div className="text-2xl font-bold tracking-wider mb-5">
            FORMALFIT<span className="text-pink-500">.</span>
          </div>
          <p className="w-full md:w-2/3 text-gray-600">
            We believe in providing the best quality products to our customers. Our mission is to make sure that our customers are satisfied with their purchases and have a great shopping experience.
          </p>
        </div>
        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li className="cursor-pointer">Home</li>
            <li className="cursor-pointer">About us</li>
            <li className="cursor-pointer">Delivery</li>
            <li className="cursor-pointer">Privacy policy</li>
          </ul>
        </div>
        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>+1-212-456-7890</li>
            <li>contact@formalfit.com</li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="py-5 text-sm text-center text-gray-500">
        Copyright 2026 @ formalfit.com - All Right Reserved.
      </p>
    </footer>
  );
};

export default Footer;