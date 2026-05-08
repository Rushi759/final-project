import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Styles/Home_page_ui.css';
import { MainContext } from '../../context/agroguru_context';

const TRANSLATIONS = {
  en: {
    hub_title: "Explore Our",
    hub_span: "Service Ecosystem",
    hub_subtitle: "World-class agricultural intelligence anchored in the digital cloud.",
    launch_btn: "LAUNCH HUB →",
    ai_label: "AI READY",
    empty_title: "Empty Network",
    empty_desc: "Synchronize your filters to reveal hidden intelligence.",
    restore_btn: "Restore Connection",
    categories: ["All", "AI Tools", "Marketplace", "Scientific", "Resources"],
    services: {
      crop: { title: "Crop Prediction", desc: "AI-driven analysis for optimal crop selection based on soil data." },
      nur: { title: "Local Nursery", desc: "Find quality saplings and plants from verified nearby nurseries." },
      market: { title: "Agro Market", desc: "Direct marketplace to connect with bulk buyers and sellers." },
      lab: { title: "Scientific Lab", desc: "Expert soil and water testing services for your land." },
      crops: { title: "Crop Encyclopedia", desc: "Comprehensive database of crop care, diseases, and growth." },
      calendar: { title: "Seasonal Calendar", desc: "Our dynamic farming schedule tailored to your regional climate." },
      fertilizer: { title: "Fertilizer Calc", desc: "Calculate precise nutrient requirements for your soil." },
      finance: { title: "Agri-Finance", desc: "Loan calculators and financial planning for your farm." },
      scan: { title: "Disease AI Scanner", desc: "Identify crop pests and diseases instantly with AI vision." },
      water: { title: "Precision Water", desc: "Smart irrigation calculator for efficient water management." },
      price: { title: "Smart Price Hub", desc: "Compare factory and mandi rates to maximize your crop payout." },
      schemes: { title: "Govt. Schemes", desc: "Track active agricultural subsidies and income support schemes." },
      info: { title: "Knowledge Hub", desc: "Learn agricultural best practices and modern techniques." }
    }
  },
  mr: {
    hub_title: "आमची",
    hub_span: "सेवा इकोसिस्टम एक्सप्लोर करा",
    hub_subtitle: "डिजिटल क्लाउडमध्ये अँकर केलेली जागतिक दर्जाची कृषी बुद्धिमत्ता.",
    launch_btn: "हब लाँच करा →",
    ai_label: "AI सज्ज",
    empty_title: "रिकामे नेटवर्क",
    empty_desc: "लपलेली माहिती प्रकट करण्यासाठी तुमचे फिल्टर सिंक्रोनाइझ करा.",
    restore_btn: "कनेक्शन पुनर्संचयित करा",
    categories: ["सर्व", "AI साधने", "मार्केटप्लेस", "वैज्ञानिक", "संसाधने"],
    services: {
      crop: { title: "पीक अंदाज", desc: "मातीच्या डेटावर आधारित इष्टतम पीक निवडीसाठी AI-चालित विश्लेषण." },
      nur: { title: "स्थानिक रोपवाटिका", desc: "जवळपासच्या सत्यापित रोपवाटिकांमधून दर्जेदार रोपे आणि झाडे शोधा." },
      market: { title: "ॲग्रो मार्केट", desc: "घाऊक खरेदीदार आणि विक्रेत्यांशी जोडण्यासाठी थेट बाजारपेठ." },
      lab: { title: "वैज्ञानिक लॅब", desc: "तुमच्या जमिनीसाठी तज्ञ माती आणि पाणी चाचणी सेवा." },
      crops: { title: "पीक विश्वकोश", desc: "पीक निगा, रोग आणि वाढीचा सर्वसमावेशक डेटाबेस." },
      calendar: { title: "हंगामी कॅलेंडर", desc: "प्रादेशिक हवामानानुसार तयार केलेला आधुनिक कालक्रम." },
      fertilizer: { title: "खत कॅल्क्युलेटर", desc: "तुमच्या मातीसाठी अचूक पोषक गरजा मोजा." },
      finance: { title: "कृषी-वित्त", desc: "कर्ज कॅल्क्युलेटर आणि आर्थिक नियोजनासाठी विशेष साधन." },
      scan: { title: "रोग AI स्कॅनर", desc: "AI व्हिजनसह पिकांवरील कीड आणि रोग त्वरित ओळखा." },
      water: { title: "प्रिसिजन वॉटर", desc: "कार्यक्षम जल व्यवस्थापनासाठी स्मार्ट सिंचन कॅल्क्युलेटर." },
      price: { title: "स्मार्ट प्राइस हब", desc: "तुमचा पीक पेआउट वाढवण्यासाठी फॅक्टरी आणि मंडी दरांची तुलना करा." },
      schemes: { title: "सरकारी योजना", desc: "सक्रिय कृषी अनुदान आणि उत्पन्न समर्थन योजनांचा मागोवा घ्या." },
      info: { title: "नॉलेज हब", desc: "कृषी सर्वोत्तम पद्धती आणि आधुनिक तंत्रांचा अभ्यास करा." }
    }
  }
}

const ServiceHub = () => {
  const navigate = useNavigate();
  const { language } = useContext(MainContext);
  const t = TRANSLATIONS[language || 'en'];
  
  const [selectedCategory, setSelectedCategory] = useState(t.categories[0]);

  const categories = t.categories;

  const services = [
    { id: "crop", title: t.services.crop.title, path: "/services/crop", icon_emoji: "🌾", category: t.categories[1], desc: t.services.crop.desc, color: "#60a5fa" },
    { id: "scan", title: t.services.scan.title, path: "/services/scan", icon_emoji: "🔍", category: t.categories[1], desc: t.services.scan.desc, color: "#60a5fa" },
    { id: "price", title: t.services.price.title, path: "/services/price-hub", icon_emoji: "📊", category: t.categories[2], desc: t.services.price.desc, color: "#fbbf24" },
    { id: "market", title: t.services.market.title, path: "/services/market", icon_emoji: "🛒", category: t.categories[2], desc: t.services.market.desc, color: "#fbbf24" },
    { id: "schemes", title: t.services.schemes.title, path: "/services/schemes", icon_emoji: "📜", category: t.categories[4], desc: t.services.schemes.desc, color: "#8b5cf6" },
    { id: "finance", title: t.services.finance.title, path: "/services/finance", icon_emoji: "💰", category: t.categories[4], desc: t.services.finance.desc, color: "#8b5cf6" },
    { id: "lab", title: t.services.lab.title, path: "/services/lab", icon_emoji: "🔬", category: t.categories[3], desc: t.services.lab.desc, color: "#10b981" },
    { id: "water", title: t.services.water.title, path: "/services/water", icon_emoji: "🚰", category: t.categories[3], desc: t.services.water.desc, color: "#10b981" },
    { id: "fertilizer", title: t.services.fertilizer.title, path: "/services/fertilizer", icon_emoji: "💧", category: t.categories[3], desc: t.services.fertilizer.desc, color: "#10b981" },
    { id: "nur", title: t.services.nur.title, path: "/services/nur", icon_emoji: "🌱", category: t.categories[3], desc: t.services.nur.desc, color: "#10b981" },
    { id: "crops", title: t.services.crops.title, path: "/services/crops", icon_emoji: "📚", category: t.categories[4], desc: t.services.crops.desc, color: "#8b5cf6" },
    { id: "calendar", title: t.services.calendar.title, path: "/services/calendar", icon_emoji: "📅", category: t.categories[4], desc: t.services.calendar.desc, color: "#8b5cf6" },
    { id: "info", title: t.services.info.title, path: "/services/info", icon_emoji: "ℹ️", category: t.categories[4], desc: t.services.info.desc, color: "#8b5cf6" },
  ];

  // --- 3D Glass-Tilt Engine ---
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate 3D Rotation (-15deg to 15deg)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    
    card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
    card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
    card.style.setProperty('--rotate-x', `${rotateX}deg`);
    card.style.setProperty('--rotate-y', `${rotateY}deg`);
  };

  const handleMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.setProperty('--rotate-x', '0deg');
    card.style.setProperty('--rotate-y', '0deg');
  };

  const filteredServices = services.filter(service => {
    return selectedCategory === t.categories[0] || service.category === selectedCategory;
  });

  return (
    <div id="service_hub_wrap" className="fade-in">
      <div className="section_header_ecosystem">
          <h1>{t.hub_title} <span>{t.hub_span}</span></h1>
          <p>{t.hub_subtitle}</p>
          
          <div className="tags_navigation_container">
            <div className="category_tags_container">
              {categories.map((cat) => (
                <button 
                  key={cat}
                  className={`category_tag_hologram ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                  {selectedCategory === cat && <div className="tag-neural-dot"></div>}
                </button>
              ))}
            </div>
          </div>
      </div>

      <div className="ecosystem-mosaic-grid">
        {filteredServices.length > 0 ? (
          filteredServices.map((service, index) => (
            <div 
              key={index} 
              className="holographic-service-brick" 
              onClick={() => navigate(service.path)}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{ '--accent-clr': service.color }}
            >
               <div className="brick-glow-layer"></div>
               <div className="brick-inner-content">
                  <div className="brick-top-belt">
                    <span className="brick-icon">{service.icon_emoji}</span>
                    <span className="brick-cat-badge">{service.category}</span>
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.desc}</p>
                  <div className="brick-footer">
                    <span className="status-label">{t.ai_label}</span>
                    <button className="brick-access-btn">{t.launch_btn}</button>
                  </div>
               </div>
               
               <div className="brick-digital-layer"></div>
            </div>
          ))
        ) : (
          <div className="no_results_wrap">
             <div className="no_results_content">
                <span>🍃</span>
                <h2>{t.empty_title}</h2>
                <p>{t.empty_desc}</p>
                <button onClick={() => setSelectedCategory(t.categories[0])} className="back-btn-premium" style={{ marginTop: '20px', border: 'none' }}>{t.restore_btn}</button>
             </div>
          </div>
        )}
      </div>
      
      <style>{`
        #service_hub_wrap {
            padding: 4rem 40px;
            min-height: 100vh;
            background: radial-gradient(circle at 50% 10%, rgba(59, 130, 246, 0.05) 0%, transparent 50%);
        }

        .section_header_ecosystem {
            text-align: center;
            margin-bottom: 5rem;
            position: relative;
        }

        .section_header_ecosystem h1 {
            font-size: 3.5rem;
            font-weight: 950;
            color: white;
            letter-spacing: -2px;
            margin-bottom: 1rem;
        }

        .section_header_ecosystem h1 span {
            background: linear-gradient(135deg, #3b82f6, #60a5fa);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .category_tag_hologram {
            position: relative;
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.05);
            color: rgba(255, 255, 255, 0.5);
            padding: 12px 28px;
            border-radius: 15px;
            font-size: 0.85rem;
            font-weight: 800;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
            backdrop-filter: blur(10px);
            overflow: hidden;
        }

        .category_tag_hologram:hover {
            background: rgba(255, 255, 255, 0.05);
            color: white;
            transform: translateY(-5px);
            border-color: rgba(59, 130, 246, 0.3);
        }

        .category_tag_hologram.active {
            background: rgba(59, 130, 246, 0.1);
            color: #60a5fa;
            border-color: #3b82f6;
            box-shadow: 0 0 30px rgba(59, 130, 246, 0.2);
        }

        .tag-neural-dot {
            position: absolute;
            top: 5px; right: 5px;
            width: 6px; height: 6px;
            background: #3b82f6;
            border-radius: 50%;
            box-shadow: 0 0 10px #3b82f6;
        }

        .ecosystem-mosaic-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            grid-auto-rows: 280px;
            gap: 2rem;
            max-width: 1400px;
            margin: 0 auto;
            perspective: 1000px;
        }

        .holographic-service-brick:nth-child(3n+1) { grid-column: span 2; }
        @media (max-width: 1000px) { .holographic-service-brick:nth-child(n) { grid-column: span 1; } }

        .holographic-service-brick {
            position: relative;
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 40px;
            padding: 2.5rem;
            overflow: hidden;
            transition: transform 0.1s ease-out, border-color 0.4s ease, box-shadow 0.4s ease;
            transform: perspective(1000px) rotateX(var(--rotate-x, 0deg)) rotateY(var(--rotate-y, 0deg));
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        .holographic-service-brick:hover {
            border-color: var(--accent-clr);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(var(--accent-clr), 0.1);
        }

        .brick-glow-layer {
            position: absolute;
            inset: 0;
            background: radial-gradient(circle at var(--mouse-x) var(--mouse-y), var(--accent-clr) 0%, transparent 60%);
            opacity: 0;
            transition: opacity 0.4s ease;
            pointer-events: none;
            mix-blend-mode: overlay;
        }

        .holographic-service-brick:hover .brick-glow-layer { opacity: 0.15; }

        .brick-top-belt {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }

        .brick-icon {
            font-size: 3.5rem;
            filter: drop-shadow(0 0 10px var(--accent-clr));
        }

        .brick-cat-badge {
            font-size: 0.65rem;
            font-weight: 900;
            letter-spacing: 2px;
            color: var(--accent-clr);
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.05);
            padding: 6px 15px;
            border-radius: 30px;
            text-transform: uppercase;
        }

        .holographic-service-brick h3 {
            font-size: 1.8rem;
            font-weight: 900;
            color: white;
            margin: 1.5rem 0 0.5rem;
        }

        .holographic-service-brick p {
            font-size: 0.95rem;
            color: rgba(255, 255, 255, 0.5);
            line-height: 1.6;
            margin: 0;
        }

        .brick-footer {
            margin-top: 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .status-label {
            font-size: 0.6rem;
            font-weight: 900;
            color: #60a5fa;
            opacity: 0.6;
        }

        .brick-access-btn {
            background: transparent;
            border: none;
            color: white;
            font-size: 0.8rem;
            font-weight: 800;
            letter-spacing: 1px;
            cursor: pointer;
            transition: 0.3s;
        }

        .holographic-service-brick:hover .brick-access-btn {
            color: var(--accent-clr);
            transform: translateX(5px);
        }

        .brick-digital-layer {
            position: absolute;
            inset: 0;
            background-image: 
              linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
            background-size: 20px 20px;
            mask-image: linear-gradient(180deg, transparent, white);
            pointer-events: none;
            z-index: -1;
        }
      `}</style>
    </div>
  );
};

export default ServiceHub;
