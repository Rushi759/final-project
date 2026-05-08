import React, { useState, useEffect, useRef, useContext } from 'react';
import { FiSend, FiMessageSquare, FiX, FiCpu, FiTrendingUp } from 'react-icons/fi';
import { MainContext } from '../context/agroguru_context';
import '../Styles/AgroGPT.css';

const AgroGPT = () => {
    const { language } = useContext(MainContext);
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { 
            id: 1, 
            text: language === 'mr' ? 'नमस्कार! मी ॲग्रोगुरू AI आहे. मी तुम्हाला शेतीविषयक कशी मदत करू शकतो?' : 'Hello! I am AgroGuru AI. How can I assist you with your farming today?', 
            sender: 'ai' 
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulated AI response logic
        setTimeout(() => {
            let aiResponse = "";
            const lowerInput = input.toLowerCase();

            if (lowerInput.includes('wheat') || lowerInput.includes('गहू')) {
                aiResponse = language === 'mr' ? "गहू पिकासाठी ऑक्टोबरच्या अखेरीस पेरणी करणे उत्तम आहे. किमान २४ अंश तापमान आवश्यक आहे." : "For wheat, late October is the best time for sowing. A temperature of at least 24°C is ideal.";
            } else if (lowerInput.includes('pest') || lowerInput.includes('कीड')) {
                aiResponse = language === 'mr' ? "कीड नियंत्रणासाठी कडुनिंबाच्या अर्काची (Neem Extract) फवारणी करा. हे सेंद्रिय आणि सुरक्षित आहे." : "For pest control, try spraying Neem Extract. It is organic and safe for your crops.";
            } else if (lowerInput.includes('price') || lowerInput.includes('भाव')) {
                aiResponse = language === 'mr' ? "कांद्याचे भाव पुढील आठवड्यात १० टक्क्यांनी वाढण्याची शक्यता आहे. विक्रीसाठी थोडा वेळ थांबणे फायद्याचे ठरेल." : "Onion prices are expected to rise by 10% next week. It might be beneficial to wait a while before selling.";
            } else {
                aiResponse = language === 'mr' ? "हा एक चांगला प्रश्न आहे. आमच्या कृषी तज्ज्ञांच्या मते, पिकाच्या सुदृढ वाढीसाठी माती परीक्षण करणे नेहमीच महत्त्वाचे असते." : "That's a great question. According to our agronomists, soil testing is always the first step for healthy crop growth.";
            }

            setMessages(prev => [...prev, { id: Date.now() + 1, text: aiResponse, sender: 'ai' }]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className={`agrogpt-wrapper ${isOpen ? 'active' : ''}`}>
            {/* Floating Toggle Button */}
            {!isOpen && (
                <button className="agrogpt-fab" onClick={() => setIsOpen(true)}>
                    <div className="fab-pulse"></div>
                    <FiCpu />
                    <span className="fab-label">AGROGPT</span>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="agrogpt-window glass">
                    <div className="agrogpt-header">
                        <div className="header-info">
                            <FiCpu className="ai-icon-rot" />
                            <div>
                                <h4>AGROGPT AI</h4>
                                <span>{isTyping ? 'Analyzing...' : 'Online'}</span>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)}><FiX /></button>
                    </div>

                    <div className="agrogpt-messages">
                        {messages.map(msg => (
                            <div key={msg.id} className={`msg-bubble ${msg.sender}`}>
                                {msg.text}
                            </div>
                        ))}
                        {isTyping && (
                            <div className="msg-bubble ai typing">
                                <span></span><span></span><span></span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="agrogpt-input-area">
                        <input 
                            type="text" 
                            placeholder={language === 'mr' ? "तुमचा प्रश्न विचारा..." : "Ask your query..."} 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button onClick={handleSend}><FiSend /></button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AgroGPT;
