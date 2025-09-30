import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
import UserContext from "../context/UseContext";

// Define pink-700 theme colors for consistency
const themeColor = "pink-700";
const themeTextColor = `text-${themeColor}`; 
const themeBorderColor = `border-${themeColor}`;
const themeAccentColor = "pink-100";

// --- Skeleton Loader Component ---
// Renders a placeholder card that mimics the structure of a real booking item.
const BookingSkeleton = () => (
    <div
      className={`p-6 bg-white border-l-4 border-gray-300 border-t border-b border-r border-gray-200 rounded-md animate-pulse`}
    >
      <div className="flex justify-between items-start">
          {/* Title and Date Placeholder */}
          <div>
              <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>

          {/* Status Pill Placeholder */}
          <div className="h-7 bg-gray-200 rounded-full w-20"></div>
      </div>

      {/* Resources Placeholder */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="h-4 bg-gray-200 rounded w-28 mb-2"></div>
        <div className="flex gap-2">
            <div className="h-6 bg-gray-100 rounded-full w-20"></div>
            <div className="h-6 bg-gray-100 rounded-full w-16"></div>
        </div>
      </div>

      {/* Charges Placeholder */}
      <div className="mt-4 pt-4 border-t border-pink-100">
        <div className="h-5 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
);


const MyBookings = () => {
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
    // Render 3 skeleton cards to simulate a partial page load
    return (
        <div className="p-6 md:p-10 max-w-6xl mx-auto min-h-screen bg-gray-50">
            <div className="p-4 sm:p-8 bg-white border border-gray-200 rounded-lg"> 
                {/* Header placeholder */}
                <div className={`h-10 w-64 mx-auto mb-10 bg-gray-200 rounded-lg`}></div>
                <div className="space-y-4">
                    <BookingSkeleton />
                    <BookingSkeleton />
                    <BookingSkeleton />
                </div>
            </div>
        </div>
    );
  }

  // --- Rendering the Bookings List ---
  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto min-h-screen bg-gray-50">
      
      <div className="p-4 sm:p-8 bg-white border border-gray-200 rounded-lg"> 
        
        <h2 className={`text-3xl sm:text-4xl font-extrabold mb-10 pb-4 text-center border-b-4 ${themeBorderColor} ${themeTextColor}`}>
          My Event Bookings
        </h2>

        {bookings.length === 0 ? (
          <div className={`text-center p-12 border-2 border-dashed ${themeBorderColor} bg-${themeAccentColor} rounded-lg`}>
            <p className="text-2xl text-gray-700 font-semibold">
              You currently have no bookings.
            </p>
            <p className="text-gray-500 mt-2">
              All your booked events will appear here once confirmed.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className={`p-6 bg-white border-l-4 ${themeBorderColor} border-t border-b border-r border-gray-200 rounded-md transition duration-200 hover:bg-pink-50`}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                        <h3 className={`text-xl font-bold mb-1 text-gray-900`}>
                            {booking.event?.name || "Untitled Event"}
                        </h3>
                        <p className="text-sm text-gray-600">
                            <span className="font-medium">Booking Date:</span> {new Date(booking.date).toLocaleDateString()}
                        </p>
                    </div>

                    {/* Status Pill Logic (Green for Confirmed) */}
                    <div className={`mt-3 sm:mt-0 px-4 py-1.5 rounded-full text-sm font-semibold 
                        ${booking.status === 'confirmed' 
                           ? 'bg-green-100 text-green-700 border border-green-300' 
                         : booking.status === 'Pending' 
                           ? 'bg-yellow-100 text-yellow-700 border border-yellow-300' 
                           : 'bg-red-100 text-red-700 border border-red-300'}`
                    }>
                        {booking.status}
                    </div>
                </div>

                {/* Resources List */}
                {booking.resources?.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="font-semibold text-gray-700 mb-1">Resources Booked:</p>
                    <ul className="flex flex-wrap gap-2 text-sm text-gray-600">
                      {booking.resources.map((res) => (
                        <li key={res._id} className="px-3 py-1 bg-gray-100 rounded-full border border-gray-200">
                            {res.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Charges Display */}
                {booking.charges && (
                  <p className="mt-4 pt-4 border-t border-pink-200 text-lg font-extrabold text-green-700">
                    Total Charges: ₹{booking.charges}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;