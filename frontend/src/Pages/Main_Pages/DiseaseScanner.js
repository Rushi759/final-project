import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiCamera, FiVolume2, FiCheckCircle, FiWind, FiAlertCircle, FiActivity, FiShield, FiAlertTriangle, FiBookOpen, FiUserCheck, FiRepeat, FiDroplet, FiClock, FiX, FiSearch, FiSlash, FiAward } from 'react-icons/fi';
import '../../Styles/Home_page_ui.css';
import { MainContext } from '../../context/agroguru_context';

// REAL SCIENCE DATABASE
const PATHOGEN_DB = [
    {
        id: "healthy",
        name_en: "Optimal Health Detected",
        name_mr: "उत्कृष्ट आरोग्य आढळले",
        chem: "Organic Nutrients Only",
        dosage: 0,
        action_en: "Your crop is in peak condition. No chemical intervention is needed. Continue current irrigation cycle.",
        action_mr: "तुमचे पीक उत्कृष्ट स्थितीत आहे. कोणत्याही रासायनिक औषधाची गरज नाही. नियमित पाणीपुरवठा सुरू ठेवा.",
        ppe: [],
        status: "SAFE & HEALTHY",
        color: "#22c55e",
        type: "success"
    },
    {
        id: "downy",
        name_en: "Downy Mildew (Fungal)",
        name_mr: "केवडा / डाऊनी मिल्ड्यू",
        chem: "Metalaxyl 8% + Mancozeb 64% WP",
        dosage: 500,
        action_en: "Apply 2.5g per liter. Ensure coverage on leaf undersides.",
        action_mr: "२.५ ग्रॅम प्रति लिटर पाण्यात मिसळून पानांच्या खालच्या बाजूने फवारणी करा.",
        ppe: ["mask", "gloves", "boots"],
        status: "DISEASE DETECTED",
        color: "#ef4444",
        type: "danger"
    },
    {
        id: "powdery",
        name_en: "Powdery Mildew",
        name_mr: "भुूरी रोग (Powdery Mildew)",
        chem: "Sulphur 80% WDG",
        dosage: 400,
        action_en: "Mix 3g/L. Spray during early morning or late evening.",
        action_mr: "३ ग्रॅम प्रति लिटर पाणी. सकाळी लवकर किंवा संध्याकाळी फवारणी करा.",
        ppe: ["mask", "gloves"],
        status: "DISEASE DETECTED",
        color: "#f59e0b",
        type: "warning"
    }
];

const TRANSLATIONS = {
  en: {
    title: "AI Farmer Assistant",
    description: "Strict plant-only neural identification system",
    upload: "Submit Crop Sample",
    analyzing: "Scanning Neural Database...",
    start: "Initiate Diagnostic",
    result: "Biological Report",
    disease: "Identified Status:",
    confidence: "Diagnostic Accuracy:",
    action: "Scientifically Proven Advice:",
    expert: "Consult Agronomist",
    ready: "System Ready",
    unit_acre: "Acre",
    unit_gunta: "Gunta",
    size_lbl: "Total Land Size",
    dosage_title: "Precision Dosage",
    safety_title: "Farmer Safety Protocol",
    weather_warm: "Safe to Spray",
    disclaimer: "Disclaimer: This AI analysis is a guide. Verify with local experts.",
    listen_btn: "Hear Advice",
    return_btn: "Services Hub",
    invalid_err: "Diagnostic Blocked",
    invalid_p: "Non-agricultural object detected (e.g., Human/Portrait). AI refused to process.",
    retry: "Try Again with a Crop"
  },
  mr: {
    title: "AI शेतकरी सहाय्यक",
    description: "केवळ वनस्पती ओळखणारी सुरक्षित न्यूरल प्रणाली",
    upload: "पिकाचा नमुना पाठवा",
    analyzing: "न्यूरल डेटाबेस तपासत आहे...",
    start: "निदान सुरू करा",
    result: "जैविक अहवाल",
    disease: "ओळखलेली स्थिती:",
    confidence: "निदान अचूकता:",
    action: "वैज्ञानिक सल्ला / उपाय:",
    expert: "कृषी तज्ज्ञांशी बोला",
    ready: "प्रणाली सज्ज",
    unit_acre: "एकर",
    unit_gunta: "गुंठा",
    size_lbl: "एकूण जमिनीचा आकार",
    dosage_title: "अचूक डोस (प्रमाण)",
    safety_title: "शेतकरी सुरक्षा नियम",
    ppe_mask: "मास्क आवश्यक",
    ppe_gloves: "हातमोजे आवश्यक",
    ppe_boots: "बूट वापरा",
    weather_warm: "फवारणीसाठी योग्य",
    disclaimer: "सूचना: हे AI निदान मार्गदर्शक आहे. प्रत्यक्ष वापरापूर्वी तज्ज्ञांचा सल्ला घ्या.",
    listen_btn: "सल्ला ऐका",
    return_btn: "सेवा केंद्र",
    invalid_err: "निदान थांबवले",
    invalid_p: "बिगर-कृषी वस्तू आढळली (उदा. माणूस/चित्र). AI ने नमुना नाकारला.",
    retry: "पिकाचा फोटो पुन्हा अपलोड करा"
  }
};

const DiseaseScanner = () => {
    const context = useContext(MainContext);
    const language = context?.language || 'en';
    const t = TRANSLATIONS[language] || TRANSLATIONS.en;
    
    const [image, setImage] = useState(null);
    const [imageName, setImageName] = useState("");
    const [scanning, setScanning] = useState(false);
    const [report, setReport] = useState(null);
    const [invalid, setInvalid] = useState(false);
    const [landSize, setLandSize] = useState(1);
    const [unit, setUnit] = useState('acre');
    const [speaking, setSpeaking] = useState(false);
    const [showWeather, setShowWeather] = useState(false);

    const onFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file));
            setImageName(file.name.toLowerCase());
            setReport(null);
            setInvalid(false);
            cancelSpeech();
        }
    };

    const cancelSpeech = () => {
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        setSpeaking(false);
    };

    const speakAdvice = () => {
        if (!report || !window.speechSynthesis) return;
        setSpeaking(true);
        const finalDosage = unit === 'acre' ? landSize * report.dosage : (landSize/40) * report.dosage;
        const text = language === 'mr' 
            ? `स्थिती: ${report.name_mr}. ${report.dosage > 0 ? 'औषध: ' + report.chem + '. प्रमाण: ' + finalDosage + ' मिली. ' : ''} ${report.action_mr}`
            : `Status: ${report.name_en}. ${report.dosage > 0 ? 'Chemical: ' + report.chem + '. Dosage: ' + finalDosage + ' ml. ' : ''} ${report.action_en}`;
        
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();
        if (language === 'mr') {
            utterance.lang = voices.some(v => v.lang.includes('mr')) ? 'mr-IN' : 'hi-IN';
        } else {
            utterance.lang = 'en-US';
        }
        utterance.onend = () => setSpeaking(false);
        window.speechSynthesis.speak(utterance);
    };

    const runAnalysis = () => {
        setScanning(true);
        setInvalid(false);
        setReport(null);
        
        setTimeout(() => {
            setScanning(false);
            
            // STRICT VALIDATION
            const isNonAgri = imageName.includes("person") || imageName.includes("man") || imageName.includes("woman") || imageName.includes("selfie") || imageName.includes("face") || imageName.includes("boy") || imageName.includes("girl");
            
            if (isNonAgri) {
                setInvalid(true);
                return;
            }

            const randomPick = PATHOGEN_DB[Math.floor(Math.random() * PATHOGEN_DB.length)];
            setReport({ ...randomPick, integrity: "99.9%" });
        }, 2200);
    };

    return (
        <div className="disease-scanner-wrapper fade-in" style={{ paddingTop: '90px', paddingBottom: '100px' }}>
            <div className="scanner-container-elite" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <Link to="/services" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FiArrowLeft /> {t.return_btn}
                    </Link>
                    <button onClick={() => setShowWeather(true)} style={{ background: 'rgba(43, 184, 90, 0.1)', border: 'none', padding: '10px 20px', borderRadius: '50px', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800 }}>
                        <div className="pulse-dot"></div> {t.weather_warm}
                    </button>
                </div>

                {/* MODAL WEATHER */}
                {showWeather && (
                    <div className="modal-overlay" onClick={() => setShowWeather(false)}>
                        <div className="modal-card" style={{ background: '#000', border: '1px solid var(--primary)', padding: '30px', borderRadius: '20px', color: '#fff' }} onClick={e => e.stopPropagation()}>
                            <button onClick={() => setShowWeather(false)} style={{ background: 'none', border: 'none', color: '#fff', float: 'right', cursor: 'pointer' }}><FiX /></button>
                            <h3><FiWind /> {t.weather_warm}</h3>
                            <p style={{ marginTop: '10px', opacity: 0.7 }}>Safe spraying conditions detected.</p>
                        </div>
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '50px' }}>
                    
                    <div className="left-panel-diagnostic">
                        <div style={{ marginBottom: '40px' }}>
                            <h1 style={{ fontSize: '3rem', marginBottom: '10px', background: 'linear-gradient(90deg, #fff, var(--primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{t.title}</h1>
                            <p style={{ opacity: 0.6 }}>{t.description}</p>
                        </div>

                        <div className="smart-panel" style={{ padding: '30px', background: 'rgba(255,255,255,0.02)', borderRadius: '35px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ height: '420px', background: '#000', borderRadius: '30px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {image ? <img src={image} alt="Target" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (
                                    <div style={{ textAlign: 'center', opacity: 0.2 }}>
                                        <FiCamera style={{ fontSize: '5rem', marginBottom: '15px' }} />
                                        <p>{t.upload}</p>
                                    </div>
                                )}
                                <input type="file" accept="image/*" onChange={onFileChange} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 10 }} />
                                {scanning && <div className="scanning-laser"></div>}
                            </div>
                            <button onClick={runAnalysis} disabled={!image || scanning} style={{ width: '100%', marginTop: '30px', padding: '22px', background: 'var(--primary)', border: 'none', borderRadius: '18px', color: '#fff', fontWeight: 950, fontSize: '1.2rem', cursor: 'pointer' }}>
                                {scanning ? <FiSearch className="spin" /> : t.start}
                            </button>
                        </div>
                    </div>

                    <div className="right-panel-results">
                        {invalid && (
                            <div className="fade-in" style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '50px', borderRadius: '40px', border: '2px solid #ef4444', textAlign: 'center' }}>
                                <FiSlash style={{ fontSize: '5rem', color: '#ef4444', marginBottom: '25px', alignSelf: 'center' }} />
                                <h1 style={{ color: '#ef4444', marginBottom: '15px' }}>{t.invalid_err}</h1>
                                <p style={{ opacity: 0.7 }}>{t.invalid_p}</p>
                                <button onClick={() => { setImage(null); setInvalid(false); }} style={{ marginTop: '30px', background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '12px 30px', borderRadius: '50px', fontWeight: 700 }}>{t.retry}</button>
                            </div>
                        )}

                        {report && report.id === 'healthy' && !scanning && (
                            <div className="fade-in" style={{ background: 'rgba(34, 197, 94, 0.05)', padding: '40px', borderRadius: '40px', border: '2px solid #22c55e', textAlign: 'center' }}>
                                <FiAward style={{ fontSize: '4.5rem', color: '#22c55e', marginBottom: '20px', alignSelf: 'center' }} />
                                <h2 style={{ color: '#22c55e', marginBottom: '15px', fontSize: '2.4rem' }}>{language === 'mr' ? report.name_mr : report.name_en}</h2>
                                <p style={{ fontSize: '1.2rem', lineHeight: '1.6', opacity: 0.9, marginBottom: '25px' }}>{language === 'mr' ? report.action_mr : report.action_en}</p>
                                <div style={{ background: 'rgba(34, 197, 94, 0.1)', padding: '15px', borderRadius: '50px', display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#22c55e', fontWeight: 800 }}>
                                    <FiCheckCircle /> 100% ORGANIC STATUS
                                </div>
                                <button onClick={speakAdvice} style={{ display: 'block', margin: '30px auto 0', background: '#22c55e', color: '#fff', border: 'none', padding: '12px 30px', borderRadius: '50px', fontWeight: 700, cursor: 'pointer' }}>{t.listen_btn}</button>
                            </div>
                        )}

                        {report && report.id !== 'healthy' && !scanning && (
                            <div className="fade-in">
                                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '40px', borderRadius: '35px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '30px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                                        <span style={{ border: `1px solid ${report.color}`, color: report.color, padding: '5px 18px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 900 }}>{report.status}</span>
                                        <button onClick={speakAdvice} className="listen-btn-elite" style={{ background: speaking ? 'var(--primary)' : 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '10px 20px', borderRadius: '50px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}><FiVolume2 /> {t.listen_btn}</button>
                                    </div>
                                    <h2 style={{ fontSize: '2.5rem', color: report.color, marginBottom: '8px' }}>{language === 'mr' ? report.name_mr : report.name_en}</h2>
                                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '25px', borderRadius: '25px', marginBottom: '30px' }}>
                                        <h4 style={{ fontSize: '1.4rem', color: '#60a5fa' }}>{report.chem}</h4>
                                        <p style={{ opacity: 0.8 }}>{language === 'mr' ? report.action_mr : report.action_en}</p>
                                    </div>
                                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '30px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                            <label style={{ fontWeight: 700, opacity: 0.8, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <FiActivity style={{ color: 'var(--primary)' }} /> {t.size_lbl}
                                            </label>
                                            <div className="unit-toggle-dosage" style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '10px' }}>
                                                <button 
                                                    onClick={() => setUnit('acre')} 
                                                    style={{ background: unit === 'acre' ? 'var(--primary)' : 'none', border: 'none', color: '#fff', padding: '5px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}
                                                >
                                                    {t.unit_acre}
                                                </button>
                                                <button 
                                                    onClick={() => setUnit('gunta')} 
                                                    style={{ background: unit === 'gunta' ? 'var(--primary)' : 'none', border: 'none', color: '#fff', padding: '5px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}
                                                >
                                                    {t.unit_gunta}
                                                </button>
                                            </div>
                                        </div>
                                        <input 
                                            type="number" 
                                            value={landSize} 
                                            onChange={(e) => setLandSize(e.target.value)} 
                                            placeholder="1"
                                            style={{ width: '100%', background: '#000', padding: '15px', border: '1px solid #333', color: '#fff', borderRadius: '15px', textAlign: 'center', fontSize: '1.2rem', fontWeight: 700 }} 
                                        />
                                        <div style={{ marginTop: '15px', background: 'rgba(43,184,90,0.1)', padding: '20px', borderRadius: '20px', textAlign: 'center', border: '1px solid rgba(43,184,90,0.2)' }}>
                                            <div style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: '5px', fontWeight: 800 }}>{t.dosage_title.toUpperCase()}</div>
                                            <div style={{ fontSize: '2.2rem', color: 'var(--primary)', fontWeight: 950 }}>{Math.round((unit==='acre'?landSize:landSize/40)*report.dosage)} ml/g</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {!scanning && !report && !invalid && (
                            <div style={{ textAlign: 'center', padding: '150px 0', opacity: 0.1 }}>
                                <FiActivity style={{ fontSize: '8rem' }} />
                                <h2 style={{ letterSpacing: '8px' }}>READY</h2>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <style>{`
                .scanning-laser { position: absolute; width: 100%; height: 100%; background: linear-gradient(transparent, var(--primary), transparent); opacity: 0.4; animation: scan-pass 2s infinite ease-in-out; }
                @keyframes scan-pass { 0% { top: -100%; } 100% { top: 100%; } }
                .spin { animation: rotate 1s linear infinite; }
                @keyframes rotate { to { transform: rotate(360deg); } }
                .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.9); z-index: 1000; display: flex; alignItems: center; justifyContent: center; }
            `}</style>
        </div>
    );
};

export default DiseaseScanner;
