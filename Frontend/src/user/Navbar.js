import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import UserContext from "../context/UseContext";
import LocationContext from "../context/LocationContext";
import Sidebar from "./Sidebar";
import { FaChevronDown, FaBars, FaTimes } from "react-icons/fa";
import { GiShoppingCart } from "react-icons/gi";

// Add Google Fonts for curly logo
const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Pacifico&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);

// Helper components and data can be moved to a separate file for better organization
const navLinks = [
  { name: "Home", path: "/user" },
  { name: "Menu", path: "/user/categorymenu" },
];

const dropdownLinks = [
  { name: "Book Event", path: "/user/bookevent" },
  { name: "Book Table", path: "/user/booktable" },
  { name: "Contact Us", path: "/user/contactform" },
];

const profileLinks = [
  { name: "View Profile", path: "/user/userprofile" },
  { name: "About", path: "/user/about" },

];

const Navbar = () => {
  const routerLocation = useLocation();
  const navigate = useNavigate();
  const { cartLength } = useContext(UserContext);
  const { displayLocation } = useContext(LocationContext);

  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const categoriesRef = useRef(null);
  const profileRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
    setIsProfileOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target)) {
        setIsCategoriesOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getNavLinkClasses = (path) =>
    `text-base font-light tracking-widest text-gray-600 cursor-pointer transition-all duration-200 
    ${
      routerLocation.pathname === path || routerLocation.pathname.startsWith(path)
        ? "font-light text-grey-600"
        : "text-gray-600 hover:text-pink-500"
    }`;

  const Dropdown = ({ children, isOpen, containerRef, closeDropdown, origin = 'right', type }) => {
    if (!isOpen) return null;
    // Profile and Categories dropdown get special styling
    const isProfile = type === 'profile';
    const isCategories = type === 'categories';
    return (
      <div
        ref={containerRef}
        className={`absolute ${origin === 'right' ? 'right-0' : 'left-0'} mt-2 min-w-[200px] ${isProfile || isCategories ? 'bg-gradient-to-br from-pink-100 via-white to-yellow-100 border-2 border-gray-300 shadow-2xl' : 'bg-gradient-to-br from-pink-50 via-white to-pink-100 border-2 border-gray-300 shadow-2xl'} rounded-2xl py-4 flex flex-col gap-2 z-50 transform origin-top transition-transform duration-200 scale-100 opacity-100 backdrop-blur-md`}
        style={{ boxShadow: isProfile || isCategories ? '0 12px 36px 0 rgba(236, 72, 153, 0.22)' : '0 8px 32px 0 rgba(236, 72, 153, 0.18)' }}
      >
        {React.Children.map(children, (child, idx) =>
          React.cloneElement(child, {
            onClick: () => {
              if (child.props.onClick) child.props.onClick();
              closeDropdown();
            },
            className:
              (isProfile || isCategories
                ? 'px-6 py-3 text-gray-600 font-normal rounded-xl bg-white/70 hover:text-gray-900 shadow-sm transition-all duration-200 cursor-pointer border-b border-gray-200 last:border-b-0 text-center flex justify-center items-center'
                : 'px-5 py-2 text-grey-700 font-semibold rounded-xl hover:bg-pink-100 hover:text-pink-900 transition-all duration-150 cursor-pointer')
              + (idx === 0 ? ' mt-0' : '')
          })
        )}
      </div>
    );
  };

  return (
    <>
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white border-b border-pink-200 px-4 sm:px-10 py-5 flex items-center justify-between font-sans shadow-md">
        {/* Curly Logo */}
          <h1
            className="text-2xl font-extrabold select-none drop-shadow-lg flex items-center bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-fuchsia-500 to-yellow-400 pb-1"
            style={{ fontFamily: 'Pacifico, cursive', letterSpacing: '2px', lineHeight: '1.5' }}
          >
            Bistro<span className="ml-0">fy</span>
          </h1>
        {/* Location Button - hide on small screens */}
        <button
          type="button"
          onClick={() => setIsSidebarOpen(true)}
          className="hidden sm:flex items-center gap-2 max-w-[320px] min-w-[220px] px-6 py-2 rounded-full bg-white border-2 border-pink-200 shadow-lg hover:bg-gray-100 hover:scale-105 transition-all duration-200 cursor-pointer select-none"
          style={{ boxShadow: '0 4px 24px 0 rgba(236, 72, 153, 0.10)' }}
          title={displayLocation}
        >
          <span className="relative flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-grey-500 animate-pulse" viewBox="0 0 20 20" fill="currentColor">
              <defs>
                <radialGradient id="locBtnGradient" cx="50%" cy="50%" r="80%">
                  <stop offset="0%" stopColor="#f9a8d4" />
                  <stop offset="100%" stopColor="#ec4899" />
                </radialGradient>
              </defs>
              <circle cx="10" cy="10" r="9" fill="url(#locBtnGradient)" opacity="0.18" />
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 10 100-4 2 2 0 000 4z" clipRule="evenodd" fill="#ec4899" />
            </svg>
          </span>
          <span className="ml-2 text-base font-semibold text-grey-700 drop-shadow-sm whitespace-nowrap">
            {displayLocation || "Detecting location..."}
          </span>
        </button>

        {/* Desktop Menu */}
        <ul className="hidden sm:flex gap-8 items-center font-medium text-gray-800">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link to={link.path} className={getNavLinkClasses(link.path) + ' hover:scale-110 hover:bg-pink-50 hover:text-pink-600 rounded-lg px-2 py-1 transition-transform'}>
                {link.name}
              </Link>
            </li>
          ))}

          {/* Categories dropdown */}
          <li className="relative" ref={categoriesRef}>
            <button
              onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
              className={`text-base font-semibold cursor-pointer flex items-center gap-2 bg-gradient-to-r from-pink-100 to-pink-200 px-3 py-1 rounded-lg shadow-sm border border-pink-200 transition-all duration-200 ${
                isCategoriesOpen ? "text-grey-600 scale-105" : "text-gray-600 hover:text-pink-500 hover:scale-105"
              }`}
            >
              Categories <FaChevronDown className={`h-5 w-5 transition-transform duration-200 ${isCategoriesOpen ? 'rotate-180' : ''}`} />
            </button>
            <Dropdown isOpen={isCategoriesOpen} containerRef={categoriesRef} closeDropdown={() => setIsCategoriesOpen(false)} type="categories">
              {dropdownLinks.map((link) => (
                <Link key={link.name} to={link.path}>
                  {link.name}
                </Link>
              ))}
            </Dropdown>
          </li>

          {/* Login/Cart/Profile */}
          {!user ? (
            <li className="relative">
              <Link to="/login" className="px-5 py-2 text-base font-bold text-gray-600 bg-gradient-to-r from-pink-100 to-rose-100 rounded-full shadow-md hover:from-rose-200 hover:to-pink-200 hover:text-pink-600 hover:scale-105 transition-all duration-200">
                Login
              </Link>
            </li>
          ) : (
            <>
              <li>
                <Link to="/user/cart" className="relative text-3xl hover:scale-125 transition-transform duration-200">
                  <GiShoppingCart className="h-8 w-8" style={{ filter: 'drop-shadow(0 2px 6px #f472b6)' }} />
                  {cartLength > 0 && (
                    <span className="absolute -top-2 -right-2 bg-white text-grey-600 text-xs font-bold px-2 rounded-full border-2 border-pink-400 animate-bounce shadow-md" style={{ minWidth: 20, textAlign: 'center' }}>
                      {cartLength}
                    </span>
                  )}
                </Link>
              </li>
              <li className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 cursor-pointer select-none"
                >
                  <img
                    src="https://cdn.vectorstock.com/i/500p/96/75/gray-scale-male-character-profile-picture-vector-51589675.jpg"
                    alt="User Profile"
                    width={44}
                    height={44}
                    className="rounded-full border-2 border-pink-200 hover:border-rose-400 transition-all duration-200"
                  />
                  <FaChevronDown className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>
                <Dropdown isOpen={isProfileOpen} containerRef={profileRef} closeDropdown={() => setIsProfileOpen(false)} type="profile">
                  {profileLinks.map((link) => (
                    <Link key={link.name} to={link.path}>
                      {link.name}
                    </Link>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="text-left w-full px-6 py-3 text-rose-600 font-semibold rounded-xl bg-white/70 hover:bg-gradient-to-r hover:from-pink-200 hover:to-yellow-100 hover:text-rose-700 shadow-sm transition-all duration-200 cursor-pointer border-b border-pink-100 last:border-b-0"
                  >
                    Logout
                  </button>
                </Dropdown>
              </li>
            </>
          )}
        </ul>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="sm:hidden p-2 text-gray-800 rounded-full bg-white/80 border border-gray-300 hover:bg-pink-100 transition-all duration-200"
        >
          {isMobileMenuOpen ? <FaTimes className="h-7 w-7" /> : <FaBars className="h-7 w-7" />}
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="sm:hidden absolute right-4 top-[72px] bg-white/80 backdrop-blur-lg rounded-xl border border-pink-200 py-4 flex flex-col gap-2 z-50 w-56"
        >
          {[...navLinks, ...dropdownLinks].map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-5 py-2 text-gray-800 font-semibold rounded-lg hover:bg-pink-50 transition-all duration-200"
            >
              {link.name}
            </Link>
          ))}
          {user ? (
            <>
              {profileLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-5 py-2 text-gray-800 font-semibold rounded-lg hover:bg-pink-50 transition-all duration-200"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/user/cart"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-5 py-2 text-gray-800 font-semibold rounded-lg hover:bg-pink-50 transition-all duration-200"
              >
                Cart ({cartLength})
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="text-left w-full px-5 py-2 text-rose-600 font-semibold hover:bg-pink-50 cursor-pointer rounded-lg transition-all duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-5 py-2 text-gray-800 font-semibold rounded-lg hover:bg-pink-50 transition-all duration-200"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-5 py-2 text-gray-800 font-semibold rounded-lg hover:bg-pink-50 transition-all duration-200"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}

      {isSidebarOpen && <Sidebar closeSidebar={() => setIsSidebarOpen(false)} />}
    </>
  );
};

export default Navbar;