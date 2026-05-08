const fs = require('fs');
const path = require('path');

const cssPath = path.join('c:', 'Users', 'rushi', 'OneDrive', 'Documents', 'src', 'Styles', 'Home_page_ui.css');

const advancedTickerCSS = `

/* =========================================================
   ADVANCED INTERACTIVE TICKER FEATURES
   ========================================================= */

.ticker-wrapper:hover .ticker-scroll {
    animation-play-state: paused;
    cursor: pointer;
}

.ticker-icon {
    margin-right: 12px;
    font-size: 1.1rem;
    filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.3));
}

.ticker-alert-flash {
    background: rgba(220, 38, 38, 0.15) !important;
    animation: alert-flash 1s infinite alternate;
    border-radius: 8px;
    padding: 0 15px;
}

@keyframes alert-flash {
    from { background: rgba(220, 38, 38, 0.15); box-shadow: none; }
    to { background: rgba(220, 38, 38, 0.4); box-shadow: 0 0 15px rgba(220, 38, 38, 0.5); }
}

.ticker-alert-flash .ticker-name, 
.ticker-alert-flash .ticker-val {
    color: #ffcfcf !important;
    font-weight: 900 !important;
}

.ticker-item[class*="clock"] .ticker-val {
    font-family: 'Courier New', Courier, monospace;
    letter-spacing: 1px;
    color: var(--primary) !important;
}
`;

try {
    let currentCSS = fs.readFileSync(cssPath, 'utf8');
    if (!currentCSS.includes('ADVANCED INTERACTIVE TICKER FEATURES')) {
        currentCSS += advancedTickerCSS;
        fs.writeFileSync(cssPath, currentCSS, 'utf8');
        console.log('Appended advanced ticker animations flawlessly!');
    } else {
        console.log('Advanced styles already exist.');
    }
} catch (e) {
    console.error('Error:', e);
}
