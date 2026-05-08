import React, { useEffect, useState, useRef, useContext } from 'react'
import { FiLinkedin } from 'react-icons/fi'
import '../../Styles/About_us_ui.css'
import { MainContext } from '../../context/agroguru_context'

const TRANSLATIONS = {
  en: {
    hero_title: "Cultivating the Future",
    hero_span: "of Agriculture",
    hero_subtitle: "Empowering farmers through innovation, data, and sustainable practices.",
    stat_farmers: "Farmers Impacted",
    stat_labs: "Integrated Labs",
    stat_accuracy: "AI Accuracy",
    stat_districts: "Districts Covered",
    legacy_title: "Legacy",
    story_title: "Our Story",
    story_p1: "AgroGuru was born out of a simple yet powerful vision: to revolutionize the agricultural landscape of India. By merging traditional wisdom with cutting-edge technology, we provide a holistic ecosystem for the modern farmer.",
    story_p2: "From real-time market analytics to precision crop prediction, our platform is designed to minimize risk and maximize yield, ensuring a prosperous future for those who feed our nation.",
    milestones: [
      { year: "2023", title: "The Concept", desc: "AgroGuru was conceptualized to solve the data-gap in rural farming." },
      { year: "2024", title: "Alpha Phase", desc: "First 100 farmers used our Crop Prediction tool with 92% success." },
      { year: "2025", title: "The Ecosystem", desc: "Expansion into Marketplaces, Nurseries, and AI Disease Scanning." }
    ],
    pillar1_h: "Sustainable Growth",
    pillar1_p: "Promoting eco-friendly techniques and seasonal rotations for long-term soil vitality.",
    pillar2_h: "Data-Driven Decisions",
    pillar2_p: "Leveraging advanced analytics and soil health data to optimize every harvest.",
    pillar3_h: "Market Intelligence",
    pillar3_p: "Providing real-time price trends to ensure fair trades and maximum profitability.",
    team_sur: "The Minds Behind",
    team_title: "The Visionaries",
    role_frontend: "Frontend Lead",
    role_backend: "Backend Architect",
    role_creative: "Creative Director",
    role_ai: "AI Specialist",
    member_not_provided: "Member Farmer"
  },
  mr: {
    hero_title: "शेतीचे उज्ज्वल",
    hero_span: "भविष्य घडवत आहोत",
    hero_subtitle: "नाविन्यपूर्ण तंत्रज्ञान, डेटा आणि शाश्वत पद्धतींद्वारे शेतकऱ्यांचे सक्षमीकरण.",
    stat_farmers: "शेतकऱ्यांवर प्रभाव",
    stat_labs: "एकात्मिक प्रयोगशाळा",
    stat_accuracy: "AI अचूकता",
    stat_districts: "कव्हर केलेले जिल्हे",
    legacy_title: "वारसा",
    story_title: "आमची कथा",
    story_p1: "AgroGuru चा जन्म एका साध्या पण शक्तिशाली दृष्टीकोनातून झाला: भारताच्या कृषी परिदृश्यात क्रांती घडवून आणणे. पारंपारिक शहाणपण अत्याधुनिक तंत्रज्ञानासह एकत्रित करून, आम्ही आधुनिक शेतकऱ्यांसाठी एक सर्वांगीण इकोसिस्टम प्रदान करतो.",
    story_p2: "रिअल-टाइम मार्केट ॲनॅलिटिक्सपासून ते अचूक पीक अंदाजापर्यंत, आमचे प्लॅटफॉर्म जोखीम कमी करण्यासाठी आणि उत्पादन वाढवण्यासाठी डिझाइन केलेले आहे, जे आपल्या देशाला अन्न देणाऱ्यांसाठी समृद्ध भविष्य सुनिश्चित करते.",
    milestones: [
      { year: "२०२३", title: "संकल्पना", desc: "ग्रामीण शेतीमधील डेटाची दरी भरून काढण्यासाठी AgroGuru ची संकल्पना मांडली गेली." },
      { year: "२०२४", title: "अल्फा टप्पा", desc: "पहिल्या १०० शेतकऱ्यांनी ९२% यशासह आमचे पीक अंदाज साधन वापरले." },
      { year: "२०२५", title: "इकोसिस्टम", desc: "मार्केटप्लेस, रोपवाटिका आणि AI रोग स्कॅनिंगमध्ये विस्तार." }
    ],
    pillar1_h: "शाश्वत वाढ",
    pillar1_p: "जमिनीच्या दीर्घकालीन चैतन्यासाठी पर्यावरणपूरक तंत्रे आणि हंगामी चक्रांना प्रोत्साहन देणे.",
    pillar2_h: "डेटा-आधारित निर्णय",
    pillar2_p: "प्रत्येक कापणीला अनुकूल करण्यासाठी प्रगत विश्लेषण आणि जमिनीच्या आरोग्याचा डेटा वापरणे.",
    pillar3_h: "बाजार माहिती",
    pillar3_p: "वाजवी व्यापार आणि जास्तीत जास्त नफा सुनिश्चित करण्यासाठी रिअल-टाइम किंमत कल प्रदान करणे.",
    team_sur: "मागचे विचारवंत",
    team_title: "द्रष्टे नेतृत्व",
    role_frontend: "फ्रंटएंड प्रमुख",
    role_backend: "बॅकएंड आर्किटेक्ट",
    role_creative: "क्रिएटिव्ह डायरेक्टर",
    role_ai: "AI तज्ञ",
    member_not_provided: "सदस्य शेतकरी"
  }
}

// Custom Counter Component for Impact Stats
const StatCounter = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
        }
      },
      { threshold: 0.5 }
    );

    if (elementRef.current) observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [hasStarted, end, duration]);

  return <span ref={elementRef}>{count.toLocaleString()}{suffix}</span>;
};

const About = () => {
  const { language } = useContext(MainContext);
  const t = TRANSLATIONS[language || 'en'];
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const teamMembers = [
    { name: "Rushikesh Jagtap", role: t.role_frontend, img: "Rushikesh_img.jpg", linkedin: "https://www.linkedin.com/in/rushikesh-jagtap-269692260?utm_source=share_via&utm_content=profile&utm_medium=member_android" },
    { name: "Aditya Pawar", role: t.role_backend, img: "Aditya_img.jpg", linkedin: "https://www.linkedin.com/in/aditya-pawar-183198377?utm_source=share_via&utm_content=profile&utm_medium=member_android" },
    { name: "Siddharth Shreshthi", role: t.role_creative, img: "Siddharth_img.jpg", linkedin: "https://www.linkedin.com/in/siddharth-shreshthi?utm_source=share_via&utm_content=profile&utm_medium=member_android" },
    { name: "Rohan Suryavanshi", role: t.role_ai, img: "Rohan_img.jpg", linkedin: "https://www.linkedin.com/in/rohan-r-suryavanshi-a9727a25b?utm_source=share_via&utm_content=profile&utm_medium=member_android" }
  ];

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mouse-x', `${x}%`);
    card.style.setProperty('--mouse-y', `${y}%`);
  };

  return (
    <section id="about_page" className={`fade-in ${language === 'mr' ? 'marathi-mode' : ''}`}>
      {/* Parallax Hero Section */}
      <div id="about_hero">
        <div 
          className="hero_parallax_bg"
          style={{ transform: `translateY(${scrollY * 0.4}px)` }}
        ></div>
        <div id="about_hero_overlay">
          <div id="about_hero_content">
            <h1 className="hero_title">{t.hero_title} <br/> <span>{t.hero_span}</span></h1>
            <p className="hero_subtitle">{t.hero_subtitle}</p>
          </div>
        </div>
      </div>

      <div className="about_container">
        {/* Animated Impact Stats */}
        <div id="impact_stats_bar">
            <div className="stat_box">
                <h4><StatCounter end={12000} suffix="+" /></h4>
                <p>{t.stat_farmers}</p>
            </div>
            <div className="stat_box">
                <h4><StatCounter end={500} suffix="+" /></h4>
                <p>{t.stat_labs}</p>
            </div>
            <div className="stat_box">
                <h4><StatCounter end={95} suffix="%" /></h4>
                <p>{t.stat_accuracy}</p>
            </div>
            <div className="stat_box">
                <h4><StatCounter end={36} /></h4>
                <p>{t.stat_districts}</p>
            </div>
        </div>

        {/* Our Story Section */}
        <div id="about_story" className="reveal">
          <div className="section_header">
            <span className="sur_title">{t.legacy_title}</span>
            <h3>{t.story_title}</h3>
            <div className="title_line"></div>
          </div>
          <div className="story_content">
            <p>{t.story_p1}</p>
            <p>{t.story_p2}</p>
          </div>
        </div>

        {/* Interactive Timeline */}
        <div id="about_timeline" className="reveal">
            <div className="timeline_track"></div>
            {t.milestones.map((m, i) => (
                <div key={i} className="timeline_item">
                    <div className="timeline_dot"></div>
                    <div className="timeline_content">
                        <span className="m_year">{m.year}</span>
                        <h5>{m.title}</h5>
                        <p>{m.desc}</p>
                    </div>
                </div>
            ))}
        </div>

        {/* Glassmorphism Pillars */}
        <div id="about_pillars">
          <div className="pillar_card glass_effect">
            <div className="pillar_icon">🌱</div>
            <h4>{t.pillar1_h}</h4>
            <p>{t.pillar1_p}</p>
          </div>
          <div className="pillar_card glass_effect">
            <div className="pillar_icon">🔍</div>
            <h4>{t.pillar2_h}</h4>
            <p>{t.pillar2_p}</p>
          </div>
          <div className="pillar_card glass_effect">
            <div className="pillar_icon">📊</div>
            <h4>{t.pillar3_h}</h4>
            <p>{t.pillar3_p}</p>
          </div>
        </div>

        {/* Holographic Team Section */}
        <div id="about_team" className="reveal">
          <div className="section_header">
            <span className="sur_title">{t.team_sur}</span>
            <h3>{t.team_title}</h3>
            <div className="title_line"></div>
          </div>
          <div className="team_grid">
            {teamMembers.map((member, index) => (
              <div 
                key={index} 
                className="team_card holographic_effect"
                onMouseMove={handleMouseMove}
              >
                <div className="card_glow_overlay"></div>
                <h5>{member.name}</h5>
                <p>{member.role}</p>
                <div className="team_social">
                  <a href={member.linkedin} target="_blank" rel="noreferrer" title="LinkedIn">
                    <FiLinkedin />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
