import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import UserContext from "../context/UseContext";
import { useNavigate } from "react-router-dom";
import { Salad, ChefHat, GlassWater } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

const categories = [
  { name: "Appetizers", icon: Salad },
  { name: "Drinks Menu", icon: GlassWater },
  { name: "Pasta", icon: ChefHat },
  { name: "Rice and Grain-Based Dishes", icon: ChefHat },
  { name: "Meat Dishes", icon: ChefHat },
  { name: "Seafood Dishes", icon: ChefHat },
  { name: "Curry Dishes", icon: ChefHat },
  { name: "Pizza and Flatbreads", icon: ChefHat },
  { name: "Burgers and Sandwiches", icon: ChefHat },
  { name: "Grilled and Barbecue Dishes", icon: ChefHat },
  { name: "Asian Dishes", icon: ChefHat },
  { name: "Vegetarian and Vegan Dishes", icon: ChefHat },
  { name: "Mexican Dishes", icon: ChefHat },
];

// Skeleton Loader
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl shadow-lg animate-pulse p-5 flex flex-col gap-4">
    <div className="bg-gray-200 rounded-xl w-full h-40"></div>
    <div className="h-6 bg-gray-200 rounded w-4/5 mx-auto"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
  </div>
);

const CategoryMenu = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [menuItems, setMenuItems] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [modalData, setModalData] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      setError(null);

      try {
        const encodedCategory = selectedCategory && selectedCategory !== "All"
          ? `?category=${encodeURIComponent(selectedCategory)}`
          : "";
        const url = `http://localhost:5000/api/food-items/category${encodedCategory}`;
        const response = await axios.get(url);

        if (response.data.error) {
          setError(response.data.message || "Error fetching data");
          setMenuItems({});
        } else if (Array.isArray(response.data)) {
          setMenuItems({ [selectedCategory]: response.data });
        } else if (typeof response.data === "object") {
          setMenuItems(response.data);
        } else {
          setError("Unexpected response from server.");
          setMenuItems({});
        }
      } catch {
        setError("Failed to fetch menu items.");
        setMenuItems({});
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [selectedCategory]);

  const openModal = (item) => {
    setModalData(item);
    setQuantity(1);
  };

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
      .post("http://localhost:5000/api/cart/add-to-cart", cartData, {
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

  const updateTotalPrice = (price, qty) => (price * qty).toFixed(2);

  return (
    <>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="min-h-screen bg-gray-50 font-sans flex flex-col items-center p-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
        <h1 className="text-5xl font-bold text-center mb-2 tracking-tight text-gray-800">
          {selectedCategory === "All" ? "Delicious Food Awaits" : `Category: ${selectedCategory}`}
        </h1>
        <p className="text-xl text-center text-gray-500 mb-8">
          Explore our wide range of categories.
        </p>

        <div className="flex w-full max-w-7xl overflow-x-auto space-x-3 md:space-x-4 pb-4 px-2 no-scrollbar mb-12">
          {[{ name: "All", icon: ChefHat }, ...categories].map(({ name, icon }) => {
            const Icon = icon;
            const isSelected = selectedCategory === name;
            return (
              <button
                key={name}
                onClick={() => setSelectedCategory(name)}
                className={`flex-shrink-0 px-5 py-2 rounded-full font-medium transition-all duration-300 shadow-md transform hover:scale-105
                  ${isSelected
                    ? 'bg-pink-500 text-white shadow-pink-300/50'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon className="h-4 w-4" />
                  <span className="whitespace-nowrap">{name}</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="w-full max-w-7xl">
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {error && !loading && (
            <p className="text-center text-xl text-pink-600 mt-10">{error}</p>
          )}

          {!loading && !error && Object.keys(menuItems).length > 0 && (
            Object.entries(menuItems).map(([catName, items]) => (
              <div key={catName} className="mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center md:text-left">{catName}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {items.map((item, index) => {
                    const isNew = item.is_new === true || item.is_new === 1 || item.is_new === "1";
                    const isSpecialOffer = item.isOffer === true || item.isOffer === 1 || item.isOffer === "1";

                    return (
                      <div
                        key={item._id || `${item.name}-${index}`}
                        className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer flex flex-col justify-between overflow-hidden"
                        onClick={() => openModal(item)}
                      >
                        <div className="relative h-48 w-full overflow-hidden">
                          <img
                            src={`data:image/jpeg;base64,${item.product_image}`}
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                          />
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                          <h3 className="text-xl font-semibold mb-2 text-gray-900">
                            {item.name}
                            {isNew && <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">New</span>}
                            {isSpecialOffer && <span className="bg-red-100 text-pink-700 text-xs px-2 py-1 rounded">Special Offer</span>}
                          </h3>
                          <p className="text-sm text-gray-500 mt-2 line-clamp-2">{item.description}</p>

                          <div className="mt-2 text-sm text-gray-500 flex flex-wrap gap-3">
                            {item.vegan ? <span>🥦 Vegan</span> : null}
                            {item.rating ? <span>⭐ {item.rating}</span> : null}
                          </div>

                          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                            <span className="text-2xl font-bold text-pink-500">₹{item.price}</span>
                            <span className="text-sm text-gray-500">{item.time} min</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal & Toast sections unchanged */}
        {/* ... (modal and toast code remains the same) */}
      </div>
    </>
  );
};

export default CategoryMenu;
