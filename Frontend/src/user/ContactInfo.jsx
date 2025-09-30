import React, { useState, useEffect } from "react";

const Contact = () => {
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const skeletonClass = "animate-pulse bg-gray-200 rounded-lg";

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4 text-center">
        {/* Heading */}
        {loading ? (
          <div className={`${skeletonClass} h-10 w-48 mx-auto mb-6`}></div>
        ) : (
          <h2
            className="text-2xl font-semibold mb-4 text-gray-800"
            style={{ fontFamily: "Lato, sans-serif" }}
          >
            Visit Us
          </h2>
        )}

        {/* Subtitle */}
        {loading ? (
          <div className={`${skeletonClass} h-6 w-2/3 mx-auto mb-8`}></div>
        ) : (
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
            We'd love to see you! Find us at the address below or give us a call to book a table.
          </p>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Location */}
          {loading ? (
            <div className={`${skeletonClass} h-40`}></div>
          ) : (
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 border border-gray-100">
              <h3 className="text-xl font-semibold text-pink-500 mb-2">Location</h3>
              <p className="text-gray-700">15 Connaught Place, New Delhi, India</p>
            </div>
          )}

          {/* Hours */}
          {loading ? (
            <div className={`${skeletonClass} h-40`}></div>
          ) : (
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 border border-gray-100">
              <h3 className="text-xl font-semibold text-pink-500 mb-2">Hours</h3>
              <p className="text-gray-700">Mon-Fri: 11:00 AM - 10:00 PM</p>
              <p className="text-gray-700">Sat-Sun: 10:00 AM - 11:00 PM</p>
            </div>
          )}

          {/* Contact */}
          {loading ? (
            <div className={`${skeletonClass} h-40`}></div>
          ) : (
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 border border-gray-100">
              <h3 className="text-xl font-semibold text-pink-500 mb-2">Contact</h3>
              <p className="text-gray-700">Phone: +91 98765 43210</p>
              <p className="text-gray-700">Email: info@spicebistro.in</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Contact;
