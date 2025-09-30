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
    <div className="login-wrapper">
      <style>{`
        .login-wrapper {
          font-family: 'Segoe UI', sans-serif;
          display: flex;
          flex-direction: row;
          height: 100vh;
          background-color: #fff;
        }
        .left-panel {
          flex: 1;
          background-color: #ff99b5;
          color: white;
          padding: 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
        }
        .left-panel h1 {
          font-size: 36px;
          margin-bottom: 20px;
        }
        .left-panel p {
          font-size: 16px;
          margin-bottom: 20px;
        }
        .icons {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }
        .icon {
          font-size: 28px;
        }
        .btn {
          background-color: white;
          color: #ff99b5;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 6px;
          font-weight: bold;
          transition: all 0.3s ease;
        }
        .btn:hover {
          background-color: #ffe0ea;
        }
        .right-panel {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px;
        }
        .form-panel {
          width: 100%;
          max-width: 400px;
          background: #ffffff;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        }
        .form-content h2 {
          text-align: center;
          color: #ff99b5;
          margin-bottom: 8px;
          font-size: 22px;
        }
        .form-content p {
          text-align: center;
          margin-bottom: 20px;
          color: #444;
          font-size: 14px;
        }
        .input-group {
          margin-bottom: 15px;
        }
        .input-group label {
          display: block;
          margin-bottom: 6px;
          color: #333;
        }
        .input-group input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 14px;
          outline: none;
        }
        .continue-btn {
          width: 100%;
          background-color: #ff99b5;
          border: none;
          color: white;
          font-weight: bold;
          padding: 12px;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
          margin-top: 10px;
        }
        .continue-btn:hover {
          background-color: #ff7da5;
        }
        .error, .success {
          margin-top: 12px;
          padding: 10px;
          border-radius: 6px;
          text-align: center;
          font-size: 14px;
        }
        .error {
          background-color: #f8d7da;
          color: #721c24;
        }
        .success {
          background-color: #d4edda;
          color: #155724;
        }
        .signin-link {
          text-align: center;
          margin-top: 12px;
          font-size: 14px;
        }
        .signin-link a {
          color: #ff99b5;
          font-weight: 600;
          text-decoration: none;
        }
        @media (max-width: 768px) {
          .login-wrapper {
            flex-direction: column;
          }
          .left-panel {
            padding: 30px 20px;
          }
          .right-panel {
            padding: 20px;
          }
        }
      `}</style>

      <div className="left-panel">
        <h1>Welcome to Bistrofy</h1>
        <p>Your gateway to delicious culinary experiences.</p>
        <div className="icons">
          <div className="icon">🍲</div>
          <div className="icon">🍕</div>
          <div className="icon">🍹</div>
          <div className="icon">🍜</div>
        </div>
        <Link to="/" className="btn">Explore Our Menu</Link>
      </div>

      <div className="right-panel">
        <div className="form-panel">
          <div className="form-content">
            <h2>Log In</h2>
            <p>Access your account to reserve, order, and explore more.</p>

            <form onSubmit={handleLogin}>
              <div className="input-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="continue-btn">Login</button>
            </form>

            {error.apiError && <div className="error">{error.apiError}</div>}
            {authError && <div className="error">{authError}</div>}
            {successMessage && <div className="success">{successMessage}</div>}

            <p className="signin-link">
              Don't have an account? <Link to="/signup">Sign up here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
