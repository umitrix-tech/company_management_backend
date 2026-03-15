const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5031,
  path: '/api/v1/punchLog/download-excel?userId=1&startDate=2026-03-01&endDate=2026-03-31',
  method: 'GET',
};

const req = http.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`);
  console.log('Headers:', res.headers);
  if (res.statusCode === 401) {
    console.log("Authentication failed as expected without token. API route is hit.");
  }
});

req.on('error', error => {
  console.error(error);
});

req.end();
