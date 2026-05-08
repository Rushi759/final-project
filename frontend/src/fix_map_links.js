const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, oldStr, newStr) {
    try {
        let text = fs.readFileSync(filePath, 'utf8');
        text = text.replace(oldStr, newStr);
        fs.writeFileSync(filePath, text, 'utf8');
        console.log(`Updated ${path.basename(filePath)} directly on disk!`);
    } catch (e) {
        console.error(`Error with ${path.basename(filePath)}:`, e.message);
    }
}

const basePath = path.join('c:', 'Users', 'rushi', 'OneDrive', 'Documents', 'src', 'Pages', 'Main_Pages');

// 1. Update Nursery.js
replaceInFile(
    path.join(basePath, 'Nursery.js'),
    '<Link to={`/map/${it.geometry?.coordinates[1]}/${it.geometry?.coordinates[0]}`} id="nur_map">📍 View Map</Link>',
    '<a href={`https://www.google.com/maps/dir/?api=1&destination=${it.geometry?.coordinates[1]},${it.geometry?.coordinates[0]}`} target="_blank" rel="noopener noreferrer" id="nur_map" style={{ textDecoration: \'none\' }}>📍 View Map</a>'
);

// 2. Update Market.js
replaceInFile(
    path.join(basePath, 'Market.js'),
    '<Link to={`/map/${it.geometry?.coordinates[1]}/${it.geometry?.coordinates[0]}`} id="nur_map">View Map</Link>',
    '<a href={`https://www.google.com/maps/dir/?api=1&destination=${it.geometry?.coordinates[1]},${it.geometry?.coordinates[0]}`} target="_blank" rel="noopener noreferrer" id="nur_map" style={{ textDecoration: \'none\' }}>📍 View Map</a>'
);

// 3. Update Laboratory.js
replaceInFile(
    path.join(basePath, 'Laboratory.js'),
    '<Link to={`/map/${it.geometry?.coordinates[1]}/${it.geometry?.coordinates[0]}`} id="nur_map">🧬 View Results</Link>',
    '<a href={`https://www.google.com/maps/dir/?api=1&destination=${it.geometry?.coordinates[1]},${it.geometry?.coordinates[0]}`} target="_blank" rel="noopener noreferrer" id="nur_map" style={{ textDecoration: \'none\' }}>📍 View Map</a>'
);
