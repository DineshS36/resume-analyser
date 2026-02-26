const http = require('http');

function testServer() {
  return new Promise((resolve, reject) => {
    const req = http.get('http://localhost:5001', (res) => {
      resolve(`Server: ${res.statusCode} ${res.statusMessage}`);
    });
    req.on('error', (err) => {
      reject(err);
    });
    req.end();
  });
}

function testClient() {
  return new Promise((resolve, reject) => {
    const req = http.get('http://localhost:3002', (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve(`Client: ${res.statusCode} ${res.statusMessage} (${data.length} bytes)`);
      });
    });
    req.on('error', (err) => {
      reject(err);
    });
    req.end();
  });
}

async function runTests() {
  console.log('Testing connections...\n');

  try {
    const serverResult = await testServer();
    console.log(serverResult);
  } catch (error) {
    console.error('Server error:', error.message);
  }

  try {
    const clientResult = await testClient();
    console.log(clientResult);
  } catch (error) {
    console.error('Client error:', error.message);
  }
}

runTests();
