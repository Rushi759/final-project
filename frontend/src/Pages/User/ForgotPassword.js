import React, { useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../../Styles/auth_modern.css";
import { MainContext } from "../../context/agroguru_context";
import Spinner from "../../Component/Spinner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const { spin, setSpin } = useContext(MainContext);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [demoLink, setDemoLink] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSpin(true);
    setError("");
    setMessage("");

    try {
      const axiosConfig = {
        headers: { "Content-Type": "application/json;charset=UTF-8" },
        withCredentials: true
      };

      const response = await axios.post("/user/forgot-password", { data: { email } }, axiosConfig);
      
      setSpin(false);
      setMessage("Success! Your reset link has been generated for this demo.");
      
      if (response.data.demoToken) {
        setDemoLink(`http://localhost:3000/reset-password/${response.data.demoToken}`);
      }
      
      alert("✅ Link Generated! You can find it right below the form.");
    } catch (err) {
      setSpin(false);
      setError(err.response?.data?.detail || "Failed to reset password. Link may be expired.");
      alert("❌ Error: " + (err.response?.data?.detail || "Check your internet connection"));
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
           <h3>Account Recovery</h3>
           <p>Enter your email to receive a password reset link</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label htmlFor="recovery-email">Email Address</label>
            <input 
              type="email" 
              id="recovery-email" 
              placeholder="farmer@agroguru.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-btn">Request Reset Link</button>
        </form>

        {demoLink && (
           <div className="demo-link-box fade-in">
              <p>Demo Recovery Link:</p>
              <a href={demoLink} className="reset-uri">{demoLink}</a>
              <small>Click the link above to set your new password.</small>
           </div>
        )}

        {message && <div className="auth-success-msg">{message}</div>}
        {error && <div className="auth-error-msg">{error}</div>}

        <div className="auth-footer">
          Remembered your password? <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
