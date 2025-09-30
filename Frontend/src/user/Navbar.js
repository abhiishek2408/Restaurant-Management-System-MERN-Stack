import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import UserContext from "../context/UseContext";
import LocationContext from "../context/LocationContext";
import Sidebar from "./Sidebar";
import { FaChevronDown, FaBars, FaTimes, FaShoppingCart } from "react-icons/fa"; // Import icons from react-icons/fa

// Helper components and data can be moved to a separate file for better organization
const navLinks = [
  { name: "Home", path: "/user" },
  { name: "About", path: "/user/about" },
  { name: "Menu", path: "/user/categorymenu" },
];

const dropdownLinks = [
  { name: "Book Event", path: "/user/bookevent" },
  { name: "Book Table", path: "/user/booktable" },
  { name: "Contact Us", path: "/user/contactform" },
];

const profileLinks = [
  { name: "View Profile", path: "/user/userprofile" },
  { name: "Order History", path: "/user/orderhistory" },
  { name: "Reserved Table", path: "/user/reservations" },
  { name: "Reserved Event", path: "/user/event-reservations" },
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
    `text-base font-light tracking-widest text-gray-700 cursor-pointer transition-all duration-200 
    ${
      routerLocation.pathname === path || routerLocation.pathname.startsWith(path)
        ? "border-b-2 border-pink-500 font-light text-pink-500"
        : "text-gray-700 hover:text-pink-500"
    }`;

  const Dropdown = ({ children, isOpen, containerRef, closeDropdown, origin = 'right' }) => {
    if (!isOpen) return null;
    return (
      <div
        ref={containerRef}
        className={`absolute ${origin === 'right' ? 'right-0' : 'left-0'} mt-2 min-w-[160px] bg-white rounded-lg shadow-xl border border-gray-200 py-2 flex flex-col gap-1 z-50 transform origin-top transition-transform duration-200 scale-100 opacity-100`}
      >
        {React.Children.map(children, (child) =>
          React.cloneElement(child, {
            onClick: () => {
              if (child.props.onClick) child.props.onClick();
              closeDropdown();
            },
            className: 'px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors',
          })
        )}
      </div>
    );
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 sm:px-8 py-4 flex items-center justify-between font-sans">
        {/* Logo */}
    <h1 className="text-3xl font-light tracking-widest text-gray-700">
  Bistro<span className="text-rose-500">fy</span>
</h1>
        {/* Location Button - hide on small screens */}
        <button
          type="button"
          onClick={() => setIsSidebarOpen(true)}
          className="hidden sm:flex items-center gap-2 max-w-[180px] bg-pink-50 text-pink-700 text-sm font-medium px-3 py-1.5 rounded-full truncate cursor-pointer select-none ring-1 ring-pink-200 hover:bg-pink-100 transition-colors"
          title={displayLocation}
        >
          {/* Using a react-icons/fa component for location icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 10 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          {displayLocation || "Detecting location..."}
        </button>

        {/* Desktop Menu */}
        <ul className="hidden sm:flex gap-6 items-center font-light text-gray-700">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link to={link.path} className={getNavLinkClasses(link.path)}>
                {link.name}
              </Link>
            </li>
          ))}

          {/* Categories dropdown */}
          <li className="relative" ref={categoriesRef}>
            <button
              onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
              className={`text-base font-light text-gray-700 cursor-pointer flex items-center gap-1 bg-transparent transition-colors ${
                isCategoriesOpen ? "text-pink-500" : "text-gray-700 hover:text-pink-500"
              }`}
            >
              Categories <FaChevronDown className={`h-4 w-4 transition-transform duration-200 ${isCategoriesOpen ? 'transform rotate-180' : ''}`} />
            </button>
            <Dropdown isOpen={isCategoriesOpen} containerRef={categoriesRef} closeDropdown={() => setIsCategoriesOpen(false)}>
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
              <Link to="/login" className="px-4 py-2 text-base font-medium text-white bg-pink-500 rounded-full hover:bg-pink-600 transition-colors">
                Login
              </Link>
            </li>
          ) : (
            <>
              <li>
                <Link to="/user/cart" className="relative text-2xl text-gray-500 hover:text-pink-500 transition-colors">
                  <FaShoppingCart className="h-6 w-6" />
                  {cartLength > 0 && (
                    <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs font-bold px-1 rounded-full">
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
                    width={40}
                    height={40}
                    className="rounded-full border border-gray-300 hover:ring-2 hover:ring-pink-500 transition-all"
                  />
                  <FaChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isProfileOpen ? 'transform rotate-180' : ''}`} />
                </button>
                <Dropdown isOpen={isProfileOpen} containerRef={profileRef} closeDropdown={() => setIsProfileOpen(false)}>
                  {profileLinks.map((link) => (
                    <Link key={link.name} to={link.path}>
                      {link.name}
                    </Link>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="text-left w-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
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
          className="sm:hidden p-2 text-gray-800 rounded-md hover:bg-gray-100 transition-colors"
        >
          {isMobileMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="sm:hidden absolute right-4 top-[72px] bg-white rounded-lg shadow-xl border border-gray-200 py-3 flex flex-col gap-2 z-50 w-48"
        >
          {[...navLinks, ...dropdownLinks].map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-2 text-gray-800 hover:bg-gray-100"
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
                  className="px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/user/cart"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Cart ({cartLength})
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="text-left w-full px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-2 text-gray-800 hover:bg-gray-100"
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