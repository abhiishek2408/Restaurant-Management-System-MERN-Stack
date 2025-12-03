import React, { useState, useEffect } from "react";

const Contact = () => {
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const skeletonClass = "animate-pulse bg-gray-200 rounded-lg";

  return (
    <section id="contact" className="py-20 relative overflow-hidden">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 pointer-events-none select-none opacity-30" aria-hidden="true" style={{zIndex:0}}>
        <svg width="100%" height="100%" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bg-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f9a8d4" />
              <stop offset="100%" stopColor="#fde68a" />
            </linearGradient>
          </defs>
          <circle cx="20%" cy="20%" r="120" fill="url(#bg-grad)" />
          <circle cx="80%" cy="80%" r="100" fill="url(#bg-grad)" />
        </svg>
      </div>
      <div className="container mx-auto px-4 text-center relative z-10">
        {/* Heading */}
        {loading ? (
          <div className={`${skeletonClass} h-10 w-48 mx-auto mb-6`}></div>
        ) : (
          <h2 className="text-3xl font-extrabold mb-4 mt-0 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-fuchsia-500 to-yellow-400 tracking-tight relative inline-block" style={{ fontFamily: 'Lato, sans-serif' }}>
            Visit Us
            <span className="block mt-2 w-20 h-1 rounded-full bg-gradient-to-r from-pink-400 via-fuchsia-400 to-yellow-300 opacity-80 mx-auto animate-pulse"></span>
            <span className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-pink-400 via-fuchsia-400 to-yellow-300 rounded-full blur-sm opacity-60 animate-pulse"></span>
          </h2>
        )}

        {/* Subtitle */}
        {loading ? (
          <div className={`${skeletonClass} h-6 w-2/3 mx-auto mb-8`}></div>
        ) : (
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            We'd love to see you! Find us at the address below or give us a call to book a table. Our team is always ready to welcome you with a smile.
          </p>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Location */}
          {loading ? (
            <div className={`${skeletonClass} h-40`}></div>
          ) : (
            <div className="bg-white/90 p-8 rounded-2xl shadow-lg hover:shadow-pink-200/80 hover:-translate-y-1 transition-all duration-300 border border-pink-100 flex flex-col items-center group">
              <div className="mb-3 text-3xl text-pink-400 group-hover:scale-110 transition-transform duration-300">
                <i className="fa fa-map-marker-alt"></i>
              </div>
              <h3 className="text-xl font-semibold text-pink-500 mb-2">Location</h3>
              <p className="text-gray-700">15 Connaught Place, New Delhi, India</p>
            </div>
          )}

          {/* Hours */}
          {loading ? (
            <div className={`${skeletonClass} h-40`}></div>
          ) : (
            <div className="bg-white/90 p-8 rounded-2xl shadow-lg hover:shadow-yellow-200/80 hover:-translate-y-1 transition-all duration-300 border border-pink-100 flex flex-col items-center group">
              <div className="mb-3 text-3xl text-yellow-400 group-hover:scale-110 transition-transform duration-300">
                <i className="fa fa-clock"></i>
              </div>
              <h3 className="text-xl font-semibold text-pink-500 mb-2">Hours</h3>
              <p className="text-gray-700">Mon-Fri: 11:00 AM - 10:00 PM</p>
              <p className="text-gray-700">Sat-Sun: 10:00 AM - 11:00 PM</p>
            </div>
          )}

          {/* Contact */}
          {loading ? (
            <div className={`${skeletonClass} h-40`}></div>
          ) : (
            <div className="bg-white/90 p-8 rounded-2xl shadow-lg hover:shadow-fuchsia-200/80 hover:-translate-y-1 transition-all duration-300 border border-pink-100 flex flex-col items-center group">
              <div className="mb-3 text-3xl text-fuchsia-500 group-hover:scale-110 transition-transform duration-300">
                <i className="fa fa-phone"></i>
              </div>
              <h3 className="text-xl font-semibold text-pink-500 mb-2">Contact</h3>
              <p className="text-gray-700"><span className="font-semibold">Phone:</span> +91 98765 43210</p>
              <p className="text-gray-700"><span className="font-semibold">Email:</span> info@spicebistro.in</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Contact;
