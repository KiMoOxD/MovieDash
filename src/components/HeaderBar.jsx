import React from 'react';
import { FaSearch, FaBell } from 'react-icons/fa';

const HeaderBar = () => {
  return (
    <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200">
      {/* Search Bar */}
      <div className="relative flex items-center bg-gray-100 rounded-full px-4 py-2 w-96">
        <FaSearch className="text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Search movies, series, users..."
          className="bg-transparent outline-none text-gray-800 placeholder-gray-500 flex-1"
        />
      </div>

      {/* Right Side: Notification + User Profile */}
      <div className="flex items-center space-x-4">
        {/* Notification Bell with Red Dot */}
        <div className="relative">
          <FaBell className="text-gray-700 h-5 w-5" />
          <span className="absolute -top-1 -right-1 bg-red-500 rounded-full h-2 w-2"></span>
        </div>

        {/* User Avatar + Info */}
        <div className="flex items-center space-x-3">
          <div className="bg-gray-200 rounded-full h-10 w-10 flex items-center justify-center">
            <span className="text-gray-800 font-semibold text-sm">AD</span>
          </div>
          <div className="text-left">
            <p className="text-gray-800 text-sm font-medium">Admin User</p>
            <p className="text-gray-500 text-xs">admin@movieapp.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderBar;