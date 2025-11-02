const http = require('http');

const routes = [
  'http://localhost:4200/',
  'http://localhost:4200/user',
  'http://localhost:4200/admin',
  'http://localhost:4200/login',
  'http://localhost:4200/debug',
  'http://localhost:4200/test-admin'
];

async function testRoute(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          url,
          statusCode: res.statusCode,
          headers: res.headers,
          data: data.substring(0, 200) + '...' // First 200 chars
        });
      });
    });
    
    req.on('error', (err) => {
      resolve({
        url,
        error: err.message
      });
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        url,
        error: 'Timeout'
      });
    });
  });
}

async function testAllRoutes() {
  console.log('Testing all routes...\n');
  
  for (const route of routes) {
    console.log(`Testing: ${route}`);
    const result = await testRoute(route);
    
    if (result.error) {
      console.log(`❌ Error: ${result.error}\n`);
    } else {
      console.log(`✅ Status: ${result.statusCode}`);
      console.log(`📄 Content-Type: ${result.headers['content-type']}`);
      console.log(`📝 Data: ${result.data}\n`);
    }
  }
}

testAllRoutes(); 