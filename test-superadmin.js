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

async function testSuperAdmin() {
  console.log('🔐 Testing SuperAdmin Login...\n');

  const credentials = [
    { username: 'superadmin', password: 'admin123' },
    { username: 'admin', password: 'admin123' }
  ];

  for (const cred of credentials) {
    console.log(`Testing: ${cred.username}/${cred.password}`);
    const result = await testLogin(cred.username, cred.password);
    
    if (result.error) {
      console.log(`❌ Error: ${result.error}\n`);
    } else if (result.statusCode === 200) {
      console.log(`✅ SUCCESS! Status: ${result.statusCode}`);
      console.log(`📄 Response:`, result.response);
      console.log(`🔑 is_staff: ${result.response.is_staff}`);
      console.log(`👤 Username: ${result.response.username}`);
      console.log(`🎫 Token: ${result.response.token ? 'Present' : 'Missing'}\n`);
    } else {
      console.log(`❌ Failed: ${result.statusCode}`);
      console.log(`📄 Error: ${result.response.error || result.response}\n`);
    }
  }
}

testSuperAdmin(); 