// lib/webdriver.js
const fs = require('fs');
const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const config = require('../config.js');

function buildService() {
  const p = config.chrome?.driverPath;
  if (p && fs.existsSync(p)) return new chrome.ServiceBuilder(p);
  if (p) console.warn(`[webdriver] chromedriver not found: ${p} (fallback to PATH)`);
  return null;
}

function buildOptions({ extraArgs = [], userDataDir, windowSize } = {}) {
  const opt = new chrome.Options();

  if (config.chrome?.binaryPath) {
    opt.setChromeBinaryPath(config.chrome.binaryPath);
  }

  let args = [
    ...(config.chrome?.args || []),
    ...extraArgs,
  ];

  if (userDataDir) {
    fs.mkdirSync(userDataDir, { recursive: true });
    args = args.filter(a => !a.startsWith('--user-data-dir='));
    args.push(`--user-data-dir=${userDataDir}`);
  }

  if (args.length) opt.addArguments(...args);
  if (windowSize) opt.windowSize(windowSize);

  return opt;
}

async function buildDriver(opts = {}) {
  const options = buildOptions(opts);
  let builder = new webdriver.Builder()
    .forBrowser('chrome')
    .setChromeOptions(options);

  const service = buildService();
  if (service) builder = builder.setChromeService(service);

  return builder.build();
}

module.exports = { buildDriver };
