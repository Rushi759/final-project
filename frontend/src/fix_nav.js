const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'rushi', 'OneDrive', 'Documents', 'src', 'Styles', 'HomeNavbar.css');

try {
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Fix logout button color in light mode
    content = content.replace(
        /#navbar_menu #nav_logout_btn \{[\s\S]*?cursor: pointer;\n\}/g,
        `#navbar_menu #nav_logout_btn {
    padding: 0.6rem 2rem;
    height: auto;
    font-weight: 600;
    font-size: 0.95rem;
    color: var(--text-primary);
    border-radius: 50px;
    border: 2px solid rgba(0, 0, 0, 0.2);
    background: transparent;
    transition: all 0.3s ease;
    cursor: pointer;
}

[data-theme="dark"] #navbar_menu #nav_logout_btn {
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.4);
}`
    );

    // 2. Fix logout button hover
    content = content.replace(
        /#navbar_menu #nav_logout_btn:hover \{[\s\S]*?box-shadow: 0 4px 15px rgba\(255, 255, 255, 0\.3\);\n\}/g,
        `#navbar_menu #nav_logout_btn:hover {
    background: var(--primary);
    color: white;
    transform: translateY(-2px);
    border-color: var(--primary);
    box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
}

[data-theme="dark"] #navbar_menu #nav_logout_btn:hover {
    background: white;
    color: var(--primary-dark);
    border-color: white;
    box-shadow: 0 4px 15px rgba(255, 255, 255, 0.3);
}`
    );

    // 3. Fix nav link colors
    content = content.replace(
        /#navbar_sec a\.active\{\s*color: #DBFF00;\s*text-decoration: none;\s*\}\s*#navbar_sec a\{\s*color: white;\s*text-decoration: none;\s*\}\s*#navbar_sec a:hover\{\s*color: #ddff00;\s*text-decoration: none;\s*\}\s*#navbar_sec \.nav_menu_item \.services_list_item a\.active\{\s*color: #ddff00;\s*text-decoration: none;\s*\}/g,
        `#navbar_sec a {
    color: var(--text-primary);
    text-decoration: none;
}

[data-theme="dark"] #navbar_sec a {
    color: white;
}

#navbar_sec a.active {
    color: var(--primary);
    text-decoration: none;
}

[data-theme="dark"] #navbar_sec a.active {
    color: #DBFF00;
}

#navbar_sec a:hover {
    color: var(--primary-dark);
    text-decoration: none;
}

[data-theme="dark"] #navbar_sec a:hover {
    color: #ddff00;
}

#navbar_sec .nav_menu_item .services_list_item a.active {
    color: var(--primary);
    text-decoration: none;
}

[data-theme="dark"] #navbar_sec .nav_menu_item .services_list_item a.active {
    color: #ddff00;
}`
    );

    // 4. Fix hamburger color
    content = content.replace(
        /\.hamburger-line \{[\s\S]*?transition: all 0\.3s ease;\n\}/g,
        `.hamburger-line {
    width: 26px;
    height: 3px;
    background-color: var(--text-primary);
    border-radius: 3px;
    transition: all 0.3s ease;
}

[data-theme="dark"] .hamburger-line {
    background-color: white;
}`
    );

    fs.writeFileSync(filePath, content, 'utf8');
    console.log("Successfully bypassed UI and fixed HomeNavbar.css directly!");
} catch (error) {
    console.error("Error:", error);
}
