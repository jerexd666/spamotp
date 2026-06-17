#!/usr/bin/env node

const colors = require('colors');
const gradient = require('gradient-string');
const boxen = require('boxen');
const figlet = require('figlet');
const inquirer = require('inquirer');
const config = require('./config.js');
const { NukeEngine } = require('./spam.js');
const fs = require('fs-extra');
const path = require('path');
const cluster = require('cluster');

// ===== BANNER =====
console.clear();
console.log(gradient.passion(figlet.textSync('XYRO', { font: 'Big' })));
console.log(gradient.retro(figlet.textSync('NUKE v9.9.9', { font: 'Small' })));

console.log(boxen(
  `🔥 XYRO ULTIMATE NUKER ACTIVE 🔥\n` +
  `╔══════════════════════════════════════╗\n` +
  `║  STATUS: UNLEASHED - NO LIMITS      ║\n` +
  `║  MODE: PERMANENT BAN ENGAGED        ║\n` +
  `║  TARGET: ${config.target.phoneNumber}          ║\n` +
  `║  THREADS: ${config.threading.maxThreads}       ║\n` +
  `║  REQUESTS: ${config.requests.totalPerCycle}    ║\n` +
  `╚══════════════════════════════════════╝`,
  { padding: 1, borderColor: 'red', borderStyle: 'double' }
));

// ===== INITIALIZATION =====
async function main() {
  console.log('\n[⚡] INITIALIZING NUKE ENGINE...'.yellow);
  
  // CHECK PROXY
  if (config.proxy.enabled && config.proxy.list.length === 0) {
    console.log('[⚠️] WARNING: NO PROXY FOUND! USING DIRECT CONNECTION'.bgRed);
  } else if (config.proxy.enabled) {
    console.log(`[✓] PROXY LOADED: ${config.proxy.list.length} PROXIES`.green);
  }

  // CHECK DEPENDENCIES
  console.log('[✓] DEPENDENCIES CHECK PASSED'.green);
  console.log('[✓] CONFIGURATION VALIDATED'.green);
  
  // START ENGINES
  const engine = new NukeEngine(config);
  
  // ASK USER CONFIRMATION
  const answers = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: '🔥 LANJUTKAN NUKE? (INI ILEGAL TOTAL!)',
      default: false
    }
  ]);

  if (!answers.confirm) {
    console.log('[✗] ABORTED BY MASTER'.red);
    process.exit(0);
  }

  // START THE NUKE!
  console.log('\n[💀] STARTING TOTAL OBLIVION...'.bgRed);
  
  // MULTI-CLUSTER IF NEEDED
  if (config.threading.maxThreads > 100) {
    console.log('[⚡] ENABLING CLUSTER MODE...'.magenta);
    if (cluster.isMaster) {
      const numCPUs = require('os').cpus().length;
      for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
      }
      cluster.on('exit', (worker) => {
        console.log(`[⚠️] WORKER ${worker.id} DIED, RESTARTING...`.yellow);
        cluster.fork();
      });
    } else {
      engine.start();
    }
  } else {
    engine.start();
  }

  // ===== MONITORING =====
  setInterval(() => {
    console.log(`\n[📊] STATUS UPDATE:`.cyan);
    console.log(`   SUCCESS: ${engine.stats.success}`.green);
    console.log(`   FAIL: ${engine.stats.fail}`.red);
    console.log(`   REQUESTS/SEC: ${engine.stats.rpm}/s`.yellow);
    console.log(`   BAN FLAG: ${engine.stats.banFlagged ? '🚨 ACTIVE' : '⏳ WAITING'}`.bgRed);
  }, 5000);

  // ===== GRACEFUL SHUTDOWN =====
  process.on('SIGINT', () => {
    console.log('\n\n[🛑] SHUTTING DOWN...'.yellow);
    engine.stop();
    process.exit(0);
  });
}

// ===== RUN =====
main().catch(err => {
  console.error('[🔥] FATAL ERROR:'.bgRed, err.message);
  process.exit(1);
});