/**
 *  Copryright (C) 2024, Sensative AB. All rights reserved.
 *  Author: Dhiraj Paryani
 *
 * This module automates the generation of Basic Translators' JavaScript files by leveraging templates defined in an 
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

const { deleteExistingFiles, generateCSV, sortCsvData } = require('./utils/file-utils.cjs');
const { processAndGroupSchemas, processSchemas } = require('./utils/schema-utils.cjs');

/**
 * Main Function: Generates basic translators for different templates.
 * 
 */
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
        const groupedSchemas = processAndGroupSchemas();        
        //console.log(`Grouped Schemas: ${JSON.stringify(groupedSchemas, null, 2)}.`); //debug

        // Schema Validation and Processing
        processSchemas(template, groupedSchemas, csvData);

        // Sort CSV data
        const sortedCsvData = sortCsvData(csvData);

        // Generate CSV file
        generateCSV(template.name, template.outputDir, sortedCsvData);
  
    });
    console.log(`Ready.`);
}

// Main Function Call
generateTranslators();