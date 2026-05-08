import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiTrendingUp, FiTrendingDown, FiPlayCircle, FiBookOpen, FiShield, FiUsers, FiCpu, FiMessageCircle, FiActivity, FiLayers, FiWind, FiDroplet, FiPlus, FiMessageSquare } from 'react-icons/fi';
import { myList } from '../crop-list';

// --- AGROGPT CHAT PANEL ---
export const AgroGPT = ({ language, t }) => {
    const scrollRef = useRef(null);
    const [messages, setMessages] = useState([
        { id: 0, text: language === 'mr' ? "नमस्ते! मी तुमचा सार्वत्रिक AI कृषी सल्लागार आहे. हवामान, खते, पिके किंवा सिंचनाबद्दल काहीही विचारा." : "Hello! I am your Universal AI Agronomist. Ask me anything about weather, fertilizers, crops, irrigation, or schemes.", sender: 'ai' }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    // Auto-scroll logic
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const q = input.toLowerCase();
        setMessages(prev => [...prev, { id: Date.now(), text: input, sender: 'user' }]);
        setInput('');
        setIsTyping(true);

        const currentMonth = new Date().getMonth() + 1;
        const monthNames = language === 'mr' ? ['जाने', 'फेब्रु', 'मार्च', 'एप्रिल', 'मे', 'जून', 'जूले', 'ऑगस्ट', 'सप्टें', 'ऑक्टो', 'नोव्हें', 'डिसें'] : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        setTimeout(() => {
            let aiText = "";

            // 1. WEATHER & SEASONAL MODULE (PROFESSIONAL DEPTH)
            if (q.includes("weather") || q.includes("hawa") || q.includes("हवामान") || q.includes("season") || q.includes("हंगाम")) {
                const season = (currentMonth >= 6 && currentMonth <= 10) ? (language === 'mr' ? 'खरीप' : 'Kharif') : (currentMonth >= 11 || currentMonth <= 3) ? (language === 'mr' ? 'रब्बी' : 'Rabi') : (language === 'mr' ? 'उन्हाळी' : 'Zaid');
                if (language === 'mr') {
                    aiText = `🌤️ **सर्वसमावेशक हवामान आणि हंगामी कृषी अहवाल:**\n\nसध्या आपण **${monthNames[currentMonth-1]}** महिन्यात आहोत आणि **${season}** हंगामाच्या टप्प्यात आहोत. या काळात हवामानातील बदल पिकांच्या वाढीवर आणि उत्पन्नावर थेट परिणाम करतात. \n\n📍 **महत्त्वाचे कृषी नियोजन:** \n१. पुढील ७२ तासांच्या पावसाच्या अंदाजाचे काटेकोरपणे पालन करा; पावसात १० मिमी पेक्षा जास्त शक्यता असल्यास कीटकनाशकांची फवारणी टाळावी. \n२. जर थंडीचा कडाका वाढत असेल, तर पिकांमध्ये 'धुरी' (smoke) करणे किंवा ठिबक सिंचनाद्वारे हलके पाणी देणे अत्यंत आवश्यक आहे, ज्यामुळे पिकांचे तुषारांपासून (frost) संरक्षण होते. \n३. हवेतील आर्द्रता जास्त असल्यास बुरशीजन्य रोगांचा प्रादुर्भाव होऊ शकतो, अशा वेळी त्वरित तज्ञांचा सल्ला घेऊन प्रतिबंधात्मक उपाययोजना कराव्यात. \n\n**निष्कर्ष:** हवामानातील लहरीपणा लक्षात घेऊन 'हवामान-आधारित शेती' हीच भविष्यातील शाश्वत पर्याय आहे.`;
                } else {
                    aiText = `🌤️ **Strategic Seasonal Weather & Atmospheric Intelligence:**\n\nWe are currently positioned in the month of **${monthNames[currentMonth-1]}**, right in the heart of the **${season}** cycle. Atmospheric conditions during this transitional period are critical for determining cellular crop growth and final biomass accumulation. \n\n📍 **Critical Operational Advisory:** \n• **Rain Delay Protocol:** It is absolutely mandatory to defer all chemical sprayings and top-dressing of fertilizers if there is a >40% probability of rain within the next 6-12 hours to prevent leaching and surface runoff. \n• **Micro-Climate Control:** If night temperatures drop significantly, utilize nighttime micro-irrigation. This creates a thermal blanket around the root zone, preventing the sap from freezing and ensuring the crop survives sudden frost shocks. \n• **Humidity Alert:** Sustained humidity levels above 70% are invitations for fungal pathogens; ensure proper row spacing for optimal ventilation. \n\n**Final Directive:** Adopting a "climate-resilient" mindset is the only way to safeguard your yield against global erratic weather patterns.`;
                }
            }
            // 2. FERTILIZER & SOIL MODULE (DEEP SCIENCE)
            else if (q.includes("fert") || q.includes("khata") || q.includes("खत") || q.includes("npk") || q.includes("soil") || q.includes("माती")) {
                if (language === 'mr') {
                    aiText = `🧪 **प्रगत मृदा आरोग्य आणि खत व्यवस्थापन धोरण:**\n\nजमीन ही केवळ माती नसून ती एक जिवंत परिसंस्था आहे. पिकांच्या परिपूर्ण वाढीसाठी नत्र (N), स्फुरद (P) आणि पालाश (K) या मुख्य घटकांचा योग्य समतोल असणे अनिवार्य आहे. \n\n📍 **शास्त्रीय सल्ला:** \n• **माती परीक्षण (Soil Testing):** कोणत्याही खताचा वापर करण्यापूर्वी मातीचे परीक्षण करून 'मृदा आरोग्य कार्ड' प्राप्त करा. यामुळे विनाकारण होणारा खतांचा खर्च वाचतो आणि जमिनीचा पोत बिघडत नाही. \n• **सेंद्रिय कर्ब (Organic Carbon):** जमिनीतील सेंद्रिय कर्ब वाढवण्यासाठी शेणखत, हिरवळीचे खत किंवा गांडूळ खताचा मुबलक वापर करा. सेंद्रिय कर्ब ०.८% पेक्षा जास्त असणे पिकांच्या रोगप्रतिकारक शक्तीसाठी उत्तम असते. \n• **सूक्ष्म अन्नद्रव्ये:** केवळ NPK वर अवलंबून न राहता जस्त (Zinc), लोह (Iron) आणि बोरॉन यांसारख्या सूक्ष्म घटकांकडेही लक्ष द्या. \n\n**निष्कर्ष:** 'कमी खत, जास्त उत्पादन' हेच आधुनिक शेतीचे सूत्र आहे.`;
                } else {
                    aiText = `🧪 **Advanced Soil Health & Precision Nutrient Architecture:**\n\nSoil is far more than a physical medium; it is a bio-dynamic ecosystem. Achieving maximum yield potential requires a sophisticated balance of Primary (N-P-K), Secondary, and Micronutrients tailored to your specific field signature. \n\n📍 **Scientific Management Directives:** \n• **Diagnostic Primacy:** NEVER initiate a fertilization cycle without a current Soil Health Analysis. Blind application leads to "Nutrient Antagonism," where an excess of one element (like Phosphorus) effectively blocks the uptake of others (like Zinc). \n• **Organic Matrix Enrichment:** Prioritize the accumulation of Soil Organic Carbon (SOC). High SOC levels act as a nutrient sponge, significantly increasing the Cation Exchange Capacity (CEC) and allowing for more efficient mineral absorption at the root hair level. \n• **Integrated Nutrient Management (INM):** Combine traditional chemical fertilizers with bio-fertilizers like Azotobacter or PSB to fix atmospheric nitrogen and solubilize immovable soil phosphorus. \n\n**Conclusion:** Regenerative soil practices are not just environmentally sound—they are financially superior.`;
                }
            }
            // 3. IRRIGATION & WATER MODULE (ENGINEERING DEPTH)
            else if (q.includes("water") || q.includes("pani") || q.includes("पाणी") || q.includes("drip") || q.includes("सिंचन")) {
                if (language === 'mr') {
                    aiText = `💧 **स्मार्ट सिंचन आणि जलसंधारण मास्टरक्लास:**\n\nपाणी हे अनमोल आहे आणि त्याचा थेंब-थेंब हिशोबाने वापरणे हेच यशस्वी शेतीचे रहस्य आहे. पारंपारिक सिंचन पद्धतींच्या तुलनेत आधुनिक तंत्रज्ञान उत्पन्नात मोठी सुधारणा करू शकते. \n\n📍 **सिंचन धोरण:** \n• **ठिबक सिंचन (Drip (Irrigation):** ठिबक पद्धतीचा अवलंब केल्यास पाण्याची ५०-७०% बचत होते आणि खते थेट मुळांपर्यंत पोहोचवता येतात (Fertigation). \n• **वाफसा स्थिती:** झाडाला पाणी कधी द्यावे, हे ओळखण्यासाठी जमिनीतील 'वाफसा' तपासा. उपळलेल्या जमिनीत हवा आणि पाणी यांचे ५०:५० प्रमाण असणे वाढीसाठी आदर्श असते. \n• **वेळेचे नियोजन:** बाष्पीभवन टाळण्यासाठी सकाळी १० च्या आधी किंवा संध्याकाळी ५ नंतरच पाणी द्यावे. \n\n**निष्कर्ष:** 'प्रति थेंब, अधिक पीक' हे ध्येय समोर ठेवूनच पाण्याची बचत आणि व्यवस्थापन करा.`;
                } else {
                    aiText = `💧 **Strategic Irrigation & Hydraulic Resource Optimization:**\n\nWater is the most critical variable in the agricultural production equation. Modern irrigation is no longer about "flooding fields"—it is about maintaining precise soil-water tension at the root zone to prevent metabolic stress. \n\n📍 **Hydrological Efficiency Protocol:** \n• **Drip & Sub-surface Irrigation:** These systems maximize Water Use Efficiency (WUE) by delivering moisture directly to the rhizosphere, eliminating evaporation losses and weed growth in non-cropped areas. \n• **Monitoring Field Capacity:** Avoid "Over-Irrigation" which leads to Anaerobic Conditions (root suffocation). Use the "Wafsa" principle: ensure 25% air and 25% water in the soil pore space for optimal aerobic microbial activity. \n• **Night-Cycle Irrigation:** Leveraging low-evapotranspiration windows during nighttime reduces volumetric water loss and benefits from lower energy tariffs in many regions. \n\n**Conclusion:** Precision water management is the bridge between a good harvest and a record-breaking harvest.`;
                }
            }
            // 4. CROP SPECIFIC MODULE (DETAILED INSIGHTS)
            else {
                const cropEntry = myList.find(c => 
                    q.includes(c.name.toLowerCase()) || 
                    q.includes((c.mr_name || "").toLowerCase())
                );

                if (cropEntry) {
                    if (language === 'mr') {
                        aiText = `📋 **${cropEntry.mr_name || cropEntry.name} पिकाबद्दल विशेष सखोल विश्लेषण:**\n\n🔹 **वर्णन आणि महत्त्व:** ${cropEntry.mr_description || cropEntry.description} हे पीक शेतकऱ्यांसाठी आर्थिकदृष्ट्या अत्यंत फायदेशीर ठरू शकते. मात्र, यासाठी योग्य व्यवस्थापन आवश्यक आहे. \n\n🚜 **तज्ञांचा मुख्य सल्ला:** \n• **लागवड तंत्रज्ञान:** ${cropEntry.mr_tips?.[0] || cropEntry.tips[0]} \n• **उत्पादन वाढवण्यासाठी:** नेहमी सुधारित आणि प्रमाणित वाणांचाच वापर करा. लागवडीपूर्वी बीजप्रक्रिया केल्यास सुरुवातीच्या काळातील मर रोगाचा धोका ५०% ने कमी होतो. \n• **कीड व्यवस्थापन:** पिकावर सतत लक्ष ठेवा; पानाच्या खालच्या बाजूची तपासणी करणे कधीही विसरू नका. \n\n**निष्कर्ष:** ${cropEntry.mr_name || cropEntry.name} पिकात सातत्यपूर्ण लक्ष आणि वैज्ञानिक पद्धतींचा अवलंब केल्यास आपण विक्रमी उत्पन्न मिळवू शकता.`;
                    } else {
                        aiText = `📋 **Comprehensive Agronomic Intelligence for ${cropEntry.name}:**\n\n🔹 **Overview & Economic Viability:** ${cropEntry.description} is a high-potential crop that requires a data-driven approach to unlock maximum genetic expression and market value. \n\n🚜 **Core Management Directives:** \n• **Operational Mastery:** ${cropEntry.tips[0]} \n• **Yield Maximization Strategy:** Always prioritize certified, high-vigor seed varieties. Implementing a pre-sowing seed treatment can reduce early-stage seedling mortality by up to 50% through improved systemic resistance. \n• **Phytosanitary Protocol:** Vigilant scouting for pest thresholds is non-negotiable. Look for early symptoms of nutrient deficiency or pathogenic infiltration on the undersides of leaves. \n\n**Final Recommendation:** Consistent oversight combined with the adoption of these scientific protocols will ensure that your ${cropEntry.name} plantation reaches elite production standards.`;
                    }
                } else {
                    aiText = language === 'mr' 
                        ? "मी पिके, खते, हवामान आणि सरकारी योजनांबद्दल अत्यंत सखोल आणि शास्त्रीय माहिती देऊ शकतो. कृपया तुमचा प्रश्न अधिक स्पष्टपणे विचारा. मी तुम्हाला सविस्तर मार्गदर्शन करण्यास तयार आहे."
                        : "I am programmed to provide deep, multi-dimensional agronomic analysis on crops, fertilizers, atmospheric conditions, and government policy. To receive a comprehensive report, please specify your query clearly. I am ready to transmit a full intelligence briefing.";
                }
            }

            setMessages(prev => [...prev, { id: Date.now() + 1, text: aiText, sender: 'ai' }]);
            setIsTyping(false);
        }, 2000);
    };

    const [showHistory, setShowHistory] = useState(false);

    const resetChat = () => {
        setMessages([
            { id: 0, text: language === 'mr' ? "नमस्ते! नवीन संवाद सुरू झाला आहे. विचारा, मी तयार आहे." : "Hello! A new session has started. Ask away, I am ready.", sender: 'ai' }
        ]);
        setShowHistory(false);
    };

    return (
        <div className="neural-agrogpt-deck">
            <div className="gpt-header-elite">
                <div className="ai-core-indicator">
                    <FiCpu className="spinner-ai" />
                    <span>NEURAL CORE ACTIVE</span>
                </div>
                <div className="farmer-id-badge-elite">
                    <FiShield />
                    <span>FARMER ID: #AGRU639</span>
                </div>
                <div className="gpt-top-action-cluster">
                    <motion.button 
                        className="gpt-top-btn plus" 
                        whileHover={{ scale: 1.1, backgroundColor: 'rgba(16, 185, 129, 0.2)' }} 
                        onClick={resetChat}
                        title="New Conversation"
                    >
                        <FiPlus /> New
                    </motion.button>
                    <motion.button 
                        className="gpt-top-btn history" 
                        whileHover={{ scale: 1.1, backgroundColor: 'rgba(59, 130, 246, 0.2)' }} 
                        onClick={() => setShowHistory(!showHistory)}
                        title="Past Conversations"
                    >
                        <FiLayers /> {showHistory ? "Chat" : "History"}
                    </motion.button>
                </div>
            </div>

            <div className="neural-viewport" ref={scrollRef}>
                {showHistory ? (
                    <div className="history-archived-list">
                        <p style={{ opacity: 0.5, fontSize: '0.8rem', textAlign: 'center' }}>- LAST SESSION RECORDS -</p>
                        <div className="history-item-stub">🔍 Crop Yield Query (April 12)</div>
                        <div className="history-item-stub">🔍 Fertilizer Guide (April 10)</div>
                        <div className="history-item-stub">🔍 Weather Alert (April 05)</div>
                    </div>
                ) : (
                    <>
                        {messages.map(msg => (
                            <motion.div 
                                key={msg.id} 
                                initial={{ opacity: 0, scale: 0.9, x: msg.sender === 'ai' ? -20 : 20 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                className={`neural-bubble-row ${msg.sender}`}
                            >
                                <div className="neural-bubble">
                                    <div className="bubble-pre">
                                        {msg.sender === 'ai' ? 'AGRO_AI >>' : 'FARMER >>'}
                                    </div>
                                    <div className="message-content-text" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
                                </div>
                            </motion.div>
                        ))}
                    </>
                )}
                {isTyping && (
                    <div className="neural-bubble-row ai">
                        <div className="neural-bubble typing">
                            <div className="typing-dots">
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="neural-command-dock">
                <div className="quick-intel-chips">
                    <span onClick={() => { setInput("Best crops for this season?"); handleSend(); }}>🌱 Season Trends</span>
                    <span onClick={() => { setInput("Latest Gov Subsidies?"); handleSend(); }}>🏛️ Gov Intel</span>
                    <span onClick={() => { setInput("Soil health test?"); handleSend(); }}>🧪 Soil AI</span>
                </div>
                <div className="neural-input-wrapper">
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={language === 'mr' ? "कृत्रिम बुद्धिमत्ता (AI) ला काहीही विचारा..." : "TRANSMIT COMMAND TO AI..."}
                    />
                    <motion.button 
                        className="send-btn-neural"
                        whileHover={{ scale: 1.1, boxShadow: "0 0 20px #10b981" }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleSend}
                    >
                        <FiSend />
                    </motion.button>
                </div>
            </div>

            <style>{`
                .neural-agrogpt-deck {
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    background: transparent;
                }
                .gpt-header-elite {
                    padding: 1rem 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    margin-bottom: 1.5rem;
                }
                .gpt-top-action-cluster {
                    display: flex;
                    gap: 10px;
                }
                .gpt-top-btn {
                    padding: 8px 16px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    font-size: 0.75rem;
                    font-weight: 800;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    cursor: pointer;
                    transition: 0.3s cubic-bezier(0.23, 1, 0.32, 1);
                }
                .gpt-top-btn.plus {
                    background: rgba(16, 185, 129, 0.1);
                    border-color: rgba(16, 185, 129, 0.3);
                    color: #10b981;
                }
                .gpt-top-btn.history {
                    background: rgba(59, 130, 246, 0.1);
                    border-color: rgba(59, 130, 246, 0.3);
                    color: #3b82f6;
                }
                .gpt-top-btn:hover {
                    box-shadow: 0 10px 20px rgba(0,0,0,0.3);
                }
                .ai-core-indicator {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 0.65rem;
                    font-weight: 900;
                    letter-spacing: 2px;
                    color: #10b981;
                }
                .spinner-ai { font-size: 1rem; animation: rotate 4s linear infinite; }
                .gpt-version { font-size: 0.6rem; opacity: 0.4; font-weight: 800; }
                
                .neural-viewport {
                    flex: 1;
                    overflow-y: auto;
                    padding-right: 10px;
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }
                .neural-viewport::-webkit-scrollbar { width: 4px; }
                .neural-viewport::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }

                .neural-bubble-row { display: flex; width: 100%; }
                .neural-bubble-row.ai { justify-content: flex-start; }
                .neural-bubble-row.user { justify-content: flex-end; }

                .neural-bubble {
                    max-width: 85%;
                    padding: 1.5rem;
                    border-radius: 25px;
                    position: relative;
                }
                .ai .neural-bubble {
                    background: rgba(16, 185, 129, 0.05);
                    border: 1px solid rgba(16, 185, 129, 0.1);
                    border-bottom-left-radius: 5px;
                }
                .user .neural-bubble {
                    background: rgba(59, 130, 246, 0.1);
                    border: 1px solid rgba(59, 130, 246, 0.2);
                    border-bottom-right-radius: 5px;
                }
                .bubble-pre {
                    font-size: 0.6rem;
                    font-weight: 950;
                    margin-bottom: 8px;
                    letter-spacing: 1px;
                }
                .ai .bubble-pre { color: #10b981; }
                .user .bubble-pre { color: #3b82f6; }
                .message-content-text { font-size: 0.95rem; line-height: 1.6; color: rgba(255, 255, 255, 0.8); }

                .history-archived-list {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    padding: 1rem;
                }
                .history-item-stub {
                    padding: 1.2rem;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 15px;
                    font-size: 0.85rem;
                    color: rgba(255, 255, 255, 0.5);
                    cursor: default;
                    transition: 0.3s;
                }
                .history-item-stub:hover {
                    background: rgba(59, 130, 246, 0.1);
                    color: white;
                    border-color: rgba(59, 130, 246, 0.3);
                }

                .neural-command-dock {
                    margin-top: auto;
                }
                .quick-intel-chips {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 15px;
                    overflow-x: auto;
                    padding-bottom: 5px;
                }
                .quick-intel-chips span {
                    white-space: nowrap;
                    font-size: 0.65rem;
                    font-weight: 800;
                    padding: 6px 15px;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 50px;
                    cursor: pointer;
                    transition: 0.3s;
                }
                .quick-intel-chips span:hover { background: #10b981; color: black; border-color: #10b981; }

                .neural-input-wrapper {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 20px;
                    display: flex;
                    padding: 8px 10px 8px 20px;
                    align-items: center;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                }
                .neural-input-wrapper input {
                    flex: 1;
                    height: 45px;
                    background: transparent;
                    border: none;
                    outline: none;
                    color: white;
                    font-size: 0.9rem;
                    font-weight: 600;
                }
                .neural-input-wrapper button {
                    width: 45px; height: 45px;
                    background: #10b981;
                    border: none;
                    border-radius: 15px;
                    color: black;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.2rem;
                    cursor: pointer;
                }
                
                .farmer-id-badge-elite {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: rgba(59, 130, 246, 0.1);
                    color: #3b82f6;
                    padding: 6px 14px;
                    border-radius: 50px;
                    font-size: 0.65rem;
                    font-weight: 950;
                    letter-spacing: 1px;
                    border: 1px solid rgba(59, 130, 246, 0.2);
                    box-shadow: 0 0 15px rgba(59, 130, 246, 0.1);
                }
                @keyframes rotate { to { transform: rotate(360deg); } }
                .typing-dots { display: flex; gap: 5px; }
                .typing-dots span {
                    width: 6px; height: 6px;
                    background: #10b981;
                    border-radius: 50%;
                    animation: bounce 1s infinite alternate;
                }
                .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
                .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
                @keyframes bounce { to { transform: translateY(-5px); opacity: 0.3; } }
            `}</style>
        </div>
    );
};

// --- MARKET TRENDS WIDGET ---
export const MarketTrends = ({ t }) => {
    const [crops, setCrops] = useState([
        { name: 'Wheat', price: 2450, trend: 2.4, up: true, vol: '12K t' },
        { name: 'Rice', price: 3100, trend: -1.2, up: false, vol: '8.5K t' },
        { name: 'Cotton', price: 7800, trend: 5.6, up: true, vol: '4K t' },
        { name: 'Soybean', price: 4200, trend: 0.8, up: true, vol: '15K t' },
        { name: 'Onion', price: 1850, trend: -3.4, up: false, vol: '22K t' },
        { name: 'Turmeric', price: 12400, trend: 8.2, up: true, vol: '1.2K t' }
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCrops(prev => prev.map(c => {
                const change = (Math.random() - 0.5) * 5;
                const newPrice = Math.max(10, c.price + change);
                return { 
                    ...c, 
                    price: newPrice,
                    trend: ((newPrice - (c.price - change)) / c.price * 100).toFixed(1),
                    up: change >= 0
                };
            }));
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div 
            className="market-exchange-board glass"
            whileHover={{ scale: 1.01 }}
        >
            <div className="exchange-header">
                <div className="header-intel">
                    <FiActivity className="pulse-icon" />
                    <div>
                        <h3>AGRI-EXCHANGE</h3>
                        <p>LIVE APMC TERMINAL v5.0</p>
                    </div>
                </div>
                <div className="market-state">
                    OPEN
                </div>
            </div>

            <div className="exchange-table-wrap">
                <div className="exchange-table-header">
                    <span>CROP</span>
                    <span>LIVE PRICE</span>
                    <span>24H TREND</span>
                </div>
                
                <div className="exchange-rows">
                    {crops.map((c, idx) => (
                        <motion.div key={idx} className="exchange-row" layout>
                            <div className="crop-col">
                                <span className="crop-name-main">{c.name}</span>
                                <span className="crop-vol">{c.vol} Volume</span>
                            </div>
                            
                            <div className="price-col">
                                <motion.span 
                                    className="price-value-glow"
                                    key={c.price}
                                    initial={{ opacity: 0.5 }}
                                    animate={{ opacity: 1 }}
                                >
                                    ₹{Math.floor(c.price).toLocaleString()}
                                </motion.span>
                                <span className="unit-label">/Quintal</span>
                            </div>

                            <div className={`trend-col ${c.up ? 'bull' : 'bear'}`}>
                                <div className="trend-badge">
                                    {c.up ? <FiTrendingUp /> : <FiTrendingDown />}
                                    {Math.abs(c.trend)}%
                                </div>
                                <div className="spark-line-wrap">
                                    <svg viewBox="0 0 60 20" className="spark-svg">
                                        <path 
                                            d={`M0,${c.up ? 15 : 5} L15,${c.up ? 5 : 15} L30,10 L45,${c.up ? 2 : 18} L60,${c.up ? 0 : 20}`} 
                                            fill="none" 
                                            stroke={c.up ? "#10b981" : "#ef4444"} 
                                            strokeWidth="2" 
                                        />
                                    </svg>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="exchange-footer">
                <div className="scroll-ticker-wrap">
                    <div className="scroll-ticker">
                        <span>• MAHARASHTRA MARKET VOLUME UP 12% • </span>
                        <span>SOLAPUR ONION ARRIVAL: 400t • </span>
                        <span>WHEAT PRICE STABLE ACROSS ALL DISTRICTS • </span>
                    </div>
                </div>
            </div>

            <style>{`
                .market-exchange-board {
                    height: 100%;
                    border-radius: 40px;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }
                .exchange-header {
                    padding: 2.5rem;
                    background: rgba(255, 255, 255, 0.02);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                }
                .header-intel { display: flex; gap: 20px; align-items: center; }
                .pulse-icon { font-size: 2rem; color: #10b981; animation: pulse 2s infinite; }
                .header-intel h3 { font-size: 1.4rem; font-weight: 950; letter-spacing: 2px; }
                .market-state {
                    background: rgba(16, 185, 129, 0.1);
                    color: #10b981;
                    padding: 8px 18px;
                    border-radius: 50px;
                    font-size: 0.7rem;
                    font-weight: 900;
                    border: 1px solid rgba(16, 185, 129, 0.2);
                }
                .exchange-table-wrap { flex: 1; padding: 1.5rem 2.5rem; }
                .exchange-table-header {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    font-size: 0.7rem;
                    font-weight: 900;
                    color: rgba(255, 255, 255, 0.3);
                    margin-bottom: 1.5rem;
                    letter-spacing: 2px;
                }
                .exchange-rows { display: flex; flex-direction: column; gap: 1rem; }
                .exchange-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    align-items: center;
                    padding: 1rem 0;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.02);
                }
                .crop-name-main { display: block; font-size: 1.1rem; font-weight: 850; color: white; }
                .crop-vol { font-size: 0.7rem; color: #10b981; opacity: 0.7; }
                .price-value-glow { font-size: 1.2rem; font-weight: 950; color: #f1f5f9; display: block; }
                .unit-label { font-size: 0.6rem; opacity: 0.4; text-transform: uppercase; }
                .trend-badge {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    font-weight: 900;
                    font-size: 0.9rem;
                    margin-bottom: 5px;
                }
                .bull .trend-badge { color: #10b981; }
                .bear .trend-badge { color: #ef4444; }
                .spark-svg { opacity: 0.6; width: 60px; height: 20px; }
                .exchange-footer { padding: 1.5rem; background: rgba(0,0,0,0.2); }
                .scroll-ticker-wrap { overflow: hidden; white-space: nowrap; }
                .scroll-ticker { 
                    display: inline-block; 
                    animation: ticker 30s linear infinite; 
                    font-size: 0.75rem; 
                    font-weight: 800; 
                    color: #10b981; 
                }
                @keyframes ticker {
                    from { transform: translateX(100%); }
                    to { transform: translateX(-100%); }
                }
                @keyframes pulse {
                    0% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(0.9); }
                    100% { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </motion.div>
    );
};

// --- SCHEME EXPLORER ---
export const SchemeExplorer = ({ language }) => {
    const schemes = [
        { id: 1, title: language === 'mr' ? 'नमो शेतकरी महासन्मान' : 'Namo Shetkari Maha Samman', cat: 'Finance', icon: <FiShield />, status: 'ACTIVE' },
        { id: 2, title: language === 'mr' ? 'मुख्यमंत्री शाश्वत सिंचन' : 'CM Sustainable Irrigation', cat: 'Infra', icon: <FiDroplet />, status: 'NEW' },
        { id: 3, title: language === 'mr' ? 'कृषि यंत्रीकरण योजना' : 'Agri Mechanization Plan', cat: 'Tools', icon: <FiCpu />, status: 'OPEN' },
        { id: 4, title: language === 'mr' ? 'भाऊसाहेब फुंडकर फळबाग' : 'Orchard Plantation Scheme', cat: 'Garden', icon: <FiActivity />, status: 'NEW' },
        { id: 5, title: language === 'mr' ? 'गोपीनाथ मुंडे शेतकरी विमा' : 'Farmer Accident Insurance', cat: 'Safety', icon: <FiShield />, status: 'ACTIVE' },
        { id: 6, title: language === 'mr' ? 'डॉ. आंबेडकर कृषि स्वावलंबन' : 'Dr. Ambedkar Self-Reliance', cat: 'Social', icon: <FiUsers />, status: 'ACTIVE' }
    ];

    return (
        <div className="scheme-digital-vault">
            {schemes.map(s => (
                <motion.div 
                    key={s.id} 
                    className="gov-intel-card glass" 
                    whileHover={{ scale: 1.03, rotate: 0.5 }}
                >
                    <div className="card-accent-line"></div>
                    <div className="gov-card-main">
                        <div className="gov-icon-badge">
                            {s.icon}
                        </div>
                        <div className="gov-intel-info">
                            <div className="gov-meta-row">
                                <span className={`gov-status-chip ${s.status.toLowerCase()}`}>{s.status}</span>
                                <span className="gov-cat-tag"># {s.cat}</span>
                            </div>
                            <h4>{s.title}</h4>
                        </div>
                    </div>
                    <div 
                        className="gov-card-action" 
                        onClick={(e) => {
                            e.stopPropagation();
                            window.open("https://mahadbt.maharashtra.gov.in/", "_blank");
                        }}
                        title="Proceed to official portal"
                    >
                        <FiPlus />
                    </div>
                </motion.div>
            ))}

            <style>{`
                .scheme-digital-vault {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                .gov-intel-card {
                    padding: 1.5rem;
                    border-radius: 25px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    position: relative;
                    overflow: hidden;
                    background: linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01));
                }
                .card-accent-line {
                    position: absolute;
                    left: 0; top: 0; bottom: 0;
                    width: 4px;
                    background: #3b82f6;
                    box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
                }
                .gov-card-main { display: flex; align-items: center; gap: 20px; }
                .gov-icon-badge {
                    width: 50px; height: 50px;
                    border-radius: 15px;
                    background: rgba(59, 130, 246, 0.1);
                    color: #3b82f6;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.3rem;
                    border: 1px solid rgba(59, 130, 246, 0.2);
                }
                .gov-meta-row { display: flex; gap: 10px; margin-bottom: 5px; }
                .gov-status-chip {
                    font-size: 0.55rem;
                    font-weight: 950;
                    padding: 3px 10px;
                    border-radius: 5px;
                    letter-spacing: 1px;
                }
                .gov-status-chip.active { background: rgba(16, 185, 129, 0.1); color: #10b981; }
                .gov-status-chip.new { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
                .gov-status-chip.open { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
                .gov-cat-tag { font-size: 0.6rem; font-weight: 700; color: rgba(255,255,255,0.3); text-transform: uppercase; }
                .gov-intel-info h4 { font-size: 1.05rem; font-weight: 800; color: white; letter-spacing: -0.5px; }
                .gov-card-action {
                    width: 32px; height: 32px;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    opacity: 0.4;
                    transition: 0.3s;
                }
                .gov-intel-card:hover .gov-card-action { opacity: 1; background: #3b82f6; transform: rotate(90deg); }
            `}</style>
        </div>
    );
};
