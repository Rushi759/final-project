import React, { useContext } from 'react'
import "../Styles/profile_page_ui.css"
import { useNavigate } from 'react-router-dom'
import { MainContext } from '../context/agroguru_context'

const TRANSLATIONS = {
  en: {
    title: "Open a Farmer's Market (Agro-Market)",
    desc: "Take your market to new heights by showcasing your crops on our website. Join our advanced community and let your business thrive like never before!",
    btn: "Register Market"
  },
  mr: {
    title: "शेतकरी बाजार उघडा (ॲग्रो-मार्केट)",
    desc: "आमच्या वेबसाइटवर आपले पीक प्रदर्शन करून तुमच्या बाजारपेठेला नवीन उंचीवर न्या. आमच्या प्रगत समुदायात सामील व्हा आणि तुमचा व्यवसाय पूर्वी कधीही नव्हता इतका भरभराटीला येऊ द्या!",
    btn: "मार्केट नोंदणी करा"
  }
}

const ProfileMarNa = () => {
  const navigate = useNavigate();
  const { language } = useContext(MainContext);
  const t = TRANSLATIONS[language || 'en'];

  return (
    <section className="business-action-card market-card">
        <div className="business-card-icon">🛒</div>
        <div className="business-card-content">
            <h4>{t.title}</h4>
            <p>{t.desc}</p>
        </div>
        <button className="business-card-btn btn-market" onClick={() => navigate('/form/marketf')}>
            {t.btn}
        </button>
    </section>
  )
}

export default ProfileMarNa