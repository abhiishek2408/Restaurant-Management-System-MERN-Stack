import React, { useEffect, useState, useContext } from 'react';
import UserContext from '../context/UseContext';
import { ChevronRight } from 'lucide-react';

const MyOrders = () => {
  const { user } = useContext(UserContext);
  const [effectiveUser, setEffectiveUser] = useState(user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Restore user from localStorage if context is empty
  useEffect(() => {
    if (!user || !user._id) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setEffectiveUser(JSON.parse(storedUser));
      } else {
        setError("User not logged in.");
        setLoading(false);
      }
    } else {
      setEffectiveUser(user);
    }
  }, [user]);

  // Fetch orders based on tab selection
  useEffect(() => {
    if (!effectiveUser || !effectiveUser._id) return;
    setLoading(true);
    setError("");

    let url = "https://restaurant-management-system-mern-stack.onrender.com/api/orders/all-order";
    let body = { user_id: effectiveUser._id };

    if (statusFilter !== "All") {
      url = "https://restaurant-management-system-mern-stack.onrender.com/api/orders/orders-by-status";
      // Map tab label to backend status value
      let statusValue = statusFilter;
      if (statusFilter === "In Progress") statusValue = "Pending";
      if (statusFilter === "Delivered") statusValue = "Completed";
      body.status = statusValue;
    }

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOrders(data.data);
          setError("");
        } else {
          setOrders([]);
          setError(data.message || "No orders found.");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setOrders([]);
        setError("Error fetching orders.");
        setLoading(false);
      });
  }, [effectiveUser, statusFilter]);

  // Status tab options
  const statusTabs = [
    { label: 'All', value: 'All' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Delivered', value: 'Completed' },
    { label: 'Cancelled', value: 'Cancelled' },
  ];

  // Show loader overlay but keep tabs visible
  if (loading) {
    return (
      <div className="px-4 py-8 max-w-4xl text-gray-600 bg-white">
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-500 mb-6 flex items-center gap-2">
          <span className="cursor-pointer" onClick={() => window.location.href = '/'}>Home</span>
          <span className="mx-1">/</span>
          <span className="cursor-pointer" onClick={() => window.location.href = '/user/userprofile'}>My Account</span>
          <span className="mx-1">/</span>
          <span className="font-bold text-gray-700">My Orders</span>
        </nav>
        <div className="flex flex-wrap items-center justify-between mb-6 gap-2">
          <div className="flex gap-2">
            {statusTabs.map(tab => (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={`px-4 py-1 rounded-full border text-sm font-normal transition-colors duration-150 focus:outline-none ${statusFilter === tab.value ? 'bg-red-100 text-red-700 border-red-300' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <button className="text-sm text-gray-600 border border-gray-200 rounded-lg px-4 py-1 bg-white hover:bg-gray-50 flex items-center gap-1 mt-2 md:mt-0">
            Select date range <ChevronRight size={16} />
          </button>
        </div>
        <div className="flex flex-col items-center justify-center min-h-[200px]">
          <span className="mb-6">
            <svg className="animate-spin h-16 w-16 text-pink-500" viewBox="0 0 50 50">
              <defs>
                <linearGradient id="loader-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ec4899" />
                  <stop offset="40%" stopColor="#f472b6" />
                  <stop offset="80%" stopColor="#f9a8d4" />
                  <stop offset="100%" stopColor="#f472b6" />
                </linearGradient>
              </defs>
              <circle
                cx="25"
                cy="25"
                r="20"
                fill="none"
                stroke="url(#loader-gradient)"
                strokeWidth="6"
                strokeDasharray="90 60"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span className="text-lg font-bold bg-gradient-to-r from-pink-400 via-yellow-400 to-purple-400 bg-clip-text text-transparent animate-pulse">Loading your orders...</span>
        </div>
      </div>
    );
  }

  // No need to filter orders on frontend, backend returns filtered data
  const filteredOrders = orders;

  return (
    <div className="px-4 py-8 max-w-4xl text-gray-600 bg-white">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-500 mb-6 flex items-center gap-2">
        <span className="cursor-pointer" onClick={() => window.location.href = '/'}>Home</span>
        <span className="mx-1">/</span>
        <span className="cursor-pointer" onClick={() => window.location.href = '/user/userprofile'}>My Account</span>
        <span className="mx-1">/</span>
        <span className="font-bold text-gray-700">My Orders</span>
      </nav>



      {/* Tabs and Date Range Selector in one row */}
      <div className="flex flex-wrap items-center justify-between mb-6 gap-2">
        <div className="flex gap-2">
          {statusTabs.map(tab => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-4 py-1 rounded-full border text-sm font-normal transition-colors duration-150 focus:outline-none ${statusFilter === tab.value ? 'bg-red-100 text-red-700 border-red-300' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button className="text-sm text-gray-600 border border-gray-200 rounded-lg px-4 py-1 bg-white hover:bg-gray-50 flex items-center gap-1 mt-2 md:mt-0">
          Select date range <ChevronRight size={16} />
        </button>
      </div>

      {/* Orders List */}
      {error && (
        <div className="flex items-center justify-center min-h-[200px]">
          <span className="text-center text-base font-normal text-gray-600">{error}</span>
        </div>
      )}
      {filteredOrders.length === 0 && !error && (
        <div className="flex items-center justify-center min-h-[200px]">
          <span className="text-center text-base font-normal text-gray-600">No orders found.</span>
        </div>
      )}
      {filteredOrders.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-start">
          {filteredOrders.map((order) => (
            <div
              key={order.cart_id}
              className="flex flex-col md:flex-row items-center bg-white rounded-xl p-6 border border-gray-200 ring-1 ring-gray-100 w-full md:w-[865px] ml-0 relative"
            >
              <img
                src={order.item_image ? `data:image/jpeg;base64,${order.item_image}` : 'https://via.placeholder.com/100'}
                alt={order.item_name}
                className="w-28 h-28 object-cover rounded-lg mb-4 md:mb-0 md:mr-6 border border-gray-200 shadow-sm"
              />

              <div className="flex-1 w-full">
                <h4 className="text-xl font-semibold text-gray-600 mb-2">{order.item_name}</h4>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="inline-block bg-blue-100 text-gray-600 text-xs font-medium px-2 py-1 rounded">Quantity: {order.quantity}</span>
                  <span className="inline-block bg-green-100 text-gray-600 text-xs font-medium px-2 py-1 rounded">Price: ₹{order.price}</span>
                </div>
                <p className="text-gray-600 text-sm mb-1"><span className="font-medium text-gray-600">Delivery Address:</span> {order.delivery_address}</p>
                <p className="text-gray-600 text-xs"><span className="font-medium text-gray-600">Ordered At:</span> {new Date(order.added_at).toLocaleString()}</p>
              </div>

              {/* Order Status Badge on the right */}
              <div className="absolute top-6 right-6 flex flex-col items-end">
                <span className={
                  `px-4 py-1 rounded-full text-xs font-bold shadow-md ` +
                  (order.status === 'Completed' ? 'bg-green-100 text-gray-600 border border-green-200' :
                  order.status === 'Pending' ? 'bg-yellow-100 text-gray-600 border border-yellow-200' :
                  order.status === 'Cancelled' ? 'bg-red-100 text-gray-600 border border-red-200' :
                  'bg-gray-100 text-gray-600 border border-gray-200')
                }>
                  {order.status || 'Status Unknown'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
