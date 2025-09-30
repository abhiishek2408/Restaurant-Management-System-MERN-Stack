import React, { useState, useContext } from "react";
import UserContext from "../context/UseContext";
import axios from "axios";

// This image is now used as the banner for the booking form
const tableImage = 'https://www.fohlio.com/hs-fs/hubfs/Imported_Blog_Media/The-Psychology-of-Restaurant-Interior-Design-Part-5-Architecture-Fohlio-Faith-and-Flower-1.jpg?width=1500&height=1000&name=The-Psychology-of-Restaurant-Interior-Design-Part-5-Architecture-Fohlio-Faith-and-Flower-1.jpg';

function BookTable() {
  const { user } = useContext(UserContext);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    event_type: 'private',
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
      const res = await axios.post("http://localhost:5000/api/tablebook/table", data);
      if (res.data.status === "success") {
        setIsSuccess(true);
        setMessage(res.data.message);
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          event_type: 'private',
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
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-xl shadow-lg max-w-6xl w-full flex flex-col lg:flex-row overflow-hidden">

        {/* Banner Section - Now with no horizontal padding */}
        <div
          className="lg:w-1/2 hidden lg:block bg-cover bg-center rounded-l-xl"
          style={{ backgroundImage: `url(${tableImage})` }}
        ></div>

        {/* Form Section - Now with consistent padding */}
        <div className="w-full lg:w-1/2 p-8 md:p-12">
          <form id="form" onSubmit={handleSubmit} className="flex flex-col space-y-6">
            <h2 className="form-title text-3xl font-semibold text-black-400 text-center mb-8">
              Book Your Dining Experience <i className="fa-solid fa-utensils text-rose-400"></i>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="first_name"
                placeholder="First Name*"
                value={formData.first_name}
                onChange={handleInputChange}
                required
                className="flex-1 px-4 py-3 border border-gray-300 rounded-md text-base outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-colors"
              />
              <input
                type="text"
                name="last_name"
                placeholder="Last Name*"
                value={formData.last_name}
                onChange={handleInputChange}
                required
                className="flex-1 px-4 py-3 border border-gray-300 rounded-md text-base outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="email"
                name="email"
                placeholder="Email*"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="flex-1 px-4 py-3 border border-gray-300 rounded-md text-base outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-colors"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-md text-base outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <select
                name="event_type"
                value={formData.event_type}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md text-base outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-colors"
              >
                <option value="birthday">Birthday Party</option>
                <option value="wedding">Wedding</option>
                <option value="engagement">Engagement Ceremony</option>
                <option value="mehendi">Mehendi Function</option>
                <option value="sangeet">Sangeet Night</option>
                <option value="anniversary">Anniversary Celebration</option>
                <option value="baby-shower">Baby Shower (Godh Bharai)</option>
                <option value="naming-ceremony">Naming Ceremony (Namkaran)</option>
                <option value="housewarming">Housewarming (Griha Pravesh)</option>
                <option value="retirement">Retirement Party</option>
                <option value="farewell">Farewell Party</option>
                <option value="reunion">Friends/Family Reunion</option>
                <option value="corporate">Corporate Event</option>
                <option value="seminar">Seminar</option>
                <option value="conference">Conference</option>
                <option value="product-launch">Product Launch</option>
                <option value="award-ceremony">Award Ceremony</option>
                <option value="festival">Festival Celebration (Diwali, Holi, Eid, Christmas)</option>
                <option value="cultural">Cultural Program</option>
                <option value="community">Community Gathering</option>
                <option value="religious">Religious Function (Puja, Kirtan, Jagrata)</option>
                <option value="charity">Charity Event</option>
                <option value="cradle-ceremony">Cradle Ceremony</option>
                <option value="haldi">Haldi Ceremony</option>
                <option value="school-event">School/College Function</option>
                <option value="kitti-party">Kitti Party</option>
                <option value="bachelor-party">Bachelor/Bachelorette Party</option>
              </select>
              <input
                type="date"
                name="event_date"
                value={formData.event_date}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md text-base outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-colors"
              />
            </div>

            <textarea
              name="message"
              placeholder="Write a message"
              value={formData.message}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-md text-base resize-none focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-colors"
              required
            ></textarea>

            <button type="submit" disabled={isLoading}
              className="w-full py-4 bg-rose-400 text-white font-semibold rounded-md shadow-md transition-all duration-300 hover:bg-rose-500 hover:shadow-lg hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed text-lg">
              {isLoading ? "Submitting..." : "Submit"}
            </button>

            {isSuccess !== null && (
              <div
                className={`p-3 rounded-md text-center text-sm mt-2 transition-all duration-300
                ${isSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
              >
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
