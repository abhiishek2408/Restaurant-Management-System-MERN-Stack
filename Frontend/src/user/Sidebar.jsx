import React, { useContext, useState, useEffect } from "react";
import LocationContext from "../context/LocationContext";
import { FaMapMarkerAlt, FaSearch } from "react-icons/fa";

const Sidebar = ({ closeSidebar }) => {
  const { city, setCity, fetchCurrentLocation, displayLocation, setDisplayLocation } =
    useContext(LocationContext);
  const [inputValue, setInputValue] = useState(city);
  const [searchLoading, setSearchLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    setInputValue(city);
  }, [city]);

  // Fetch current location on first mount
  useEffect(() => {
    const fetchOnMount = async () => {
      setLocationLoading(true);
      await fetchCurrentLocation();
      await new Promise((resolve) => setTimeout(resolve, 900));
      setLocationLoading(false);
    };
    fetchOnMount();
    // eslint-disable-next-line
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setSearchLoading(true);
      // Simulate async search
      await new Promise((resolve) => setTimeout(resolve, 900));
      setCity(inputValue.trim());
      setDisplayLocation(inputValue.trim()); // ✅ update active location
      setSearchLoading(false);
    }
  };

  const handleFetchLocation = async () => {
    setLocationLoading(true);
    await fetchCurrentLocation();
    // Simulate delay for animation
    await new Promise((resolve) => setTimeout(resolve, 900));
    setLocationLoading(false);
  };

  return (
    <div className="fixed top-0 left-0 w-80 h-full bg-gradient-to-br from-blue-50 via-pink-50 to-purple-100 text-black shadow-2xl p-8 z-50 flex flex-col font-lato backdrop-blur-xl border-r border-blue-100">
      <button
        onClick={closeSidebar}
        className="self-end mb-2 w-12 h-12 flex items-center justify-center rounded-full bg-white/40 shadow-lg hover:scale-110 hover:shadow-pink-400/40 transition-all duration-200 text-black text-4xl leading-none hover:text-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-400 animate-pulse relative"
        aria-label="Close sidebar"
        style={{
          textShadow: '0 2px 8px rgba(0,0,0,0.12)',
          boxShadow: '0 4px 24px 0 rgba(236,72,153,0.18), 0 1.5px 8px 0 rgba(59,130,246,0.14)',
        }}
      >
        <span className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-400 via-blue-400 to-purple-400 opacity-30 blur-lg z-0"></span>
        <span className="relative z-10">&times;</span>
      </button>

      <div className="mb-6 rounded-2xl shadow-lg p-0 overflow-hidden border border-blue-100 bg-white/60 backdrop-blur-xl">
        <div className="bg-gradient-to-r from-pink-400 via-blue-400 to-purple-400 p-6 flex items-center gap-3 rounded-t-2xl">
          <FaMapMarkerAlt className="text-white text-3xl drop-shadow-lg animate-bounce" />
          <h2 className="text-2xl text-black tracking-wide drop-shadow-lg">Find Your Location</h2>
        </div>
        <div className="bg-white/80 p-6 rounded-b-2xl">
          <p className="text-sm text-black mb-6 mt-2">
            Enter a city to get started or use your current location.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by city name..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full rounded-xl px-4 py-3 pl-10 text-black placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-pink-400/60 transition-all text-lg shadow-lg bg-white/70 backdrop-blur-lg border-2 border-transparent focus:border-gradient-to-r focus:from-pink-400 focus:via-blue-400 focus:to-purple-400"
                style={{
                  boxShadow: '0 2px 12px 0 rgba(236,72,153,0.10), 0 1.5px 8px 0 rgba(59,130,246,0.08)',
                  background: 'rgba(255,255,255,0.7)',
                }}
                disabled={searchLoading}
              />
              <button
                type="submit"
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-pink-500 to-blue-500 hover:from-blue-500 hover:to-pink-500 text-white p-2 rounded-full shadow-lg transition-all duration-200 border-2 border-white flex items-center justify-center ${searchLoading ? 'animate-spin bg-blue-400 cursor-not-allowed' : ''}`}
                aria-label="Search city"
                disabled={searchLoading}
              >
                {searchLoading ? (
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                ) : (
                  <FaSearch className="text-lg" />
                )}
              </button>
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 pointer-events-none text-lg" />
            </div>
          </form>
        </div>
      </div>

      <div className="bg-white/80 p-6 rounded-2xl shadow-lg flex-grow flex flex-col justify-between border border-blue-100 mt-2 backdrop-blur-xl">
        <div className="flex-grow">
          <button
            onClick={handleFetchLocation}
            className={`w-full bg-gradient-to-r from-blue-100 to-pink-100 border border-blue-200 text-black py-3 rounded-xl hover:bg-blue-200 hover:text-pink-600 transition-all flex items-center justify-center gap-2 shadow-md ${locationLoading ? 'animate-pulse cursor-not-allowed opacity-70' : ''}`}
            disabled={locationLoading}
          >
            {locationLoading ? (
              <svg className="w-5 h-5 text-pink-500 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
            ) : (
              <FaMapMarkerAlt className="text-pink-500 animate-pulse" />
            )}
            <span className="tracking-wide">{locationLoading ? 'Fetching...' : 'Use current location'}</span>
          </button>
        </div>

        <div className="mt-6 border-t border-blue-200 pt-6">
          <h3 className="text-sm text-black uppercase tracking-wide mb-2 flex items-center gap-2">
            <FaMapMarkerAlt className="text-blue-400" />
            Active Location
          </h3>
          <p className="text-lg text-black leading-tight drop-shadow">
            {displayLocation || "Not set"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
