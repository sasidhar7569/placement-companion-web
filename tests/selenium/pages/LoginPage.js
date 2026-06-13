const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');

class LoginPage extends BasePage {
    constructor(driver) {
        super(driver);
        this.emailInput = By.css('input[type="email"]');
        this.passwordInput = By.css('input[type="password"]');
        this.loginButton = By.xpath('//button[contains(text(), "Login")]');
        this.errorMessage = By.css('.error-message'); // placeholder selector
    }

    async login(email, password) {
        await this.type(this.emailInput, email);
        await this.type(this.passwordInput, password);
        await this.click(this.loginButton);
    }

    async getErrorMessage() {
        return await this.getText(this.errorMessage);
    }
}

module.exports = LoginPage;
