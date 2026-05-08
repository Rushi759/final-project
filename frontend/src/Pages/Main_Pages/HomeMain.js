import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCloudRain, FiTrendingUp, FiTarget, FiZap, FiShield, FiCpu, FiNavigation } from 'react-icons/fi'
import MainCarousel from '../../Component/MainCarousel'
import AgroTicker from '../../Component/AgroTicker'
import { MainContext } from '../../context/agroguru_context'
import '../../Styles/ModernHome.css'

const TRANSLATIONS = {
    en: {
        welcome: "Welcome back, Master Farmer",
        id_label: "FARMER ID",
        pulse_header: "Regional Agro-Pulse",
        pulse_sub: "Live Satellite Integration Active",
        soil_status: "Soil Saturation",
        market_index: "Agri-Market Index",
        water_level: "Deep-Well Reserves",
        active_ai: "AI AGROMIST STATUS",
        ai_online: "ONLINE & MONITORING",
        quick_actions: "STRATEGIC OPERATIONS",
        cta_advisor: "CONSULT AGROGPT",
        cta_explore: "MARKET HUB"
    },
    mr: {
        welcome: "परत स्वागत आहे, मास्टर शेतकरी",
        id_label: "शेतकरी आयडी",
        pulse_header: "प्रादेशिक ऍग्रो-पल्स",
        pulse_sub: "थेट उपग्रह एकत्रीकरण सक्रिय",
        soil_status: "मातीची सुपीकता",
        market_index: "कृषी-बाजार निर्देशांक",
        water_level: "पाणी साठा पातळी",
        active_ai: "AI कृषी तज्ज्ञ स्थिती",
        ai_online: "सक्रिय आणि देखरेख",
        quick_actions: "धोरणात्मक ऑपरेशन्स",
        cta_advisor: "AGROGPT सल्ला घ्या",
        cta_explore: "बाजार केंद्र"
    }
}

const HomeMain = () => {
    const navigate = useNavigate();
    const { language, location } = useContext(MainContext);
    const t = TRANSLATIONS[language || 'en'];
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <section id="modern_home_wrap">
            <AgroTicker />
            
            {/* ELITE HERO SECTION */}
            <div className="elite-hero-canvas">
                <MainCarousel />
            </div>

            {/* FARMER IDENTITY BAR */}
            <div className="farmer-identity-float fade-in">
                <div className="identity-left">
                    <div className="identity-avatar">RT</div>
                    <div className="identity-text">
                        <span>{t.welcome}</span>
                        <h3>Rushikesh Jagtap</h3>
                    </div>
                </div>
                <div className="identity-right">
                    <div className="id-badge">
                        <small>{t.id_label}</small>
                        <strong>#AGRU639</strong>
                    </div>
                    <div className="live-status-dot">
                        <span className="dot"></span>
                        LIVE SYNC
                    </div>
                </div>
            </div>

            <div className="home-content-container">
                {/* LIVE INTEL BENTO GRID */}
                <div className="intel-bento-grid reveal">
                    <motion.div 
                        className="bento-tile pulse-board large"
                        whileHover={{ y: -5 }}
                    >
                        <div className="tile-header">
                            <FiTarget className="node-icon" />
                            <div>
                                <h4>{location.village}{location.city} {t.pulse_header}</h4>
                                <p>{t.pulse_sub}</p>
                            </div>
                        </div>
                        <div className="pulse-visual-stats">
                            <div className="stat-ring-wrap">
                                <div className="stat-ring soil">
                                    <svg viewBox="0 0 36 36" className="circular-chart">
                                        <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                        <path className="circle" strokeDasharray="85, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                    </svg>
                                    <div className="ring-text">85%</div>
                                </div>
                                <span>{t.soil_status}</span>
                            </div>
                            <div className="stat-ring-wrap">
                                <div className="stat-ring water">
                                    <svg viewBox="0 0 36 36" className="circular-chart">
                                        <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                        <path className="circle" strokeDasharray="62, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                    </svg>
                                    <div className="ring-text">62%</div>
                                </div>
                                <span>{t.water_level}</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div className="bento-tile ai-status-card" whileHover={{ y: -5 }}>
                        <div className="ai-core-viz">
                            <FiCpu className="ai-spin" />
                            <div className="core-waves">
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                        <div className="ai-details">
                            <small>{t.active_ai}</small>
                            <h3>{t.ai_online}</h3>
                            <button className="neon-btn mini" onClick={() => navigate('/services/info')}>TALK NOW</button>
                        </div>
                    </motion.div>

                    <motion.div className="bento-tile market-glance" whileHover={{ y: -5 }}>
                        <div className="market-graph-stub">
                            <div className="bar" style={{ height: '30%' }}></div>
                            <div className="bar" style={{ height: '50%' }}></div>
                            <div className="bar" style={{ height: '80%' }}></div>
                            <div className="bar" style={{ height: '100%' }}></div>
                        </div>
                        <div className="market-text">
                            <h4>{t.market_index}</h4>
                            <div className="index-val">
                                <FiTrendingUp /> +4.2%
                            </div>
                        </div>
                    </motion.div>

                    {/* NEW: SATELLITE FIELD HEALTH TILE */}
                    <motion.div 
                        className="bento-tile satellite-field-scan" 
                        whileHover={{ y: -5 }}
                        onClick={() => navigate('/services/lab')}
                    >
                        <div className="scan-bg-anim"></div>
                        <div className="scan-content">
                            <FiTarget className="scan-radar" />
                            <small>GEOSPATIAL INTELLIGENCE</small>
                            <h4>FIELD HEALTH SCAN</h4>
                            <p>Simulating NDVI analysis...</p>
                        </div>
                    </motion.div>
                </div>

                {/* YIELD FORECAST VISUALIZER */}
                <div className="yield-forecast-section reveal">
                    <div className="forecast-card glass">
                        <div className="forecast-info">
                            <small>SEASONAL PREDICTION</small>
                            <h2>Harvest Confidence: 92%</h2>
                            <p>Based on current nitrogen levels and precipitation patterns, your projected yield is 15% above regional average.</p>
                            <div className="confidence-meter">
                                <div className="meter-fill" style={{ width: '92%' }}></div>
                            </div>
                        </div>
                        <div className="forecast-icon-aura">
                            <FiTarget />
                        </div>
                    </div>
                </div>

                {/* ELITE ACADEMY SECTION */}
                <div className="academy-horizontal-wrap reveal">
                    <div className="hub-header">
                        <h2>AGROGURU ELITE ACADEMY</h2>
                        <div className="line"></div>
                    </div>
                    <div className="academy-scroll">
                        {[
                            { title: "Precision Fertigation", level: "Advanced", time: "12 mins", icon: "🧪" },
                            { title: "Organic Pest Control", level: "Expert", time: "18 mins", icon: "🌿" },
                            { title: "Smart Water Budgeting", level: "Inter", time: "10 mins", icon: "💧" },
                            { title: "Export Quality Standards", level: "Global", time: "25 mins", icon: "🌍" }
                        ].map((course, idx) => (
                            <motion.div 
                                key={idx} 
                                className="academy-card glass"
                                whileHover={{ scale: 1.05, borderColor: '#10b981' }}
                            >
                                <div className="course-icon">{course.icon}</div>
                                <div className="course-meta">
                                    <span className="badge">{course.level}</span>
                                    <span className="duration">{course.time}</span>
                                </div>
                                <h4>{course.title}</h4>
                                <button className="start-btn" onClick={() => navigate('/services/info')}>START LESSON</button>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* STRATEGIC VISION SECTION */}
                <div className="strategic-ops-hub reveal">
                    <div className="hub-header">
                        <h2>{t.quick_actions}</h2>
                        <div className="line"></div>
                    </div>
                    <div className="ops-grid">
                        <div className="op-item glass" onClick={() => navigate('/services/info')}>
                            <div className="op-icon"><FiZap /></div>
                            <div className="op-info">
                                <h4>SMART ADVISOR</h4>
                                <p>Get AI-powered solutions for pest control and fertilization.</p>
                            </div>
                            <FiNavigation className="arrow" />
                        </div>
                        <div className="op-item glass" onClick={() => navigate('/services/price-hub')}>
                            <div className="op-icon"><FiTrendingUp /></div>
                            <div className="op-info">
                                <h4>PRICE INTELLIGENCE</h4>
                                <p>Live market rates and trend forecasts for your region.</p>
                            </div>
                            <FiNavigation className="arrow" />
                        </div>
                        <div className="op-item glass" onClick={() => navigate('/services/lab')}>
                            <div className="op-icon"><FiShield /></div>
                            <div className="op-info">
                                <h4>SOIL LABS</h4>
                                <p>Locate the nearest certified government soil testing labs.</p>
                            </div>
                            <FiNavigation className="arrow" />
                        </div>
                    </div>
                </div>

                {/* FLOATING CTA FOOTER */}
                <div className="premium-discovery-cta glass">
                    <div className="cta-content">
                        <h3>READY TO REVOLUTIONIZE YOUR HARVEST?</h3>
                        <p>Join 50,000+ elite farmers using AgroGuru intelligence daily.</p>
                    </div>
                    <div className="cta-buttons">
                        <button className="primary" onClick={() => navigate('/services/info')}>{t.cta_advisor}</button>
                        <button className="secondary" onClick={() => navigate('/services/crop')}>{t.cta_explore}</button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HomeMain
