/**
 * @copyright © 2026 IchikabuImpact
 * @license Commercial use prohibited without permission.
 */

/**
 * @module lib/webdriver
 * @description Selenium WebDriver factory wrapper for Chrome.
 * Handles driver initialization, option configuration, and cross-platform compatibility (Windows/WSL).
 */

const fs = require('fs');
const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const config = require('../config.js');

/**
 * Builds the ChromeDriver service using path from config.
 * @returns {chrome.ServiceBuilder|null} - The service builder or null if not configured/found.
 */
function buildService() {
  const p = config.chrome?.driverPath;
  if (p && fs.existsSync(p)) return new chrome.ServiceBuilder(p);
  if (p) console.warn(`[webdriver] chromedriver not found: ${p} (fallback to PATH)`);
  return null;
}

/**
 * Constructs ChromeOptions based on configuration and platform.
 * Automatically adds headless/no-sandbox arguments on Linux (WSL).
 *
 * @param {Object} [opts] - Configuration options.
 * @param {string[]} [opts.extraArgs] - Additional command line arguments for Chrome.
 * @param {string} [opts.userDataDir] - Path to a user data directory (profile).
 * @param {Object} [opts.windowSize] - Window size object {width, height}.
 * @returns {chrome.Options} - Configured Chrome options instance.
 */
function buildOptions({ extraArgs = [], userDataDir, windowSize } = {}) {
  const opt = new chrome.Options();

  if (config.chrome?.binaryPath) {
    opt.setChromeBinaryPath(config.chrome.binaryPath);
  }

  let args = [
    ...(config.chrome?.args || []),
    ...extraArgs,
  ];

  // WSL/Linux defaults: usually requires headless and no-sandbox
  if (process.platform === 'linux') {
    // If not explicitly configured, we append these robust defaults
    if (!args.some(a => a.includes('headless'))) args.push('--headless=new');
    if (!args.includes('--no-sandbox')) args.push('--no-sandbox');
    if (!args.includes('--disable-dev-shm-usage')) args.push('--disable-dev-shm-usage');
    if (!args.includes('--disable-gpu')) args.push('--disable-gpu');
  }

  // Stealth / Evasion args
  const stealthArgs = [
    '--disable-blink-features=AutomationControlled',
    '--disable-infobars',
    '--no-first-run',
    '--no-service-autorun',
    '--password-store=basic',
    '--use-mock-keychain',
    '--disable-extensions',
    '--excludeSwitches=enable-automation',
    '--use-automation-extension=false',
    // Rotate UA or use a standard recent one (Chrome 122)
    '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  ];

  for (const s of stealthArgs) {
    // Check if arg name (before =) already exists to avoid dupes/conflict?
    // Simplified check: if exact string match or prefix match
    const key = s.split('=')[0];
    if (!args.some(a => a.startsWith(key))) {
      args.push(s);
    }
  }

  if (userDataDir) {
    fs.mkdirSync(userDataDir, { recursive: true });
    args = args.filter(a => !a.startsWith('--user-data-dir='));
    args.push(`--user-data-dir=${userDataDir}`);
  }

  if (args.length) opt.addArguments(...args);
  if (windowSize) opt.windowSize(windowSize);

  return opt;
}

/**
 * Creates and builds a new Selenium WebDriver instance for Chrome.
 *
 * @async
 * @param {Object} [opts] - Options passed to buildOptions.
 * @param {string[]} [opts.extraArgs] - Additional args.
 * @param {string} [opts.userDataDir] - Profile directory path.
 * @param {Object} [opts.windowSize] - {width, height}.
 * @returns {Promise<webdriver.WebDriver>} - The built WebDriver instance.
 */
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
