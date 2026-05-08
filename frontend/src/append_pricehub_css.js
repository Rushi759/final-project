const fs = require('fs');
const path = require('path');

const cssPath = path.join('c:', 'Users', 'rushi', 'OneDrive', 'Documents', 'src', 'Styles', 'Home_page_ui.css');

const priceHubCSS = `

/* =========================================================
   SMART PRICE HUB STYLES
   ========================================================= */

.price-hub-page {
    padding-top: 2rem;
    min-height: 100vh;
}

.hub-container {
    max-width: 1200px;
    margin: 3rem auto;
    padding: 0 5%;
}

.tab-switcher {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    background: rgba(255, 255, 255, 0.05);
    padding: 10px;
    border-radius: 50px;
    width: fit-content;
    margin-left: auto;
    margin-right: auto;
    backdrop-filter: blur(10px);
}

.tab-btn {
    padding: 12px 30px;
    border-radius: 50px;
    border: none;
    background: transparent;
    color: rgba(255, 255, 255, 0.6);
    cursor: pointer;
    font-weight: 700;
    transition: 0.3s;
}

.tab-btn.active {
    background: var(--primary);
    color: white;
    box-shadow: 0 10px 20px rgba(43, 184, 90, 0.3);
}

.premium-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 10px;
}

.premium-table th {
    padding: 15px 25px;
    text-align: left;
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.premium-table tr {
    transition: 0.3s;
}

.premium-table td {
    padding: 20px 25px;
    background: rgba(255, 255, 255, 0.03);
    color: white;
}

.premium-table td:first-child { border-radius: 15px 0 0 15px; }
.premium-table td:last-child { border-radius: 0 15px 15px 0; }

.premium-table tr:hover td {
    background: rgba(255, 255, 255, 0.08);
}

.highlight-row td {
    background: rgba(43, 184, 90, 0.1) !important;
}

.factory-name {
    font-weight: 700;
    font-size: 1.1rem;
}

.price-cell {
    color: #4ade80;
    font-weight: 900;
    font-size: 1.2rem;
}

.status-badge {
    padding: 5px 12px;
    border-radius: 50px;
    font-size: 0.7rem;
    font-weight: 800;
    text-transform: uppercase;
}

.status-badge.premium-payout, .status-badge.market-leader {
    background: #dbff00;
    color: black;
}

.status-badge.active { background: rgba(255, 255, 255, 0.1); color: white; }
.status-badge.fast-pay { background: #4ade80; color: black; }

.hub-footer-tips {
    max-width: 1200px;
    margin: 5rem auto;
    padding: 0 5%;
}

.tip-card {
    background: linear-gradient(135deg, rgba(43, 184, 90, 0.2), rgba(255, 255, 255, 0.05));
    padding: 2rem;
    border-radius: 25px;
    border: 1px solid rgba(43, 184, 90, 0.3);
}

[data-theme="light"] .premium-table td { color: var(--text-primary); background: rgba(0, 0, 0, 0.03); }
[data-theme="light"] .tab-btn { color: var(--text-secondary); }
[data-theme="light"] .premium-table th { color: var(--text-secondary); }
`;

try {
    let currentCSS = fs.readFileSync(cssPath, 'utf8');
    if (!currentCSS.includes('SMART PRICE HUB STYLES')) {
        currentCSS += priceHubCSS;
        fs.writeFileSync(cssPath, currentCSS, 'utf8');
        console.log('Appended Smart Price Hub premium styles!');
    } else {
        console.log('Price Hub styles already exist.');
    }
} catch (e) {
    console.error('Error:', e);
}
