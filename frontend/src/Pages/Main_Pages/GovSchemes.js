import React, { useContext, useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    FiArrowLeft, FiCheckCircle, FiExternalLink, FiFileText, FiGift, FiShield, 
    FiSun, FiSettings, FiSearch, FiFilter, FiInfo, FiTruck, FiDroplet, FiBriefcase, FiHeart, FiCloudRain, FiZap, FiMapPin 
} from 'react-icons/fi';
import { MainContext } from '../../context/agroguru_context';
import '../../Styles/Home_page_ui.css';

const REGIONS_DATA = {
    "Vidarbha": {
        focus_en: "Cotton & Soybean Ecosystem",
        focus_mr: "कापूस आणि सोयाबीन इकोसिस्टम",
        desc_en: "Prioritizing Pokra and debt-relief schemes for cotton growers.",
        desc_mr: "कापूस उत्पादकांसाठी पोकरा आणि कर्जमाफी योजनांना प्राधान्य.",
        icon: "🚜"
    },
    "Marathwada": {
        focus_en: "Drought Resilience & Pulses",
        focus_mr: "दुष्काळ निवारण आणि कडधान्ये",
        desc_en: "Focusing on Jalyukt Shivar 2.0 and Silk-worm rearing grants.",
        desc_mr: "जलयुक्त शिवार २.० आणि रेशीम उद्योग अनुदानावर भर.",
        icon: "💧"
    },
    "Konkan": {
        focus_en: "Horticulture & Fishery",
        focus_mr: "फळबाग आणि मत्स्यव्यवसाय",
        desc_en: "Haphy (Mango) and Cashew plantation 100% subsidies available.",
        desc_mr: "हापूस आंबा आणि काजू लागवडीसाठी १००% अनुदान उपलब्ध.",
        icon: "🥭"
    },
    "Paschim Maharashtra": {
        focus_en: "Sugarcane & Dairy Hub",
        focus_mr: "ऊस आणि दुग्धव्यवसाय केंद्र",
        desc_en: "Drip irrigation and Cold-storage subsidies are peaking here.",
        desc_mr: "ठिबक सिंचन आणि शीतगृह अनुदानाचा येथे मोठा लाभ.",
        icon: "🥛"
    },
    "Khandesh": {
        focus_en: "Banana & Onion Belt",
        focus_mr: "केळी आणि कांदा पट्टा",
        desc_en: "Special grants for pack-houses and export-quality banana units.",
        desc_mr: "पॅक-हाऊस आणि निर्यातक्षम केळी युनिट्ससाठी विशेष निधी.",
        icon: "🍌"
    }
};

const SCHEMES = [
    { id: 1, title_en: "PM-Kisan Samman Nidhi", title_mr: "प्रधानमंत्री किसान सन्मान निधी", benefit_en: "₹6,000 per year", benefit_mr: "दरवर्षी ६,००० रुपये", category: "Income", docs: ["Aadhar Card", "7/12 Extract"], icon: <FiGift /> },
    { id: 2, title_en: "Namo Shetkari Mahasanman", title_mr: "नमो शेतकरी महासन्मान निधी", benefit_en: "Additional ₹6,000 (State)", benefit_mr: "अतिरिक्त ६,००० रुपये (राज्य)", category: "Income", docs: ["Aadhar Card", "PM-Kisan ID"], icon: <FiCheckCircle /> },
    { id: 3, title_en: "PM Fasal Bima Yojana", title_mr: "प्रधानमंत्री पीक विमा योजना", benefit_en: "Crop loss protection", benefit_mr: "पिकांच्या नुकसानीसाठी विमा", category: "Insurance", docs: ["Sowing Certificate", "Passbook"], icon: <FiShield /> },
    { id: 4, title_en: "Gopinath Munde Accident Insurance", title_mr: "गोपीनाथ मुंडे शेतकरी अपघात विमा", benefit_en: "₹2 Lakh cover", benefit_mr: "२ लाख मोबदला", category: "Insurance", docs: ["Death Certificate", "FIR Copy"], icon: <FiHeart /> },
    { id: 5, title_en: "Weather Based Insurance (WBCIS)", title_mr: "हवामान आधारित पीक विमा योजना", benefit_en: "Extreme weather payout", benefit_mr: "हवामान डेटावर आधारित विमा", category: "Insurance", docs: ["Land Records", "8A Extract"], icon: <FiCloudRain /> },
    { id: 6, title_en: "Livestock Insurance Scheme", title_mr: "पशुधन विमा योजना", benefit_en: "Cattle/Sheep market cover", benefit_mr: "जनावरांसाठी विमा संरक्षण", category: "Insurance", docs: ["Health Cert", "Tagging"], icon: <FiZap /> },
    { id: 7, title_en: "Nanaji Deshmukh (Pokra)", title_mr: "नानाजी देशमुख कृषी संजीवनी (Pokra)", benefit_en: "Climate resilient farming", benefit_mr: "हवामान अनुकूल शेती", category: "Regional", docs: ["Soil Health Card", "Aadhar"], icon: <FiSettings /> },
    { id: 8, title_en: "Jalyukt Shivar 2.0", title_mr: "जलयुक्त शिवार अभियान २.०", benefit_en: "Village water decentralization", benefit_mr: "गाव पाणी टंचाईमुक्त अनुदान", category: "Regional", docs: ["Gram Panchayat Resolution"], icon: <FiDroplet /> },
    { id: 9, title_en: "Baliraja Sanjeevani Yojana", title_mr: "बळीराजा संजीवनी योजना", benefit_en: "Irrigation project setup", benefit_mr: "सिंचन प्रकल्पांसाठी निधी", category: "Regional", docs: ["Irrigation Approval"], icon: <FiBriefcase /> },
    { id: 10, title_en: "Silk Worm Rearing (Silk Hub)", title_mr: "रेशीम उद्योग अनुदान", benefit_en: "Shed and Equipment Grant", benefit_mr: "संगोपन गृह आणि साहित्य", category: "Regional", docs: ["Training Cert", "Land Records"], icon: <FiTruck /> },
    { id: 11, title_en: "Solar Pump (KUSUM)", title_mr: "सौर पंप योजना (कुसुम)", benefit_en: "Off-grid irrigation (90%)", benefit_mr: "सौर सिंचन (९०% अनुदान)", category: "Subsidy", docs: ["Electricity Dept NOC"], icon: <FiSun /> },
    { id: 12, title_en: "Drip/Sprinkler Subsidy", title_mr: "ठिबक आणि तुषार सिंचन सवलत", benefit_en: "Water saving equipment", benefit_mr: "आधुनिक सिंचन संच अनुदान", category: "Subsidy", docs: ["Vendor Bill", "8A Extract"], icon: <FiDroplet /> }
];

const GovSchemes = () => {
    const { language, location: globalLocation } = useContext(MainContext);
    const isMr = language === 'mr';
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState("All");
    const [selectedRegion, setSelectedRegion] = useState("Vidarbha");

    // Auto-detect region if possible
    useEffect(() => {
        if (globalLocation.city) {
            const city = globalLocation.city.toLowerCase();
            if (city.includes("nagpur") || city.includes("amravati") || city.includes("akola")) setSelectedRegion("Vidarbha");
            else if (city.includes("latur") || city.includes("aurangabad") || city.includes("nanded")) setSelectedRegion("Marathwada");
            else if (city.includes("pune") || city.includes("kolhapur") || city.includes("solapur")) setSelectedRegion("Paschim Maharashtra");
            else if (city.includes("nashik") || city.includes("jalgaon") || city.includes("dhule")) setSelectedRegion("Khandesh");
            else if (city.includes("ratnagiri") || city.includes("mumbai") || city.includes("thane")) setSelectedRegion("Konkan");
        }
    }, [globalLocation]);

    const filteredSchemes = useMemo(() => {
        return SCHEMES.filter(s => {
            const matchesSearch = s.title_en.toLowerCase().includes(search.toLowerCase()) || s.title_mr.toLowerCase().includes(search.toLowerCase());
            const matchesTab = activeTab === "All" || s.category === activeTab;
            return matchesSearch && matchesTab;
        });
    }, [search, activeTab]);

    const categories = ["All", "Insurance", "Regional", "Income", "Subsidy"];

    return (
        <div className="schemes-page fade-in" style={{ paddingTop: '100px', paddingBottom: '100px', transition: '0.5s' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
                <div className="back-nav-container">
                    <Link to="/services" className="elite-back-btn">
                        <FiArrowLeft /> {isMr ? 'परत जा' : 'Return to Hub'}
                    </Link>
                </div>

                <div className="schemes-header" style={{ marginBottom: '50px' }}>
                    <div className="badge-premium" style={{ display: 'inline-block', marginBottom: '15px' }}>OFFICIAL INTELLIGENCE</div>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: 950, marginBottom: '15px' }}>
                        {isMr ? 'शासकीय योजना' : 'Government'} <span style={{ color: 'var(--primary)' }}>{isMr ? 'मदत केंद्र' : 'Support Hub'}</span>
                    </h1>
                    <p style={{ opacity: 0.6, fontSize: '1.2rem', maxWidth: '850px' }}>
                        {isMr ? 'महाराष्ट्रातील सर्व शासकीय मदत, विमा आणि प्रादेशिक योजनांचे एकात्मिक डॅशबोर्ड.' : 'An integrated dashboard for all Maharashtra state support, insurance, and regional welfare programs.'}
                    </p>
                </div>

                {/* Region Selector Engine */}
                <div className="region-selector-wrap glass-premium" style={{ padding: '30px', borderRadius: '30px', marginBottom: '40px', border: '1px solid rgba(59, 130, 246, 0.3)', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), transparent)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ background: '#3b82f6', width: '55px', height: '55px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', color: 'white' }}>
                                {REGIONS_DATA[selectedRegion].icon}
                            </div>
                            <div>
                                <h4 style={{ fontSize: '1.2rem', fontWeight: 950, marginBottom: '2px' }}>
                                    {isMr ? 'प्रादेशिक लक्ष:' : 'Regional Focus:'} {selectedRegion}
                                </h4>
                                <p style={{ opacity: 0.7, fontSize: '0.9rem', color: '#60a5fa', fontWeight: 700 }}>
                                    {isMr ? REGIONS_DATA[selectedRegion].focus_mr : REGIONS_DATA[selectedRegion].focus_en}
                                </p>
                            </div>
                        </div>
                        
                        <div className="region-chips" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            {Object.keys(REGIONS_DATA).map(region => (
                                <button 
                                    key={region}
                                    onClick={() => setSelectedRegion(region)}
                                    className={`region-chip ${selectedRegion === region ? 'active' : ''}`}
                                    style={{ 
                                        padding: '10px 20px', 
                                        borderRadius: '15px', 
                                        border: '1px solid rgba(255,255,255,0.1)', 
                                        background: selectedRegion === region ? '#3b82f6' : 'rgba(255,255,255,0.03)',
                                        color: 'white',
                                        fontSize: '0.8rem',
                                        fontWeight: 800,
                                        cursor: 'pointer',
                                        transition: '0.3s'
                                    }}
                                >
                                    {region}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div style={{ marginTop: '20px', padding: '15px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <p style={{ fontSize: '0.9rem', opacity: 0.6, fontWeight: 600 }}>
                             <FiInfo style={{ marginRight: '8px', color: '#3b82f6' }} />
                             {isMr ? REGIONS_DATA[selectedRegion].desc_mr : REGIONS_DATA[selectedRegion].desc_en}
                        </p>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="schemes-controls glass-premium" style={{ padding: '25px', borderRadius: '30px', marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', flexWrap: 'wrap', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    <div className="scheme-tabs" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {categories.map(tab => (
                            <button 
                                key={tab} 
                                onClick={() => setActiveTab(tab)}
                                className={`scheme-tab-btn ${activeTab === tab ? 'active' : ''}`}
                                style={{ padding: '12px 22px', borderRadius: '50px', border: 'none', background: activeTab === tab ? 'var(--primary)' : 'rgba(255,255,255,0.05)', color: 'white', fontWeight: 800, cursor: 'pointer', transition: '0.3s', fontSize: '0.8rem' }}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="scheme-search" style={{ position: 'relative', flex: 1, maxWidth: '450px' }}>
                        <FiSearch style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5, color: 'var(--primary)' }} />
                        <input 
                            type="text" 
                            placeholder={isMr ? "शोध इंजिन..." : "Search intelligence..."} 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ width: '100%', padding: '18px 18px 18px 55px', borderRadius: '18px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none', fontSize: '1rem' }}
                        />
                    </div>
                </div>

                <div className="schemes-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '25px' }}>
                    {filteredSchemes.map(scheme => (
                        <div key={scheme.id} className="scheme-card glass-premium" style={{ padding: '40px', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', display: 'flex', flexDirection: 'column', minHeight: '520px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                                <div className="scheme-icon-wrap" style={{ fontSize: '2.5rem', color: scheme.category === 'Insurance' ? '#3b82f6' : 'var(--primary)', background: 'rgba(255,255,255,0.03)', width: '75px', height: '75px', borderRadius: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    {scheme.icon}
                                </div>
                                <div className="category-tag-v2" style={{ fontSize: '0.65rem', fontWeight: 950, background: scheme.category === 'Insurance' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)', color: scheme.category === 'Insurance' ? '#60a5fa' : 'var(--primary)', padding: '6px 16px', borderRadius: '50px', letterSpacing: '1px' }}>
                                    {scheme.category.toUpperCase()}
                                </div>
                            </div>

                            <h3 style={{ fontSize: '1.8rem', fontWeight: 950, marginBottom: '20px', lineHeight: 1.3 }}>{isMr ? scheme.title_mr : scheme.title_en}</h3>
                            
                            <div className="benefit-status" style={{ padding: '25px', background: 'rgba(255,255,255,0.02)', borderRadius: '25px', marginBottom: '30px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                    <FiCheckCircle style={{ color: 'var(--primary)' }} />
                                    <span style={{ fontSize: '0.75rem', fontWeight: 900, letterSpacing: '1px', opacity: 0.5 }}>HUB INSIGHT</span>
                                </div>
                                <p style={{ fontWeight: 800, fontSize: '1.2rem', color: '#fff' }}>{isMr ? scheme.benefit_mr : scheme.benefit_en}</p>
                            </div>

                            <div style={{ marginBottom: '35px', flex: 1 }}>
                                <p style={{ fontSize: '0.7rem', fontWeight: 900, marginBottom: '15px', opacity: 0.4, letterSpacing: '1px' }}>VERIFICATION NODES:</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                    {scheme.docs.map(doc => (
                                        <div key={doc} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', background: 'rgba(255,255,255,0.04)', padding: '10px 18px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.08)', fontWeight: 700 }}>
                                            {doc}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <a href="https://mahadbt.maharashtra.gov.in/Farmer/Main/Index" target="_blank" rel="noreferrer" className="apply-btn-elite" style={{ padding: '22px', borderRadius: '25px', background: scheme.category === 'Insurance' ? '#3b82f6' : 'var(--primary)', color: 'white', fontWeight: 950, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', fontSize: '1.1rem', transition: '0.4s' }}>
                                {isMr ? 'पोर्टलवर लॉगिन करा' : 'LOGIN TO APPLY'} <FiExternalLink />
                            </a>
                        </div>
                    ))}
                </div>
            </div>
            <style>{`
                .glass-premium { background: rgba(255, 255, 255, 0.01); backdrop-filter: blur(30px); }
                .scheme-card { transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1); }
                .scheme-card:hover { transform: translateY(-15px); border-color: rgba(255,255,255,0.2) !important; background: rgba(255, 255, 255, 0.03) !important; box-shadow: 0 40px 80px rgba(0,0,0,0.6); }
                .region-chip:hover { border-color: #3b82f6 !important; background: rgba(59, 130, 246, 0.1) !important; }
                .region-chip.active { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
                .scheme-tab-btn.active { color: white !important; transform: scale(1.05); }
                .apply-btn-elite:hover { letter-spacing: 1px; transform: translateY(-2px); box-shadow: 0 10px 30px rgba(0,0,0,0.4); }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .scheme-card { animation: fadeIn 0.6s ease forwards; }
            `}</style>
        </div>
    );
};

export default GovSchemes;
