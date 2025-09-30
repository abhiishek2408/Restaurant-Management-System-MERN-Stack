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
      `http://localhost:5000/api/food-items/category?category=${category}`
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
    <div className="max-w-6xl mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6 capitalize">{category} Menu</h1>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <SkeletonCard key={i} />
            ))}
        </div>
      ) : (
        // Cards
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                className="bg-white rounded-lg border overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
                onClick={() => openModal(item)}
              >
                {item.product_image && (
                  <img
                    src={`data:image/jpeg;base64,${item.product_image}`}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    {item.name}
                    {isNew && (
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                        New
                      </span>
                    )}
                    {isSpecialOffer && (
                      <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded">
                        Special Offer
                      </span>
                    )}
                  </h2>

                  {/* Price & Discount */}
                  {item.discount_price ? (
                    <p className="text-green-600 font-semibold">
                      ₹{item.discount_price}{" "}
                      <span className="line-through text-gray-400 ml-2">
                        ₹{item.price}
                      </span>
                    </p>
                  ) : (
                    <p className="text-gray-700">₹{item.price}</p>
                  )}

                  {/* Extra Info */}
                  <div className="mt-2 text-sm text-gray-500 flex flex-wrap gap-3">
                    {item.vegan ? <span>🥦 Vegan</span> : null}
                    {item.rating ? <span>⭐ {item.rating}</span> : null}
                  </div>

                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">
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
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 max-w-4xl w-full p-10 relative shadow-lg border border-pink-300">
            {/* Removed border-radius on modal container */}

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
                <img
                  src={`data:image/jpeg;base64,${modalData.product_image}`}
                  alt={modalData.name}
                  className="w-full md:w-1/3 object-cover shadow-inner border border-pink-300 rounded-lg"
                />
                <div className="md:w-2/3 flex flex-col">
                  {/* Name - normal font weight */}
                  <h2 className="text-4xl text-pink-700 font-normal mb-4">
                    {modalData.name}
                  </h2>

                  <p className="mb-3 text-gray-700">{modalData.description}</p>

                  {/* Price - normal font weight and smaller size */}
                  <p className="text-pink-600 font-normal mb-3 text-2xl">
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
                      <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                        🥦 Vegan
                      </span>
                    ) : null}
                    {modalData.rating ? (
                      <span className="inline-block bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-semibold">
                        ⭐ {modalData.rating}
                      </span>
                    ) : null}
                    {(modalData.isOffer === true ||
                    modalData.isOffer === 1 ||
                    modalData.isOffer === "1") && (
                      <span className="inline-block bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-semibold">
                        Special Offer
                      </span>
                    )}
                  </div>

                  {/* Quantity */}
                  <label className="block mb-8 font-semibold text-lg">
                    Quantity:
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                      }
                      className="ml-4 w-24 px-4 py-2 border border-pink-300 rounded-2xl"
                    />
                  </label>

                  <button
                    onClick={addToCart}
                    className="mt-auto bg-pink-600 hover:bg-pink-700 text-white px-10 py-3 rounded-full font-bold transition-colors duration-300"
                  >
                    Add to Cart | ₹
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
