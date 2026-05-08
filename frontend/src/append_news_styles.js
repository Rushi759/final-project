const fs = require('fs');
const path = require('path');

const cssPath = path.join('c:', 'Users', 'rushi', 'OneDrive', 'Documents', 'src', 'Styles', 'Features.css');

const newStyles = `

/* =========================================================
   DYNAMIC NEWS UI HIGHLIGHTS
   ========================================================= */

#news_feature {
    background: transparent !important;
}

.news_header {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 3rem;
    padding-top: 2rem;
}

#news_feature h2 {
    background: transparent !important;
    color: var(--text-primary) !important;
    font-size: 3.5rem !important;
    font-weight: 800 !important;
    margin: 0 !important;
    text-transform: uppercase;
    letter-spacing: -2px;
}

.live_indicator {
    background: rgba(220, 38, 38, 0.1);
    color: #dc2626;
    font-size: 0.8rem;
    font-weight: 800;
    padding: 6px 16px;
    border-radius: 50px;
    letter-spacing: 1px;
    border: 1px solid rgba(220, 38, 38, 0.2);
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
}

.features_news_card {
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
}

.features_news_card:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2) !important;
    border-color: var(--primary);
}

.card-title {
    background: linear-gradient(135deg, rgba(43, 184, 90, 0.1), rgba(219, 255, 0, 0.1)) !important;
    color: var(--text-primary) !important;
    font-weight: 800 !important;
    font-size: 1.1rem !important;
    border-bottom: 2px solid var(--primary);
}

.card-body {
    background: transparent !important;
    color: rgba(255, 255, 255, 0.7) !important;
    font-size: 0.95rem !important;
    line-height: 1.6 !important;
    padding: 1.5rem !important;
}

[data-theme="light"] .card-body {
    color: rgba(0, 0, 0, 0.7) !important;
}

.skeleton-container {
    display: flex;
    gap: 2rem;
}

.skeleton-card {
    width: 25rem;
    height: 300px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 1rem;
    animation: loading 1.5s infinite;
}

@keyframes loading {
    0% { opacity: 0.3; }
    50% { opacity: 0.6; }
    100% { opacity: 0.3; }
}
`;

try {
    let currentCSS = fs.readFileSync(cssPath, 'utf8');
    if (!currentCSS.includes('DYNAMIC NEWS UI HIGHLIGHTS')) {
        currentCSS += newStyles;
        fs.writeFileSync(cssPath, currentCSS, 'utf8');
        console.log('Appended dynamic news styles flawlessly!');
    } else {
        console.log('Styles already exist.');
    }
} catch (e) {
    console.error('Error:', e);
}
