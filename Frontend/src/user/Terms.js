import React from "react";

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-100 px-4 pt-2 pb-4">
      <div className="max-w-2xl w-full bg-white/80 rounded-2xl shadow-xl p-8 border border-gray-200">
        <h1 className="text-3xl font-extrabold text-yellow-500 mb-4 text-center">Terms & Conditions</h1>
        <p className="text-gray-700 text-lg mb-6 text-center">Please read our terms and conditions carefully before using our services.</p>
        <ul className="list-disc pl-6 text-gray-600 text-base mb-4">
          <li>Use our services responsibly and ethically.</li>
          <li>Respect other users and staff.</li>
          <li>Any misuse may result in account suspension.</li>
        </ul>
        <div className="text-center mt-6">
          <span className="inline-block bg-yellow-100 text-yellow-600 px-4 py-2 rounded-full font-bold">Contact us for more info</span>
        </div>
      </div>
    </div>
  );
}
