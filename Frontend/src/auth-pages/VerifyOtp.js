import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom"; // ✅ import useParams

const VerifyOtp = () => {
  const { verifyOtp } = useAuth();
  const { id } = useParams(); // ✅ get userId from URL
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const result = await verifyOtp(id, otp); // ✅ pass both userId and otp
      if (result.success) {
        setSuccess(result.message || "OTP Verified Successfully!");
        setTimeout(() => navigate("/"), 1500);
      } else {
        setError(result.message || "Invalid OTP.");
      }
    } catch (err) {
      setError("An error occurred while verifying OTP.");
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
        <h2>Verify OTP</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn">Verify</button>
        </form>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
      </div>
    </div>
  );
};

export default VerifyOtp;
