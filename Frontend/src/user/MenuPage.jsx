import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ItemDetails from "./ItemDetails";

const SkeletonCard = () => (
  <div className="bg-gray-200 animate-pulse rounded-lg border h-72"></div>
);


const MenuPage = () => {
  // Remove user and navigate, not needed for ItemDetails modal
  const { category } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

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
    setSelectedItem(item);
  };



  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-3xl font-extrabold mb-8 capitalize text-left text-gray-800 tracking-wide drop-shadow-sm">
        {category} Menu
      </h1>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <SkeletonCard key={i} />
            ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
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
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col cursor-pointer border border-gray-300"
                onClick={() => openModal(item)}
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
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 flex justify-between">
                    {item.name}
                    <span className="flex gap-2">
                      {isNew && (
                        <span className="bg-green-100 text-green-700 text-xs px-2 h-6 rounded inline-flex items-center justify-center min-w-[2.5rem]">New</span>
                      )}
                      {isSpecialOffer && (
                        <span className="bg-red-100 text-red-700 text-xs px-2 h-6 rounded inline-flex items-center justify-center min-w-[2.5rem]">Offer</span>
                      )}
                    </span>
                  </h3>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">{item.description}</p>
                  <div className="mt-2 text-sm text-gray-500 flex flex-wrap gap-3 items-center">
                    {item.vegan && (
                      <span><i className="fa fa-leaf text-green-500 mr-1" aria-hidden="true"></i>Vegan</span>
                    )}
                    {item.rating && (
                      <span><i className="fa fa-star text-yellow-400 mr-1" aria-hidden="true"></i>{item.rating}</span>
                    )}
                    <span className="text-pink-600 font-semibold text-base ml-auto">₹{item.price}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ItemDetails Modal */}
      {selectedItem && (
        <ItemDetails
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
};

export default MenuPage;
