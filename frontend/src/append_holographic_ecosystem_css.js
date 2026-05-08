const fs = require('fs');
const path = require('path');

const cssPath = path.join('c:', 'Users', 'rushi', 'OneDrive', 'Documents', 'src', 'Styles', 'Home_page_ui.css');

const holographicEcosystemCSS = `

/* =========================================================
   HOLOGRAPHIC ECOSYSTEM GRID: REDESIGNED VISION PILLARS
   ========================================================= */

#vision_ecosystem_grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 3rem;
    padding: 0 5% 6rem;
    margin-top: -80px; /* Overlap hero for depth */
    position: relative;
    z-index: 10;
}

.eco_card {
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(60px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 3rem 2rem;
    border-radius: 40px;
    position: relative;
    overflow: hidden;
    transition: transform 0.1s ease-out, box-shadow 0.3s ease;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    min-height: 380px;
    box-shadow: 0 30px 60px rgba(0,0,0,0.5);
}

.eco_card:hover {
    border-color: rgba(43, 184, 90, 0.5);
    box-shadow: 0 50px 100px rgba(0,0,0,0.8), 0 0 30px rgba(43, 184, 90, 0.2);
}

.card-glow {
    position: absolute;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(43, 184, 90, 0.15) 0%, transparent 70%);
    pointer-events: none;
    transform: translate(-50%, -50%);
    opacity: 0;
    transition: opacity 0.5s ease;
}

.eco_index {
    position: absolute;
    top: -20px;
    right: -20px;
    font-size: 15rem;
    font-weight: 900;
    color: rgba(255, 255, 255, 0.03);
    line-height: 1;
    pointer-events: none;
    z-index: 0;
}

.eco_content {
    position: relative;
    z-index: 2;
}

.eco_icon {
    font-size: 3.5rem;
    margin-bottom: 2rem;
    filter: drop-shadow(0 0 15px rgba(255,255,255,0.2));
}

.eco_card h5 {
    font-size: 2rem;
    font-weight: 900;
    color: white;
    margin-bottom: 1rem;
    letter-spacing: -1px;
}

.eco_card p {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.5);
    line-height: 1.6;
    margin-bottom: 2rem;
}

.eco_link {
    font-size: 0.85rem;
    color: var(--primary);
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 2px;
    transition: 0.3s;
}

.eco_card:hover .eco_link {
    letter-spacing: 4px;
    color: #dbff00;
}

@media (max-width: 1100px) {
    #vision_ecosystem_grid { grid-template-columns: 1fr; gap: 2rem; margin-top: 2rem; }
    .eco_card { min-height: 300px; }
}

[data-theme="light"] .eco_card {
    background: rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.1);
}

[data-theme="light"] .eco_card h5, [data-theme="light"] .eco_card p {
    color: var(--text-primary);
}

[data-theme="light"] .eco_index {
    color: rgba(0, 0, 0, 0.05);
}
`;

try {
    let currentCSS = fs.readFileSync(cssPath, 'utf8');
    // Remove old vision pillars styling if possible, or just override
    if (!currentCSS.includes('HOLOGRAPHIC ECOSYSTEM GRID')) {
        currentCSS += holographicEcosystemCSS;
        fs.writeFileSync(cssPath, currentCSS, 'utf8');
        console.log('Appended holographic ecosystem styles!');
    } else {
        console.log('Ecosystem styles already exist.');
        currentCSS += holographicEcosystemCSS; // Append anyway to ensure override
        fs.writeFileSync(cssPath, currentCSS, 'utf8');
    }
} catch (e) {
    console.error('Error:', e);
}
