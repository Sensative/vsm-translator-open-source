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
    const appkeys = Object.keys(apps);
    const count = appkeys.length;
    if (count == 0)
        throw new Error("Found no vso files");
    console.log(`Found ${count} application revisions\n`);

    let knownSchemas = "const knownSchemas = {\n";
    for (let i = 0; i < count; ++i) {
        const {name, mapData, crc, versions} = apps[appkeys[i]];
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
