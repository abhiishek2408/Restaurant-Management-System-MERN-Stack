import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter, FaMapMarkerAlt } from "react-icons/fa";

export default function Footer({ setShowModal, setShowTimeModal }) {
  return (
    <footer className="bg-gray-900 text-gray-200 pt-10 border-t border-gray-700">
      <div className="container mx-auto px-4 md:px-8 flex flex-wrap justify-between text-left">
        {/* Contact Section */}
        <div className="w-full sm:w-1/2 lg:w-1/4 mb-8">
          <h3 className="text-lg font-bold mb-3">Contact Us</h3>
          <p className="text-sm text-gray-400 mb-1">123 Kashi Vishwanath Road, Varanasi, Uttar Pradesh, 221001</p>
          <p className="text-sm text-gray-400 mb-1">Phone: +91 98765 43210</p>
          <p className="text-sm text-gray-400">Email: info@yourbistrofy.com</p>
        </div>

        {/* Quick Links Section */}
        <div className="w-full sm:w-1/2 lg:w-1/4 mb-8">
          <h3 className="text-lg font-bold mb-3">Quick Links</h3>
          <ul className="list-none p-0 m-0">
            <li><Link onClick={() => setShowModal(true)} className="text-sm text-gray-400 hover:text-pink-500 transition-colors duration-200">AIChat</Link></li>
            <li><Link onClick={() => setShowTimeModal(true)} className="text-sm text-gray-400 hover:text-pink-500 transition-colors duration-200">Timings</Link></li>
            <li><Link to="about" className="text-sm text-gray-400 hover:text-pink-500 transition-colors duration-200">Privacy</Link></li>
            <li><Link to="about" className="text-sm text-gray-400 hover:text-pink-500 transition-colors duration-200">Terms</Link></li>
          </ul>
        </div>

        {/* Follow Us Section */}
        <div className="w-full sm:w-1/2 lg:w-1/4 mb-8">
          <h3 className="text-lg font-bold mb-3">Follow Us</h3>
          <div className="flex gap-3 mt-2">
            <a href="https://facebook.com" className="text-pink-500 hover:text-pink-400 transition-colors duration-200"><FaFacebookF size={20} /></a>
            <a href="https://instagram.com" className="text-pink-500 hover:text-pink-400 transition-colors duration-200"><FaInstagram size={20} /></a>
            <a href="https://twitter.com" className="text-pink-500 hover:text-pink-400 transition-colors duration-200"><FaTwitter size={20} /></a>
            <a href="https://maps.google.com" className="text-pink-500 hover:text-pink-400 transition-colors duration-200"><FaMapMarkerAlt size={20} /></a>
          </div>
        </div>
      </div>
      
      {/* Footer Bottom */}
      <div className="text-center py-4 border-t border-gray-700">
        <p className="text-xs text-gray-400">© 2024 Bistrofy. All rights reserved.</p>
      </div>
    </footer>
  );
}