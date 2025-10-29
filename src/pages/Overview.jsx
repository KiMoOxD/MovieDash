import React from 'react';
import { FaFilm, FaUsers, FaCreditCard } from 'react-icons/fa';
import { FiTv } from "react-icons/fi";


export default function Overview() {
  return (
    <div className="bg-white p-6 rounded-lg">
      <h1 className="text-2xl font-bold mb-1">Dashboard Overview</h1>
      <p className="text-gray-500 mb-6">Welcome back! Here's what's happening today.</p>
      <div className="grid grid-cols-4 gap-4">
        {/* Total Movies Card */}
        <div className="bg-white border border-gray-200 p-6 rounded-lg flex items-center justify-between">
          <div>
            <h2 className="text-sm text-gray-500/90">Total Movies</h2>
            <p className="text-xl font-semibold mt-1">2,543</p>
            <p className="text-green-500 text-sm mt-1">+12% from last month</p>
          </div>
          <div className="bg-gray-200 rounded-md p-2">
            <FaFilm className="h-6 w-6 text-gray-700" />
          </div>
        </div>

        {/* Total Series Card */}
        <div className="bg-white border border-gray-200 p-4 rounded-lg flex items-center justify-between">
          <div>
            <h2 className="text-sm text-gray-500/90">Total Series</h2>
            <p className="text-xl font-semibold mt-1">487</p>
            <p className="text-green-500 text-sm mt-1">+8% from last month</p>
          </div>
          <div className="bg-gray-200 rounded-md p-2">
            <FiTv className="h-6 w-6 text-gray-700" />
          </div>
        </div>

        {/* Active Users Card */}
        <div className="bg-white border border-gray-200 p-4 rounded-lg flex items-center justify-between">
          <div>
            <h2 className="text-sm text-gray-500/90">Active Users</h2>
            <p className="text-xl font-semibold mt-1">5,234</p>
            <p className="text-green-500 text-sm mt-1">+24% from last month</p>
          </div>
          <div className="bg-gray-200 rounded-md p-2">
            <FaUsers className="h-6 w-6 text-gray-700" />
          </div>
        </div>

        {/* Active Subscriptions Card */}
        <div className="bg-white border border-gray-200 p-4 rounded-lg flex items-center justify-between">
          <div>
            <h2 className="text-sm text-gray-500/90">Active Subscriptions</h2>
            <p className="text-xl font-semibold mt-1">3,521</p>
            <p className="text-green-600 text-sm mt-1">+18% from last month</p>
          </div>
          <div className="bg-gray-200 rounded-md p-2">
            <FaCreditCard className="h-6 w-6 text-gray-700" />
          </div>
        </div>
      </div>
    </div>
  );
}