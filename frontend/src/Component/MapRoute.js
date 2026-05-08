import React, { useEffect, useState, useContext } from 'react';
import { MapContainer, TileLayer, Marker, useMap, Popup } from 'react-leaflet';
import L, { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import { useParams } from 'react-router-dom';
import { MainContext } from '../context/agroguru_context';

// Fixing Leaflet default icon issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const TRANSLATIONS = {
  en: { start: "Your Location", end: "Destination", route: "Calculating Route..." },
  mr: { start: "तुमचे स्थान", end: "मुक्काम", route: "मार्ग शोधत आहे..." }
}

const RoutingMachine = ({ start, end }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !start || !end) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(start[0], start[1]),
        L.latLng(end[0], end[1])
      ],
      lineOptions: {
        styles: [{ color: '#3b82f6', weight: 6, opacity: 0.8 }]
      },
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      show: false, // Hide the textual instructions to keep UI clean
    }).addTo(map);

    return () => map.removeControl(routingControl);
  }, [map, start, end]);

  return null;
};

const RouteMap = () => {
  const { language, location } = useContext(MainContext);
  const t = TRANSLATIONS[language || 'en'];
  const { ltd, lgt } = useParams();

  const [startPos, setStartPos] = useState(null);
  const [endPos] = useState([parseFloat(ltd), parseFloat(lgt)]);

  useEffect(() => {
    if (location.lat && location.lon) {
      setStartPos([location.lat, location.lon]);
    } else {
      navigator.geolocation.getCurrentPosition(
        (pos) => setStartPos([pos.coords.latitude, pos.coords.longitude]),
        () => setStartPos([18.5204, 73.8567]) // Default fallback
      );
    }
  }, [location]);

  return (
    <div style={{ width: '100%', height: '100vh', background: '#020617' }}>
      {/* HUD Overlay */}
      <div style={{ 
          position: 'absolute', top: '25px', left: '50%', transform: 'translateX(-50%)', 
          zIndex: 1000, background: 'rgba(15, 23, 42, 0.95)', padding: '15px 30px', 
          borderRadius: '50px', color: '#fff', border: '1px solid rgba(59,130,246,0.3)',
          backdropFilter: 'blur(15px)', display: 'flex', alignItems: 'center', gap: '15px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)', pointerEvents: 'none'
      }}>
          <div className="pulse-container">
             <div className="pulse-dot"></div>
          </div>
          <span style={{ fontWeight: '900', letterSpacing: '1px', fontSize: '0.8rem' }}>LIVE NAVIGATION ENGINE ACTIVE</span>
      </div>

      <MapContainer 
        center={startPos || [18.5204, 73.8567]} 
        zoom={13} 
        style={{ width: '100%', height: '100%' }}
      >
        {/* Using a Sleek Dark Tile Layer for Premium Look */}
        <TileLayer 
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" 
          attribution='&copy; OpenStreetMap &copy; CARTO'
        />

        {startPos && (
          <>
            <Marker position={startPos}>
              <Popup>{t.start}</Popup>
            </Marker>
            <Marker position={endPos}>
              <Popup>{t.end}</Popup>
            </Marker>
            <RoutingMachine start={startPos} end={endPos} />
          </>
        )}
      </MapContainer>

      <style>{`
        .pulse-container { width: 12px; height: 12px; border-radius: 50%; background: rgba(59,130,246,0.2); display: flex; align-items: center; justify-content: center; }
        .pulse-dot { width: 6px; height: 6px; background: #3b82f6; border-radius: 50%; animation: navPulse 1.5s infinite; }
        @keyframes navPulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(2); opacity: 0.5; } 100% { transform: scale(1); opacity: 1; } }
        
        .leaflet-routing-container { display: none !important; } /* Clean presentation */
        .leaflet-bar a { background: #1e293b !important; color: #fff !important; border-bottom: 1px solid #334155 !important; }
      `}</style>
    </div>
  );
};

export default RouteMap;
