// Very basic script to decode a single uplink. 
// Will not store required context for further downlinks.

import { translate } from "./dots-translator-generated.cjs";

const printUsageAndExit = () => {
    console.log(`Usage:\n  node ${argv[1]} <application CRC> <port> <hexdata> [timestamp]`);
    process.exit(1);
}

const argv = process.argv;
if (argv.length < 5)
    printUsageAndExit("Wrong number of arguments");

const appCRC = parseInt(argv[2]);
if (!isFinite(appCRC))
    printUsageAndExit("CRC was not an integer");

const port = parseInt(argv[3]);
if (!isFinite(port) || port > 127 || port < 0)
    printUsageAndExit("Port appears incorrect");

let buffer;
try {
    buffer = Buffer.from(argv[4], "hex");
} catch (e) {
    printUsageAndExit("Failed to parse hex payload");
}

let when = new Date();
try {
    if (argv[5])
        when = new Date(argv[5]);
} catch (e) {
    printUsageAndExit("Failed to parse date");
}


try {
    const input = {
        vsm:{
            rulesCrc32:appCRC,
        }, 
        encodedData : {
            port,
            hexEncoded : buffer,
            timestamp: when,
        }
    };
    console.log("Input (formatted)", input);
    let {result, timeseries} = translate(input);
    if (result)
        console.log("Translator Result", result);
    if (timeseries)
        console.log("Time series", timeseries);
} catch (e) {
    console.log(e);
    printUsageAndExit("Translation failed");
} 
