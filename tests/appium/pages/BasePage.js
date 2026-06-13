const fs = require('fs');
const path = require('path');
const logger = require('../../shared/logger');

class MobileBasePage {
    constructor(client) {
        this.client = client;
    }

    async click(selector) {
        logger.info(`Clicking element: ${selector}`);
        const element = await this.client.$(selector);
        await element.waitForDisplayed({ timeout: 10000 });
        await element.click();
    }

    async type(selector, text) {
        logger.info(`Typing "${text}" into element: ${selector}`);
        const element = await this.client.$(selector);
        await element.waitForDisplayed({ timeout: 10000 });
        await element.setValue(text);
    }

    async getText(selector) {
        const element = await this.client.$(selector);
        await element.waitForDisplayed({ timeout: 10000 });
        return await element.getText();
    }

    async isElementVisible(selector) {
        try {
            const element = await this.client.$(selector);
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
        const safeName = testName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const filePath = path.join(screenshotDir, `mobile_${safeName}_${Date.now()}.png`);
        await this.client.saveScreenshot(filePath);
        logger.info(`Screenshot saved: ${filePath}`);
        return filePath;
    }
}

module.exports = MobileBasePage;
