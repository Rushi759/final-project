const fs = require('fs');
const path = require('path');

const cssPath = path.join('c:', 'Users', 'rushi', 'OneDrive', 'Documents', 'src', 'Styles', 'Home_page_ui.css');

const premiumStyles = `

/* =========================================================
   PREMIUM UI UPGRADES: COUNTERS, TYPEWRITER, PARALLAX
   ========================================================= */

/* Typewriter Fade Effect */
.dynamic-text {
    transition: all 0.5s ease-in-out;
    display: inline-block;
}

/* Stat Counters Section */
#impact_counters {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 6rem 5%;
    background: transparent;
    gap: 2rem;
    flex-wrap: wrap;
}

.stat_card_premium {
    text-align: center;
    background: rgba(255, 255, 255, 0.02);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.05);
    padding: 3rem;
    border-radius: 2.5rem;
    min-width: 280px;
    flex: 1;
    transition: all 0.3s ease;
}

.stat_card_premium:hover {
    background: rgba(43, 184, 90, 0.05);
    border-color: rgba(43, 184, 90, 0.2);
    transform: translateY(-5px);
}

.stat_number {
    font-size: 4rem;
    font-weight: 900;
    line-height: 1;
    margin-bottom: 0.8rem;
    background: linear-gradient(to bottom, #fff, #2bb85a);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}

.stat_label {
    font-size: 0.9rem;
    font-weight: 800;
    color: rgba(255, 255, 255, 0.5);
    letter-spacing: 2px;
    text-transform: uppercase;
}

/* 3D Tilt Cards */
.tilt-card {
    transition: transform 0.1s ease-out; /* Sharper for 3D feel */
    transform-style: preserve-3d;
    backface-visibility: hidden;
}

.tilt-card .fts_cnts {
    transform: translateZ(50px); /* Lift content in 3D space */
}

.tilt-card .fts_imgs img {
    transform: translateZ(20px);
}

/* Particles Canvas Fix */
canvas {
    filter: blur(1px);
}

@media (max-width: 768px) {
    #impact_counters {
        padding: 3rem 5%;
    }
    .stat_number {
        font-size: 3rem;
    }
}
`;

try {
    let currentCSS = fs.readFileSync(cssPath, 'utf8');
    if (!currentCSS.includes('PREMIUM UI UPGRADES')) {
        currentCSS += premiumStyles;
        fs.writeFileSync(cssPath, currentCSS, 'utf8');
        console.log('Appended all premium homepage styles!');
    } else {
        console.log('Styles already exist.');
    }
} catch (e) {
    console.error('Error:', e);
}
