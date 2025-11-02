const http = require('http');

async function testAdminProtection() {
  console.log('🛡️ Testing Admin Interface Protection...\n');

  console.log('Step 1: Testing admin access WITHOUT authentication...');
  console.log('This should redirect to login or show access denied.\n');

  // Test admin route without authentication
  const adminResult = await testRoute('http://localhost:4200/admin');
  
  if (adminResult.error) {
    console.log(`❌ Error accessing admin: ${adminResult.error}`);
  } else {
    console.log(`📄 Admin route response: ${adminResult.statusCode}`);
    console.log(`📄 Content-Type: ${adminResult.headers['content-type']}`);
    
    // Check if the response contains login-related content
    if (adminResult.data.includes('login') || adminResult.data.includes('Login')) {
      console.log('✅ Admin route is properly protected - redirecting to login');
    } else {
      console.log('⚠️ Admin route might not be properly protected');
    }
  }

  console.log('\nStep 2: Testing user route (should be accessible)...');
  const userResult = await testRoute('http://localhost:4200/user');
  
  if (userResult.error) {
    console.log(`❌ Error accessing user route: ${userResult.error}`);
  } else {
    console.log(`✅ User route accessible: ${userResult.statusCode}`);
  }

  console.log('\n' + '='.repeat(60));
  console.log('📋 MANUAL TESTING INSTRUCTIONS');
  console.log('='.repeat(60));
  console.log('1. Open your browser and go to: http://localhost:4200/admin');
  console.log('2. You should be redirected to: http://localhost:4200/login');
  console.log('3. Login with admin credentials:');
  console.log('   Username: superadmin');
  console.log('   Password: admin123');
  console.log('4. After login, you should be redirected back to: http://localhost:4200/admin');
  console.log('5. Test with non-admin user:');
  console.log('   Username: user');
  console.log('   Password: user123');
  console.log('6. Non-admin users should NOT be able to access /admin');
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
          data: data.substring(0, 200) + '...'
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

testAdminProtection(); 