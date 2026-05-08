const fs = require('fs');
const path = require('path');

const cssPath = path.join('c:', 'Styles', 'Home_page_ui.css');
// Wait, the path might be in src/Styles
const altCssPath = path.join('c:', 'Users', 'rushi', 'OneDrive', 'Documents', 'src', 'Styles', 'Home_page_ui.css');

const smartTickerCSS = `

/* =========================================================
   SMART LOCATION SWITCHER STYLES
   ========================================================= */

.ticker-header-wrap {
    display: flex;
    align-items: center;
    background: var(--primary);
    height: 100%;
    z-index: 20;
    box-shadow: 10px 0 30px rgba(0,0,0,0.3);
}

.region-switcher {
    background: rgba(10, 15, 10, 0.2);
    color: white;
    border: none;
    padding: 0 15px;
    height: 100%;
    font-size: 0.8rem;
    font-weight: 800;
    cursor: pointer;
    outline: none;
    transition: 0.3s;
    appearance: none; /* Hide default arrow */
    text-align: center;
    border-left: 1px solid rgba(255,255,255,0.1);
}

.region-switcher:hover {
    background: rgba(10, 15, 10, 0.4);
    color: #dbff00;
}

.region-switcher option {
    background: #0a0f0a;
    color: white;
}

.loading-pulse {
    animation: opacityPulse 1.5s infinite ease-in-out;
}

@keyframes opacityPulse {
    0% { opacity: 0.5; }
    50% { opacity: 1; }
    100% { opacity: 0.5; }
}

#impact_counters {
    scroll-margin-top: 100px;
}
`;

try {
    let currentCSS = fs.readFileSync(altCssPath, 'utf8');
    if (!currentCSS.includes('SMART LOCATION SWITCHER STYLES')) {
        currentCSS += smartTickerCSS;
        fs.writeFileSync(altCssPath, currentCSS, 'utf8');
        console.log('Appended smart location switcher styles!');
    } else {
        console.log('Smart switcher styles already exist.');
    }
} catch (e) {
    console.error('Error:', e);
}
