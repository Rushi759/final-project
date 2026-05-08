import React, { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "../../Styles/auth_modern.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { MainContext } from "../../context/agroguru_context";
import Spinner from "../../Component/Spinner";

const TRANSLATIONS = {
  en: {
    welcome_back: "Welcome Back",
    signin_to_continue: "Sign in to continue your farming journey",
    email_lbl: "Email Address",
    email_ph: "e.g. farmer@agroguru.com",
    pass_lbl: "Password",
    pass_ph: "••••••••",
    login_btn: "Log In",
    forgot_pass: "Forgot Password?",
    no_account: "Don't have an account?",
    create_account: "Create Account",
    err_invalid: "Invalid credentials. Please register first.",
    v_email_req: "Email is required",
    v_email_valid: "Enter valid Email",
    v_pass_req: "Password is required",
    v_pass_min: "Password must be at least 4 characters"
  },
  mr: {
    welcome_back: "स्वागत आहे",
    signin_to_continue: "तुमचा शेतीचा प्रवास सुरू ठेवण्यासाठी लॉग इन करा",
    email_lbl: "ईमेल पत्ता",
    email_ph: "उदा. farmer@agroguru.com",
    pass_lbl: "पासवर्ड",
    pass_ph: "••••••••",
    login_btn: "लॉग इन करा",
    forgot_pass: "पासवर्ड विसरलात?",
    no_account: "खाते नाही का?",
    create_account: "खाते तयार करा",
    err_invalid: "अवैध लॉगिन. कृपया प्रथम नोंदणी करा.",
    v_email_req: "ईमेल आवश्यक आहे",
    v_email_valid: "वैध ईमेल प्रविष्ट करा",
    v_pass_req: "पासवर्ड आवश्यक आहे",
    v_pass_min: "पासवर्ड किमान ४ अक्षरांचा असावा"
  }
}

const Login = () => {
  const [lgt, setlgt] = useState(0.0);
  const [lgn, setlgn] = useState(0.0);

  const { spin, setSpin, language } = useContext(MainContext);
  const t = TRANSLATIONS[language || 'en'];
  const navigate = useNavigate();

  const schema = yup.object().shape({
    email: yup.string().email(t.v_email_valid).required(t.v_email_req),
    password: yup.string().min(4, t.v_pass_min).max(20).required(t.v_pass_req),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async function (position) {
      setlgt(position.coords.longitude);
      setlgn(position.coords.latitude);
    });
  }, []);

  const onSubmit = async (data) => {
    setSpin(true);
    let axiosConfig = {
      headers: { "Content-Type": "application/json;charset=UTF-8" },
      params: { lng: JSON.stringify(lgn), lat: JSON.stringify(lgt) },
      withCredentials: true
    };

    let errorDetail = null;
    let resStatus = 200;
    await axios.post("/user/login", { data }, axiosConfig)
      .then(() => {
        setSpin(false);
        resStatus = 200;
      })
      .catch((err) => {
        setSpin(false);
        if (!err.response) {
          errorDetail = "Cannot reach server. Please ensure the 'Starting Python API' window is open and says 'Listening'.";
          resStatus = 503;
        } else {
          resStatus = err.response.status;
          errorDetail = err.response.data?.detail;
        }
      });

    if (resStatus === 200) {
      navigate("/main");
    } else {
      let msg = errorDetail || t.err_invalid;
      if (resStatus === 503) {
        msg = "Connectivity Issue: The AgroGuru Engine is still starting up. Please wait 10 seconds and try again. Ensure the 'Starting Python API' window is open.";
      }
      alert(`Login Status: ${msg}`);
      if (resStatus !== 503) navigate("/regi");
    }
  };

  return (
    <div className={`auth-page-container fade-in ${language === 'mr' ? 'marathi-mode' : ''}`}>
      {spin && <Spinner />}
      <div className="auth-glass-card">
        <div className="auth-header">
           <div className="auth-logo">
              {language === 'mr' ? (
                <span className="sp1" style={{color: '#fff', fontSize: '1.8rem'}}>ॲग्रोगुरू</span>
              ) : (
                <><span className="sp1">Agro</span><span className="sp2">Guru</span></>
              )}
           </div>
           <h3>{t.welcome_back}</h3>
           <p>{t.signin_to_continue}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div className="input-group">
            <label htmlFor="login-email">{t.email_lbl}</label>
            <input 
              type="email" 
              id="login-email" 
              placeholder={t.email_ph}
              {...register("email")} 
            />
            <p className="err">{errors.email?.message}</p>
          </div>

          <div className="input-group">
            <label htmlFor="login-password">{t.pass_lbl}</label>
            <input 
              type="password" 
              id="login-password" 
              placeholder={t.pass_ph}
              {...register("password")} 
            />
            <p className="err">{errors.password?.message}</p>
          </div>

          <button className="auth-btn">{t.login_btn}</button>
          
          <div className="forgot-password-link">
            <Link to="/forgot-password">{t.forgot_pass}</Link>
          </div>
        </form>

        <div className="auth-footer">
          {t.no_account} <Link to="/regi">{t.create_account}</Link>
        </div>
      </div>
    </div>
  );
};


export default Login;
