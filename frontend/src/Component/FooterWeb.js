import React, { useContext } from 'react'
import '../Styles/footer_ui.css';
import IonIcon from '@reacticons/ionicons';
import { useNavigate } from 'react-router-dom';
import { MainContext } from '../context/agroguru_context';

const TRANSLATIONS = {
  en: {
    home: "Home",
    services: "Services",
    about: "About",
    feedback: "Feedback",
    encyclopedia: "Crop Encyclopedia",
    rights: "AgroGuru | All Rights Reserved"
  },
  mr: {
    home: "मुख्यपृष्ठ",
    services: "सेवा",
    about: "बद्दल",
    feedback: "अभिप्राय",
    encyclopedia: "पीक विश्वकोश",
    rights: "ॲग्रोगुरू | सर्व हक्क राखीव"
  }
}

const FooterWeb = () => {
    const navigate = useNavigate();
    const { language } = useContext(MainContext);
    const t = TRANSLATIONS[language || 'en'];

    return (
        <>
            <footer className="footer">
                <div className="waves">
                    <div className="wave" id="wave1"></div>
                    <div className="wave" id="wave2"></div>
                    <div className="wave" id="wave3"></div>
                    <div className="wave" id="wave4"></div>
                </div>
                <ul className="social-icon">
                    <li className="social-icon__item"><a className="social-icon__link" href="#">
                        <IonIcon name="logo-facebook" ></IonIcon>
                    </a></li>
                    <li className="social-icon__item"><a className="social-icon__link" href="#">
                        <IonIcon name="logo-twitter" ></IonIcon>
                    </a></li>
                    <li className="social-icon__item"><a className="social-icon__link" href="#">
                        <IonIcon name="logo-linkedin" ></IonIcon>
                    </a></li>
                    <li className="social-icon__item"><a className="social-icon__link" href="#">
                        <IonIcon name="logo-instagram" ></IonIcon>
                    </a></li>
                </ul>
                <ul className="menu">
                    <li className="menu__item"><a className="menu__link" onClick={() => navigate('/main')}>{t.home}</a></li>
                    <li className="menu__item"><a className="menu__link" onClick={() => navigate('/services/crop')}>{t.services}</a></li>
                    <li className="menu__item"><a className="menu__link" onClick={() => navigate('/about')}>{t.about}</a></li>
                    <li className="menu__item"><a href="https://forms.gle/7atD2nHBrBBnSTtL7" className="menu__link" target='_blank' rel="noreferrer">{t.feedback}</a></li>
                    <li className="menu__item"><a className="menu__link" onClick={() => navigate('/services/crops')}>{t.encyclopedia}</a></li>
                </ul>
                <p>&copy;2025 {t.rights}</p>
            </footer>
        </>
    )
}

export default FooterWeb