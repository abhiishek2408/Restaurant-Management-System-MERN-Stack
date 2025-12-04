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
    <div className="max-w-2xl mx-auto p-8 bg-white min-h-screen rounded-3xl border border-pink-200">
      <h1 className="text-4xl font-extrabold text-center mb-8 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-fuchsia-500 to-yellow-400 flex items-center justify-center gap-2">
        <span role="img" aria-label="table">🍽️</span> Reserve a Table
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border-2 border-pink-200 rounded-xl p-3 bg-white focus:ring-2 focus:ring-pink-400 text-lg"
        />

        <select
          value={startTime}
          onChange={(e) => {
            setStartTime(e.target.value);
            setEndTime("");
          }}
          className="border-2 border-pink-200 rounded-xl p-3 bg-white focus:ring-2 focus:ring-pink-400 text-lg"
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
          className="border-2 border-pink-200 rounded-xl p-3 bg-white focus:ring-2 focus:ring-pink-400 text-lg"
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
          className={`bg-gradient-to-r from-pink-500 via-fuchsia-500 to-yellow-400 text-white font-bold rounded-xl px-4 py-2 transition flex items-center justify-center gap-2 text-lg ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:from-yellow-400 hover:to-pink-500"
          }`}
        >
          {loading ? "Searching..." : <><span role="img" aria-label="search">🔍</span> Search</>}
        </button>
      </div>

      {/* Available Tables */}
      {availableTables.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {availableTables.map((t) => (
            <div
              key={t._id}
              onClick={() => !booking && setSelectedTable(t._id)}
              className={`p-6 rounded-2xl border-2 cursor-pointer transition-colors duration-200 flex flex-col gap-2 bg-white ${
                selectedTable === t._id
                  ? "border-pink-500 bg-pink-50"
                  : "border-gray-200 hover:border-pink-300"
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-extrabold text-lg flex items-center gap-2"><span role="img" aria-label="table">🪑</span> {t.name}</span>
                <span className="text-pink-600 font-semibold bg-pink-100 px-3 py-1 rounded-full">{t.capacity} seats</span>
              </div>
              <p className="text-xs text-gray-500">
                {selectedTable === t._id ? <span className="text-pink-600 font-bold">Selected</span> : "Click to select"}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* No Tables Found */}
      {searched && !loading && availableTables.length === 0 && (
        <p className="mt-8 text-center text-red-600 font-bold text-lg">
          <span role="img" aria-label="no-table">❌</span> No tables available for this time slot.
        </p>
      )}

      {/* Confirm Button */}
      {availableTables.length > 0 && (
        <div className="mt-8 text-center">
          <button
            onClick={handleBook}
            disabled={!selectedTable || booking}
            className={`px-8 py-3 font-bold rounded-xl text-lg transition flex items-center justify-center gap-2 ${
              !selectedTable || booking
                ? "bg-green-300 text-white cursor-not-allowed"
                : "bg-gradient-to-r from-green-500 via-lime-400 to-yellow-300 text-white hover:from-yellow-400 hover:to-green-500"
            }`}
          >
            {booking ? "Booking..." : <><span role="img" aria-label="confirm">✅</span> Confirm Reservation</>}
          </button>
        </div>
      )}
    </div>
  );
};

export default Reservation;
