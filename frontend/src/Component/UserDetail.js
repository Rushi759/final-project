import React, { useState, useContext } from 'react'
import "../Styles/profile_page_ui.css"
import axios from 'axios';
import { MainContext } from '../context/agroguru_context';

const TRANSLATIONS = {
  en: {
    updating: "Updating Identity...",
    save_photo: "Save New Photo",
    farmer_id: "Farmer ID",
    member_farmer: "Member Farmer",
    specialist: "Plant Specialist",
    trade: "Trade Expert",
    research: "Research Lead",
    contact: "Direct Contact",
    email_label: "Verified Email",
    not_provided: "Not provided",
    upload_success: "Profile picture updated!",
    upload_failed: "Upload failed. Make sure you are logged in.",
    select_img: "Please select an image first"
  },
  mr: {
    updating: "ओळख अपडेट होत आहे...",
    save_photo: "नवीन फोटो जतन करा",
    farmer_id: "शेतकरी आयडी",
    member_farmer: "शेतकरी सदस्य",
    specialist: "रोपवाटिका तज्ज्ञ",
    trade: "व्यापार तज्ज्ञ",
    research: "संशोधन प्रमुख",
    contact: "थेट संपर्क",
    email_label: "सत्यापित ईमेल",
    not_provided: "दिलेले नाही",
    upload_success: "प्रोफाइल चित्र यशस्वीरित्या अपडेट झाले!",
    upload_failed: "अपलोड अयशस्वी. आपण लॉग इन असल्याची खात्री करा.",
    select_img: "कृपया आधी एक चित्र निवडा"
  }
}

const UserDetail = (props) => {
    const { language } = useContext(MainContext);
    const t = TRANSLATIONS[language || 'en'];
    const [img, seimg] = useState();
    const [uploading, setUploading] = useState(false);

    const imageUpload = () => {
        if (!img) {
            alert(t.select_img);
            return;
        }
        
        setUploading(true);
        const bodyFormData = new FormData();
        bodyFormData.append('profilepic', img)
        
        const axiosConfig = {
            headers: {
                'Content-Type': "multipart/form-data",
            },
            withCredentials: true
        }

        axios.post('/user/dp', bodyFormData, axiosConfig)
            .then((it) => {
                setUploading(false);
                alert(t.upload_success);
                window.location.reload();
            })
            .catch((err) => {
                setUploading(false);
                alert(t.upload_failed);
            })
    }

    const profileSrc = props.profilpic 

    return (
        <section id="profile_main" className="fade-in">
            <div className="profile-hero-modern">
                <div className="profile-glass-wrap">
                    <div className="profile-left">
                        <div className="profile-avatar-premium">
                            {profileSrc ? (
                                <img src={profileSrc} alt="Profile" />
                            ) : (
                                <div className="initials">
                                    {props.name?.substring(0,2).toUpperCase()}
                                </div>
                            )}
                            <input 
                                type="file" 
                                id="profile-upload" 
                                onChange={(e) => seimg(e.target.files[0])} 
                            />
                            <label htmlFor="profile-upload" className="edit-glow-btn">
                                <span>📸</span>
                            </label>
                        </div>
                        
                        <div className="avatar-actions">
                            {img && (
                                <button
                                    className={`save-btn ${uploading ? 'loading' : ''}`}
                                    onClick={imageUpload} 
                                    disabled={uploading}
                                >
                                    {uploading ? t.updating : t.save_photo}
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="profile-right">
                        <div className="profile-identity">
                            <div className="id-branding">
                                <span className="id-badge">{t.farmer_id}: #AG{props.name?.substring(0,2).toUpperCase()}{Math.floor(Math.random()*900)+100}</span>
                                <span className="id-status-dot"></span>
                            </div>
                            <h1>{props.name || t.member_farmer}</h1>
                            <div className="farmer-badges">
                                {props.nur && <span className="badge-item nursery">{t.specialist}</span>}
                                {props.mar && <span className="badge-item market">{t.trade}</span>}
                                {props.lab && <span className="badge-item lab">{t.research}</span>}
                            </div>
                        </div>

                        <div className="profile-info-grid">
                            <div className="info-card-premium">
                                <label>{t.contact}</label>
                                <h3>{props.phone || t.not_provided}</h3>
                                <span className="info-icon">📞</span>
                            </div>
                            <div className="info-card-premium">
                                <label>{t.email_label}</label>
                                <h3>{props.email}</h3>
                                <span className="info-icon">📧</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default UserDetail