import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-blue-500 p-4 w-[100vw]">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-xl">
          My Navbar
        </div>
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
        <div className={`md:flex md:items-center ${isOpen ? 'block' : 'hidden'}`}>
          <Link to="/Profile">
          < div className="block md:inline-block mt-4 md:mt-0 text-white hover:text-gray-300 mr-4">
            Profile
          </div>
          </Link>
          <Link to="/LeaveForm">
            < div className="block md:inline-block mt-4 md:mt-0 text-white hover:text-gray-300 mr-4">
              Leave Form
            </div>
          </Link>

          < div className="block md:inline-block mt-4 md:mt-0 text-white hover:text-gray-300 mr-4">
            Services
          </div>
          < div className="block md:inline-block mt-4 md:mt-0 text-white hover:text-gray-300">
            Contact
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
