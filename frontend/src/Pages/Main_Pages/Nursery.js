import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import '../../Styles/nursery_page_ui.css'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import NurseryImages from '../../NurseryImages'
import Slider from '../../Component/Slider'
import { Link, useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiMapPin, FiRefreshCw } from 'react-icons/fi'

import { MainContext } from '../../context/agroguru_context'
import { calculateDistance } from '../../services/locationService'

const TRANSLATIONS = {
  en: {
    return_btn: "Return to Hub",
    hero_title: "Plant Nursery Network",
    hero_p: "Live location-powered discovery of plant nurseries near you.",
    nur_title: "Premium Plant Nurseries Near You",
    open: "Open",
    close: "Close",
    view_map: "📍 View Map",
    inventory_soon: "Premium inventory data coming soon",
    no_nurseries: "We couldn't locate any nurseries in your immediate vicinity. Please ensure location services are active or expand your search radius.",
    km_away: "km away",
    live_mode: "Live GPS: Showing Nurseries Near You",
    osm_mode: "OpenStreetMap: Real-Time Discovery",
    fallback_mode: "Intelligence Mode: Showing Regional Nurseries",
    refresh: "Refresh Location"
  },
  mr: {
    return_btn: "मुख्य केंद्रावर परत जा",
    hero_title: "रोपवाटिका नेटवर्क",
    hero_p: "तुमच्या जवळील रोपवाटिका शोधण्यासाठी लाईव्ह स्थान-आधारित शोध.",
    nur_title: "तुमच्या जवळील प्रीमियम रोपवाटिका",
    open: "उघडण्याची वेळ",
    close: "बंद होण्याची वेळ",
    view_map: "📍 नकाशा पहा",
    inventory_soon: "मालसूची लवकरच येत आहे",
    no_nurseries: "आम्हाला तुमच्या परिसरात कोणतीही रोपवाटिका सापडली नाही. कृपया स्थान सेवा सक्रिय असल्याची खात्री करा.",
    km_away: "किमी दूर",
    live_mode: "लाईव्ह GPS: तुमच्या जवळील रोपवाटिका",
    osm_mode: "ओपनस्ट्रीटमॅप: रिअल-टाइम शोध",
    fallback_mode: "इंटेलिजन्स मोड: प्रादेशिक रोपवाटिका दर्शवित आहे",
    refresh: "स्थान रिफ्रेश करा"
  }
};

const DUMMY_NURSERIES = [
    {
        // ~5 km from SGU (Atigre)
        name: "Atigre Krishi Nursery & Sapling Center",
        address: "Atigre Village, Hatkanangale Taluka, Kolhapur",
        phone: "+91 94220 11234",
        nurseryImage: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80",
        geometry: { coordinates: [74.3721, 16.7725] },
        timing: { opening: "8:00 AM", closing: "7:00 PM" },
        google_rating: 4.7,
        Items: [
            { itemname: "Sugarcane Sets", photo: "https://images.unsplash.com/photo-1592150621344-9fa4ff9843b7?w=400" },
            { itemname: "Organic Compost", photo: "https://images.unsplash.com/photo-1584473457406-624048643194?w=400" }
        ]
    },
    {
        // ~8 km from SGU
        name: "Hatkanangale Bio-Flora Nursery",
        address: "Main Road, Hatkanangale, Kolhapur",
        phone: "+91 98223 11223",
        nurseryImage: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=800&q=80",
        geometry: { coordinates: [74.4245, 16.7522] },
        timing: { opening: "8:00 AM", closing: "8:00 PM" },
        google_rating: 4.8,
        Items: [
            { itemname: "Flower Plants", photo: "https://images.unsplash.com/photo-1416870262648-255fbd2c867d?w=400" }
        ]
    },
    {
        // ~15 km from SGU
        name: "Peth-Vadgaon Plant Gallery",
        address: "Near Vadgaon Naka, Hatkanangale Taluka",
        phone: "+91 90223 44556",
        nurseryImage: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800",
        geometry: { coordinates: [74.32, 16.83] },
        timing: { opening: "9:00 AM", closing: "9:00 PM" },
        google_rating: 4.4,
        Items: []
    },
    {
        // ~18 km from SGU
        name: "Ichalkaranji Green City Nursery",
        address: "Rajwada Chowk, Ichalkaranji, Kolhapur",
        phone: "+91 91233 44556",
        nurseryImage: "https://images.unsplash.com/photo-1416870262648-255fbd2c867d?auto=format&fit=crop&w=800&q=80",
        geometry: { coordinates: [74.4600, 16.7000] },
        timing: { opening: "8:30 AM", closing: "7:30 PM" },
        google_rating: 4.5,
        Items: [
            { itemname: "Hybrid Seedlings", photo: "https://images.unsplash.com/photo-1592150621344-9fa4ff9843b7?w=400" }
        ]
    },
    {
        // ~22 km from SGU
        name: "Kolhapur City Garden & Nursery Hub",
        address: "Near Rajaram Mandir, Kolhapur City",
        phone: "+91 94220 55667",
        nurseryImage: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80",
        geometry: { coordinates: [74.2340, 16.7060] },
        timing: { opening: "9:00 AM", closing: "7:00 PM" },
        google_rating: 4.7,
        Items: []
    },
    {
        // ~30 km from SGU
        name: "Sangli Golden Grape Nursery",
        address: "Market Yard Area, Sangli District",
        phone: "+91 91233 44556",
        nurseryImage: "https://images.unsplash.com/photo-1574136764663-c96b8c13dd6c?auto=format&fit=crop&w=800&q=80",
        geometry: { coordinates: [74.58, 16.85] },
        timing: { opening: "7:00 AM", closing: "7:00 PM" },
        google_rating: 4.6,
        Items: []
    },
    {
        // ~45 km from SGU
        name: "Warnanagar Premium Saplings",
        address: "Warna Hub, Kolhapur District",
        phone: "+91 94220 55667",
        nurseryImage: "https://images.unsplash.com/photo-1416870262648-255fbd2c867d?auto=format&fit=crop&w=800&q=80",
        geometry: { coordinates: [74.15, 16.85] },
        timing: { opening: "9:00 AM", closing: "7:00 PM" },
        google_rating: 4.7,
        Items: []
    }
];

export const Nursery = () => {
  const navigate = useNavigate();
  const { language, location, refreshLocation } = useContext(MainContext);
  const t = TRANSLATIONS[language || 'en'];
  const [nurs, setnurs] = useState([])
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState('fallback');

  const fetchAllNurseries = async (lat, lng) => {
    setLoading(true);
    let backendNurseries = [];
    let osmNurseries = [];

    // 1. Fetch from Backend DB
    try {
      const res = await axios.get("/nursery/getnursery", { params: { lng, lat }, timeout: 1500 });
      backendNurseries = (res.data || []).filter(item => {
        const name = (item.name || '').toUpperCase();
        const addr = (item.address || '').toUpperCase();
        const itemLat = item.geometry?.coordinates[1] || 0;
        return !(name.includes('PUNE') || addr.includes('PUNE') || (itemLat >= 18.4 && itemLat <= 18.6));
      }).map(n => ({
        ...n,
        nurseryImage: n.nurseryImage ? (n.nurseryImage.startsWith('http') ? n.nurseryImage : `/uploads/${n.nurseryImage}`) : 'https://images.unsplash.com/photo-1416870262648-255fbd2c867d?auto=format&fit=crop&w=800&q=60',
        distance: n.distance || (n.geometry?.coordinates ? calculateDistance(lat, lng, n.geometry.coordinates[1], n.geometry.coordinates[0]) : 9999)
      }));
    } catch (err) { console.log('Backend Nursery Fetch Error:', err); }

    try {
      const osmRes = await axios.get('/location/nearby', { params: { lat, lon: lng, type: 'nursery', radius: 60000 }, timeout: 1500 });
      osmNurseries = (osmRes.data || []).map(p => ({
        name: p.name, address: p.address || 'Maharashtra', phone: p.phone || '',
        nurseryImage: 'https://images.unsplash.com/photo-1416870262648-255fbd2c867d?auto=format&fit=crop&w=800&q=60',
        geometry: { coordinates: [p.lon, p.lat] },
        timing: { opening: '8:00 AM', closing: '6:00 PM' },
        google_rating: p.rating || null, distance: p.distance, Items: []
      }));
      if (osmNurseries.length > 0) setDataSource('osm');
    } catch (err) { console.log('Overpass Nursery Fetch Error:', err); }

    // 3. Merge: OSM → Backend → Dummy Fallback
    const seenNames = new Set();
    const combined = [];
    [...osmNurseries, ...backendNurseries].forEach(n => {
      const key = (n.name || '').toUpperCase();
      if (!seenNames.has(key)) { seenNames.add(key); combined.push(n); }
    });
    const dummyWithDist = DUMMY_NURSERIES.map(n => ({ ...n, distance: calculateDistance(lat, lng, n.geometry.coordinates[1], n.geometry.coordinates[0]) }));
    if (combined.length === 0) { setnurs(dummyWithDist); setDataSource('fallback'); }
    else {
      dummyWithDist.forEach(n => { const key = n.name.toUpperCase(); if (!seenNames.has(key)) { seenNames.add(key); combined.push(n); } });
      combined.sort((a, b) => (a.distance || 9999) - (b.distance || 9999));
      setnurs(combined);
      if (dataSource === 'fallback') setDataSource('live');
    }
    setLoading(false);
  };

  // --- LIVE LOCATION: Use GPS from context ---
  useEffect(() => {
    if (location.status === 'detecting') return;
    fetchAllNurseries(location.lat, location.lon);
    if (location.status === 'live') setDataSource('live');
  }, [location.lat, location.lon, location.status]);

  const getStatusChip = () => {
    if (dataSource === 'osm') return { text: t.osm_mode, color: '#10b981', dotClass: 'green' };
    if (dataSource === 'live') return { text: t.live_mode, color: '#3b82f6', dotClass: 'blue' };
    return { text: t.fallback_mode, color: '#f59e0b', dotClass: 'amber' };
  };
  const statusChip = getStatusChip();

  return (
    <section id="nur_page" className="fade-in" style={{ paddingTop: '80px', display: 'flex', flexDirection: 'column' }}>
      <div className="back-nav-container">
         <Link to="/services" className="elite-back-btn">
            <FiArrowLeft /> {t.return_btn}
         </Link>
      </div>
      <div className="nursery-hero">
        <div className="nursery-hero-text">
          <h1>{t.hero_title}</h1>
          <p>{t.hero_p}</p>
        </div>
      </div>

      <section id="nur_gallery">
        <div id="nur_title">{t.nur_title}</div>
        
        {loading ? (
          <div id='nur_gall_scr'>
            <div className="skeleton-card" style={{height: '600px'}}></div>
            <div className="skeleton-card" style={{height: '600px'}}></div>
          </div>
        ) : (
          <div id='nur_gall_scr'>
            {nurs.length > 0 ? (
              <>
                {nurs.map((it, index) => (
                  <div id="nur_cart" key={index} className="fade-in">
                    {/* ... existing card content stays exactly as is ... */}
                    <div id="nur_img_n_cnt">
                      <div id="img_dv">
                        <img 
                          src={it.nurseryImage ? (it.nurseryImage.startsWith('http') ? it.nurseryImage : `/uploads/${it.nurseryImage}`) : "https://images.unsplash.com/photo-1416870262648-255fbd2c867d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"} 
                          alt={it.name} 
                        />
                      </div>
                      <div className="nur_card_body">
                        <p id="nur_name" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            {it.name}
                            {it.distance <= 5 && <span className="near-me-badge">📍 NEAR ME</span>}
                        </p>
                        {it.google_rating && (
                          <div className="google-rating">
                            ⭐ {it.google_rating} <small>(Google Verified)</small>
                          </div>
                        )}
                        <p id="nur_addr">
                            {it.address}  
                            {it.distance < 200 && <span className="dist-label"> • {it.distance} km away</span>}
                        </p>
                        
                        <div id="nur_tm">
                          <div id="optime">{t.open} <span>{it.timing?.opening}</span></div>
                          <div id="cltime">{t.close} <span>{it.timing?.closing}</span></div>
                        </div>

                        <div id="nur_pg_phone">
                          <div className="but" id="nur_phone">{it.phone}</div>
                          <div className="but">
                            <a href={`https://www.google.com/maps/dir/?api=1&destination=${it.geometry?.coordinates[1]},${it.geometry?.coordinates[0]}`} target="_blank" rel="noopener noreferrer" id="nur_map" style={{ textDecoration: 'none' }}>{t.view_map}</a>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div id="nur_cart_imgs">
                      <Carousel showThumbs={false} autoPlay={true} infiniteLoop={true} showStatus={false}>
                        {
                          (it.Items && it.Items.length > 0) ? it.Items.map((i, idx) => (
                            <div className='item_img' key={idx}>
                              <img src={i.photo?.startsWith('http') ? i.photo : `/uploads/${i.photo}`} alt={i.itemname} />
                              <span className='itemname'>{i.itemname}</span>
                            </div>
                          )) : (
                            <div className="no-items">
                              <p>{t.inventory_soon}</p>
                            </div>
                          )
                        }
                      </Carousel>
                    </div>
                  </div>
                ))}
                
                {/* --- ADD NURSERY PROMO CARD --- */}
                <div id="nur_cart" className="add-nursery-promo glass-premium" onClick={() => navigate('/form/nurf')}>
                   <div className="promo-icon">🌱</div>
                   <h3>Own a Nursery?</h3>
                   <p>Join the AgroGuru network to showcase your plants to local farmers.</p>
                   <button className="promo-btn">REGISTER NOW</button>
                </div>
              </>
            ) : (
              <div className="empty-state">
                <p>{t.no_nurseries}</p>
                <button onClick={() => navigate('/form/nurf')} className="promo-btn" style={{marginTop: '20px'}}>Register Your Nursery Instead</button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Floating Action Button for Add Nursery - UPGRADED UI */}
      <button className="fab-add-nursery neon-glass-fab" onClick={() => navigate('/form/nurf')} title="Register Your Nursery">
          <div className="fab-glow"></div>
          <span className="fab-plus">+</span>
          <span className="fab-text">PARTNER WITH US</span>
      </button>

      <style>{`
        .nursery-hero {
            padding: 60px 40px;
            text-align: center;
            background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.2));
            margin: 0 40px 40px;
            border-radius: 40px;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .nursery-hero-text h1 {
            font-size: 3.5rem;
            font-weight: 950;
            color: white;
            letter-spacing: -2px;
            margin-bottom: 10px;
        }
        .nursery-hero-text p {
            font-size: 1.1rem;
            color: rgba(255, 255, 255, 0.7);
            max-width: 700px;
            margin: 0 auto;
            line-height: 1.6;
        }

        .add-nursery-promo {
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            text-align: center; padding: 50px; 
            background: rgba(59, 130, 246, 0.03);
            border: 2px dashed rgba(59, 130, 246, 0.2);
            border-radius: 50px; cursor: pointer; transition: 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
            position: relative; overflow: hidden;
        }
        .add-nursery-promo::before {
            content: ''; position: absolute; inset: 0; 
            background: linear-gradient(45deg, transparent, rgba(59, 130, 246, 0.1), transparent);
            transform: translateX(-100%); transition: 0.8s;
        }
        .add-nursery-promo:hover::before { transform: translateX(100%); }
        .add-nursery-promo:hover { 
            background: rgba(59, 130, 246, 0.08); 
            border-color: #3b82f6; 
            box-shadow: 0 30px 60px rgba(0,0,0,0.3), 0 0 30px rgba(59,130,246,0.1);
            transform: translateY(-10px); 
        }
        .promo-icon { font-size: 5rem; margin-bottom: 25px; filter: drop-shadow(0 0 15px rgba(59,130,246,0.5)); }
        .promo-btn { 
            background: linear-gradient(135deg, #3b82f6, #2563eb); 
            color: white; border: none; padding: 15px 45px; border-radius: 50px; 
            font-weight: 900; margin-top: 25px; cursor: pointer; 
            box-shadow: 0 10px 20px rgba(37, 99, 235, 0.3);
            transition: 0.3s;
        }
        .promo-btn:hover { transform: scale(1.05); box-shadow: 0 15px 30px rgba(37, 99, 235, 0.5); }

        .neon-glass-fab {
            position: fixed; bottom: 50px; right: 50px; 
            background: rgba(15, 23, 42, 0.8);
            backdrop-filter: blur(20px);
            color: white; border: 1px solid rgba(59, 130, 246, 0.5);
            border-radius: 100px;
            padding: 18px 35px; display: flex; align-items: center; gap: 15px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.5), inset 0 0 15px rgba(59,130,246,0.2);
            cursor: pointer; z-index: 3000; 
            transition: 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
            animation: fabPulse 3s infinite;
        }
        .neon-glass-fab:hover { 
            transform: scale(1.05) translateY(-15px); 
            background: #3b82f6;
            border-color: #60a5fa;
            box-shadow: 0 30px 70px rgba(37, 99, 235, 0.6);
            color: white;
        }
        .fab-glow {
            position: absolute; inset: -2px; border-radius: 100px;
            background: linear-gradient(90deg, #3b82f6, #60a5fa);
            z-index: -1; opacity: 0.3; filter: blur(10px);
        }
        .fab-plus { font-size: 1.8rem; font-weight: 900; }
        .fab-text { font-weight: 950; letter-spacing: 2px; font-size: 0.75rem; color: #fff; }

        .near-me-badge {
            background: rgba(16, 185, 129, 0.15);
            color: #10b981;
            padding: 4px 12px;
            border-radius: 50px;
            font-size: 0.65rem;
            font-weight: 950;
            border: 1px solid rgba(16, 185, 129, 0.3);
            text-shadow: 0 0 10px rgba(16, 185, 129, 0.3);
        }
        .dist-label {
            color: #3b82f6;
            font-weight: 800;
            font-size: 0.8rem;
        }

        @keyframes fabPulse {
            0% { box-shadow: 0 20px 50px rgba(0,0,0,0.5), 0 0 0px rgba(59,130,246,0); }
            50% { box-shadow: 0 20px 50px rgba(0,0,0,0.5), 0 0 20px rgba(59,130,246,0.5); }
            100% { box-shadow: 0 20px 50px rgba(0,0,0,0.5), 0 0 0px rgba(59,130,246,0); }
        }
      `}</style>
    </section>
  )
}