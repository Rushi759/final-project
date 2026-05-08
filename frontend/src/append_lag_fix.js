const fs = require('fs');
const path = require('path');

const cssPath = path.join('c:', 'Users', 'rushi', 'OneDrive', 'Documents', 'src', 'Styles', 'Home_page_ui.css');

const lagFixCSS = `

/* =========================================================
   LAAG & STUTTER FIX FOR LIVE PULSE
   ========================================================= */

.ticker-scroll {
    will-change: transform;
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
    perspective: 1000px;
}

.ticker-item {
    /* Ensures items don't jitter during sub-pixel rendering */
    transform: translateZ(0);
}
`;

try {
    let currentCSS = fs.readFileSync(cssPath, 'utf8');
    if (!currentCSS.includes('LAAG & STUTTER FIX')) {
        currentCSS += lagFixCSS;
        fs.writeFileSync(cssPath, currentCSS, 'utf8');
        console.log('Appended anti-lag CSS optimizations!');
    } else {
        console.log('Lag fix styles already exist.');
    }
} catch (e) {
    console.error('Error:', e);
}
