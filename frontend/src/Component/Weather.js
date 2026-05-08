import { useEffect, useContext } from "react";
import { MainContext } from "../context/agroguru_context";
import { getWeatherData } from "../utils/weatherUtils";
import Lottie from '../Component/Lottie'
import weather from '../static/weather-lottie.json'
import "../Styles/Info_page_ui.css"

const TRANSLATIONS = {
  en: {
    demo_focus: "📍 SGU CAMPUS CLIMATE",
    local_gps: "🌐 ATIGRE REGIONAL HUB",
    loading: "Calibrating SGU Hub...",
    fetching: "Syncing...",
    feels_like: "Feels Like",
    humidity: "Humidity",
    wind_speed: "Wind Speed",
    pressure: "Pressure",
    to_local: "Switch to Local GPS",
    to_demo: "Switch to SGU View",
    toggle_title: "Toggle SGU Hub vs My Location"
  },
  mr: {
    demo_focus: "📍 SGU कॅम्पस हवामान",
    local_gps: "🌐 अतिग्रे प्रादेशिक हब",
    loading: "कॅलिब्रेट करत आहे...",
    fetching: "सिंक करत आहे...",
    feels_like: "जाणवणारे तापमान",
    humidity: "आर्द्रता",
    wind_speed: "वाऱ्याचा वेग",
    pressure: "हवेचा दाब",
    to_local: "स्थानिक GPS वर जा",
    to_demo: "SGU व्ह्यूवर जा",
    toggle_title: "SGU हब आणि माझे लोकेशन दरम्यान बदला"
  }
}

function Weather() {
  const { weatherData, setWeatherData, location, language } = useContext(MainContext);
  const t = TRANSLATIONS[language || 'en'];

  const fetchWeather = async (lat, lon, label) => {
    const data = await getWeatherData(lat, lon, label);
    setWeatherData(data);
  };

  useEffect(() => {
    if (location.lat && location.lon) {
        fetchWeather(location.lat, location.lon, location.city);
    } else if (location.status === 'fallback') {
        const sgu_lat = 16.7725;
        const sgu_lon = 74.3721;
        fetchWeather(sgu_lat, sgu_lon, 'Atigre Campus');
    }
  }, [location.lat, location.lon, location.status, location.city]);

  const data = weatherData || {};

  return (
    <div id="weather_widget">
      {/* Region Hub labels removed per user request for a cleaner look */}
      <div id="weather_cont">
        <div id="weather_loc">
          <span className="city">
            {location.status === 'fallback' 
              ? `${data.name || location.city} (Enable GPS)` 
              : (data.name || location.city || "Detecting Location...")}
          </span>
          <div className="temp">{data.main?.temp != null ? <h1>{data.main.temp.toFixed()} &deg;</h1> : <h1>-- &deg;</h1>}</div>
          <span className="nature">{data.weather?.[0]?.main || t.fetching}</span>
        </div>
        <div className='weather-lottie'>
          <Lottie data={weather} height={`13rem`} width={`13rem`} style={{ "position": "relative" }} />
        </div>
      </div>
      <div id="weather_para">
        <ul>
          <li>{t.feels_like} <br />{data.main?.feels_like != null ? <span className="bold">{data.main.feels_like.toFixed()} &deg;C</span> : <span className="bold">-- &deg;C</span>}</li>
          <li>{t.humidity} <br /> {data.main?.humidity != null ? <span className="bold">{data.main.humidity.toFixed()}%</span> : <span className="bold">--%</span>}</li>
          <li>{t.wind_speed} <br />{data.wind?.speed != null ? <span className="bold">{data.wind.speed.toFixed()} km/h</span> : <span className="bold">-- km/h</span>}</li>
          <li>{t.pressure} <br />{data.main?.pressure != null ? <span className="bold">{data.main.pressure.toFixed()} hPa</span> : <span className="bold">-- hPa</span>}</li>
        </ul>
      </div>
    </div>
  );
}

export default Weather;
