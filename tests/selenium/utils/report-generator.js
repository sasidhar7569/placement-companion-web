const fs = require('fs');
const path = require('path');

class ReportGenerator {
    static generate(results) {
        const reportPath = path.join(__dirname, '../../../reports/selenium-report.json');
        fs.mkdirSync(path.dirname(reportPath), { recursive: true });
        fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
        console.log('Report generated at:', reportPath);
    }
}

module.exports = ReportGenerator;
