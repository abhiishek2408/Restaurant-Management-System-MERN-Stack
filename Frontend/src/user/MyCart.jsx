import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { AuthContext } from "../context/AuthContext";

// Helper to check if user context is loaded
function isUserLoaded(user) {
  return user && user._id;
}

const Cart = () => {
  const { user } = useContext(AuthContext);
  const [cartDetails, setCartDetails] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [selectedItems, setSelectedItems] = useState({});
  const [checkout, setCheckout] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    full_name: "",
    phone: "",
    address_line: "",
    city: "",
    state: "",
    zipcode: "",
    is_default: 0,
  });
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  /** Fetch cart items, including after user context loads from localStorage */
  useEffect(() => {
    if (!isUserLoaded(user)) {
      // Wait for user context to load from localStorage
      setIsLoading(true);
      return;
    }
    const fetchCart = async () => {
      setIsLoading(true);
      console.log("[Cart] Fetching cart for user ID:", user._id);
      try {
        const res = await axios.get(
          `https://restaurant-management-system-mern-stack.onrender.com/api/cart/get-cart/${user._id}`
        );
        console.log("[Cart] Backend response:", res.data);
        if (res.data.success) {
          setCartDetails(res.data.cart);
          setError(null);
        } else {
          setCartDetails([]);
          setError("No cart data found.");
          toast.error("No cart data found.");
        }
      } catch (err) {
        console.error("[Cart] Error fetching cart data:", err);
        setError("Error fetching cart data.");
        toast.error("Error fetching cart data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCart();
  }, [user]);

  const buildFullAddress = (addr) => {
    const parts = [
      addr.house_number,
      addr.road,
      addr.neighbourhood,
      addr.suburb,
      addr.city_district,
      addr.city || addr.town || addr.village,
      addr.county,
      addr.state,
      addr.postcode,
      addr.country,
    ];
    return parts.filter(Boolean).join(", ");
  };

  /** Get current location */
  const fetchCurrentLocationAddress = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        try {
          const res = await axios.get(
            `https://nominatim.openstreetmap.org/reverse`,
            {
              params: {
                format: "json",
                lat: latitude,
                lon: longitude,
                addressdetails: 1,
              },
            }
          );

          const addr = res.data.address;
          if (!addr) {
            toast.error("Unable to detect your location address.");
            return;
          }

          const fullAddress = buildFullAddress(addr);
          setCurrentLocation({
            id: 0,
            label: "Current Location",
            fullAddress,
            lat: latitude,
            lon: longitude,
          });
          setSelectedAddressId(0);
          toast.success("Location detected successfully!");
        } catch (error) {
          toast.error("Failed to fetch your location details.");
        }
      },
      (err) => {
        toast.error("Location permission denied.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  /** Quantity change */
  const handleQuantityChange = (id, type) => {
    setCartDetails(
      cartDetails.map((item) =>
        item._id === id
          ? {
              ...item,
              quantity: Math.max(1, item.quantity + (type === "increment" ? 1 : -1)),
            }
          : item
      )
    );
  };

  /** Remove item */
  const handleRemoveItem = async (id, e) => {
    e.stopPropagation();

    toast(
      (t) => (
        <div>
          <p>Delete this item?</p>
          <div className="flex gap-2 mt-2">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  const res = await axios.delete(
                    `https://restaurant-management-system-mern-stack.onrender.com/api/cart/delete-from-cart/${id}`
                  );
                  if (res.data.success) {
                    toast.success("Item deleted successfully!");
                    setCartDetails((prev) => prev.filter((i) => i._id !== id));
                  } else {
                    toast.error(res.data.message || "Failed to delete item.");
                  }
                } catch (err) {
                  toast.error("Error deleting item.");
                }
              }}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Yes
            </button>

            <button
              onClick={() => toast.dismiss(t.id)}
              className="bg-gray-300 px-3 py-1 rounded"
            >
              No
            </button>
          </div>
        </div>
      ),
      { duration: 60000 }
    );
  };

  /** Select item */
  const handleItemSelect = (id) => {
    setSelectedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  /** Calculate total */
  const calculateTotal = () =>
    cartDetails
      .reduce((sum, i) => (selectedItems[i._id] ? sum + i.price * i.quantity : sum), 0)
      .toFixed(2);

  /** Proceed to payment */
  const handleProceedToPayment = () => {
    if (selectedAddressId === null) {
      toast.error("Please select a delivery address.");
      return;
    }
    if (calculateTotal() === "0.00") {
      toast.error("Please select at least one item.");
      return;
    }
    setCheckout(true);
  };

  /** PayPal */
  const createOrder = async () => {
    const selectedAddress =
      selectedAddressId === 0
        ? currentLocation
        : addresses.find((a) => a._id === selectedAddressId);

    const res = await axios.post(
      "https://restaurant-management-system-mern-stack.onrender.com/api/paypal/create-order",
      {
        total: calculateTotal(),
        address: selectedAddress,
      }
    );
    toast.success("Redirecting to PayPal...");
    return res.data.id;
  };

  const onApprove = () => {
    toast.success("Payment successful!");
  };

  /** Save New Address */
  const handleSaveAddress = async () => {
    const { full_name, phone, address_line, city, state, zipcode, is_default } =
      newAddress;

    if (!full_name || !phone || !address_line || !city || !state || !zipcode) {
      toast.error("Please fill all fields");
      return;
    }

    setIsSavingAddress(true);

    try {
      const token = localStorage.getItem("token");

      const payload = {
        full_name,
        phone: Number(phone),
        address_line,
        city,
        state,
        zipcode: Number(zipcode),
        is_default: is_default ? "1" : "0",
      };

      const res = await axios.post(
        "https://restaurant-management-system-mern-stack.onrender.com/api/cart/add_user_addresses",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success("Address added successfully");

        setIsModalOpen(false);
        setNewAddress({
          full_name: "",
          phone: "",
          address_line: "",
          city: "",
          state: "",
          zipcode: "",
          is_default: 0,
        });

        const addrRes = await axios.get(
          `https://restaurant-management-system-mern-stack.onrender.com/api/cart/get_user_addresses/${user._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (addrRes.data.success) {
          setAddresses(addrRes.data.addresses);
          const lastAddr = addrRes.data.addresses.slice(-1)[0];
          if (lastAddr) setSelectedAddressId(lastAddr._id);
        }
      } else {
        toast.error(res.data.message || "Failed to add address");
      }
    } catch (err) {
      toast.error("Error adding address.");
    } finally {
      setIsSavingAddress(false);
    }
  };

  /** Fetch addresses */
  useEffect(() => {
    if (!user?._id) return;
    const fetchAddresses = async () => {
      try {
        const res = await axios.get(
          `https://restaurant-management-system-mern-stack.onrender.com/api/cart/get_user_addresses/${user._id}`
        );
        if (res.data.success) {
          setAddresses(res.data.addresses);
        }
      } catch (err) {
        toast.error("Failed to load saved addresses.");
      }
    };
    fetchAddresses();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <Toaster />

 <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Your Cart ({cartDetails.length})</h2>
          {error && <p className="text-red-500">{error}</p>}
          {isLoading ? (
            <p>Loading...</p>
          ) : cartDetails.length ? (
            cartDetails.map((item) => (
              <div
                key={item._id}
                className={`flex items-center justify-between p-4 rounded-xl border border-gray-300 mb-3 transition cursor-pointer ${
                  selectedItems[item._id]
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-pink-500"
                }`}
                onClick={() => handleItemSelect(item._id)}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={`data:image/jpeg;base64,${item.item_image}` || "https://via.placeholder.com/50"}
                    alt={item.item_name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <h4 className="font-semibold">{item.item_name}</h4>
                    <p className="text-sm text-gray-500">{item.description}</p>
                    <p className="text-pink-600 font-medium">${item.price}</p>
                   
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuantityChange(item._id, "decrement");
                    }}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuantityChange(item._id, "increment");
                    }}
                  >
                    +
                  </button>
                </div>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={(e) => handleRemoveItem(item._id, e)}
                >
                  🗑
                </button>
              </div>
            ))
          ) : (
            <p>Your cart is empty</p>
          )}
        </div>

        {/* Order Summary - Enhanced Modern UI (Solid White) */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-200">
          <h3 className="text-2xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-fuchsia-500 to-yellow-400 tracking-tight text-left flex items-center gap-2">
            <span role="img" aria-label="summary">🧾</span> Order Summary
          </h3>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center text-lg">
              <span className="text-gray-600 flex items-center gap-2"><span role="img" aria-label="subtotal">🛒</span> Subtotal</span>
              <span className="font-semibold text-pink-600">${calculateTotal()}</span>
            </div>
            <div className="flex justify-between items-center text-lg">
              <span className="text-gray-600 flex items-center gap-2"><span role="img" aria-label="tax">💸</span> Tax (21%)</span>
              <span className="font-semibold text-yellow-600">${(calculateTotal() * 0.21).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-lg">
              <span className="text-gray-600 flex items-center gap-2"><span role="img" aria-label="shipping">🚚</span> Shipping</span>
              <span className="font-semibold text-blue-600">$10</span>
            </div>
            <div className="flex justify-between items-center font-bold text-xl border-t pt-4">
              <span className="text-pink-700 flex items-center gap-2"><span role="img" aria-label="total">🧮</span> Total</span>
              <span className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-yellow-400 text-white px-4 py-2 rounded-xl shadow">${(parseFloat(calculateTotal()) * 1.21 + 10).toFixed(2)}</span>
            </div>
          </div>

          {/* Delivery Address - Enhanced Modern UI (Solid White) */}
          <div className="mb-6 bg-white rounded-2xl p-4">
            <h4 className="text-lg font-bold mb-3 text-pink-700 flex items-center gap-2"><span role="img" aria-label="address">🏠</span> Select Delivery Address</h4>

            {/* Current Location card */}
            <div
              className={`p-4 rounded-2xl border mb-3 cursor-pointer shadow-sm flex flex-col gap-1 ${
                selectedAddressId === 0
                  ? "border-green-500 bg-green-100/60"
                  : "border-gray-200 bg-white/60"
              }`}
              onClick={() => {
                if (!currentLocation) {
                  fetchCurrentLocationAddress();
                } else {
                  setSelectedAddressId(0);
                }
              }}
            >
              <p className="font-semibold flex items-center gap-2"><span role="img" aria-label="location">📍</span> Use Current Location</p>
              <p className="text-sm text-gray-600 mt-1">
                {currentLocation
                  ? currentLocation.fullAddress
                  : "Click to fetch current location"}
              </p>
            </div>

            {/* Add Address Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full mb-4 py-2 rounded-xl border border-pink-600 text-pink-600 bg-white font-semibold shadow flex items-center justify-center gap-2"
            >
              <span role="img" aria-label="add">➕</span> Add Delivery Address
            </button>

            {/* Saved addresses */}
            <div className="space-y-2">
              {addresses.map((addr) => (
                <div
                  key={addr._id}
                  className={`p-4 rounded-2xl border cursor-pointer shadow-sm flex flex-col gap-1 ${
                    selectedAddressId === addr._id
                      ? "border-green-500 bg-green-100/60"
                      : "border-gray-200 bg-white/60"
                  }`}
                  onClick={() => setSelectedAddressId(addr._id)}
                >
                  <strong className="flex items-center gap-2 text-base"><span role="img" aria-label="user">👤</span> {addr.full_name}</strong>
                  <span className="text-sm text-gray-700 flex items-center gap-2"><span role="img" aria-label="address">🏡</span> {addr.address_line}</span>
                  <span className="text-sm text-gray-600">{addr.city}, {addr.state}, {addr.zipcode}</span>
                  <span className="text-xs text-gray-500 flex items-center gap-2"><span role="img" aria-label="phone">📞</span> {addr.phone}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Button - Enhanced Modern UI (No Animation) */}
          {!checkout ? (
            <button
              className={`w-full py-3 rounded-2xl text-white font-bold text-lg shadow-lg flex items-center justify-center gap-2 mt-2 ${
                selectedAddressId !== null && calculateTotal() !== "0.00"
                  ? "bg-gradient-to-r from-pink-500 via-fuchsia-500 to-yellow-400"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              onClick={handleProceedToPayment}
              disabled={selectedAddressId === null || calculateTotal() === "0.00"}
            >
              <span role="img" aria-label="pay">💳</span> Proceed to Payment
            </button>
          ) : (
            <div className="mt-4">
              <PayPalScriptProvider
                options={{
                  "client-id":
                    "AcE5tnVEdPIABDFHbELA6SP5UmuwvrI3Cet__4pw2-HW58dd7F_FGCVR5xzazDbk9kxoPCIcKo2bN-h0",
                }}
              >
                <PayPalButtons createOrder={createOrder} onApprove={onApprove} style={{ layout: 'vertical', color: 'gold', shape: 'pill', label: 'pay' }} />
              </PayPalScriptProvider>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Add Address */}
        {isModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40"
            onClick={() => !isSavingAddress && setIsModalOpen(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-pink-200 relative">
              <h3 className="text-2xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-fuchsia-500 to-yellow-400 tracking-tight text-left flex items-center gap-2">
                <span role="img" aria-label="address">🏠</span> Add New Delivery Address
              </h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={newAddress.full_name}
                    onChange={(e) => setNewAddress({ ...newAddress, full_name: e.target.value })}
                    className="w-1/2 p-3 border border-pink-200 rounded-xl bg-white focus:ring-2 focus:ring-pink-400 text-lg"
                  />
                  <input
                    type="text"
                    placeholder="Phone"
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                    className="w-1/2 p-3 border border-pink-200 rounded-xl bg-white focus:ring-2 focus:ring-pink-400 text-lg"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Address Line"
                  value={newAddress.address_line}
                  onChange={(e) => setNewAddress({ ...newAddress, address_line: e.target.value })}
                  className="w-full p-3 border border-pink-200 rounded-xl bg-white focus:ring-2 focus:ring-pink-400 text-lg"
                />
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="City"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="w-1/2 p-3 border border-pink-200 rounded-xl bg-white focus:ring-2 focus:ring-pink-400 text-lg"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                    className="w-1/2 p-3 border border-pink-200 rounded-xl bg-white focus:ring-2 focus:ring-pink-400 text-lg"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Zipcode"
                  value={newAddress.zipcode}
                  onChange={(e) => setNewAddress({ ...newAddress, zipcode: e.target.value })}
                  className="w-full p-3 border border-pink-200 rounded-xl bg-white focus:ring-2 focus:ring-pink-400 text-lg"
                />
                <label className="inline-flex items-center space-x-2 mt-2">
                  <input
                    type="checkbox"
                    checked={newAddress.is_default === 1}
                    onChange={() => setNewAddress({ ...newAddress, is_default: newAddress.is_default === 1 ? 0 : 1 })}
                    className="form-checkbox accent-pink-500 w-5 h-5"
                  />
                  <span className="text-pink-700 font-medium">Set as default address</span>
                </label>
              </div>
              <div className="mt-8 flex justify-end gap-4">
                <button
                  disabled={isSavingAddress}
                  onClick={handleSaveAddress}
                  className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-yellow-400 text-white px-6 py-2 rounded-xl font-bold shadow hover:from-yellow-400 hover:to-pink-500 disabled:opacity-50 text-lg"
                >
                  {isSavingAddress ? "Saving..." : "Save"}
                </button>
                <button
                  disabled={isSavingAddress}
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-xl font-bold shadow hover:bg-gray-300 text-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>


  );
};

export default Cart;

     