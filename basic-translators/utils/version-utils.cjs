// Oldest generation I firmware version that basic translators are generated for
const MIN_SUPPORTED_VERSION = 11;

// Generation II firmware is numbered from R1000, separately from generation I
const GEN2_FIRST_VERSION = 1000;

/**
 * Extracts the numeric part of a firmware version.
 *
 * @param {string} version - A version such as "R27" or "R1001".
 * @returns {number} The version number, or NaN for anything else (e.g. "R0-update").
 */
function versionNumber(version) {
    const match = /^R(\d+)$/.exec(version);
    return match ? Number(match[1]) : NaN;
}

/**
 * Checks if a version is a generation I version of R11 or above, or any generation II version.
 *
 * @param {string} version - The version to check.
 * @returns {boolean} True if basic translators are generated for this version.
 */
function isSupportedVersion(version) {
    return versionNumber(version) >= MIN_SUPPORTED_VERSION;
}

/**
 * Checks if a version is a generation II version.
 *
 * @param {string} version - The version to check.
 * @returns {boolean} True for R1000 and above.
 */
function isGen2Version(version) {
    return versionNumber(version) >= GEN2_FIRST_VERSION;
}

/**
 * Returns the unique supported versions, sorted numerically so that R1000 comes after R33.
 *
 * @param {string[]} versions - The versions to combine.
 * @returns {string[]} Unique supported versions in ascending order.
 */
function combineVersions(versions) {
    return [...new Set(versions.filter(isSupportedVersion))]
        .sort((a, b) => versionNumber(a) - versionNumber(b));
}

module.exports = {
    versionNumber,
    isSupportedVersion,
    isGen2Version,
    combineVersions
};