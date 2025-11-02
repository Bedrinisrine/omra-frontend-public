const http = require('http');

// Test the login endpoint
async function testLogin() {
  const postData = JSON.stringify({
    username: 'admin', // Replace with actual admin username
    password: 'admin123' // Replace with actual admin password
  });

  const options = {
    hostname: 'localhost',
    port: 8000,
    path: '/hotels/auth/login/',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  return new Promise((resolve) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve({
            statusCode: res.statusCode,
            response: response
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            response: data
          });
        }
      });
    });

    req.on('error', (err) => {
      resolve({
        error: err.message
      });
    });

    req.write(postData);
    req.end();
  });
}

async function testRoutes() {
  console.log('🔐 Testing Authentication Flow...\n');
  
  // Test login
  console.log('1. Testing login endpoint...');
  const loginResult = await testLogin();
  
  if (loginResult.error) {
    console.log(`❌ Login error: ${loginResult.error}`);
  } else {
    console.log(`✅ Login status: ${loginResult.statusCode}`);
    console.log(`📄 Login response:`, loginResult.response);
  }
  
  console.log('\n2. Testing frontend routes...');
  
  const routes = [
    { name: 'Home', url: 'http://localhost:4200/' },
    { name: 'User Dashboard', url: 'http://localhost:4200/user' },
    { name: 'Admin Dashboard', url: 'http://localhost:4200/admin' },
    { name: 'Login Page', url: 'http://localhost:4200/login' },
    { name: 'Debug Page', url: 'http://localhost:4200/debug' },
    { name: 'Test Admin', url: 'http://localhost:4200/test-admin' }
  ];
  
  for (const route of routes) {
    console.log(`\nTesting ${route.name}: ${route.url}`);
    const result = await testRoute(route.url);
    
    if (result.error) {
      console.log(`❌ Error: ${result.error}`);
    } else {
      console.log(`✅ Status: ${result.statusCode}`);
      console.log(`📄 Content-Type: ${result.headers['content-type']}`);
    }
  }
}

async function testRoute(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data.substring(0, 100) + '...'
        });
      });
    });
    
    req.on('error', (err) => {
      resolve({
        error: err.message
      });
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        error: 'Timeout'
      });
    });
  });
}

testRoutes(); 