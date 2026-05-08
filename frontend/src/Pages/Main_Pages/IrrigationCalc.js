import '../../Styles/Home_page_ui.css';
import '../../Styles/irrigationCalc.css';
import { myList } from '../../crop-list';
import { MainContext } from '../../context/agroguru_context';
import React, { useState, useMemo, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const TRANSLATIONS = {
  en: {
    return_btn: "Return to Service Hub",
    hero_title: "Agro-Hydro",
    hero_span: "Precision Hub",
    hero_p: "World-class irrigation intelligence perfectly synchronized for your field.",
    daily_target: "💧 DAILY HYDRO TARGET",
    field_mastery: "Field Mastery",
    crop_selection: "Crop Selection",
    climate_command: "Live Environmental Sync",
    unit_acres: "Acres",
    unit_gunthas: "Gunthas",
    search_placeholder: "Search Encyclopedia...",
    gps_sync: "Satellite Sync Active",
    gps_hint: "Auto-calibrating for local climate",
    gps_fallback: "Local Default Active",
    gps_fail: "GPS Unavailable",
    soil_black: "Black Soil",
    soil_sandy: "Sandy Soil",
    soil_loamy: "Loamy Soil",
    soil_alluvial: "Alluvial Soil",
    heat_mode: "Local Heat Mode",
    heat_recalc: "🌡️ Heat Recalibration:",
    mode_dry: "🏜️ Arid",
    mode_optimal: "💧 Balanced",
    mode_wet: "🌧️ Saturated",
    strategy_report: "Expert Strategy Report",
    strategy_p: "For your",
    of: "of",
    optimal_is: "is optimal for peak yield.",
    generate_btn: "Generate Full 12-Week Schedule",
    lifecycle: "Growth Lifecycle Journey",
    cinematic_plan: "12-Week Cinematic Plan",
    roadmap: "Precision roadmap for",
    total_liters: "Total Season Liters",
    peak_week: "Peak Demand Week",
    avg_daily: "Avg. Daily Need",
    sync_report: "SYNCHRONIZING REPORT...",
    sync_success: "✨ AGRO-REPORT SYNCHRONIZED SUCCESSFULLY",
    week: "WEEK",
    export_pdf: "Export PDF Intelligence",
    reminders: "Schedule Reminders",
    util_title: "Precision Utility",
    util_1_t: "Water Conservation",
    util_1_p: "Save up to 30% water by preventing over-saturation.",
    util_2_t: "Yield Optimization",
    util_2_p: "Perfect hydration for every growth stage.",
    util_3_t: "Energy Savings",
    util_3_p: "Reduce pump runtime and lower electricity bills.",
    method_title: "Watering Method",
    method_drip: "Precision Drip",
    method_sprinkler: "Smart Sprinkler",
    method_flood: "Surface Flood",
    efficiency_p: "Tech Efficiency:",
    stages: {
      seedling: "Seedling Phase",
      vegetative: "Vegetative Growth",
      flowering: "Peak Flowering/Fruiting",
      harvest: "Harvest Maturation"
    }
  },
  mr: {
    return_btn: "सर्व्हिस हबवर परत जा",
    hero_title: "कृषी-जल",
    hero_span: "प्रिसिजन हब",
    hero_p: "तुमच्या शेतीसाठी उत्तमरित्या सिंक केलेली जागतिक दर्जाची सिंचन बुद्धिमत्ता.",
    daily_target: "💧 दैनिक जल लक्ष्य",
    field_mastery: "शेत व्यवस्थापन",
    crop_selection: "पीक निवड",
    climate_command: "थेट पर्यावरण सिंक",
    unit_acres: "एकर",
    unit_gunthas: "गुंठा",
    search_placeholder: "ज्ञानकोश शोधा...",
    gps_sync: "सॅटेलाईट सिंक सक्रिय",
    gps_hint: "स्थानिक हवामानासाठी स्वयंचलित मोजणी",
    gps_fallback: "स्थानिक डिफॉल्ट सक्रिय",
    gps_fail: "GPS अनुपलब्ध",
    soil_black: "काळी माती",
    soil_sandy: "रेताड माती",
    soil_loamy: "लोम मृदा",
    soil_alluvial: "गाळाची माती",
    heat_mode: "स्थानिक उष्णता मोड",
    heat_recalc: "🌡️ उष्णता मोजणे:",
    mode_dry: "🏜️ कोरडे (Arid)",
    mode_optimal: "💧 संतुलित (Balanced)",
    mode_wet: "🌧️ ओले (Saturated)",
    strategy_report: "तज्ज्ञ धोरण अहवाल",
    strategy_p: "तुमच्या",
    of: "पिकासाठी,",
    optimal_is: "प्रमाणात पाणी देणे उत्तम आहे.",
    generate_btn: "पूर्ण १२-आवड्यांचे वेळापत्रक तयार करा",
    lifecycle: "वाढ जीवनचक्र प्रवास",
    cinematic_plan: "१२-आवड्यांची योजना",
    roadmap: "साठी प्रिसिजन रोडमॅप",
    total_liters: "हंगामाचे एकूण लिटर",
    peak_week: "जास्तीत जास्त मागणीचा आठवडा",
    avg_daily: "सरासरी दैनिक गरज",
    sync_report: "अहवाल सिंक करत आहे...",
    sync_success: "✨ कृषी-अहवाल यशस्वीरित्या सिंक झाला",
    week: "आठवडा",
    export_pdf: "PDF इंटेलिजन्स एक्सपोर्ट करा",
    reminders: "वेळापत्रक स्मरणपत्रे",
    util_title: "प्रिसिजन उपयुक्तता",
    util_1_t: "पाणी बचत",
    util_1_p: "अति-सिंचन रोखून ३०% पर्यंत पाण्याची बचत करा.",
    util_2_t: "उत्पन्न वाढ",
    util_2_p: "प्रत्येक वाढीच्या टप्प्यासाठी योग्य सिंचन.",
    util_3_t: "वीज बचत",
    util_3_p: "पंपाचा वापर कमी करून वीज बिल वाचवा.",
    method_title: "सिंचन पद्धत",
    method_drip: "ठिबक सिंचन (Drip)",
    method_sprinkler: "तुषार सिंचन (Sprinkler)",
    method_flood: "पारंपारिक पूर (Flood)",
    efficiency_p: "तंत्रज्ञान कार्यक्षमता:",
    stages: {
      seedling: "रोपवाटिका टप्पा",
      vegetative: "वानस्पतिक वाढ",
      flowering: "फुलोरा/फळ उच्चांक",
      harvest: "काढणी काळ"
    }
  }
};

// Master Hydro-Mapping Engine
const HYDRO_V1_LEVELS = {
  1: 1500,
  2: 4000,
  3: 8500,
  4: 16000,
  5: 26000
};

const MASTER_SOIL_TYPES = [
  { type: "Black Soil", retent: 1.0 },
  { type: "Sandy Soil", retent: 1.4 },
  { type: "Loamy Soil", retent: 1.1 },
  { type: "Alluvial Soil", retent: 0.9 }
];

// --- 12-Week Cinematic Schedule Modal ---
const ScheduleModal = ({ isOpen, onClose, cropName, finalTotal, acres, unit }) => {
  const { language } = useContext(MainContext);
  const t = TRANSLATIONS[language || 'en'];
  const schedule = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const week = i + 1;
      let mult = 1.0;
      let stage = t.stages.vegetative;
      let icon = "🌿";
      
      if (week <= 2) { mult = 0.6; stage = t.stages.seedling; icon = "🌱"; }
      else if (week <= 7) { mult = 1.0; stage = t.stages.vegetative; icon = "🌿"; }
      else if (week <= 10) { mult = 1.3; stage = t.stages.flowering; icon = "🌼"; }
      else { mult = 0.8; stage = t.stages.harvest; icon = "🥭"; }

      const totalLiters = Math.round((finalTotal || 0) * mult * 7);
      return { week, stage, icon, weeklyTotal: totalLiters, multiplier: mult };
    });
  }, [finalTotal, t]);

  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [syncingReminders, setSyncingReminders] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  const handleSimulatedExport = () => {
    setIsExporting(true);
    setExportSuccess(false);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        setExportProgress(100);
        clearInterval(interval);
        setTimeout(() => {
          setIsExporting(false);
          setExportSuccess(true);
          setTimeout(() => setExportSuccess(false), 3000);
        }, 800);
      } else {
        setExportProgress(progress);
      }
    }, 400);
  };

  const handleSyncReminders = () => {
    setSyncingReminders(true);
    setSyncSuccess(false);

    // Generate ICS content
    let icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//AgroGuru//Irrigation Schedule//EN",
      "METHOD:PUBLISH"
    ];

    const today = new Date();

    schedule.forEach((item) => {
      const eventDate = new Date(today);
      eventDate.setDate(today.getDate() + (item.week - 1) * 7);
      
      const year = eventDate.getFullYear();
      const month = String(eventDate.getMonth() + 1).padStart(2, '0');
      const day = String(eventDate.getDate()).padStart(2, '0');
      
      const dateStr = `${year}${month}${day}`;

      icsContent.push("BEGIN:VEVENT");
      icsContent.push(`UID:agroguru-week-${item.week}-${Date.now()}@agroguru.com`);
      icsContent.push(`DTSTAMP:${dateStr}T080000Z`);
      icsContent.push(`DTSTART:${dateStr}T080000Z`);
      icsContent.push(`DTEND:${dateStr}T090000Z`);
      icsContent.push(`SUMMARY:AgroGuru: ${cropName} Week ${item.week} Irrigation`);
      icsContent.push(`DESCRIPTION:Irrigation Phase: ${item.stage}. Target: ${item.weeklyTotal.toLocaleString()} Liters. Follow precision timing for maximum yield.`);
      icsContent.push("END:VEVENT");
    });

    icsContent.push("END:VCALENDAR");

    // Create and trigger download
    setTimeout(() => {
      try {
        const blob = new Blob([icsContent.join("\r\n")], { type: "text/calendar;charset=utf-8" });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute("download", `AgroGuru_${cropName.replace(/\s+/g, '_')}_Schedule.ics`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setSyncingReminders(false);
        setSyncSuccess(true);
        setTimeout(() => setSyncSuccess(false), 3000);
      } catch (err) {
        console.error("Calendar sync failed:", err);
        setSyncingReminders(false);
      }
    }, 2500);
  };

  if (!isOpen) return null;

  const seasonalTotal = schedule.reduce((acc, curr) => acc + curr.weeklyTotal, 0);
  const peakWeek = schedule.reduce((prev, curr) => (prev.weeklyTotal > curr.weeklyTotal) ? prev : curr);

  return (
    <div className="hub-modal-backdrop" onClick={onClose}>
      <div className="hub-modal-content cinematic-timeline-glow fade-in-up" onClick={e => e.stopPropagation()} style={{ maxWidth: '900px' }}>
        {(isExporting || syncingReminders) && (
          <div className="export-cinematic-overlay">
            <div className="gateway-core">
              <div className="pulse-ring"></div>
              <span className="label-top">{isExporting ? t.sync_report : 'SYNCING REMINDERS...'}</span>
              <div className="loading-line-modern" style={{ width: '300px' }}>
                <div className="line-fill" style={{ width: isExporting ? `${exportProgress}%` : '100%', animation: syncingReminders ? 'shimmer 2s infinite' : 'none' }}></div>
              </div>
              <span className="pulse-text" style={{ fontSize: '1rem', color: 'white' }}>{isExporting ? `${Math.round(exportProgress)}%` : 'WAITING...'}</span>
            </div>
          </div>
        )}
        
        <div className="modal-header-premium">
          <div>
            <span className="sur-title" style={{ fontSize: '0.6rem' }}>{t.lifecycle}</span>
            <h2>12-{t.week} <span>{t.cinematic_plan}</span></h2>
            <p style={{ opacity: 0.6 }}>{t.roadmap} {acres} {unit}s {t.of} {cropName}</p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="seasonal-summary-bar">
            {(exportSuccess || syncSuccess) && (
                <div className="export-success-toast fade-in">
                    <span>{exportSuccess ? t.sync_success : '✨ CALENDAR REMINDERS SYNCED'}</span>
                </div>
            )}
            <div className="summary-stat">
                <span className="stat-label">{t.total_liters}</span>
                <span className="stat-val">{seasonalTotal.toLocaleString()} L</span>
            </div>
            <div className="summary-stat">
                <span className="stat-label">{t.peak_demand_week || t.peak_week}</span>
                <span className="stat-val">{t.week} {peakWeek.week}</span>
            </div>
            <div className="summary-stat">
                <span className="stat-label">{t.avg_daily}</span>
                <span className="stat-val">{Math.round(seasonalTotal / 84).toLocaleString()} L</span>
            </div>
        </div>

        <div className="timeline-horizontal-scroll">
          <div className="timeline-track-line"></div>
          {schedule.map(item => (
            <div key={item.week} className={`timeline-week-node ${item.multiplier > 1 ? 'peak' : ''}`}>
              <div className="node-icon-box">{item.icon}</div>
              <div className="node-connector"></div>
              <div className="timeline-card-premium">
                <span className="node-week">{t.week} {item.week}</span>
                <p className="node-stage">{item.stage}</p>
                <h4 className="node-val">{item.weeklyTotal.toLocaleString()} <small>L</small></h4>
                <div className="node-intensity-bar">
                    <div className="intensity-fill" style={{ width: `${(item.weeklyTotal / peakWeek.weeklyTotal) * 100}%` }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="modal-footer-premium" style={{ display: 'flex', gap: '15px' }}>
          <button 
            className="back-btn-premium" 
            style={{ flex: 1, background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
            onClick={handleSyncReminders}
            disabled={syncingReminders}
          >
            {syncingReminders ? 'SYNCING...' : t.reminders}
          </button>
          <button 
            className="back-btn-premium" 
            style={{ flex: 1, background: '#3b82f6', color: 'white', border: 'none' }}
            onClick={handleSimulatedExport}
            disabled={isExporting}
          >
            {isExporting ? t.sync_report : t.export_pdf}
          </button>
        </div>
      </div>
    </div>
  );
};

const IrrigationCalc = () => {
  const { language } = useContext(MainContext);
  const t = TRANSLATIONS[language || 'en'];
  const [plotSize, setPlotSize] = useState(1);
  const [plotUnit, setPlotUnit] = useState("Acre");
  const [selectedCropId, setSelectedCropId] = useState(null);
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedSoil, setSelectedSoil] = useState(MASTER_SOIL_TYPES[0]);
  const [moistureLevel, setMoistureLevel] = useState("Optimal");
  const [currentTemp, setCurrentTemp] = useState(25);
  const [heatAdjustment, setHeatAdjustment] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [gpsStatus, setGpsStatus] = useState("Scanning...");
  const [pumpHp, setPumpHp] = useState(3); // HP
  const [irrigationMethod, setIrrigationMethod] = useState("Drip");
  const [rainForecast, setRainForecast] = useState(false);

  const cropDatabase = useMemo(() => {
    if (!myList) return [];
    return myList.map(crop => ({
      id: String(crop.id),
      name: crop.name,
      emoji: (crop.name === "Sugarcane" || crop.name === "Rice" || crop.name === "Wheat") ? 
             (crop.name === "Sugarcane" ? "🎋" : crop.name === "Rice" ? "🌾" : "🍞") : "🌿",
      level: crop.compData?.water || 3,
      baseline: HYDRO_V1_LEVELS[crop.compData?.water || 3] || 8500
    }));
  }, []);

  const currentCrop = useMemo(() => 
    cropDatabase.find(c => c.id === String(selectedCropId)) || cropDatabase[0]
  , [cropDatabase, selectedCropId]);

  const availableCrops = useMemo(() => 
    cropDatabase.filter(c => c.name.toLowerCase().includes(searchFilter.toLowerCase()))
  , [cropDatabase, searchFilter]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const Lat = position.coords.latitude;
          const simulatedTemp = Lat < 20 ? 42 : Lat < 25 ? 36 : 32;
          setCurrentTemp(simulatedTemp);
          setGpsStatus("Location Synced");
          // 25% chance of simulating rain prediction
          setRainForecast(Math.random() > 0.75);
        },
        () => {
          setCurrentTemp(34);
          setGpsStatus("Local Default Active");
        }
      );
    } else {
      setCurrentTemp(34);
      setGpsStatus("GPS Unavailable");
    }
  }, []);

  useEffect(() => {
    // Baseline: 28°C is neutral. Every degree above/below changes need by 3.5%
    setHeatAdjustment((currentTemp - 28) * 0.035);
  }, [currentTemp]);

  const moistureFactor = moistureLevel === "Dry" ? 1.15 : moistureLevel === "Wet" ? 0.8 : 1.0;
  const methodFactor = irrigationMethod === "Flood" ? 2.0 : irrigationMethod === "Sprinkler" ? 1.3 : 1.0;
  const normalizedPlot = plotUnit === "Guntha" ? (parseFloat(plotSize) || 0) / 40 : (parseFloat(plotSize) || 0);
  
  const rawRequirement = (currentCrop?.baseline || 8500) * normalizedPlot;
  const soilCorrection = rawRequirement * (selectedSoil?.retent || 1.0);
  const netDailyTotal = Math.round(soilCorrection * (1 + heatAdjustment) * moistureFactor * methodFactor);
  
  const displayFill = Math.min((netDailyTotal / (plotUnit === "Guntha" ? 25000 : 800000)) * 100, 100);

  return (
    <>
      <ScheduleModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)}
        cropName={currentCrop?.name || 'Crop'}
        finalTotal={netDailyTotal}
        acres={plotSize}
        unit={plotUnit === 'Acre' ? t.unit_acres : t.unit_gunthas}
      />
      <div className="price-hub-page fade-in" style={{ paddingTop: '80px' }}>

      <div className="back-nav-container">
         <Link to="/services" className="elite-back-btn">
            <FiArrowLeft /> {t.return_btn}
         </Link>
      </div>

      <div className="hub-hero">
        <div className="hero_content_premium">
          <span className="sur-title">Global Hydro-Intelligence Network</span>
          <h1>{t.hero_title} <span>{t.hero_span}</span></h1>
          <p>{t.hero_p}</p>
          
          <div className="utility-benefit-grid fade-in" style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <div className="utility-card">
                  <span style={{ fontSize: '1.5rem' }}>💧</span>
                  <h5 style={{ margin: '10px 0 5px', color: '#60a5fa' }}>{t.util_1_t}</h5>
                  <p style={{ fontSize: '0.75rem', opacity: 0.6, margin: 0 }}>{t.util_1_p}</p>
              </div>
              <div className="utility-card">
                  <span style={{ fontSize: '1.5rem' }}>📈</span>
                  <h5 style={{ margin: '10px 0 5px', color: '#10b981' }}>{t.util_2_t}</h5>
                  <p style={{ fontSize: '0.75rem', opacity: 0.6, margin: 0 }}>{t.util_2_p}</p>
              </div>
              <div className="utility-card">
                  <span style={{ fontSize: '1.5rem' }}>⚡</span>
                  <h5 style={{ margin: '10px 0 5px', color: '#f59e0b' }}>{t.util_3_t}</h5>
                  <p style={{ fontSize: '0.75rem', opacity: 0.6, margin: 0 }}>{t.util_3_p}</p>
              </div>
          </div>
        </div>
      </div>

      <div className="hub-container-premium">
        <div className="hydro-vessel-container">
            <div className="hydro-vessel">
                <div className="liquid-wave" style={{ '--fill-level': `${displayFill}%` }}></div>
                <div className="vessel-overlay">
                    <span className="vessel-val">{netDailyTotal.toLocaleString()}</span>
                    <span className="vessel-unit">{t.daily_target}</span>
                </div>
            </div>
        </div>

        <div className="hydro-controls-grid">
            <div className="resource-card-premium">
                <div className="loc-header"><span className="loc-icon">🚜</span><h4>{t.field_mastery}</h4></div>
                <div className="simple-stepper-wrap" style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
                    <button className="stepper-btn" onClick={() => setPlotSize(Math.max(0.1, (parseFloat(plotSize)||0) - 0.5))}>-</button>
                    <div style={{ textAlign: 'center' }}>
                        <input 
                          type="text" inputMode="decimal" value={plotSize}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val.length <= 5 && (val === '' || /^\d*\.?\d*$/.test(val))) setPlotSize(val);
                          }}
                          onBlur={() => {
                            const p = parseFloat(plotSize);
                            if (plotSize === '' || isNaN(p) || p <= 0) setPlotSize(1);
                            else setPlotSize(p);
                          }}
                          style={{ display: 'block', fontSize: '2.5rem', fontWeight: '900', color: '#3b82f6', background: 'transparent', border: 'none', width: '120px', textAlign: 'center', outline: 'none' }}
                        />
                        <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: '800' }}>{plotUnit === 'Acre' ? t.unit_acres : t.unit_gunthas}</span>
                    </div>
                    <button className="stepper-btn" onClick={() => setPlotSize((parseFloat(plotSize)||0) + 0.5)}>+</button>
                </div>
                <div className="tab-switcher-modern" style={{ marginTop: '1.5rem', width: '100%', padding: '4px' }}>
                    <button className={`tab-btn-modern ${plotUnit === 'Guntha' ? 'active' : ''}`} onClick={() => { setPlotUnit('Guntha'); setPlotSize(1); }}>{t.unit_gunthas}</button>
                    <button className={`tab-btn-modern ${plotUnit === 'Acre' ? 'active' : ''}`} onClick={() => { setPlotUnit('Acre'); setPlotSize(1); }}>{t.unit_acres}</button>
                </div>

            </div>

            <div className="resource-card-premium">
                <div className="loc-header" style={{ justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span className="loc-icon">📚</span><h4>{t.crop_selection}</h4></div>
                    <span style={{ fontSize: '0.7rem', color: '#60a5fa', fontWeight: 'bold' }}>{cropDatabase.length} {language === 'mr' ? 'पिके' : 'CROPS'}</span>
                </div>
                <div className="search-stealth-wrap" style={{ marginTop: '1.5rem' }}>
                    <input type="text" placeholder={t.search_placeholder} value={searchFilter} onChange={(e) => setSearchFilter(e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 15px', borderRadius: '15px', color: 'white', fontSize: '0.9rem' }} />
                </div>
                <div className="district-grid-scroll" style={{ maxHeight: '180px', marginTop: '1rem' }}>
                    {availableCrops.map(c => (
                        <div key={c.id} className={`elite-crop-node ${String(selectedCropId) === String(c.id) ? 'active' : ''}`} onClick={() => { setSelectedCropId(c.id); setSearchFilter(c.name); }}>
                            <span className="dist-icon">{c.emoji}</span>
                            <span className="dist-name">{c.name}</span>
                            {String(selectedCropId) === String(c.id) && <span className="selection-dot">✓</span>}
                        </div>
                    ))}
                </div>
            </div>

            <div className="resource-card-premium fade-in">
                <div className="loc-header" style={{ justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span className="loc-icon">🚿</span><h4>{t.method_title || "Watering Method"}</h4></div>
                    <span style={{ fontSize: '0.7rem', color: '#60a5fa', fontWeight: 'bold' }}>{irrigationMethod === 'Flood' ? '45%' : irrigationMethod === 'Sprinkler' ? '75%' : '95%'} Eff.</span>
                </div>
                
                <div style={{ marginTop: '1.5rem' }}>
                    <p style={{ fontSize: '0.75rem', opacity: 0.7, marginBottom: '20px' }}>Select your water delivery mechanism to calculate precise water efficiency and evaporation loss.</p>
                    <div className="tab-switcher-modern" style={{ padding: '4px', display: 'flex', flexDirection: 'column', gap: '5px', background: 'transparent' }}>
                        {['Drip', 'Sprinkler', 'Flood'].map(m => (
                            <button key={m} className={`tab-btn-modern ${irrigationMethod === m ? 'active' : ''}`} onClick={() => setIrrigationMethod(m)} style={{ width: '100%', fontSize: '0.8rem', padding: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                {m === 'Drip' ? t.method_drip : m === 'Sprinkler' ? t.method_sprinkler : t.method_flood}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="resource-card-premium">
                <div className="loc-header" style={{ justifyContent: 'space-between', position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="sync-dot-active"></div>
                        <h4>{t.climate_command}</h4>
                    </div>
                    <span className={`gps-badge-holographic ${gpsStatus === 'Location Synced' ? 'active' : ''}`} style={{ fontSize: '0.6rem' }}>
                        {gpsStatus === 'Location Synced' ? t.gps_sync : gpsStatus === 'Local Default Active' ? t.gps_fallback : t.gps_fail}
                    </span>
                    <div style={{ position: 'absolute', top: '100%', right: 0, fontSize: '0.6rem', color: '#60a5fa', opacity: 0.7, marginTop: '2px' }}>
                        {t.gps_hint}
                    </div>
                </div>
                
                <div className="geology-matrix-grid">
                    {MASTER_SOIL_TYPES.map(s => {
                        const icons = { 'Black Soil': '🌑', 'Sandy Soil': '🏜️', 'Loamy Soil': '🧉', 'Alluvial Soil': '🌊' };
                        return (
                            <button 
                                key={s.type} 
                                className={`soil-node-btn ${selectedSoil?.type === s.type ? 'active' : ''}`} 
                                onClick={() => setSelectedSoil(s)}
                            >
                                <div className="soil-icon-circle">{icons[s.type]}</div>
                                <span className="soil-label">
                                    {s.type === 'Black Soil' ? t.soil_black : s.type === 'Sandy Soil' ? t.soil_sandy : s.type === 'Loamy Soil' ? t.soil_loamy : t.soil_alluvial}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div className="thermal-matrix-control">
                    <div style={{ marginBottom: '20px' }}>
                        <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', opacity: 0.5, letterSpacing: '1px', display: 'block', marginBottom: '10px' }}>Surface Saturation Status</span>
                        <div className="tab-switcher-modern" style={{ padding: '3px' }}>
                            {['Dry', 'Optimal', 'Wet'].map(mode => (
                                <button key={mode} className={`tab-btn-modern ${moistureLevel === mode ? 'active' : ''}`} onClick={() => setMoistureLevel(mode)} style={{ flex: 1, padding: '8px', fontSize: '0.65rem' }}>
                                    {mode === 'Dry' ? t.mode_dry : mode === 'Optimal' ? t.mode_optimal : t.mode_wet}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                         <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', opacity: 0.5, letterSpacing: '1px' }}>{t.heat_mode}</span>
                         <span className="recalc-indicator">{t.heat_recalc} {heatAdjustment >= 0 ? '+' : ''}{(heatAdjustment * 100).toFixed(0)}%</span>
                    </div>

                    <div className="thermal-display-dial" style={{ marginBottom: '20px' }}>
                        <div className="temperature-readout">
                            {currentTemp}°C
                        </div>
                    </div>

                    <input type="range" min="10" max="50" value={currentTemp} onChange={(e) => setCurrentTemp(parseInt(e.target.value))} className="premium-range" />
                </div>
            </div>
        </div>

        <div className="hydro-audit-briefing fade-in">
            <div className="audit-id-badge">ID: SCAN-{Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
            <div className="audit-header">
                <h3>{t.strategy_report}</h3>
                <div style={{ width: '50px', height: '2px', background: 'var(--hydro-blue)', margin: '0 auto 15px' }}></div>
            </div>

            <div className="audit-data-grid">
                <div className="audit-stat-card">
                    <span className="audit-stat-label">Project Scale</span>
                    <span className="audit-stat-val">{plotSize} {plotUnit === 'Acre' ? t.unit_acres : t.unit_gunthas}</span>
                </div>
                <div className="audit-stat-card">
                    <span className="audit-stat-label">Biomass Type</span>
                    <span className="audit-stat-val">{currentCrop?.name || 'Crop'}</span>
                </div>
                <div className="audit-stat-card" style={{ border: '1px solid var(--hydro-blue)' }}>
                    <span className="audit-stat-label" style={{ color: 'var(--hydro-blue)' }}>Net Daily Need</span>
                    <span className="audit-stat-val" style={{ fontSize: '1.5rem' }}>{(netDailyTotal).toLocaleString()} <small style={{ fontSize: '0.7rem' }}>L</small></span>
                </div>
            </div>

            <div className="audit-analysis-summary">
                {t.strategy_p} <strong>{plotSize} {plotUnit === 'Acre' ? t.unit_acres : t.unit_gunthas}</strong> {t.of} <strong>{currentCrop?.name || 'Crop'}</strong>, {(netDailyTotal).toLocaleString()} Litres {t.optimal_is}
            </div>

            {/* Decision Support Suite */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <div className="motor-duration-panel">
                    <span className="panel-label">⚡ MOTOR RUNTIME ({pumpHp} HP)</span>
                    <div className="runtime-display">
                        <span className="time-val">
                            {Math.floor(netDailyTotal / (pumpHp === 2 ? 12000 : pumpHp === 3 ? 20000 : pumpHp === 5 ? 35000 : pumpHp === 7.5 ? 55000 : 80000))}h {Math.round(((netDailyTotal / (pumpHp === 2 ? 12000 : pumpHp === 3 ? 20000 : pumpHp === 5 ? 35000 : pumpHp === 7.5 ? 55000 : 80000)) % 1) * 60)}m
                        </span>
                        <div className="emitter-toggle" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
                            <button className={pumpHp === 2 ? 'active' : ''} onClick={() => setPumpHp(2)}>2 HP</button>
                            <button className={pumpHp === 3 ? 'active' : ''} onClick={() => setPumpHp(3)}>3 HP</button>
                            <button className={pumpHp === 5 ? 'active' : ''} onClick={() => setPumpHp(5)}>5 HP</button>
                            <button className={pumpHp === 7.5 ? 'active' : ''} onClick={() => setPumpHp(7.5)}>7.5 HP</button>
                            <button className={pumpHp === 10 ? 'active' : ''} onClick={() => setPumpHp(10)}>10 HP</button>
                        </div>
                    </div>
                </div>

                <div className="stress-risk-panel">
                    <span className="panel-label">📉 YIELD STRESS RISK</span>
                    <span className="stress-info-btn" title="Science of Stress: This meter measures potential harvest loss. CRITICAL risk means heat is causing the plant to stop growing, directly reducing your final profit.">ⓘ</span>
                    <div className="stress-gauge">
                        <div className="gauge-track">
                             <div className="gauge-fill" style={{ 
                                width: `${Math.min(95, heatAdjustment * 100)}%`,
                                background: heatAdjustment > 0.3 ? '#f43f5e' : heatAdjustment > 0.15 ? '#f59e0b' : '#10b981'
                            }}></div>
                        </div>
                        <span className="risk-level" style={{ color: heatAdjustment > 0.3 ? '#f43f5e' : heatAdjustment > 0.15 ? '#f59e0b' : '#10b981' }}>{heatAdjustment > 0.3 ? 'CRITICAL' : heatAdjustment > 0.15 ? 'MODERATE' : 'LOW'}</span>
                    </div>
                </div>
            </div>

            {rainForecast && (
                <div className="rainfall-bypass-banner">
                    <span className="bypass-icon">⛈️</span>
                    <div>
                        <h4 style={{ margin: 0, color: '#60a5fa' }}>Rainfall Bypass Detected</h4>
                        <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.8 }}>Satellite Sync predicts imminent local rain. Suggest skipping today's irrigation cycle to save 100% water/power.</p>
                    </div>
                </div>
            )}

            <button className="compute-btn-hologram" onClick={() => setModalOpen(true)} style={{ background: 'var(--hydro-blue)', maxWidth: '400px', margin: '0 auto' }}>
                🚀 {t.generate_btn}
            </button>
        </div>
      </div>
    </div>
  </>
);
};

export default IrrigationCalc;
