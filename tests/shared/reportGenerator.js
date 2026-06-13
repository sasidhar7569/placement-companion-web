const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');
const logger = require('./logger');

class ReportGenerator {
    constructor(reportName = 'combined-test-report.xlsx') {
        this.results = [];
        this.reportPath = path.join(__dirname, '../../reports/excel', reportName);
        this.summaryPath = path.join(__dirname, '../../reports/summary', 'execution-summary.json');
    }

    addResult({ id, module, name, description, expected, actual, status, duration, screenshot }) {
        this.results.push({
            id,
            module,
            name,
            description,
            expected,
            actual,
            status,
            duration,
            timestamp: new Date().toISOString(),
            screenshot: screenshot || 'N/A',
            remarks: ''
        });
    }

    async generate() {
        // Generate Excel
        const workbook = new ExcelJS.Workbook();
        
        // Group results by module
        const modules = {};
        this.results.forEach(result => {
            const modName = result.module || 'Other Module';
            if (!modules[modName]) {
                modules[modName] = [];
            }
            modules[modName].push(result);
        });

        // Ensure at least one sheet exists if there are no results
        if (Object.keys(modules).length === 0) {
            workbook.addWorksheet('Test Execution Report');
        }

        const columns = [
            { header: 'Test Case ID', key: 'id', width: 15 },
            { header: 'Test Module', key: 'module', width: 20 },
            { header: 'Test Name', key: 'name', width: 30 },
            { header: 'Test Description', key: 'description', width: 40 },
            { header: 'Expected Result', key: 'expected', width: 30 },
            { header: 'Actual Result', key: 'actual', width: 30 },
            { header: 'Status', key: 'status', width: 15 },
            { header: 'Execution Time (ms)', key: 'duration', width: 20 },
            { header: 'Execution Date and Time', key: 'timestamp', width: 25 },
            { header: 'Screenshot Location', key: 'screenshot', width: 40 },
            { header: 'Additional Remarks', key: 'remarks', width: 20 },
        ];

        for (const [modName, moduleResults] of Object.entries(modules)) {
            // Excel sheet names must be <= 31 chars and cannot contain certain characters
            let safeSheetName = modName.substring(0, 31).replace(/[\\/?*[\]]/g, '');
            if (!safeSheetName.trim()) safeSheetName = 'Module';
            const sheet = workbook.addWorksheet(safeSheetName);

            sheet.columns = columns;

            // Styling headers
            sheet.getRow(1).font = { bold: true };
            sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD3D3D3' } };

            moduleResults.forEach(result => {
                const row = sheet.addRow(result);
                if (result.status === 'PASS') row.getCell('status').font = { color: { argb: 'FF008000' } };
                else if (result.status === 'FAIL') row.getCell('status').font = { color: { argb: 'FFFF0000' } };
                else row.getCell('status').font = { color: { argb: 'FFFFA500' } }; // SKIPPED
            });
        }

        await workbook.xlsx.writeFile(this.reportPath);
        logger.info(`Excel report generated at: ${this.reportPath}`);

        // Generate JSON Summary
        const summary = {
            total: this.results.length,
            passed: this.results.filter(r => r.status === 'PASS').length,
            failed: this.results.filter(r => r.status === 'FAIL').length,
            skipped: this.results.filter(r => r.status === 'SKIPPED').length,
            executionDate: new Date().toISOString(),
            details: this.results
        };
        fs.writeFileSync(this.summaryPath, JSON.stringify(summary, null, 2));
        logger.info(`JSON Summary generated at: ${this.summaryPath}`);
    }
}

module.exports = ReportGenerator;
