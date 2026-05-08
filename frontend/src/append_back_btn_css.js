const fs = require('fs');
const path = require('path');

const cssPath = path.join('c:', 'Users', 'rushi', 'OneDrive', 'Documents', 'src', 'Styles', 'Home_page_ui.css');

const backBtnCSS = `

/* =========================================================
   BACK BUTTON PREMIUM STYLING
   ========================================================= */

.back-btn-premium {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.7);
    padding: 10px 20px;
    border-radius: 50px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    margin-bottom: 2rem;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    backdrop-filter: blur(10px);
}

.back-btn-premium:hover {
    background: rgba(43, 184, 90, 0.2);
    border-color: var(--primary);
    color: white;
    transform: translateX(-5px);
    box-shadow: 0 5px 15px rgba(43, 184, 90, 0.2);
}

[data-theme="light"] .back-btn-premium {
    background: rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.1);
    color: var(--text-secondary);
}
`;

try {
    let currentCSS = fs.readFileSync(cssPath, 'utf8');
    if (!currentCSS.includes('BACK BUTTON PREMIUM STYLING')) {
        currentCSS += backBtnCSS;
        fs.writeFileSync(cssPath, currentCSS, 'utf8');
        console.log('Appended premium back button styles!');
    } else {
        console.log('Back button styles already exist.');
    }
} catch (e) {
    console.error('Error:', e);
}
