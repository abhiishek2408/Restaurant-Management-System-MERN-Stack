import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
import UserContext from "../context/UseContext";


// Theme colors for advanced UI
const themeGradient = "bg-gradient-to-r from-pink-500 via-fuchsia-500 to-yellow-400";


// --- Skeleton Loader Component (Advanced) ---
const BookingSkeleton = () => (
  <div className="bg-white p-6 rounded-xl shadow-lg animate-pulse">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
      {/* Details Area Skeleton */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-3 mb-3">
          {/* Status/Header */}
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-6 bg-gray-200 rounded w-48"></div>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
          {/* Resources Skeleton */}
          <div className="h-3 bg-gray-200 rounded col-span-2 w-3/4"></div>
          {/* Date Skeleton */}
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
      {/* Status Pill Skeleton */}
      <div className="w-full md:w-28 h-10 bg-gray-300 rounded-lg mt-4 md:mt-0"></div>
    </div>
  </div>
);


const MyBookedEvent = () => {
  const { user, token } = useContext(UserContext); 
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      const timeoutId = setTimeout(() => {
          navigate("/login", { replace: true });
      }, 50); 
      return () => clearTimeout(timeoutId);
    }
    
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const res = await axios.get("https://restaurant-management-system-mern-stack.onrender.com/api/event-booking/my-bookings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBookings(res.data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          // Clear stale token and redirect
          // (Assuming a logout/clear state function exists in context)
          navigate("/login", { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token, navigate]);

  
  // Handle redirection or initial loading state
  if (!user || !token) {
      // Return null to avoid rendering booking UI while redirect is pending
      return null; 
  }


  // --- Display Skeleton Loader while loading is TRUE ---
  if (loading) {
    return (
      <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8 text-center">
            <h1 className={`text-4xl font-extrabold bg-clip-text text-transparent ${themeGradient} tracking-tight drop-shadow-lg`} style={{ fontFamily: 'Poppins, cursive' }}>
              My Event Bookings <span role="img" aria-label="event">🎉</span>
            </h1>
            <p className="text-gray-500 mt-2 text-lg font-medium">
              Loading your event bookings with advanced UI...
            </p>
          </header>
          <div className="space-y-6">
            <BookingSkeleton />
            <BookingSkeleton />
            <BookingSkeleton />
          </div>
        </div>
      </div>
    );
  }


  // --- Rendering the Bookings List ---
  if (!bookings.length)
    return (
      <div className="text-center p-12 bg-white/80 rounded-2xl shadow-2xl m-6 max-w-4xl mx-auto border border-pink-100">
        <svg
          className="mx-auto h-14 w-14 text-pink-400 drop-shadow-lg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="mt-4 text-xl font-bold text-pink-700">
          No Event Bookings Found
        </h3>
        <p className="mt-2 text-base text-gray-500">
          Looks like you haven't booked any events yet.
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <div className="flex justify-center items-center">
            <h1 className={`text-4xl font-extrabold bg-clip-text text-transparent ${themeGradient} text-center tracking-tight drop-shadow-lg`} style={{ fontFamily: 'Poppins, cursive' }}>
              My Booked Events
            </h1>
            <span role="img" aria-label="event" className="ml-3 text-3xl align-middle">🎉</span>
          </div>
          <p className="text-center text-gray-500 mt-2 text-lg font-medium">
            View and manage your upcoming and past event bookings.
          </p>
        </header>

        <div className="space-y-8">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white/90 p-7 rounded-2xl transition duration-300 ease-in-out border border-grey-100 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0"
              style={{ backdropFilter: 'blur(2px)' }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-2">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${booking.status === 'confirmed'
                      ? 'bg-green-100 text-green-700 ring-green-500/10'
                      : booking.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-700 ring-yellow-500/10'
                        : 'bg-red-100 text-red-700 ring-red-500/10'}`}
                  >
                    {booking.status.toUpperCase()}
                  </span>
                  <h2 className="text-xl font-medium text-pink-700 truncate">
                    {booking.event?.name || "Untitled Event"} on {new Date(booking.date).toLocaleDateString('en-IN', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-base text-gray-700">
                  {booking.resources?.length > 0 && (
                    <p className="font-medium col-span-2">
                      <span className="text-gray-500">Resources:</span>{' '}
                      <span className="font-semibold text-pink-700/90">
                        {booking.resources.map((r) => r?.name || 'N/A').join(', ')}
                      </span>
                    </p>
                  )}
                  <p>
                    <span className="text-gray-500">Date:</span>{' '}
                    {new Date(booking.date).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                  <p>
                    <span className="text-gray-500">Charges:</span>{' '}
                    <span className="font-bold text-green-700">₹{booking.charges || 0}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyBookedEvent;