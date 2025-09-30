import React, { useState, useContext } from 'react';
import UserContext from '../context/UseContext';
import axios from 'axios';

const eventImage = 'https://i.pinimg.com/736x/7c/ae/bf/7caebf45e49a355202b45c903e407538.jpg';

const EventBook = () => {
  const { user } = useContext(UserContext);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    event_type: 'dinner',
    event_date: '',
    message: ''
  });
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user._id) {
      setIsSuccess(false);
      setMessage("User ID is missing or invalid.");
      return;
    }
    const data = { ...formData, user_id: user._id };
    setIsLoading(true);
    try {
      const res = await axios.post("https://restaurant-management-system-mern-stack.onrender.com/api/booking/occasion", data);
      if (res.data.status === "success") {
        setIsSuccess(true);
        setMessage(res.data.message);
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          event_type: 'dinner',
          event_date: '',
          message: ''
        });
      } else {
        setIsSuccess(false);
        setMessage(res.data.message);
      }
    } catch (err) {
      setIsSuccess(false);
      setMessage("Oops! Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-4 sm:pt-8 pb-12 font-sans flex justify-center">
      <div className="bg-white rounded-xl overflow-hidden max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-4 border border-gray-200">
        
        {/* Left Section (Smaller Image) */}
        <div
          className="bg-cover bg-center h-48 lg:h-auto"
          style={{ backgroundImage: `url(${eventImage})` }}
        >
        </div>

        {/* Right Section (Form) */}
        <div className="p-6 md:p-8 lg:p-10 flex flex-col justify-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-2">
            Plan Your Occasion <i className="fa-solid fa-calendar-alt text-rose-500"></i>
          </h2>
          <p className="text-gray-600 text-center mb-6 text-sm md:text-base">
            Tell us about your event, and we'll get everything ready for you.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input
                type="text"
                name="first_name"
                placeholder="First Name*"
                value={formData.first_name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition duration-300"
              />
              <input
                type="text"
                name="last_name"
                placeholder="Last Name*"
                value={formData.last_name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition duration-300"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input
                type="email"
                name="email"
                placeholder="Email*"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition duration-300"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition duration-300"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <select
                name="event_type"
                value={formData.event_type}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition duration-300"
              >
                <option value="dinner">Dinner</option>
                <option value="lunch">Lunch</option>
                <option value="family-gathering">Family Gathering</option>
                <option value="birthday">Birthday Celebration</option>
                <option value="anniversary">Anniversary</option>
                <option value="corporate-meal">Corporate Meal</option>
                <option value="friends-party">Friends Hangout</option>
                <option value="couple-date">Couple Date</option>
                <option value="kitty-party">Kitty Party</option>
                <option value="baby-shower">Baby Shower</option>
                <option value="other">Other</option>
              </select>
              <input
                type="date"
                name="event_date"
                value={formData.event_date}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition duration-300"
              />
            </div>

            <textarea
              name="message"
              placeholder="Additional details (if any)"
              value={formData.message}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition duration-300 resize-none"
            ></textarea>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 bg-rose-500 text-white font-semibold rounded-md hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-300 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Submitting...' : 'Reserve Now'}
            </button>

            {isSuccess !== null && (
              <div className={`p-3 rounded-md text-center font-medium transition-all duration-500 ${isSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventBook;