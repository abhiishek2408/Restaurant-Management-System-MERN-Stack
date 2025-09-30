import React, { useState } from "react";
import { useLocation, Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

const AdminDashboard = () => {
  const location = useLocation();
  const [user] = useState(location.state?.user || JSON.parse(localStorage.getItem("user")));

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
