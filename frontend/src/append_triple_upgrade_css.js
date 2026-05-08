const fs = require('fs');
const path = require('path');

const cssPath = path.join('c:', 'Users', 'rushi', 'OneDrive', 'Documents', 'src', 'Styles', 'Home_page_ui.css');

const tripleUpgradeCSS = `

/* =========================================================
   TRIPLE FINTECH UPGRADE: CALCULATOR, TRENDS, SMART BADGE
   ========================================================= */

.calculator-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(43, 184, 90, 0.1);
    border: 1px solid rgba(43, 184, 90, 0.3);
    padding: 1.5rem 2rem;
    border-radius: 20px;
    margin-bottom: 2rem;
    backdrop-filter: blur(20px);
}

.calc-input-wrap {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.calc-input-wrap label {
    font-size: 0.8rem;
    font-weight: 800;
    color: var(--primary);
    letter-spacing: 1px;
}

.calc-input-wrap input {
    background: rgba(255, 255, 255, 0.05);
    border: 2px solid rgba(255, 255, 255, 0.1);
    padding: 10px 15px;
    border-radius: 12px;
    color: white;
    font-weight: 800;
    font-size: 1.1rem;
    width: 100px;
    outline: none;
    transition: 0.3s;
}

.calc-input-wrap input:focus {
    border-color: var(--primary);
    box-shadow: 0 0 15px rgba(43, 184, 90, 0.4);
}

.calc-unit {
    font-weight: 700;
    opacity: 0.7;
}

.hub-context-badge {
    background: rgba(255, 255, 255, 0.05);
    padding: 8px 15px;
    border-radius: 50px;
    font-size: 0.85rem;
    font-weight: 600;
}

.payout-cell {
    font-weight: 900;
    color: #dbff00;
    font-size: 1.1rem;
}

.sparkline {
    filter: drop-shadow(0 0 5px rgba(74, 222, 128, 0.5));
}

.smart-badge-pulse {
    display: block;
    font-size: 0.6rem;
    color: #dbff00;
    font-weight: 900;
    margin-top: 5px;
    letter-spacing: 1px;
    animation: badgePulse 2s infinite;
}

@keyframes badgePulse {
    0% { opacity: 0.4; }
    50% { opacity: 1; }
    100% { opacity: 0.4; }
}

.best-near-me td {
    border-top: 2px solid rgba(219, 255, 0, 0.3);
    border-bottom: 2px solid rgba(219, 255, 0, 0.3);
}

[data-theme="light"] .calc-input-wrap input { color: var(--text-primary); background: rgba(0,0,0,0.05); }
`;

try {
    let currentCSS = fs.readFileSync(cssPath, 'utf8');
    if (!currentCSS.includes('TRIPLE FINTECH UPGRADE')) {
        currentCSS += tripleUpgradeCSS;
        fs.writeFileSync(cssPath, currentCSS, 'utf8');
        console.log('Appended Triple Upgrade styles!');
    } else {
        console.log('Upgrade styles already exist.');
    }
} catch (e) {
    console.error('Error:', e);
}
