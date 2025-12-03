import React, { useState, useEffect, useContext, useCallback } from "react";
import API from "./api";
import UserContext from "../context/UseContext";

// --- Advanced UI Components for UX ---

// 1. Skeleton Loader Component
const ReservationSkeleton = () => (
  <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-pink-700/70 animate-pulse">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
      {/* Details Area Skeleton */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-3 mb-3">
          {/* Status/Header */}
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-6 bg-gray-200 rounded w-48"></div>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
          {/* Tables Skeleton */}
          <div className="h-3 bg-gray-200 rounded col-span-2 w-3/4"></div>
          {/* Time/Date Skeleton */}
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
      {/* Button Skeleton */}
      <div className="w-full md:w-28 h-10 bg-gray-300 rounded-lg mt-4 md:mt-0"></div>
    </div>
  </div>
);

// 2. Error Message Component
const ErrorMessage = ({ message, onRetry }) => (
  <div className="text-center p-12 bg-red-50 rounded-xl shadow-lg m-6 max-w-xl mx-auto border-2 border-red-300">
    <svg
      className="mx-auto h-12 w-12 text-red-500"
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
    <h3 className="mt-2 text-lg font-semibold text-red-800">
      Error Fetching Data
    </h3>
    <p className="mt-1 text-sm text-red-600 font-medium">
      {message || "Could not retrieve your reservations."}
    </p>
    <div className="mt-4">
      <button
        onClick={onRetry}
        className="px-4 py-2 text-sm font-semibold rounded-lg text-white bg-pink-600 hover:bg-pink-700 transition"
      >
        Try Again
      </button>
    </div>
  </div>
);

const MyReservations = () => {
  const { user, token } = useContext(UserContext);
  const [reservations, setReservations] = useState([]);
  const [timeLeft, setTimeLeft] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReservations = useCallback(async () => {
    console.log("User:", user);
    console.log("Token:", token);

    if (!user?._id || !token) {
      console.warn("User or token not found yet!");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const res = await API.get("/reservations/my-reservations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Reservations fetched:", res.data);
      setReservations(res.data.reservations || []);
    } catch (err) {
      console.error("Axios Error:", err);
      setError(err.response?.data?.error || "Failed to fetch reservations.");
    } finally {
      setLoading(false);
    }
  }, [user, token]);

  // --- 🆕 Timer Effect ---
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const updatedTimes = {};

      reservations.forEach((resv) => {
        const start = new Date(resv.startTime);
        const diffMs = start - now;

        if (diffMs > 0) {
          const hours = Math.floor(diffMs / (1000 * 60 * 60));
          const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
          updatedTimes[resv._id] = `${hours}h ${minutes}m ${seconds}s`;
        } else {
          updatedTimes[resv._id] = "Started";
        }
      });

      setTimeLeft(updatedTimes);
    }, 1000);

    return () => clearInterval(interval);
  }, [reservations]);

    useEffect(() => {
      fetchReservations();
    }, [fetchReservations]);

  const handleCancel = async (id, startTime) => {
    const diffHours = (new Date(startTime) - new Date()) / (1000 * 60 * 60);
    if (diffHours < 3) {
      window.alert("Cannot cancel reservation within 3 hours of start time.");
      return;
    }

    if (!window.confirm("Are you sure you want to cancel this reservation?"))
      return;

    try {
      await API.patch(`/reservations/cancel/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      window.alert("Reservation cancelled successfully!");
      fetchReservations();
    } catch (err) {
      console.error("Axios Error:", err);
      window.alert(err.response?.data?.error || "Failed to cancel reservation");
    }
  };

  const formatTime = (time) =>
    new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const getStatusClasses = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-700 ring-green-500/10";
      case "pending":
        return "bg-yellow-100 text-yellow-700 ring-yellow-500/10";
      case "cancelled":
        return "bg-red-100 text-red-700 ring-red-500/10";
      default:
        return "bg-gray-100 text-gray-700 ring-gray-500/10";
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8 text-center">
            <h1 className="text-4xl font-extrabold text-pink-700 tracking-tight">
              My Reserved Tables 🍽️
            </h1>
            <p className="text-gray-500 mt-2">
              Loading your bookings with advanced UI...
            </p>
          </header>
          <div className="space-y-6">
            <ReservationSkeleton />
            <ReservationSkeleton />
            <ReservationSkeleton />
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <ErrorMessage message={error} onRetry={fetchReservations} />
      </div>
    );

  if (!reservations.length)
    return (
      <div className="text-center p-12 bg-white rounded-xl shadow-lg m-6 max-w-4xl mx-auto">
        <svg
          className="mx-auto h-12 w-12 text-pink-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <h3 className="mt-2 text-lg font-semibold text-gray-900">
          No Reservations Found
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Looks like you haven't made any reservations yet.
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-pink-700 text-center tracking-tight">
            My Reserved Tables 🍽️
          </h1>
          <p className="text-center text-gray-500 mt-2">
            View and manage your upcoming and past bookings.
          </p>
        </header>

        <div className="space-y-6">
          {reservations.map((resv) => (
            <div
              key={resv._id}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 ease-in-out border-t-4 border-pink-700/70 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-2">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${getStatusClasses(
                      resv.status
                    )}`}
                  >
                    {resv.status.toUpperCase()}
                  </span>
                  <h2 className="text-xl font-semibold text-gray-900 truncate">
                    Reservation for{" "}
                    {new Date(resv.date).toLocaleDateString("en-IN", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-700">
                  <p className="font-medium col-span-2">
                    <span className="text-gray-500">Tables:</span>{" "}
                    <span className="font-semibold text-pink-700/90">
                      {resv.tableIds.map((t) => t?.name || "N/A").join(", ")}
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-500">From:</span>{" "}
                    {formatTime(resv.startTime)}
                  </p>
                  <p>
                    <span className="text-gray-500">To:</span>{" "}
                    {formatTime(resv.endTime)}
                  </p>
                  {/* 🆕 Time Left */}
                  <p className="col-span-2 text-blue-600 font-semibold">
                    ⏳ Time Left: {timeLeft[resv._id] || "Calculating..."}
                  </p>
                </div>
              </div>

              {resv.status === "confirmed" && (
                <button
                  onClick={() => handleCancel(resv._id, resv.startTime)}
                  className="w-full md:w-auto px-6 py-2 text-sm font-semibold rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-150 ease-in-out shadow-md hover:shadow-lg disabled:opacity-50 mt-4 md:mt-0"
                >
                  Cancel Reservation
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyReservations;
