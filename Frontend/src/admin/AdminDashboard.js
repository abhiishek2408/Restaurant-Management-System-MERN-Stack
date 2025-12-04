import React from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

const AdminDashboard = () => {
  // Removed unused variable 'location' to fix ESLint warning
    // Removed unused variable 'user' to fix ESLint warning

  return (
    <div className="font-sans bg-white min-h-screen">
      <AdminNavbar />
      
      <main className="p-5 sm:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
