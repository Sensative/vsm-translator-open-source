const fs = require('fs');
const path = require('path');

/**
 * Deletes existing files with the extensions '.js' and '.csv' from the specified directory.
 * @param {string} outputDir - The directory path where the files are located.
 */
function deleteExistingFiles(outputDir) {
    fs.readdirSync(outputDir).forEach(file => {
        if (path.extname(file) === '.js' || path.extname(file) === '.csv') {
            fs.unlinkSync(path.join(outputDir, file));
        }
    });
}

/**
 * Sorts the CSV data by the "Product Application" column.
 *
 * @param {Array<Array<string>>} csvData - The CSV data to be sorted.
 * @returns {Array<Array<string>>} The sorted CSV data with the header row.
 */
function sortCsvData(csvData) {
    // Extract header row
    const headerRow = csvData.shift();

    // Sort data rows by "Product Application" column
    const sortedData = csvData.sort((a, b) => a[1].localeCompare(b[1]));

    // Combine header row and sorted data rows
    return [headerRow, ...sortedData];
}

/**
 * Generates a CSV file with the given template name, output directory, and CSV data.
 *
 * @param {string} templateName - The name of the template.
 * @param {string} outputDir - The output directory where the CSV file will be generated.
 * @param {Array<Array<string>>} csvData - The data to be written to the CSV file.
 * @returns {void}
 */
function generateCSV(templateName, outputDir, csvData) {
    const csvString = csvData.map(row => row.join(',')).join('\n');
    const csvFilename = `1-dots-basic-${templateName}-translators-index.csv`;
    fs.writeFileSync(path.join(outputDir, csvFilename), csvString);
}

module.exports = {
    deleteExistingFiles,
    sortCsvData,
    generateCSV
};