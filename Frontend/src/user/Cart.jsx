import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import UserContext from "../context/UseContext";

const Cart = () => {
  const { user, cartLength, setCartLength } = useContext(UserContext);
  const [cartDetails, setCartDetails] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [selectedItems, setSelectedItems] = useState({});
  const [checkout, setCheckout] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  console.log("User: " , user);

  // Modal and new address form state
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

  /** Fetch cart items */
useEffect(() => {
  if (!user?._id) {
    setError("User ID is missing or invalid.");
    setIsLoading(false);
    return;
  }
  const fetchCart = async () => {
    try {
      const res = await axios.get(`https://restaurant-management-system-mern-stack.onrender.com/api/cart/get-cart/${user._id}`);
      if (res.data.success) {
        setCartDetails(res.data.cart);
        setError(null);
      } else {
        setCartDetails([]);
        setError("No cart data found.");
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching cart data.");
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


  /** Get current location and reverse geocode */
  const fetchCurrentLocationAddress = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
            params: {
              format: "json",
              lat: latitude,
              lon: longitude,
              addressdetails: 1,
            },
          });
          const addr = res.data.address;
          if (!addr) {
            alert("Could not fetch detailed address from coordinates.");
            return;
          }
          const fullAddress = buildFullAddress(addr);

          const locationObj = {
            id: 0,
            label: "Current Location",
            fullAddress,
            lat: latitude,
            lon: longitude,
          };
          setCurrentLocation(locationObj);
          setSelectedAddressId(0);
        } catch (error) {
          alert("Failed to get current location details.");
          console.error(error);
        }
      },
      (err) => {
        alert("Geolocation permission denied or unavailable.");
        console.error(err);
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

  if (!window.confirm("Delete this item?")) return;

  try {
    const res = await axios.delete(`https://restaurant-management-system-mern-stack.onrender.com/api/cart/delete-from-cart/${id}`);

    if (res.data.success) {
      alert("Item deleted successfully!");
      setCartDetails((prev) => prev.filter((i) => i._id !== id));
    } else {
      alert(res.data.message || "Failed to delete item.");
    }
  } catch (err) {
    console.error(err);
    alert("Error deleting item.");
  }
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
      alert("Please select a delivery address.");
      return;
    }
    if (calculateTotal() === "0.00") {
      alert("Please select at least one item.");
      return;
    }
    setCheckout(true);
  };

  /** PayPal */
  const createOrder = async () => {
    const selectedAddress =
      selectedAddressId === 0
        ? currentLocation
        : addresses.find((a) => a.id === selectedAddressId);
    const res = await axios.post("https://restaurant-management-system-mern-stack.onrender.com/api/paypal/create-order", {
      total: calculateTotal(),
      address: selectedAddress,
    });
    return res.data.id;
  };

  const onApprove = (data) => {
    console.log("Payment Approved:", data);
    alert("Payment successful!");
  };





  /** Save new address */
const handleSaveAddress = async () => {
  const { full_name, phone, address_line, city, state, zipcode, is_default } = newAddress;

  // Frontend validation
  if (!full_name || !phone || !address_line || !city || !state || !zipcode) {
    alert("Please fill all fields");
    return;
  }

  setIsSavingAddress(true);

  try {
    const token = localStorage.getItem("token");
    console.log("Token (before request):", token);

    // Ensure types match backend expectations
    const payload = {
      full_name,
      phone: Number(phone),
      address_line,
      city,
      state,
      zipcode: Number(zipcode),
      is_default: is_default ? "1" : "0", // string
    };

    console.log("Payload being sent:", payload);

    const res = await axios.post(
      "https://restaurant-management-system-mern-stack.onrender.com/api/cart/add_user_addresses",
      payload,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (res.data.success) {
      alert("Address added successfully");
      setIsModalOpen(false);
      setNewAddress({
        full_name: "",
        phone: "",
        address_line: "",
        city: "",
        state: "",
        zipcode: "",
        is_default: "0",
      });

      // Refresh address list
      const addrRes = await axios.get(
        `https://restaurant-management-system-mern-stack.onrender.com/api/cart/get_user_addresses/${user._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (addrRes.data.success) {
        setAddresses(addrRes.data.addresses);
        const lastAddr = addrRes.data.addresses.slice(-1)[0];
        if (lastAddr) setSelectedAddressId(lastAddr._id);
      }
    } else {
      alert("Failed to add address: " + (res.data.message || "Unknown error"));
    }


  } catch (err) {
    console.error("Error adding address:", err);
    
    if (err.response && err.response.data && err.response.data.message) {
    alert(err.response.data.message);
    } else {
    alert("Error adding address. Check console for details.");
    }
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
      } else {
        setAddresses([]);
      }
    } catch (err) {
      console.error("Error fetching addresses:", err);
      setAddresses([]);
    }
  };

  fetchAddresses();
}, [user]);




useEffect(() => {
  setCartLength(cartDetails.length);
}, [cartDetails, setCartLength]);




  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
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

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-xl font-bold mb-4">Order Summary</h3>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${calculateTotal()}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (21%)</span>
              <span>${(calculateTotal() * 0.21).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>$10</span>
            </div>
            <div className="flex justify-between font-semibold text-lg border-t pt-2">
              <span>Total</span>
              <span>${(parseFloat(calculateTotal()) * 1.21 + 10).toFixed(2)}</span>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Select Delivery Address</h4>

            {/* Current Location card */}
            <div
              className={`p-3 rounded-lg border mb-2 cursor-pointer transition ${
                selectedAddressId === 0
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-pink-300"
              }`}
              onClick={() => {
                if (!currentLocation) {
                  fetchCurrentLocationAddress();
                } else {
                  setSelectedAddressId(0);
                }
              }}
            >
              <p className="font-semibold">Use Current Location</p>
              <p className="text-sm text-gray-600 mt-1">
                {currentLocation
                  ? currentLocation.fullAddress
                  : "Click to fetch current location"}
              </p>
            </div>

            {/* Add Address Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full mb-4 py-2 rounded-lg border border-pink-600 text-pink-600 hover:bg-pink-50 transition"
            >
              + Add Delivery Address
            </button>

            {/* Saved addresses */}
            {addresses.map((addr) => (
              <div
                key={addr._id}
                className={`p-3 rounded-lg border mb-2 cursor-pointer transition ${
                  selectedAddressId === addr._id
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-pink-300"
                }`}
                onClick={() => setSelectedAddressId(addr._id)}
              >
                <strong>{addr.full_name} - {addr.address_line}</strong>
                <p className="text-sm text-gray-600">
                  {addr.city}, {addr.state}, {addr.zipcode}
                </p>
                <p className="text-xs text-gray-500">Phone: {addr.phone}</p>
              </div>
            ))}
          </div>

          {!checkout ? (
            <button
              className={`w-full py-2 rounded-lg text-white font-semibold transition ${
                selectedAddressId !== null && calculateTotal() !== "0.00"
                  ? "bg-pink-600 hover:bg-pink-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              onClick={handleProceedToPayment}
              disabled={selectedAddressId === null || calculateTotal() === "0.00"}
            >
              Proceed to Payment
            </button>
          ) : (
            <PayPalScriptProvider
              options={{
                "client-id":
                  "AcE5tnVEdPIABDFHbELA6SP5UmuwvrI3Cet__4pw2-HW58dd7F_FGCVR5xzazDbk9kxoPCIcKo2bN-h0",
              }}
            >
              <PayPalButtons createOrder={createOrder} onApprove={onApprove} />
            </PayPalScriptProvider>
          )}
        </div>
      </div>

      {/* Modal for Add Address */}
      {isModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => !isSavingAddress && setIsModalOpen(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-lg relative">
              <h3 className="text-xl font-semibold mb-4">Add New Delivery Address</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={newAddress.full_name}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, full_name: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Phone"
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Address Line"
                  value={newAddress.address_line}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, address_line: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="City"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="State"
                  value={newAddress.state}
                  onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Zipcode"
                  value={newAddress.zipcode}
                  onChange={(e) => setNewAddress({ ...newAddress, zipcode: e.target.value })}
                  className="w-full p-2 border rounded"
                />
                {/* Optional: checkbox for default address */}
                <label className="inline-flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newAddress.is_default === 1}
                    onChange={() =>
                      setNewAddress({
                        ...newAddress,
                        is_default: newAddress.is_default === 1 ? 0 : 1,
                      })
                    }
                    className="form-checkbox"
                  />
                  <span>Set as default address</span>
                </label>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  disabled={isSavingAddress}
                  onClick={handleSaveAddress}
                  className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 disabled:opacity-50"
                >
                  {isSavingAddress ? "Saving..." : "Save"}
                </button>
                <button
                  disabled={isSavingAddress}
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
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
