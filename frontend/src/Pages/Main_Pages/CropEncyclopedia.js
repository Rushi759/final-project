import React, { useState, useEffect, useMemo, useRef, useContext } from 'react'
import { myList } from '../../crop-list'
import { Link, useNavigate } from 'react-router-dom'
import '../../Styles/CropEncyclopedia.css'
import { FiMic, FiCamera, FiWind, FiSun, FiMapPin, FiArrowLeft, FiPlus, FiCheck, FiBarChart2, FiTrendingUp, FiThermometer } from 'react-icons/fi'
import { MainContext } from '../../context/agroguru_context'

const FALLBACK_CROP_IMG =
  'https://images.unsplash.com/photo-1628173456070-07755ba3e3f?q=80&w=800&auto=format&fit=crop';

const handleCropImgError = (e) => {
  e.target.src = FALLBACK_CROP_IMG;
  e.target.onerror = null;
};

const TRANSLATIONS = {
  en: {
    title: "Crop Encyclopedia",
    subtitle: "A panoramic view of our agricultural database",
    hero_p: "Explore detailed growth guides for 125+ diverse crops across 12 specialized categories.",
    return_btn: "Return to Hub",
    search_placeholder: "Search for crops...",
    scan_btn: "SCAN",
    compare_btn: "Compare Analysis",
    all_crops: "All Crops",
    varieties: "Varieties",
    showing: "Showing",
    of: "of",
    crops: "crops",
    learn_more: "Learn More →",
    growth_period: "Growth Period",
    category: "Category",
    expert_tips: "Expert Cultivation Tips",
    got_it: "Got it, Thanks!",
    comparison_report: "Agro-Intelligence Report",
    selected_varieties: "Selected Varieties",
    financial_pulse: "Financial Pulse Horizon",
    production_capacity: "Production Capacity",
    efficiency_score: "Efficiency & Resource Score",
    expert_insights: "Expert Strategic Insights",
    storage_hub: "Storage & Logistics Hub",
    sell_now: "SELL NOW",
    harvest: "HARVEST",
    monitor: "MONITOR",
    categories: {
      grains: "Grains",
      fruits: "Fruits",
      pulses: "Pulses",
      fiber: "Fiber",
      beverages: "Beverages",
      vegetables: "Vegetables",
      spices: "Spices",
      oilseeds: "Oilseeds",
      plantation: "Plantation",
      medicinal: "Medicinal",
      flowers: "Flowers",
      millets: "Millets"
    }
  },
  mr: {
    title: "पीक ज्ञानकोश",
    subtitle: "आमच्या कृषी डेटाबेसचे विहंगम दृश्य",
    hero_p: "१२ विशेष श्रेणींमध्ये १२५+ वैविध्यपूर्ण पिकांसाठी सविस्तर वाढीचे मार्गदर्शक एक्सप्लोर करा.",
    return_btn: "मुख्य केंद्रावर परत जा",
    search_placeholder: "पिके शोधा...",
    scan_btn: "स्कॅन",
    compare_btn: "तुलना विश्लेषण",
    all_crops: "सर्व पिके",
    varieties: "प्रकार",
    showing: "दाखवत आहे",
    of: "पैकी",
    crops: "पिके",
    learn_more: "अधिक वाचा →",
    growth_period: "वाढीचा कालावधी",
    category: "श्रेणी",
    expert_tips: "तज्ज्ञ लागवड टिप्स",
    got_it: "समजले, धन्यवाद!",
    comparison_report: "कृषी-बुद्धिमत्ता अहवाल",
    selected_varieties: "निवडलेले वाण",
    financial_pulse: "आर्थिक नाडी क्षितिज",
    production_capacity: "उत्पादन क्षमता",
    efficiency_score: "कार्यक्षमता आणि संसाधन स्कोअर",
    expert_insights: "तज्ज्ञ धोरणात्मक माहिती",
    storage_hub: "स्टोरेज आणि लॉजिस्टिक्स हब",
    sell_now: "आत्ता विक्री करा",
    harvest: "काढणी",
    monitor: "निरीक्षण करा",
    categories: {
      grains: "धान्य",
      fruits: "फळे",
      pulses: "कडधान्ये",
      fiber: "तंतू पिके",
      beverages: "पेय पिके",
      vegetables: "भाज्या",
      spices: "मसाले",
      oilseeds: "गळीत धान्य",
      plantation: "मळे पिके",
      medicinal: "औषधी वनस्पती",
      flowers: "फुले",
      millets: "तृणधान्ये"
    }
  }
};

const cropCategories = {
  grains: ['Rice', 'Maize', 'Wheat', 'Barley', 'Quinoa', 'Oats', 'Buckwheat', 'Amararanth', 'Sorghum', 'Pearl Millet'],
  fruits: ['Coconut', 'Papaya', 'Orange', 'Apple', 'Muskmelon', 'Watermelon', 'Grapes', 'Mango', 'Banana', 'Pomegranate', 'Guava', 'Jackfruit', 'Dragon Fruit', 'Strawberry', 'Pineapple', 'Cashew', 'Sapota', 'Custard Apple', 'Litchi', 'Pear', 'Plum', 'Peach', 'Apricot', 'Fig', 'Jamun', 'Cherry', 'Avocado', 'Mangosteen', 'Rambutan', 'Durian', 'Passion Fruit', 'Star Fruit (Carambola)', 'Pomelo', 'Wood Apple', 'Persimmon', 'Mulberry', 'Blueberry', 'Raspberry', 'Kiwi'],
  pulses: ['Lentil', 'Blackgram', 'Greengram', 'Moth Beans', 'Pigeon Peas', 'Kidney Beans', 'Chickpea', 'Soybean', 'Green Peas', 'Horse Gram'],
  fiber: ['Jute', 'Cotton'],
  beverages: ['Coffee', 'Tea', 'Cocoa'],
  vegetables: ['Potato', 'Tomato', 'Brinjal', 'Okra', 'Cabbage', 'Cauliflower', 'Carrot', 'Radish', 'Spinach', 'Cucumber', 'Onion', 'Broccoli', 'Beetroot', 'Drumstick', 'Pumpkin', 'Capsicum', 'Sweet Potato', 'Bitter Gourd', 'Bottle Gourd', 'Ridge Gourd', 'Snake Gourd', 'Coriander', 'Fenugreek', 'Lettuce', 'Bok Choy', 'Kale', 'Swiss Chard', 'Brussels Sprouts'],
  spices: ['Turmeric', 'Ginger', 'Garlic', 'Chilli', 'Black Pepper', 'Cardamom', 'Clove', 'Cinnamon', 'Nutmeg', 'Vanilla', 'Cumin', 'Saffron', 'Ajwain', 'Fennel', 'Mint', 'Tamarind'],
  oilseeds: ['Sunflower', 'Soybean', 'Mustard', 'Sesame', 'Castor', 'Groundnut'],
  plantation: ['Coconut', 'Sugarcane', 'Rubber', 'Betel Nut', 'Coffee', 'Tea', 'Tobacco'],
  medicinal: ['Aloe Vera', 'Ashwagandha', 'Moringa', 'Lemon Grass', 'Stevia', 'Neem', 'Tulsi'],
  flowers: ['Rose', 'Marigold', 'Jasmine', 'Lotus', 'Hibiscus', 'Lavender', 'Sunflower'],
  millets: ['Pearl Millet', 'Sorghum', 'Ragi', 'Kodo Millet', 'Foxtail Millet', 'Barnyard Millet']
}

const seasonData = {
  Kharif: [6, 7, 8, 9, 10],
  Rabi: [10, 11, 12, 1, 2, 3],
  Zaid: [3, 4, 5, 6]
};

const getCropCategory = (name) => {
  for (const [category, crops] of Object.entries(cropCategories)) {
    if (crops.includes(name)) return category
  }
  return 'other'
}

const getCategoryIcon = (category) => {
  const icons = {
    grains: '🌾',
    fruits: '🍎',
    pulses: '🫘',
    fiber: '🧵',
    beverages: '☕',
    vegetables: '🥗',
    spices: '🌶️',
    oilseeds: '🌻',
    plantation: '🌳',
    medicinal: '💊',
    flowers: '🌸',
    other: '🌱'
  }
  return icons[category] || '🌱'
}

const getCategoryColor = (category) => {
  const colors = {
    grains: '#f59e0b',
    fruits: '#ef4444',
    pulses: '#8b5cf6',
    fiber: '#06b6d4',
    beverages: '#78716c',
    vegetables: '#10b981',
    spices: '#dc2626',
    oilseeds: '#fbbf24',
    plantation: '#15803d',
    medicinal: '#0891b2',
    flowers: '#db2777',
    other: '#22c55e'
  }
  return colors[category] || '#22c55e'
}

// Optimization: Pre-calculate crop metadata for O(1) lookup
const CROP_METADATA = (() => {
  const metadata = {};
  for (const [category, crops] of Object.entries(cropCategories)) {
    crops.forEach(cropName => {
      metadata[cropName] = {
        category,
        icon: getCategoryIcon(category),
        color: getCategoryColor(category)
      };
    });
  }
  return metadata;
})();

const getCropMeta = (name) => CROP_METADATA[name] || { category: 'other', icon: '🌱', color: '#22c55e' };

// NEW: Smart Intelligence Helpers
const getClimateMatch = (climateStr, currentTemp) => {
  const range = climateStr.match(/(\d+)-(\d+)/);
  if (!range || !currentTemp) return 75; // Fallback
  const min = parseInt(range[1]);
  const max = parseInt(range[2]);

  if (currentTemp >= min && currentTemp <= max) return 100;
  const diff = currentTemp < min ? min - currentTemp : currentTemp - max;
  return Math.max(0, 100 - (diff * 5));
};

const getMarketPulse = (priceCycle) => {
  if (!priceCycle) return { label: 'Analyzing...', type: 'med', icon: '⚖️' };
  const currentMonth = new Date().getMonth();
  const level = priceCycle[currentMonth];
  if (level === 3) return { label: 'PEAK PROFIT', type: 'high', icon: '💎' };
  if (level === 1) return { label: 'HOLD/STORE', type: 'low', icon: '📦' };
  return { label: 'STABLE PRICE', type: 'med', icon: '⚖️' };
};

const getSeasonalStatus = (cropName) => {
  const currentMonth = new Date().getMonth() + 1;
  const categories = {
    monsoon: ['Rice', 'Maize', 'Cotton', 'Jute', 'Groundnut', 'Soybean'],
    winter: ['Wheat', 'Chickpea', 'Lentil', 'Mustard', 'Barley', 'Onion'],
    summer: ['Watermelon', 'Muskmelon', 'Cucumber'],
    yearRound: ['Banana', 'Coconut', 'Papaya', 'Ginger', 'Turmeric']
  };

  if (categories.monsoon.includes(cropName) && currentMonth >= 6 && currentMonth <= 10) return { label: 'In Season', type: 'monsoon', icon: '🌧️' };
  if (categories.winter.includes(cropName) && (currentMonth >= 10 || currentMonth <= 3)) return { label: 'Winter Pro', type: 'winter', icon: '❄️' };
  if (categories.summer.includes(cropName) && currentMonth >= 3 && currentMonth <= 6) return { label: 'Summer Hero', type: 'summer', icon: '☀️' };
  if (categories.yearRound.includes(cropName)) return { label: 'Evergreen', type: 'evergreen', icon: '🌳' };

  return null;
};

// Performance Optimization: Memoize the Crop Card component to prevent re-renders during search typing
const CropCard = React.memo(({ crop, onSelect, onCompare, isSelectedForCompare, currentTemp }) => {
  const { language } = useContext(MainContext);
  const meta = getCropMeta(crop.name);
  const seasonal = getSeasonalStatus(crop.name);
  const pulse = getMarketPulse(crop.compData?.priceCycle);
  const match = getClimateMatch(crop.compData?.climate || "", currentTemp);

  const displayName = language === 'mr' ? crop.mr_name : crop.name;
  const displayPeriod = language === 'mr' ? crop.mr_period : crop.Period;
  const displayDesc = language === 'mr' ? crop.mr_description : crop.description;

  return (
    <div
      className={`crop-card ${isSelectedForCompare ? 'comparing-active' : ''}`}
      onClick={() => onSelect(crop)}
      style={{ '--card-accent': meta.color }}
    >
      <div className="crop-card-img">
        <img
          src={crop.src}
          alt={crop.name}
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1628173456070-07755ba3e3f?q=80&w=800&auto=format&fit=crop';
            e.target.onerror = null;
          }}
        />

        {/* Intelligence Overlays */}
        <div className="card-intel-overlay">
          <div className={`pulse-badge ${pulse.type}`}>
            {pulse.icon} {pulse.label}
          </div>
        </div>

        {/* Comparison Toggle Button */}
        <button
          className={`compare-toggle-btn ${isSelectedForCompare ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onCompare(crop);
          }}
          title={isSelectedForCompare ? "Remove from comparison" : "Add to comparison"}
        >
          {isSelectedForCompare ? <FiCheck /> : <FiPlus />}
        </button>

        <div className="crop-card-badges">
          <span className="crop-category-badge" style={{ backgroundColor: meta.color }}>
            {meta.icon} {meta.category}
          </span>
        </div>
      </div>
      <div className="crop-card-content">
        <h3>{displayName}</h3>
        <span className="crop-period">{displayPeriod}</span>
        <p>{displayDesc.substring(0, 100)}...</p>
        <button className="crop-learn-more">{language === 'mr' ? 'तपशील →' : 'Details →'}</button>
      </div>
    </div>
  );
});

// NEW: Category Filter Pills Component
const CategoryFilters = ({ activeCategory, onCategoryChange }) => {
  const { language } = useContext(MainContext);
  const t = TRANSLATIONS[language || 'en'];

  const categories = [
    { id: 'all', label: t.all_crops, icon: '🌈' },
    ...Object.keys(cropCategories).map(cat => ({
      id: cat,
      label: t.categories[cat],
      icon: getCategoryIcon(cat)
    }))
  ];

  return (
    <div className="category-filter-bar">
      {categories.map((cat) => (
        <button
          key={cat.id}
          className={`filter-pill ${activeCategory === cat.id ? 'active' : ''}`}
          onClick={() => onCategoryChange(cat.id)}
        >
          <span className="pill-icon">{cat.icon}</span>
          <span className="pill-label">{cat.label}</span>
          {activeCategory === cat.id && <span className="pill-active-glow"></span>}
        </button>
      ))}
    </div>
  );
};

// NEW: Google Lens v2 Masterpiece (Professional AI Vision)
const ScannerOverlay = ({ onClose, onDetect }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [flashOn, setFlashOn] = useState(false);

  // ESC Key listener
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleCapture = () => {
    setIsScanning(true);
    // Simulate AI Processing Delay
    setTimeout(() => {
      // Pick a relevant crop from the database (or the first one for demo)
      const randomCrop = myList[Math.floor(Math.random() * myList.length)];
      onDetect(randomCrop);
      setIsScanning(false);
    }, 2000);
  };

  return (
    <div className="scanner-overlay-lens" onClick={onClose}>
      {/* Floating Header */}
      <div className="lens-header-floating" onClick={e => e.stopPropagation()}>
        <div className="lens-title">
          <span className="vision-logo">🔭</span>
          <h3>AI Vision</h3>
        </div>
      </div>

      <div className="lens-main-ui" onClick={e => e.stopPropagation()}>
        <div className="lens-viewfinder-container">
          {/* Smart Viewfinder Frame */}
          <div className="lens-frame">
            <div className="frame-corner tl"></div>
            <div className="frame-corner tr"></div>
            <div className="frame-corner bl"></div>
            <div className="frame-corner br"></div>
          </div>

          {/* Animated Smart POI Dots (Like Google Lens) */}
          <div className="poi-dots-layer">
            <div className="poi-dot dot-1"></div>
            <div className="poi-dot dot-2"></div>
            <div className="poi-dot dot-3"></div>
            <div className="poi-dot dot-4"></div>
          </div>

          <div className="lens-instruction">
            {isScanning ? "Processing with AI Vision..." : "Position crop within frame"}
          </div>
          {isScanning && <div className="scanning-bar-anim"></div>}
        </div>
      </div>

      {/* FOOTER - ALL BUTTONS NOW WORK */}
      <div className="lens-footer-pro" onClick={e => e.stopPropagation()}>
        <button
          className="lens-tool-btn"
          onClick={() => alert('Opening Image Gallery...')}
          title="Open Gallery"
        >
          🖼️
        </button>

        <div className="shutter-group">
          <button 
             className={`shutter-button-pro ${isScanning ? 'is-scanning' : ''}`} 
             onClick={handleCapture} 
             disabled={isScanning}
             title="Capture Crop"
          >
            <div className="shutter-inner"></div>
          </button>
          <span className="shutter-hint">{isScanning ? "RECOGNIZING..." : "TAP TO SCAN"}</span>
        </div>

        <button
          className={`lens-tool-btn ${flashOn ? 'active' : ''}`}
          onClick={() => setFlashOn(!flashOn)}
          title="Toggle Flash"
        >
          {flashOn ? '🔦' : '⚡'}
        </button>
      </div>

      {/* FINAL FAILSAFE CLOSE - Always visible floating button */}
      <button className="lens-exit-fab" onClick={onClose} title="Close Scanner">
        ✕
      </button>
    </div>
  );
}

// NEW: Isolated Search Box to prevent typing lag from re-rendering the whole page
const CropSearchBox = ({ onSearch, onEnter, value, onScanRequest }) => {
  const [localSearch, setLocalSearch] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [placeholder, setPlaceholder] = useState('');
  const inputRef = useRef(null);
  const typewriterTimer = useRef(null);

  // Sync with parent value (important for resets/suggestion chips)
  useEffect(() => {
    if (value !== undefined) {
      setLocalSearch(value);
    }
  }, [value]);

  // Debounce search update to parent
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(localSearch);
    }, 300);
    return () => clearTimeout(handler);
  }, [localSearch, onSearch]);

  // Optimized Typewriter logic with proper cleanup and pause-on-type
  useEffect(() => {
    // If user is typing or box is focused, stop the typewriter to save CPU and remove distraction
    if (localSearch || isFocused) {
      if (typewriterTimer.current) clearTimeout(typewriterTimer.current);
      return;
    }

    const suggestions = [
      "Search Sugarcane...",
      "Try 'Nashik Onion'...",
      "Looking for Spices?",
      "Explore Winter Grains...",
      "Find Organic Fertilizers?",
      "Search 'Basmati Rice'...",
      "Explore Tropical Fruits..."
    ];
    let currentIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    const type = () => {
      const currentText = suggestions[currentIdx];
      let typingSpeed = isDeleting ? 40 : 80;

      if (isDeleting) {
        setPlaceholder(currentText.substring(0, charIdx - 1));
        charIdx--;
      } else {
        setPlaceholder(currentText.substring(0, charIdx + 1));
        charIdx++;
      }

      if (!isDeleting && charIdx === currentText.length) {
        isDeleting = true;
        typingSpeed = 2500;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        currentIdx = (currentIdx + 1) % suggestions.length;
        typingSpeed = 500;
      }

      typewriterTimer.current = setTimeout(type, typingSpeed);
    };

    typewriterTimer.current = setTimeout(type, 1000);
    return () => {
      if (typewriterTimer.current) clearTimeout(typewriterTimer.current);
    };
  }, [localSearch, isFocused]);

  const handleClear = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLocalSearch('');
    onSearch('');
    inputRef.current?.focus();
  };

  return (
    <div className="crop-enc-controls">
      <div
        className={`crop-search-box masterpiece-search-box ${isFocused ? 'focused' : ''}`}
        onClick={() => inputRef.current?.focus()}
      >
        <div className="search-glow"></div>
        <div className="icon-wrapper">
          <span className="search-icon">🔭</span>
          <span className="magic-sparkle">✨</span>
        </div>
        <input
          type="text"
          ref={inputRef}
          placeholder={placeholder}
          value={localSearch}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => setLocalSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onEnter(localSearch)}
          id="crop-search-input"
          autoComplete="off"
        />
        <div className="search-actions">
          {localSearch && (
            <button className="clear-search-masterpiece" onClick={handleClear} title="Clear Search">
              <span className="clear-icon">✕</span>
            </button>
          )}
          <div className="search-divider"></div>
          <button className="ai-scanner-btn" onClick={onScanRequest} title="AI Crop Vision">
            <FiCamera />
            <span className="bn-label">SCAN</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const CategoryPanorama = ({ onCategorySelect, activeCategory }) => {
  const { language } = useContext(MainContext);
  const t = TRANSLATIONS[language || 'en'];

  const categories = Object.keys(cropCategories);

  return (
    <div className="category-panorama-container">
      <div className="pano-header">
        <h2>🌿 {t.title}</h2>
        <p>{t.subtitle}</p>
      </div>
      <div className="category-panorama-grid">
        {categories.map(cat => {
          const count = cropCategories[cat].length;
          const isActive = activeCategory === cat;
          return (
            <div
              key={cat}
              className={`pano-card ${isActive ? 'active' : ''}`}
              onClick={() => onCategorySelect(cat)}
            >
              <div className="pano-icon">{getCategoryIcon(cat)}</div>
              <div className="pano-info">
                <h3>{t.categories[cat]}</h3>
                <span>{count} {t.varieties}</span>
              </div>
              <div className="pano-glow" style={{ background: getCategoryColor(cat) }}></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


const CropEncyclopedia = () => {
  const navigate = useNavigate();
  const { weatherData, language } = useContext(MainContext);
  const t = TRANSLATIONS[language || 'en'];
  const currentTemp = weatherData?.main?.temp;

  const [search, setSearch] = useState('')
  const [selectedCrop, setSelectedCrop] = useState(null)
  const [activeCategory, setActiveCategory] = useState('all')
  const [isScannerOpen, setIsScannerOpen] = useState(false)
  const gridRef = useRef(null);

  const handleCategorySelect = (cat) => {
    setActiveCategory(cat);
    // Smooth scroll to the results grid
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // NEW: Agro-Compare Engine State
  const [compareCrops, setCompareCrops] = useState([])
  const [isComparisonVisible, setIsComparisonVisible] = useState(false)
  const [showCompareBar, setShowCompareBar] = useState(false)

  // NEW: Smart Scroll Visibility Listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowCompareBar(true);
      } else {
        setShowCompareBar(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCompareToggle = (crop) => {
    setCompareCrops(prev => {
      const exists = prev.find(c => c.id === crop.id);
      if (exists) {
        return prev.filter(c => c.id !== crop.id);
      }
      if (prev.length >= 3) {
        alert("You can compare up to 3 crops at once.");
        return prev;
      }
      return [...prev, crop];
    });
  };

  // Performance Optimization: Memoize the 60+ crop filtering
  const filteredCrops = useMemo(() => {
    const searchLower = search.toLowerCase();
    return myList.filter(crop => {
      const meta = getCropMeta(crop.name);

      // Step 1: Category Filter
      if (activeCategory !== 'all') {
        const cropsInCat = cropCategories[activeCategory] || [];
        if (!cropsInCat.includes(crop.name)) return false;
      }

      // Step 2: Search Query Filter
      if (!search) return true;

      return (
        crop.name.toLowerCase().includes(searchLower) ||
        crop.description.toLowerCase().includes(searchLower) ||
        getCropCategory(crop.name).includes(searchLower)
      );
    })
  }, [search, activeCategory]);

  const handleSearchEnter = () => {
    if (filteredCrops.length > 0) {
      setSelectedCrop(filteredCrops[0]);
    }
  };

  const handleScannerDetection = (crop) => {
    setSelectedCrop(crop);
    setIsScannerOpen(false);
  };

  const [isHoveringGrid, setIsHoveringGrid] = useState(false);

  return (
    <section id="crop-encyclopedia" style={{ paddingTop: '80px', display: 'flex', flexDirection: 'column' }}>
      {/* Standardized Return to Hub Button */}
      <div className="back-nav-container">
        <Link to="/services" className="elite-back-btn">
          <FiArrowLeft /> {t.return_btn}
        </Link>
      </div>

      <div className="crop-enc-hero">
        <div className="crop-enc-hero-overlay">
          <h1>🌿 {t.title}</h1>
          <p>{t.hero_p}</p>
        </div>
      </div>

      <CategoryPanorama
        onCategorySelect={handleCategorySelect}
        activeCategory={activeCategory}
      />

      <div className="crop-count" style={{ marginTop: '40px' }}>
        {t.showing} <strong>{filteredCrops.length}</strong> {t.of} {myList.length} {t.crops}
      </div>

      <div
        className="crop-grid"
        style={{ marginBottom: '100px' }}
        onMouseEnter={() => setIsHoveringGrid(true)}
        onMouseLeave={() => setIsHoveringGrid(false)}
      >
        {filteredCrops.map(crop => (
          <CropCard
            key={crop.id}
            crop={crop}
            onSelect={setSelectedCrop}
            onCompare={handleCompareToggle}
            isSelectedForCompare={compareCrops.some(c => c.id === crop.id)}
            currentTemp={currentTemp}
          />
        ))}
      </div>

      {/* NEW: Agro-Compare Bar - Sync to selection across all categories */}
      {compareCrops.length > 0 && (
        <div className={`compare-bar-floating fade-up ${(showCompareBar || isHoveringGrid) ? 'visible' : ''}`}>
          <div className="compare-bar-content">
            <div className="selected-crops-previews">
              {compareCrops.map(crop => (
                <div key={crop.id} className="mini-crop-thumb">
                  <img src={crop.src} alt="" loading="lazy" onError={handleCropImgError} />
                  <button className="mini-remove" onClick={() => handleCompareToggle(crop)}>×</button>
                </div>
              ))}
              {compareCrops.length < 3 && <div className="placeholder-slot">Slot {compareCrops.length + 1}</div>}
            </div>
            <div className="compare-bar-actions">
              <span className="compare-count">{compareCrops.length} / 3 Selected</span>
              <button
                className="compare-btn-main"
                onClick={() => setIsComparisonVisible(true)}
                disabled={compareCrops.length < 2}
              >
                <FiBarChart2 /> Compare Analysis
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW: Comparison Modal Overlay */}
      {isComparisonVisible && (
        <div className="comparison-overlay" onClick={() => setIsComparisonVisible(false)}>
          <div className="comparison-modal-lg" onClick={e => e.stopPropagation()}>
            <div className="comp-header">
              <h2>⚖️ {t.comparison_report}</h2>
              <button className="comp-close" onClick={() => setIsComparisonVisible(false)}>✕</button>
            </div>
            <div className="bento-report-container">
              {/* Brick 1: Selection Overview */}
              <div className="bento-brick brick-overview">
                <div className="brick-header">
                  <div className="header-left">
                    <span className="brick-icon">🌱</span>
                    <h4>{t.selected_varieties}</h4>
                  </div>
                </div>
                <div className="brick-selection-row">
                  {compareCrops.map(c => (
                    <div key={c.id} className="mini-profile-card">
                      <img src={c.src} alt={c.name} loading="lazy" onError={handleCropImgError} />
                      <div className="mini-info">
                        <h3>{c.name}</h3>
                        <span className="mini-cat" style={{ color: getCropMeta(c.name).color }}>
                          {getCropMeta(c.name).icon} {getCropMeta(c.name).category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bento-brick brick-prices aurora-bento-brick half-wide">
                <div className="brick-header">
                  <div className="header-left">
                    <span className="brick-icon">🛰️</span>
                    <h4>{t.financial_pulse}</h4>
                  </div>
                  <div className="intelligence-key">
                    <div className="key-chip peak">
                      <span className="key-icon">💰</span> 
                      <span className="key-text"><strong>{t.sell_now}</strong></span>
                    </div>
                    <div className="key-chip harvest">
                      <span className="key-icon">🚜</span> 
                      <span className="key-text"><strong>{t.harvest}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="bento-horizon-grid">
                  {/* Elite Global Month Header */}
                  <div className="horizon-timeline-header">
                    <div className="sidebar-placeholder"></div>
                    <div className="timeline-months">
                      {['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'].map(m => (
                        <div key={m} className="month-node">
                          <span className="month-text">{m}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="horizon-rows-container">
                    {compareCrops.map(c => {
                      const currentMonthIdx = new Date().getMonth();
                      const marketLevel = c.compData?.priceCycle?.[currentMonthIdx] || 2;
                      let aiStatus = "MONITOR";
                      let statusClass = "status-neutral";

                      if (marketLevel === 3) {
                        aiStatus = "SELL NOW";
                        statusClass = "status-peak";
                      } else if (marketLevel === 1) {
                        aiStatus = "HARVEST";
                        statusClass = "status-harvest";
                      }

                      return (
                        <div key={c.id} className="horizon-row">
                          <div className="horizon-sidebar">
                            <h5 className="horizon-crop-name">{c.name}</h5>
                            <div className={`horizon-status-badge ${statusClass}`}>
                              {aiStatus}
                            </div>
                          </div>
                          
                          <div className="horizon-data-plane">
                            <div className="jewel-grid">
                              {(c.compData?.priceCycle || [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]).map((level, idx) => {
                                let status = 'neutral';
                                if (level === 1) status = 'harvest';
                                if (level === 3) status = 'peak';
                                return (
                                  <div key={idx} className={`jewel-node ${status}`} title={`Month ${idx + 1}: ${status.toUpperCase()}`}>
                                    <div className="jewel-inner">
                                      {status === 'peak' && <span className="jewel-icon">💰</span>}
                                      {status === 'harvest' && <span className="jewel-icon">🚜</span>}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Brick 3: Yield & Potentials */}
              <div className="bento-brick brick-stats aurora-bento-brick">
                <div className="brick-header">
                  <div className="header-left">
                    <span className="brick-icon">📊</span>
                    <h4>{t.production_capacity}</h4>
                  </div>
                </div>
                <div className="stats-comparison-stack">
                  {compareCrops.map(c => (
                    <div key={c.id} className="stat-progress-item">
                      <div className="stat-meta">
                        <span>{c.name}</span>
                        <strong>{c.compData?.yield || 'Variable'}</strong>
                      </div>
                      <div className="stat-progress-bg">
                        <div className="stat-progress-fill" style={{ width: '85%', backgroundColor: getCropMeta(c.name).color }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Brick 4: Professional Specs (Water & Effort) */}
              <div className="bento-brick brick-specs aurora-bento-brick">
                <div className="brick-header">
                  <div className="header-left">
                    <span className="brick-icon">⚖️</span>
                    <h4>{t.efficiency_score}</h4>
                  </div>
                </div>
                <div className="bento-specs-grid">
                  {compareCrops.map(c => {
                    const waterVal = c.compData?.water || 3;
                    const waterMap = {
                      1: "Very Low (Drought Proof)",
                      2: "Low (Rainfed/Dryland)",
                      3: "Moderate (Irrigated)",
                      4: "High (Heavy Irrigation)",
                      5: "Flood (Standing Water)"
                    };
                    
                    return (
                      <div key={c.id} className="spec-item-box">
                        <h5>{c.name}</h5>
                        <div className="spec-points">
                          <div className="point-row">
                            <span className="p-label">💧 Water Need:</span>
                            <span className="p-value"><strong>{waterMap[waterVal]}</strong></span>
                          </div>
                          <div className="point-row">
                            <span className="p-label">⏳ Labor Effort:</span>
                            <span className="p-value"><strong>{c.compData?.effort || 'Med'}</strong></span>
                          </div>
                          <div className="point-row">
                            <span className="p-label">🌞 Best Climate:</span>
                            <span className="p-value"><strong>{c.compData?.soil || 'Tropical'}</strong></span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Brick 5: The "Guru's Secret" (Key Advantage) */}
              <div className="bento-brick brick-insights aurora-bento-brick">
                <div className="brick-header">
                  <div className="header-left">
                    <span className="brick-icon">💎</span>
                    <h4>{t.expert_insights}</h4>
                  </div>
                </div>
                <div className="bento-insight-grid">
                  {compareCrops.map((c, idx) => (
                    <div key={c.id} className="insight-card-modern">
                      <div className="insight-top">
                        <span className="i-index">0{idx + 1}</span>
                        <h5>{c.name} Advantage</h5>
                      </div>
                      <p>{c.compData?.advantage || 'This variety offers consistent performance and high market demand across all tropical regions.'}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Brick 6: NEW - Logistics & Post-Harvest Hub */}
              <div className="bento-brick brick-logistics">
                <div className="brick-header">
                  <div className="header-left">
                    <span className="brick-icon">🚛</span>
                    <h4>{t.storage_hub}</h4>
                  </div>
                </div>
                <div className="bento-logistics-stack">
                  {compareCrops.map(c => {
                    const isFactory = c.compData?.logistics?.includes('Factory');
                    return (
                      <div key={c.id} className={`logistics-item ${isFactory ? 'item-factory' : 'item-farm'}`}>
                        <div className="log-top">
                          <span className="log-name">{c.name}</span>
                          <span className="log-tag">{isFactory ? '🏭 FACTORY-BOUND' : '🏡 FARM-STORAGE'}</span>
                        </div>
                        <p className="log-desc">{c.compData?.logistics || 'General Dry Storage: Ensure ventilated area and protect from moisture for optimal shelf-life.'}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {filteredCrops.length === 0 && (
        <div className="crop-no-results">
          <div className="no-results-content">
            <span className="no-results-icon">🔍</span>
            <h3>No results for "{search}"</h3>
            <p>We couldn't find a matching crop. Try searching for a category instead:</p>
            <div className="suggestion-chips">
              {['Grains', 'Fruits', 'Vegetables', 'Spices'].map(sug => (
                <button
                  key={sug}
                  className="suggestion-chip"
                  onClick={() => setSearch(sug)}
                >
                  {sug}
                </button>
              ))}
            </div>
            <button className="reset-search-btn" onClick={() => setSearch('')}>
              Clear search
            </button>
          </div>
        </div>
      )}

      {/* Crop Detail Modal - Masterpiece Edition */}
      {selectedCrop && (
        <div className="crop-modal-overlay active" onClick={() => setSelectedCrop(null)}>
          <div className="crop-modal-masterpiece" onClick={(e) => e.stopPropagation()}>
            <button
              className="crop-modal-close-masterpiece"
              onClick={() => setSelectedCrop(null)}
              title="Close Details"
            >
              <span>✕</span>
            </button>

            <div className="crop-modal-left">
              <div className="crop-modal-img-container">
                <img src={selectedCrop.src} alt={selectedCrop.name} loading="lazy" onError={handleCropImgError} />
                <div className="img-glass-overlay"></div>
              </div>
            </div>

            <div className="crop-modal-right">
              <div className="crop-modal-header">
                <span className="crop-modal-badge-elite" style={{ backgroundColor: getCropMeta(selectedCrop.name).color }}>
                  {getCropMeta(selectedCrop.name).icon} {getCropMeta(selectedCrop.name).category}
                </span>
                <h2>{language === 'mr' ? selectedCrop.mr_name : selectedCrop.name}</h2>
              </div>

              <div className="crop-modal-info-grid">
                <div className="info-item">
                  <span className="info-label">🕒 {t.growth_period}</span>
                  <span className="info-value">{language === 'mr' ? selectedCrop.mr_period : selectedCrop.Period}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">🌍 {t.category}</span>
                  <span className="info-value" style={{ color: getCropMeta(selectedCrop.name).color }}>
                    {t.categories[getCropMeta(selectedCrop.name).category]?.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="crop-modal-body">
                <p className="crop-modal-desc-elite">{language === 'mr' ? selectedCrop.mr_description : selectedCrop.description}</p>

                <div className="crop-modal-tips-luxury">
                  <div className="tips-header">
                    <span className="tips-icon">💎</span>
                    <h4>{t.expert_tips}</h4>
                  </div>
                  <ul>
                    {(language === 'mr' ? (selectedCrop.mr_tips || []) : (selectedCrop.tips || [])).map((tip, index) => (
                      <li key={index}><span className="bullet">✦</span> {tip}</li>
                    ))}
                    {(!selectedCrop.tips && language !== 'mr') && (
                      <>
                        <li><span className="bullet">✦</span> Ensure proper soil preparation before planting</li>
                        <li><span className="bullet">✦</span> Monitor water requirements during growth phases</li>
                        <li><span className="bullet">✦</span> Use organic fertilizers for better yield quality</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>

              <div className="crop-modal-footer">
                <button className="modal-primary-btn" onClick={() => setSelectedCrop(null)}>
                  {t.got_it}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isScannerOpen && (
        <ScannerOverlay 
          onClose={() => setIsScannerOpen(false)} 
          onDetect={handleScannerDetection}
        />
      )}
    </section>
  )
}

export default CropEncyclopedia
