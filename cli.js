// Very basic script to decode a single uplink. Will not store required context for further downlinks.

import { translate } from "./dots-translator-generated.cjs";

const printUsageAndExit = () => {
    console.log(`Usage:\n  node ${argv[1]} <application CRC> <port> <hexdata>`);
    process.exit(1);
}

const argv = process.argv;
if (argv.length !== 5)
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

try {
    let {result, timeseries} = translate({
            vsm:{
                rulesCrc32:appCRC,
            }, 
            encodedData : {
                port,
                hexEncoded : buffer,
                timestamp: new Date(),
            }
        });
    if (result)
        console.log("result", result);
    if (timeseries)
        console.log("time series", timeseries);
} catch (e) {
    console.log(e);
    printUsageAndExit("Translation failed");
} 
