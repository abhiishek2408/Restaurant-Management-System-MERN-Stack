import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // ✅ Use our AuthContext

const Login = () => {
  const { login, error: authError } = useContext(AuthContext); // get login function
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError({});
    setSuccessMessage("");

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        setSuccessMessage(result.message || "Login successful!");

        // ✅ Navigate based on user role (if your backend sends role)
        if (result.user?.role === "admin") {
          navigate("/admin", { state: { user: result.user } });
        } else {
          navigate("/", { state: { user: result.user } });
        }
      } else {
        setError({ apiError: result.error || "Invalid email or password." });
      }
    } catch (err) {
      setError({ apiError: "An error occurred during login: " + err.message });
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-row bg-gradient-to-r from-pink-50 to-pink-100">
      {/* Left Panel */}
      <div className="flex-1 flex items-center justify-center relative rounded-tr-[40px] rounded-br-[40px] overflow-hidden">
        <img src="/image/sushi-japanese-food-wooden-board-realistic-3d-product-showcase-food-photography_111797-1961.avif" alt="Food" className="absolute inset-0 w-full h-full object-cover z-0" />
        <div className="absolute inset-0 z-0 rounded-tr-[40px] rounded-br-[40px] bg-gradient-to-br from-black/70 via-black/40 to-pink-900/10" />
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full bg-pink-400/20 blur-3xl opacity-60" />
        </div>
        <div className="relative z-10 flex flex-col items-start justify-center px-12 py-16 w-full max-w-xl">
          <h1 className="text-white text-6xl md:text-7xl font-extrabold mb-4 drop-shadow-xl tracking-tight">Welcome to Bistrofy</h1>
          <p className="text-white text-2xl md:text-3xl font-medium mb-8 drop-shadow">Your gateway to delicious culinary experiences.</p>
          <div className="flex gap-4 mb-8 text-5xl animate-fadeIn">
            <span>🍲</span>
            <span>🍕</span>
            <span>🍹</span>
            <span>🍜</span>
          </div>
          <Link to="/" className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-lg px-7 py-3 rounded-xl shadow-xl hover:from-rose-500 hover:to-pink-500 transition-all duration-200 ring-2 ring-pink-300/40 hover:ring-rose-400/60 ml-8">
            <span>Explore Our Menu</span>
            <span className="text-xl">🍽️</span>
          </Link>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 flex flex-col items-center justify-center border border-pink-100">
          <h2 className="text-4xl font-extrabold text-pink-600 mb-2 text-center tracking-tight">Log In</h2>
          <p className="text-gray-700 text-center mb-6 text-lg">Access your account to reserve, order, and explore more.</p>
          <form onSubmit={handleLogin} className="w-full flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-pink-600 font-semibold text-base">Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="border border-pink-300 rounded-lg px-4 py-2 focus:outline-none focus:border-rose-400 text-base bg-white/90 shadow-sm focus:ring-2 focus:ring-pink-200 transition-all"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-pink-600 font-semibold text-base">Password:</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="border border-pink-300 rounded-lg px-4 py-2 focus:outline-none focus:border-rose-400 text-base bg-white/90 shadow-sm focus:ring-2 focus:ring-pink-200 transition-all"
              />
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold py-3 rounded-xl shadow-xl hover:from-rose-500 hover:to-pink-500 transition-all duration-200 text-lg ring-2 ring-pink-300/40 hover:ring-rose-400/60">Login</button>
          </form>
          {error.apiError && <div className="w-full mt-4 bg-red-100 text-red-700 px-4 py-2 rounded-lg text-center text-sm font-semibold shadow">{error.apiError}</div>}
          {authError && <div className="w-full mt-4 bg-red-100 text-red-700 px-4 py-2 rounded-lg text-center text-sm font-semibold shadow">{authError}</div>}
          {successMessage && <div className="w-full mt-4 bg-green-100 text-green-700 px-4 py-2 rounded-lg text-center text-sm font-semibold shadow">{successMessage}</div>}
          <p className="w-full text-center mt-6 text-gray-700 text-base">Don't have an account? <Link to="/signup" className="text-pink-600 font-bold hover:underline">Sign up here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
