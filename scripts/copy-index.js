const fs = require('fs');
const path = require('path');

const browserDir = path.join(__dirname, '../dist/hotels_front/browser');
const csrFile = path.join(browserDir, 'index.csr.html');
const indexFile = path.join(browserDir, 'index.html');

if (fs.existsSync(csrFile)) {
  // Copy index.csr.html to index.html
  fs.copyFileSync(csrFile, indexFile);
  console.log('✅ Copied index.csr.html to index.html');
} else {
  console.warn('⚠️  index.csr.html not found, skipping copy');
}

