/**
 *  Copryright (C) 2024, Sensative AB. All rights reserved.
 *  Author: Dhiraj Paryani
 *
 * This script automates the generation of Basic Translators' JavaScript files by leveraging templates defined in an 
 * array. It begins by extracting schema information from a predefined file called 'dots-translator-generated.cjs'. The 
 * script then iterates over each schema to produce a new file for each template.
 * 
 * Before generating new files, the script clears existing files in the output directories for each template to ensure a
 * clean workspace.
 * 
 * Next, it processes the schema data, specifically manipulating the 'mapData' property by replacing newline characters
 * with ' + ' delimiters. It inserts schema-specific details such as CRC values, schema data itself, and a translator 
 * version obtained from 'package.json' into each template. The modified content is then used to replace the original 
 * template content. The output filenames are constructed based on the schema's name and version.
 * 
 * The generated JavaScript files are saved in their respective output directories.
 * 
 * Additionally, the script generates a CSV file for each template, containing details such as filename, schema name,
 * schema versions, CRC value, and template name for every generated JavaScript file. These CSV files are also stored in
 * the corresponding output directories.
 * 
 * This script is compatible with ES6 and utilizes the Node.js File System (fs) module for file handling. It provides an
 * automated solution for generating JavaScript files tailored to specific schema data.
 */

const fs = require('fs');
const path = require('path');
const { knownSchemas } = require('../dots-translator-generated.cjs');

// Error Handling
function exitWithError(message) {
    console.error(message);
    process.exit(1);
}

// Update translator version 
let translatorVersion = JSON.parse(fs.readFileSync("../package.json").toString("utf-8")).version;
if (!translatorVersion) {
    exitWithError("Failed to read translator version from package.json file");
}

console.log("Translator version: " + translatorVersion);

function groupSchemasByNameAndMapData() {
    const groupedSchemas = {};
    for (let [crc, schema] of Object.entries(knownSchemas)) {
        // Skip processing if versions are less than R11
        if (!schema.versions || schema.versions.trim() === "" || !schema.versions.match(/R(1[1-9]|[2-9]\d+)/)) {
            //console.log(`Skipping schema with CRC ${crc}, schema.name ${schema.name} because versions are less than R11.`); //Debug purposes only
            continue;
        }

        // Process schema.mapData - replace \n with + and ensure proper concatenation                
        schema.mapData = schema.mapData.replace(/\r\n|\r|\n/g, " + ").trim().replace(/\s+\+$/g, "");

        // Check if all mapData have outputs mentioned within the group            
        if (!/M\s+output\s+/.test(schema.mapData)) {
            //console.log(`Skipping schemas with name ${schema.name} because mapData does not have any output mentioned.`); //Debug purposes only
            continue;
        }

        const key = `${schema.name}_${schema.mapData}`; // Using name and mapData as the key
        if (!(key in groupedSchemas)) {
            groupedSchemas[key] = [];
        }

        groupedSchemas[key].push({ crc, schema });
    }
    //console.log(groupedSchemas); //Debug purposes only
    return groupedSchemas;
}

// Main Function
function generateTranslators() {
    // Define templates
    const templates = [
        { name: 'chirpstack-v3', path: './chirpstack-v3/template/dots-chirpstack-v3-decoder-template.cjs', outputDir: './chirpstack-v3' },
        { name: 'ttn-and-chirpstack-v4', path: './thethingsnetwork-chirpstack-v4/template/dots-ttn-and-chirpstack-v4-decoder-template.cjs', outputDir: './thethingsnetwork-chirpstack-v4' },
        // Add more templates as needed
    ];    

    // Iterate over each template
    templates.forEach((template) => {
        console.log(`Generating Basic translators for ${template.name}.`);

        // Clean output directories
        deleteExistingFiles(template.outputDir);

        // Prepare csv row data with header row
        let csvData = [['Filename', 'Product Application', 'Versions', 'CRCs']];

        // Group knownSchemas by name
        const groupedSchemas = groupSchemasByNameAndMapData();

        // Schema Validation and Processing
        processSchemas(template, groupedSchemas, csvData);

        // Sort CSV data
        const sortedCsvData = sortCsvData(csvData);

        // Generate CSV file
        generateCSV(template.name, template.outputDir, sortedCsvData);
  
    });
    console.log(`Ready.`);
}

// File Handling
function deleteExistingFiles(outputDir) {
    fs.readdirSync(outputDir).forEach(file => {
        if (path.extname(file) === '.js' || path.extname(file) === '.csv') {
            fs.unlinkSync(path.join(outputDir, file));
        }
    });
}

function sortCsvData(csvData) {
    // Extract header row
    const headerRow = csvData.shift();

    // Sort data rows by "Product Application" column
    const sortedData = csvData.sort((a, b) => a[1].localeCompare(b[1]));

    // Combine header row and sorted data rows
    return [headerRow, ...sortedData];
}

// CSV Generation
function generateCSV(templateName, outputDir, csvData) {
    const csvString = csvData.map(row => row.join(',')).join('\n');
    const csvFilename = `1-dots-basic-${templateName}-translators-index.csv`;
    fs.writeFileSync(path.join(outputDir, csvFilename), csvString);
}

function processSchemaVersions(schema) {
    const versions = schema.versions.split(" ");
    const validVersions = versions.filter(version => version.match(/R(1[1-9]|[2-9]\d+)/)); // Filter out invalid versions
    const combinedVersions = combineVersions(validVersions); // Combine versions
    schema.versions = combinedVersions.join(' '); // Update schema versions    
}

function combineVersions(versions) {
    const allVersions = new Set(); // Use a Set to store unique versions
    versions.forEach(version => {
        if (parseInt(version.slice(1)) >= 11) { // Check if version is R11 or higher
            allVersions.add(version); // Add versions to the Set
        }
    });
    return [...allVersions].sort(); // Convert Set back to an array and sort it
}

function processTemplate(template, crc, schema, csvData) {
    const templateStr = fs.readFileSync(template.path, 'utf8');
    const newStr = getSchemaReplacement(templateStr, crc, schema);
    const newFilename = path.join(template.outputDir, getFilename(schema));

    // Write modified template to file
    fs.writeFileSync(newFilename, newStr, 'utf8');

    // Prepare schema data JSON
    const schemaJSON = prepareSchemaJSON(crc, schema);
    
    // Replace placeholder in template with schema data JSON
    const replacedTemplate = replaceTemplatePlaceholders(newStr, schemaJSON);

    // Write modified template to file
    fs.writeFileSync(newFilename, replacedTemplate, 'utf8');

    // Prepare csv row data
    const csvRow = prepareCSVRow(template, crc, schema, newFilename);
    csvData.push(csvRow);
}

function prepareSchemaJSON(crc, schema) {
    return JSON.stringify({
        [crc]: {
            name: schema.name,
            versions: schema.versions,
            mapData: schema.mapData
        }
    }, null, 4)
    .replace(/"(\w+)":/g, '$1:')
    .replace(/\n/g, '\n    '); // Add indentation
}

function replaceTemplatePlaceholders(templateStr, schemaJSON) {
    return templateStr.replace(/\/{3} DO NOT CHANGE THE BELOW[\s\S]*\/{3} END DO NOT CHANGE THE ABOVE/g, `/// DO NOT CHANGE THE BELOW - IT IS REPLACED AUTOMATICALLY WITH KNOWN SCHEMA\n    var schema = \n    ${schemaJSON};\n    /// END DO NOT CHANGE THE ABOVE`);
}

function prepareCSVRow(template, crc, schema, newFilename) {
    return [
        `${path.join(template.outputDir, path.basename(newFilename))}`,
        `${schema.name.replace(/,/g, '-')}`,
        `${schema.versions}`,
        `${crc}`
    ];
}

function areAllMapDataIdentical(schemas) {
    const uniqueMapData = new Set(schemas.map(({ schema }) => schema.mapData));
    return uniqueMapData.size === 1;
}

function processIdenticalMapData(template, schemas, csvData) {
    const { crc, schema } = schemas[0];
    schema.versions = combineAndSortVersions(schemas.map(({ schema }) => schema.versions));
    processTemplate(template, crc, schema, csvData); // Process template

    // Combine CRCs for schemas with the same name
    const combinedCRCs = combineCRCs(schemas);
    // Update the last item in csvData with combined CRCs
    if (combinedCRCs.length > 0) {
        csvData[csvData.length - 1][3] = combinedCRCs.join('|');
    }
}

function combineAndSortVersions(versionArrays) {
    const allVersions = versionArrays.flatMap(versions => versions.split(" "));
    const combinedVersions = allVersions.filter(version => version.match(/R(1[1-9]|[2-9]\d+)/));
    return [...new Set(combinedVersions)].sort().join(' ');
}

function combineCRCs(schemas) {
    const crcSet = new Set();
    schemas.forEach(({ crc }) => crcSet.add(crc));
    return [...crcSet];
}

function processNonIdenticalMapData(template, schemas, csvData) {
    schemas.forEach(({ crc, schema }) => {
        processSchemaVersions(schema);
        processTemplate(template, crc, schema, csvData);
    });    
}

/* function processSchemas(template, groupedSchemas, csvData) {
    // Iterate over each group of knownSchemas with the same name
    for (let [name, schemas] of Object.entries(groupedSchemas)) {        
        if (areAllMapDataIdentical(schemas)) {            
            processIdenticalMapData(template, schemas, csvData);
        } else {            
            processNonIdenticalMapData(template, schemas, csvData);
        }
    }
} */

function processSchemas(template, groupedSchemas, csvData) {
    // Iterate over each group of knownSchemas with the same name and mapData
    for (let [key, schemas] of Object.entries(groupedSchemas)) {        
        if (areAllMapDataIdentical(schemas)) {            
            processIdenticalMapData(template, schemas, csvData);
        } else {            
            processNonIdenticalMapData(template, schemas, csvData);
        }
    }
}


// Schema Replacement
function getSchemaReplacement(template, crc, schema) {
    // Substitute in the new CRC schema and translator version
    return template.replace(/rulesCrc32: \d+/, `rulesCrc32: ${crc}`)                   
                   .replace(/\/{3} DO NOT CHANGE THE BELOW[\s\S]*\/{3} END DO NOT CHANGE THE ABOVE/g, `/// DO NOT CHANGE THE BELOW - IT IS REPLACED AUTOMATICALLY WITH KNOWN SCHEMAS\n${JSON.stringify(schema, null, 2)}\n    /// END DO NOT CHANGE THE ABOVE`)
                   .replace(/###VERSION###/g, translatorVersion);
}

// Filename Generation
function getFilename(schema) {
    // Extract versions
    const versions = schema.versions.split(" ").sort();
    const vFrom = versions[0];
    const vTo = versions[versions.length - 1];

    // Replace commas with dashes in the schema name
    const nameWithoutCommas = schema.name.replace(/,/g, '-');

    // Check if there's only one version
    if (versions.length === 1) {
        return `${nameWithoutCommas}-${vFrom}.js`;
    }

    // Ensure versions are consecutive
    const allVersions = versions.map(v => parseInt(v.slice(1))).sort((a, b) => a - b);
    const lowestVersion = allVersions[0];
    const highestVersion = allVersions[allVersions.length - 1];
    const missingVersions = [];
    for (let i = lowestVersion + 1; i < highestVersion; i++) {
        if (!allVersions.includes(i)) {
            missingVersions.push(`R${i}`);
        }
    }

    // Construct filename
    if (missingVersions.length === 0) {
        return `${nameWithoutCommas}-${vFrom}-to-${vTo}.js`;
    } else {
        const allVersions = [vFrom, ...missingVersions, vTo].map(v => v.slice(1)).sort((a, b) => a - b);
        return `${nameWithoutCommas}-${allVersions.map(v => `R${v}`).join('-')}.js`;
    }
}

// Check if knownSchemas is defined
if (!knownSchemas) {
    exitWithError("No known schemas found. Exiting.");
}

// Main Function Call
generateTranslators();
