const fs = require('fs');
const path = require('path');

const cssPath = path.join('c:', 'Users', 'rushi', 'OneDrive', 'Documents', 'src', 'Styles', 'Home_page_ui.css');

const stateWideCSS = `

/* =========================================================
   STATE-WIDE 36 DISTRICT DROPDOWN OPTIMIZATION
   ========================================================= */

.region-switcher {
    max-width: 150px;
    padding-right: 30px !important;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3E%3Cpath fill='white' d='M0 2l4 4 4-4z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
}

.region-switcher select:focus {
    box-shadow: 0 0 15px var(--primary);
}

/* Ensure the ticker items are spaced well for long district names */
.ticker-item {
    min-width: fit-content;
}

.ticker-val {
    color: #4ade80 !important; /* Mint green for price value */
}

[data-theme="light"] .ticker-val {
    color: #166534 !important;
}
`;

try {
    let currentCSS = fs.readFileSync(cssPath, 'utf8');
    if (!currentCSS.includes('STATE-WIDE 36 DISTRICT DROPDOWN OPTIMIZATION')) {
        currentCSS += stateWideCSS;
        fs.writeFileSync(cssPath, currentCSS, 'utf8');
        console.log('Appended state-wide district styles flawlessly!');
    } else {
        console.log('State-wide styles already exist.');
    }
} catch (e) {
    console.error('Error:', e);
}
