import React, { useState, useContext } from "react";
import API from "./api"; 
import UserContext from "../context/UseContext";

const Reservation = () => {
  const { user } = useContext(UserContext);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [availableTables, setAvailableTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(""); 
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(false);

  // Generate hours 1 → 23
  const hours = Array.from({ length: 23 }, (_, i) => i + 1);
  const formatHour = (hour) => String(hour).padStart(2, "0") + ":00";

  // Filter end times: only +1hr or +2hr allowed
  const endTimeOptions = startTime
    ? hours.filter(
        (h) => h > parseInt(startTime) && h <= parseInt(startTime) + 2
      )
    : [];

  const handleSearch = async () => {
    if (!date || !startTime || !endTime) {
      alert("Date, start time, and end time are required!");
      return;
    }

    setLoading(true);
    setSearched(true); // mark that search was performed
    try {
      const res = await API.get("/reservations/available", {
        params: {
          date,
          startTime: formatHour(startTime),
          endTime: formatHour(endTime),
        },
      });
      setAvailableTables(res.data.availableTables || []);
      setSelectedTable("");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to fetch available tables.");
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {
    if (!selectedTable) {
      alert("Please select one table.");
      return;
    }

    if (!user || !user._id) {
      alert("User not logged in!");
      return;
    }

    setBooking(true);
    try {
      await API.post("/reservations", {
        userId: user._id,
        date,
        startTime: formatHour(startTime),
        endTime: formatHour(endTime),
        tableIds: [selectedTable],
      });

      alert("Reservation confirmed!");
      // Reset form
      setDate("");
      setStartTime("");
      setEndTime("");
      setAvailableTables([]);
      setSelectedTable("");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to book the table.");
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Reserve a Table
      </h1>

 
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border rounded-lg p-2"
        />

        <select
          value={startTime}
          onChange={(e) => {
            setStartTime(e.target.value);
            setEndTime("");
          }}
          className="border rounded-lg p-2"
        >
          <option value="">Start Time</option>
          {hours.map((h) => (
            <option key={h} value={h}>
              {formatHour(h)}
            </option>
          ))}
        </select>

        <select
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="border rounded-lg p-2"
          disabled={!startTime}
        >
          <option value="">End Time</option>
          {endTimeOptions.map((h) => (
            <option key={h} value={h}>
              {formatHour(h)}
            </option>
          ))}
        </select>

        <button
          onClick={handleSearch}
          disabled={loading || !date || !startTime || !endTime}
          className={`bg-indigo-600 text-white font-semibold rounded-lg px-4 py-2 transition ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-700"
          }`}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Available Tables */}
      {availableTables.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {availableTables.map((t) => (
            <div
              key={t._id}
              onClick={() => !booking && setSelectedTable(t._id)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedTable === t._id
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-bold">{t.name}</span>
                <span className="text-gray-500">{t.capacity} seats</span>
              </div>
              <p className="text-xs text-gray-500">
                {selectedTable === t._id ? "Selected" : "Click to select"}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* No Tables Found */}
      {searched && !loading && availableTables.length === 0 && (
        <p className="mt-6 text-center text-red-600 font-medium">
          No tables available for this time slot.
        </p>
      )}

      {/* Confirm Button */}
      {availableTables.length > 0 && (
        <div className="mt-6 text-center">
          <button
            onClick={handleBook}
            disabled={!selectedTable || booking}
            className={`px-6 py-3 font-bold rounded-lg transition ${
              !selectedTable || booking
                ? "bg-green-300 text-white cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {booking ? "Booking..." : "Confirm Reservation"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Reservation;
