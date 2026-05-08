import React, { useContext, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { NavLink } from 'react-router-dom'
import '../Styles/HomeNavbar.css'
import { MainContext } from "../context/agroguru_context";
import Spinner from '../Component/Spinner.js'
import { FiUser, FiLogOut } from 'react-icons/fi'

const TRANSLATIONS = {
  en: {
    brand_logo: "AgroGuru",
    home: "Home",
    services: "Services",
    about: "About Us",
    profile: "Profile",
    logout: "Logout"
  },
  mr: {
    brand_logo: "ॲग्रोगुरू",
    home: "मुख्यपृष्ठ",
    services: "सेवा",
    about: "आमच्याबद्दल",
    profile: "प्रोफाइल",
    logout: "लॉगआउट"
  }
}

export const MainNavbar = () => {

  const { spin, setSpin, language, setLanguage } = useContext(MainContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const t = TRANSLATIONS[language || 'en'];

  const navigate = useNavigate();

  const userLogout = async () => {
    setSpin(true);
    axios.get('/user/logout', { withCredentials: true })
      .then(() => {
        setSpin(false);
        navigate('/');
      })
      .catch((err) => {
        setSpin(false);
        console.log(err);
        navigate('/');
      })
  }

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'mr' : 'en');
  }

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  }

  const closeMenu = () => {
    setMenuOpen(false);
  }

  return (
    <>
      <section id="navbar_sec">
        <div id="web_logo_div">
          <NavLink to='/main'>
            <div className="logo-icon-wrapper">🌱</div>
            <div className="logo-text">
              {language === 'mr' ? (
                <span id="sp1" style={{color: '#fff', fontSize: '1.4rem'}}>{t.brand_logo}</span>
              ) : (
                <>
                  <span id="sp1">Agro</span><span id="sp2">Guru</span>
                </>
              )}
            </div>
          </NavLink>
        </div>

        <div id="navbar_menu" className={menuOpen ? 'nav-open' : ''}>
          <div id="navbar_menu_div">
            <ul id="navbar_menu_list">
              <li className="nav_menu_item"><NavLink onClick={closeMenu} className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? "active" : ""
              } to='/main'>{t.home}</NavLink></li>
              <li className="nav_menu_item" id="ser">
                <NavLink to='/services' onClick={closeMenu} className={({ isActive }) =>
                  isActive ? "active" : ""
                }>{t.services}</NavLink>
              </li>
              <li className="nav_menu_item"><NavLink to='/about' onClick={closeMenu} className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? "active" : ""
              }>{t.about}</NavLink></li>
              <li className="nav_menu_item"><NavLink to='/profile' onClick={closeMenu} className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? "active" : ""
              }>{t.profile}</NavLink></li>
            </ul>
          </div>
          <div className="navbar-footer-mobile desktop-hidden">
            <button id="nav_logout_btn" onClick={userLogout}>{t.logout}</button>
          </div>
        </div>

        <div className="nav-actions">
           <div className="elite-lang-switcher-nav">
             <div className="lang-toggle-pill-navbar">
               <button 
                 className={`lang-btn ${language === 'en' ? 'active' : ''}`} 
                 onClick={() => setLanguage('en')}
               >
                 EN
               </button>
               <button 
                 className={`lang-btn ${language === 'mr' ? 'active' : ''}`} 
                 onClick={() => setLanguage('mr')}
               >
                 मराठी
               </button>
             </div>
           </div>

           {/* DESKTOP LOGOUT PILL */}
           <button className="desktop-logout-pill" onClick={userLogout}>
              <FiLogOut /> <span>{t.logout}</span>
           </button>

          <button className={`hamburger ${menuOpen ? 'active' : ''}`} onClick={toggleMenu} aria-label="Toggle menu">
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        </div>
      </section>
      {spin && <Spinner />}
      {menuOpen && <div className="nav-overlay" onClick={closeMenu}></div>}
    </>
  )
}
