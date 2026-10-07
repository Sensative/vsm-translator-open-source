// Very basic script to decode a single uplink, or to encode a downlink that sets inputs and
// decode one back. Will not store required context for further downlinks.
//
// Example use:
//
//   node cli.js decode 1325798073 1 509b0074110197 2024-11-28T14:57:19.000Z
//   node cli.js encode 40829709 motionThreshold_m_s2=0.2 sampleInterval_s=5
//   node cli.js decode 40829709 B3000000C8A300000005
//

import { readFileSync } from "node:fs";
import { basename } from "node:path";
import { translate } from "./dots-translator-generated.cjs";

const argv = process.argv;

const usage = `Usage:
  node ${argv[1]} decode <application CRC> <port> <hexdata> [timestamp]   an uplink
  node ${argv[1]} decode <application CRC> <hexdata> [--port 2|1] [--raw]  a settings downlink
  node ${argv[1]} decode --vso <file.vso> <hexdata> [--port 2|1] [--raw]
  node ${argv[1]} encode <application CRC> name=value [name=value ...] [options]
  node ${argv[1]} encode --vso <file.vso> name=value [name=value ...] [options]
  node ${argv[1]} encode <application CRC> --list

decode takes an uplink when given a port, and otherwise a settings downlink, read the way the
device reads it (the device's answer on port 2 too). --raw shows the raw values alone. The word
decode may be left out for an uplink: node ${argv[1]} <application CRC> <port> <hexdata>.

Encode options:
  --port 2|1     2 (default): each value written by the VM as a rule would, and answered by
                 the device with the new value. 1: compact, inputs only, no answer.
  --raw          the values are raw, not in the units the documentation gives (translate)
  --any          port 2: also accept outputs and sensors, not only inputs and registers
  --max-size N   largest downlink payload in bytes (default 51, EU868 at DR0)
  --no-legacy    port 1: firmware from dots 8b47e73 on, where a 4-byte value may be anywhere`;

const printUsageAndExit = (reason) => {
    if (reason)
        console.log(reason);
    console.log(usage);
    process.exit(1);
}

const fail = (reason) => {
    console.log(reason);
    process.exit(1);
}

//
// Decode an uplink
//

const uplinkCommand = (args) => {
    if (args.length < 3)
        printUsageAndExit("Wrong number of arguments");

    const appCRC = parseInt(args[0]);
    if (!isFinite(appCRC))
        printUsageAndExit("CRC was not an integer");

    const port = parseInt(args[1]);
    if (!isFinite(port) || port > 127 || port < 0)
        printUsageAndExit("Port appears incorrect");

    // Buffer.from() silently drops invalid or trailing hex digits, so validate first
    if (!/^([0-9a-fA-F]{2})+$/.test(args[2]))
        printUsageAndExit("Failed to parse hex payload");
    const buffer = Buffer.from(args[2], "hex");

    // new Date() does not throw on bad input, it returns an Invalid Date
    const when = args[3] ? new Date(args[3]) : new Date();
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
}

//
// Encode
//
// Two downlink ports set inputs (dots-freertos app-services):
//   Port 2, diagnostics: records of 5 bytes, the reference id and the value as a signed 32-bit
//   integer, big-endian. Written through the VM like a rule's write, so read-only references are
//   refused, and the device answers on port 2 with the new value. Inputs, outputs, registers and
//   sensors.
//   Port 1, outputs: the id's low 6 bits, then the value in 1, 2 or 4 bytes as bits 3-4 of the id
//   say (0 and 1: one byte, 2: two, 3: four), signed. Inputs and outputs only, stored as they are,
//   without an answer. Firmware before dots 8b47e73 misreads a 4-byte value that is not last in
//   the downlink, so by default each downlink carries at most one, at the end.
// Values are raw, before the translate (scale) the documentation's units include.

// The symbol table of an application from its map lines, the ones the translator reads:
//   M input motionThreshold_m_s2 179 0xb3  0.001
const parseSchema = (mapData) => {
    const symbols = [];
    for (const line of mapData.split(/\r\n|\r|\n/)) {
        const m = /^M\s(output|register|sensor|input|variable)\s+(\w+)\s+(\d+)\s+0x\w\w(\s+-?\d+.?\d*)?/.exec(line);
        if (!m)
            continue;
        const id = parseInt(m[3], 10);
        if (isNaN(id) || id < 0 || id > 255)
            continue;
        let scale = m[4] ? parseFloat(m[4]) : 1;
        if (!isFinite(scale) || scale === 0)
            scale = 1;
        symbols.push({ type: m[1], name: m[2], id, scale });
    }
    return symbols;
}

// The application behind a CRC. Port 15 is where a device announces its application, and given the
// CRC alone the translator answers with the application's name and map, so no other way into the
// translator is needed.
const schemaFromCrc = (crc) => {
    const announcement = Buffer.alloc(4);
    announcement.writeUInt32BE(crc >>> 0);
    const translated = translate({ vsm: {}, encodedData: { port: 15, hexEncoded: announcement, timestamp: new Date() } });
    const vsm = translated && translated.result && translated.result.vsm;
    if (!vsm || !vsm.schema)
        return null;
    return { name: vsm.appName, crc, mapData: vsm.schema };
}

// An application straight from its .vso, for one the translator does not know yet
const schemaFromVso = (file) => {
    let text;
    try {
        text = readFileSync(file, "utf8");
    } catch (e) {
        fail(`Cannot read ${file}: ${e.message}`);
    }
    const lines = text.split(/\r\n|\r|\n/);
    const crcLine = lines.find((l) => l.startsWith("C "));
    const crc = crcLine ? parseInt(crcLine.split(/\s+/)[1], 10) : undefined;
    const mapData = lines.filter((l) => l.startsWith("M ")).join("\n");
    return { name: basename(file).replace(/\.vso$/, ""), crc, mapData, fromFile: true };
}

// The application from the CRC given, or from --vso
const resolveSchema = (crcArg, vsoFile) => {
    if (vsoFile)
        return schemaFromVso(vsoFile);
    if (crcArg === undefined)
        printUsageAndExit("Give the application CRC or --vso <file>");
    const crc = parseInt(crcArg);
    if (!isFinite(crc))
        printUsageAndExit("CRC was not an integer");
    const schema = schemaFromCrc(crc);
    if (!schema)
        fail(`The translator does not know application CRC ${crc}. Use --vso <file> with its .vso.`);
    return schema;
}

const appTitle = (schema) => `${schema.name}${schema.crc !== undefined ? ` (${schema.crc})` : ""}`;

// Value bytes on port 1, from bits 3-4 of the id
const port1Size = (id) => [1, 1, 2, 4][(id >> 3) & 3];

const RANGES = { 1: [-128, 127], 2: [-32768, 32767], 4: [-2147483648, 2147483647] };

const bigEndian = (value, size) => {
    const bytes = Buffer.alloc(size);
    if (size === 1) bytes.writeInt8(value);
    else if (size === 2) bytes.writeInt16BE(value);
    else bytes.writeInt32BE(value);
    return bytes;
}

// Which symbols a downlink on this port may set
const writable = (symbol, port, any) => {
    if (port === 1)
        return symbol.type === "input" && symbol.id >= 128 && symbol.id < 192;
    if (symbol.type === "input" || symbol.type === "register")
        return true;
    return any && (symbol.type === "output" || symbol.type === "sensor");
}

// Fill downlinks of at most maxSize bytes, in order. With 'legacy', a 4-byte value on port 1 only
// goes last in a downlink, and only one per downlink.
const pack = (entries, maxSize, legacy) => {
    const downlinks = [];
    const sizeOf = (d) => d.reduce((n, e) => n + e.bytes.length, 0);
    const shorts = legacy ? entries.filter((e) => !e.last) : entries;
    const lasts = legacy ? entries.filter((e) => e.last) : [];
    let current = [];
    for (const e of shorts) {
        if (current.length && sizeOf(current) + e.bytes.length > maxSize) {
            downlinks.push(current);
            current = [];
        }
        current.push(e);
    }
    if (current.length)
        downlinks.push(current);
    for (const e of lasts) {
        const open = downlinks.find((d) => !d.some((x) => x.last) && sizeOf(d) + e.bytes.length <= maxSize);
        if (open)
            open.push(e);
        else
            downlinks.push([e]);
    }
    return downlinks;
}

// Decode a downlink's bytes with the translator and check every value came through as asked.
// The answer on port 2 has the same layout as the request, and so does an uplink on port 1 when
// the id's top two bits are clear.
const roundTrip = (schema, port, downlink) => {
    const vsm = schema.fromFile ? { schema: schema.mapData } : { rulesCrc32: schema.crc };
    const payload = Buffer.concat(downlink.map((e) => e.bytes));
    const translated = translate({ vsm, encodedData: { port, hexEncoded: payload, timestamp: new Date() } });
    for (const e of downlink) {
        let got;
        if (port === 2) {
            const debug = translated && translated.result && translated.result.vsm && translated.result.vsm.debug;
            got = debug ? debug[e.symbol.name] : undefined;
            if (got !== e.raw)
                return `${e.symbol.name}: decoded ${got}, expected raw ${e.raw}`;
        } else {
            const sample = translated && translated.timeseries &&
                translated.timeseries.find((s) => s.value && s.value.output && e.symbol.name in s.value.output);
            got = sample ? sample.value.output[e.symbol.name] : undefined;
            if (got === undefined || Math.abs(got - e.raw * e.symbol.scale) > e.symbol.scale / 2)
                return `${e.symbol.name}: decoded ${got}, expected ${e.raw * e.symbol.scale}`;
        }
    }
    return null;
}

const formatValue = (raw, scale) => {
    const v = raw * scale;
    const decimals = scale < 1 ? Math.min(6, Math.ceil(-Math.log10(scale))) : 0;
    const text = v.toFixed(decimals);
    // Trailing zeros only after a decimal point: 0.920 is 0.92, but 920 stays 920
    return decimals ? text.replace(/0+$/, "").replace(/\.$/, "") : text;
}

const encodeCommand = (args) => {
    let port = 2, raw = false, any = false, legacy = true, list = false, maxSize = 51, vsoFile, crcArg;
    const assignments = [];
    for (let i = 0; i < args.length; ++i) {
        const a = args[i];
        if (a === "--port") port = parseInt(args[++i]);
        else if (a === "--raw") raw = true;
        else if (a === "--any") any = true;
        else if (a === "--no-legacy") legacy = false;
        else if (a === "--list") list = true;
        else if (a === "--max-size") maxSize = parseInt(args[++i]);
        else if (a === "--vso") vsoFile = args[++i];
        else if (a.startsWith("--")) printUsageAndExit(`Unknown option ${a}`);
        else if (a.includes("=")) assignments.push(a);
        else if (crcArg === undefined) crcArg = a;
        else printUsageAndExit(`Unexpected argument ${a}`);
    }
    if (port !== 1 && port !== 2)
        printUsageAndExit("Port must be 1 or 2");
    if (!isFinite(maxSize) || maxSize < 5)
        printUsageAndExit("Max size must be at least 5 bytes");
    const schema = resolveSchema(crcArg, vsoFile);
    const symbols = parseSchema(schema.mapData).filter((s) => writable(s, port, any));

    if (list) {
        console.log(`${appTitle(schema)}, settable on port ${port}:`);
        for (const s of symbols) {
            const size = port === 1 ? `${port1Size(s.id)} byte(s)` : "int32";
            console.log(`  ${s.name.padEnd(36)} ${s.type.padEnd(8)} id ${s.id} (0x${s.id.toString(16)})  ${size.padEnd(9)} scale ${s.scale}`);
        }
        return;
    }
    if (!assignments.length)
        printUsageAndExit("Nothing to encode: give name=value");

    const entries = [];
    for (const assignment of assignments) {
        const [name, text] = assignment.split("=", 2);
        const symbol = symbols.find((s) => s.name === name);
        if (!symbol)
            fail(`${name} cannot be set on port ${port} in ${schema.name}. Settable: ${symbols.map((s) => s.name).join(", ") || "none"}`);
        const value = Number(text);
        if (text.trim() === "" || !isFinite(value))
            fail(`${name}: '${text}' is not a number`);
        const rawValue = raw ? value : Math.round(value / symbol.scale);
        if (!Number.isInteger(rawValue))
            fail(`${name}: a raw value must be an integer, got ${value}`);
        const size = port === 1 ? port1Size(symbol.id) : 4;
        const [lo, hi] = RANGES[size];
        if (rawValue < lo || rawValue > hi)
            fail(`${name}: raw ${rawValue} is outside ${lo}..${hi}` + (port === 1 ? ` (${size} byte(s) on port 1)` : ""));
        if (!raw && Math.abs(rawValue * symbol.scale - value) > symbol.scale * 1e-6)
            console.log(`Note: ${name} = ${value} is sent as ${formatValue(rawValue, symbol.scale)}, the nearest step of ${symbol.scale}`);
        const head = Buffer.from([port === 1 ? (symbol.id & 0x3f) : symbol.id]);
        entries.push({ symbol, raw: rawValue, bytes: Buffer.concat([head, bigEndian(rawValue, size)]), last: port === 1 && size === 4 });
    }

    const downlinks = pack(entries, maxSize, port === 1 && legacy);
    console.log(`${appTitle(schema)}, port ${port}: ` +
                `${downlinks.length} downlink${downlinks.length === 1 ? "" : "s"}`);
    downlinks.forEach((downlink, i) => {
        const payload = Buffer.concat(downlink.map((e) => e.bytes));
        console.log(`  ${i + 1}/${downlinks.length}  fPort ${port}  ${payload.length} bytes  ` +
                    `hex ${payload.toString("hex").toUpperCase()}  base64 ${payload.toString("base64")}`);
        for (const e of downlink)
            console.log(`        ${e.symbol.name} = ${formatValue(e.raw, e.symbol.scale)} (raw ${e.raw})`);
        const problem = roundTrip(schema, port, downlink);
        if (problem)
            fail(`Check failed, the translator decodes this differently: ${problem}`);
    });
    console.log("  Checked: the translator decodes every value back as given.");
    if (port === 2)
        console.log("  The device answers each downlink on port 2 with the values it now has.");
    else if (legacy && entries.some((e) => e.last))
        console.log("  4-byte values go last, one per downlink, for firmware before dots 8b47e73 (--no-legacy packs freely).");
}

//
// Decode a settings downlink: encode the other way round, reading the bytes as the device does
// (the same loops as dots-freertos, port 1 with the 8b47e73 fix). The device's answer on port 2
// has the same layout as the request, so it reads that too.
//

const decodeCommand = (args) => {
    // Three or four plain arguments are an uplink: CRC, port, payload and perhaps a timestamp.
    // The value after --port or --vso belongs to the option, not to the plain arguments.
    const plain = args.filter((a, i) => !a.startsWith("--") && args[i - 1] !== "--port" && args[i - 1] !== "--vso");
    if (!args.includes("--vso") && plain.length >= 3) {
        if (plain.length !== args.length)
            printUsageAndExit("An uplink takes no options: decode <application CRC> <port> <hexdata> [timestamp]");
        uplinkCommand(args);
        return;
    }

    let port = 2, raw = false, vsoFile, crcArg, hex;
    for (let i = 0; i < args.length; ++i) {
        const a = args[i];
        if (a === "--port") port = parseInt(args[++i]);
        else if (a === "--raw") raw = true;
        else if (a === "--vso") vsoFile = args[++i];
        else if (a.startsWith("--")) printUsageAndExit(`Unknown option ${a}`);
        else if (crcArg === undefined && !vsoFile) crcArg = a;
        else if (hex === undefined) hex = a;
        else printUsageAndExit(`Unexpected argument ${a}`);
    }
    if (port !== 1 && port !== 2)
        printUsageAndExit("Port must be 1 or 2");
    if (hex === undefined)
        printUsageAndExit("Give the hex payload to decode");
    // Buffer.from() silently drops invalid or trailing hex digits, so validate first
    if (!/^([0-9a-fA-F]{2})+$/.test(hex))
        printUsageAndExit("Failed to parse hex payload");
    const data = Buffer.from(hex, "hex");
    const schema = resolveSchema(crcArg, vsoFile);
    const symbols = parseSchema(schema.mapData);
    const describe = (id, value) => {
        const symbol = symbols.find((s) => s.id === id);
        if (!symbol)
            return `ref ${id} (0x${id.toString(16)}) = ${value}, not in ${schema.name}'s map`;
        if (raw)
            return `${symbol.name} = ${value}`;
        return `${symbol.name} = ${formatValue(value, symbol.scale)} (raw ${value})  ${symbol.type} id ${id}`;
    };

    console.log(`${appTitle(schema)}, port ${port}: ${data.length} bytes`);
    if (port === 2) {
        if (data.length < 5) {
            // A list of references whose values the device is to send
            console.log("  A read request, the device answers on port 2 with:");
            for (const id of data) {
                if (id === 0)
                    fail("  reference 0: the device stops here and reports BadReference");
                const symbol = symbols.find((s) => s.id === id);
                console.log(`        ${symbol ? symbol.name : `ref ${id} (0x${id.toString(16)})`}`);
            }
            return;
        }
        if (data.length % 5)
            fail("  Not a whole number of 5-byte records: the device rejects it (IllegalCommand)");
        for (let at = 0; at < data.length; at += 5) {
            const id = data[at];
            if (id === 0)
                fail("  reference 0: the device stops here and reports BadReference");
            console.log(`        ${describe(id, data.readInt32BE(at + 1))}`);
        }
        return;
    }

    let pos = 0;
    while (pos < data.length) {
        const head = data[pos++];
        const id = 128 + (head & 0x3f);
        const size = port1Size(head);
        if (pos + size > data.length)
            fail(`  ${size} byte(s) for ref ${id} but only ${data.length - pos} left: the device ignores the rest`);
        const value = size === 1 ? data.readInt8(pos) : size === 2 ? data.readInt16BE(pos) : data.readInt32BE(pos);
        pos += size;
        console.log(`        ${describe(id, value)}`);
        if (size === 4 && pos < data.length)
            console.log("        (a 4-byte value that is not last: firmware before dots 8b47e73 misreads what follows)");
    }
}

const args = argv.slice(2);
if (args[0] === "encode")
    encodeCommand(args.slice(1));
else if (args[0] === "decode")
    decodeCommand(args.slice(1));
else
    uplinkCommand(args);
