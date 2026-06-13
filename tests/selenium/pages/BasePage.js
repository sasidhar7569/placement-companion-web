const { Builder, By, until } = require('selenium-webdriver');
const fs = require('fs');
const path = require('path');
const logger = require('../../shared/logger');

class BasePage {
    constructor(driver) {
        this.driver = driver;
    }

    async navigateTo(url) {
        logger.info(`Navigating to: ${url}`);
        await this.driver.get(url);
    }

    async waitForElement(locator, timeout = 10000) {
        logger.info(`Waiting for element: ${JSON.stringify(locator)}`);
        return await this.driver.wait(until.elementLocated(locator), timeout);
    }

    async click(locator) {
        logger.info(`Clicking element: ${JSON.stringify(locator)}`);
        const element = await this.waitForElement(locator);
        await this.driver.wait(until.elementIsVisible(element), 5000);
        await element.click();
    }

    async type(locator, text) {
        logger.info(`Typing "${text}" into element: ${JSON.stringify(locator)}`);
        const element = await this.waitForElement(locator);
        await this.driver.wait(until.elementIsVisible(element), 5000);
        await element.clear();
        await element.sendKeys(text);
    }

    async getText(locator) {
        const element = await this.waitForElement(locator);
        return await element.getText();
    }

    async isElementVisible(locator) {
        try {
            const element = await this.waitForElement(locator, 3000);
            return await element.isDisplayed();
        } catch (error) {
            return false;
        }
    }

    async takeScreenshot(testName) {
        const screenshotDir = path.join(__dirname, '../../../reports/screenshots');
        if (!fs.existsSync(screenshotDir)) {
            fs.mkdirSync(screenshotDir, { recursive: true });
        }
        const encodedString = await this.driver.takeScreenshot();
        const safeName = testName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const filePath = path.join(screenshotDir, `${safeName}_${Date.now()}.png`);
        fs.writeFileSync(filePath, encodedString, 'base64');
        logger.info(`Screenshot saved: ${filePath}`);
        return filePath;
    }
}

module.exports = BasePage;
