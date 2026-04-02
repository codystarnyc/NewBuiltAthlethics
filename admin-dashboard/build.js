const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) fs.mkdirSync(distDir);

fs.copyFileSync(path.join(__dirname, 'index.html'), path.join(distDir, 'index.html'));

const apiUrl = process.env.VITE_API_URL ?? '';
const fitnessOnDemand = {
  flexUrl: process.env.REACT_APP_FITNESS_OD_URL ?? '',
  managementUrl: process.env.REACT_APP_FITNESS_OD_MURL ?? '',
  clientId: process.env.REACT_APP_FITNESS_OD_CLIENT_ID ?? '',
  adminEmail: process.env.REACT_APP_FITNESS_ADMIN_EMAIL ?? '',
};
const payload = { API_URL: apiUrl, fitnessOnDemand };
const configContent = `window.__CONFIG__ = ${JSON.stringify(payload)};`;
fs.writeFileSync(path.join(distDir, 'config.js'), configContent);

console.log(
  `Admin dashboard built. API_URL = "${apiUrl}" fitnessOnDemand.flexUrl = "${fitnessOnDemand.flexUrl}"`,
);
