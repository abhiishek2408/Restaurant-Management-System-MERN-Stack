import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // ✅ Import your AuthContext

const Signup = () => {
  const { register, error: contextError } = useContext(AuthContext); // ✅ use AuthContext
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
    profileImg: null,
  });

  const [error, setError] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      profileImg: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({});
    setSuccessMessage("");

    if (formData.password !== formData.confirmPassword) {
      setError((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }));
      return;
    }

    const submitData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      submitData.append(key, value);
    });

    // ✅ Use AuthContext register function
    const res = await register(submitData);

    if (res.success) {
      setSuccessMessage(res.message || "Registration successful! Please verify your email/OTP.");
      setFormData({
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        phone: "",
        address: "",
        bio: "",
        profileImg: null,
      });
    } else {
      setError(res.errors || { apiError: "Unknown error occurred." });
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white font-sans">
      {/* Left Panel - Redesigned like Login.js */}
      <div className="flex-1 flex items-center justify-center relative rounded-tr-[40px] rounded-br-[40px] overflow-hidden">
        <img src={process.env.PUBLIC_URL + '/image/sushi-japanese-food-wooden-board-realistic-3d-product-showcase-food-photography_111797-1961.avif'} alt="Food" className="absolute inset-0 w-full h-full object-cover z-0" />
        <div className="absolute inset-0 z-0 rounded-tr-[40px] rounded-br-[40px] bg-gradient-to-br from-black/70 via-black/40 to-pink-900/10" />
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full bg-pink-400/20 blur-3xl opacity-60" />
        </div>
        <div className="relative z-10 flex flex-col items-start justify-center px-6 py-8 w-full max-w-md">
          <h1 className="text-white text-3xl md:text-4xl font-extrabold mb-2 drop-shadow-xl tracking-tight">Welcome to Bistrofy</h1>
          <p className="text-white text-base md:text-lg font-medium mb-4 drop-shadow">Your gateway to delicious culinary experiences.</p>
          <div className="flex gap-3 mb-4 text-2xl animate-fadeIn">
            <span>🍲</span>
            <span>🍕</span>
            <span>🍹</span>
            <span>🍜</span>
          </div>
          <a href="/" className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-base px-4 py-2 rounded-xl shadow-xl hover:from-rose-500 hover:to-pink-500 transition-all duration-200 ring-2 ring-pink-300/40 hover:ring-rose-400/60 ml-4">
            <span>Explore Our Menu</span>
            <span className="text-lg">🍽️</span>
          </a>
        </div>
      </div>

      {/* Right Panel - Enhanced */}
      <div className="flex-1 flex justify-center items-center p-6 md:p-10 bg-gradient-to-br from-white via-pink-50 to-white">
        <div className="w-full max-w-lg backdrop-blur-md bg-white/80 border border-pink-200 rounded-2xl shadow-2xl p-8 md:p-12 mx-auto">
          <div className="mb-8">
            <h2 className="text-center text-pink-500 mb-2 text-3xl font-extrabold tracking-wide drop-shadow">Sign Up</h2>
            <p className="text-center mb-5 text-gray-700 text-lg">Create an account to start your journey with us.</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex-1 flex flex-col">
                <label className="text-sm mb-1 text-pink-600 font-semibold">Username:</label>
                <input type="text" name="username" value={formData.username} onChange={handleChange} required className="p-2 border border-pink-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-pink-400 transition" />
                {error.username && <div className="text-red-600 text-xs mt-1">{error.username}</div>}
              </div>
              <div className="flex-1 flex flex-col">
                <label className="text-sm mb-1 text-pink-600 font-semibold">Email:</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="p-2 border border-pink-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-pink-400 transition" />
                {error.email && <div className="text-red-600 text-xs mt-1">{error.email}</div>}
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex-1 flex flex-col">
                <label className="text-sm mb-1 text-pink-600 font-semibold">Password:</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required className="p-2 border border-pink-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-pink-400 transition" />
                {error.password && <div className="text-red-600 text-xs mt-1">{error.password}</div>}
              </div>
              <div className="flex-1 flex flex-col">
                <label className="text-sm mb-1 text-pink-600 font-semibold">Confirm Password:</label>
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className="p-2 border border-pink-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-pink-400 transition" />
                {error.confirmPassword && <div className="text-red-600 text-xs mt-1">{error.confirmPassword}</div>}
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex-1 flex flex-col">
                <label className="text-sm mb-1 text-pink-600 font-semibold">Phone:</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="p-2 border border-pink-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-pink-400 transition" />
              </div>
              <div className="flex-1 flex flex-col">
                <label className="text-sm mb-1 text-pink-600 font-semibold">Address:</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} className="p-2 border border-pink-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-pink-400 transition" />
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex-1 flex flex-col">
                <label className="text-sm mb-1 text-pink-600 font-semibold">Bio:</label>
                <textarea name="bio" value={formData.bio} onChange={handleChange} className="p-2 border border-pink-300 rounded-lg text-base resize-none focus:outline-none focus:ring-2 focus:ring-pink-400 transition" />
              </div>
              <div className="flex-1 flex flex-col">
                <label className="text-sm mb-1 text-pink-600 font-semibold">Profile Image:</label>
                <input type="file" name="profileImg" accept="image/*" onChange={handleFileChange} className="p-2 border border-pink-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-pink-400 transition" />
              </div>
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 hover:scale-105 hover:shadow-xl text-white font-bold py-3 rounded-xl text-lg mt-4 shadow-lg transition-transform duration-200">Register</button>
          </form>
          {error.apiError && <div className="text-red-600 text-sm mt-2">{error.apiError}</div>}
          {contextError && <div className="text-red-600 text-sm mt-2">{contextError}</div>}
          {successMessage && <div className="bg-green-100 text-green-700 mt-3 p-2 rounded-xl text-center text-sm shadow">{successMessage}</div>}
          <p className="text-center mt-6 text-base text-gray-700">
            Already have an account? <Link to="/login" className="text-pink-500 font-semibold hover:underline">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;

