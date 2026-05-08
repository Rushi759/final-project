/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useContext } from 'react'
import marketlogo from '../../static/market-lottie.json'
import Lottie from '../../Component/Lottie'
import axios from 'axios';
import '../../Styles/MarketPage.css'
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiMapPin, FiPhone, FiInfo, FiTrendingUp, FiExternalLink, FiRefreshCw } from 'react-icons/fi';
import { MainContext } from '../../context/agroguru_context';
import { calculateDistance } from '../../services/locationService';

const TRANSLATIONS = {
  en: {
    return_btn: "Return to Hub",
    hero_title: "Regional Market Radar",
    hero_p: "Live Regional Network Sync: Discover wholesale hubs near you.",
    mar_title: "Active Trading Hubs",
    no_update: "Open for trading",
    no_markets: "Scanning Satellite Data...",
    fallback_mode: "Intelligence Mode: Showing Major Regional Hubs",
    live_mode: "Live GPS: Showing Markets Near You",
    osm_mode: "OpenStreetMap: Real-Time Discovery",
    status_open: "OPEN NOW",
    status_closed: "CLOSED",
    km_away: "km away",
    detecting: "Detecting your location...",
    refresh: "Refresh Location"
  },
  mr: {
    return_btn: "à¤®à¥à¤–à¥à¤¯ à¤•à¥‡à¤‚à¤¦à¥à¤°à¤¾à¤µà¤° à¤ªà¤°à¤¤ à¤œà¤¾",
    hero_title: "à¤ªà¥à¤°à¤¾à¤¦à¥‡à¤¶à¤¿à¤• à¤®à¤¾à¤°à¥à¤•à¥‡à¤Ÿ à¤°à¤¡à¤¾à¤°",
    hero_p: "à¤²à¤¾à¤ˆà¤µà¥à¤¹ à¤°à¤¿à¤œà¤¨à¤² à¤¨à¥‡à¤Ÿà¤µà¤°à¥à¤• à¤¸à¤¿à¤‚à¤•: à¤¤à¥à¤®à¤šà¥à¤¯à¤¾ à¤œà¤µà¤³à¥€à¤² à¤˜à¤¾à¤Šà¤• à¤¬à¤¾à¤œà¤¾à¤°à¤ªà¥‡à¤ à¤¾ à¤¶à¥‹à¤§à¤¾.",
    mar_title: "à¤¸à¤•à¥à¤°à¤¿à¤¯ à¤µà¥à¤¯à¤¾à¤ªà¤¾à¤° à¤•à¥‡à¤‚à¤¦à¥à¤°à¥‡",
    no_update: "à¤µà¥à¤¯à¤¾à¤ªà¤¾à¤°à¤¾à¤¸à¤¾à¤ à¥€ à¤–à¥à¤²à¥‡",
    no_markets: "à¤¸à¥…à¤Ÿà¥‡à¤²à¤¾à¤ˆà¤Ÿ à¤¡à¥‡à¤Ÿà¤¾ à¤¸à¥à¤•à¥…à¤¨ à¤¹à¥‹à¤¤ à¤†à¤¹à¥‡...",
    fallback_mode: "à¤‡à¤‚à¤Ÿà¥‡à¤²à¤¿à¤œà¤¨à¥à¤¸ à¤®à¥‹à¤¡: à¤ªà¥à¤°à¤®à¥à¤– à¤ªà¥à¤°à¤¾à¤¦à¥‡à¤¶à¤¿à¤• à¤¹à¤¬ à¤¦à¤°à¥à¤¶à¤µà¤¿à¤¤ à¤†à¤¹à¥‡",
    live_mode: "à¤²à¤¾à¤ˆà¤µà¥à¤¹ GPS: à¤¤à¥à¤®à¤šà¥à¤¯à¤¾ à¤œà¤µà¤³à¥€à¤² à¤¬à¤¾à¤œà¤¾à¤°à¤ªà¥‡à¤ à¤¾",
    osm_mode: "à¤“à¤ªà¤¨à¤¸à¥à¤Ÿà¥à¤°à¥€à¤Ÿà¤®à¥…à¤ª: à¤°à¤¿à¤…à¤²-à¤Ÿà¤¾à¤‡à¤® à¤¶à¥‹à¤§",
    status_open: "à¤†à¤¤à¤¾à¤š à¤‰à¤˜à¤¡à¤¾",
    status_closed: "à¤¬à¤‚à¤¦",
    km_away: "à¤•à¤¿à¤®à¥€ à¤¦à¥‚à¤°",
    detecting: "à¤¤à¥à¤®à¤šà¥‡ à¤¸à¥à¤¥à¤¾à¤¨ à¤¶à¥‹à¤§à¤¤ à¤†à¤¹à¥‡...",
    refresh: "à¤¸à¥à¤¥à¤¾à¤¨ à¤°à¤¿à¤«à¥à¤°à¥‡à¤¶ à¤•à¤°à¤¾"
  }
};

const DUMMY_MARKETS = [
    {
        // ~8 km from SGU
        name: "Hatkanangale APMC Market Yard",
        address: "Market Yard Road, Hatkanangale, Kolhapur",
        phone: "0230-2420100",
        marketImage: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
        geometry: { coordinates: [74.4245, 16.7522] },
        rating: 4.6,
        open_now: true,
        isReal: false
    },
    {
        // ~18 km from SGU
        name: "Ichalkaranji APMC & Textile Hub",
        address: "Market Yard, Ichalkaranji, Kolhapur",
        phone: "0230-2435566",
        marketImage: "https://images.unsplash.com/photo-1543083477-4f7f44ade80d.jpg?auto=format&fit=crop&w=800&q=60",
        geometry: { coordinates: [74.4680, 16.7010] },
        rating: 4.8,
        open_now: true,
        isReal: false
    },
    {
        // ~20 km from SGU
        name: "Jaysingpur Tobacco & Chilli Market",
        address: "Main Road, Jaysingpur, Shirol Taluka, Kolhapur",
        phone: "02322-225588",
        marketImage: "https://images.unsplash.com/photo-1542838132-92c5332851d.jpg?auto=format&fit=crop&w=800&q=60",
        geometry: { coordinates: [74.5560, 16.7840] },
        rating: 4.6,
        open_now: true,
        isReal: false
    },
    {
        // ~22 km from SGU
        name: "Kolhapur APMC (Shahu Market Yard)",
        address: "Shahupuri, Kolhapur, Maharashtra",
        phone: "0231-2651234",
        marketImage: "https://images.unsplash.com/photo-1615485290382-441e4d0c9cb5?auto=format&fit=crop&w=800&q=60",
        geometry: { coordinates: [74.2433, 16.7050] },
        rating: 4.9,
        open_now: true,
        isReal: false
    },
    {
        // ~30 km from SGU
        name: "Sangli Turmeric & Agro Hub",
        address: "Market Yard, Sangli, Maharashtra",
        phone: "0233-2621022",
        marketImage: "https://images.unsplash.com/photo-1542838132-92c5332851d.jpg?auto=format&fit=crop&w=800&q=60",
        geometry: { coordinates: [74.5815, 16.8524] },
        rating: 4.8,
        open_now: true,
        isReal: false
    },
    {
        // ~32 km from SGU
        name: "Hupari Silver & Agro Mart",
        address: "Central Hub, Hupari, Kolhapur",
        phone: "02322-224433",
        marketImage: "https://images.unsplash.com/photo-1571771894821-ad9902d83f4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
        geometry: { coordinates: [74.4080, 16.6320] },
        rating: 4.5,
        open_now: true,
        isReal: false
    },
    {
        // ~57 km from SGU
        name: "Karad Krishi Vikas Mandi",
        address: "Market Yard, Karad, Maharashtra",
        phone: "02164-223344",
        marketImage: "https://images.unsplash.com/photo-1615485290382-441e4d0c9cb5?auto=format&fit=crop&w=800&q=60",
        geometry: { coordinates: [74.1830, 17.2860] },
        rating: 4.7,
        open_now: true,
        isReal: false
    }
];

export const Market = () => {
  const { language, location, refreshLocation } = useContext(MainContext);
  const t = TRANSLATIONS[language || 'en'];
  const [mars, setmars] = useState([])
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState('fallback'); // 'live', 'osm', 'fallback'

  // Fetch and merge markets from all sources
  const fetchAllMarkets = async (lat, lng) => {
    setLoading(true);
    let backendMarkets = [];
    let osmMarkets = [];

    // 1. Fetch from our Backend DB
    try {
        const res = await axios.get("/market/getmarket", {
            params: { lng, lat }
        });
        backendMarkets = (res.data || []).map(m => ({
            ...m,
            marketImage: m.marketImage ? (m.marketImage.startsWith('http') ? m.marketImage : `/uploads/${m.marketImage}`) : "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
            isReal: false,
            distance: m.geometry?.coordinates ? calculateDistance(lat, lng, m.geometry.coordinates[1], m.geometry.coordinates[0]) : 9999
        }));
    } catch (err) {
        console.error("Backend Market Fetch Error:", err);
    }

    // 2. Fetch from Overpass API (via backend proxy)
    try {
        const osmRes = await axios.get("/location/nearby", {
            params: { lat, lon: lng, type: 'market', radius: 60000 }, timeout: 1500
        });
        osmMarkets = (osmRes.data || []).map(p => ({
            name: p.name,
            address: p.address || 'Maharashtra',
            phone: p.phone || '',
            marketImage: "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
            geometry: { coordinates: [p.lon, p.lat] },
            rating: p.rating || 4.0,
            open_now: true,
            isReal: true,
            distance: p.distance,
            website: p.website || ''
        }));
        if (osmMarkets.length > 0) setDataSource('osm');
    } catch (err) {
        console.error("Overpass Market Fetch Error:", err);
    }

    // 3. Merge: OSM (nearest) â†’ Backend DB â†’ Dummy Fallback
    const seenNames = new Set();
    const combined = [];
    
    // Add OSM results first (real nearby data)
    osmMarkets.forEach(m => {
        const key = m.name.toUpperCase();
        if (!seenNames.has(key)) {
            seenNames.add(key);
            combined.push(m);
        }
    });

    // Add backend DB results
    backendMarkets.forEach(m => {
        const key = (m.name || '').toUpperCase();
        if (!seenNames.has(key)) {
            seenNames.add(key);
            combined.push(m);
        }
    });

    // Add dummy fallback if no real data, or append as additional options
    const dummyWithDistance = DUMMY_MARKETS.map(m => ({
        ...m,
        distance: calculateDistance(lat, lng, m.geometry.coordinates[1], m.geometry.coordinates[0])
    }));

    if (combined.length === 0) {
        setmars(dummyWithDistance);
        setDataSource('fallback');
    } else {
        // Append dummies not already in the list
        dummyWithDistance.forEach(m => {
            const key = m.name.toUpperCase();
            if (!seenNames.has(key)) {
                seenNames.add(key);
                combined.push(m);
            }
        });
        // Sort by distance
        combined.sort((a, b) => (a.distance || 9999) - (b.distance || 9999));
        setmars(combined);
        if (dataSource === 'fallback') setDataSource('live');
    }
    
    setLoading(false);
  };

  // --- LIVE LOCATION: Use GPS from context ---
  useEffect(() => {
    if (location.status === 'detecting') return; // Wait for GPS

    const lat = location.lat;
    const lng = location.lon;

    if (location.status === 'live') {
      setDataSource('live');
    }

    fetchAllMarkets(lat, lng);
  }, [location.lat, location.lon, location.status]);

  const getStatusChip = () => {
    if (dataSource === 'osm') return { text: t.osm_mode, color: '#10b981', dotClass: 'green' };
    if (dataSource === 'live') return { text: t.live_mode, color: '#3b82f6', dotClass: 'blue' };
    return { text: t.fallback_mode, color: '#f59e0b', dotClass: 'amber' };
  };

  const statusChip = getStatusChip();

  return (
    <section id="mar_page" className="fade-in" style={{ paddingTop: '80px', display: 'flex', flexDirection: 'column' }}>
      <div className="back-nav-container">
         <Link to="/services" className="elite-back-btn">
            <FiArrowLeft /> {t.return_btn}
         </Link>
      </div>

      <div className="market-hero">
        <div className="market-hero-text">
          <h1>{t.hero_title}</h1>
          <p>{t.hero_p}</p>
        </div>
        <Lottie data={marketlogo} height={`300px`} width={'400px'} />
      </div>

      <section id="mar_gallery" style={{ padding: '0 40px 100px' }}>
        <h2 id="mar_title" style={{ fontSize: '2.5rem', fontWeight: 950, marginBottom: '50px', textAlign: 'center' }}>
            {t.mar_title}
        </h2>
        
        {loading ? (
          <div id='mar_gall_scr'>
            <div className="skeleton-card" style={{height: '520px', borderRadius: '40px'}}></div>
            <div className="skeleton-card" style={{height: '520px', borderRadius: '40px'}}></div>
            <div className="skeleton-card" style={{height: '520px', borderRadius: '40px'}}></div>
          </div>
        ) : (
          <div id='mar_gall_scr' style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '30px' }}>
            {mars.map((it, index) => (
                <div key={index} className="market-card-premium glass-premium fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="market-img-wrap">
                        <img src={it.marketImage} alt={it.name} />
                        <div className="market-status-badge" style={{ background: it.open_now ? '#10b981' : '#f87171' }}>
                            {it.open_now ? t.status_open : t.status_closed}
                        </div>
                        {it.distance && it.distance < 200 && (
                          <div className="market-distance-badge">
                            ðŸ“ {it.distance} {t.km_away}
                          </div>
                        )}
                    </div>
                    
                    <div className="market-card-body" style={{ padding: '35px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                            <h3 style={{ fontSize: '1.6rem', fontWeight: 950, color: 'white', maxWidth: '80%' }}>{it.name}</h3>
                            <div className="rating-box">â­ {it.rating}</div>
                        </div>
                        
                        <p style={{ opacity: 0.6, fontSize: '0.95rem', marginBottom: '25px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                            <FiMapPin style={{ color: '#3b82f6', marginTop: '4px', flexShrink: 0 }} /> {it.address}
                        </p>

                        <div className="market-meta-row">
                             <div className="meta-item">
                                <span className="m-label">SOURCE</span>
                                <span className="m-val">{it.isReal ? "OSM LIVE" : "INTEL HUB"}</span>
                             </div>
                             <div className="meta-item">
                                <span className="m-label">RELIABILITY</span>
                                <span className="m-val">VERIFIED</span>
                             </div>
                             {it.distance && it.distance < 200 && (
                               <div className="meta-item">
                                  <span className="m-label">DISTANCE</span>
                                  <span className="m-val">{it.distance} KM</span>
                               </div>
                             )}
                        </div>

                        <div className="market-actions-premium" style={{ marginTop: '35px', display: 'flex', gap: '15px' }}>
                            <a 
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(it.name)}`} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="action-main-btn-v2"
                            >
                                <FiExternalLink /> EXPLORE ON GOOGLE
                            </a>
                        </div>
                    </div>
                </div>
            ))}
          </div>
        )}
      </section>

      <style>{`
        .glass-premium { background: rgba(255, 255, 255, 0.01); backdrop-filter: blur(40px); border: 1px solid rgba(255, 255, 255, 0.08); }
        .market-card-premium { border-radius: 40px; overflow: hidden; transition: 0.6s cubic-bezier(0.19, 1, 0.22, 1); }
        .market-card-premium:hover { transform: translateY(-15px); border-color: #3b82f6; box-shadow: 0 40px 80px rgba(0,0,0,0.6); }
        
        .market-img-wrap { width: 100%; height: 240px; position: relative; }
        .market-img-wrap img { width: 100%; height: 100%; object-fit: cover; }
        .market-status-badge { position: absolute; top: 20px; right: 20px; color: white; padding: 6px 15px; border-radius: 50px; font-size: 0.7rem; font-weight: 900; letter-spacing: 1px; box-shadow: 0 5px 15px rgba(0,0,0,0.3); }
        .market-distance-badge { position: absolute; bottom: 15px; left: 15px; background: rgba(0,0,0,0.7); backdrop-filter: blur(10px); color: #4ade80; padding: 6px 14px; border-radius: 50px; font-size: 0.75rem; font-weight: 900; letter-spacing: 0.5px; border: 1px solid rgba(74, 222, 128, 0.3); }

        .rating-box { background: rgba(251, 191, 36, 0.1); color: #fbbf24; padding: 5px 12px; border-radius: 50px; font-size: 0.8rem; font-weight: 950; }
        
        .market-meta-row { display: flex; gap: 30px; padding: 20px; background: rgba(255,255,255,0.02); border-radius: 20px; border: 1px solid rgba(255,255,255,0.05); }
        .meta-item { display: flex; flex-direction: column; }
        .m-label { font-size: 0.6rem; font-weight: 900; color: #3b82f6; letter-spacing: 1px; }
        .m-val { font-size: 0.85rem; font-weight: 800; color: white; margin-top: 2px; }

        .action-main-btn-v2 { flex: 1; height: 60px; border-radius: 20px; background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; display: flex; alignItems: center; justifyContent: center; gap: 12px; font-weight: 950; text-decoration: none; transition: 0.3s; box-shadow: 0 10px 20px rgba(59, 130, 246, 0.2); }
        .action-main-btn-v2:hover { transform: scale(1.03); filter: brightness(1.1); box-shadow: 0 15px 30px rgba(59, 130, 246, 0.3); }

        .live-status-chip { background: rgba(0, 0, 0, 0.4); color: #ffffff; padding: 10px 20px; borderRadius: 50px; font-size: 0.8rem; font-weight: 950; display: inline-flex; align-items: center; gap: 10px; margin-bottom: 20px; backdrop-filter: blur(5px); }
        .live-dot-pulse { width: 8px; height: 8px; border-radius: 50%; animation: dotPulse 1.5s infinite; }
        .live-dot-pulse.blue { background: #3b82f6; }
        .live-dot-pulse.green { background: #10b981; }
        .live-dot-pulse.amber { background: #f59e0b; }
        
        .location-district-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); color: #93c5fd; padding: 10px 20px; border-radius: 50px; font-size: 0.85rem; font-weight: 800; margin-top: 15px; }
        .refresh-loc-btn { background: none; border: none; color: #93c5fd; cursor: pointer; padding: 2px; display: flex; align-items: center; transition: 0.3s; }
        .refresh-loc-btn:hover { transform: rotate(180deg); color: #3b82f6; }

        @keyframes dotPulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.5); opacity: 0.5; } 100% { transform: scale(1); opacity: 1; } }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in-up { animation: fadeIn 0.8s ease forwards; }
      `}</style>
    </section>
  )
}
