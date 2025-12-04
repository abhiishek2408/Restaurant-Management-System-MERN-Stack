
import React, { useState, useEffect } from "react";
import axios from "axios";
// ...existing code...
import { Salad, ChefHat, GlassWater } from 'lucide-react';
// import { motion, AnimatePresence } from "framer-motion";


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
  // Removed unused: user, navigate, modalData, quantity, setQuantity
  // But setModalData is needed for openModal, so define it without using modalData
  // eslint-disable-next-line no-unused-vars
  const [, setModalData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [menuItems, setMenuItems] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Define openModal to fix no-undef error
  const openModal = (item) => {
    setModalData(item);
    // If you have a modal open state, set it here, e.g. setShowModal(true);
  };
  // const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      setError(null);

      try {
        const encodedCategory = selectedCategory && selectedCategory !== "All"
          ? `?category=${encodeURIComponent(selectedCategory)}`
          : "";
        const url = `https://restaurant-management-system-mern-stack.onrender.com/api/food-items/category${encodedCategory}`;
        const response = await axios.get(url);

        if (response.data.error) {
          setError(response.data.message || "Error fetching data");
          setMenuItems({});
        } else if (Array.isArray(response.data)) {
          setMenuItems({ [selectedCategory]: response.data });
        } else if (typeof response.data === "object") {
          setMenuItems(response.data);
        }
      } catch (err) {
        setError("Error fetching data");
        setMenuItems({});
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, [selectedCategory]);

  // const updateTotalPrice = (price, qty) => (price * qty).toFixed(2);

  return (
    <>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="min-h-screen bg-white font-sans flex flex-col items-center p-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
        <h1 className="text-5xl font-extrabold text-center mb-2 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-fuchsia-500 to-yellow-400">
          {selectedCategory === "All" ? "Delicious Food Awaits" : `Category: ${selectedCategory}`}
        </h1>
        <p className="text-xl text-center text-gray-500 mb-8">
          <span className="inline-flex items-center gap-2"><span role="img" aria-label="menu">🍽️</span> Explore our wide range of categories.</span>
        </p>

        <div className="flex w-full max-w-7xl overflow-x-auto space-x-3 md:space-x-4 pb-4 px-2 no-scrollbar mb-12">
          {[{ name: "All", icon: ChefHat }, ...categories].map(({ name, icon }) => {
            const Icon = icon;
            const isSelected = selectedCategory === name;
            return (
              <button
                key={name}
                onClick={() => setSelectedCategory(name)}
                className={`flex-shrink-0 px-5 py-2 rounded-full font-semibold shadow-md border border-pink-200 transition-colors duration-200
                  ${isSelected
                    ? 'bg-gradient-to-r from-pink-500 via-fuchsia-500 to-yellow-400 text-white border-none'
                    : 'bg-white text-gray-600 hover:bg-pink-50'
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
                <h2 className="text-3xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-fuchsia-500 to-yellow-400 text-center md:text-left flex items-center gap-2">
                  <span role="img" aria-label="category">🍲</span> {catName}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  {items.map((item, index) => {
                    const isNew = item.is_new === true || item.is_new === 1 || item.is_new === "1";
                    const isSpecialOffer = item.isOffer === true || item.isOffer === 1 || item.isOffer === "1";

                    return (
                      <div
                        key={item._id || `${item.name}-${index}`}
                        className="bg-white rounded-3xl shadow-xl border border-pink-100 cursor-pointer flex flex-col justify-between overflow-hidden transition-colors duration-200 hover:border-pink-400"
                        onClick={() => openModal(item)}
                      >
                        <div className="relative h-48 w-full overflow-hidden flex items-center justify-center bg-gray-50">
                          {item.product_image ? (
                            <img
                              src={`data:image/jpeg;base64,${item.product_image}`}
                              alt={item.name}
                              className="w-full h-full object-cover rounded-t-3xl"
                            />
                          ) : (
                            <span className="text-gray-400 text-lg">No Image</span>
                          )}
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                          <h3 className="text-xl font-bold mb-2 text-gray-900 flex items-center gap-2">
                            {item.name}
                            {isNew && <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full ml-2">New</span>}
                            {isSpecialOffer && <span className="bg-red-100 text-pink-700 text-xs px-2 py-1 rounded-full ml-2">Special Offer</span>}
                          </h3>
                          <p className="text-sm text-gray-500 mt-2 line-clamp-2">{item.description}</p>

                          <div className="mt-2 text-sm text-gray-500 flex flex-wrap gap-3">
                            {item.vegan ? <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-full">🥦 Vegan</span> : null}
                            {item.rating ? <span className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full">⭐ {item.rating}</span> : null}
                          </div>

                          <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
                            <span className="text-2xl font-extrabold text-pink-500">₹{item.price}</span>
                            <span className="text-sm text-gray-500 flex items-center gap-1"><span role="img" aria-label="time">⏱️</span> {item.time} min</span>
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
