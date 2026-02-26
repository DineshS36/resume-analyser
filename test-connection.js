const axios = require('axios');

async function testConnection() {
  try {
    // Test server connection
    console.log('Testing server connection (http://localhost:5000)...');
    const serverResponse = await axios.get('http://localhost:5000');
    console.log('Server response:', serverResponse.status, serverResponse.statusText);
  } catch (error) {
    console.error('Server connection error:', error.message);
  }

  try {
    // Test client connection
    console.log('\nTesting client connection (http://localhost:3000)...');
    const clientResponse = await axios.get('http://localhost:3000');
    console.log('Client response:', clientResponse.status, clientResponse.statusText);
    console.log('Response length:', clientResponse.data.length, 'bytes');
  } catch (error) {
    console.error('Client connection error:', error.message);
  }
}

testConnection();
