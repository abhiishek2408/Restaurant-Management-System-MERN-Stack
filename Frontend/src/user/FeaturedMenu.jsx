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
      `https://restaurant-management-system-mern-stack.onrender.com/api/food-items/all?city=${encodeURIComponent(
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
      .post("https://restaurant-management-system-mern-stack.onrender.com/api/cart/add-to-cart", cartData, {
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
      <h2 className="text-3xl font-extrabold mb-4 mt-0 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-fuchsia-500 to-yellow-400 tracking-tight text-left">
        Find Food Items by Location
        <span className="block mt-2 w-20 h-1 rounded-full bg-gradient-to-r from-pink-400 via-fuchsia-400 to-yellow-300 opacity-80"></span>
      </h2>

      <h3 className="text-base font-normal mb-6 text-gray-500">
        Location: <span className="font-normal text-gray-400">{displayLocation}</span>
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
                className="bg-gradient-to-br from-pink-50 via-white to-yellow-50 rounded-2xl border-2 border-pink-100 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 flex flex-col cursor-pointer group"
                onClick={() => {
                  setModalData(item);
                  setQuantity(1);
                }}
              >
                {item.product_image ? (
                  <img
                    src={`data:image/jpeg;base64,${item.product_image}`}
                    alt={item.name}
                    className="h-48 w-full object-cover rounded-t-2xl group-hover:brightness-95 transition duration-200"
                  />
                ) : (
                  <div className="h-48 w-full bg-gray-200 flex items-center justify-center rounded-t-2xl text-gray-400">
                    No Image
                  </div>
                )}

                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 flex items-center gap-2">
                    {item.name}
                    {isNew && <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded ml-2">New</span>}
                    {isSpecialOffer && <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded ml-2">Special Offer</span>}
                  </h3>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">{item.description}</p>
                  <div className="mt-2 text-sm text-gray-500 flex flex-wrap gap-3 items-center justify-between">
                    {item.vegan ? (
                      <span><i className="fa fa-leaf text-green-500 mr-1" aria-hidden="true"></i>Vegan</span>
                    ) : null}
                    {item.rating ? (
                      <span><i className="fa fa-star text-yellow-400 mr-1" aria-hidden="true"></i>{item.rating}</span>
                    ) : null}
                    <span className="text-pink-600 font-semibold text-base ml-auto">₹{item.price}</span>
                  </div>
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
                      <i className="fa fa-leaf text-green-500 mr-1" aria-hidden="true"></i>Vegan
                    </span>
                  )}
                  {modalData.rating && (
                    <span className="inline-block bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold select-none">
                      <i className="fa fa-star text-yellow-400 mr-1" aria-hidden="true"></i>{modalData.rating}
                    </span>
                  )}
                  {(modalData.isOffer === true || modalData.isOffer === 1 || modalData.isOffer === "1") && (
                    <span className="inline-block bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-semibold select-none">
                      <i className="fa fa-fire text-red-500 mr-1" aria-hidden="true"></i>Special Offer
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
