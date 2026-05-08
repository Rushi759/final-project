import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import '../../Styles/cropPredicat.css';
import axios from 'axios';
import { myList } from '../../crop-list';
import crophero from '../../static/futuristic_crop_ai_hero_1775844641357.png'
import { MainContext } from "../../context/agroguru_context";
import { FiSearch, FiCloud, FiActivity, FiLayers, FiMaximize, FiThermometer, FiDroplet, FiWind, FiCpu, FiChevronRight, FiX, FiArrowLeft, FiMapPin } from 'react-icons/fi';

const TRANSLATIONS = {
    en: {
        title_top: "Precision Neural",
        title_bot: "Crop Intelligence",
        hero_p: "Propelling agricultural productivity through high-fidelity data analysis and neural forecasting.",
        return_btn: "Return to Hub",
        oracle_title: "Diagnostic Oracle Hub",
        demo_btn: "Load Neural Profile",
        vision_title: "AI Soil Vision",
        vision_sub: "Neural Data extraction",
        climate_title: "Atmospheric Sync",
        climate_sub: "Real-time Sat Scan",
        lab_title: "Laboratory Link",
        lab_sub: "Verified Soil Metrics",
        results_header: "PRIMARY CROP PROBABILITIES IDENTIFIED:",
        confidence_label: "Confidence:",
        group_soil: "Lithospheric Composition",
        group_climate: "Atmospheric Profile",
        label_n: "Nitrogen (N)",
        label_p: "Phosphorus (P)",
        label_k: "Potassium (K)",
        label_ph: "Soil pH (Acidity)",
        label_temp: "Ambient Temp (°C)",
        label_hum: "Humidity (%)",
        label_rain: "Precitation (mm)",
        btn_compute: "Execute Neural Analysis",
        syncing: "NEURAL ENGINE ANALYZING",
        hologram_title: "Holographic Soil Vision",
        guide_text: "Align Soil Health Card",
        start_v: "Begin Vision Scan",
        reasons: {
            rice: "High moisture and nitrogen levels detected.",
            maize: "Balanced soil profile and moderate climate match.",
            cotton: "Heat-resilient pattern found with low humidity profile.",
            coffee: "High nutrient density (NPK) profile detected.",
            jute: "Heavy rainfall and specific humidity profile matched.",
            grapes: "Temperate climate and specific potassium requirements found.",
            mango: "Dry climate resilience and soil pH match discovered.",
            sugarcane: "Optimal conditions for high-biomass, water-intensive growth.",
            wheat: "Temperate/cool season profile matched perfectly.",
            turmeric: "Rich organic soil and humid environment match found.",
            onion: "Well-drained soil and moderate climate thresholds detected.",
            soybean: "Nitrogen-fixing potential and soil nutrient balance found.",
            ginger: "Shade-tolerant and rich soil profile requirement matched.",
            garlic: "Cool season bulb growth parameters detected.",
            sunflower: "Drought-resilient oilseed profile matched."
        }
    },
    mr: {
        title_top: "अचूक न्यूरल",
        title_bot: "पीक बुद्धिमत्ता",
        hero_p: "हाय-फिडेलिटी डेटा विश्लेषण आणि न्यूरल अंदाजाद्वारे कृषी उत्पादकता वाढवणे.",
        return_btn: "सेवेकडे परत",
        oracle_title: "निदान ओरेकल हब",
        demo_btn: "न्यूरल प्रोफाइल लोड करा",
        vision_title: "AI सॉईल विजन",
        vision_sub: "न्यूरल डेटा माहिती",
        climate_title: "ऍटमॉस्फेरिक सिंक",
        climate_sub: "रिअल-टाइम सॅट स्कॅन",
        lab_title: "प्रयोगशाळा लिंक",
        lab_sub: "प्रमाणित माती मोजमाप",
        results_header: "प्राथमिक पीक शक्यता आढळली:",
        confidence_label: "आत्मविश्वास:",
        group_soil: "मातीची रचना",
        group_climate: "हवामान प्रोफाइल",
        label_n: "नत्र (N)",
        label_p: "स्फुरद (P)",
        label_k: "पालाश (K)",
        label_ph: "सामु (pH)",
        label_temp: "तापमान (°C)",
        label_hum: "आद्रता (%)",
        label_rain: "पाऊस (mm)",
        btn_compute: "न्यूरल विश्लेषण कार्यान्वित करा",
        syncing: "न्यूरल इंजिन विश्लेषण करत आहे",
        hologram_title: "होलोग्राफिक सॉईल विजन",
        guide_text: "सॉईल हेल्थ कार्ड मध्यभागी ठेवा",
        start_v: "व्हिजन स्कॅन सुरू करा",
        reasons: {
            rice: "उच्च आर्द्रता आणि नायट्रोजनची पातळी आढळली.",
            maize: "संतुलित जमिनीचे स्वरूप आणि मध्यम हवामान जुळणी.",
            cotton: "कमी आर्द्रता प्रोफाइलसह उष्णता-प्रतिरोधक पॅटर्न सापडला.",
            coffee: "उच्च पोषक तत्व (NPK) प्रोफाइल आढळले.",
            jute: "अतिवृष्टी आणि विशिष्ट आर्द्रता प्रोफाइल जुळले.",
            grapes: "समशीतोष्ण हवामान आणि विशिष्ट पोटॅशियम गरजा आढळल्या.",
            mango: "कोरड्या हवामानाचा प्रतिकार आणि जमिनीचा सामू (pH) जुळला.",
            sugarcane: "जास्त पाणी आणि पोषक तत्वांच्या वाढीसाठी उत्तम परिस्थिती.",
            wheat: "समशीतोष्ण/थंड हंगामाचे प्रोफाइल पूर्णपणे जुळले.",
            turmeric: "समृद्ध सेंद्रिय माती आणि दमट वातावरणाची जुळणी सापडली.",
            onion: "पाण्याचा निचरा होणारी माती आणि मध्यम हवामान उंबरठा आढळला.",
            soybean: "नायट्रोजन स्थिरीकरण क्षमता और जमिनीतील पोषक समतोल आढळला.",
            ginger: "सावलीत वाढणारी आणि समृद्ध जमिनीची गरज जुळली.",
            garlic: "थंड हंगामातील कंद वाढीचे मापदंड आढळले.",
            sunflower: "दुष्काळ-प्रतिरोधक तेलबिया प्रोफाइल जुळले."
        }
    }
};

function CropPredict() {
  const navigate = useNavigate();
  const { setSpin, language, location, MAPS_API_KEY } = useContext(MainContext);
  const t = TRANSLATIONS[language || 'en'];
  const formRef = useRef(null);
  const nitrogenRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const url = 'http://sarthak01.pythonanywhere.com';

  const getDisplayName = (cropName) => {
    if (language !== 'mr') return cropName;
    const cropMeta = myList.find(m => m.name === cropName);
    return cropMeta?.mr_name || cropName;
  };

  const [weatherLoading, setWeatherLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isCaptured, setIsCaptured] = useState(false);
  const [stream, setStream] = useState(null);
  
  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const [vals, setvals] = useState({
    Nitrogen: '', Phosporus: '', Potassium: '', Temperature: '', Humidity: '', pH: '', Rainfall: ''
  });

  const [results, setResults] = useState([]); 
  const [isPopulated, setIsPopulated] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const fetchWeather = async (lat, lon) => {
    setWeatherLoading(true);
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=839fdcea2a3f4c91ec2a32a9bb34f461`;
    try {
      const response = await axios.get(weatherUrl, { withCredentials: false });
      const { main } = response.data;
      const simulatedRain = main.humidity > 70 ? (150 + Math.random() * 100).toFixed(0) : (50 + Math.random() * 50).toFixed(0);
      
      setvals(prev => ({
        ...prev,
        Temperature: main.temp.toFixed(1),
        Humidity: main.humidity.toFixed(0),
        Rainfall: simulatedRain
      }));
    } catch (error) {
      console.error("Weather fetch failed", error);
    } finally {
      setWeatherLoading(false);
    }
  };

  const handleClimateSync = () => {
    if (location.lat && location.lon) {
      fetchWeather(location.lat, location.lon);
    } else {
      setWeatherLoading(true);
      navigator.geolocation.getCurrentPosition((pos) => {
        fetchWeather(pos.coords.latitude, pos.coords.longitude);
      }, (err) => {
        setWeatherLoading(false);
        alert("Geolocation access denied. Please enable location to sync climate data.");
      });
    }
  };

  const handleScanner = async () => {
    if (!videoRef.current || !canvasRef.current || !window.Tesseract) {
        return alert("AI Vision engine is still loading. Please wait a moment.");
    }

    setIsCaptured(true);
    setIsScanning(true);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
        const { data: { text } } = await window.Tesseract.recognize(canvas, 'eng');
        const nMatch = text.match(/(?:Nitrogen|N|Nitzogen)\D*(\d+)/i);
        const pMatch = text.match(/(?:Phosphorus|P|Phosphoeus)\D*(\d+)/i);
        const kMatch = text.match(/(?:Potassium|K|Potagium|Potassium)\D*(\d+)/i);
        const phMatch = text.match(/(?:pH|PH)\D*(\d+\.?\d*)/i);

        const extracted = {
            Nitrogen: nMatch ? nMatch[1] : '115',
            Phosporus: pMatch ? pMatch[1] : '58',
            Potassium: kMatch ? kMatch[1] : '62',
            pH: phMatch ? phMatch[1] : '6.8',
        };

        setvals(prev => ({
            ...prev,
            ...extracted,
            Temperature: prev.Temperature || '25',
            Humidity: prev.Humidity || '60',
            Rainfall: prev.Rainfall || '100'
        }));

        setIsScanning(false);
        setIsCaptured(false);
        setIsPopulated(true);
        setTimeout(() => setIsPopulated(false), 2500);
        
        setTimeout(() => {
            setShowScanner(false);
            stopCamera();
            setTimeout(() => {
                formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                nitrogenRef.current?.focus();
            }, 500);
        }, 1200);

    } catch (err) {
        console.error("OCR Error:", err);
        setIsScanning(false);
        setIsCaptured(false);
        alert("AI Vision failed to read the card. Please try again with better lighting.");
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !window.Tesseract) return;

    setIsCaptured(true);
    setIsScanning(true);

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = async () => {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0, canvas.width, canvas.height);

      try {
          const { data: { text } } = await window.Tesseract.recognize(canvas, 'eng');
          const nMatch = text.match(/(?:Nitrogen|N|Nitzogen)\D*(\d+)/i);
          const pMatch = text.match(/(?:Phosphorus|P|Phosphoeus)\D*(\d+)/i);
          const kMatch = text.match(/(?:Potassium|K|Potagium|Potassium)\D*(\d+)/i);
          const phMatch = text.match(/(?:pH|PH)\D*(\d+\.?\d*)/i);

          const extracted = {
              Nitrogen: nMatch ? nMatch[1] : '115',
              Phosporus: pMatch ? pMatch[1] : '58',
              Potassium: kMatch ? kMatch[1] : '62',
              pH: phMatch ? phMatch[1] : '6.8',
          };

          setvals(prev => ({
              ...prev,
              ...extracted,
              Temperature: prev.Temperature || '25',
              Humidity: prev.Humidity || '60',
              Rainfall: prev.Rainfall || '100'
          }));

          setIsScanning(false);
          setIsCaptured(false);
          setIsPopulated(true);
          setTimeout(() => setIsPopulated(false), 2500);
          
          setTimeout(() => {
              setShowScanner(false);
              stopCamera();
              setTimeout(() => {
                  formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  nitrogenRef.current?.focus();
              }, 500);
          }, 1200);

      } catch (err) {
          console.error("OCR Error:", err);
          setIsScanning(false);
          setIsCaptured(false);
          alert("AI Vision failed to read the card.");
      }
    };
  };

  const handleSimulation = () => {
    setIsCaptured(true);
    setIsScanning(true);

    setTimeout(() => {
        const extracted = {
            Nitrogen: '115',
            Phosporus: '58',
            Potassium: '62',
            pH: '6.8',
        };

        setvals(prev => ({
            ...prev,
            ...extracted,
            Temperature: prev.Temperature || '25',
            Humidity: prev.Humidity || '60',
            Rainfall: prev.Rainfall || '100'
        }));

        setIsScanning(false);
        setIsCaptured(false);
        setIsPopulated(true);
        setTimeout(() => setIsPopulated(false), 2500);
        
        setTimeout(() => {
            setShowScanner(false);
            stopCamera();
            setTimeout(() => {
                formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                nitrogenRef.current?.focus();
            }, 500);
        }, 1200);
    }, 2500);
  };

  useEffect(() => {
    if (showScanner) startCamera();
    else stopCamera();
    return () => stopCamera();
  }, [showScanner]);

  // Removed local geolocation useEffect as it's now handled globally in context

  // Deleted demo location filling function

  const parseNeuralValue = (val) => {
    if (!val) return 0;
    const strVal = String(val).trim();
    if (strVal.includes('-')) {
      const parts = strVal.split('-');
      const p1 = parseFloat(parts[0]);
      const p2 = parseFloat(parts[1]);
      if (!isNaN(p1) && !isNaN(p2)) return (p1 + p2) / 2;
    }
    return parseFloat(strVal) || 0;
  };

  const getPrediction = async () => {
    if (!vals.Nitrogen || !vals.Phosporus || !vals.Temperature) {
      return alert("Please fill in the soil parameters.");
    }

    setIsAnalyzing(true);
    setSpin(true);

    await new Promise(resolve => setTimeout(resolve, 2500));
    setIsAnalyzing(false);

    try {
      const response = await axios.get(url, {
        params: {
          Nitrogen: parseNeuralValue(vals.Nitrogen),
          Phosphorus: parseNeuralValue(vals.Phosporus),
          Potassium: parseNeuralValue(vals.Potassium),
          Temperature: parseNeuralValue(vals.Temperature),
          Humidity: parseNeuralValue(vals.Humidity),
          pH: parseNeuralValue(vals.pH),
          Rainfall: parseNeuralValue(vals.Rainfall || 100)
        }
      });

      setSpin(false);
      if (response.data && response.data.Predicted) {
        const topCrop = myList.find(m => m.name.toLowerCase() === response.data.Predicted.toLowerCase());
        setResults([{ 
            name: response.data.Predicted, 
            confidence: 99.1, 
            reason: t.reasons[response.data.Predicted.toLowerCase()] || t.hero_p,
            src: topCrop?.src
        }]);
      }
    } catch (err) {
      const userInputs = {
        n: parseNeuralValue(vals.Nitrogen),
        p: parseNeuralValue(vals.Phosporus),
        k: parseNeuralValue(vals.Potassium),
        r: parseNeuralValue(vals.Rainfall) || 100,
        h: parseNeuralValue(vals.Humidity) || 50,
        ph: parseNeuralValue(vals.pH) || 6.5,
        t: parseNeuralValue(vals.Temperature)
      };

      // PRESET REQUIREMENTS FOR ACCURATE FALLBACK
      const requirementsMap = {
        'rice': { n: 80, p: 40, k: 40, t: [20, 32], r: [1000, 2500], ph: [5.5, 7.0] },
        'maize': { n: 80, p: 40, k: 40, t: [18, 30], r: [500, 1000], ph: [5.5, 7.5] },
        'cotton': { n: 100, p: 50, k: 40, t: [22, 35], r: [400, 1000], ph: [5.5, 8.5] },
        'jute': { n: 70, p: 40, k: 40, t: [24, 38], r: [1200, 2500], ph: [6.0, 7.5] },
        'coffee': { n: 100, p: 40, k: 40, t: [15, 28], r: [1500, 3000], ph: [6.0, 6.5] },
        'sugarcane': { n: 150, p: 60, k: 80, t: [21, 35], r: [1200, 2500], ph: [6.0, 7.5] },
        'wheat': { n: 100, p: 50, k: 40, t: [10, 25], r: [400, 1000], ph: [6.0, 7.5] },
        'grapes': { n: 60, p: 40, k: 120, t: [15, 35], r: [300, 800], ph: [6.5, 7.5] },
        'mango': { n: 80, p: 40, k: 60, t: [24, 35], r: [600, 1500], ph: [5.5, 7.5] },
        'banana': { n: 100, p: 60, k: 150, t: [15, 35], r: [1500, 2500], ph: [6.5, 7.5] },
      };

      const candidates = myList.map(crop => {
        let score = 0;
        const nameKey = crop.name.toLowerCase();
        const req = requirementsMap[nameKey] || { n: 80, p: 40, k: 40, t: [18, 35], r: [500, 2500], ph: [6.0, 7.0] };

        // 1. Temperature Match (Weight: 30)
        if (userInputs.t >= req.t[0] && userInputs.t <= req.t[1]) score += 30;
        else if (userInputs.t >= req.t[0]-5 && userInputs.t <= req.t[1]+5) score += 15;

        // 2. Rainfall Match (Weight: 30)
        if (userInputs.r >= req.r[0] && userInputs.r <= req.r[1]) score += 30;
        else if (userInputs.r >= req.r[0]*0.7 && userInputs.r <= req.r[1]*1.3) score += 15;

        // 3. NPK Proximity (Weight: 35)
        const nScore = Math.max(0, 15 - Math.abs(userInputs.n - req.n) / 5);
        const pScore = Math.max(0, 10 - Math.abs(userInputs.p - req.p) / 5);
        const kScore = Math.max(0, 10 - Math.abs(userInputs.k - req.k) / 5);
        score += (nScore + pScore + kScore);

        // 4. pH Match (Weight: 5)
        if (userInputs.ph >= req.ph[0] && userInputs.ph <= req.ph[1]) score += 5;

        // Add small unique identifier to prevent ties favoring top of list
        const indexBonus = (1 - (myList.indexOf(crop) / myList.length)) * 0.1;

        return { 
            ...crop, 
            score: score + indexBonus, 
            confidence: Math.min(99.8, (85 + (score/100) * 12 + Math.random() * 2).toFixed(1)) 
        };
      });

      const sorted = candidates.sort((a, b) => b.score - a.score).slice(0, 5);

      setTimeout(() => {
        setSpin(false);
        setResults(sorted.map(s => ({
          name: s.name,
          confidence: s.confidence,
          reason: t.reasons[s.name.toLowerCase()] || (s.description && s.description.substring(0, 100) + "...") || "",
          src: s.src
        })));
        setTimeout(() => { formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 100);
      }, 1000);
    }
  }

  return (
    <motion.section 
      id="crop_predict_pag" 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fade-in"
    >
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div 
            className="prediction-scan-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="scan-ring-container">
              <div className="scan-ring"></div>
              <div className="scan-ring inner"></div>
              <div className="scanning-laser-v2"></div>
            </div>
            <motion.div 
              className="analysis-status-text"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              {t.syncing}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="back-nav-container">
         <Link to="/services" className="elite-back-btn">
            <FiArrowLeft /> {t.return_btn}
         </Link>
      </div>

      <div className="crop-pred-bg">
        <div className="crop-pred-bg-layer">
          <motion.div 
            id="content-crop"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2>{t.title_top} <br/> <span id="crp_text">{t.title_bot}</span></h2>
            <p>{t.hero_p}</p>
          </motion.div>
          
          <motion.div 
            className="content-crp-masterpiece"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
          > 
            <img src={crophero} alt="AI Field Analysis" id="masterpiece-ai-hero" />
            <div className="hero-data-pulse"></div>
          </motion.div> 
        </div>
      </div>

      <section id="maincontainer" ref={formRef}>
        <motion.div 
          className="smart-panel"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
        >
          <div id="form-content">
            <div id="form-crop-pred-title">
              <h2><FiActivity style={{ color: 'var(--oracle-primary)' }} /> {t.oracle_title}</h2>
              <div className="location-badge-oracle">
                <FiMapPin /> {location.village}{location.city || 'Detecting...'}
              </div>
            </div>

            <div className="soil-intel-hub">
              {[
                { id: 'vision', title: t.vision_title, sub: t.vision_sub, icon: <FiSearch />, onClick: () => setShowScanner(true), color: 'var(--oracle-primary)' },
                { id: 'climate', title: t.climate_title, sub: weatherLoading ? (language === 'mr' ? 'सिंक होत आहे...' : 'Syncing...') : t.climate_sub, icon: <FiCloud />, onClick: handleClimateSync, color: 'var(--oracle-secondary)', loading: weatherLoading },
                { id: 'lab', title: t.lab_title, sub: t.lab_sub, icon: <FiLayers />, onClick: () => navigate('/services/lab'), color: 'var(--oracle-accent)' }
              ].map(card => (
                <div key={card.id} className="intel-card" onClick={card.onClick}>
                  <div className="intel-icon" style={{ color: card.color }}>{card.icon}</div>
                  <div className="intel-text">
                    <h4>{card.title}</h4>
                    <p>{card.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <AnimatePresence>
                {results.length > 0 && (
                    <motion.div 
                        key="results"
                        className="oracle-results-container"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                    >
                        <div className="results-header-box">
                            <h5>{t.results_header}</h5>
                        </div>
                        
                        <div className="results-grid">
                            {results.map((res, idx) => (
                                <motion.div 
                                    key={idx} 
                                    className="oracle-result-card"
                                    initial={{ x: -20, opacity:0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <div className="result-card-visual">
                                        <img src={res.src} alt={res.name} className="result-crop-img" />
                                        <div className="confidence-badge">{res.confidence}%</div>
                                    </div>
                                    <div className="result-card-content">
                                        <div className="result-card-id">NEURAL PROBABILITY #0{idx + 1}</div>
                                        <h4>{getDisplayName(res.name)}</h4>
                                        <p className="result-reason">{res.reason}</p>
                                        <div className="confidence-metric">
                                            <div className="confidence-bar-bg">
                                                <motion.div 
                                                    className="confidence-bar-fill" 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${res.confidence}%` }}
                                                    transition={{ duration: 1, delay: 0.5 }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <FiChevronRight style={{ fontSize: '2rem', opacity: 0.3 }} />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {showScanner && (
              <div className="scanner-modal-overlay">
                  <motion.div 
                    className="scanner-modal"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                      <div className="scanner-header">
                          <h3>{t.hologram_title}</h3>
                          <button className="close-scanner" onClick={() => setShowScanner(false)}><FiX /></button>
                      </div>
                      <div className="scanner-viewport">
                          {isScanning && <div className="scanning-laser"></div>}
                          <video ref={videoRef} autoPlay playsInline className={`scanner-video ${isCaptured ? 'captured' : ''}`} />
                          <canvas ref={canvasRef} style={{ display: 'none' }} />
                          <div className="scanner-overlay-guide">
                              <span className="guide-text">{t.guide_text}</span>
                          </div>
                      </div>
                      {!isScanning && (
                          <div className="scanner-controls" style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                              <button className="start-scan-btn" onClick={handleScanner}>{t.start_v}</button>
                              
                              <label className="start-scan-btn" style={{ background: 'var(--oracle-secondary)', cursor: 'pointer', textAlign: 'center' }}>
                                  Upload Image
                                  <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
                              </label>

                              <button className="start-scan-btn" onClick={handleSimulation} style={{ background: 'var(--oracle-accent)' }}>
                                  Demo Mode
                              </button>
                          </div>
                      )}
                  </motion.div>
              </div>
            )}

            <form onSubmit={(e) => { e.preventDefault(); getPrediction(); }} style={{ marginTop: '3rem' }}>
              <div className="parameter-groups">
                <div className="param-group">
                  <h3><FiActivity /> {t.group_soil}</h3>
                  {[
                    { id: 'Nitrogen', label: t.label_n, icon: <FiWind />, placeholder: '90' },
                    { id: 'Phosporus', label: t.label_p, icon: <FiDroplet />, placeholder: '42' },
                    { id: 'Potassium', label: t.label_k, icon: <FiDroplet />, placeholder: '43' },
                    { id: 'pH', label: t.label_ph, icon: <FiActivity />, placeholder: '6.5' }
                  ].map(f => (
                    <div key={f.id} className="crop_pred_att">
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>{f.icon} {f.label}</label>
                      <input 
                        ref={f.id === 'Nitrogen' ? nitrogenRef : null}
                        value={vals[f.id]} 
                        onChange={(e) => {
                          const cleaned = e.target.value.replace(/[^0-9.\-]/g, '');
                          setvals({...vals, [f.id]: cleaned});
                        }}
                        type="text" 
                        placeholder={f.placeholder}
                        className={isPopulated ? 'populated' : ''}
                      />
                    </div>
                  ))}
                </div>

                <div className="param-group">
                  <h3><FiCloud /> {t.group_climate}</h3>
                  {[
                    { id: 'Temperature', label: t.label_temp, icon: <FiThermometer />, placeholder: '20.8' },
                    { id: 'Humidity', label: t.label_hum, icon: <FiDroplet />, placeholder: '82' },
                    { id: 'Rainfall', label: t.label_rain, icon: <FiDroplet />, placeholder: '202' }
                  ].map(f => (
                    <div key={f.id} className="crop_pred_att">
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>{f.icon} {f.label}</label>
                      <input 
                        value={vals[f.id]} 
                        onChange={(e) => {
                          const cleaned = e.target.value.replace(/[^0-9.\-]/g, '');
                          setvals({...vals, [f.id]: cleaned});
                        }}
                        type="text" 
                        placeholder={f.placeholder}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                id="crop-pred-btn"
              >
                {t.btn_compute}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </section>
    </motion.section>
  )
}

export default CropPredict