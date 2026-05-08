import React, { useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../../Styles/auth_modern.css";
import { MainContext } from "../../context/agroguru_context";
import Spinner from "../../Component/Spinner";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { spin, setSpin } = useContext(MainContext);
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    if (password.length < 4) {
      return setError("Password must be at least 4 characters long");
    }

    setSpin(true);
    setError("");

    try {
      const axiosConfig = {
        headers: { "Content-Type": "application/json;charset=UTF-8" },
        withCredentials: true
      };

      await axios.post(`/user/reset-password/${token}`, { data: { password } }, axiosConfig);
      setSpin(false);
      alert("Password has been reset successfully. Please log in with your new credentials.");
      navigate("/login");
    } catch (err) {
      setSpin(false);
      setError(err.response?.data?.message || "Failed to reset password. Link may be expired.");
    }
  };

  return (
    <div className="auth-page-container">
      {spin && <Spinner />}
      <div className="auth-glass-card">
        <div className="auth-header">
           <div className="auth-logo">
              <span className="sp1">Agro</span><span className="sp2">Guru</span>
           </div>
           <h3>Set New Password</h3>
           <p>Enter your new secure password below</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label htmlFor="new-password">New Password</label>
            <input 
              type="password" 
              id="new-password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input 
              type="password" 
              id="confirm-password" 
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-btn">Reset My Password</button>
        </form>

        {error && <div className="auth-error-msg">{error}</div>}

        <div className="auth-footer">
          Changed your mind? <Link to="/login">Cancel</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
