import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserContext from "../context/UseContext";
import axios from "axios";

const SkeletonCard = () => (
  <div className="bg-gray-200 animate-pulse rounded-lg border h-72"></div>
);

const SkeletonModalContent = () => (
  <div className="w-full max-w-4xl p-10 bg-gradient-to-br from-pink-50 to-purple-50 shadow-lg border border-pink-300">
    <div className="flex flex-col md:flex-row gap-12">
      <div className="w-full md:w-1/3 h-48 bg-gray-300 rounded-lg animate-pulse"></div>
      <div className="md:w-2/3 flex flex-col space-y-6">
        <div className="h-10 bg-gray-300 rounded animate-pulse w-3/4"></div>
        <div className="h-24 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-8 bg-gray-300 rounded animate-pulse w-1/2"></div>
        <div className="h-6 bg-gray-200 rounded animate-pulse w-full"></div>
        <div className="h-12 bg-pink-400 rounded-full animate-pulse w-40"></div>
      </div>
    </div>
  </div>
);

const MenuPage = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const { category } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalData, setModalData] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(
      `https://restaurant-management-system-mern-stack.onrender.com/api/food-items/category?category=${category}`
    )
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter(
          (item) => !(item.is_featured === 1 || item.show_on_homepage === 1)
        );
        setItems(filtered);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching menu:", err);
        setLoading(false);
      });
  }, [category]);

  const openModal = (item) => {
    setModalLoading(true);
    // Simulate loading delay for modal content (optional)
    setTimeout(() => {
      setModalData(item);
      setQuantity(1);
      setModalLoading(false);
    }, 300); // 300ms delay for effect
  };

  const addToCart = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!modalData) return;

    const cartData = {
      user_id: user.user_id,
      item_id: modalData.Id || modalData.id,
      item_image: modalData.product_image,
      item_name: modalData.name,
      item_price: modalData.price,
      description: modalData.description,
      quantity: quantity,
    };

    axios
      .post("http://localhost/onlinerestro/backend/add_to_cart.php", cartData, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        if (response.data.success) {
          alert("Item added to cart successfully!");
          setModalData(null);
        } else {
          alert("Failed to add item to cart.");
        }
      })
      .catch(() => alert("An error occurred. Please try again."));
  };

  const updateTotalPrice = (price, quantity) =>
    (price * quantity).toFixed(2);

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-3xl font-extrabold mb-8 capitalize text-center text-pink-700 tracking-wide drop-shadow-sm">
        {category} Menu
      </h1>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <SkeletonCard key={i} />
            ))}
        </div>
      ) : (
        // Cards
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, idx) => {
            const isNew =
              item.is_new === true || item.is_new === 1 || item.is_new === "1";
            const isSpecialOffer =
              item.isOffer === true ||
              item.isOffer === 1 ||
              item.isOffer === "1";

            return (
              <div
                key={idx}
                className="bg-gradient-to-br from-pink-100 via-white to-purple-100 rounded-3xl border-2 border-pink-300 overflow-hidden cursor-pointer shadow-xl hover:scale-105 hover:shadow-pink-300/60 transition-all duration-300 group relative ring-1 ring-pink-100"
                onClick={() => openModal(item)}
              >
                {item.product_image && (
                  <div className="relative">
                    <img
                      src={`data:image/jpeg;base64,${item.product_image}`}
                      alt={item.name}
                      className="w-full h-56 object-cover group-hover:brightness-95 transition duration-200 rounded-t-3xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-pink-200/30 via-transparent to-transparent pointer-events-none rounded-t-3xl"></div>
                    {isNew && (
                      <span className="absolute top-3 left-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full shadow font-bold tracking-wide drop-shadow-lg">
                        New
                      </span>
                    )}
                    {isSpecialOffer && (
                      <span className="absolute top-3 right-3 bg-pink-600 text-white text-xs px-3 py-1 rounded-full shadow font-bold tracking-wide animate-pulse drop-shadow-lg">
                        Special Offer
                      </span>
                    )}
                  </div>
                )}
                <div className="p-6 flex flex-col gap-2">
                  <h2 className="text-2xl font-extrabold flex items-center gap-2 text-gray-900 group-hover:text-pink-700 transition tracking-tight">
                    <span className="inline-block text-pink-400">🍽️</span> {item.name}
                  </h2>

                  {/* Price & Discount */}
                  {item.discount_price ? (
                    <p className="text-pink-700 font-extrabold text-lg">
                      ₹{item.discount_price}{" "}
                      <span className="line-through text-gray-400 ml-2 text-base font-semibold">
                        ₹{item.price}
                      </span>
                    </p>
                  ) : (
                    <p className="text-gray-700 font-bold text-lg">₹{item.price}</p>
                  )}

                  {/* Extra Info */}
                  <div className="mt-1 text-xs text-gray-500 flex flex-wrap gap-2">
                    {item.vegan ? <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">🥦 Vegan</span> : null}
                    {item.rating ? <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-semibold">⭐ {item.rating}</span> : null}
                  </div>

                  <p className="text-sm text-gray-700 mt-2 line-clamp-2 min-h-[40px] italic">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {modalData && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center p-6 z-50 overflow-auto">
          <div className="bg-gradient-to-br from-pink-100 via-white to-purple-100 max-w-4xl w-full p-10 relative shadow-2xl border-2 border-pink-400 rounded-3xl animate-fadeIn ring-2 ring-pink-100">
            <button
              onClick={() => setModalData(null)}
              className="absolute top-6 right-7 text-4xl font-extrabold text-pink-600 hover:text-pink-800 transition-colors duration-300"
              aria-label="Close modal"
            >
              &times;
            </button>

            {modalLoading ? (
              <SkeletonModalContent />
            ) : (
              <div className="flex flex-col md:flex-row gap-12">
                <div className="relative w-full md:w-1/3 flex items-center justify-center">
                  <img
                    src={`data:image/jpeg;base64,${modalData.product_image}`}
                    alt={modalData.name}
                    className="w-full object-cover shadow-inner border-2 border-pink-300 rounded-2xl max-h-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-pink-200/30 via-transparent to-transparent pointer-events-none rounded-2xl"></div>
                </div>
                <div className="md:w-2/3 flex flex-col">
                  <h2 className="text-4xl text-pink-700 font-extrabold mb-4 tracking-tight flex items-center gap-2">
                    <span className="inline-block text-pink-400">🍽️</span> {modalData.name}
                  </h2>

                  <p className="mb-3 text-gray-700 text-lg">{modalData.description}</p>

                  <p className="text-pink-600 font-bold mb-3 text-2xl">
                    {modalData.discount_price ? (
                      <>
                        ₹{modalData.discount_price}{" "}
                        <span className="line-through text-gray-400 ml-2 font-normal text-lg">
                          ₹{modalData.price}
                        </span>
                      </>
                    ) : (
                      <>₹{modalData.price}</>
                    )}
                  </p>

                  <div className="text-sm text-gray-600 mb-6 flex flex-wrap gap-2">
                    {modalData.vegan ? (
                      <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                        🥦 Vegan
                      </span>
                    ) : null}
                    {modalData.rating ? (
                      <span className="inline-block bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-semibold">
                        ⭐ {modalData.rating}
                      </span>
                    ) : null}
                    {(modalData.isOffer === true ||
                    modalData.isOffer === 1 ||
                    modalData.isOffer === "1") && (
                      <span className="inline-block bg-pink-600 text-white px-2 py-1 rounded-full text-xs font-semibold animate-pulse">
                        Special Offer
                      </span>
                    )}
                  </div>

                  <label className="block mb-8 font-semibold text-lg">
                    Quantity:
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                      }
                      className="ml-4 w-24 px-4 py-2 border-2 border-pink-300 rounded-2xl"
                    />
                  </label>

                  <button
                    onClick={addToCart}
                    className="mt-auto bg-gradient-to-r from-pink-500 via-pink-600 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-12 py-3 rounded-full font-extrabold text-lg shadow-xl transition-all duration-300 tracking-wide border-2 border-pink-300 hover:scale-105"
                  >
                    <span className="mr-2">🛒</span> Add to Cart | ₹
                    {updateTotalPrice(
                      modalData.discount_price || modalData.price,
                      quantity
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuPage;
