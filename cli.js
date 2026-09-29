// Very basic script to decode a single uplink. 
// Will not store required context for further downlinks.
//
// Example use: 
//  
//   node cli.js 1325798073 1 509b0074110197 2024-11-28T14:57:19.000Z
// 

import { translate } from "./dots-translator-generated.cjs";

const printUsageAndExit = (reason) => {
    if (reason)
        console.log(reason);
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

// Buffer.from() silently drops invalid or trailing hex digits, so validate first
if (!/^([0-9a-fA-F]{2})+$/.test(argv[4]))
    printUsageAndExit("Failed to parse hex payload");
const buffer = Buffer.from(argv[4], "hex");

// new Date() does not throw on bad input, it returns an Invalid Date
const when = argv[5] ? new Date(argv[5]) : new Date();
if (isNaN(when.getTime()))
    printUsageAndExit("Failed to parse date");


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
    // translate() returns null both for bad frames and when no further uplinks are expected
    const translated = translate(input);
    if (!translated) {
        console.log("No result");
        process.exit(0);
    }
    const {result, timeseries} = translated;
    if (result)
        console.log("Translator Result", result);
    if (timeseries)
        console.log("Time series", timeseries);
} catch (e) {
    console.log(e);
    printUsageAndExit("Translation failed");
} 
