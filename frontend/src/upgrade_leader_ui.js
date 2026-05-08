const fs = require('fs');
const path = require('path');

const cssPath = path.join('c:', 'Users', 'rushi', 'OneDrive', 'Documents', 'src', 'Styles', 'Home_page_ui.css');

const marketLeaderUI = `

/* =========================================================
   MARKET LEADER & PREMIUM BADGE UPGRADE
   ========================================================= */

.status-badge.market-leader {
    background: linear-gradient(135deg, #ffd700, #ffa500);
    color: #000;
    font-weight: 900;
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.4);
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.3);
}

.status-badge.market-leader::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    transform: rotate(45deg);
    animation: shimmer-badge 3s infinite linear;
}

.status-badge.premium-payout, .status-badge.premium {
    background: linear-gradient(135deg, #4ade80, #22c55e);
    color: #000;
    font-weight: 900;
    box-shadow: 0 0 15px rgba(74, 222, 128, 0.4);
}

@keyframes shimmer-badge {
    0% { transform: translateX(-150%) rotate(45deg); }
    100% { transform: translateX(150%) rotate(45deg); }
}

.highlight-row {
    background: rgba(255, 215, 0, 0.05) !important;
    border-left: 4px solid #ffd700;
}
`;

try {
    let currentCSS = fs.readFileSync(cssPath, 'utf8');
    if (!currentCSS.includes('MARKET LEADER & PREMIUM BADGE')) {
        currentCSS += marketLeaderUI;
        fs.writeFileSync(cssPath, currentCSS, 'utf8');
        console.log('Upgraded Market Leader UI!');
    } else {
        // If it exists, replace it to ensure new styles apply
        console.log('Updating existing Leader styles...');
        // (Simple append for now to be safe)
        currentCSS += marketLeaderUI;
        fs.writeFileSync(cssPath, currentCSS, 'utf8');
    }
} catch (e) {
    console.error('Error:', e);
}
