const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) fs.mkdirSync(distDir);

fs.copyFileSync(path.join(__dirname, 'index.html'), path.join(distDir, 'index.html'));

const apiUrl = '';
const configContent = `window.__CONFIG__ = { API_URL: ${JSON.stringify(apiUrl)} };`;
fs.writeFileSync(path.join(distDir, 'config.js'), configContent);

console.log(`Admin dashboard built. API_URL = "${apiUrl}"`);
