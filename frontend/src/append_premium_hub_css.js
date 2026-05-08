const fs = require('fs');
const path = require('path');

const cssPath = path.join('c:', 'Users', 'rushi', 'OneDrive', 'Documents', 'src', 'Styles', 'Home_page_ui.css');

const premiumHubCSS = `

/* =========================================================
   PREMIUM TECH UPGRADE: SMART PRICE HUB
   ========================================================= */

.price-hub-page {
    background: transparent;
    color: white;
    padding-bottom: 5rem;
}

.hub-hero {
    padding: 6rem 5% 4rem;
    background: linear-gradient(180deg, rgba(43, 184, 90, 0.1), transparent);
    text-align: center;
    position: relative;
}

.back-nav {
    position: absolute;
    top: 2rem;
    left: 5%;
}

.hero_content_premium .sur-title {
    display: block;
    color: var(--primary);
    text-transform: uppercase;
    letter-spacing: 4px;
    font-size: 0.8rem;
    font-weight: 800;
    margin-bottom: 1rem;
}

.hero_content_premium h1 {
    font-size: 3.5rem;
    margin-bottom: 1rem;
    text-shadow: 0 10px 30px rgba(0,0,0,0.5);
}

.hub-container-premium {
    max-width: 1300px;
    margin: 0 auto;
    padding: 0 5%;
}

.hub-top-belt {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin-bottom: 3rem;
}

.calculator-card-premium, .location-card-premium {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 2rem;
    border-radius: 30px;
    transition: 0.3s;
}

.calculator-card-premium:hover, .location-card-premium:hover {
    border-color: var(--primary);
    box-shadow: 0 20px 40px rgba(43, 184, 90, 0.1);
}

.calc-header, .loc-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 1.5rem;
}

.calc-icon, .loc-icon { font-size: 1.5rem; }
.calc-header h4, .loc-header h4 { font-size: 0.8rem; text-transform: uppercase; opacity: 0.6; letter-spacing: 1px; }

.input-field-wrap {
    display: flex;
    align-items: baseline;
    gap: 15px;
    margin-top: 10px;
}

.input-field-wrap input {
    background: transparent;
    border: none;
    border-bottom: 3px solid var(--primary);
    color: white;
    font-size: 2.5rem;
    font-weight: 900;
    width: 140px;
    outline: none;
}

.unit-label { font-size: 1.2rem; font-weight: 700; opacity: 0.5; }

.loc-name { font-size: 1.8rem; font-weight: 900; color: white; margin: 5px 0; }
.loc-status { font-size: 0.8rem; color: var(--primary); font-weight: 700; text-transform: uppercase; }

.tab-switcher-modern {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.tab-btn-modern {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.6);
    padding: 15px 35px;
    border-radius: 50px;
    font-weight: 700;
    cursor: pointer;
    transition: 0.3s;
}

.tab-btn-modern.active {
    background: var(--primary);
    color: white;
    box-shadow: 0 15px 30px rgba(43, 184, 90, 0.3);
}

.table-stage-premium {
    background: rgba(255, 255, 255, 0.02);
    border-radius: 40px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    overflow: hidden;
}

.premium-modern-table {
    width: 100%;
    border-collapse: collapse;
}

.premium-modern-table th {
    padding: 25px;
    text-align: left;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 2px;
    opacity: 0.5;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.premium-modern-table tr {
    transition: 0.3s;
}

.premium-modern-table tr:hover {
    background: rgba(255, 255, 255, 0.03);
}

.premium-modern-table td {
    padding: 25px;
    vertical-align: middle;
}

.main-name { display: block; font-size: 1.1rem; font-weight: 800; margin-bottom: 5px; }
.smart-tag { font-size: 0.6rem; color: #dbff00; font-weight: 900; letter-spacing: 1px; }

.cell-rate { font-size: 1.3rem; font-weight: 800; color: white; }
.cell-total { font-size: 1.4rem; font-weight: 900; color: #4ade80; }

.sparkline-container {
    width: 100px;
    height: 40px;
}

.badge-premium {
    padding: 10px 20px;
    border-radius: 50px;
    font-size: 0.75rem;
    font-weight: 800;
    text-transform: uppercase;
    display: inline-block;
}

.badge-premium.market-leader {
    background: linear-gradient(135deg, #ffd700, #ffa500);
    color: black;
    box-shadow: 0 10px 20px rgba(255, 215, 0, 0.2);
}

.badge-premium.active { background: rgba(255, 255, 255, 0.1); color: white; }
.badge-premium.premium { background: linear-gradient(135deg, #4ade80, #22c55e); color: black; }

.row-highlight td { background: rgba(255, 215, 0, 0.03); }
.row-highlight { border-left: 4px solid #ffd700; }

.footer-tip-modern {
    margin-top: 4rem;
    display: flex;
    align-items: center;
    gap: 15px;
    background: rgba(43, 184, 90, 0.05);
    padding: 1.5rem 2rem;
    border-radius: 20px;
    border-left: 5px solid var(--primary);
}

.tip-icon { font-size: 1.5rem; }

@media (max-width: 900px) {
    .hub-top-belt { grid-template-columns: 1fr; }
    .hero_content_premium h1 { font-size: 2.2rem; }
}
`;

try {
    let currentCSS = fs.readFileSync(cssPath, 'utf8');
    if (!currentCSS.includes('PREMIUM TECH UPGRADE: SMART PRICE HUB')) {
        currentCSS += premiumHubCSS;
        fs.writeFileSync(cssPath, currentCSS, 'utf8');
        console.log('Appended final premium hub overhaul styles!');
    } else {
        console.log('Updating hub styles...');
        currentCSS += premiumHubCSS;
        fs.writeFileSync(cssPath, currentCSS, 'utf8');
    }
} catch (e) {
    console.error('Error:', e);
}
