const { expect } = require('chai');
const { Builder, By } = require('selenium-webdriver');
const config = require('../../shared/config');

describe('Functional Testing', function() {
    let driver;

    before(async function() {
        driver = await new Builder().forBrowser(config.web.browser).build();
    });

    after(async function() {
        if (driver) await driver.quit();
    });

    it('should load the homepage', async function() {
        await driver.get(config.web.baseUrl);
        const title = await driver.getTitle();
        expect(title).to.not.be.empty;
    });
});
