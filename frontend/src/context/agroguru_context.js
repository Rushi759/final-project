import React, { createContext, useState, useEffect, useCallback } from 'react'
import { getCurrentLocation, reverseGeocode, DEFAULT_LOCATION } from '../services/locationService'

export const MainContext = createContext({
    spin: false,
    setSpin: () => {},
    language: 'en',
    setLanguage: () => {},
    weatherData: null,
    setWeatherData: () => {},
    location: { ...DEFAULT_LOCATION, status: 'detecting' },
    setLocation: () => {},
    refreshLocation: () => {},
    MAPS_API_KEY: "YOUR_GOOGLE_MAPS_API_KEY" // Placeholder for user 
});

export const ContextProvider = ({ children }) => {
    const [spin, setSpin] = useState(false);
    const [weatherData, setWeatherData] = useState(null);
    const [location, setLocation] = useState({ 
        ...DEFAULT_LOCATION,
        status: 'detecting'
    });
    const MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY"; // Take API Key here

    const [language, setLanguage] = useState(() => {
        try {
            return localStorage.getItem('agroguru_lang') || 'en';
        } catch {
            return 'en';
        }
    });

    // --- LIVE LOCATION DETECTION ---
    const detectLocation = useCallback(async () => {
        setLocation(prev => ({ ...prev, status: 'detecting' }));

        try {
            // 1. Get GPS coordinates
            const coords = await getCurrentLocation();
            
            // 2. Reverse geocode to get district/address
            const geo = await reverseGeocode(coords.lat, coords.lon);

            setLocation({
                lat: coords.lat,
                lon: coords.lon,
                city: geo.district || geo.city,
                district: geo.district,
                village: geo.village,
                state: geo.state,
                fullAddress: geo.fullAddress,
                status: 'live'
            });

            console.log(`📍 Live Location: ${geo.fullAddress} (${coords.lat}, ${coords.lon})`);

        } catch (err) {
            console.error("Geolocation error:", err);
            // Fallback to Kolhapur defaults
            setLocation({
                ...DEFAULT_LOCATION,
                status: 'fallback'
            });
        }
    }, []);

    // Detect location on app start
    useEffect(() => {
        detectLocation();
    }, [detectLocation]);

    // Manual refresh function exposed via context
    const refreshLocation = useCallback(() => {
        detectLocation();
    }, [detectLocation]);

    useEffect(() => {
        try {
            localStorage.setItem('agroguru_lang', language);
        } catch (e) {
            console.error("Storage permission denied:", e);
        }
    }, [language]);

    const contextValue = {
        spin, setSpin,
        weatherData, setWeatherData,
        location, setLocation,
        refreshLocation,
        language, setLanguage,
        MAPS_API_KEY
    };

    return(
        <MainContext.Provider value={contextValue}>
            {children}
        </MainContext.Provider>
    );
}

export default ContextProvider;