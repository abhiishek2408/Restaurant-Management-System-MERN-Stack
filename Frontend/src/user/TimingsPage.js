import React from "react";

export default function TimingsPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-yellow-50 px-4 pt-2 pb-4">
      <div className="max-w-2xl w-full bg-white/80 rounded-2xl shadow-xl p-8 border border-gray-200">
        <h1 className="text-3xl font-extrabold text-pink-500 mb-4 text-center">Restaurant Timings</h1>
        <p className="text-gray-700 text-lg mb-6 text-center">We are open every day to serve you delicious food!</p>
        <ul className="list-disc pl-6 text-gray-600 text-base mb-4">
          <li>Monday - Friday: 10:00 AM - 10:00 PM</li>
          <li>Saturday - Sunday: 9:00 AM - 11:00 PM</li>
        </ul>
        <div className="text-center mt-6">
          <span className="inline-block bg-pink-100 text-pink-600 px-4 py-2 rounded-full font-bold">Contact us for special bookings</span>
        </div>
      </div>
    </div>
  );
}
