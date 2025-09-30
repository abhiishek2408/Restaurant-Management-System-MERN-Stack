import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // ✅ Import your AuthContext

const Signup = () => {
  const { register, error: contextError } = useContext(AuthContext); // ✅ use AuthContext
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
    profileImg: null,
  });

  const [error, setError] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      profileImg: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({});
    setSuccessMessage("");

    if (formData.password !== formData.confirmPassword) {
      setError((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }));
      return;
    }

    const submitData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      submitData.append(key, value);
    });

    // ✅ Use AuthContext register function
    const res = await register(submitData);

    if (res.success) {
      setSuccessMessage(res.message || "Registration successful! Please verify your email/OTP.");
      setFormData({
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        phone: "",
        address: "",
        bio: "",
        profileImg: null,
      });
    } else {
      setError(res.errors || { apiError: "Unknown error occurred." });
    }
  };

  return (
    <div className="signup-wrapper">
      <style>{`
        /* ✅ Your CSS remains unchanged */
        .signup-wrapper {
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
          max-width: 550px;
          background: #ffffff;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        }

        .form-content h2 {
          text-align: center;
          color: #ff99b5;
          margin-bottom: 10px;
          font-size: 22px;
        }

        .form-content p {
          text-align: center;
          margin-bottom: 20px;
          color: #444;
          font-size: 14px;
        }

        .input-row {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 12px;
        }

        .input-group {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .input-group input,
        .input-group textarea {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 14px;
        }

        .input-group label {
          font-size: 13px;
          margin-bottom: 5px;
          color: #444;
        }

        textarea {
          resize: none;
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
          margin-top: 12px;
        }

        .continue-btn:hover {
          background-color: #ff7da5;
        }

        .error {
          margin-top: 5px;
          font-size: 13px;
          color: #d10000;
        }

        .success-message {
          background-color: #d4edda;
          color: #155724;
          margin-top: 12px;
          padding: 10px;
          border-radius: 6px;
          text-align: center;
        }

        .signin-link {
          text-align: center;
          margin-top: 16px;
          font-size: 14px;
        }

        .signin-link a {
          color: #ff99b5;
          text-decoration: none;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .signup-wrapper {
            flex-direction: column;
            height: auto;
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
        <a href="/" className="btn">Explore Our Menu</a>
      </div>

      <div className="right-panel">
        <div className="form-panel">
          <div className="form-content">
            <h2>Sign Up</h2>
            <p>Create an account to start your journey with us.</p>

            <form onSubmit={handleSubmit}>
              <div className="input-row">
                <div className="input-group">
                  <label>Username:</label>
                  <input type="text" name="username" value={formData.username} onChange={handleChange} required />
                  {error.username && <div className="error">{error.username}</div>}
                </div>
                <div className="input-group">
                  <label>Email:</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                  {error.email && <div className="error">{error.email}</div>}
                </div>
              </div>

              <div className="input-row">
                <div className="input-group">
                  <label>Password:</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                  {error.password && <div className="error">{error.password}</div>}
                </div>
                <div className="input-group">
                  <label>Confirm Password:</label>
                  <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                  {error.confirmPassword && <div className="error">{error.confirmPassword}</div>}
                </div>
              </div>

              <div className="input-row">
                <div className="input-group">
                  <label>Phone:</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
                </div>
                <div className="input-group">
                  <label>Address:</label>
                  <input type="text" name="address" value={formData.address} onChange={handleChange} />
                </div>
              </div>

              <div className="input-row">
                <div className="input-group">
                  <label>Bio:</label>
                  <textarea name="bio" value={formData.bio} onChange={handleChange} />
                </div>
                <div className="input-group">
                  <label>Profile Image:</label>
                  <input type="file" name="profileImg" accept="image/*" onChange={handleFileChange} />
                </div>
              </div>

              <button type="submit" className="continue-btn">Register</button>
            </form>

            {error.apiError && <div className="error">{error.apiError}</div>}
            {contextError && <div className="error">{contextError}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}

            <p className="signin-link">
              Already have an account? <Link to="/login">Login here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;

