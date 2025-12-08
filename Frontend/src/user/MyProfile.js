import React, { useContext, useState, useEffect } from "react";
import UserContext from "../context/UseContext";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { LogOut, Home, Pencil, Save, X, Clock } from "lucide-react";
import { MessageCircle, CreditCard, ShoppingCart, Gift } from "lucide-react";

const MyProfile = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  // Removed isEditing and setIsEditing (unused)
  const [showModal, setShowModal] = useState(false);
  const [editableData, setEditableData] = useState({
    email: "",
    phone: "",
    address: "",
  });

 // console.log("User:: ",user);

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

  const handleEdit = () => {
    setShowModal(true);
  };

  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setSaveError("");
    // Validate required fields before sending
    const userId = user?._id || user?.id;
    // Fallback: use email as username if username is missing (not ideal, but prevents backend error)
    let username = user?.username;
    if (!username) {
      // Optionally, you can set a default or fallback
      username = user?.email ? user.email.split("@")[0] : "user";
    }
    const email = editableData.email?.trim();
    if (!userId || !username || !email) {
      setSaveError("Profile update failed: missing username, email, or user ID. Please contact support.");
      setSaving(false);
      return;
    }
    try {
      const response = await fetch("https://restaurant-management-system-mern-stack.onrender.com/api/user/update-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          user_id: userId,
          email,
          phone: editableData.phone,
          address: editableData.address,
          username,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setUser({ ...user, ...editableData, username });
        setShowModal(false);
      } else {
        setSaveError(data.message || "Failed to update profile.");
      }
    } catch (err) {
      setSaveError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    // Optionally reset editableData to user data
    setEditableData({
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
    });
  };

  const location = useLocation();
  if (!user) {
    return (
      <p className="text-center text-lg text-gray-600 mt-20">
        No user data found. Please log in.
      </p>
    );
  }
  return (
    <div className="min-h-screen bg-white flex flex-row items-start px-0 pt-2">
      {/* Sidebar */}
      <aside className="h-full min-h-screen w-64 bg-white border-r-2 border-pink-200 flex flex-col items-center pt-4 px-4 sticky top-0 z-20">
        <nav className="flex flex-col gap-6 mt-2 w-full">
          <button onClick={() => navigate("/user/userprofile")} className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-normal text-gray-600 hover:bg-gray-100 transition-colors ${location.pathname === '/user/userprofile' ? 'bg-gray-100 font-medium' : ''}`}> 
            <Home size={20} className="text-gray-600" /> Profile
          </button>
          <button onClick={() => navigate("/user/userprofile/orderhistory")} className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-normal text-gray-600 hover:bg-blue-50 transition-colors ${location.pathname === '/user/userprofile/orderhistory' ? 'bg-blue-50 text-gray-600 font-medium' : ''}`}> 
            <Clock size={20} className="text-gray-600" /> My Order
          </button>
          <button onClick={() => navigate("/user/userprofile/reservations")} className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-normal text-gray-600 hover:bg-pink-50 transition-colors ${location.pathname === '/user/userprofile/bookedtable' ? 'bg-pink-50 text-gray-600 font-medium' : ''}`}> 
            <ShoppingCart size={20} className="text-gray-600" /> My booked Table
          </button>
          <button onClick={() => navigate("/user/userprofile/event-reservations")} className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-normal text-gray-600 hover:bg-pink-50 transition-colors ${location.pathname === '/user/userprofile/bookedevent' ? 'bg-pink-50 text-gray-600 font-medium' : ''}`}> 
            <Gift size={20} className="text-gray-600" /> My Booked Event
          </button>

          <button className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-normal text-gray-600 hover:bg-gray-100 transition-colors" disabled>
            <MessageCircle size={20} className="text-gray-600" /> Customer Care
          </button>
          <button className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-normal text-gray-600 hover:bg-gray-100 transition-colors" disabled>
            <CreditCard size={20} className="text-gray-600" /> Saved Cards
          </button>
          <button className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-normal text-gray-600 hover:bg-gray-100 transition-colors" disabled>
            <ShoppingCart size={20} className="text-gray-600" /> Pending Payments
          </button>
          <button className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-normal text-gray-600 hover:bg-gray-100 transition-colors" disabled>
            <Gift size={20} className="text-gray-600" /> Gift Cards
          </button>
          <button onClick={handleEdit} className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-normal text-gray-600 hover:bg-yellow-50 transition-colors">
            <Pencil size={20} className="text-gray-600" /> Edit Profile
          </button>
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-normal text-gray-600 hover:bg-purple-50 transition-colors">
            <LogOut size={20} className="text-gray-600" /> Logout
          </button>
        </nav>
      </aside>
      
      
      {/* Main Content Area for Nested Routes */}
      <main className="flex-1 flex justify-center items-start px-1 ml-4">
        <div className="w-full">
          <Outlet />
        </div>
      </main>
      {/* Edit Modal (remains global for profile) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-pink-600"
              onClick={handleCancel}
            >
              <X size={28} />
            </button>
            <h2 className="text-2xl font-bold text-pink-600 mb-6 text-center">Edit Profile</h2>
            <form onSubmit={e => { e.preventDefault(); handleSave(); }} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Email</label>
                <input
                  type="email"
                  value={editableData.email}
                  onChange={e => setEditableData({ ...editableData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                  disabled={saving}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Phone</label>
                <input
                  type="text"
                  value={editableData.phone}
                  onChange={e => setEditableData({ ...editableData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                  disabled={saving}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Address</label>
                <input
                  type="text"
                  value={editableData.address}
                  onChange={e => setEditableData({ ...editableData, address: e.target.value })}
                  className="w-full px-4 py-2 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                  disabled={saving}
                />
              </div>
              {saveError && (
                <div className="text-red-500 text-center text-sm font-semibold">{saveError}</div>
              )}
              <div className="flex gap-4 justify-center mt-6">
                <button
                  type="submit"
                  className="bg-pink-600 text-white font-bold px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-pink-700 disabled:opacity-60"
                  disabled={saving}
                >
                  {saving ? (
                    <span className="animate-spin mr-2"><Save size={20} /></span>
                  ) : (
                    <Save size={20} />
                  )}
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-200 text-gray-700 font-bold px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-300"
                  disabled={saving}
                >
                  <X size={20} /> Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfile;
