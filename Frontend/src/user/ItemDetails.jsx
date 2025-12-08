import React, { useState, useContext } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UseContext";

function ItemDetails({ item, onClose }) {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const updateTotalPrice = (price, qty) => (price * qty).toFixed(2);

  const addToCart = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    const cartData = {
      user_id: user._id,
      menu_section_id: item._id,
      item_name: item.name,
      item_image: item.product_image || "",
      description: item.description,
      quantity: parseInt(quantity, 10),
      price: parseFloat(item.price),
    };
    axios.post("https://restaurant-management-system-mern-stack.onrender.com/api/cart/add-to-cart",
      cartData,
      { headers: { "Content-Type": "application/json" }, withCredentials: true }
    )
      .then((res) => {
        if (res.data.success) {
          toast.success("Item added to cart!", {
            style: {
              borderRadius: '12px',
              background: 'rgba(20,20,20,0.7)',
              backdropFilter: 'blur(8px)',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              boxShadow: '0 4px 24px 0 rgba(236,72,153,0.18)',
            },
            icon: '🛒',
            duration: 2500,
          });
          onClose();
          setQuantity(1);
        } else {
          toast.error(res.data.message || "Failed to add item to cart.", {
            style: {
              borderRadius: '12px',
              background: '#fff',
              color: '#f43f5e',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              boxShadow: '0 4px 24px 0 rgba(236,72,153,0.18)',
            },
            icon: '⚠️',
            duration: 2500,
          });
        }
      })
      .catch((error) => {
        if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message, {
            style: {
              borderRadius: '12px',
              background: '#fff',
              color: '#f43f5e',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              boxShadow: '0 4px 24px 0 rgba(236,72,153,0.18)',
            },
            icon: '⚠️',
            duration: 2500,
          });
        } else {
          toast.error("An error occurred. Please try again.", {
            style: {
              borderRadius: '12px',
              background: '#fff',
              color: '#d2b4b9ff',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              boxShadow: '0 4px 24px 0 rgba(236,72,153,0.18)',
            },
            icon: '⚠️',
            duration: 2500,
          });
        }
      });
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 p-4 font-lato" style={{background:'radial-gradient(circle at 60% 40%, #f472b6cc 0%, #a78bfa99 60%, #000 100%)',backdropFilter:'blur(12px)'}}>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="bg-white/80 rounded-3xl shadow-2xl max-w-5xl w-full flex flex-col md:flex-row overflow-hidden relative min-h-[520px] animate-float" style={{
        boxShadow:'0 16px 80px 0 rgba(236,72,153,0.28), 0 1.5px 16px 0 rgba(59,130,246,0.22), 0 0 0 12px #f472b622',
        animation:'float 2.5s ease-in-out infinite',
      }}>
        <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}`}</style>
        {/* Modern close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center rounded-full text-black text-3xl shadow-lg hover:scale-110 transition-all duration-200 z-10 border-none"
          aria-label="Close modal"
          style={{boxShadow:'0 2px 12px 0 rgba(236,72,153,0.10)'}}>
          &times;
        </button>

        {/* Left: image or placeholder with glassy effect */}
        <div className="md:w-2/5 w-full p-8 flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 via-white to-purple-50 border-r border-pink-100 backdrop-blur-lg">
          {item.product_image ? (
            <div className="overflow-hidden rounded-2xl shadow-xl border-2 border-pink-200 bg-white/60 backdrop-blur-lg">
              <img
                src={`data:image/jpeg;base64,${item.product_image}`}
                alt={item.name ? item.name : "Food item image"}
                className="object-cover w-full h-[350px] md:h-[400px] transform transition-transform duration-300 ease-in-out hover:scale-105 rounded-2xl"
              />
            </div>
          ) : (
            <div className="w-full h-[350px] md:h-[400px] bg-gradient-to-r from-pink-100 via-blue-100 to-purple-100 flex items-center justify-center text-pink-400 text-xl font-medium rounded-2xl border-2 border-pink-200 shadow-lg backdrop-blur-lg">
              No Image
            </div>
          )}
        </div>

        {/* Right: details, quantity, add to cart */}
        <div className="md:w-3/5 w-full p-10 flex flex-col justify-between bg-white/80 backdrop-blur-lg">
          <div>
            <h2 className="text-4xl font-light text-black mb-2">{item.name}</h2>
            <div className="text-sm text-gray-700 mt-3 mb-4 flex flex-wrap gap-2 items-center">
              {item.vegan && (
                <span className="inline-block bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-semibold select-none shadow">
                  <i className="fa fa-leaf text-green-500 mr-1" aria-hidden="true"></i>Vegan
                </span>
              )}
              {item.rating && (
                <span className="inline-block bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold select-none shadow">
                  <i className="fa fa-star text-yellow-400 mr-1" aria-hidden="true"></i>{item.rating}
                </span>
              )}
              {(item.isOffer === true || item.isOffer === 1 || item.isOffer === "1") && (
                <span className="inline-block bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-semibold select-none shadow">
                  <i className="fa fa-fire text-red-500 mr-1" aria-hidden="true"></i>Special Offer
                </span>
              )}
            </div>
            <p className="text-gray-700 leading-relaxed text-base mt-2 mb-4">{item.description}</p>
            <p className="mt-6 text-pink-600 font-light text-2xl">
              <span className="font-semibold">Total Price:</span> ₹{updateTotalPrice(item.price, quantity)}
            </p>
            <div className="mt-3 flex items-center gap-3">
              <label htmlFor="quantity" className="font-medium text-lg text-gray-700 select-none">
                Quantity:
              </label>
              <input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => { const val = parseInt(e.target.value); if (val > 0) setQuantity(val); }}
                className="w-20 h-10 border-2 border-pink-200 rounded-xl px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition-shadow bg-white/80 backdrop-blur-lg shadow"
              />
            </div>
            <button
              onClick={addToCart}
              className="bg-gradient-to-r from-pink-500 to-purple-500 mt-6 hover:from-purple-500 hover:to-pink-500 text-white py-3 px-8 rounded-xl transition-all duration-300 text-lg shadow-lg shadow-pink-400/40 transform hover:scale-105 font-semibold"
            >
              Add to Cart | ₹{updateTotalPrice(item.price, quantity)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemDetails;
