import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function UserDashboard() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex-grow bg-white w-full p-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
