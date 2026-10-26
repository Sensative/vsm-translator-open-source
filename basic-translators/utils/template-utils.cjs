const fs = require('fs');
const path = require('path');
const { exitWithError } = require('./error-utils.cjs');
const { combineVersions, isGen2Version } = require('./version-utils.cjs');

// Update translator version 
let translatorVersion = JSON.parse(fs.readFileSync("../package.json").toString("utf-8")).version;
if (!translatorVersion) {
    exitWithError("Failed to read translator version from package.json file");
}

console.log("Translator version: " + translatorVersion);

/**
 * Processes a template by replacing placeholders with schema data and writing the modified template to a file.
 * Also prepares CSV row data for the template.
 *
 * @param {object} template - The template object.
 * @param {string} crc - The CRC value.
 * @param {object} schema - The schema object.
 * @param {Array} csvData - The array to store CSV row data.
 * @returns {void}
 */
function processTemplate(template, crc, schema, csvData, relatedCRCs) {
    const templateStr = fs.readFileSync(template.path, 'utf8');
    const newStr = getSchemaReplacement(templateStr, crc, schema);
    const newFilename = path.join(template.outputDir, getFilename(schema));

    // Output files are cleared before generation, so an existing file means two schema groups got the same name
    if (fs.existsSync(newFilename)) {
        exitWithError(`Generated filename collision for CRC ${crc}: ${newFilename}`);
    }

    // Prepare schema data JSON
    const schemaJSON = prepareSchemaJSON(schema);
    
    // Replace placeholder in template with schema data JSON
    const replacedTemplate = replaceTemplatePlaceholders(newStr, schemaJSON, relatedCRCs);

    // Write modified template to file
    fs.writeFileSync(newFilename, replacedTemplate, 'utf8');

    // Prepare csv row data
    const csvRow = prepareCSVRow(template, crc, schema, newFilename);
    csvData.push(csvRow);
}

/**
 * Prepares the schema JSON by converting it to a JavaScript object string.
 * @param {object} schema - The schema object.
 * @returns {string} - The formatted schema JavaScript object string.
 */
function prepareSchemaJSON(schema) {
    return `var commonSchema = {
        name: "${schema.name}",
        versions: "${schema.versions}",
        mapData: "${schema.mapData}"
    };`;
}

/**
 * Replaces template placeholders in a string with the provided schema JavaScript object.
 *
 * @param {string} templateStr - The string containing the template placeholders.
 * @param {string} schemaJSON - The JavaScript object string representing the schema.
 * @param {Array} relatedCRCs - An array of related CRCs.
 * @returns {string} The modified string with the template placeholders replaced.
 */
function replaceTemplatePlaceholders(templateStr, schemaJSON, relatedCRCs) { 
    // Ensure relatedCRCs is an array
    if (!Array.isArray(relatedCRCs)) {
        relatedCRCs = [relatedCRCs];
    }

    const crcComment = relatedCRCs.length > 1 
        ? `\n    // CRCs having similar schema: ${relatedCRCs.join(', ')}\n    ` 
        : '    ';

    // Generate the new schema block
    const schemaBlock = `
    ${schemaJSON}
    var schema = 
    {
        ${relatedCRCs.map(crc => `${crc}: commonSchema`).join(',\n        ')},
    };`;

    // Replace the placeholder in the template
    return templateStr.replace(
        /\/{3} DO NOT CHANGE THE BELOW[\s\S]*\/{3} END DO NOT CHANGE THE ABOVE/g,
        `/// DO NOT CHANGE THE BELOW - IT IS REPLACED AUTOMATICALLY WITH KNOWN SCHEMA\n${crcComment}${schemaBlock}\n    /// END DO NOT CHANGE THE ABOVE`
    );
}

/**
 * Prepares a CSV row based on the given template, CRC, schema, and new filename.
 *
 * @param {object} template - The template object.
 * @param {string} crc - The CRC value.
 * @param {object} schema - The schema object.
 * @param {string} newFilename - The new filename.
 * @returns {string[]} - The prepared CSV row as an array.
 */
function prepareCSVRow(template, crc, schema, newFilename) {
    return [
        `${path.join(template.outputDir, path.basename(newFilename))}`,
        `${schema.name.replace(/,/g, '-')}`,
        `${schema.versions}`,
        `${crc}`
    ];
}

/**
 * Replaces the schema, CRC, and translator version in the given template.
 *
 * @param {string} template - The template string to modify.
 * @param {number} crc - The new CRC schema.
 * @param {object} schema - The new schema object.
 * @returns {string} The modified template with the updated schema, CRC, and translator version.
 */
function getSchemaReplacement(template, crc, schema) {
    // Substitute in the new CRC schema and translator version
    return template.replace(/rulesCrc32: \d+/, `rulesCrc32: ${crc}`)                   
                   .replace(/\/{3} DO NOT CHANGE THE BELOW[\s\S]*\/{3} END DO NOT CHANGE THE ABOVE/g, `/// DO NOT CHANGE THE BELOW - IT IS REPLACED AUTOMATICALLY WITH KNOWN SCHEMAS\n${JSON.stringify(schema, null, 2)}\n    /// END DO NOT CHANGE THE ABOVE`)
                   .replace(/###VERSION###/g, translatorVersion);
}

/**
 * Generates a filename based on the given schema.
 *
 * @param {object} schema - The schema object.
 * @returns {string} The generated filename.
 */
function getFilename(schema) {
    // One range per generation, as generation II numbering does not continue generation I
    const versions = combineVersions(schema.versions.split(" "));
    const versionRanges = [
        versions.filter(version => !isGen2Version(version)),
        versions.filter(isGen2Version)
    ].filter(range => range.length > 0).map(formatVersionRange);

    // Replace commas with dashes in the schema name
    const nameWithoutCommas = schema.name.replace(/,/g, '-');

    return `${nameWithoutCommas}-${versionRanges.join('-and-')}.js`;
}

/**
 * Formats sorted versions as "R27" for a single version or "R27-to-R29" for a range.
 *
 * @param {string[]} versions - Versions sorted in ascending order.
 * @returns {string} The formatted range.
 */
function formatVersionRange(versions) {
    const vFrom = versions[0];
    const vTo = versions[versions.length - 1];
    return versions.length === 1 ? vFrom : `${vFrom}-to-${vTo}`;
}

module.exports = {
    processTemplate,
    prepareSchemaJSON,
    replaceTemplatePlaceholders,
    prepareCSVRow,
    getSchemaReplacement,
    getFilename
};