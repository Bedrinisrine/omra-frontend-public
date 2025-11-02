const http = require('http');

async function testLogin(username, password) {
  const postData = JSON.stringify({ username, password });

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

async function testAdminFlow() {
  console.log('🔐 Testing Complete Admin Authentication Flow...\n');

  // Step 1: Test login with admin credentials
  console.log('Step 1: Testing admin login...');
  const loginResult = await testLogin('superadmin', 'admin123');
  
  if (loginResult.error) {
    console.log(`❌ Login error: ${loginResult.error}`);
    return;
  }
  
  if (loginResult.statusCode !== 200) {
    console.log(`❌ Login failed: ${loginResult.statusCode}`);
    console.log(`📄 Error: ${loginResult.response.error || loginResult.response}`);
    return;
  }
  
  console.log(`✅ Login successful!`);
  console.log(`📄 Response:`, loginResult.response);
  console.log(`🔑 is_staff: ${loginResult.response.is_staff}`);
  console.log(`👤 Username: ${loginResult.response.username}`);
  console.log(`🎫 Token: ${loginResult.response.token ? 'Present' : 'Missing'}\n`);

  // Step 2: Test frontend routes
  console.log('Step 2: Testing frontend routes...');
  const routes = [
    { name: 'Home', url: 'http://localhost:4200/' },
    { name: 'User Dashboard', url: 'http://localhost:4200/user' },
    { name: 'Admin Dashboard', url: 'http://localhost:4200/admin' },
    { name: 'Login Page', url: 'http://localhost:4200/login' },
    { name: 'Debug Page', url: 'http://localhost:4200/debug' },
    { name: 'Test Admin (No Guards)', url: 'http://localhost:4200/test-admin' }
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

  // Step 3: Provide instructions for manual testing
  console.log('\n' + '='.repeat(60));
  console.log('📋 MANUAL TESTING INSTRUCTIONS');
  console.log('='.repeat(60));
  console.log('1. Open your browser and go to: http://localhost:4200/login');
  console.log('2. Login with these credentials:');
  console.log('   Username: superadmin');
  console.log('   Password: admin123');
  console.log('3. After login, you should be redirected to: http://localhost:4200/admin');
  console.log('4. If you see the admin dashboard, the issue is resolved!');
  console.log('5. If you\'re still redirected to user interface, check the browser console for errors.');
  console.log('\nAlternative test routes:');
  console.log('- Debug page: http://localhost:4200/debug');
  console.log('- Test admin (no guards): http://localhost:4200/test-admin');
  console.log('='.repeat(60));
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

testAdminFlow(); 