import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiZap } from 'react-icons/fi';
import StatCounters from './StatCounters'
import { MainContext } from '../context/agroguru_context';

const TRANSLATIONS = {
    en: {
        words: ['FARMING', 'AGRITECH', 'PRECISION', 'FUTURE'],
        tagline: "EMPOWERING FARMERS",
        explore: "EXPLORE",
        hero_desc: "\"Explore new frontiers in farming and unlock the full potential of your land with our comprehensive farming resources and tools.\"",
        p1_title: "Smart Planting",
        p1_desc: "We tell you exactly what to plant and when. Grow better crops and stop wasting money on the wrong seeds.",
        p1_btn: "Explore AI Power →",
        p2_title: "Direct Selling",
        p2_desc: "Sell your harvest directly to big buyers. No more middleman, so you keep all the profit from your work.",
        p2_btn: "Check Live Rates →",
        p3_title: "Healthy Farm",
        p3_desc: "Test your soil and find the best plant nurseries. We make sure your farm stays healthy for years to come.",
        p3_btn: "Locate Labs →"
    },
    mr: {
        words: ['शेती', 'ऍग्री-टेक', 'अचूकता', 'भविष्य'],
        tagline: "शेतकऱ्यांचे सक्षमीकरण",
        explore: "एक्सप्लोर करा",
        hero_desc: "\"शेतीतील नवीन क्षितिजे शोधा आणि आमच्या सर्वसमावेशक शेती संसाधने आणि साधनांसह तुमच्या जमिनीची पूर्ण क्षमता अनलॉक करा.\"",
        p1_title: "स्मार्ट लागवड",
        p1_desc: "आम्ही तुम्हाला नक्की काय आणि कधी लावायचे ते सांगतो. चांगली पिके घ्या आणि चुकीच्या बियाण्यांवर पैसे वाया घालवणे थांबवा.",
        p1_btn: "AI शक्ती एक्सप्लोर करा →",
        p2_title: "थेट विक्री",
        p2_desc: "तुमची कापणी थेट मोठ्या खरेदीदारांना विका. आता कोणताही मध्यस्थ नाही, त्यामुळे तुम्ही तुमच्या कष्टाचा सर्व नफा स्वत:कडे ठेवू शकता.",
        p2_btn: "लाईव्ह दर तपासा →",
        p3_title: "निरोगी शेत",
        p3_desc: "तुमची माती तपासा आणि सर्वोत्तम रोपवाटिका शोधा. तुमचे शेत येणाऱ्या अनेक वर्षांसाठी निरोगी राहील याची आम्ही खात्री करतो.",
        p3_btn: "लॅब शोधा →"
    }
}

const MainCarousel = () => {
    const { language } = useContext(MainContext);
    const t = TRANSLATIONS[language || 'en'];
    
    const [text, setText] = useState(t.words[0]);
    const [index, setIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % t.words.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [t.words.length]);

    useEffect(() => {
        setText(t.words[index]);
    }, [index, t.words]);

    const handleMouseMove = (e) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * 15;
        const rotateY = ((centerX - x) / centerX) * 15;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        
        // Dynamic Glow following mouse
        const glow = card.querySelector('.card-glow');
        if (glow) {
            glow.style.left = `${x}px`;
            glow.style.top = `${y}px`;
            glow.style.opacity = '1';
        }
    };

    const handleMouseLeave = (e) => {
        const card = e.currentTarget;
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        const glow = card.querySelector('.card-glow');
        if (glow) glow.style.opacity = '0';
    };

    return (
        <section id="home_hero_sec">
            <div id="hero_img_sec">
                <div id="hero_img_cover_sec"></div>
                <div className="hero-hologram-grid"></div>
                <div id="hero_img_text">
                    <motion.div 
                        id="hero_tagline"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <FiZap className="tag-icon" /> {t.tagline}
                    </motion.div>
                    <div id="hero_headline">
                        <span className="h-top">{t.explore}</span>
                        <AnimatePresence mode="wait">
                            <motion.span 
                                key={text}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="h-bottom dynamic-text"
                            >
                                {text}
                            </motion.span>
                        </AnimatePresence>
                    </div>
                    <p id="hero_desc">
                        {t.hero_desc}
                    </p>
                </div>
            </div>

            <div id="vision_ecosystem_grid">
                {/* PILLAR 01 */}
                <div 
                    className="eco_card" 
                    onClick={() => navigate('/services/crop')}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                >
                    <div className="card-glow"></div>
                    <div className="eco_content">
                        <div className="eco_icon">🔬</div>
                        <h5>{t.p1_title}</h5>
                        <p>{t.p1_desc}</p>
                        <span className="eco_link">{t.p1_btn}</span>
                    </div>
                </div>

                {/* PILLAR 02 */}
                <div 
                    className="eco_card" 
                    onClick={() => navigate('/services/smart-price-hub')}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                >
                    <div className="card-glow"></div>
                    <div className="eco_content">
                        <div className="eco_icon">🤝</div>
                        <h5>{t.p2_title}</h5>
                        <p>{t.p2_desc}</p>
                        <span className="eco_link">{t.p2_btn}</span>
                    </div>
                </div>

                {/* PILLAR 03 */}
                <div 
                    className="eco_card" 
                    onClick={() => navigate('/services/lab')}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                >
                    <div className="card-glow"></div>
                    <div className="eco_content">
                        <div className="eco_icon">🛡️</div>
                        <h5>{t.p3_title}</h5>
                        <p>{t.p3_desc}</p>
                        <span className="eco_link">{t.p3_btn}</span>
                    </div>
                </div>
            </div>
            <StatCounters />
        </section>
    )
}

export default MainCarousel