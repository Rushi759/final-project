/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios';
import '../../Styles/LaboratoryPage.css'
import { Carousel } from 'react-responsive-carousel';
import { Link } from 'react-router-dom'
import { FiArrowLeft, FiMapPin, FiRefreshCw } from 'react-icons/fi'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { MainContext } from '../../context/agroguru_context';
import { calculateDistance } from '../../services/locationService';

const TRANSLATIONS = {
  en: {
    return_btn: "Return to Hub",
    hero_title: "Soil & Plant Labs",
    hero_p: "Scientific analysis and high-precision testing services to ensure your crops thrive in the right environment.",
    lab_title: "Certified Laboratories Near You",
    view_map: "📍 View Map",
    services_avail: "Premium analysis services available",
    no_labs: "No agricultural laboratories were found in your current vicinity. Ensure location access is enabled for precise scientific mapping.",
    km_away: "km away",
    live_mode: "Live GPS: Showing Labs Near You",
    osm_mode: "OpenStreetMap: Real-Time Discovery",
    fallback_mode: "Intelligence Mode: Showing Regional Labs",
    refresh: "Refresh Location"
  },
  mr: {
    return_btn: "मुख्य केंद्रावर परत जा",
    hero_title: "माती आणि पीक प्रयोगशाळा",
    hero_p: "तुमची पिके योग्य वातावरणात भरभराटीला येतील याची खात्री करण्यासाठी वैज्ञानिक विश्लेषण आणि उच्च-अचूक चाचणी सेवा.",
    lab_title: "तुमच्या जवळील प्रमाणित प्रयोगशाळा",
    view_map: "📍 नकाशा पहा",
    services_avail: "प्रीमियम विश्लेषण सेवा उपलब्ध",
    no_labs: "तुमच्या परिसरात कोणतीही कृषी प्रयोगशाळा सापडली नाही. तंतोतंत वैज्ञानिक मॅपिंगसाठी स्थान अ‍ॅक्सेस सक्षम असल्याची खात्री करा.",
    km_away: "किमी दूर",
    live_mode: "लाईव्ह GPS: तुमच्या जवळील प्रयोगशाळा",
    osm_mode: "ओपनस्ट्रीटमॅप: रिअल-टाइम शोध",
    fallback_mode: "इंटेलिजन्स मोड: प्रादेशिक प्रयोगशाळा दर्शवित आहे",
    refresh: "स्थान रिफ्रेश करा"
  }
};

const DUMMY_LABS = [
    {
        // ~8 km from SGU
        name: "Hatkanangale Krishi Vigyan Kendra Lab",
        address: "KVK Campus, Taluka Office Road, Hatkanangale, Kolhapur",
        phone: "+91 98225 11223",
        laboratoryImage: "https://images.unsplash.com/photo-1579154273030-5813d3330df3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
        geometry: { coordinates: [74.4245, 16.7522] },
        Services: [
            { sname: "Soil N-P-K Analysis", photo: "https://images.unsplash.com/photo-1615485290382-441e4d0c9cb5?w=400" },
            { sname: "Micro-Nutrient Test", photo: "https://images.unsplash.com/photo-1543083477-4f7f44ade80d?w=400" }
        ]
    },
    {
        // ~19 km from SGU
        name: "Ichalkaranji Industrial Agro-Testing Lab",
        address: "MIDC Area, Main Road, Ichalkaranji, Kolhapur",
        phone: "+91 91233 44556",
        laboratoryImage: "https://images.unsplash.com/photo-1581093148467-f1261456ca01?w=800",
        geometry: { coordinates: [74.4600, 16.7000] },
        Services: [
            { sname: "Water Quality Analysis", photo: "https://images.unsplash.com/photo-1532187875604-2647dc6a2444?w=400" }
        ]
    },
    {
        // ~20 km from SGU
        name: "Shivaji University Soil & Agri-Research Lab",
        address: "Vidyanagar, Kolhapur City, Maharashtra",
        phone: "+91 0231-2609000",
        laboratoryImage: "https://images.unsplash.com/photo-1581093588401-fbb62a02f212?w=800",
        geometry: { coordinates: [74.2354, 16.7026] },
        Services: [
            { sname: "Botanical Research", photo: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400" },
            { sname: "Pest Identification", photo: "https://images.unsplash.com/photo-1530973428-5bf2db2e4d71?w=400" }
        ]
    },
    {
        // ~22 km from SGU
        name: "Kolhapur ICAD Precision Agri-Lab",
        address: "Market Yard Road, Kolhapur City",
        phone: "+91 90223 44556",
        laboratoryImage: "https://images.unsplash.com/photo-1579154341098-bc4878a2ea51?w=800",
        geometry: { coordinates: [74.2433, 16.7050] },
        Services: [
            { sname: "Micro-Nutrient Assay", photo: "https://images.unsplash.com/photo-1532187875604-2647dc6a2444?w=400" }
        ]
    },
    {
        // ~30 km from SGU
        name: "Sangli District Bio-Chemical Center",
        address: "Kupwad MIDC Area, Sangli City",
        phone: "+91 99220 55667",
        laboratoryImage: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800",
        geometry: { coordinates: [74.58, 16.85] },
        Services: []
    },
    {
        // ~58 km from SGU
        name: "Karad Regional Soil Science Lab",
        address: "Railway Station Road, Karad City",
        phone: "+91 94220 12345",
        laboratoryImage: "https://images.unsplash.com/photo-1530973428-5bf2db2e4d71?w=800",
        geometry: { coordinates: [74.18, 17.28] },
        Services: []
    }
];

export const Laboratory = () => {
  const { language, location, refreshLocation } = useContext(MainContext);
  const t = TRANSLATIONS[language || 'en'];
  const [labs, setlabs] = useState([])
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState('fallback');

  const fetchAllLabs = async (lat, lng) => {
    setLoading(true);
    let backendLabs = [];
    let osmLabs = [];

    // 1. Fetch from Backend DB
    try {
      const res = await axios.get('/lab/getlaboratory', { params: { lng, lat }, timeout: 1500 });
      backendLabs = (res.data || []).map(l => ({
        ...l,
        laboratoryImage: l.laboratoryImage ? (l.laboratoryImage.startsWith('http') ? l.laboratoryImage : `/uploads/${l.laboratoryImage}`) : 'https://images.unsplash.com/photo-1579154273030-5813d3330df3?auto=format&fit=crop&w=800&q=60',
        distance: l.geometry?.coordinates ? calculateDistance(lat, lng, l.geometry.coordinates[1], l.geometry.coordinates[0]) : 9999
      }));
    } catch (err) { console.log('Backend Lab Fetch Error:', err); }

    // 2. Fetch from Overpass API (via backend proxy)
    try {
      const osmRes = await axios.get('/location/nearby', { params: { lat, lon: lng, type: 'laboratory', radius: 60000 }, timeout: 1500 });
      osmLabs = (osmRes.data || []).map(p => ({
        name: p.name, address: p.address || 'Maharashtra', phone: p.phone || '',
        laboratoryImage: 'https://images.unsplash.com/photo-1579154273030-5813d3330df3?auto=format&fit=crop&w=800&q=60',
        geometry: { coordinates: [p.lon, p.lat] },
        distance: p.distance, Services: []
      }));
      if (osmLabs.length > 0) setDataSource('osm');
    } catch (err) { console.log('Overpass Lab Fetch Error:', err); }

    // 3. Merge: OSM → Backend → Dummy Fallback
    const seenNames = new Set();
    const combined = [];
    [...osmLabs, ...backendLabs].forEach(l => {
      const key = (l.name || '').toUpperCase();
      if (!seenNames.has(key)) { seenNames.add(key); combined.push(l); }
    });
    const dummyWithDist = DUMMY_LABS.map(l => ({ ...l, distance: calculateDistance(lat, lng, l.geometry.coordinates[1], l.geometry.coordinates[0]) }));
    if (combined.length === 0) { setlabs(dummyWithDist); setDataSource('fallback'); }
    else {
      dummyWithDist.forEach(l => { const key = l.name.toUpperCase(); if (!seenNames.has(key)) { seenNames.add(key); combined.push(l); } });
      combined.sort((a, b) => (a.distance || 9999) - (b.distance || 9999));
      setlabs(combined);
      if (dataSource === 'fallback') setDataSource('live');
    }
    setLoading(false);
  };

  // --- LIVE LOCATION: Use GPS from context ---
  useEffect(() => {
    if (location.status === 'detecting') return;
    fetchAllLabs(location.lat, location.lon);
    if (location.status === 'live') setDataSource('live');
  }, [location.lat, location.lon, location.status]);

  const getStatusChip = () => {
    if (dataSource === 'osm') return { text: t.osm_mode, color: '#10b981', dotClass: 'green' };
    if (dataSource === 'live') return { text: t.live_mode, color: '#3b82f6', dotClass: 'blue' };
    return { text: t.fallback_mode, color: '#f59e0b', dotClass: 'amber' };
  };
  const statusChip = getStatusChip();

  return (
    <section id="lab_page" className="fade-in" style={{ paddingTop: '80px', display: 'flex', flexDirection: 'column' }}>
      <div className="back-nav-container">
         <Link to="/services" className="elite-back-btn">
            <FiArrowLeft /> {t.return_btn}
         </Link>
      </div>
      <div className="lab-hero">
        <div className="lab-hero-text">
          <h1>{t.hero_title}</h1>
          <p>{t.hero_p}</p>
        </div>
      </div>

      <section id="lab_gallery">
        <div id="lab_title">{t.lab_title}</div>
        
        {loading ? (
          <div id='lab_gall_scr'>
            <div className="skeleton-card" style={{height: '550px'}}></div>
            <div className="skeleton-card" style={{height: '550px'}}></div>
          </div>
        ) : (
          <div id='lab_gall_scr'>
            {labs.length > 0 ? (
              labs.map((it, index) => (
                <div id="lab_cart" key={index} className="fade-in">
                  <div id="lab_img_n_cnt">
                    <div id="img_dv">
                      <img 
                        src={it.laboratoryImage ? (it.laboratoryImage.startsWith('http') ? it.laboratoryImage : `/uploads/${it.laboratoryImage}`) : "https://images.unsplash.com/photo-1579154273030-5813d3330df3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"} 
                        alt={it.name} 
                      />
                    </div>
                    <div className="lab_card_body">
                      <p id="lab_name">{it.name}</p>
                      <p id="lab_addr">{it.address}</p>
                      
                      <div id="lab_pg_phone">
                        <div className="but" id="lab_phone">{it.phone}</div>
                        <div className="but">
                          <a href={`https://www.google.com/maps/dir/?api=1&destination=${it.geometry?.coordinates[1]},${it.geometry?.coordinates[0]}`} target="_blank" rel="noopener noreferrer" id="nur_map" style={{ textDecoration: 'none' }}>{t.view_map}</a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div id="lab_cart_imgs">
                    <Carousel showThumbs={false} autoPlay={true} infiniteLoop={true} showStatus={false}>
                      {
                        (it.Services && it.Services.length > 0) ? it.Services.map((i, idx) => (
                          <div className='item_img' key={idx}>
                            <img src={`/uploads/${i.photo}`} alt={i.sname} />
                            <span className='itemname'>{i.sname}</span>
                          </div>
                        )) : (
                          <div className="no-items">
                            <p>{t.services_avail}</p>
                          </div>
                        )
                      }
                    </Carousel>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>{t.no_labs}</p>
              </div>
            )}
          </div>
        )}
      </section>
    </section>
  )
}
