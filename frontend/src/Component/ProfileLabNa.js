import React, { useContext } from 'react'
import "../Styles/profile_page_ui.css"
import { useNavigate } from 'react-router-dom'
import { MainContext } from '../context/agroguru_context'

const TRANSLATIONS = {
  en: {
    title: "Start a Scientific Laboratory",
    desc: "Unleash the power of your plant laboratory. Embark on a journey of discovery that will push the boundaries of plant science and revolutionize the industry!",
    btn: "Register Lab"
  },
  mr: {
    title: "वैज्ञानिक प्रयोगशाळा सुरू करा",
    desc: "तुमच्या रोप प्रयोगशाळेची शक्ती मुक्त करा. शोधाच्या प्रवासाला सुरुवात करा जो पीक विज्ञानाच्या सीमा ओलांडेल आणि उद्योगात क्रांती घडवेल!",
    btn: "लॅब नोंदणी करा"
  }
}

const ProfileLabNa = () => {
  const navigate = useNavigate();
  const { language } = useContext(MainContext);
  const t = TRANSLATIONS[language || 'en'];

  return (
    <section className="business-action-card lab-card">
        <div className="business-card-icon">🔬</div>
        <div className="business-card-content">
            <h4>{t.title}</h4>
            <p>{t.desc}</p>
        </div>
        <button className="business-card-btn btn-lab" onClick={() => navigate('/form/labf')}>
            {t.btn}
        </button>
    </section>
  )
}

export default ProfileLabNa