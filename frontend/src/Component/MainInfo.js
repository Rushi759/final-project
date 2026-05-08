import React, { useContext } from 'react'
import '../Styles/Home_page_ui.css'
import { useNavigate } from 'react-router-dom'
import { MainContext } from '../context/agroguru_context'

const TRANSLATIONS = {
    en: {
        header_h1: "Revolutionize Your Farm.",
        header_span: "Explore Our Ecosystem.",
        btn_predict: "Predict Now",
        btn_nursery: "Explore Nursery",
        btn_market: "Visit Market",
        btn_lab: "Check Labs",
        btn_news: "Read News",
        features: {
            crop: {
                title: "Maximize Yields with AI Prediction",
                desc: "Our AI-powered technology leverages machine learning to accurately forecast crop growth and yield potential. Join us and unlock the full potential of your farm with data-driven precision."
            },
            nursery: {
                title: "Discover Perfect Crops at Our Nursery",
                desc: "Find the right crops for your soil. We offer a diverse selection of quality plants and seeds to help you maximize your harvests and thrive."
            },
            market: {
                title: "Fresh & High-Quality Plant Market",
                desc: "Experience the taste of farm-fresh produce. From seasonal fruits to specialized grains, discover locally grown products directly from the source."
            },
            lab: {
                title: "Advanced Laboratory Services",
                desc: "Optimize growth with soil and water testing. Our laboratory provides comprehensive solutions for disease diagnosis and sustainability across your fields."
            },
            news: {
                title: "Stay Ahead with Agricultural Trends",
                desc: "Our informative news feature is your source for emerging tech and industry insights. Stay informed and ahead of the game with the latest farming innovations."
            }
        }
    },
    mr: {
        header_h1: "तुमच्या शेतीत क्रांती घडवा.",
        header_span: "आमची इकोसिस्टम एक्सप्लोर करा.",
        btn_predict: "आता अंदाज लावा",
        btn_nursery: "रोपवाटिका शोधा",
        btn_market: "बाजारपेठेला भेट द्या",
        btn_lab: "लॅब तपासा",
        btn_news: "बातम्या वाचा",
        features: {
            crop: {
                title: "AI अंदाजासह जास्तीत जास्त उत्पन्न मिळवा",
                desc: "आमचे AI-आधारित तंत्रज्ञान पिकांची वाढ आणि उत्पन्नाच्या संभाव्यतेचा अचूक अंदाज लावण्यासाठी मशीन लर्निंगचा वापर करते. आमच्याशी जोडा आणि डेटा-चालित अचूकतेसह तुमच्या फार्मची पूर्ण क्षमता अनलॉक करा."
            },
            nursery: {
                title: "आमच्या रोपवाटिकेत परिपूर्ण पिके शोधा",
                desc: "तुमच्या मातीसाठी योग्य पिके शोधा. आम्ही तुम्हाला तुमची कापणी जास्तीत जास्त वाढवण्यात आणि भरभराट करण्यास मदत करण्यासाठी दर्जेदार रोपे आणि बियाण्यांची विविध निवड देतो."
            },
            market: {
                title: "ताजी आणि उच्च-गुणवत्तेची वनस्पती बाजारपेठ",
                desc: "शेत-ताजा उत्पादनांच्या चवीचा अनुभव घ्या. हंगामी फळांपासून ते विशेष धान्यांपर्यंत, थेट स्त्रोताकडून स्थानिक पातळीवर पिकवलेली उत्पादने शोधा."
            },
            lab: {
                title: "प्रगत प्रयोगशाळा सेवा",
                desc: "माती आणि पाणी तपासणीसह वाढ सुधारा. आमची प्रयोगशाळा तुमच्या शेतात रोगाचे निदान आणि शाश्वततेसाठी सर्वसमावेशक उपाय प्रदान करते."
            },
            news: {
                title: "कृषी ट्रेंडसह पुढे राहा",
                desc: "आमचे माहितीपूर्ण न्यूज फीचर हे उदयोन्मुख टेक आणि उद्योग अंतर्दृष्टीसाठी तुमचे स्रोत आहे. नवीनतम शेती नवकल्पनांसह माहिती मिळवा आणि पुढे रहा."
            }
        }
    }
}

const MainInfo = () => {
    const navigate = useNavigate();
    const { language } = useContext(MainContext);
    const t = TRANSLATIONS[language || 'en'];

    const features = [
        {
            id: "crop",
            title: t.features.crop.title,
            desc: t.features.crop.desc,
            btnText: t.btn_predict,
            img: "ft1_img.jpg",
            route: "/services/crop"
        },
        {
            id: "nursery",
            title: t.features.nursery.title,
            desc: t.features.nursery.desc,
            btnText: t.btn_nursery,
            img: "ft2_img.jpg",
            route: "/services/nur"
        },
        {
            id: "market",
            title: t.features.market.title,
            desc: t.features.market.desc,
            btnText: t.btn_market,
            img: "ft3_img.jpg",
            route: "/services/market"
        },
        {
            id: "lab",
            title: t.features.lab.title,
            desc: t.features.lab.desc,
            btnText: t.btn_lab,
            img: "ft4_img.jpg",
            route: "/services/lab"
        },
        {
            id: "news",
            title: t.features.news.title,
            desc: t.features.news.desc,
            btnText: t.btn_news,
            img: "ft5_img.jpeg",
            route: "/services/info"
        }
    ];

    const handleMouseMove = (e) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * 10;
        const rotateY = ((centerX - x) / centerX) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    };

    const handleMouseLeave = (e) => {
        const card = e.currentTarget;
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    };

    return (
        <section id="features_grid" className="fade-in">
            <div className="section_header">
                <h1>{t.header_h1} <span>{t.header_span}</span></h1>
            </div>

            <div className="bento-container">
                {features.map((ft) => (
                    <div
                        key={ft.id}
                        className={`fts ft-${ft.id} tilt-card`}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                    >
                        <div className="fts_imgs">
                            <img src={`/assets/${ft.img}`} alt={ft.title} />
                        </div>
                        <div className="fts_cnts">
                            <h3>{ft.title}</h3>
                            <p>{ft.desc}</p>
                            <button onClick={() => navigate(ft.route)}>{ft.btnText}</button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default MainInfo;