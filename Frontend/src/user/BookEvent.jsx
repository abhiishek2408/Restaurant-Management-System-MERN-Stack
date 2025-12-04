import React, { useState, useEffect, useContext } from "react";
import { CalendarIcon, MapPinIcon, CheckCircleIcon, UsersIcon, GiftIcon } from '@heroicons/react/24/solid';
import axios from "axios";
import UserContext from "../context/UseContext";

const SearchEvents = () => {
  const { user } = useContext(UserContext);
  const [date, setDate] = useState("");
  const [venueId, setVenueId] = useState("");
  const [venues, setVenues] = useState([]); // all venues
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [attendees, setAttendees] = useState(1);
  const [resources, setResources] = useState([]);
  const [selectedResources, setSelectedResources] = useState([]);
  const [totalCharge, setTotalCharge] = useState(0);

  // Fetch venues on load
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const res = await axios.get("https://restaurant-management-system-mern-stack.onrender.com/api/event/venues");
        setVenues(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchVenues();
  }, []);

  // Search events from backend
  const searchEvents = async () => {
    try {
      const query = new URLSearchParams({ date, venueId }).toString();
      const res = await axios.get(
        `https://restaurant-management-system-mern-stack.onrender.com/api/event/search?${query}`
      );
      setEvents(res.data);
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  // Fetch resources for selected event
  const fetchResources = async (eventId) => {
    try {
      const res = await axios.get(
        `https://restaurant-management-system-mern-stack.onrender.com/api/event-booking/resources/${eventId}`
      );
      setResources(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const selectEvent = (event) => {
    setSelectedEvent(event);
    setAttendees(1);
    setSelectedResources([]);
    setTotalCharge(event.pricePerAttendee);
    fetchResources(event._id);
  };

  const toggleResource = (resource) => {
    let updated = [...selectedResources];
    if (updated.includes(resource._id))
      updated = updated.filter((id) => id !== resource._id);
    else updated.push(resource._id);
    setSelectedResources(updated);

    let resourcePrice = resources
      .filter((r) => updated.includes(r._id))
      .reduce((sum, r) => sum + r.price, 0);

    setTotalCharge(selectedEvent.pricePerAttendee * attendees + resourcePrice);
  };

  const changeAttendees = (num) => {
    if (num < 1) return;
    setAttendees(num);

    let resourcePrice = resources
      .filter((r) => selectedResources.includes(r._id))
      .reduce((sum, r) => sum + r.price, 0);
    setTotalCharge(selectedEvent.pricePerAttendee * num + resourcePrice);
  };



  const bookEvent = async () => {
  if (!selectedEvent) return alert("Select an event first");
  if (!date) return alert("Please select a date before booking.");

  try {
    const res = await axios.post(`https://restaurant-management-system-mern-stack.onrender.com/api/event-booking`, {
      userId: user._id,
      eventId: selectedEvent._id,
      date, // ✅ Include date
      attendees,
      resourceIds: selectedResources,
    });



    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Booking failed");
    alert(`✅ ${data.message}\n Booking confirmed! Total charge: $${res.data.totalCharge}`);
    setSelectedEvent(null);
    setSelectedResources([]);
    setAttendees(1);
    setEvents([]);
    setDate("");
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.error || "Booking failed");
  }
};


  return (
    <div className="min-h-screen p-4 sm:p-8 relative" style={{background:'#fff'}}>
      {/* SVG Booking-themed background */}
      <svg className="absolute top-0 left-0 w-full h-full -z-10" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <ellipse cx="500" cy="100" rx="120" ry="60" fill="#fceabb" fillOpacity="0.25" />
        <ellipse cx="100" cy="500" rx="140" ry="70" fill="#f8fafc" fillOpacity="0.35" />
        <ellipse cx="300" cy="300" rx="180" ry="90" fill="#fbbf24" fillOpacity="0.10" />
        <ellipse cx="400" cy="400" rx="80" ry="40" fill="#f472b6" fillOpacity="0.10" />
      </svg>
      <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 sm:p-10 border border-pink-200">
        <h2 className="text-4xl font-extrabold text-center mb-8 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-fuchsia-500 to-yellow-400 flex items-center justify-center gap-3">
          <GiftIcon className="w-8 h-8 text-pink-400" /> Find Your Perfect Event
        </h2>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 bg-pink-50 rounded-lg">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="flex-grow p-3 border-2 border-pink-200 rounded-xl bg-white focus:ring-2 focus:ring-pink-400 text-lg"
            placeholder="Select Date"
            aria-label="Select Date"
          />
          <select
            value={venueId}
            onChange={(e) => setVenueId(e.target.value)}
            className="flex-grow p-3 border-2 border-pink-200 rounded-xl bg-white focus:ring-2 focus:ring-pink-400 text-lg appearance-none"
            aria-label="Select Venue"
          >
            <option value="" className="text-gray-500">
              Select Venue
            </option>
            {venues.map((v) => (
              <option key={v._id} value={v._id}>
                {v.name}
              </option>
            ))}
          </select>
          <button
            onClick={searchEvents}
            className="px-6 py-3 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-yellow-400 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 text-lg sm:w-auto"
          >
            <CalendarIcon className="w-6 h-6 text-white" /> Search Events

          </button>
        </div>

        {/* Results Section */}
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Available Events
        </h3>
        {events.length === 0 && (
          <p className="text-gray-500 italic p-4 bg-gray-100 rounded-lg">
            No events found. Try selecting a date or venue.
          </p>
        )}
        <ul className="space-y-4">
          {events.map((event) => (
            <li
              key={event._id}
              className={`flex justify-between items-center p-4 rounded-xl border-2 transition-colors duration-200 ${
                selectedEvent?._id === event._id
                  ? "bg-pink-100 border-pink-500"
                  : "bg-white border-pink-100 hover:bg-pink-50 hover:border-pink-300"
              }`}
            >
              <div>
                <b className="text-lg font-bold text-pink-700 block">
                  {event.name}
                </b>
                <span className="text-sm text-gray-600 flex items-center gap-2">
                  <MapPinIcon className="w-4 h-4 text-pink-400" /> {event.venue.name} | <UsersIcon className="w-4 h-4 text-pink-400" /> ${event.pricePerAttendee.toFixed(2)} per attendee
                </span>
              </div>
              <button
                onClick={() => selectEvent(event)}
                className="ml-4 px-4 py-2 bg-pink-600 text-white text-sm font-medium rounded-full hover:bg-pink-700 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
              >
                {selectedEvent?._id === event._id ? "Selected" : "Select"}
              </button>
            </li>
          ))}
        </ul>

        {/* Booking Form */}
        {selectedEvent && (
          <div className="mt-10 p-6 border-2 border-pink-300 rounded-xl bg-white">
            <h3 className="text-2xl font-bold text-pink-700 mb-6 border-b pb-2">
              Book: {selectedEvent.name}
            </h3>

            {/* Attendees */}
            <div className="mb-6 flex items-center justify-between p-3 bg-pink-50 rounded-lg">
              <label className="text-gray-700 font-medium">Attendees:</label>
              <input
                type="number"
                value={attendees}
                onChange={(e) => changeAttendees(parseInt(e.target.value))}
                min={1}
                max={selectedEvent.maxAttendees}
                className="w-24 p-3 border-2 border-pink-200 rounded-xl text-center focus:ring-2 focus:ring-pink-400 text-lg"
              />
              <span className="text-sm text-gray-500">
                (Max: {selectedEvent.maxAttendees})
              </span>
            </div>

            {/* Resources */}
            <div className="mb-6 p-4 border-2 border-gray-200 rounded-xl">
              <h4 className="text-xl font-semibold text-gray-800 mb-3">
                Extra Resources
              </h4>
              {resources.length === 0 && (
                <p className="text-gray-500 italic">No extra resources available for this event.</p>
              )}
              <div className="space-y-2">
                {resources.map((r) => (
                  <div key={r._id} className="flex items-center justify-between">
                    <label className="flex items-center cursor-pointer text-gray-700">
                      <input
                        type="checkbox"
                        checked={selectedResources.includes(r._id)}
                        onChange={() => toggleResource(r)}
                        className="form-checkbox h-5 w-5 accent-pink-500 rounded focus:ring-pink-400 border-pink-200"
                      />
                      <span className="ml-3">
                        {r.name}
                      </span>
                    </label>
                    <span className="font-bold text-pink-600">
                      ${r.price.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Charge and Booking Button */}
            <div className="mt-8 pt-4 border-t border-pink-300 flex flex-col sm:flex-row justify-between items-center">
              <h4 className="text-2xl font-extrabold text-pink-700 mb-4 sm:mb-0 flex items-center gap-2">
                <CheckCircleIcon className="w-7 h-7 text-green-400" /> Total Charge: <span className="text-3xl">${totalCharge.toFixed(2)}</span>
              </h4>
              <button
                onClick={bookEvent}
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-yellow-400 text-white text-lg font-bold rounded-xl transition flex items-center justify-center gap-2"
              >
                <CheckCircleIcon className="w-6 h-6 text-white" /> Confirm Booking
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchEvents;