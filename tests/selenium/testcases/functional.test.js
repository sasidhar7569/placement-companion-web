const { expect } = require('chai');
const { Builder, By } = require('selenium-webdriver');
const config = require('../../shared/config');

describe('Functional Testing', function() {
    let driver;

    before(function() {
        driver = global.driver;
    });

    it('should load the homepage', async function() {
        await driver.get(config.web.baseUrl);
        const title = await driver.getTitle();
        expect(title).to.not.be.empty;
    });
});
