/*
    Copryright (C) 2023, Sensative AB. All rights reserved.
    Author: Lars Mats

    Note: 

        This is a script which will combine the various files of dots-builds/Rx/RCx+builds/rules folders, 
        calculate their CRCs, and create a map over these. That map will then be generated as a selection
        of symbol tables in a special translator which knows all released apps for the different dots products.

        This is a sad workaround until platforms allow translators access to the required metadata.

        Required gits for this to work (the referenced gits are currently Sensative proprietary, instead use the 
        other files of this project - the resulting file is generated-translator.cjs)

        ../dots-builds
        ../virtual-sensor-machine
*/

const GENERATED_FILE = 'dots-translator-generated.cjs';

const vsoReadFile = require ('../virtual-sensor-machine/vso-file-reader/vsoReadFile').vsoReadFile;
const fs = require('fs');

const hardcodedAdditionalSchemas = {
    777944170 : {
        name: `dots,temp,radar-v5-experimental`,
        versions: `R0-update`,
        mapData: `M output temp 176 0xb0 0.01 
M output averageTemp 177 0xb1 0.01 
M input tempHysteresis 178 0xb2 0.01 
M input averageTempIntervalMinutes 160 0xa0 1 
M output tempAlarm 128 0x80 1 
M input tempAlarmLowLevel 161 0xa1 1 
M input tempAlarmHighLevel 162 0xa2 1 
M output amplitude 144 0x90 1 
M output distance 145 0x91 0.01 
M output occupied 129 0x81 1 
M input amplitudeHysteresis 179 0xb3 1 
M input distanceHysteresis 163 0xa3 0.01 
M output batteryPercent 164 0xa4 1 
M output underVoltage 165 0xa5 1
`
    },
};

const generate = () => {
    if (!fs.existsSync('../dots-builds'))
        throw new Error("The ../dots-builds git is required");

    // The following is the map of CRC to { crc, name, mapData, versions }

    var apps = {}

    const processVsoFile = (path, name, version) => {
        // console.log("Found VSO file " + path);
        let {mapData, crc} = vsoReadFile(path);
        let versions = version ? version : "";
        if (apps[crc]) {
            versions = apps[crc].versions;
            if (apps[crc].name !== name)
                throw new Error(`Same CRC for ${apps[crc].name} and ${name}: ${crc}`);
            if (version) {
                let alreadyVersions = apps[crc].versions.split(" ");
                let found = false;
                for (let i = 0; i < alreadyVersions.length; ++i) {
                    if (alreadyVersions[i] === version) {
                        found = true; break;
                    }
                }
                if (!found)
                    versions = (version + " " + apps[crc].versions).trim();
            } 
        }
        apps[crc] = {mapData, name, crc, versions};
    }

    const scanFolder = (rootfolder, registerVersion, version) => {
        // console.log("Scanning " + rootfolder  + "...");
        let items = fs.readdirSync(rootfolder);
        for (let i = 0; i < items.length; ++i) {
            if (fs.lstatSync(rootfolder + "/" + items[i]).isDirectory())
                scanFolder(rootfolder + "/" + items[i], false, registerVersion ? items[i] : version);
            else {
                if (items[i].endsWith(".vso")) {
                    processVsoFile(rootfolder + "/" + items[i], items[i].replace('.vso', ''), version);
                }
            }
        }
    }

    const scanBuilds = (rootfolder) => {
        scanFolder(rootfolder+'/candidates', false);
        scanFolder(rootfolder+'/builds', false);
        scanFolder(rootfolder+'/releases', true);
    }

    scanBuilds('../dots-builds');
    let appkeys = Object.keys(apps);
    appkeys = appkeys.sort((a,b)=>a>b);
    const count = appkeys.length;
    if (count == 0)
        throw new Error("Found no vso files");
    console.log(`Found ${count} application revisions.`);
    console.log(`Adding on ${Object.keys(hardcodedAdditionalSchemas).length} additional hardcoded schemas\n`);

    let knownSchemas = "const knownSchemas = {\n";
    for (let i = 0; i < count; ++i) {
        const {name, mapData, crc, versions} = apps[appkeys[i]];

        if (hardcodedAdditionalSchemas[crc]) {
            throw new Error("Hardcoded schema " + hardcodedAdditionalSchemas[crc].name + " has same CRC as schema " + name);
        }

        knownSchemas += `\n
            ${crc}: {
                name: "${name}",
                versions: "${versions}",
                mapData: \`${mapData}\`,
            }, 
        `;
    }
    knownSchemas += "  // Additional known schemas:\n";
    const hardcodedSchemaCrcs = Object.keys(hardcodedAdditionalSchemas);
    for (let i = 0; i < hardcodedSchemaCrcs.length; ++i) {
        const crc = hardcodedSchemaCrcs[i];
        const {name, mapData, versions} = hardcodedAdditionalSchemas[crc];
        knownSchemas += `\n
            ${crc}: {
                name: "${name}",
                versions: "${versions}",
                mapData: \`${mapData}\`,
            }, 
        `;
    }
    knownSchemas += "};\n"

    // Read the open-source translator and expand it
    let defaultTranslator = fs.readFileSync('dots-translator.template.cjs').toString();
    let extendedTranslator = defaultTranslator.replace('const knownSchemas = {};', knownSchemas);
    fs.writeFileSync(GENERATED_FILE, extendedTranslator);
    console.log("Generated new translator " + GENERATED_FILE);
}

exports.generate = generate;
generate();
