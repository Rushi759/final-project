import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../Styles/Home_page_ui.css';

const PageTransition = ({ children }) => {
  const [isPulsing, setIsPulsing] = useState(false);
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setIsPulsing(true);
      
      // Synthesis Sequence (500ms total)
      const timer = setTimeout(() => {
        setDisplayLocation(location);
        setIsPulsing(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [location, displayLocation]);

  return (
    <div style={{ position: 'relative' }}>
      {/* Cinematic 'Neural Gateway' 2.0 Overlay */}
      {isPulsing && (
        <div className="neural-gateway-overlay fade-in">
          <div className="gateway-core">
            {/* SVG Data Rings */}
            <svg className="gateway-rings" viewBox="0 0 200 200">
               <circle className="ring-inner" cx="100" cy="100" r="40" fill="none" stroke="#3b82f6" strokeWidth="1" />
               <circle className="ring-middle" cx="100" cy="100" r="60" fill="none" stroke="#60a5fa" strokeWidth="0.5" strokeDasharray="10 20" />
               <circle className="ring-outer" cx="100" cy="100" r="85" fill="none" stroke="#3b82f6" strokeWidth="0.2" strokeDasharray="20 40" />
            </svg>
            
            <div className="logo-synthesis">
                <span className="synth-logo">🌱</span>
                <div className="synth-glow"></div>
            </div>
            
            <div className="gateway-labels">
                <span className="label-top">NEURAL SYNC ACTIVE</span>
                <h2 className="label-main">AGROGURU <span>LIVE</span></h2>
                <div className="loading-line-modern"><div className="line-fill"></div></div>
            </div>
          </div>
          
          {/* Backdrop Lens Flare */}
          <div className="gateway-lens-flare"></div>
        </div>
      )}
      
      {/* Main Content Render */}
      <div className={isPulsing ? 'blur-content-gateway' : 'fade-in-content'}>
        {children}
      </div>
    </div>
  );
};

export default PageTransition;
