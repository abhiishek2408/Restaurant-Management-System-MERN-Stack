import React from "react";
import { X } from "lucide-react";

const MenuModal = ({ data, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-75">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white p-8 rounded-3xl shadow-2xl animate-fade-in-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-pink-600 transition-colors duration-200"
        >
          <X size={28} />
        </button>

        <h2 className="text-4xl font-extrabold text-pink-600 text-center mb-8">
          Our Menu
        </h2>

        {/* Appetizers */}
        <div className="mb-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-pink-200">
            Appetizers
          </h3>
          {data.appetizers.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-start mb-4"
            >
              <div>
                <h4 className="text-xl font-semibold">{item.name}</h4>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
              <span className="font-bold text-pink-600 ml-4">{item.price}</span>
            </div>
          ))}
        </div>

        {/* Mains */}
        <div className="mb-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-pink-200">
            Main Courses
          </h3>
          {data.mains.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-start mb-4"
            >
              <div>
                <h4 className="text-xl font-semibold">{item.name}</h4>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
              <span className="font-bold text-pink-600 ml-4">{item.price}</span>
            </div>
          ))}
        </div>

        {/* Desserts */}
        <div>
          <h3 className="text-3xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-pink-200">
            Desserts
          </h3>
          {data.desserts.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-start mb-4"
            >
              <div>
                <h4 className="text-xl font-semibold">{item.name}</h4>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
              <span className="font-bold text-pink-600 ml-4">{item.price}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuModal;
