const { knownSchemas } = require('../../dots-translator-generated.cjs');
const { processTemplate } = require('./template-utils.cjs');
const { validSensors } = require('./valid-sensors.cjs');
const { combineVersions, isSupportedVersion, versionNumber } = require('./version-utils.cjs');

/**
 * Sorts the mapData rows based on the second and third columns.
 *
 * @param {string} mapData - The mapData string to be sorted.
 * @returns {string} - The sorted mapData string.
 */
function sortMapData(mapData) {
    return mapData.split(' + ') // Split by ' + ' delimiter
        .filter(line => line.trim() !== '') // Remove any empty lines
        .sort((a, b) => {
            const [aFirst, aSecond, aThird] = a.split(/\s+/); // Extract columns for each line
            const [bFirst, bSecond, bThird] = b.split(/\s+/);

            // Sort by second column ('input' or 'output')
            if (aSecond === bSecond) {
                // If second columns are the same, sort by the third column lexicographically
                return aThird.localeCompare(bThird);
            }
            // Otherwise, sort by the second column
            return aSecond.localeCompare(bSecond);
        })
        .join(' + '); // Join back with ' + ' delimiter
}

/**
 * Processes and groups schemas by name and mapData with advanced merging conditions.
 * 
 * @returns {Object} An object containing grouped schemas.
 */
function processAndGroupSchemas() {
    const schemaGroupsByName = filterAndFormatSchemas();
    const groupedSchemas = {};

    // Process each schema name group
    for (const schemas of Object.values(schemaGroupsByName)) {
        mergeSchemasByName(schemas, groupedSchemas);
    }

    return groupedSchemas;
}

/**
 * Filters schemas by version and formats mapData.
 * 
 * @returns {Object} An object grouping schemas by their name.
 */
function filterAndFormatSchemas() {
    const schemaGroupsByName = {};   

    for (let [crc, knownSchema] of Object.entries(knownSchemas)) {
        // Ensure the schema name is allowed and it has a version of R11 or above, or a generation II version
        if (
            !validSensors.includes(knownSchema.name) ||
            !knownSchema.versions ||
            !knownSchema.versions.split(/\s+/).some(isSupportedVersion)
        ) {
            continue; // Skip if no version is supported or name is not allowed
        }

        // Copy so that every template run starts from the unmodified knownSchemas
        const schema = { ...knownSchema };

        // Format mapData
        schema.mapData = schema.mapData
            .replace(/\r\n|\r|\n/g, " + ")
            .trim()
            .replace(/\s+\+$/g, "");
        schema.mapData = sortMapData(schema.mapData);

        // Skip schemas without 'output' in mapData
        if (!/M\s+output\s+/.test(schema.mapData)) {
            continue;
        }

        // Rename "Square-comfort-sound" to "Square-sound"
        if (schema.name === "Square-comfort-sound") {
            schema.name = "Square-sound";
        }

        const nameKey = schema.name;
        if (!(nameKey in schemaGroupsByName)) {
            schemaGroupsByName[nameKey] = [];
        }
        schemaGroupsByName[nameKey].push({ crc, schema });
    }

    return schemaGroupsByName;
}

/**
 * Parses mapData into individual items with column breakdown.
 * 
 * @param {string} mapData - The mapData string to parse.
 * @returns {Array} An array of parsed mapData items.
 */
function parseMapDataItems(mapData) {
    return mapData.split(" + ").map(item => {
        const [col1, col2, col3, col4, col5, col6] = item.split(/\s+/);
        return { col1, col2, col3, col4, col5, col6, original: item };
    });
}

/**
 * Checks if two mapData items are compatible for merging.
 * 
 * @param {Object} item1 - First mapData item.
 * @param {Object} item2 - Second mapData item.
 * @returns {string} "exact_match" if compatible, "col3_mismatch" if col3 (name) or
 * col4 (id) matches but the rest of the mapping differs, "unique" if no matches.
 */
function checkMergeCompatibility(item1, item2) {
    // C lines only name the schema's own CRC, so they never conflict with another schema
    if (item1.col1 === "C" || item2.col1 === "C") {
        return item1.original === item2.original ? "exact_match" : "unique";
    }
    if (
        item1.col2 === item2.col2 &&
        item1.col3 === item2.col3 &&
        item1.col4 === item2.col4 &&
        item1.col5 === item2.col5 &&
        item1.col6 === item2.col6
    ) {
        return "exact_match"; // Exact match in columns 2-6
    }
    if (
        item1.col3 === item2.col3 &&
        (item1.col4 !== item2.col4 || item1.col5 !== item2.col5 || item1.col6 !== item2.col6)
    ) {
        return "col3_mismatch"; // Only column 3 matches but others differ
    }
    if (item1.col4 === item2.col4 && item1.col3 !== item2.col3) {
        // The translator's symbol table is keyed by id, so one id can only carry one name
        return "col3_mismatch";
    }

    // No matches at all, unique items
    return "unique";
}

/**
 * Merges schemas with the same name based on mapData compatibility.
 * 
 * @param {Array} schemas - Array of schemas with the same name.
 * @param {Object} groupedSchemas - The grouped schemas object to update.
 * @returns {Object} Merged mapData set and CRCs.
 */
function mergeSchemasByName(schemas, groupedSchemas) {
    let mergedMapDataSet = new Set();
    let mergedCRCs = [];

    function processSchemas(schemas, groupKey) {
        let localMergedMapDataSet = new Set();
        let localMergedCRCs = [];
        let col3MismatchSchemas = [];

        for (let { crc, schema } of schemas) {
            const mapDataItems = parseMapDataItems(schema.mapData);

            // Collect unique items from current schema
            let uniqueItems = [];
            let discardSchema = false;

            // Iterate over current mapDataItems
            for (let mapDataItem of mapDataItems) {
                if (discardSchema) break;

                let foundMatch = false;

                // Check against already merged items
                for (let mergedItem of localMergedMapDataSet) {
                    const compatibility = checkMergeCompatibility(mapDataItem, mergedItem);
                    if (compatibility === "exact_match") {
                        foundMatch = true;
                        break;
                    } else if (compatibility === "col3_mismatch") {
                        discardSchema = true;
                        break;
                    }
                }

                // If no match was found and schema is not discarded, add to uniqueItems
                if (!foundMatch && !discardSchema) {
                    uniqueItems.push(mapDataItem);
                }
            }

            // If schema is discarded, add it to col3MismatchSchemas and continue to the next schema
            if (discardSchema) {
                col3MismatchSchemas.push({ crc, schema });
                continue;
            }

            // Handle unique items by adding them to the merged set
            for (let uniqueItem of uniqueItems) {
                localMergedMapDataSet.add(uniqueItem);
            }

            localMergedCRCs.push(crc);
        }

        // Convert Set to Array for the final return
        const finalMergedArray = Array.from(localMergedMapDataSet);

        // Create a new group key for the merged schemas
        if (finalMergedArray.length > 0) {
            const mergedMapData = sortMapData(finalMergedArray.map(item => item.original).join(" + "));
            const mergedKey = `${groupKey}_merged_${mergedMapData}`;

            if (!(mergedKey in groupedSchemas)) {
                groupedSchemas[mergedKey] = [];
            }

            // List the group in CRC order, so the output does not depend on the merge order
            for (let crc of localMergedCRCs.sort((a, b) => a - b)) {
                // Find the schema and replace its mapData with mergedMapData
                const schema = schemas.find(s => s.crc === crc).schema;
                schema.mapData = mergedMapData;
                groupedSchemas[mergedKey].push({ crc, schema });
            }
        }

        // Recursively process col3MismatchSchemas
        if (col3MismatchSchemas.length > 0) {
            processSchemas(col3MismatchSchemas, `${groupKey}_col3_mismatch`);
        }
    }

    // Merge in release order, so a schema groups with its neighbouring versions before later, conflicting ones
    const schemasByOldestVersion = [...schemas].sort((a, b) => oldestVersion(a.schema) - oldestVersion(b.schema));
    processSchemas(schemasByOldestVersion, schemas[0].schema.name);

    return { mergedMapDataSet: Array.from(mergedMapDataSet), mergedCRCs };
}

/**
 * Returns the oldest supported version number of a schema.
 *
 * @param {Object} schema - The schema object.
 * @returns {number} The lowest supported version number.
 */
function oldestVersion(schema) {
    return versionNumber(combineVersions(schema.versions.split(" "))[0]);
}

/**
 * Processes the schema versions by filtering out invalid versions and combining them.
 * @param {Object} schema - The schema object to process.
 */
function processSchemaVersions(schema) {
    schema.versions = combineVersions(schema.versions.split(" ")).join(' ');
}

/**
 * Combines and sorts an array of version arrays, filtering out unsupported versions.
 * @param {string[]} versionArrays - An array of version arrays.
 * @returns {string} - A string containing the combined and sorted versions.
 */
function combineAndSortVersions(versionArrays) {
    return combineVersions(versionArrays.flatMap(versions => versions.split(" "))).join(' ');
}

/**
 * Combines the CRCs from an array of schemas into a unique set.
 *
 * @param {Array<Object>} schemas - An array of schemas containing a 'crc' property.
 * @returns {Array<number>} - An array of unique CRC values.
 */
function combineCRCs(schemas) {
    const crcSet = new Set();
    schemas.forEach(({ crc }) => crcSet.add(crc));
    return [...crcSet];
}

/**
 * Processes identical map data using the provided template, schemas, and csvData.
 * @param {Object} template - The template object.
 * @param {Array} schemas - An array of schema objects.
 * @param {Array} csvData - An array of CSV data.
 */
function processIdenticalMapData(template, schemas, csvData) {
    const { crc, schema } = schemas[0];
    schema.versions = combineAndSortVersions(schemas.map(({ schema }) => schema.versions));
    const relatedCRCs = schemas.map(({ crc }) => crc);
    processTemplate(template, crc, schema, csvData, relatedCRCs); // Process template

    // Combine CRCs for schemas with the same name
    const combinedCRCs = combineCRCs(schemas);
    // Update the last item in csvData with combined CRCs
    if (combinedCRCs.length > 0) {
        csvData[csvData.length - 1][3] = combinedCRCs.join('|');
    }
}

/**
 * Processes non-identical map data using the provided template, schemas, and csvData.
 * 
 * @param {object} template - The template object.
 * @param {Array<object>} schemas - An array of schema objects.
 * @param {object} csvData - The csv data object.
 */
function processNonIdenticalMapData(template, schemas, csvData) {
    schemas.forEach(({ crc, schema }) => {
        processSchemaVersions(schema);
        processTemplate(template, crc, schema, csvData, crc);
    });    
}

/**
 * Processes the schemas based on the provided template, grouped schemas, and CSV data.
 * 
 * @param {Object} template - The template object.
 * @param {Object} groupedSchemas - The grouped schemas object.
 * @param {Array} csvData - The CSV data array.
 */
function processSchemas(template, groupedSchemas, csvData) {
    // Iterate over each group of knownSchemas with the same name and mapData
    for (let [key, schemas] of Object.entries(groupedSchemas)) {                
        if (schemas.length > 1) { 
            processIdenticalMapData(template, schemas, csvData);
        } else {            
            processNonIdenticalMapData(template, schemas, csvData);
        }
    }
}

module.exports = {
    processAndGroupSchemas,
    filterAndFormatSchemas,
    parseMapDataItems,
    checkMergeCompatibility,
    mergeSchemasByName,
    processSchemaVersions,
    combineVersions,    
    combineAndSortVersions,
    combineCRCs,
    processIdenticalMapData,
    processNonIdenticalMapData,
    processSchemas
};