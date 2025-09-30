import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

// Create Context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ---------------- REGISTER ----------------
  const register = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(
        "https://restaurant-management-system-mern-stack.onrender.com/api/auth/register",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setLoading(false);
      return res.data;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.error || "Registration failed");
      return { success: false };
    }
  };

  // ---------------- VERIFY OTP ----------------
  const verifyOtp = async (userId, otp) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(
        "https://restaurant-management-system-mern-stack.onrender.com/api/auth/verify",
        { userId, otp },
        { withCredentials: true }
      );
      setLoading(false);
      return res.data;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.error || "OTP verification failed");
      return { success: false };
    }
  };

  // ---------------- LOGIN ----------------
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(
        "https://restaurant-management-system-mern-stack.onrender.com/api/auth/login",
        { email, password },
        { withCredentials: true }
      );
      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("token", res.data.token);
        console.log("Token generated: ", res.data.token);
      }
      setLoading(false);
      return res.data;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.error || "Login failed");
      return { success: false };
    }
  };

  // ---------------- LOGOUT ----------------
  const logout = async () => {
    setLoading(true);
    try {
      await axios.post(
        "https://restaurant-management-system-mern-stack.onrender.com/api/auth/logout",
        {},
        { withCredentials: true }
      );
      setUser(null);
      localStorage.removeItem("user");
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.error || "Logout failed");
    }
  };

  // ---------------- FORGOT PASSWORD ----------------
  const forgotPassword = async (email) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(
        "https://restaurant-management-system-mern-stack.onrender.com/api/auth/forgot-password",
        { email },
        { withCredentials: true }
      );
      setLoading(false);
      return res.data;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.error || "Forgot password failed");
      return { success: false };
    }
  };

  // ---------------- AUTO LOAD USER ----------------
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        verifyOtp,
        login,
        logout,
        forgotPassword,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom Hook
export const useAuth = () => useContext(AuthContext);
