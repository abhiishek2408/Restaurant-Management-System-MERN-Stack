import React, { useEffect, useState, useContext } from "react";
import ItemDetails from "./ItemDetails";
import LocationContext from "../context/LocationContext";

function ChefSpecialMenu() {


  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const { city, displayLocation } = useContext(LocationContext);

  useEffect(() => {
    if (city) fetchFoodItems(city);
  }, [city]);

  // Fetch food items
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
      `https://restaurant-management-system-mern-stack.onrender.com/api/food-items/chef_special?city=${encodeURIComponent(
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
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch food items");
        setFoodItems([]);
        setLoading(false);
      });
  };

  // Skeleton Loader
  const SkeletonCard = () => (
    <div className="animate-pulse bg-white rounded-lg shadow-md p-4 space-y-4">
      <div className="bg-gray-300 h-48 rounded-md"></div>
      <div className="h-6 bg-gray-300 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      <div className="h-5 bg-gray-300 rounded w-1/4"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-extrabold mb-4 mt-0 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-fuchsia-500 to-yellow-400 tracking-tight text-left">
        Chef's Special Menu
        <span className="block mt-2 w-20 h-1 rounded-full bg-gradient-to-r from-pink-400 via-fuchsia-400 to-yellow-300 opacity-80"></span>
      </h2>

      <h3 className="text-base font-normal mb-6 text-gray-500">
        Location:{" "}
        <span className="font-normal text-gray-400">{displayLocation}</span>
      </h3>

      {/* Loading skeleton */}
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

      {/* Display Food Items */}
      {!loading && !error && foodItems.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {foodItems.map((item) => {
            const isNew = item.is_new === true || item.is_new === 1 || item.is_new === "1";
            const isSpecialOffer = item.isOffer === true || item.isOffer === 1 || item.isOffer === "1";
            return (
              <div
                key={item._id}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col cursor-pointer border border-gray-300"
                onClick={() => setSelectedItem(item)}
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
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">New</span>
                      )}
                      {isSpecialOffer && (
                        <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded">Offer</span>
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

          {/* OPEN MODAL */}
          {selectedItem && (
            <ItemDetails
              item={selectedItem}
              onClose={() => setSelectedItem(null)}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default ChefSpecialMenu;
