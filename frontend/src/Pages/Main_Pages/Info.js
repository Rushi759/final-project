import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiPlayCircle, FiMessageSquare, FiTrendingUp, FiMap, FiAward, FiCpu, FiPlus } from 'react-icons/fi';
import "../../Styles/Info_page_ui.css";
import { MainContext } from '../../context/agroguru_context';
import { AgroGPT, MarketTrends, SchemeExplorer } from '../../Component/IntelligenceComponents';
import Weather from '../../Component/Weather';
import News from '../../Component/News';

const TRANSLATIONS = {
    en: {
        hub_title: "Intelligence",
        hub_span: "Hub",
        return_btn: "Back to Services",
        academy_title: "Video Academy",
        academy_sub: "Master class tutorials for modern agriculture.",
        schemes_title: "Policy & Schemes",
        schemes_sub: "Government subsidies and insurance tracking.",
        stories_title: "Community Spotlight",
        stories_sub: "Real success stories from verified AgroGuru members.",
        demo_focus: "NEURAL ENGINE ACTIVE"
    },
    mr: {
        hub_title: "इंटेलिजन्स",
        hub_span: "हब",
        return_btn: "सेवेकडे परत",
        academy_title: "व्हिडिओ अकादमी",
        academy_sub: "आधुनिक शेतीसाठी मास्टर क्लास ट्यूटोरियल.",
        schemes_title: "धोरणे आणि योजना",
        schemes_sub: "सरकारी अनुदान आणि विमा ट्रॅकिंग.",
        stories_title: "कम्युनिटी स्पॉटलाइट",
        stories_sub: "सत्यापित ॲग्रोगुरू सदस्यांकडून यशोगाथा.",
        demo_focus: "न्यूरल इंजिन सक्रिय"
    }
};

const Info = () => {
    const { language } = useContext(MainContext);
    const t = TRANSLATIONS[language || 'en'];

    const videos = [
        { title: "The Future of Food", icon: "🍎", id: "tbkTi3zNN9s" },
        { title: "Smart Irrigation", icon: "💧", id: "pY-hU_W4_5s" },
        { title: "Organic Health", icon: "🌿", id: "nv_6W00_9E4" },
        { title: "Drone Science", icon: "🚁", id: "LqUoTM6TPr4" }
    ];

    const stories = [
        { name: "Rahul S.", yield: "+40%", text: language === 'mr' ? "AgroGPT च्या सल्ल्याने माझे उत्पादन ४०% वाढले." : "AgroGPT advice increased my yield by 40%." },
        { name: "Anita K.", yield: "₹50k saved", text: language === 'mr' ? "खत गणकयंत्रामुळे माझा हजारो रुपयांचा खर्च वाचला." : "Fertilizer Calc saved me thousands in input costs." }
    ];

    return (
        <div id="info_page_wrap" className="fade-in">
            <div className="hub-main-container">
                {/* Standardized Return to Hub Button */}
                <div className="back-nav-container">
                    <Link to="/services" className="elite-back-btn">
                        <FiArrowLeft /> {t.return_btn}
                    </Link>
                </div>

            {/* Fixed Centering & Alignment */}
            <header className="intelligence-hero-centered">
                <h1>{t.hub_title} <span>{t.hub_span}</span></h1>
                <div className="hero-divider-glow"></div>
            </header>

            <div className="bento-intelligence-grid">
                {/* 1. PRIMARY AI COMMAND DECK */}
                <div className="bento-item ai-command-deck">
                    <AgroGPT language={language} t={t} />
                </div>

                {/* 2. REAL-TIME ATMOSPHERIC DATA */}
                <div className="bento-item weather-stats">
                    <Weather />
                </div>

                {/* 3. COMMUNITY IMPACT BLOCK (WALL OF FAME) */}
                <div className="bento-item success-stories-mosaic">
                    <div className="section-title-box-compact">
                        <h3><FiAward /> Farmer Hall of Fame</h3>
                        <span className="live-badge-glow">COMMUNITY LIVE</span>
                    </div>
                    <div className="stories-wall-feed">
                        {[
                            { name: "Rahul Deshmukh", id: "#AGRU102", yield: "+35% Yield", crop: "Sugarcane", text: "AgroGPT advised on drip fertigation which saved my sugar crop in Solapur drought.", avatar: "RD" },
                            { name: "Sunita Patil", id: "#AGRU458", yield: "2.5x Profit", crop: "Grapes", text: "The Weather Hub's frost alert saved my vineyard in Nashik. Highly recommended!", avatar: "SP" },
                            { name: "Vijay Kadam", id: "#AGRU882", yield: "+20% Crop", crop: "Onion", text: "Price Trends helped me sell my onions at the perfect peak in APMC Lasalgaon.", avatar: "VK" },
                            { name: "Anita Shinde", id: "#AGRU319", yield: "Saved 40% Water", crop: "Pomegranate", text: "Drip subsidy info from Policy Vault made my pomegranate farm sustainable.", avatar: "AS" },
                            { name: "Ganesh More", id: "#AGRU524", yield: "Award Winner", crop: "Organic Soy", text: "Organic tips from Academy helped me get export-quality soybean yield.", avatar: "GM" }
                        ].map((s, i) => (
                            <motion.div 
                                key={i} 
                                className="story-wall-card"
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                            >
                                <div className="story-card-top">
                                    <div className="farmer-avatar-circle">{s.avatar}</div>
                                    <div className="farmer-meta">
                                        <h4>{s.name}</h4>
                                        <div className="farmer-id-badge-card">{s.id}</div>
                                        <span className="crop-tag">{s.crop}</span>
                                    </div>
                                    <div className="yield-badge-neon">{s.yield}</div>
                                </div>
                                <p className="story-quote">"{s.text}"</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* 4. FINANCIAL MARKET TICKER */}
                <div className="bento-item market-ticker-bento">
                    <MarketTrends t={t} />
                </div>

                {/* 5. POLICY & SCHEME EXPLORER */}
                <div className="bento-item scheme-explorer-bento">
                    <div className="widget-header-bento">
                        <h3><FiMap /> {t.schemes_title}</h3>
                    </div>
                    <SchemeExplorer language={language} />
                </div>

                {/* 6. AGRI-NEWS FEED (PLOTTED NEXT TO POLICY) */}
                <div className="bento-item news-spanning-block">
                    <News />
                </div>

                {/* 7. EDUCATIONAL ACADEMY (FULL SPAN AT BOTTOM) */}
                <div className="bento-item academy-spanning-block">
                    <div className="bento-header-center">
                        <h2><FiPlayCircle /> {t.academy_title}</h2>
                        <p>{t.academy_sub}</p>
                    </div>
                    <div className="academy-video-flex" style={{ position: 'relative', zIndex: 20 }}>
                        {videos.map((v, i) => (
                            <motion.a 
                                key={i} 
                                href={`https://www.youtube.com/watch?v=${v.id}`}
                                target="_blank"
                                rel="noreferrer"
                                className="video-tile-premium" 
                                whileHover={{ y: -5, scale: 1.05 }}
                                style={{ 
                                    textDecoration: 'none', 
                                    color: 'inherit', 
                                    display: 'block', 
                                    cursor: 'pointer',
                                    position: 'relative',
                                    zIndex: 50
                                }}
                            >
                                <div className="video-tile-icon">{v.icon}</div>
                                <span>{v.title}</span>
                                <div className="tile-play-btn"><FiPlayCircle /></div>
                            </motion.a>
                        ))}
                    </div>
                </div>
            </div>
            </div> {/* hub-main-container */}

            <style>{`
                .back-nav-container {
                    padding: 10px 0 20px 0 !important;
                }
                .intelligence-hero {
                    text-align: center;
                    margin-bottom: 5rem;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .demo-badge {
                    background: rgba(16, 185, 129, 0.1);
                    color: var(--oracle-primary);
                    padding: 8px 20px;
                    border-radius: 30px;
                    font-size: 0.75rem;
                    font-weight: 950;
                    letter-spacing: 2.5px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    border: 1px solid rgba(16, 185, 129, 0.2);
                    margin-bottom: 25px;
                    box-shadow: 0 0 20px rgba(16, 185, 129, 0.1);
                }
                .intelligence-hero h1 {
                    font-size: 4.5rem;
                    font-weight: 950;
                    letter-spacing: -3px;
                    margin-bottom: 1.5rem;
                    line-height: 1;
                }
                .intelligence-hero h1 span {
                    background: linear-gradient(135deg, var(--oracle-primary), var(--oracle-secondary));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .hero-divider {
                    width: 120px;
                    height: 5px;
                    background: var(--oracle-primary);
                    border-radius: 10px;
                    box-shadow: 0 0 30px var(--oracle-primary);
                }
                .stories-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 1.5rem;
                    margin-top: 1.5rem;
                }
                .story-card {
                    padding: 2.2rem;
                    border-radius: 35px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }
                .story-card-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.2rem;
                }
                .story-name {
                    font-weight: 900;
                    font-size: 1.1rem;
                    color: var(--oracle-primary);
                }
                .live-tag.positive {
                    background: rgba(16, 185, 129, 0.1);
                    color: #10b981;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-weight: 800;
                    font-size: 0.7rem;
                }
                .story-txt {
                    color: #94a3b8;
                    font-size: 1rem;
                    font-style: italic;
                    line-height: 1.7;
                }
                .section-title-box {
                    margin-bottom: 2rem;
                }
                .section-title-box h2 {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    font-size: 2.2rem;
                    font-weight: 950;
                    letter-spacing: -1px;
                }
                .section-title-box p {
                    color: #94a3b8;
                    margin-left: 50px;
                    font-size: 1rem;
                    opacity: 0.8;
                }
                .stories-section {
                    margin-top: 3.5rem;
                }
                .video-academy-section {
                    grid-column: 1 / -1;
                    margin-top: 6rem;
                }
                .full-news-row {
                    grid-column: 1 / -1;
                    margin-top: 6rem;
                }
                .horizontal-scroll-academy {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 2rem;
                    margin-top: 2.5rem;
                }
                .farmer-id-badge-card {
                    font-size: 0.65rem;
                    font-weight: 800;
                    color: #3b82f6;
                    opacity: 0.8;
                    margin-bottom: 5px;
                }

                @media (max-width: 1100px) {
                    .intelligence-hero h1 { font-size: 3.5rem; }
                    .horizontal-scroll-academy { grid-template-columns: 1fr 1fr; }
                }
                @media (max-width: 700px) {
                    .horizontal-scroll-academy { grid-template-columns: 1fr; }
                    .intelligence-hero h1 { font-size: 2.8rem; }
                }
            `}</style>
        </div>
    );
};

export default Info;