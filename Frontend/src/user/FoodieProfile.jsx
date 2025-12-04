import React, { useContext } from "react";
import UserContext from "../context/UseContext";
import { useNavigate } from "react-router-dom";
import { UserCircleIcon, EnvelopeIcon, PhoneIcon, MapPinIcon, ArrowRightOnRectangleIcon, HomeIcon } from '@heroicons/react/24/solid';

const FoodieProfile = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="bg-pink-50 rounded-3xl p-10 text-center shadow-lg">
          <h2 className="text-2xl font-bold text-pink-600 mb-4">No user data found</h2>
          <button
            onClick={() => navigate('/login')}
            className="bg-pink-600 text-white px-6 py-3 rounded-full font-bold hover:bg-pink-700"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-3xl bg-pink-50 rounded-3xl p-10 flex flex-col items-center border border-pink-200">
        <div className="flex flex-col items-center mb-8">
          <UserCircleIcon className="w-28 h-28 text-pink-400 mb-2" />
          <h1 className="text-4xl font-extrabold text-pink-700 mb-1">{user.username}</h1>
          <p className="text-lg text-gray-600 italic">{user.bio || "Food lover & explorer"}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-8">
          <div className="flex items-center gap-3 bg-white rounded-xl p-6 border border-pink-100">
            <EnvelopeIcon className="w-7 h-7 text-pink-400" />
            <div>
              <div className="text-sm text-gray-500">Email</div>
              <div className="text-lg font-semibold text-gray-800">{user.email}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white rounded-xl p-6 border border-pink-100">
            <PhoneIcon className="w-7 h-7 text-pink-400" />
            <div>
              <div className="text-sm text-gray-500">Phone</div>
              <div className="text-lg font-semibold text-gray-800">{user.phone}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white rounded-xl p-6 border border-pink-100 md:col-span-2">
            <MapPinIcon className="w-7 h-7 text-pink-400" />
            <div>
              <div className="text-sm text-gray-500">Address</div>
              <div className="text-lg font-semibold text-gray-800">{user.address}</div>
            </div>
          </div>
        </div>
        <div className="flex gap-6 mt-4">
          <button
            onClick={() => navigate("/order-history")}
            className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-yellow-400 text-white font-bold px-8 py-3 rounded-xl text-lg hover:from-yellow-400 hover:to-pink-500"
          >
            View Orders
          </button>
          <button
            onClick={() => navigate("/logout")}
            className="bg-pink-600 text-white font-bold px-8 py-3 rounded-xl text-lg flex items-center gap-2 hover:bg-pink-700"
          >
            <ArrowRightOnRectangleIcon className="w-6 h-6" /> Logout
          </button>
          <button
            onClick={() => navigate("/")}
            className="bg-gray-200 text-gray-700 font-bold px-8 py-3 rounded-xl text-lg flex items-center gap-2 hover:bg-gray-300"
          >
            <HomeIcon className="w-6 h-6" /> Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodieProfile;
