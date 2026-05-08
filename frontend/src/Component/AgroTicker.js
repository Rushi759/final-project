/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo, useContext } from 'react';
import axios from 'axios';
import { FiNavigation } from 'react-icons/fi';
import '../Styles/Home_page_ui.css';
import { MainContext } from '../context/agroguru_context';

// 36 Districts Database (English)
const districtDatabaseEN = {
  "Ahmednagar": { mandi: "Ahmednagar Market", crops: ["Sugarcane", "Onion", "Pomegranate"], icon: "🍎" },
  "Akola": { mandi: "Akola Mandi", crops: ["Cotton", "Soybean", "Gram"], icon: "☁️" },
  "Amravati": { mandi: "Amravati Central", crops: ["Orange", "Soybean", "Cotton"], icon: "🍊" },
  "Aurangabad": { mandi: "Jadhavwadi Mandi", crops: ["Maize", "Cotton", "Bajra"], icon: "🌽" },
  "Beed": { mandi: "Beed Market Yard", crops: ["Cotton", "Soybean", "Sugarcane"], icon: "🌾" },
  "Bhandara": { mandi: "Bhandara Mandi", crops: ["Rice", "Tur", "Chilli"], icon: "🍚" },
  "Buldhana": { mandi: "Buldhana Mandi", crops: ["Cotton", "Soybean", "Maize"], icon: "☁️" },
  "Chandrapur": { mandi: "Chandrapur APMC", crops: ["Rice", "Cotton", "Soybean"], icon: "🍚" },
  "Dhule": { mandi: "Dhule Mandi", crops: ["Onion", "Cotton", "Maize"], icon: "🧅" },
  "Gadchiroli": { mandi: "Gadchiroli Hub", crops: ["Rice", "Forest Produce", "Linseed"], icon: "🌳" },
  "Gondia": { mandi: "Gondia Rice Hub", crops: ["Rice", "Linseed", "Tur"], icon: "🍚" },
  "Hingoli": { mandi: "Hingoli Mandi", crops: ["Soyabean", "Turmeric", "Cotton"], icon: "🫚" },
  "Jalgaon": { mandi: "Jalgaon Banana Hub", crops: ["Banana", "Cotton", "Maize"], icon: "🍌" },
  "Jalna": { mandi: "Jalna Seed Capital", crops: ["Cotton", "Soybean", "Sweet Orange"], icon: "🌱" },
  "Kolhapur": { mandi: "Kolhapur Jaggery Yard", crops: ["Sugarcane", "Rice", "Milk"], icon: "🍯" },
  "Latur": { mandi: "Latur Pulse Hub", crops: ["Soybean", "Tur/Arhar", "Urad"], icon: "🫘" },
  "Mumbai City": { mandi: "Byculla Market", crops: ["Vegetables", "Fish Market", "Imports"], icon: "🏙️" },
  "Mumbai Suburban": { mandi: "Vashi APMC", crops: ["Global Exports", "Fruits", "Grains"], icon: "🚢" },
  "Nagpur": { mandi: "Kalamna Mandi", crops: ["Orange", "Cotton", "Soybean"], icon: "🍊" },
  "Nanded": { mandi: "Nanded Mandi", crops: ["Cotton", "Soybean", "Tur"], icon: "🌾" },
  "Nandurbar": { mandi: "Nandurbar Chilli Hub", crops: ["Chilli", "Cotton", "Maize"], icon: "🌶️" },
  "Nashik": { mandi: "Lasalgaon Onion Hub", crops: ["Onion", "Grapes", "Tomato"], icon: "🧅" },
  "Osmanabad": { mandi: "Osmanabad Mandi", crops: ["Soybean", "Tur", "Sugarcane"], icon: "🌾" },
  "Palghar": { mandi: "Palghar Market", crops: ["Rice", "Chiku", "Vegetables"], icon: "🥥" },
  "Parbhani": { mandi: "Parbhani Mandi", crops: ["Cotton", "Soybean", "Turmeric"], icon: "🫚" },
  "Pune": { mandi: "Gultekdi Mandi", crops: ["Vegetables", "Sugarcane", "Grapes"], icon: "🥬" },
  "Raigad": { mandi: "Raigad Food Hub", crops: ["Rice", "Coconut", "Areca Nut"], icon: "🥥" },
  "Ratnagiri": { mandi: "Ratnagiri Alphonso Hub", crops: ["Mango", "Cashew Net", "Fish"], icon: "🥭" },
  "Sangli": { mandi: "Sangli Turmeric Hub", crops: ["Turmeric", "Grapes", "Raisins"], icon: "🫚" },
  "Satara": { mandi: "Karad Market Yard", crops: ["Sugarcane", "Turmeric", "Onion"], icon: "🌾" },
  "Sindhudurg": { mandi: "Sindhudurg Hub", crops: ["Mango", "Cashew", "Coconut"], icon: "🥭" },
  "Solapur": { mandi: "Solapur Pomegranate", crops: ["Pomegranate", "Sugarcane", "Grape"], icon: "🍎" },
  "Thane": { mandi: "Kalyan Mandi", crops: ["Vegetables", "Rice", "Flowers"], icon: "🌸" },
  "Wardha": { mandi: "Wardha Mandi", crops: ["Cotton", "Soybean", "Chana"], icon: "☁️" },
  "Washim": { mandi: "Washim Mandi", crops: ["Soybean", "Tur", "Gram"], icon: "🫘" },
  "Yavatmal": { mandi: "Yavatmal White Gold", crops: ["Cotton", "Soybean", "Tur"], icon: "☁️" }
};

// 36 Districts Database (Marathi)
const districtDatabaseMR = {
  "Ahmednagar": { name: "अहमदनगर", mandi: "अहमदनगर मार्केट", crops: ["ऊस", "कांदा", "डाळिंब"], icon: "🍎" },
  "Akola": { name: "अकोला", mandi: "अकोला मंडी", crops: ["कापूस", "सोयाबीन", "हरभरा"], icon: "☁️" },
  "Amravati": { name: "अमरावती", mandi: "अमरावती मध्य", crops: ["संत्री", "सोयाबीन", "कापूस"], icon: "🍊" },
  "Aurangabad": { name: "छत्रपती संभाजीनगर", mandi: "जाधववाडी मंडी", crops: ["मका", "कापूस", "बाजरी"], icon: "🌽" },
  "Beed": { name: "बीड", mandi: "बीड मार्केट यार्ड", crops: ["कापूस", "सोयाबीन", "ऊस"], icon: "🌾" },
  "Bhandara": { name: "भंडारा", mandi: "भंडारा मंडी", crops: ["भात", "तूर", "मिरची"], icon: "🍚" },
  "Buldhana": { name: "बुलढाणा", mandi: "बुलढाणा मंडी", crops: ["कापूस", "सोयाबीन", "मका"], icon: "☁️" },
  "Chandrapur": { name: "चंद्रपूर", mandi: "चंद्रपूर APMC", crops: ["भात", "कापूस", "सोयाबीन"], icon: "🍚" },
  "Dhule": { name: "धुळे", mandi: "धुळे मंडी", crops: ["कांदा", "कापूस", "मका"], icon: "🧅" },
  "Gadchiroli": { name: "गडचिरोली", mandi: "गडचिरोली हब", crops: ["भात", "वन उपजत", "अळशी"], icon: "🌳" },
  "Gondia": { name: "गोंदिया", mandi: "गोंदिया राईस हब", crops: ["भात", "अळशी", "तूर"], icon: "🍚" },
  "Hingoli": { name: "हिंगोली", mandi: "हिंगोली मंडी", crops: ["सोयाबीन", "हळद", "कापूस"], icon: "🫚" },
  "Jalgaon": { name: "जळगाव", mandi: "जळगाव केळी हब", crops: ["केळी", "कापूस", "मका"], icon: "🍌" },
  "Jalna": { name: "जालना", mandi: "जालना सीड कॅपिटल", crops: ["कापूस", "सोयाबीन", "मोसंबी"], icon: "🌱" },
  "Kolhapur": { name: "कोल्हापूर", mandi: "कोल्हापूर गुळ यार्ड", crops: ["ऊस", "तांदूळ", "दूध"], icon: "🍯" },
  "Latur": { name: "लातूर", mandi: "लातूर पल्स हब", crops: ["सोयाबीन", "तूर/अरहर", "उडीद"], icon: "🫘" },
  "Mumbai City": { name: "मुंबई शहर", mandi: "भायखळा मार्केट", crops: ["भाज्या", "मासे बाजार", "आयात"], icon: "🏙️" },
  "Mumbai Suburban": { name: "मुंबई उपनगर", mandi: "वाशी APMC", crops: ["ग्लोबल एक्सपोर्ट", "फळे", "धान्य"], icon: "🚢" },
  "Nagpur": { name: "नागपूर", mandi: "कळमना मंडी", crops: ["संत्री", "कापूस", "सोयाबीन"], icon: "🍊" },
  "Nanded": { name: "नांदेड", mandi: "नांदेड मंडी", crops: ["कापूस", "सोयाबीन", "तूर"], icon: "🌾" },
  "Nandurbar": { name: "नंदुरबार", mandi: "नंदुरबार मिरची हब", crops: ["मिरची", "कापूस", "मका"], icon: "🌶️" },
  "Nashik": { name: "नाशिक", mandi: "लासलगाव कांदा हब", crops: ["कांदा", "द्राक्षे", "टोमॅटो"], icon: "🧅" },
  "Osmanabad": { name: "धाराशिव", mandi: "धाराशिव मंडी", crops: ["सोयाबीन", "तूर", "ऊस"], icon: "🌾" },
  "Palghar": { name: "पालघर", mandi: "पालघर मार्केट", crops: ["भात", "चिकू", "भाज्या"], icon: "🥥" },
  "Parbhani": { name: "परभणी", mandi: "परभणी मंडी", crops: ["कापूस", "सोयाबीन", "हळद"], icon: "🫚" },
  "Pune": { name: "पुणे", mandi: "गुलटेकडी मंडी", crops: ["भाज्या", "ऊस", "द्राक्षे"], icon: "🥬" },
  "Raigad": { name: "रायगड", mandi: "रायगड फूड हब", crops: ["भात", "नारळ", "सुपारी"], icon: "🥥" },
  "Ratnagiri": { name: "रत्नागिरी", mandi: "रत्नागिरी हापूस हब", crops: ["आंबा", "काजू", "मासे"], icon: "🥭" },
  "Sangli": { name: "सांगली", mandi: "सांगली हळद हब", crops: ["हळद", "द्राक्षे", "बेदाणे"], icon: "🫚" },
  "Satara": { name: "सातारा", mandi: "कराड मार्केट यार्ड", crops: ["ऊस", "हळद", "कांदा"], icon: "🌾" },
  "Sindhudurg": { name: "सिंधुदुर्ग", mandi: "सिंधुदुर्ग हब", crops: ["आंबा", "काजू", "नारळ"], icon: "🥭" },
  "Solapur": { name: "सोलापूर", mandi: "सोलापूर डाळिंब हब", crops: ["डाळिंब", "ऊस", "द्राक्षे"], icon: "🍎" },
  "Thane": { name: "ठाणे", mandi: "कल्याण मंडी", crops: ["भाज्या", "भात", "फुले"], icon: "🌸" },
  "Wardha": { name: "वर्धा", mandi: "वर्धा मंडी", crops: ["कापूस", "सोयाबीन", "चणा"], icon: "☁️" },
  "Washim": { name: "वाशिम", mandi: "वाशिम मंडी", crops: ["सोयाबीन", "तूर", "हरभरा"], icon: "🫘" },
  "Yavatmal": { name: "यवतमाळ", mandi: "यवतमाळ व्हाईट गोल्ड", crops: ["कापूस", "सोयाबीन", "तूर"], icon: "☁️" }
};

const TRANSLATIONS = {
  en: {
    live_pulse: "LIVE PULSE",
    detecting: "Detecting...",
    smart_focus: "SMART FOCUS",
    region: "Region",
    current_session: "Current Session Open",
    steady: "Steady Market Demand",
    weather_alert: "WEATHER ALERT",
    optimized: "Optimized for"
  },
  mr: {
    live_pulse: "लाईव्ह पल्स",
    detecting: "शोधत आहे...",
    smart_focus: "स्मार्ट फोकस",
    region: "प्रदेश",
    current_session: "सध्याचे सत्र सुरू",
    steady: "स्थिर बाजार मागणी",
    weather_alert: "हवामान इशारा",
    optimized: "साठी अनुकूल"
  }
}

const AgroTicker = () => {
  const { language, location: globalLocation } = useContext(MainContext);
  const t = TRANSLATIONS[language || 'en'];
  const db = language === 'mr' ? districtDatabaseMR : districtDatabaseEN;

  const [selectedDistrict, setSelectedDistrict] = useState("Kolhapur");
  const [cityName, setCityName] = useState(t.detecting);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setCityName(t.detecting);
  }, [language]);

  // Memoize Market Data to prevent recalculation on every second
  const marketData = useMemo(() => {
    const data = db[selectedDistrict] || db["Pune"];
    const displayCity = language === 'mr' ? (db[selectedDistrict]?.name || cityName) : cityName;

    return [
      { label: t.smart_focus, price: `📍 ${t.region}: ${displayCity}`, trend: 'highlight', icon: '📡' },
      { label: data.mandi, price: t.current_session, trend: 'highlight', icon: '🏪' },
      { label: data.crops[0], price: '₹' + (Math.floor(Math.random() * 2000) + 2000), change: '+1.2%', trend: 'up', icon: data.icon },
      { label: data.crops[1], price: '₹' + (Math.floor(Math.random() * 1000) + 1500), change: '-0.5%', trend: 'down', icon: '📈' },
      { label: data.crops[2], price: t.steady, trend: 'neutral', icon: '🤝' },
      { label: t.weather_alert, price: `${t.optimized} ` + data.crops[0], trend: 'up', icon: '🌤️' },
    ];
  }, [selectedDistrict, cityName, language]);

  useEffect(() => {
    if (globalLocation.lat && globalLocation.lon) {
        const city = globalLocation.city;
        const districts = Object.keys(districtDatabaseEN);
        const match = districts.find(d => 
            city.toLowerCase().includes(d.toLowerCase()) || 
            d.toLowerCase().includes(city.toLowerCase())
        );
        if (match) {
            setSelectedDistrict(match);
            setCityName(globalLocation.village ? `${globalLocation.village}${match}` : match);
        } else {
            setCityName(city);
            setSelectedDistrict("Kolhapur");
        }
        setIsLoading(false);
    }
  }, [globalLocation]);

  const renderItems = (prefix) => (
    <>
      {marketData.map((item, index) => (
        <div key={`${prefix}-${index}`} className={`ticker-item ${item.trend === 'highlight' ? 'region-glow' : ''} ${item.trend === 'alert' ? 'ticker-alert-flash' : ''}`}>
          <span className="ticker-icon">{item.icon}</span>
          <span className="ticker-name">{item.label}:</span>
          <span className="ticker-val">{item.price}</span>
          {item.change && (
            <span className={`ticker-change ${item.trend}`}>
              {item.change} {item.trend === 'up' ? '▲' : '▼'}
            </span>
          )}
          <span className="ticker-divider">|</span>
        </div>
      ))}
    </>
  );

  return (
    <div className="clean-ticker-hub">
      <div className="ticker-intro">
        <div className="live-dot-pulse"></div>
        <span className="ticker-title">{t.live_pulse}</span>
        
        <div className="selector-wrap">
          <FiNavigation className="loc-pin-icon" />
          <select 
              className="clean-district-select" 
              value={selectedDistrict} 
              onChange={(e) => {
                  setSelectedDistrict(e.target.value);
                  setCityName(e.target.value);
              }}
          >
              {Object.keys(db).map(district => (
                  <option key={district} value={district}>{language === 'mr' ? db[district].name : district}</option>
              ))}
          </select>
          <div className="custom-arrow"></div>
        </div>
      </div>
      
      <div className="ticker-viewport-clean">
        <div className={`scroll-track ${isLoading ? 'loading-fade' : ''}`}>
          {renderItems('set1')}
          {renderItems('set2')}
          {renderItems('set3')}
          {renderItems('set4')}
        </div>
      </div>

      <style>{`
        .clean-ticker-hub {
          width: 100%;
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          position: sticky;
          top: 0;
          z-index: 1000;
          display: flex;
          height: 50px;
          align-items: center;
        }

        .ticker-intro {
          display: flex;
          align-items: center;
          padding: 0 25px;
          gap: 15px;
          border-right: 1px solid #e2e8f0;
          height: 100%;
        }

        .live-dot-pulse {
          width: 8px; height: 8px;
          background: #10b981;
          border-radius: 50%;
          animation: simple-pulse 2s infinite;
        }
        @keyframes simple-pulse {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
          70% { box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }

        .ticker-title {
          font-size: 0.75rem;
          font-weight: 800;
          color: #1e293b;
          letter-spacing: 0.5px;
          white-space: nowrap;
        }

        .selector-wrap {
          background: #f0fdf4;
          padding: 6px 16px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid #dcfce7;
          position: relative;
          transition: all 0.3s ease;
        }
        .selector-wrap:hover {
          border-color: #10b981;
          background: #dbffea;
        }
        .loc-pin-icon {
          color: #10b981;
          font-size: 0.8rem;
        }
        .clean-district-select {
          background: transparent; border: none; outline: none;
          font-size: 0.75rem; font-weight: 800; color: #166534;
          cursor: pointer;
          padding-right: 15px;
          appearance: none;
        }
        .custom-arrow {
          position: absolute;
          right: 12px;
          width: 0; height: 0;
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-top: 5px solid #166534;
          pointer-events: none;
        }

        [data-theme="dark"] .selector-wrap { 
          background: rgba(16, 185, 129, 0.05); 
          border-color: rgba(16, 185, 129, 0.1); 
        }
        [data-theme="dark"] .clean-district-select { color: #10b981; }
        [data-theme="dark"] .custom-arrow { border-top-color: #10b981; }
        [data-theme="dark"] .selector-wrap:hover { background: rgba(16, 185, 129, 0.1); }

        .ticker-viewport-clean {
          flex: 1;
          overflow: hidden;
          display: flex;
          align-items: center;
        }

        .clean-ticker-hub:hover .scroll-track {
          animation-play-state: paused;
          cursor: pointer;
        }

        .scroll-track {
          display: flex; white-space: nowrap;
          animation: smooth-scroll 60s linear infinite;
        }
        @keyframes smooth-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }

        .ticker-item {
          display: flex; align-items: center;
          padding: 0 35px; gap: 8px;
        }
        .ticker-icon { font-size: 1rem; }
        .ticker-name { font-size: 0.75rem; color: #94a3b8; font-weight: 600; }
        .ticker-val { font-size: 0.8rem; color: #1e293b; font-weight: 700; }
        .ticker-change { font-size: 0.7rem; font-weight: 800; }
        .ticker-change.up { color: #059669; }
        .ticker-change.down { color: #dc2626; }
        .ticker-divider { color: #e2e8f0; margin: 0 10px; font-weight: 300; }

        [data-theme="dark"] .clean-ticker-hub { background: #0f172a; border-color: #1e293b; }
        [data-theme="dark"] .ticker-intro { border-color: #1e293b; }
        [data-theme="dark"] .ticker-title { color: #f8fafc; }
        [data-theme="dark"] .selector-wrap { background: #1e293b; }
        [data-theme="dark"] .clean-district-select { color: #94a3b8; }
        [data-theme="dark"] .ticker-val { color: #f8fafc; }
        [data-theme="dark"] .ticker-divider { color: #1e293b; }
      `}</style>
    </div>
  );
};

export default AgroTicker;
