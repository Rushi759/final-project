const fs = require('fs');
const path = require('path');

const cssPath = path.join('c:', 'Users', 'rushi', 'OneDrive', 'Documents', 'src', 'Styles', 'Home_page_ui.css');

try {
    let content = fs.readFileSync(cssPath, 'utf8');
    
    // Replace Punjab references with Maharashtra
    content = content.replace(/PUNJAB REGIONAL DEMO STYLES/g, 'MAHARASHTRA REGIONAL DEMO STYLES');
    content = content.replace(/PUNJAB/g, 'MAHARASHTRA');

    fs.writeFileSync(cssPath, content, 'utf8');
    console.log('Updated CSS labels to Maharashtra successfully!');
} catch (e) {
    console.error('Error updating CSS:', e);
}
