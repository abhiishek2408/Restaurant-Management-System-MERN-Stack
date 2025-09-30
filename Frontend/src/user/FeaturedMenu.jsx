import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UseContext";
import LocationContext from "../context/LocationContext";

function FoodItemsByLocation() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalData, setModalData] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const { city, displayLocation } = useContext(LocationContext);

  useEffect(() => {
    if (city) fetchFoodItems(city);
  }, [city]);

  const fetchFoodItems = (cityName) => {
    if (!cityName.trim()) {
      setError("Please enter a valid city name.");
      setFoodItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setFoodItems([]);

    fetch(
      `https://restaurant-management-system-mern-stack.onrender.com//api/food-items/all?city=${encodeURIComponent(
        cityName
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.message || "Error fetching food items");
          setFoodItems([]);
        } else {
          setFoodItems(data);
          setError(null);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch food items");
        setFoodItems([]);
        setLoading(false);
      });
  };

 


  // ===== FIXED Add to Cart =====
  const addToCart = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!modalData) return;

    const cartData = {
      user_id: user._id, // should be stringified ObjectId
      menu_section_id: modalData._id, // ObjectId string from MongoDB
      item_name: modalData.name,
      item_image: modalData.product_image || "",
      description: modalData.description || "",
      quantity: parseInt(quantity, 10),
      price: parseFloat(modalData.price),
      state: "",
    };
 
    console.log("Cart Data:", cartData);


    axios
      .post("https://restaurant-management-system-mern-stack.onrender.com//api/cart/add-to-cart", cartData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.success) {
          alert("Item added to cart successfully!");
          setModalData(null);
          setQuantity(1);
        } else {
          alert(response.data.message || "Failed to add item to cart.");
        }
      })
      .catch((error) => {
        console.error("Error adding item to cart:", error);
        console.log("Cart Data:", cartData);

        if (error.response && error.response.data && error.response.data.message) {
          alert(error.response.data.message);
          console.log("Cart Data:", cartData);

        } else {
          alert("An error occurred. Please try again.");
          console.log("Cart Data:", cartData);

        }
      });
  };

  const updateTotalPrice = (price, quantity) => (price * quantity).toFixed(2);

  // Skeleton Loader
  const SkeletonCard = () => (
    <div className="animate-pulse bg-white rounded-lg shadow-md p-4 space-y-4">
      <div className="bg-gray-300 h-40 rounded-md"></div>
      <div className="h-6 bg-gray-300 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      <div className="h-5 bg-gray-300 rounded w-1/4"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Find Food Items by Location
      </h2>

      <h3 className="text-xl font-medium mb-6 text-gray-700">
        Location:{" "}
        <span className="font-normal text-gray-500">{displayLocation}</span>
      </h3>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {!loading && !error && foodItems.length === 0 && (
        <p className="text-center text-gray-700">
          No food items available for this location.
        </p>
      )}

      {!loading && !error && foodItems.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {foodItems.map((item) => {
            const isNew = item.is_new === true || item.is_new === 1 || item.is_new === "1";
            const isSpecialOffer = item.isOffer === true || item.isOffer === 1 || item.isOffer === "1";

            return (
              <div
                key={item._id}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col cursor-pointer"
                onClick={() => {
                  setModalData(item);
                  setQuantity(1);
                }}
              >
                {item.product_image ? (
                  <img
                    src={`data:image/jpeg;base64,${item.product_image}`}
                    alt={item.name}
                    className="h-48 w-full object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="h-48 w-full bg-gray-200 flex items-center justify-center rounded-t-lg text-gray-400">
                    No Image
                  </div>
                )}

                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">
                    {item.name}
                    {isNew && <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded ml-2">New</span>}
                    {isSpecialOffer && <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded ml-2">Special Offer</span>}
                  </h3>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">{item.description}</p>
                  <div className="mt-2 text-sm text-gray-500 flex flex-wrap gap-3">
                    {item.vegan ? <span>🥦 Vegan</span> : null}
                    {item.rating ? <span>⭐ {item.rating}</span> : null}
                  </div>
                  <p className="mt-4 text-pink-600 font-semibold text-lg">₹{item.price}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {modalData && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4 font-lato">
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full flex flex-col md:flex-row overflow-hidden relative min-h-[520px]">
            <button
              onClick={() => setModalData(null)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-3xl font-bold z-10 transition-transform hover:rotate-90 duration-300"
            >
              &times;
            </button>

            <div className="md:w-2/5 w-full p-6 flex flex-col items-center justify-center bg-gray-50 border-r border-gray-200">
              {modalData.product_image ? (
                <div className="overflow-hidden rounded-lg shadow-lg border border-gray-200">
                  <img
                    src={`data:image/jpeg;base64,${modalData.product_image}`}
                    alt={modalData.name}
                    className="object-cover w-full h-[350px] md:h-[400px] transform transition-transform duration-300 ease-in-out hover:scale-110"
                  />
                </div>
              ) : (
                <div className="w-full h-[350px] md:h-[400px] bg-gray-200 flex items-center justify-center text-gray-400 text-xl font-medium rounded-lg border border-gray-300 shadow-md">
                  No Image
                </div>
              )}
            </div>

            <div className="md:w-3/5 w-full p-8 flex flex-col justify-between">
              <div>
                <h2 className="text-4xl font-light text-gray-900">{modalData.name}</h2>
                <div className="text-sm text-gray-600 mt-3 mb-4 flex flex-wrap gap-2 items-center">
                  {modalData.vegan && (
                    <span className="inline-block bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-semibold select-none">
                      🥦 Vegan
                    </span>
                  )}
                  {modalData.rating && (
                    <span className="inline-block bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold select-none">
                      ⭐ {modalData.rating}
                    </span>
                  )}
                  {(modalData.isOffer === true || modalData.isOffer === 1 || modalData.isOffer === "1") && (
                    <span className="inline-block bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-semibold select-none">
                      🔥 Special Offer
                    </span>
                  )}
                </div>
                <p className="text-gray-600 leading-relaxed text-base mt-2">{modalData.description}</p>
                <p className="mt-6 text-indigo-700 font-light text-2xl">
                  <span className="font-semibold">Total Price:</span> ₹{updateTotalPrice(modalData.discount_price || modalData.price, quantity)}
                </p>

                <div className="mt-3">
                  <label htmlFor="quantity" className="font-medium text-lg text-gray-700 select-none">
                    Quantity:
                  </label>
                  <input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => { const val = parseInt(e.target.value); if (val > 0) setQuantity(val); }}
                    className="w-20 h-10 ml-1 border border-gray-300 rounded-md px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                  />
                </div>

                <button
                  onClick={addToCart}
                  className="bg-indigo-600 mt-5 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 text-lg shadow-lg shadow-indigo-400/40 transform hover:scale-105"
                >
                  Add to Cart | ₹{updateTotalPrice(modalData.discount_price || modalData.price, quantity)}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FoodItemsByLocation;
