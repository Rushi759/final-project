const fs = require('fs');
const path = require('path');

function replaceStr(filePath, oldStr, newStr) {
    try {
        let text = fs.readFileSync(filePath, 'utf8');
        text = text.replace(oldStr, newStr);
        fs.writeFileSync(filePath, text, 'utf8');
        console.log(`Saved ${path.basename(filePath)} directly to disk!`);
    } catch(e) {
        console.log('Error', e);
    }
}

const basePath = path.join('c:', 'Users', 'rushi', 'OneDrive', 'Documents', 'src', 'Component');

const oldNews = `    const getNews = async() => {
        const res = await axios.get(url);
        setData(res.data);
        console.log(res.data);
    }`;

const newNews = `    const getNews = async() => {
        try {
            const res = await axios.get(url);
            setData(res.data);
            console.log(res.data);
        } catch (error) {
            console.error("News API Error, loading fallback data:", error);
            setData({
                articles: [
                    { title: "AI Predicts Major Crop Yield Increases", description: "Innovations in machine learning are allowing farmers to precisely forecast harvests." },
                    { title: "Sustainable Irrigation Techniques on the Rise", description: "Farms across the world are adopting smart water-saving technologies." },
                    { title: "Organic Fertilizer Market Booms", description: "Demand for chemical-free fertilizers hits a new all-time high." }
                ]
            });
        }
    }`;

replaceStr(path.join(basePath, 'News.js'), oldNews, newNews);

const oldWeather = `      axios.get(url).then((response) => {
        setData(response.data)
      })`;

const newWeather = `      axios.get(url).then((response) => {
        setData(response.data)
      }).catch((error) => {
        console.error("Weather API Error, loading fallback data:", error);
        setData({
            name: "Local Area (Offline)",
            main: { temp: 24, feels_like: 26, humidity: 65, pressure: 1012 },
            weather: [{ main: "Clear" }],
            wind: { speed: 12 }
        });
      })`;

replaceStr(path.join(basePath, 'Weather.js'), oldWeather, newWeather);
