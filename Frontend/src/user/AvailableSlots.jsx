// AvailableSlots.jsx
import React, { useState } from "react";
import axios from "axios";

const AvailableSlots = ({ slots, partySize }) => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");

  const handleBooking = async () => {
    if (!guestName || !selectedSlot) return alert("Enter name and select slot");

    try {
      const payload = {
        guestName,
        guestPhone,
        date: selectedSlot.startTime,
        startTime: `${selectedSlot.startTime.split("T")[1].slice(0,5)}`,
        partySize,
        tableIds: [selectedSlot.tableId],
        duration: (new Date(selectedSlot.endTime) - new Date(selectedSlot.startTime)) / 60000
      };
      const res = await axios.post("http://localhost:5000/api/v1/reservations", payload);
      setBookingMessage("Booking Confirmed! 🎉");
    } catch (err) {
      console.error(err);
      setBookingMessage("Booking Failed: " + (err.response?.data?.error || "Server error"));
    }
  };

  return (
    <div>
      <h3>Available Slots</h3>
      <ul>
        {slots.map(slot => (
          <li key={slot.tableId + slot.startTime}>
            <input
              type="radio"
              name="slot"
              onChange={() => setSelectedSlot(slot)}
            />
            Table {slot.tableName} | {new Date(slot.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
            {new Date(slot.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} | Price: {slot.price} {slot.currency}
          </li>
        ))}
      </ul>

      <div>
        <label>Guest Name:</label>
        <input type="text" value={guestName} onChange={(e) => setGuestName(e.target.value)} />
      </div>
      <div>
        <label>Phone (optional):</label>
        <input type="text" value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} />
      </div>
      <button onClick={handleBooking} disabled={!selectedSlot}>Confirm Booking</button>

      {bookingMessage && <p>{bookingMessage}</p>}
    </div>
  );
};

export default AvailableSlots;
