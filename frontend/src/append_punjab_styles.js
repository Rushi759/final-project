const fs = require('fs');
const path = require('path');

const cssPath = path.join('c:', 'Users', 'rushi', 'OneDrive', 'Documents', 'src', 'Styles', 'Home_page_ui.css');

const punjabStyles = `

/* =========================================================
   PUNJAB REGIONAL DEMO STYLES
   ========================================================= */

.region-glow {
    background: rgba(219, 255, 0, 0.1);
    border-radius: 8px;
    padding: 0 10px;
}

[data-theme="dark"] .region-glow .ticker-val {
    color: #dbff00;
    text-shadow: 0 0 10px rgba(219, 255, 0, 0.4);
}

#weather_region_badge {
    background: linear-gradient(90deg, #2bb85a, #dbff00);
    color: #0a0f0a;
    font-size: 0.7rem;
    font-weight: 900;
    padding: 4px 12px;
    border-radius: 50px;
    position: absolute;
    top: 15px;
    right: 15px;
    letter-spacing: 1px;
    box-shadow: 0 4px 10px rgba(43, 184, 90, 0.3);
}

#demo_toggle {
    position: absolute;
    bottom: 12px;
    right: 20px;
    font-size: 0.65rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.4);
    cursor: pointer;
    text-decoration: underline;
    transition: 0.3s;
    z-index: 100;
}

#demo_toggle:hover {
    color: var(--primary);
}

[data-theme="light"] #demo_toggle {
    color: rgba(0, 0, 0, 0.4);
}
`;

try {
    let currentCSS = fs.readFileSync(cssPath, 'utf8');
    if (!currentCSS.includes('PUNJAB REGIONAL DEMO STYLES')) {
        currentCSS += punjabStyles;
        fs.writeFileSync(cssPath, currentCSS, 'utf8');
        console.log('Appended Punjab regional styles flawlessly!');
    } else {
        console.log('Styles already exist.');
    }
} catch (e) {
    console.error('Error appending CSS:', e);
}
