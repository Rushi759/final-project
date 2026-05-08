import React, { useContext } from 'react'
import "../Styles/profile_page_ui.css"
import { useNavigate } from 'react-router-dom'
import { MainContext } from '../context/agroguru_context'

const TRANSLATIONS = {
  en: {
    title: "Become a Nursery Partner",
    desc: "Unlock endless possibilities for your nursery by showcasing it on our website. Join our vibrant network and let your green success blossom!",
    btn: "Register Nursery"
  },
  mr: {
    title: "रोपवाटिका भागीदार बना",
    desc: "आमच्या वेबसाइटवर आपली रोपवाटिका प्रदर्शित करून अमर्याद संधींचे दार उघडा. आमच्या जीवंत नेटवर्कमध्ये सामील व्हा आणि आपल्या हिरव्या यशाचा विस्तार करा!",
    btn: "रोपवाटिका नोंदणी करा"
  }
}

const ProfileNurNa = () => {
  const navigate = useNavigate();
  const { language } = useContext(MainContext);
  const t = TRANSLATIONS[language || 'en'];

  return (
    <section className="business-action-card nursery-card">
        <div className="business-card-icon">🌱</div>
        <div className="business-card-content">
            <h4>{t.title}</h4>
            <p>{t.desc}</p>
        </div>
        <button className="business-card-btn btn-nursery" onClick={() => navigate('/form/nurf')}>
            {t.btn}
        </button>
    </section>
  )
}

export default ProfileNurNa