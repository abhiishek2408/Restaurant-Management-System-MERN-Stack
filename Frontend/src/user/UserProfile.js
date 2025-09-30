import React, { useContext, useState, useEffect } from "react";
import UserContext from "../context/UseContext";
import { useNavigate } from "react-router-dom";
import { Mail, Phone, MapPin, Pencil, Save, LogOut, Home } from "lucide-react";

const Profile = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [editableData, setEditableData] = useState({
    email: "",
    phone: "",
    address: "",
  });

  console.log("User:: ",user);

  useEffect(() => {
    if (user) {
      setEditableData({
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const handleLogout = () => {
    navigate("/login");
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  if (!user) {
    return (
      <p className="text-center text-lg text-gray-600 mt-20">
        No user data found. Please log in.
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex justify-center items-center pt-4 pb-2 px-6 sm:pt-2 sm:pb-4 sm:px-12 font-sans">
      <div className="w-full max-w-5xl bg-white rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-lg">
        {/* Left Section */}
        <div className="bg-pink-600 text-white p-8 lg:p-12 flex flex-col items-center text-center flex-shrink-0 md:w-1/3">
          <img
            src={
              user.profile_img ||
              "https://cdn.vectorstock.com/i/500p/96/75/gray-scale-male-character-profile-picture-vector-51589675.jpg"
            }
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-white object-cover mb-4"
          />
          <h2 className="text-3xl font-extrabold mb-1">{user.username}</h2>
          <p className="text-sm italic opacity-80">{user.bio || "I am a Software Developer"}</p>
        </div>

        {/* Right Section */}
        <div className="bg-white p-8 lg:p-12 flex-grow">
          <h3 className="text-3xl font-bold text-pink-600 mb-6">Profile Details</h3>

          {/* Email */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
            <span className="flex items-center text-gray-600 font-semibold w-full sm:w-40">
              <Mail size={20} className="mr-2 text-pink-500" />
              Email:
            </span>
            {isEditing ? (
              <input
                type="email"
                value={editableData.email}
                onChange={(e) =>
                  setEditableData({ ...editableData, email: e.target.value })
                }
                className="flex-grow w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition-shadow"
              />
            ) : (
              <span className="flex-grow text-gray-800">{editableData.email}</span>
            )}
          </div>

          {/* Phone */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
            <span className="flex items-center text-gray-600 font-semibold w-full sm:w-40">
              <Phone size={20} className="mr-2 text-pink-500" />
              Phone:
            </span>
            {isEditing ? (
              <input
                type="text"
                value={editableData.phone}
                onChange={(e) =>
                  setEditableData({ ...editableData, phone: e.target.value })
                }
                className="flex-grow w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition-shadow"
              />
            ) : (
              <span className="flex-grow text-gray-800">{editableData.phone}</span>
            )}
          </div>

          {/* Address */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
            <span className="flex items-center text-gray-600 font-semibold w-full sm:w-40">
              <MapPin size={20} className="mr-2 text-pink-500" />
              Address:
            </span>
            {isEditing ? (
              <input
                type="text"
                value={editableData.address}
                onChange={(e) =>
                  setEditableData({ ...editableData, address: e.target.value })
                }
                className="flex-grow w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition-shadow"
              />
            ) : (
              <span className="flex-grow text-gray-800">{editableData.address}</span>
            )}
          </div>

          {/* Buttons */}
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              className={`flex items-center space-x-2 font-bold py-3 px-6 rounded-full transition-transform duration-300 hover:scale-105 ${
                isEditing
                  ? "bg-pink-600 text-white hover:bg-pink-700"
                  : "bg-white text-pink-600 border-2 border-pink-600 hover:bg-pink-50"
              }`}
            >
              {isEditing ? (
                <>
                  <Save size={20} />
                  <span>Save</span>
                </>
              ) : (
                <>
                  <Pencil size={20} />
                  <span>Edit Profile</span>
                </>
              )}
            </button>

            <button
              onClick={handleLogout} 
              className="flex items-center space-x-2 bg-pink-600 text-white font-bold py-3 px-6 rounded-full hover:bg-pink-700 transition-transform duration-300 hover:scale-105"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>

            <button
              onClick={() => navigate("/")}
              className="flex items-center space-x-2 bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-full hover:bg-gray-300 transition-transform duration-300 hover:scale-105"
            >
              <Home size={20} />
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
