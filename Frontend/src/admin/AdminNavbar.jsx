import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react"; // icon library

const AdminNavbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest("#logindropdown") && !event.target.closest("#loginButton")) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost/onlinerestro/backend/logout.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (data.success) {
        localStorage.removeItem("user");
        navigate("/login");
      } else {
        alert("Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("An error occurred while logging out.");
    }
  };

  const NavLinks = () => (
    <>
      <Link to="/admin" className="px-3 py-2 hover:bg-gray-100 rounded">Home</Link>
      <Link to="/admin/manage-order" className="px-3 py-2 hover:bg-gray-100 rounded">Orders</Link>
      <Link to="/admin/manage-offers" className="px-3 py-2 hover:bg-gray-100 rounded">Offers</Link>
      <Link to="/admin/manage-users" className="px-3 py-2 hover:bg-gray-100 rounded">Users</Link>
      <Link to="/admin/manage-menu" className="px-3 py-2 hover:bg-gray-100 rounded">Menu</Link>

      {/* Profile Dropdown */}
      <div className="relative" id="loginButton">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="px-3 py-2 hover:bg-gray-100 rounded flex items-center gap-1"
        >
          Admin ▼
        </button>
        {isDropdownOpen && (
          <ul
            id="logindropdown"
            className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg"
          >
            <li>
              <Link to="barcode" className="block px-4 py-2 hover:bg-gray-100">Invoice</Link>
            </li>
            <li>
              <Link to="settings" className="block px-4 py-2 hover:bg-gray-100">Settings</Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Logout
              </button>
            </li>
          </ul>
        )}
      </div>
    </>
  );

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <h1 className="text-xl font-bold">
            Bistro<span className="text-pink-500">fy</span>
          </h1>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLinks />
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded hover:bg-gray-100"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg px-4 py-3 space-y-2">
          <NavLinks />
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;
