import React, { useState } from "react";
import { useAuth } from "../context/AuthContext"; 
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const result = await forgotPassword(email);
      if (result.success) {
        setSuccess(result.message || "OTP sent to your email.");
        setTimeout(() => navigate("/verify-otp"), 1500);
      } else {
        setError(result.message || "Unable to send OTP.");
      }
    } catch (err) {
      setError("An error occurred while sending OTP.");
    }
  };

  return (
    <div className="auth-wrapper">
      <style>{`
        .auth-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: #fff;
          font-family: 'Segoe UI', sans-serif;
        }
        .auth-box {
          background: #ffffff;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
          width: 100%;
          max-width: 400px;
        }
        .auth-box h2 {
          text-align: center;
          color: #ff99b5;
          margin-bottom: 15px;
        }
        .input-group {
          margin-bottom: 15px;
        }
        .input-group input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #ccc;
          border-radius: 6px;
        }
        .btn {
          width: 100%;
          background-color: #ff99b5;
          border: none;
          color: white;
          font-weight: bold;
          padding: 12px;
          border-radius: 6px;
          cursor: pointer;
        }
        .btn:hover {
          background-color: #ff7da5;
        }
        .error, .success {
          margin-top: 10px;
          text-align: center;
          font-size: 14px;
          padding: 8px;
          border-radius: 6px;
        }
        .error {
          background-color: #f8d7da;
          color: #721c24;
        }
        .success {
          background-color: #d4edda;
          color: #155724;
        }
      `}</style>

      <div className="auth-box">
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn">Send OTP</button>
        </form>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
      </div>
    </div>
  );
};

export default ForgotPassword;
