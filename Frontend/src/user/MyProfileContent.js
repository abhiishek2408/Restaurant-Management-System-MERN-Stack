import React, { useContext } from "react";
import UserContext from "../context/UseContext";
import { Mail, Phone, MapPin, Star, Heart, MessageCircle } from "lucide-react";

const Profile = () => {
  const { user } = useContext(UserContext);




  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-center text-lg text-gray-600">No user data found. Please log in.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex justify-center items-start px-0 pt-2">
      <main className="flex-1 flex justify-center items-start px-4">
        <div className="w-full max-w-2xl bg-white rounded-2xl p-6 flex flex-col items-center border border-gray-200 bg-clip-padding relative">
          {/* SVG background */}
          <svg className="absolute top-0 left-0 w-full h-full -z-10" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <ellipse cx="500" cy="100" rx="120" ry="60" fill="#fceabb" fillOpacity="0.25" />
            <ellipse cx="100" cy="500" rx="140" ry="70" fill="#f8fafc" fillOpacity="0.35" />
            <ellipse cx="300" cy="300" rx="180" ry="90" fill="#fbbf24" fillOpacity="0.10" />
            <ellipse cx="400" cy="400" rx="80" ry="40" fill="#f472b6" fillOpacity="0.10" />
          </svg>
          <div className="flex flex-col items-center mb-6 z-10">
            <div className="relative w-24 h-24 mb-1">
              <img
                src={
                  user.profile_img ||
                  "https://cdn.vectorstock.com/i/500p/96/75/gray-scale-male-character-profile-picture-vector-51589675.jpg"
                }
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-gradient-to-r from-pink-400 via-yellow-400 to-purple-400 object-cover shadow-xl transition-transform duration-300 hover:scale-105"
                style={{ boxShadow: '0 8px 32px 0 rgba(244,114,182,0.15), 0 1.5px 8px 0 rgba(168,139,250,0.10)' }}
              />
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-pink-400 via-yellow-400 to-purple-400 px-3 py-0.5 rounded-full text-white text-xs font-bold shadow-md">Premium</span>
            </div>
            <h1 className="text-2xl font-extrabold text-pink-700 mb-1 drop-shadow-lg tracking-tight flex items-center gap-2">
              <Star size={20} className="text-yellow-400" /> {user.username}
            </h1>
            <p className="text-base text-gray-600 italic flex items-center gap-2">
              <Heart size={16} className="text-pink-400" /> {user.bio || "Food lover & explorer"}
            </p>
          </div>
          {/* Profile Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-6 z-10">
            <div className="flex flex-col items-center bg-gradient-to-br from-pink-100 via-white to-pink-50 rounded-lg p-4 border-2 border-pink-200 shadow-sm hover:shadow-lg transition-shadow duration-300">
              <Star size={20} className="text-yellow-400 mb-1" />
              <span className="text-xs text-gray-500">Orders</span>
              <span className="text-lg font-bold text-pink-600">{user.ordersCount || 0}</span>
            </div>
            <div className="flex flex-col items-center bg-gradient-to-br from-yellow-100 via-white to-yellow-50 rounded-lg p-4 border-2 border-yellow-200 shadow-sm hover:shadow-lg transition-shadow duration-300">
              <Heart size={20} className="text-pink-400 mb-1" />
              <span className="text-xs text-gray-500">Favorites</span>
              <span className="text-lg font-bold text-yellow-500">{user.favoritesCount || 0}</span>
            </div>
            <div className="flex flex-col items-center bg-gradient-to-br from-purple-100 via-white to-purple-50 rounded-lg p-4 border-2 border-purple-200 shadow-sm hover:shadow-lg transition-shadow duration-300">
              <MessageCircle size={20} className="text-purple-400 mb-1" />
              <span className="text-xs text-gray-500">Reviews</span>
              <span className="text-lg font-bold text-purple-500">{user.reviewsCount || 0}</span>
            </div>
          </div>
          {/* Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-6 z-10">
            <div className="flex items-center gap-3 bg-gradient-to-r from-pink-50 via-white to-pink-100 rounded-lg p-4 border border-pink-100 shadow-md">
              <Mail size={20} className="text-pink-400" />
              <div>
                <div className="text-xs text-gray-500 font-bold">Email</div>
                <div className="text-base font-semibold text-gray-800">{user.email}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gradient-to-r from-yellow-50 via-white to-yellow-100 rounded-lg p-4 border border-yellow-100 shadow-md">
              <Phone size={20} className="text-yellow-500" />
              <div>
                <div className="text-xs text-gray-500 font-bold">Phone</div>
                <div className="text-base font-semibold text-gray-800">{user.phone}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gradient-to-r from-purple-50 via-white to-purple-100 rounded-lg p-4 border border-purple-100 shadow-md md:col-span-2">
              <MapPin size={20} className="text-purple-500" />
              <div>
                <div className="text-xs text-gray-500 font-bold">Address</div>
                <div className="text-base font-semibold text-gray-800">{user.address}</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
