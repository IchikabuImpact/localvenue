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
