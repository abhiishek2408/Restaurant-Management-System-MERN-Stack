import React from "react";

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 via-yellow-50 to-purple-100 px-4 pt-2 pb-4">
      <div className="max-w-2xl w-full bg-white/80 rounded-2xl shadow-xl p-8 border border-gray-200">
        <h1 className="text-3xl font-extrabold text-pink-600 mb-4 text-center">Privacy Policy</h1>
        <p className="text-gray-700 text-lg mb-6 text-center">Your privacy is important to us. We ensure your data is protected and never shared with third parties.</p>
        <ul className="list-disc pl-6 text-gray-600 text-base mb-4">
          <li>We collect only necessary information for your experience.</li>
          <li>Your data is encrypted and securely stored.</li>
          <li>You can request data deletion anytime.</li>
        </ul>
        <div className="text-center mt-6">
          <span className="inline-block bg-pink-100 text-pink-600 px-4 py-2 rounded-full font-bold">Contact us for more info</span>
        </div>
      </div>
    </div>
  );
}
