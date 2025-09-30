import React from "react";
import { X, Package } from "lucide-react";

const DeliveryModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-75">
      <div className="relative w-full max-w-lg max-h-[90vh] bg-white p-8 rounded-3xl shadow-2xl text-center animate-fade-in-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-pink-600 transition-colors duration-200"
        >
          <X size={28} />
        </button>

        <div className="flex items-center justify-center text-pink-600 mb-6">
          <Package size={64} />
        </div>

        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
          Delivery Service
        </h2>
        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
          We offer fast and reliable delivery directly to your door!  
          (This is just a demo — integrate a real ordering system here.)
        </p>
        <p className="text-base text-gray-500">
          Placeholder for your ordering portal
        </p>
      </div>
    </div>
  );
};

export default DeliveryModal;
