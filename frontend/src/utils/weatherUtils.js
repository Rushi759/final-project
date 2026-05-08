import axios from "axios";

export const getWeatherData = async (lat, lon, label = "User Location") => {
  const apiKey = "839fdcea2a3f4c91ec2a32a9bb34f461";
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Weather API Error, loading fallback data:", error);
    return {
      name: label,
      main: { temp: 31, feels_like: 33, humidity: 40, pressure: 1011 },
      weather: [{ main: "Clear" }],
      wind: { speed: 10 }
    };
  }
};
