import React, { useState, useEffect, useMemo, memo, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiArrowLeft, FiMapPin, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import '../../Styles/Home_page_ui.css';
import { factoryData, generateRegionalData } from '../../utils/marketData';
import { MainContext } from '../../context/agroguru_context';
import MarketChart from '../../Component/MarketChart';

const MAHARASHTRA_DISTRICTS = [
  "Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", "Buldhana", "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar", "Nashik", "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"
];

const DISTRICT_MAP = {
  "Ahmednagar": "अहमदनगर", "Akola": "अकोला", "Amravati": "अमरावती", "Aurangabad": "छत्रपती संभाजीनगर",
  "Beed": "बीड", "Bhandara": "भंडारा", "Buldhana": "बुलढाणा", "Chandrapur": "चंद्रपूर",
  "Dhule": "धुळे", "Gadchiroli": "गडचिरोली", "Gondia": "गोंदिया", "Hingoli": "हिंगोली",
  "Jalgaon": "जळगाव", "Jalna": "जालना", "Kolhapur": "कोल्हापूर", "Latur": "लातूर",
  "Mumbai City": "मुंबई शहर", "Mumbai Suburban": "मुंबई उपनगर", "Nagpur": "नागपूर",
  "Nanded": "नांदेड", "Nandurbar": "नंदुरबार", "Nashik": "नाशिक", "Osmanabad": "धाराशिव",
  "Palghar": "पालघर", "Parbhani": "परभणी", "Pune": "पुणे", "Raigad": "रायगड",
  "Ratnagiri": "रत्नागिरी", "Sangli": "सांगली", "Satara": "सातारा", "Sindhudurg": "सिंधुदुर्ग",
  "Solapur": "सोलापूर", "Thane": "ठाणे", "Wardha": "वर्धा", "Washim": "वाशिम", "Yavatmal": "यवतमाळ"
};

const STATUS_MAP = {
  "Premium Payout": "प्रीमियम पेमेंट",
  "Active": "सक्रिय",
  "Fast Pay": "जलद पेमेंट",
  "Stable": "स्थिर",
  "Top Payout": "उच्च पेमेंट",
  "High Demand": "मोठी मागणी",
  "Market Leader": "बाजार नेतृत्व",
  "Premium": "प्रीमियम",
  "Regional Hub": "प्रादेशिक हब",
  "Global Hub": "जागतिक हब",
  "Regional": "प्रादेशिक",
  "Pulse Hub": "कडधान्य हब",
  "White Gold": "पांढरे सोने",
  "Regional Star": "प्रादेशिक स्टार",
  "Regional Yard": "प्रादेशिक यार्ड"
};

const SUGGESTED_HUBS = ["Nashik", "Pune", "Kolhapur", "Nagpur", "Solapur"];

const Sparkline = memo(({ data, color = "#4ade80" }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 100;
  const height = 40;

  const points = data.map((d, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - ((d - min) / range) * (height - 10) - 5
  }));

  let path = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const cp1x = points[i].x + (points[i + 1].x - points[i].x) / 2;
    path += ` C ${cp1x},${points[i].y} ${cp1x},${points[i+1].y} ${points[i+1].x},${points[i + 1].y}`;
  }

  const fillPath = `${path} L ${width},${height} L 0,${height} Z`;

  return (
    <div className="sparkline-container">
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id={`glow-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={fillPath} fill={`url(#glow-${color.replace('#','')})`} />
        <path d={path} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
});

const TRANSLATIONS = {
  en: {
    return_btn: "Return to Hub",
    sur_title: "Real-Time Revenue Advisor",
    hero_title: "Smart Price",
    hero_span: "Comparison Hub",
    hero_p: "The state-wide intelligence engine helping farmers maximize every harvest and payout.",
    rev_estimator: "Revenue Estimator",
    your_yield: "YOUR YIELD",
    network_title: "Current Network",
    change_btn: "CHANGE",
    loc_required: "Location Access Required",
    detecting: "Detecting Maharashtra...",
    syncing: "Syncing Intelligence...",
    stable: "Connection Optimized",
    failed: "Signal Interrupted (Fix Now)",
    tab_sugar: "🎋 Sugar Factories",
    tab_buffalo_milk: "🐃 Buffalo Milk",
    tab_cow_milk: "🐄 Cow Milk",
    tab_crops: "🚜 Other Crops",
    th_name: "Unit / Mandi Name",
    th_dist: "City",
    th_rate: "Current Rate",
    th_revenue: "Total Revenue (Est.)",
    th_trend: "7-Day Trend",
    th_status: "Platform Status",
    best_region: "BEST IN YOUR REGION",
    unit_tons: "Tons",
    unit_litres: "Litres",
    unit_quintals: "Quintals",
    insight_sugar: "Data Source: Rates reflect the Govt of India's mandated Fair & Remunerative Price (FRP) of ₹340/quintal (10.25% recovery), adjusted for local factory premiums.",
    insight_milk: "Market insight: Buffalo milk premiums are currently 15% higher in the Kolhapur dairy belt.",
    insight_onion: "Market insight: Onion export demand is driving record high rates in Nashik mandis today.",
    modal_title: "Holographic",
    modal_span: "District Hub",
    modal_p: "Synchronizing market intelligence for your region",
    search_dist: "Search Maharashtra Districts...",
    cancel_btn: "Cancel Selection",
    no_dist: "No districts found matching"
  },
  mr: {
    return_btn: "मुख्य केंद्रावर परत जा",
    sur_title: "रिअल-टाइम महसूल सल्लागार",
    hero_title: "स्मार्ट किंमत",
    hero_span: "तुलना हब",
    hero_p: "शेतकऱ्यांना प्रत्येक पिकातून जास्तीत जास्त मोबदला मिळवून देण्यास मदत करणारे राज्यव्यापी इंटेलिजन्स इंजिन.",
    rev_estimator: "महसूल अंदाजक",
    your_yield: "तुमचे उत्पादन",
    network_title: "सध्याचे नेटवर्क",
    change_btn: "बदला",
    loc_required: "स्थान अ‍ॅक्सेस आवश्यक",
    detecting: "महाराष्ट्र शोधत आहे...",
    syncing: "माहिती सिंक करत आहे...",
    stable: "कनेक्शन ऑप्टिमाइझ झाले",
    failed: "सिग्नल व्यत्यय (आत्ताच नीट करा)",
    tab_sugar: "🎋 साखर कारखाने",
    tab_buffalo_milk: "🐃 म्हशीचे दूध",
    tab_cow_milk: "🐄 गाईचे दूध",
    tab_crops: "🚜 इतर पिके",
    th_name: "युनिट / मंडीचे नाव",
    th_dist: "शहर",
    th_rate: "चालू दर",
    th_revenue: "एकूण महसूल (अंदाज)",
    th_trend: "७-दिवसांचा ट्रेंड",
    th_status: "प्लॅटफॉर्म स्थिती",
    best_region: "तुमच्या प्रदेशात सर्वोत्तम",
    unit_tons: "टन",
    unit_litres: "लिटर",
    unit_quintals: "क्विंटल",
    insight_sugar: "डेटा स्रोत: हे दर भारत सरकारच्या निर्धारित 'एफआरपी' (FRP - ₹३४०/क्विंटल) आणि स्थानिक कारखान्यांच्या प्रीमियमवर आधारित आहेत.",
    insight_milk: "बाजार माहिती: कोल्हापूर दूध पट्ट्यात म्हशीच्या दुधाचा प्रीमियम सध्या १५% जास्त आहे.",
    insight_onion: "बाजार माहिती: नाशिकच्या मंडईंमध्ये कांद्याच्या निर्यातीच्या मागणीमुळे दरांनी उच्चांक गाठला आहे.",
    modal_title: "होलोग्राफिक",
    modal_span: "जिल्हा हब",
    modal_p: "तुमच्या प्रदेशासाठी बाजार माहिती सिंक करत आहे",
    search_dist: "महाराष्ट्र जिल्हे शोधत आहे...",
    cancel_btn: "निवड रद्द करा",
    no_dist: "या नावाने जिल्हा सापडला नाही"
  }
};

const SmartPriceHub = () => {
  const { language, location: globalLocation } = useContext(MainContext);
  const t = TRANSLATIONS[language || 'en'];
  const [activeTab, setActiveTab] = useState('sugar');
  const [yieldAmount, setYieldAmount] = useState(0);
  const [currentCity, setCurrentCity] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [distSearch, setDistSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (globalLocation.city && globalLocation.city !== 'Detecting...') {
      setCurrentCity(globalLocation.city);
      setConnectionStatus('stable');
    }
  }, [globalLocation]);

  const totalValue = (price) => {
    const val = parseFloat(price) * yieldAmount;
    if (val > 100000) return `₹${(val / 100000).toFixed(2)} L`;
    return `₹${val.toLocaleString()}`;
  };

  const formatPrice = (price) => {
      const p = parseFloat(price);
      return p % 1 === 0 ? p.toLocaleString() : p.toFixed(2);
  };

  const filteredDistricts = useMemo(() => 
    MAHARASHTRA_DISTRICTS.filter(d => {
      const searchLower = distSearch.toLowerCase();
      const mrName = DISTRICT_MAP[d] || "";
      return d.toLowerCase().includes(searchLower) || mrName.toLowerCase().includes(searchLower);
    })
  , [distSearch]);

  const getDistrictDisplay = (d) => language === 'mr' ? (DISTRICT_MAP[d] || d) : d;

  const translateStatus = (status) => {
    if (language !== 'mr') return status;
    const cleanStatus = status.replace(/[💎🏆]/g, '').trim();
    const translated = STATUS_MAP[cleanStatus] || cleanStatus;
    if (status.includes('💎')) return `💎 ${translated}`;
    if (status.includes('🏆')) return `🏆 ${translated}`;
    return translated;
  };

  return (
    <div className="price-hub-page" style={{ paddingTop: '80px', display: 'flex', flexDirection: 'column' }}>
      <div className="back-nav-container">
         <Link to="/services" className="elite-back-btn">
            <FiArrowLeft /> {t.return_btn}
         </Link>
      </div>

      <div className="hub-hero">
        <div className="hero_content_premium">
            <span className="sur-title">{t.sur_title}</span>
            <h1>{t.hero_title} <span>{t.hero_span}</span></h1>
            <p>{t.hero_p}</p>
        </div>
      </div>

      <div className="hub-container-premium">
        <div className="hub-top-belt">
            <div className="calculator-card-premium">
              <div className="calc-header">
                  <span className="calc-icon">💰</span>
                  <h4>{t.rev_estimator}</h4>
              </div>
              <div className="calc-body">
                <div className="input-group-modern">
                    <label>{t.your_yield}</label>
                    <div className="input-field-wrap">
                        <input 
                          type="text" 
                          value={yieldAmount === 0 ? '' : yieldAmount.toLocaleString()} 
                          onChange={(e) => {
                            const raw = e.target.value.replace(/,/g, '');
                            if (raw === '') {
                              setYieldAmount(0);
                              return;
                            }
                            if (raw.length <= 5 && !isNaN(raw)) {
                              setYieldAmount(parseFloat(raw));
                            }
                          }}
                          placeholder="0,000"
                        />
                        <span className="unit-label">{activeTab === 'sugar' ? t.unit_tons : activeTab.includes('milk') ? t.unit_litres : t.unit_quintals}</span>
                    </div>
                </div>
              </div>
            </div>

            <div className="location-card-premium">
                <div className="loc-header" style={{ justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span className="loc-icon">🌍</span>
                        <h4>{t.network_title}</h4>
                    </div>
                    <button className="ultra-action-btn" onClick={() => setIsManualOpen(true)}>
                        <FiMapPin className="btn-icon-pulse" /> {t.change_btn}
                    </button>
                </div>
                <div className="loc-body">
                    <p className="loc-name">{currentCity || (connectionStatus === 'failed' ? t.loc_required : t.detecting)}</p>
                    <div 
                      className={`loc-status-pill ${connectionStatus} ${connectionStatus === 'failed' ? 'interactive' : ''}`}
                      onClick={() => connectionStatus === 'failed' && setIsManualOpen(true)}
                    >
                      <span className="pulse-dot"></span>
                      <span>
                        {connectionStatus === 'connecting' && t.syncing}
                        {connectionStatus === 'stable' && t.stable}
                        {connectionStatus === 'failed' && t.failed}
                      </span>
                    </div>
                </div>
            </div>
        </div>

        <div className="tab-switcher-modern">
          <button className={`tab-btn-modern ${activeTab === 'sugar' ? 'active' : ''}`} onClick={() => setActiveTab('sugar')}>{t.tab_sugar}</button>
          <button className={`tab-btn-modern ${activeTab === 'buffalo_milk' ? 'active' : ''}`} onClick={() => setActiveTab('buffalo_milk')}>{t.tab_buffalo_milk}</button>
          <button className={`tab-btn-modern ${activeTab === 'cow_milk' ? 'active' : ''}`} onClick={() => setActiveTab('cow_milk')}>{t.tab_cow_milk}</button>
          <button className={`tab-btn-modern ${activeTab === 'crops' ? 'active' : ''}`} onClick={() => setActiveTab('crops')}>{t.tab_crops}</button>
        </div>

        {/* MARKET ANALYTICS SECTION */}
        <div className="market-insights-row">
            <MarketChart 
                cropName={activeTab === 'sugar' ? 'Sugarcane FRP' : activeTab === 'buffalo_milk' ? 'Buffalo Milk' : activeTab === 'cow_milk' ? 'Cow Milk' : 'Red Onion'} 
                data={activeTab === 'sugar' ? [2800, 2850, 2790, 2900, 2950, 3100, 3050] : activeTab === 'cow_milk' ? [34, 35, 34, 36, 36, 36, 37] : [55, 58, 54, 60, 62, 65, 68]} 
                color={activeTab === 'sugar' ? '#10b981' : '#3b82f6'}
            />
            <div className="insight-pulse-brick glass">
                <FiTrendingUp className="pulse-icon" />
                <h4>Volatility Scan</h4>
                <p>Demand is surging by 18% in the {currentCity || 'regional'} export belt. Experts advise holding stock.</p>
            </div>
        </div>

        <div className="table-stage-premium">
          <table className="premium-modern-table">
            <thead>
              <tr>
                <th>{t.th_name}</th>
                <th>{t.th_dist}</th>
                <th>{t.th_rate}</th>
                <th>{t.th_revenue}</th>
                <th className="trend-th">{t.th_trend}</th>
                <th className="status-th">{t.th_status}</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const district = currentCity || "Maharashtra";
                let data = generateRegionalData(district, activeTab.includes('milk') ? 'milk' : activeTab);

                if (activeTab === 'buffalo_milk') {
                    data = data.filter(d => d.type && d.type.toLowerCase().includes('buffalo'));
                } else if (activeTab === 'cow_milk') {
                    data = data.filter(d => d.type && d.type.toLowerCase().includes('cow'));
                }

                if (currentCity) {
                  const cityLower = currentCity.toLowerCase();
                  data.sort((a, b) => {
                    const aMatch = a.location.toLowerCase().includes(cityLower);
                    const bMatch = b.location.toLowerCase().includes(cityLower);
                    if (aMatch && !bMatch) return -1;
                    if (!aMatch && bMatch) return 1;
                    return 0;
                  });
                }

                return data.map((item, index) => {
                  const isBestNearMe = currentCity && item.location.toLowerCase().includes(currentCity.toLowerCase());
                  const trendColor = item.trends[6] >= item.trends[0] ? "#4ade80" : "#f87171";
                  
                  return (
                    <tr key={index} className={`${item.status.includes('Leader') || item.status.includes('Premium') ? 'row-highlight' : ''} ${isBestNearMe ? 'row-nearby' : ''}`}>
                      <td className="cell-unit">
                          <div className="unit-info">
                              <span className="main-name">{item.name}</span>
                              {isBestNearMe && <span className="smart-tag">{t.best_region}</span>}
                          </div>
                      </td>
                      <td className="cell-dist">
                        <div className="dist-badge-modern">
                          <span className="dist-pin">📍</span>
                          {getDistrictDisplay(item.location.split(' ')[0])}
                        </div>
                      </td>
                      <td className="cell-rate">
                          <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>₹{formatPrice(item.price)}</div>
                          {(item.type || item.cycle) && (
                              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: '4px', fontWeight: 600 }}>
                                  {item.type || item.cycle}
                              </div>
                          )}
                      </td>
                      <td className="cell-total">{totalValue(item.price)}</td>
                      <td className="cell-trend">
                          <Sparkline data={item.trends} color={trendColor} />
                      </td>
                      <td className="cell-status">
                        <span className={`badge-premium ${item.status.toLowerCase().replace(' ', '-').replace(/[💎🏆]/g, '').trim()}`}>
                          {translateStatus(item.status)}
                        </span>
                      </td>
                    </tr>
                  );
                });
              })()}
            </tbody>
          </table>
        </div>

        <div className="hub-footer-premium">
            <div className="footer-tip-modern">
                <span className="tip-icon">✨</span>
                <p>
                    {activeTab === 'sugar' && t.insight_sugar}
                    {activeTab === 'milk' && t.insight_milk}
                    {activeTab === 'crops' && t.insight_onion}
                </p>
            </div>
        </div>
      </div>

      {isManualOpen && (
        <div className="hub-modal-backdrop" onClick={() => setIsManualOpen(false)}>
          <div className="hub-modal-content fade-in-up" onClick={e => e.stopPropagation()} style={{ maxWidth: '650px' }}>
            <div className="modal-header-premium">
              <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 950 }}>{t.modal_title} <span>{t.modal_span}</span></h2>
                <p style={{ opacity: 0.6, fontSize: '0.9rem', marginTop: '5px' }}>{t.modal_p}</p>
              </div>
              <button className="modal-close-btn" onClick={() => setIsManualOpen(false)}>×</button>
            </div>

            <div className="modal-gallery-search-wrap" style={{ padding: '20px 40px' }}>
                <div className="glass-search-box-modern" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '15px', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '15px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <span className="search-icon-mini" style={{ opacity: 0.5 }}>🔍</span>
                    <input 
                      type="text" 
                      placeholder={t.search_dist} 
                      autoFocus
                      style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', width: '100%', fontSize: '1rem' }}
                      value={distSearch}
                      onChange={(e) => setDistSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="district-gallery-grid-scroll">
              {filteredDistricts.length > 0 ? filteredDistricts.map(dist => (
                <div 
                  key={dist} 
                  className={`district-tilt-card ${currentCity === dist ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentCity(dist);
                    setConnectionStatus('stable');
                    setIsManualOpen(false);
                  }}
                >
                  <div className="tilt-icon-box">🏛️</div>
                  <span className="tilt-name">
                    {getDistrictDisplay(dist)}
                  </span>
                </div>
              )) : (
                <div style={{ padding: '60px 40px', textAlign: 'center', width: '100%', opacity: 0.5 }}>
                   <p>{t.no_dist} "{distSearch}"</p>
                </div>
              )}
            </div>

            <div className="modal-footer-premium" style={{ padding: '30px 40px' }}>
               <button className="back-btn-premium" style={{ width: '100%', padding: '15px', borderRadius: '15px', border: 'none', background: 'rgba(255,255,255,0.05)', color: 'white', fontWeight: 800, cursor: 'pointer' }} onClick={() => setIsManualOpen(false)}>
                  {t.cancel_btn}
               </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        /* MARKET INSIGHTS ROW */
        .market-insights-row {
            display: grid;
            grid-template-columns: 1.5fr 1fr;
            gap: 25px;
            margin-bottom: 40px;
        }

        .market-analyzer-brick {
            padding: 25px;
            border-radius: 24px;
            background: rgba(255,255,255,0.02);
            border: 1px solid rgba(255,255,255,0.05);
        }

        .analyzer-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 20px;
        }

        .analyzer-header small { color: #10b981; font-weight: 900; letter-spacing: 1px; }
        .analyzer-header h4 { font-size: 1.2rem; font-weight: 900; margin-top: 5px; }

        .trend-badge {
            padding: 6px 12px;
            border-radius: 50px;
            font-size: 0.8rem;
            font-weight: 800;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .trend-badge.up { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .trend-badge.down { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

        .chart-footer {
            display: flex;
            justify-content: space-between;
            margin-top: 15px;
            font-size: 0.75rem;
            color: rgba(255,255,255,0.3);
            font-weight: 700;
        }

        .insight-pulse-brick {
            padding: 30px;
            border-radius: 24px;
            background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(0,0,0,0.5));
            border: 1px solid rgba(16, 185, 129, 0.2);
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        .pulse-icon {
            font-size: 2.5rem;
            color: #10b981;
            margin-bottom: 20px;
            animation: pulse-ring 2s infinite;
        }

        @keyframes pulse-ring {
            0% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(1); opacity: 0.8; }
        }

        .insight-pulse-brick h4 { font-size: 1.3rem; font-weight: 950; margin-bottom: 10px; }
        .insight-pulse-brick p { color: rgba(255,255,255,0.5); font-weight: 600; line-height: 1.6; }

        @media (max-width: 900px) {
            .market-insights-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default SmartPriceHub;
