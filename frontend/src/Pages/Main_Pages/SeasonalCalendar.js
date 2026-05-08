import '../../Styles/SeasonalCalendar.css'
import { MainContext } from '../../context/agroguru_context'
import { useContext, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'

const TRANSLATIONS = {
  en: {
    return_btn: "Return to Hub",
    hero_title: "Seasonal Crop Calendar",
    hero_p: "Plan your farming with India's agricultural seasons — Kharif, Rabi & Zaid",
    cur_season: "Current Season:",
    timeline: "Agricultural Timeline",
    insights: "Seasonal Insights",
    crop_count: "Agricultural Crops",
    planting_tip: "Planting Month",
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    seasons: {
      Kharif: { name: 'Kharif (Monsoon)', desc: 'Crops sown at the beginning of the monsoon season and harvested at the end.' },
      Rabi: { name: 'Rabi (Winter)', desc: 'Crops sown in the winter season and harvested in spring.' },
      Zaid: { name: 'Zaid (Summer)', desc: 'Short-season crops grown between Rabi and Kharif seasons.' },
      Perennial: { name: 'Long-Duration Crops', desc: 'Crops with long growth cycles or multiple harvesting Bahars in Maharashtra.' }
    }
  },
  mr: {
    return_btn: "मुख्य केंद्रावर परत जा",
    hero_title: "हंगामी पीक कॅलेंडर",
    hero_p: "भारताच्या कृषी हंगामांसह आपल्या शेतीचे नियोजन करा — खरीप, रब्बी आणि उन्हाळी.",
    cur_season: "चालू हंगाम:",
    timeline: "कृषी कालक्रम",
    insights: "हंगामी माहिती",
    crop_count: "कृषी पिके",
    planting_tip: "लागवड महिना",
    months: ['जाने', 'फेब्रु', 'मार्च', 'एप्रिल', 'मे', 'जून', 'जूले', 'ऑगस्ट', 'सप्टें', 'ऑक्टो', 'नोव्हें', 'डिसें'],
    seasons: {
      Kharif: { name: 'खरीप (पावसाळा)', desc: 'पावसाळ्याच्या सुरुवातीला पेरली जाणारी आणि शेवटी काढणी केली जाणारी पिके.' },
      Rabi: { name: 'रब्बी (हिवाळा)', desc: 'हिवाळ्यात पेरली जाणारी आणि वसंत ऋतूत काढणी केली जाणारी पिके.' },
      Zaid: { name: 'उन्हाळी (उन्हाळा)', desc: 'रब्बी आणि खरीप हंगामाच्या दरम्यान घेतली जाणारी अल्प-कालावधीची पिके.' },
      Perennial: { name: 'दीर्घ-कालावधीची पिके', desc: 'महाराष्ट्रातील दीर्घ वाढीचे चक्र असलेली किंवा एकापेक्षा जास्त बहर असलेली पिके.' }
    }
  }
}

const seasonData = {
  Kharif: {
    season: 'Kharif (Monsoon)',
    months: 'June - October',
    icon: '🌧️',
    color: '#2563eb',
    description: 'Crops sown at the beginning of the monsoon season and harvested at the end.',
    crops: [
      { name: 'Rice', months: [6, 7, 8, 9, 10], planted: [6], icon: '🌾', tip: 'Requires flooded fields, warm & humid climate' },
      { name: 'Maize', months: [6, 7, 8, 9], planted: [6], icon: '🌽', tip: 'Well-drained soil, 21-27°C temperature' },
      { name: 'Cotton', months: [5, 6, 7, 8, 9, 10, 11, 12], planted: [5, 6], icon: '🧵', tip: 'Black soil preferred, harvesting lasts till Dec' },
      { name: 'Jute', months: [6, 7, 8, 9], planted: [6], icon: '🌿', tip: 'Monsoon favorite, requires hot & humid climate' },
      { name: 'Soybean', months: [6, 7, 8, 9, 10], planted: [6], icon: '🌱', tip: 'Vidarbha favorite, requires nitrogen-rich soil' },
      { name: 'Okra (Bhindi)', months: [6, 7, 8, 9, 10], planted: [6], icon: '🥦', tip: 'Warm climate, well-drained loamy soil' },
      { name: 'Tomato (Kharif)', months: [6, 7, 8, 9, 10], planted: [6], icon: '🍅', tip: 'Sown Jun-Jul, major Desh region crop' },
      { name: 'Green Chillies', months: [6, 7, 8, 9, 10], planted: [6], icon: '🌶️', tip: 'Grown across MH, requires good drainage' },
      { name: 'Bitter Gourd', months: [6, 7, 8, 9, 10], planted: [6], icon: '🥒', tip: 'Karle: High medicinal value summer/monsoon' },
      { name: 'Bottle Gourd', months: [6, 7, 8, 9, 10], planted: [6], icon: '🥒', tip: 'Dudhi: Requires trellis support for best yield' },
      { name: 'Onion (Kharif)', months: [6, 7, 8, 9, 10], planted: [6], icon: '🧅', tip: 'Lasalgaon style, good drainage essential' },
      { name: 'Mungbean (Moong)', months: [6, 7, 8, 9], planted: [6], icon: '🫘', tip: 'Short-duration Kharif pulse, major in MH' },
      { name: 'Urad Bean', months: [6, 7, 8, 9], planted: [6], icon: '🫘', tip: 'High protein, thrives in hot and humid Kharif' },
      { name: 'Sunflower', months: [6, 7, 8, 9], planted: [6], icon: '🌻', tip: 'Oilseed powerhouse, drought resistant' },
      { name: 'Bajra', months: [6, 7, 8, 9], planted: [6], icon: '🌾', tip: 'Drought resistant, sandy or light soils' },
      { name: 'Jowar (Kharif)', months: [6, 7, 8, 9], planted: [6], icon: '🌾', tip: 'Staple for Marathwada, semi-arid specialist' },
      { name: 'Pigeonpeas', months: [6, 7, 8, 9, 10, 11, 12], planted: [6], icon: '🫘', tip: 'Long-duration pulse, harvesting in Dec-Jan' },
      { name: 'Groundnut', months: [6, 7, 8, 9, 10], planted: [6], icon: '🥜', tip: 'Sandy loam soil, 20-30°C temperature' },
    ]
  },
  Rabi: {
    season: 'Rabi (Winter)',
    months: 'October - March',
    icon: '❄️',
    color: '#7c3aed',
    description: 'Crops sown in the winter season and harvested in spring.',
    crops: [
      { name: 'Wheat', months: [11, 12, 1, 2, 3], planted: [11], icon: '🌾', tip: 'Cool growing season, Nov-Mar cycle is ideal' },
      { name: 'Fenugreek (Methi)', months: [11, 12, 1], planted: [11], icon: '🥬', tip: 'Fast-growing leafy green, cool weather' },
      { name: 'Spinach (Palak)', months: [10, 11, 12, 1], planted: [10, 11], icon: '🥗', tip: 'Rich in iron, thrives in MH winter nights' },
      { name: 'Coriander', months: [10, 11, 12, 1], planted: [10, 11], icon: '🌿', tip: 'Kothimbir: Essential Desh region staple' },
      { name: 'Chickpea (Gram)', months: [11, 12, 1, 2, 3], planted: [11], icon: '🫘', tip: 'Major Maharashtra pulse, Nov-Mar window' },
      { name: 'Onion (Rabi)', months: [11, 12, 1, 2, 3], planted: [11], icon: '🧅', tip: 'Maharashtra export quality, Nov-Mar cycle' },
      { name: 'Cabbage (Kobi)', months: [10, 11, 12, 1, 2], planted: [10, 11], icon: '🥬', tip: 'Hardy winter vegetable, high market value' },
      { name: 'Cauliflower', months: [10, 11, 12, 1, 2], planted: [10, 11], icon: '🥦', tip: 'Flower: Requires cool climate for curdling' },
      { name: 'Garlic (Lasun)', months: [10, 11, 12, 1, 2, 3], planted: [10], icon: '🧄', tip: 'Sown in Oct, major cash crop in winter' },
      { name: 'Jowar (Rabi)', months: [10, 11, 12, 1, 2], planted: [10], icon: '🌾', tip: 'Highly valued for fodder and grain quality' },
      { name: 'Mustard', months: [10, 11, 12, 1, 2], planted: [10], icon: '🌼', tip: 'Dry & cool climate, irrigated land' },
      { name: 'Barley', months: [10, 11, 12, 1, 2, 3], planted: [10, 11], icon: '🌾', tip: 'Frost-tolerant, moderate moisture' },
      { name: 'Safflower (Kardai)', months: [10, 11, 12, 1, 2, 3], planted: [10], icon: '🌻', tip: 'Marathwada oilseed, very drought tolerant' },
      { name: 'Potato', months: [10, 11, 12, 1, 2], planted: [10], icon: '🥔', tip: 'Grown in Pune/Nagar belts in winter' },
    ]
  },
  Zaid: {
    season: 'Zaid (Summer)',
    months: 'March - June',
    icon: '☀️',
    color: '#ea580c',
    description: 'Short-season crops grown between Rabi and Kharif seasons.',
    crops: [
      { name: 'Watermelon', months: [3, 4, 5, 6], planted: [3], icon: '🍉', tip: 'Hot weather, sandy loam soil, heavy watering' },
      { name: 'Muskmelon', months: [3, 4, 5, 6], planted: [3], icon: '🍈', tip: 'Warm temperature, well-drained sandy soil' },
      { name: 'Cucumber', months: [3, 4, 5, 6], planted: [3], icon: '🥒', tip: 'Warm temperature, regular irrigation' },
      { name: 'Cowpea (Chavali)', months: [3, 4, 5, 6], planted: [3], icon: '🫘', tip: 'Summer protein source, heat tolerant' },
      { name: 'Bhendi (Summer)', months: [2, 3, 4, 5, 6], planted: [2, 3], icon: '🥦', tip: 'Summer Okra: High demand in local markers' },
      { name: 'Green Chillies', months: [2, 3, 4, 5, 6], planted: [2, 3], icon: '🌶️', tip: 'Summer variant requires frequent watering' },
      { name: 'Fodder Maize', months: [3, 4, 5, 6], planted: [3], icon: '🌽', tip: 'Critical for livestock during summer months' },
      { name: 'Pumpkin', months: [2, 3, 4, 5], planted: [2, 3], icon: '🎃', tip: 'Warm soil, ample sunlight required' },
      { name: 'Bitter Gourd', months: [3, 4, 5, 6], planted: [3], icon: '🥒', tip: '25-30°C, trellis support needed' },
    ]
  },
  Perennial: {
    season: 'Long-Duration Crops',
    months: 'Multi-Season',
    icon: '🌳',
    color: '#16a34a',
    description: 'Crops with long growth cycles or multiple harvesting Bahars in Maharashtra.',
    crops: [
      { name: 'Sugarcane (Adsali)', months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], planted: [7, 8], icon: '🎋', tip: '18-month Adsali cycle. Harvest: Aug-Jan' },
      { name: 'Sugarcane (Suru)', months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], planted: [1, 2], icon: '🎋', tip: 'Standard Suru cycle. Harvest: Dec-April' },
      { name: 'Guava (Peru)', months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], planted: [6, 7], icon: '🍐', tip: 'Planted: June-July. Winter harvest peak. Requires pruning' },
      { name: 'Custard Apple', months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], planted: [6, 7], icon: '🍏', tip: 'Sitaphal: Marathwada specialty in autumn' },
      { name: 'Grapes (Nashik)', months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], planted: [6, 7], icon: '🍇', tip: 'Oct Pruning (Chatni) to March Harvest' },
      { name: 'Pomegranate (Anar)', months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], planted: [1, 2, 6, 7], icon: '🍎', tip: 'Ambe (Jan-Feb) & Mrig (Jun-Jul) Bahars' },
      { name: 'Mango (Alphonso)', months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], planted: [6, 7], icon: '🥭', tip: 'Konkan peak specialty. Fruit: Summer' },
      { name: 'Turmeric', months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], planted: [5, 6], icon: '🟡', tip: 'Sangli specialty. 9-month intensive cycle' },
      { name: 'Banana', months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], planted: [6, 7, 10, 11], icon: '🍌', tip: 'Jalgaon powerhouse. Constant care' },
      { name: 'Orange (Nagpur)', months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], planted: [6, 7, 9, 10], icon: '🍊', tip: 'Mrid Bahar winter fruiting window' },
      { name: 'Chikoo (Sapota)', months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], planted: [6, 7], icon: '🥔', tip: 'Dahanu/Palghar specialty coastal fruit' },
      { name: 'Cashew (Kaju)', months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], planted: [6, 7], icon: '🥜', tip: 'Konkan cash crop. Harvesting in spring' },
      { name: 'Black Pepper', months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], planted: [6, 7], icon: '⚫', tip: 'Konkan spice specialty. Winter harvest' },
      { name: 'Coconut', months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], planted: [6, 7], icon: '🥥', tip: 'Requires constant coastal humidity' },
    ]
  }
}

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const getOrderedMonths = (season) => {
  const baseMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  let startIndex = 0 // Default Jan
  if (season === 'Kharif') startIndex = 5 // June
  if (season === 'Rabi') startIndex = 9 // October
  if (season === 'Zaid') startIndex = 2 // March
  
  const orderedIndices = [...baseMonths.slice(startIndex), ...baseMonths.slice(0, startIndex)]
  return orderedIndices
}

const getCurrentSeasonLabel = (month) => {
  if (month >= 6 && month <= 10) return 'Kharif'
  if (month >= 11 || month <= 3) return 'Rabi'
  return 'Zaid'
}

const SeasonalCalendar = () => {
  const { language } = useContext(MainContext)
  const t = TRANSLATIONS[language || 'en']
  const currentMonth = new Date().getMonth() + 1
  const [activeSeason, setActiveSeason] = useState(getCurrentSeasonLabel(currentMonth))

  const getOrderedMonths = (season) => {
    const baseMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    let startIndex = 0 // Default Jan
    if (season === 'Kharif') startIndex = 5 // June
    if (season === 'Rabi') startIndex = 9 // October
    if (season === 'Zaid') startIndex = 2 // March
    
    const orderedIndices = [...baseMonths.slice(startIndex), ...baseMonths.slice(0, startIndex)]
    return orderedIndices
  }

  const orderedMonthIndices = getOrderedMonths(activeSeason)
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  return (
    <section id="seasonal-calendar" className="fade-in">
      
      <div className="back-nav-container">
         <Link to="/services" className="elite-back-btn">
            <FiArrowLeft /> {t.return_btn}
         </Link>
      </div>

      <div className="sc-hero">
        <div className="sc-hero-overlay">
          <h1>📅 {t.hero_title}</h1>
          <p>{t.hero_p}</p>
          <div className="sc-current-season">
            <span>📍 {t.cur_season}</span>
            <strong>{activeSeason}</strong>
            <span className="sc-current-month">({t.months[currentMonth - 1]} {new Date().getFullYear()})</span>
          </div>
        </div>
      </div>

      <div className="sc-tabs">
        {Object.keys(seasonData).map(season => (
          <button
            key={season}
            className={`sc-tab ${activeSeason === season ? 'active' : ''}`}
            onClick={() => setActiveSeason(season)}
          >
            <span className="sc-tab-icon">{seasonData[season].icon}</span>
            <span>{season}</span>
          </button>
        ))}
      </div>

      <div className="sc-content">
        <div className="sc-season-header">
          <div className="sc-season-info">
            <h2 style={{ color: seasonData[activeSeason].color }}>{seasonData[activeSeason].icon} {t.seasons[activeSeason].name}</h2>
            <span className="sc-months-badge">
              {seasonData[activeSeason].months}
            </span>
          </div>
          <p>{t.seasons[activeSeason].desc}</p>
        </div>

        <div className="sc-calendar-grid">
          <div className="sc-timeline-header">
            <div className="sc-crop-label">{t.timeline}</div>
            <div className="sc-months-row">
              {orderedMonthIndices.map((monthNum) => (
                <div
                  key={monthNum}
                  className={`sc-month-cell ${monthNum === currentMonth ? 'current' : ''}`}
                >
                  {t.months[monthNum - 1]}
                </div>
              ))}
            </div>
          </div>

          <div className="sc-crop-rows">
            {seasonData[activeSeason].crops.map((crop, index) => (
              <div className="sc-crop-row" key={index}>
                <div className="sc-crop-name">
                  <span className="sc-crop-icon">{crop.icon}</span>
                  <div>
                    <strong>{crop.name}</strong>
                    <small>{crop.tip}</small>
                  </div>
                </div>
                <div className="sc-months-row">
                  {orderedMonthIndices.map((monthNum) => (
                    <div
                      key={monthNum}
                      className={`sc-month-cell ${monthNum === currentMonth ? 'current' : ''}`}
                    >
                      {crop.months.includes(monthNum) && (
                        <div className="sc-bar-container">
                           <div 
                             className="sc-bar" 
                             style={{ 
                               backgroundColor: seasonData[activeSeason].color,
                               '--bar-glow': seasonData[activeSeason].color + '40'
                             }}
                            >
                              {crop.planted && crop.planted.includes(monthNum) && (
                                <div className="sc-planting-marker bar-top">
                                  <span title={t.planting_tip}>🌱</span>
                                </div>
                              )}
                            </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="sc-legend">
        <h3>{t.insights}</h3>
        <div className="sc-legend-cards">
          {Object.entries(seasonData).map(([key, season], idx) => (
            <div className="sc-legend-card" key={idx}>
              <span className="sc-legend-icon">{season.icon}</span>
              <span className="sc-legend-months" style={{ color: season.color }}>{season.months}</span>
              <h4>{t.seasons[key].name}</h4>
              <p className="sc-legend-desc">{t.seasons[key].desc}</p>
              <span className="sc-crop-count">{season.crops.length} {t.crop_count}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SeasonalCalendar
