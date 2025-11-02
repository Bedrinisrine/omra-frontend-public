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

async function testMultipleCredentials() {
  const testCredentials = [
    { username: 'admin', password: 'admin' },
    { username: 'admin', password: 'admin123' },
    { username: 'admin', password: 'password' },
    { username: 'user', password: 'user' },
    { username: 'test', password: 'test' },
    { username: 'admin', password: '123456' },
    { username: 'superuser', password: 'superuser' }
  ];

  console.log('🔐 Testing Login with Different Credentials...\n');

  for (const cred of testCredentials) {
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

testMultipleCredentials(); 