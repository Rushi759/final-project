import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import '../Styles/HomeNavbar.css'
import { MainContext } from '../context/agroguru_context'

const TRANSLATIONS = {
    en: {
        register: "Register",
        login: "Login"
    },
    mr: {
        register: "नोंदणी करा",
        login: "लॉग इन"
    }
}

const HomeNavbar = () => {
  const { language } = useContext(MainContext);
  const t = TRANSLATIONS[language || 'en'];

  return (
    <div className='HomeNavbar'>
        <div className='links'>
            <Link to='/user/regi'>{t.register}</Link>
            <Link to='/user/login'>{t.login}</Link>
        </div>
    </div>
  )
}

export default HomeNavbar