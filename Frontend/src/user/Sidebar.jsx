import React, { useContext, useState, useEffect } from "react";
import LocationContext from "../context/LocationContext";
import { FaMapMarkerAlt, FaSearch } from "react-icons/fa";

const Sidebar = ({ closeSidebar }) => {
  const { city, setCity, fetchCurrentLocation, displayLocation, setDisplayLocation } =
    useContext(LocationContext);
  const [inputValue, setInputValue] = useState(city);

  useEffect(() => {
    setInputValue(city);
  }, [city]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setCity(inputValue.trim());
      setDisplayLocation(inputValue.trim()); // ✅ update active location
    }
  };

  return (
    <div className="fixed top-0 left-0 w-80 h-full bg-gray-50 text-gray-800 shadow-xl p-8 z-50 flex flex-col font-lato">
      <button
        onClick={closeSidebar}
        className="self-end text-gray-400 font-bold text-4xl leading-none mb-6 hover:text-gray-600 transition-colors"
        aria-label="Close sidebar"
      >
        &times;
      </button>

      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Find Your Location</h2>
        <p className="text-sm text-gray-500 mb-6">
          Enter a city to get started or use your current location.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by city name..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 pl-10 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-pink-500 hover:bg-blue-600 text-white p-2 rounded-md"
            >
              <FaSearch />
            </button>
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md flex-grow flex flex-col justify-between">
        <div className="flex-grow">
          <button
            onClick={() => {
              fetchCurrentLocation();
            }}
            className="w-full bg-white border border-gray-300 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <FaMapMarkerAlt />
            <span>Use current location</span>
          </button>
        </div>

        <div className="mt-6 border-t border-gray-200 pt-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Active Location
          </h3>
          <p className="text-lg font-bold text-gray-900 leading-tight">
            {displayLocation || "Not set"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
