import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiRss, FiClock, FiTag, FiChevronRight, FiTrendingUp } from 'react-icons/fi';
import { MainContext } from '../context/agroguru_context';

const TRANSLATIONS = {
    en: {
        header: "AgriNews Digest",
        live: "SATELLITE FEED ACTIVE",
        sentiment: "Neutral",
        trending: "TRENDING",
        read_more: "Expand intel",
        fallback_title: "Latest Insight",
        fallback_body: "Fresh mission-critical updates on agricultural movement.",
        importantPool: [
            { title: "Global Wheat Prices Surge Amid Supply Chain Shifts", description: "Market analysts predict a 15% increase in global wheat demand over the next quarter.", tag: "Market", url: "https://www.fao.org/worldfoodsituation/foodpricesindex/en/" },
            { title: "New AI Precision Tool Reduces Water Usage by 40%", description: "A breakthrough in soil moisture sensing allows for hyper-efficient irrigation.", tag: "Innovation", url: "https://www.un.org/en/climatechange/science/climate-issues/water" },
            { title: "Punjab Government Announces New Subsidy for Drip Irrigation", description: "Local farmers can now apply for a 75% subsidy on advanced irrigation kits.", tag: "Policy", url: "https://agricoop.nic.in/" },
            { title: "Organic Farming Certification Made Easy for Small Farmers", description: "A new digital portal simplifies the documentation for organic certification.", tag: "Organic", url: "https://apeda.gov.in/apedawebsite/organic/index.htm" },
            { title: "Climate-Resilient Rice Seeds Show 98% Success Rate", description: "The IARI has released new seeds that can withstand high flood conditions.", tag: "Discovery", url: "https://iari.res.in" }
        ]
    },
    mr: {
        header: "कृषी न्यूज डायजेस्ट",
        live: "थेट सॅटेलाईट फीड",
        sentiment: "सकारात्मक",
        trending: "ट्रेंडिंग",
        read_more: "सविस्तर माहिती",
        fallback_title: "नवीनतम माहिती",
        fallback_body: "शेती क्षेत्रातील महत्त्वाचे बदल आणि कृषी कल.",
        importantPool: [
            { title: "जागतिक गव्हाच्या किमतीत वाढ", description: "पुढील तिमाहीत जागतिक गव्हाच्या मागणीत १५% वाढ होण्याचा अंदाज बाजार विश्लेषकांनी वर्तवला आहे.", tag: "बाजार", url: "https://www.fao.org/worldfoodsituation/foodpricesindex/en/" },
            { title: "नवीन AI टूलमुळे पाण्याच्या वापरात ४०% घट", description: "जमिनीत ओलावा ओळखणाऱ्या तंत्रज्ञानामुळे आता अधिक कार्यक्षम सिंचन शक्य झाले आहे.", tag: "तंत्रज्ञान", url: "https://www.un.org/en/climatechange/science/climate-issues/water" },
            { title: "ठिबक सिंचनासाठी नवीन अनुदान जाहीर", description: "स्थानिक शेतकरी आता प्रगत सिंचन किटवर ७५% अनुदानासाठी अर्ज करू शकतात.", tag: "धोरण", url: "https://agricoop.nic.in/" },
            { title: "सेंद्रिय शेती प्रमाणन आता सोपे", description: "नवीन डिजिटल पोर्टल सेंद्रिय प्रमाणपत्रासाठी कागदपत्रे गोळा करणे सोपे करते.", tag: "सेंद्रिय", url: "https://apeda.gov.in/apedawebsite/organic/index.htm" },
            { title: "हवामान-लवचिक भात बियाण्यांचे ९८% यश", description: "IARI ने नवीन बियाणे जारी केले आहेत जे पुराच्या स्थितीतही तग धरू शकतात.", tag: "संशोधन", url: "https://iari.res.in" }
        ]
    }
}

const News = () => {
    const { language } = useContext(MainContext);
    const t = TRANSLATIONS[language || 'en'];
    
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    const getDailyFallbacks = () => {
        const day = new Date().getDate();
        const pool = t.importantPool;
        const startIndex = day % (pool.length - 2);
        return pool.slice(startIndex, startIndex + 4);
    };

    const fetchNews = async () => {
        const url = `https://newsapi.org/v2/everything?q=agriculture AND (innovation OR policy OR market)&sortBy=publishedAt&pageSize=8&apiKey=15cd77928d8440b988888b289a0c2cf4`;
        
        try {
            const res = await axios.get(url);
            if (res.data.articles && res.data.articles.length > 0) {
                setArticles(res.data.articles);
            } else {
                setArticles(getDailyFallbacks());
            }
        } catch (error) {
            setArticles(getDailyFallbacks());
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchNews();
    }, [language]);

    return (
        <div id="agri_news_module">
            <div className="news_module_header">
                <div>
                    <h2 style={{ fontSize: '2.4rem', fontWeight: 950, letterSpacing: '-1px' }}>{t.header}</h2>
                    <div className="satellite_tag_pulse">
                        <span className="pulse_atom"></span>
                        {t.live}
                    </div>
                </div>
                <div className="sentiment_gauge">
                   <FiTrendingUp /> {t.trending}: {t.sentiment}
                </div>
            </div>
            
            <div className="news_bento_mosaic">
                {loading ? (
                    <div className="skeleton_loading_box">SYNCHRONIZING NEWS FEED...</div>
                ) : (
                    <div className="news_scroll_grid">
                        {articles.map((ob, index) => (
                            <motion.div 
                                key={index} 
                                className="news_item_brick glass"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="news_brick_top">
                                    <span className="brick_tag"><FiTag /> {ob.tag || 'GLOBAL'}</span>
                                    <span className="brick_time"><FiClock /> {new Date().toLocaleDateString()}</span>
                                </div>
                                <h3>{ob.title}</h3>
                                <p>{(ob.description || "").slice(0, 100)}...</p>
                                <div className="brick_footer">
                                    <a href={ob.url} target="_blank" rel="noreferrer" className="intel_link">
                                        {t.read_more} <FiChevronRight />
                                    </a>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            <style>{`
                #agri_news_module {
                    width: 100%;
                }
                .news_module_header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    margin-bottom: 3rem;
                    padding-bottom: 1.5rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                }
                .satellite_tag_pulse {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 0.7rem;
                    font-weight: 900;
                    letter-spacing: 2px;
                    color: #10b981;
                    margin-top: 10px;
                }
                .pulse_atom {
                    width: 8px;
                    height: 8px;
                    background: #10b981;
                    border-radius: 50%;
                    box-shadow: 0 0 10px #10b981;
                    animation: pulseAtom 2s infinite;
                }
                @keyframes pulseAtom {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.5); opacity: 0.5; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .sentiment_gauge {
                    background: rgba(59, 130, 246, 0.1);
                    color: #60a5fa;
                    padding: 8px 20px;
                    border-radius: 50px;
                    font-size: 0.75rem;
                    font-weight: 800;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    border: 1px solid rgba(59, 130, 246, 0.2);
                }
                .news_scroll_grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 2rem;
                }
                .news_item_brick {
                    padding: 2rem;
                    border-radius: 30px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }
                .news_item_brick:hover {
                    border-color: #3b82f6;
                    background: rgba(59, 130, 246, 0.03);
                    transform: translateY(-5px);
                }
                .news_brick_top {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 1.5rem;
                }
                .brick_tag {
                    font-size: 0.6rem;
                    font-weight: 900;
                    text-transform: uppercase;
                    color: #10b981;
                    background: rgba(16, 185, 129, 0.1);
                    padding: 4px 12px;
                    border-radius: 50px;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }
                .brick_time {
                    font-size: 0.7rem;
                    opacity: 0.5;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }
                .news_item_brick h3 {
                    font-size: 1.2rem;
                    font-weight: 800;
                    margin-bottom: 1rem;
                    line-height: 1.4;
                    color: white;
                }
                .news_item_brick p {
                    font-size: 0.85rem;
                    line-height: 1.6;
                    color: rgba(255, 255, 255, 0.5);
                    margin-bottom: 1.5rem;
                }
                .intel_link {
                    color: #3b82f6;
                    text-decoration: none;
                    font-weight: 800;
                    font-size: 0.8rem;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    transition: gap 0.3s;
                }
                .intel_link:hover { gap: 10px; }
                .skeleton_loading_box {
                    height: 300px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(255, 255, 255, 0.02);
                    border-radius: 30px;
                    font-weight: 950;
                    letter-spacing: 5px;
                    opacity: 0.3;
                }
            `}</style>
        </div>
    )
}

export default News;