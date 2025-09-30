

import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import UserDashboard from "./user/UserDashboard";
import Home from "./user/Home";
import MenuPage from "./user/MenuPage";
import UserProfile from "./user/UserProfile";
import Cart from "./user/Cart";
import BookTable from "./user/BookTable";
import BookEvent from "./user/BookEvent";
import CategoryMenu from "./user/CategoryMenu";
import OrderHistory from "./user/OrderHistory";
import ContactForm from "./user/ContactForm";
import About from "./user/About";

import VerifyOtp from "./auth-pages/VerifyOtp";

// import TimingsModal from "./user/TimingsModal";

import AdminDashboard from "./admin/AdminDashboard";
import MenuManagement from "./admin/ManageMenu";
import ManageOrder from "./admin/ManageOrder";
import UpdateOffers from "./admin/UpdateOffers";
import ManageUsers from "./admin/ManageUsers";
import AdminProfile from "./admin/AdminProfile";
import BarcodeScannerInvoice from "./admin/BarcodeScannerInvoice";
import Login from "./auth-pages/Login";
import Signup from "./auth-pages/Register";
import { UserProvider } from "./context/UseContext";
import { LocationProvider } from "./context/LocationContext";
import MyReservation from "./user/MyReservation";
import MyEventReservation from "./user/MyEventReservation";

import HomeAdmin from "./admin/HomeAdmin";

function App() {
  return (
      <LocationProvider>
   <UserProvider>
      <Router>
        <div className="App">
          <Routes>
       
            <Route path="/" element={<Navigate to="/user" replace />} />

            {/* User nested routes */}
            <Route path="/user" element={<UserDashboard />}>
              <Route index element={<Home />} />
              <Route path="menu/:category" element={<MenuPage />} />
              <Route path="about" element={<About />} />
             
              <Route path="booktable" element={<BookTable />} />
              <Route path="bookevent" element={<BookEvent />} />
              <Route path="cart" element={<Cart />} />
              <Route path="categorymenu" element={<CategoryMenu />} />        
              <Route path="userprofile" element={<UserProfile />} />        
              <Route path="orderhistory" element={<OrderHistory />} />
              <Route path="contactform" element={<ContactForm />} />
              <Route path="reservations" element={<MyReservation />} />
              <Route path="event-reservations" element={<MyEventReservation />} />
            </Route>

            {/* Admin nested routes */}
            <Route path="/admin" element={<AdminDashboard />}>
              <Route index element={<HomeAdmin />} />
              <Route path="manage-order" element={<ManageOrder />} />
              <Route path="admin-profile" element={<AdminProfile />} />
              <Route path="manage-offers" element={<UpdateOffers />} />
              <Route path="manage-users" element={<ManageUsers />} />
              <Route path="manage-menu" element={<MenuManagement />} />
              <Route path="barcode" element={<BarcodeScannerInvoice />} />
              <Route path="settings" element={<div>Settings Page</div>} />
              <Route path="reports" element={<div>Reports Page</div>} />
            </Route>

            {/* Auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify/:id" element={<VerifyOtp />} />
            
          </Routes>
        </div>
      </Router>
      </UserProvider>
      </LocationProvider>
   
  );
}

export default App;
