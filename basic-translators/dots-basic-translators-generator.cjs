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

// Check if knownSchemas is defined
if (!knownSchemas) {
    console.log("No known schemas found. Exiting.");
    process.exit(1);
}

// Update translator version 
let translatorVersion = JSON.parse(fs.readFileSync("../package.json").toString("utf-8")).version;
if (!translatorVersion) {
    console.log("Failed to read translator version from package.json file");
    process.exit(1);
}

console.log("Translator version: " + translatorVersion);

// Define templates
const templates = [
    { name: 'chirpstack-v3', path: './chirpstack-v3/template/dots-chirpstack-v3-decoder-template.cjs', outputDir: './chirpstack-v3' },
    { name: 'ttn-and-chirpstack-v4',  path: './thethingsnetwork-chirpstack-v4/template/dots-ttn-and-chirpstack-v4-decoder-template.cjs', outputDir: './thethingsnetwork-chirpstack-v4' },
    // Add more templates as needed
];

// Clean the output directories: delete generated .js files
templates.forEach((template) => {
    fs.readdirSync(template.outputDir).forEach(file => {
        if (path.extname(file) === '.js' || path.extname(file) === '.csv') {
            fs.unlinkSync(path.join(template.outputDir, file));
        }
    });  
});

// Iterate over each template
templates.forEach((template) => {
            // Prepare csv row data with header row
            let csvData = [['Filename', 'Product Application', 'Versions', 'CRCs']];

            // Group knownSchemas by name
            const groupedSchemas = {};
            for (let [crc, schema] of Object.entries(knownSchemas)) {
                if (!(schema.name in groupedSchemas)) {
                    groupedSchemas[schema.name] = [];
                }
                groupedSchemas[schema.name].push({crc,schema});
            }

            // Iterate over each group of knownSchemas with the same name
            for (let [name, schemas] of Object.entries(groupedSchemas)) {
                // Check if all mapData are identical within the group
                const uniqueMapData = new Set(schemas.map(({schema}) => schema.mapData));
                if (uniqueMapData.size > 1) {
                    // If mapData is not identical, process each schema separately
                    for (const {crc,schema} of schemas) {
                        // Skip processing if versions are missing or less than R11
                        if (!schema.versions || schema.versions.trim() === "" || !schema.versions.match(/R\d{2,}/)) {
                            console.log(`Skipping schema with CRC ${crc} because versions are missing or less than R11.`);
                            continue;
                        }

                        // Extract version numbers and ensure they are at least R11
                        const versions = schema.versions.split(" ");
                        const versionNumbers = versions.map(v => parseInt(v.slice(1))); // Extract and parse version numbers
                        const minVersion = Math.min(...versionNumbers); // Find the minimum version
                        if (minVersion < 11) {
                            console.log(`Skipping schema with CRC ${crc} because versions are less than R11.`);
                            continue;
                        }

                        // Process schema.mapData - replace \n with +
                        schema.mapData = schema.mapData.replace(/\r\n|\r|\n/g, " + ").slice(0, -3);

                        const templateStr = fs.readFileSync(template.path, 'utf8');
                        const newStr = getSchemaReplacement(templateStr, crc, schema);
                        const newFilename = path.join(template.outputDir, getFilename(schema));

                        // Write modified template to file
                        fs.writeFileSync(newFilename, newStr, 'utf8');
                        // Prepare schema data JSON
                        const schemaJSON = JSON.stringify({
                                [crc]: {
                                    name: schema.name,
                                    versions: schema.versions,
                                    mapData: schema.mapData
                                }
                            }, null, 4)
                            .replace(/"(\w+)":/g, '$1:')
                            .replace(/\n/g, '\n    '); // Add indentation

                        // Replace placeholder in template with schema data JSON
                        const replacedTemplate = newStr.replace(/\/{3} DO NOT CHANGE THE BELOW[\s\S]*\/{3} END DO NOT CHANGE THE ABOVE/g, `/// DO NOT CHANGE THE BELOW - IT IS REPLACED AUTOMATICALLY WITH KNOWN SCHEMA\n    var schema = \n    ${schemaJSON};\n    /// END DO NOT CHANGE THE ABOVE`);


                        // Write modified template to file
                        fs.writeFileSync(newFilename, replacedTemplate, 'utf8');

                        // Prepare csv row data
                        const csvRow = [
                            `${path.join(template.outputDir, path.basename(newFilename))}`,
                            `${schema.name.replace(/,/g, '-')}`,
                            `${schema.versions}`,
                            `${crc}`
                        ];

                        csvData.push(csvRow);
                    }
                } else {
                    // If mapData is identical, process only one schema for the group
                    const {crc,schema} = schemas[0];
                    // Skip processing if versions are missing or less than R11
                    if (!schema.versions || schema.versions.trim() === "" || !schema.versions.match(/R\d{2,}/)) {
                        console.log(`Skipping schema with CRC ${crc} because versions are missing or less than R11.`);
                        continue;
                    }

                    // Extract version numbers and ensure they are at least R11
                    const versions = schema.versions.split(" ");
                    const versionNumbers = versions.map(v => parseInt(v.slice(1))); // Extract and parse version numbers
                    const minVersion = Math.min(...versionNumbers); // Find the minimum version
                    if (minVersion < 11) {
                        console.log(`Skipping schema with CRC ${crc} because versions are less than R11.`);
                        continue;
                    }

                    // Process schema.mapData - replace \n with +
                    schema.mapData = schema.mapData.replace(/\r\n|\r|\n/g, " + ").slice(0, -3);

                    // Log if mapData matches
                    console.log(`MapData matched for schema: ${schema.name}`);

                    const templateStr = fs.readFileSync(template.path, 'utf8');
                    const newStr = getSchemaReplacement(templateStr, crc, schema);
                    const newFilename = path.join(template.outputDir, getFilename(schema));

                    // Write modified template to file
                    fs.writeFileSync(newFilename, newStr, 'utf8');

                    // Prepare schema data JSON
                    const schemaJSON = JSON.stringify({
                            [crc]: {
                                name: schema.name,
                                versions: schema.versions,
                                mapData: schema.mapData
                            }
                        }, null, 4)
                        .replace(/"(\w+)":/g, '$1:')
                        .replace(/\n/g, '\n    '); // Add indentation

                    // Replace placeholder in template with schema data JSON
                    const replacedTemplate = newStr.replace(/\/{3} DO NOT CHANGE THE BELOW[\s\S]*\/{3} END DO NOT CHANGE THE ABOVE/g, `/// DO NOT CHANGE THE BELOW - IT IS REPLACED AUTOMATICALLY WITH KNOWN SCHEMA\n    var schema = \n    ${schemaJSON};\n    /// END DO NOT CHANGE THE ABOVE`);

                    // Write modified template to file
                    fs.writeFileSync(newFilename, replacedTemplate, 'utf8');

                    // Prepare csv row data
                    const csvRow = [
                        `${path.join(template.outputDir, path.basename(newFilename))}`,
                        `${schema.name.replace(/,/g, '-')}`,
                        `${schema.versions}`,
                        `${schemas.map(({ crc }) => crc).join(', ')}`
                    ];

                    csvData.push(csvRow);
                    }
            }

    // Convert csvData to csv string and write to file
    const csvString = csvData.map(row => row.join('|')).join('\n');
    const csvFilename = `1-dots-basic-${template.name}-translators-index.csv`;
    fs.writeFileSync(path.join(template.outputDir, csvFilename), csvString);
});

function getSchemaReplacement(template, crc, schema) {
    // Substitute in the new CRC schema and translator version
    return template.replace(/rulesCrc32: \d+/, `rulesCrc32: ${crc}`)                   
                   .replace(/\/{3} DO NOT CHANGE THE BELOW[\s\S]*\/{3} END DO NOT CHANGE THE ABOVE/g, `/// DO NOT CHANGE THE BELOW - IT IS REPLACED AUTOMATICALLY WITH KNOWN SCHEMAS\n${JSON.stringify(schema, null, 2)}\n    /// END DO NOT CHANGE THE ABOVE`)
                   .replace(/###VERSION###/g, translatorVersion);
}

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