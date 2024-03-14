/*
    Copryright (C) 2024, Sensative AB. All rights reserved.
    Author: Dhiraj Paryani

    Note: 

        This is a script which will combine the couple of files 
        TBD
*/
/**
 *  Copryright (C) 2024, Sensative AB. All rights reserved.
 *  Author: Dhiraj Paryani
 *
 * This script generates JavaScript files based on template files specified in the 'template' array. 
 * It reads 'knownSchemas' from the 'dots-translator-generated.cjs' file and then iterates over each schema 
 * to generate a new file for each template.
 *
 * The script first purges existing files in the output directories of each template.
 *
 * The program then reads and manipulates data from the knownSchemas, namely replacing newline characters in 
 * the 'mapData' properties with backslashes. It substitutes schema-specific values into each read-in template, 
 * including a CRC value, the schema data itself, and a translator version read from 'package.json'. The newly 
 * generated content replaces the original template content. The output filename is constructed based on the name 
 * and version of the schema. 
 *
 * Each new JavaScript file is then written to the appropriate output directory corresponding to its template.
 * 
 * Furthermore, the script also generates a CSV file for each template. The CSV files contains the filename,
 * schema name, schema versions, CRC value, and template name for each generated JavaScript file. These CSV files 
 * are also saved in each template's respective output directory.
 *
 * This script is ES6 compatible and utilizes the Node.js File System (fs) module for file handling.
 */

import * as fs from 'fs';
import * as path from 'path';
import { translate } from '../dots-translator-generated.cjs';

// Update translator version 
let translatorVersion = JSON.parse(fs.readFileSync("package.json").toString("utf-8")).version;
if (!translatorVersion) {
    console.log("Failed to read translator version from package.json file");
    process.exit(1);
}

console.log("Translator version: " + translatorVersion);

// Define templates
const templates = [
    { name: 'chirpstack', path: './chirpstack/template/dots-chirpstack-v3-decoder-template.cjs', outputDir: './chirpstack' },
    { name: 'ttn',  path: './thethingsnetwork/template/dots-ttn-decoder-template.cjs', outputDir: './thethingsnetwork' },
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

// Load known schemas from file
const knownSchemas = translate.knownSchemas;

// Iterate over each template
templates.forEach((template) => {
    // Prepare csv/json data
    let csvData = [];

    // Iterate over each schema
    for (let [crc, schema] of Object.entries(knownSchemas)) {
        // Process schema.mapData - replace \n with \
        schema.mapData = schema.mapData.split("\n").join(" \\");

        const templateStr = fs.readFileSync(template.path, 'utf8');
        const newStr = getSchemaReplacement(templateStr, crc, schema);
        const newFilename = path.join(template.outputDir, getFilename(schema));

        // Write modified template to file
        fs.writeFileSync(newFilename, newStr, 'utf8');

        // Prepare csv row data
        csvData.push([newFilename, schema.name, schema.versions, crc, template.name]);
    }

    // Convert csvData to csv string and write to file
    const csvString = csvData.map(row => row.join(',')).join('\n');
    fs.writeFileSync(path.join(template.outputDir, 'index.csv'), csvString);
});

function getSchemaReplacement(template, crc, schema) {
    // Substitute in the new CRC schema and translator version
    return template.replace(/rulesCrc32: \d+/, `rulesCrc32: ${crc}`)
                   .replace(/\/{3} DO NOT CHANGE THE BELOW[\s\S]*\/{3} END DO NOT CHANGE THE ABOVE/g, JSON.stringify(schema, null, 2))
                   .replace(/###VERSION###/g, translatorVersion);
}

function getFilename(schema) {
    // Prepare filename as requested
    const versions = schema.versions.split(" ").sort();
    const vFrom = versions[0];
    const vTo = versions[versions.length - 1];
    return `${schema.name.replace(' ', '-')}-${vFrom}-to-${vTo}.js`;
}