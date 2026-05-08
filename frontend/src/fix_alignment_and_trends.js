const fs = require('fs');
const path = require('path');

const cssPath = path.join('c:', 'Users', 'rushi', 'OneDrive', 'Documents', 'src', 'Styles', 'Home_page_ui.css');

const alignmentFixCSS = `

/* =========================================================
   UI REFINEMENT: ALIGNMENT & TREND POLISH
   ========================================================= */

.status-badge {
    white-space: nowrap; /* Prevents text from breaking into two lines */
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 140px; /* Ensures enough space for "MARKET LEADER" */
    padding: 8px 16px;
    font-size: 0.75rem;
    text-align: center;
}

.trend-column {
    padding: 10px 20px !important;
    text-align: center;
    width: 120px;
}

.status-column {
    width: 180px;
    text-align: right !important;
}

.sparkline-svg {
    filter: drop-shadow(0 0 8px rgba(74, 222, 128, 0.4));
    transition: 0.3s ease;
}

.premium-table tr:hover .sparkline-svg {
    transform: scale(1.1);
    filter: drop-shadow(0 0 12px rgba(74, 222, 128, 0.6));
}

.payout-cell {
    font-family: 'Inter', sans-serif;
    letter-spacing: -0.5px;
}
`;

try {
    let currentCSS = fs.readFileSync(cssPath, 'utf8');
    if (!currentCSS.includes('UI REFINEMENT: ALIGNMENT & TREND POLISH')) {
        currentCSS += alignmentFixCSS;
        fs.writeFileSync(cssPath, currentCSS, 'utf8');
        console.log('Applied alignment and trend visual polish!');
    } else {
        console.log('Alignment fix already exists.');
    }
} catch (e) {
    console.error('Error:', e);
}
