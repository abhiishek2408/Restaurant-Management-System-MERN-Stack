import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter, FaMapMarkerAlt } from "react-icons/fa";

export default function Footer({ setShowModal, setShowTimeModal }) {
  return (
    <footer className="bg-gray-900 text-gray-200 pt-10 pb-2 border-t border-gray-800 rounded-t-3xl shadow-2xl">
      <div className="container mx-auto px-4 md:px-8 flex flex-wrap justify-between text-left">
        {/* Contact Section */}
        <div className="w-full sm:w-1/2 lg:w-1/4 mb-8">
          <h3 className="text-xl font-extrabold mb-3 text-pink-400">Contact Us</h3>
          <p className="text-sm text-gray-300 mb-1 flex items-center"><FaMapMarkerAlt className="mr-2 text-pink-400" />123 Kashi Vishwanath Road, Varanasi, Uttar Pradesh, 221001</p>
          <p className="text-sm text-gray-300 mb-1">Phone: <span className="text-pink-400 font-semibold">+91 98765 43210</span></p>
          <p className="text-sm text-gray-300">Email: <span className="text-pink-400 font-semibold">info@yourbistrofy.com</span></p>
        </div>

        {/* Quick Links Section */}
        <div className="w-full sm:w-1/2 lg:w-1/4 mb-8">
          <h3 className="text-xl font-extrabold mb-3 text-yellow-400">Quick Links</h3>
          <ul className="list-none p-0 m-0 flex flex-col gap-2">
            <li><Link to="/user/timings" className="text-sm text-gray-300 hover:text-pink-400 font-semibold transition-colors duration-200">Timings</Link></li>
            <li><Link to="/user/privacy" className="text-sm text-gray-300 hover:text-pink-400 font-semibold transition-colors duration-200">Privacy</Link></li>
            <li><Link to="/user/terms" className="text-sm text-gray-300 hover:text-pink-400 font-semibold transition-colors duration-200">Terms</Link></li>
          </ul>
        </div>

        {/* Follow Us Section */}
        <div className="w-full sm:w-1/2 lg:w-1/4 mb-8">
          <h3 className="text-xl font-extrabold mb-3 text-purple-400">Follow Us</h3>
          <div className="flex gap-4 mt-2">
            <a href="https://facebook.com" className="bg-gray-800 rounded-full p-2 shadow hover:scale-110 transition-transform duration-200 border border-pink-900"><FaFacebookF size={28} style={{ color: '#1877F3' }} /></a>
            <a href="https://instagram.com" className="bg-gray-800 rounded-full p-2 shadow hover:scale-110 transition-transform duration-200 border border-pink-900"><FaInstagram size={28} style={{ color: '#E4405F' }} /></a>
            <a href="https://twitter.com" className="bg-gray-800 rounded-full p-2 shadow hover:scale-110 transition-transform duration-200 border border-pink-900"><FaTwitter size={28} style={{ color: '#1DA1F2' }} /></a>
            <a href="https://maps.google.com" className="bg-gray-800 rounded-full p-2 shadow hover:scale-110 transition-transform duration-200 border border-pink-900"><FaMapMarkerAlt size={28} style={{ color: '#EA4335' }} /></a>
          </div>
        </div>
      </div>
      {/* Footer Bottom */}
      <div className="text-center py-4 border-t border-gray-800 mt-4">
        <p className="text-xs text-gray-300">© 2024 <span className="text-pink-400 font-bold">Bistrofy</span>. All rights reserved.</p>
      </div>
    </footer>
  );
}