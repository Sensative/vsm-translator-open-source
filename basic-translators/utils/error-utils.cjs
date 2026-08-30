/**
 * Error Handling
 * @param {string} message - The error message to display.
 */
function exitWithError(message) {
    console.error(message);
    process.exit(1);
}

module.exports = {
    exitWithError
};