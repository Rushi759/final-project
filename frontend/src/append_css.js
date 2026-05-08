const fs = require('fs');
const path = require('path');

const cssPath = path.join('c:', 'Users', 'rushi', 'OneDrive', 'Documents', 'src', 'Styles', 'profile_page_ui.css');

const newCSS = `

/* =========================================================
   MANAGEMENT FORMS PREMIUM UPGRADE
   ========================================================= */

.profile_avail {
    animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.glass-panel-form {
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 32px;
    padding: 3rem;
    margin-top: 2rem;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

[data-theme="light"] .glass-panel-form {
    background: rgba(255, 255, 255, 0.6);
    border: 1px solid rgba(0, 0, 0, 0.05);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
}

.profile_sec_avail_text {
    font-size: 2.2rem !important;
    font-weight: 800;
    margin-bottom: 2.5rem;
    background: linear-gradient(to right, #2bb85a, #dbff00);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    text-align: center;
}

.form-grid-premium {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin-bottom: 2rem;
}

.form-grid-premium.full-width {
    grid-template-columns: 1fr;
}

.premium-input-group {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
}

.premium-input-group label {
    font-size: 0.9rem;
    font-weight: 700;
    color: var(--text-primary);
    text-transform: uppercase;
    letter-spacing: 1px;
}

[data-theme="dark"] .premium-input-group label {
    color: rgba(255, 255, 255, 0.7);
}

.premium-input-group input,
.premium-input-group textarea {
    width: 100%;
    background: rgba(255, 255, 255, 0.05);
    border: 2px solid transparent;
    border-radius: 16px;
    padding: 16px 20px;
    font-size: 1.1rem;
    color: var(--text-primary);
    transition: all 0.3s ease;
}

[data-theme="dark"] .premium-input-group input,
[data-theme="dark"] .premium-input-group textarea {
    background: rgba(0, 0, 0, 0.3);
    color: white;
}

.premium-input-group input:focus,
.premium-input-group textarea:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.1);
    border: 2px solid var(--primary);
    box-shadow: 0 0 15px rgba(43, 184, 90, 0.2);
}

[data-theme="dark"] .premium-input-group input:focus,
[data-theme="dark"] .premium-input-group textarea:focus {
    background: rgba(0, 0, 0, 0.5);
}

.gradient-action-btn {
    background: linear-gradient(135deg, var(--primary), var(--primary-dark));
    color: white;
    border: none;
    border-radius: 16px;
    padding: 16px 32px;
    font-size: 1.2rem;
    font-weight: 800;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 10px 20px rgba(43, 184, 90, 0.3);
    width: 100%;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.gradient-action-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 30px rgba(43, 184, 90, 0.4);
    filter: brightness(1.1);
}

.item-inventory-section {
    margin-top: 4rem;
    padding-top: 3rem;
    border-top: 1px dashed rgba(255, 255, 255, 0.1);
}

[data-theme="light"] .item-inventory-section {
    border-top: 1px dashed rgba(0, 0, 0, 0.1);
}

.it_add_text {
    font-size: 1.8rem !important;
    font-weight: 800;
    margin-bottom: 2rem;
    color: var(--text-primary);
}

[data-theme="dark"] .it_add_text {
    color: white;
}

@media (max-width: 768px) {
    .form-grid-premium {
        grid-template-columns: 1fr;
    }
    .glass-panel-form {
        padding: 2rem 1.5rem;
    }
}
`;

try {
    let currentCSS = fs.readFileSync(cssPath, 'utf8');
    if (!currentCSS.includes('MANAGEMENT FORMS PREMIUM UPGRADE')) {
        currentCSS += newCSS;
        fs.writeFileSync(cssPath, currentCSS, 'utf8');
        console.log('Appended premium CSS classes flawlessly!');
    } else {
        console.log('CSS already exists.');
    }
} catch (e) {
    console.error('Error appending CSS:', e);
}
