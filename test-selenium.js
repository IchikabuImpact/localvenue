/**
 * @copyright © 2026 IchikabuImpact
 * @license Commercial use prohibited without permission.
 */

const { buildDriver } = require("./lib/webdriver");

(async () => {
  const driver = await buildDriver();
  try {
    await driver.get("https://example.com");
    console.log(await driver.getTitle());
  } finally {
    await driver.quit();
  }
})();
