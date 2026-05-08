import React, { useState, useEffect, useMemo, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../Styles/Home_page_ui.css';

const factoryData = {
  sugar: [
    { name: "Warana Sugar Factory", location: "Kolhapur", price: 3600, cycle: "14 Days", status: "💎 Premium Payout", trends: [3200, 3300, 3450, 3400, 3500, 3600, 3600] },
    { name: "Jawahar Shetkari", location: "Sangli", price: 3450, cycle: "15 Days", status: "Active", trends: [3400, 3420, 3410, 3450, 3450, 3460, 3450] },
    { name: "Sahyadri Sugars", location: "Satara", price: 3200, cycle: "12 Days", status: "Fast Pay", trends: [3100, 3150, 3200, 3200, 3200, 3180, 3200] },
    { name: "Sonhira Sugar", location: "Sangli", price: 3350, cycle: "14 Days", status: "Active", trends: [3300, 3320, 3350, 3340, 3350, 3350, 3350] },
    { name: "Kumbhi Kasari", location: "Kolhapur", price: 3400, cycle: "14 Days", status: "Active", trends: [3380, 3390, 3400, 3400, 3410, 3400, 3400] },
    { name: "Rajarambapu Patil", location: "Sangli", price: 3500, cycle: "15 Days", status: "High Demand", trends: [3450, 3460, 3480, 3500, 3520, 3510, 3500] },
  ],
  milk: [
    { name: "Gokul Dairy (Buffalo)", location: "Kolhapur", price: 48.50, type: "6.0 Fat / 9.0 SNF", status: "🏆 Market Leader", trends: [47, 47.5, 48, 48, 48.2, 48.5, 48.5] },
    { name: "Gokul Dairy (Cow)", location: "Kolhapur", price: 35.00, type: "3.5 Fat / 8.5 SNF", status: "Active", trends: [34, 34, 34.5, 34.8, 35, 35, 35] },
    { name: "Warna Milk (Buffalo)", location: "Kolhapur", price: 47.00, type: "6.0 Fat / 9.0 SNF", status: "Active", trends: [46, 46.5, 47, 47, 47, 47, 47] },
    { name: "Warna Milk (Cow)", location: "Kolhapur", price: 34.50, type: "3.5 Fat / 8.5 SNF", status: "Active", trends: [32, 33, 33, 34, 34.5, 34.5, 34.5] },
    { name: "Katraj Dairy (Buffalo)", location: "Pune", price: 46.00, type: "6.0 Fat / 9.0 SNF", status: "Stable", trends: [45, 45, 45.5, 46, 46, 46, 46] },
    { name: "Katraj Dairy (Cow)", location: "Pune", price: 35.20, type: "3.5 Fat / 8.5 SNF", status: "Stable", trends: [34, 35, 35, 35.2, 35.2, 35.2, 35.2] },
    { name: "Chitale Dairy (Buffalo)", location: "Sangli", price: 49.00, type: "6.5 Fat / 9.0 SNF", status: "💎 Premium", trends: [48, 48.5, 48.8, 49, 49.2, 49.5, 49] },
    { name: "Chitale Dairy (Cow)", location: "Sangli", price: 36.00, type: "3.8 Fat / 8.5 SNF", status: "Active", trends: [35, 35.5, 36, 36, 36, 36, 36] },
    { name: "Amul MH (Buffalo)", location: "Mumbai/Pune Hub", price: 47.50, type: "6.0 Fat / 9.0 SNF", status: "Active", trends: [46, 47, 47, 47.5, 47.5, 47.5, 47.5] },
    { name: "Amul MH (Cow)", location: "Mumbai/Pune Hub", price: 36.50, type: "3.8 Fat / 8.5 SNF", status: "🏆 Market Leader", trends: [35.5, 35.8, 36, 36.2, 36.5, 36.5, 36.5] },
    { name: "Mother Dairy (Buffalo)", location: "Mumbai Hub", price: 46.80, type: "6.0 Fat / 9.0 SNF", status: "Active", trends: [45, 46, 46, 46.8, 46.8, 46.8, 46.8] },
    { name: "Mother Dairy (Cow)", location: "Mumbai Hub", price: 34.50, type: "3.5 Fat / 8.5 SNF", status: "Active", trends: [33, 34, 34, 34.5, 34.5, 34.5, 34.5] },
  ],
  crops: [
    { name: "Onion (Gavran)", location: "Lasalgaon", price: 1850, type: "Per Quintal", status: "🏆 Global Hub", trends: [1600, 1700, 1750, 1800, 1850, 1900, 1850] },
    { name: "Soyabean (Yellow)", location: "Latur Mandi", price: 4650, type: "Per Quintal", status: "High Demand", trends: [4500, 4550, 4600, 4650, 4650, 4680, 4650] },
    { name: "Cotton (Long Staple)", location: "Yavatmal", price: 7800, type: "Per Quintal", status: "White Gold", trends: [7500, 7600, 7700, 7750, 7800, 7850, 7800] },
    { name: "Turmeric (Salem)", location: "Sangli Hub", price: 8200, type: "Per Quintal", status: "💎 Premium", trends: [8000, 8050, 8100, 8200, 8250, 8300, 8200] },
    { name: "Grapes (Export)", location: "Nashik Yard", price: 85, type: "Per Kg", status: "Active", trends: [75, 80, 82, 85, 88, 90, 85] },
    { name: "Pomegranate (Bhagwa)", location: "Solapur", price: 120, type: "Per Kg", status: "Export Grade", trends: [100, 110, 115, 120, 125, 130, 120] },
  ]
};

const Sparkline = memo(({ data, color = "#4ade80" }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 100;
  const height = 40;

  const points = data.map((d, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - ((d - min) / range) * (height - 10) - 5
  }));

  let path = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const cp1x = points[i].x + (points[i + 1].x - points[i].x) / 2;
    path += ` C ${cp1x},${points[i].y} ${cp1x},${points[i+1].y} ${points[i+1].x},${points[i + 1].y}`;
  }

  const fillPath = `${path} L ${width},${height} L 0,${height} Z`;

  return (
    <div className="sparkline-container">
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id={`glow-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={fillPath} fill={`url(#glow-${color.replace('#','')})`} />
        <path d={path} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
});

const SmartPriceHub = () => {
  const [activeTab, setActiveTab] = useState('sugar');
  const [yieldAmount, setYieldAmount] = useState(10);
  const [currentCity, setCurrentCity] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`);
        setCurrentCity(res.data.address.city || res.data.address.district || res.data.address.town);
      } catch (e) {
        console.error("Geo error", e);
      }
    });
  }, []);

  const totalValue = (price) => {
    const val = parseFloat(price) * yieldAmount;
    if (val > 100000) return `₹${(val / 100000).toFixed(2)} L`;
    return `₹${val.toLocaleString()}`;
  };

  const formatPrice = (price) => {
      const p = parseFloat(price);
      return p % 1 === 0 ? p.toLocaleString() : p.toFixed(2);
  };

  return (
    <div className="price-hub-page">
      <div className="hub-hero">
        <div className="back-nav">
           <button className="back-btn-premium" onClick={() => navigate('/services')}>
             <span className="arrow">←</span> Back to Services Hub
           </button>
        </div>
        <div className="hero_content_premium">
          <span className="sur-title">Real-Time Revenue Advisor</span>
          <h1>Smart Price <span>Comparison Hub</span></h1>
          <p>The state-wide intelligence engine helping farmers maximize every harvest and payout.</p>
        </div>
      </div>

      <div className="hub-container-premium">
        <div className="hub-top-belt">
            <div className="calculator-card-premium">
              <div className="calc-header">
                  <span className="calc-icon">💰</span>
                  <h4>Revenue Estimator</h4>
              </div>
              <div className="calc-body">
                <div className="input-group-modern">
                    <label>YOUR YIELD</label>
                    <div className="input-field-wrap">
                        <input 
                          type="number" 
                          min="0"
                          value={yieldAmount} 
                          onChange={(e) => setYieldAmount(Math.max(0, e.target.value))}
                          placeholder="00"
                        />
                        <span className="unit-label">{activeTab === 'sugar' ? 'Tons' : activeTab === 'milk' ? 'Litres' : 'Quintals'}</span>
                    </div>
                </div>
              </div>
            </div>

            <div className="location-card-premium">
                <div className="loc-header">
                    <span className="loc-icon">🌍</span>
                    <h4>Current Network</h4>
                </div>
                <div className="loc-body">
                    <p className="loc-name">{currentCity || "Detecting Maharashtra..."}</p>
                    <span className="loc-status">Connection Optimized</span>
                </div>
            </div>
        </div>

        <div className="tab-switcher-modern">
          <button className={`tab-btn-modern ${activeTab === 'sugar' ? 'active' : ''}`} onClick={() => setActiveTab('sugar')}>🎋 Sugar Factories</button>
          <button className={`tab-btn-modern ${activeTab === 'milk' ? 'active' : ''}`} onClick={() => setActiveTab('milk')}>🥛 Milk Dairies</button>
          <button className={`tab-btn-modern ${activeTab === 'crops' ? 'active' : ''}`} onClick={() => setActiveTab('crops')}>🚜 Other Crops</button>
        </div>

        <div className="table-stage-premium">
          <table className="premium-modern-table">
            <thead>
              <tr>
                <th>Unit / Mandi Name</th>
                <th>District</th>
                <th>Current Rate</th>
                <th>Total Revenue (Est.)</th>
                <th className="trend-th">7-Day Trend</th>
                <th className="status-th">Platform Status</th>
              </tr>
            </thead>
            <tbody>
              {factoryData[activeTab].map((item, index) => {
                const isBestNearMe = currentCity && item.location.toLowerCase().includes(currentCity.toLowerCase());
                const trendColor = item.trends[6] >= item.trends[0] ? "#4ade80" : "#f87171";
                
                return (
                  <tr key={index} className={`${item.status.includes('Leader') || item.status.includes('Premium') ? 'row-highlight' : ''} ${isBestNearMe ? 'row-nearby' : ''}`}>
                    <td className="cell-unit">
                        <div className="unit-info">
                            <span className="main-name">{item.name}</span>
                            {isBestNearMe && <span className="smart-tag">BEST IN YOUR REGION</span>}
                        </div>
                    </td>
                    <td className="cell-dist">{item.location}</td>
                    <td className="cell-rate">₹{formatPrice(item.price)}</td>
                    <td className="cell-total">{totalValue(item.price)}</td>
                    <td className="cell-trend">
                        <Sparkline data={item.trends} color={trendColor} />
                    </td>
                    <td className="cell-status">
                      <span className={`badge-premium ${item.status.toLowerCase().replace(' ', '-').replace(/[💎🏆]/g, '').trim()}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="hub-footer-premium">
            <div className="footer-tip-modern">
                <span className="tip-icon">✨</span>
                <p>
                    {activeTab === 'sugar' && "Market insight: Sugarcane FRP is currently peaking in Western Maharashtra units."}
                    {activeTab === 'milk' && "Market insight: Buffalo milk premiums are currently 15% higher in the Kolhapur dairy belt."}
                    {activeTab === 'crops' && "Market insight: Onion export demand is driving record high rates in Nashik mandis today."}
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SmartPriceHub;
