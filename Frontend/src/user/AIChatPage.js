import React from "react";

export default function AIChatPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 px-4 py-10">
      <div className="max-w-2xl w-full bg-white/80 rounded-2xl shadow-xl p-8 border border-gray-200">
        <h1 className="text-3xl font-extrabold text-purple-500 mb-4 text-center">AI Chat Assistant</h1>
        <p className="text-gray-700 text-lg mb-6 text-center">Welcome to your smart assistant! Ask anything about our restaurant, menu, or your orders.</p>
        <div className="flex flex-col gap-4 items-center mt-6">
          <input type="text" placeholder="Type your question..." className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" />
          <button className="bg-purple-500 text-white px-6 py-2 rounded-full font-bold hover:bg-purple-600 transition">Send</button>
        </div>
      </div>
    </div>
  );
}
