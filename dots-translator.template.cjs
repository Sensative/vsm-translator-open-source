/*
The MIT License (MIT)

Copyright (c) 2022 Sensative AB

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

// Copyright (C) 2021-2023, Sensative AB, All rights reserved
// Author: Lars Mats
//


// Refer to VSM documentation for encoding reference
function translate(iotnode) {

/// DO NOT CHANGE THE BELOW - IT IS REPLACED AUTOMATICALLY WITH KNOWN SCHEMAS
const knownSchemas = {};
/// END DO NOT CHANGE THE ABOVE

// Response to a reference value query
    const decodeReferences = (iotnode, symbolTable, data, time) => {
        let result = {};
        for (let used = 0; used < data.length; ) {
            const ref = data[used++];
            let name = "";
            const val = (data[used++]<<24) | (data[used++] << 16) | (data[used++] << 8) | (data[used++]);
            if (symbolTable.hasOwnProperty(ref)) {
                name = symbolTable[ref].name;
            } else
                name = 'ref:' + ref;
            result[name] = val;
        }
        return { result: { vsm: { debug: result }}};
    };

    // Control status update
    const decodeControl = (iotnode, symbolTable, data, time) => {
        const vmError   = data[0];
        const vmStatus  = data[1];
        return { result: { vsm: {vmError, vmStatus}}};
    }

    const decodeCrash = (iotnode, symbolTable, data, time) => {
        const index = (data[0]<<8) | data[1];
        let bytes = "";
        for (let i = 2; i < data.length; ++i) {
            let byte = data[i].toString(16);
            if (byte.length == 1)
                byte = "0" + byte;
            bytes += byte;
        }
        return { result: { vsm: {crash: {index, bytes} }}};
    }

    // Diagnostics output
    const decodeDiagnostics = (iotnode, symbolTable, data, time) => {
        if(data.length === 2)
            return decodeControl(iotnode, symbolTable, data, time);
        if (data.length % 5 === 0)
            return decodeReferences(iotnode, symbolTable, data, time);
        throw new Error("Failed to decode diagnostics data");
    }

    // Link Control service output
    const decodeLinkControl = (iotnode, symbolTable, data, time) => {
        if (data.length == 3) {
            const linkControlIndex = data[0];
            const linkControlDL_RSSI = data[1]  << 24 >> 24; // Sign extension
            const linkControlDL_SNR  = data[2]  << 24 >> 24; // Sign extension
            return { result: { vsm: {linkControl: {linkControlIndex, linkControlDL_RSSI, linkControlDL_SNR, adr:0, timestamp:new Date(time)}}}};
        } else if (data.length == 2) {
            const linkControlDL_RSSI = data[0]  << 24 >> 24;// Sign extension
            const linkControlDL_SNR  = data[1]  << 24 >> 24;// Sign extension
            return { result: { vsm: {linkControl: {linkControlIndex:-1, linkControlDL_RSSI, linkControlDL_SNR, adr:1, timestamp:new Date(time)}}}};
        }
        throw new Error("Failed to decode link control message")
    }

    // Link Control service output
    const translateCustomizationStatus = (byte) => {
        switch(byte) {
            case 0: return "None";
            case 1: return "Applied";
            case 2: return "Error";
            case 3: return "Dirty";
            default: return "Unknown";
        }
    }
    const decodeCustomization = (iotnode, symbolTable, data, time) => {
        let status;
        if (data.length == 1) {
            status = translateCustomizationStatus(data[0]);
            return { result: { vsm: {customization: {status, customizedAppCRC:0, customizationCRC:0, timestamp:new Date(time) }}}};
        } else if (data.length == 9) {
            let customizationCRC = data[0]<<24 | data[1]<<16 | data[2]<<8 | data[3];
            if (data[0]&0x80)
                customizationCRC+=0x100000000;    
            let customizedAppCRC = data[4]<<24 | data[5]<<16 | data[6]<<8 | data[7];
            if (data[4]&0x80)
                customizedAppCRC+=0x100000000;
            status = translateCustomizationStatus(data[8]);
            return { result: { vsm: {customization: {status, customizedAppCRC, customizationCRC, timestamp:new Date(time) }}}};
        }
        throw new Error("Failed to decode link control message")
    }
    
    // Rule update - CRC value (+build time, +version)
    const decodeRule = (iotnode, symbolTable, data, time) => {
        let rulesCrc32 = ((data[0]) << 24) | (data[1] << 16) | (data[2] << 8) | data[3];
        if (data[0]&0x80)
            rulesCrc32+=0x100000000;

        let schemaInfo = {}
        if (knownSchemas[rulesCrc32]) {
            // there is a known schema for this node, use it [TBD how to handle conflicting CRCs]
            schemaInfo = { appName: knownSchemas[rulesCrc32].name, schema: knownSchemas[rulesCrc32].mapData, appVersions: knownSchemas[rulesCrc32].versions}
        } else {
            console.log("Unknown application with CRC32: " + rulesCrc32);
        }

        const translatorVersion = "###VERSION###"; // Replaced when loading into yggio
        if (data.length<8)
            return {result: {vsm: {...schemaInfo, rulesCrc32, translatorVersion}}};
        // We have at least 8 bytes, a build timestamp follows
        let buildTime = ((data[4] << 24) | (data[5] << 16) | (data[6] << 8) | data[7]) & 0xfffffffc;
        let buildType = 0;
        if (buildTime > 1665684561) // Time when this feature was introduced
            buildType = data[7] & 0x3;
        let buildDate = new Date(1000*buildTime);
        if (data.length<12)
            return {result: { vsm: {...schemaInfo, rulesCrc32, buildDate, buildType, translatorVersion}}}
        // We have 12 bytes or more, fill in the version as well
        let buildGitVersion = "";
        for (let pos = 8; pos < data.length; ++pos)
            buildGitVersion += String.fromCharCode(data[pos]);
        return {result: { vsm: {...schemaInfo, rulesCrc32, buildDate, buildType, buildGitVersion, translatorVersion}}};
    }

    const decodeMesh = (iotnode, symbolTable, data, time) => {
        if (data.length < 10)
            return {result: {} };

        let serial = ((data[0] << 24) | (data[1] << 16) | (data[2] << 8) | data[3]) & 0xffffffff;
        let age_s  = ((data[4] << 24) | (data[5] << 16) | (data[6] << 8) | data[7]) & 0xffffffff;
        let port   = data[8];
        let len    = data[9]; // Included since there may be multiple messages packed in one in some future
        let pos = 10;
        let hex = '';
        for (let i = 0; i < len; ++i) {
            let byte = data[i+pos].toString(16);
            if (byte.length < 2)
                byte = "0"+byte;
            hex += byte;
        }
        const producedTimestamp = new Date((new Date(time)).getTime()-1000*age_s);
        const receivedTimestamp = new Date(time);
        let obj = {
            producedTimestamp, // When was the uplink created
            receivedTimestamp,                             // When was it translated
            port,
            len,
            hex,
            serial,
        }
        // The mesh data is both recorded in the result object, and in the yggio-specific additionalDeviceUpdates
        // field (which should magically update nodes with the set secret)
        let result = {mesh: {} };
        result.mesh[serial] = obj;
        return { 
            result, 
            additionalDeviceUpdates : [ {
                identifier: {secret:serial},
                result: { 
                    encodedData : {
                        port: port,
                        hexEncoded: hex,
                        timestamp: producedTimestamp,
                    }
                }
            }]
        }
    }

    // Decode uint32_8_t compressed time format
    const decode_uint32_8_t = (fp) => {
        const exp = (fp >> 3);
        const base = fp&0x7;
        if (0 == exp)
            return base;
        else if (1 == exp) // compressed
            return (8 + base);
        else // Round to center of interval
            return ((8 + base) << (exp-1)) + (1 << (exp-2));
    }

    // Decode int32_16_t compressed value format
    const decode_int32_16_t = (fp) => {
        const neg  = fp & 0x8000;
        const exp  = (fp >> 10) & 0x1f;
        const base = fp & 0x3ff
        if (0 == exp)
            return neg ? -base : base;
        else if (1 == exp) { // compressed 
            const value = (0x400 + base);
            return neg ? -value : value;
        }
        else { // Round to center of interval
            const value = ((0x400 + base) << (exp-1)) + (1 << (exp-2));
            return neg ? -value : value;
        }
    }

    const encode_uint8_hex = (hex) => {
        let byte = hex.toString(16);
        if (byte.length === 1)
            byte = "0" + byte;
        return byte;
    }

    const encode_int8_hex = (hex) => {
        let byte = (hex&0xff).toString(16);
        if (byte.length === 1)
            byte = "0" + byte;
        return byte;
    }

    // Determine latest value on each field in time series, return that as a result object
    const createResultFromTimeSeries = (iotnode, series) => {
        let timestamps = iotnode.timestamps;
        let result = { output: {}, timestamps: {}};
        if (!timestamps)
            timestamps = {}
        series.map(sample => {
            // Each sample has a field called value and a field called timestamp
            const sampleTimestamp = sample.timestamp;
            const sampleValues = sample.value;
            if (!sampleValues.output)
                throw new Error("The sample does not have output structure");
            // Now check each field of this output (should be just one)
            let keys = Object.keys(sampleValues.output);
            for (let k = 0; k < keys.length; ++k) {
                let name = keys[k];
                if (timestamps.hasOwnProperty(name)) {
                    let lastSampleTime = new Date(timestamps[name]);
                    if (lastSampleTime.getTime() < sampleTimestamp.getTime()) {
                        timestamps[name] = sampleTimestamp; // Avoid overwrite from this series
                        result.timestamps[name] = sampleTimestamp;
                        result.output[name] = sampleValues.output[name];
                    }
                    else {
                        // Do not touch this output, there is a later value present already
                    }
                } else {
                    // No previous timestamp, include this value and set a timestamp
                    timestamps[name] = sampleTimestamp; // Avoid overwrite from this series
                    result.timestamps[name] = sampleTimestamp;
                    result.output[name] = sampleValues.output[name];
                }
            }
        });
        return result;
    }

    // Output from running ruleset
    const decodeOutputCombined = (iotnode, symbolTable, data, time, compressed) => {
        let pos = 0;
        let time_s = Math.floor(time / 1000);
        let timeseries = [];
        while (pos < data.length) {
            if (data.length < pos + 1) {
                console.log("Incomplete message (pos: " + pos + " len: " + data.length + ")");
                return null;
            }
            const head = data[pos++];
            const kind = head & 0x3f;
            let timesize = 0;
            let datasize = 1; // single byte
            if (!compressed) {
                switch ((head>>6) & 0x3) {
                    case 0: break;
                    case 1: timesize = 1; break;
                    case 2: timesize = 2; break;
                    case 3: timesize = 4; break;
                }
            } else { // Compressed format
                timesize = (head & 0x80) ? 1 : 0;
            }
            let confirmed = true;
            let decompressvalue = false;
            if (compressed && ((head & 0x40) == 0)) {
                datasize = 0; // No data representation, value is 0
                confirmed = (head & 0b100000) ? false : true;
            } else {
                switch ((head>>3) & 0b111) {
                case 0: confirmed = true;  datasize = 1; break;
                case 1: confirmed = true;  datasize = 1; break;
                case 2: confirmed = true;  datasize = 2; break;
                case 3: confirmed = true;  if (compressed) { datasize = 2; decompressvalue=true; } else datasize = 4; break;
                case 4: confirmed = false; datasize = 1; break;
                case 5: confirmed = false; datasize = 1; break;
                case 6: confirmed = false; datasize = 2; break;
                case 7: confirmed = false; if (compressed) { datasize = 2; decompressvalue=true; } else datasize = 4; break;
                }
            }

            // Check that enough data remain
            let age_s = 0;
            let age_ms = 0;
            if (pos+timesize+datasize > data.length) {
                console.log("Incomplete message (pos: " + pos + " datasize: " + datasize + " timesize: " + timesize +" len: " + data.length + ")");
                return null;
            }

            switch (timesize) {
                case 4: age_s = (data[pos+0]<<24) | (data[pos+1]<<16) | (data[pos+2]<<8) | (data[pos+3]); pos+=4; break;
                case 2: age_s = (data[pos+0]<<8) | (data[pos+1]); pos+=2; break;
                case 1: age_s = compressed ? decode_uint32_8_t(data[pos])*2 : (data[pos]); pos++; break;
                case 0: age_ms += 1; break; // Adding a syntetic time difference because Yggio will not record multiple events at same time
            }
            time_s -= age_s; // Go back in time

            let value = 0;
            switch (datasize) {
                case 4: 
                    value = (data[pos+0]<<24) | (data[pos+1]<<16) | (data[pos+2]<<8) | (data[pos+3]); pos+=4; break; // TODO: Handle negative values
                case 2: 
                    if (decompressvalue) {
                        value = decode_int32_16_t(data[pos+0]<<8) | (data[pos+1]); pos+=2; break; 
                    } else {
                        value = ((data[pos+0]<<8) | (data[pos+1])) << 16 >> 16; pos+=2; break;
                    }
                case 1: 
                    value = (data[pos] << 24 >> 24); pos++; break;
            }

            if (symbolTable.hasOwnProperty(kind+128)) {
                const name = symbolTable[kind+128].name;
                const scale = symbolTable[kind+128].scale;

                let valuestruct = {};
                valuestruct[name] = value*scale;
                let sample = {
                    timestamp: new Date(time_s*1000 + age_ms),
                    value : { output: valuestruct },
                };
                // console.log(sample);
                timeseries.push(sample);
            } else {
                console.log("No symbol table entry for message id " + (kind+128) + " value " + value);
            }
        }
        const retval = {timeseries, result: createResultFromTimeSeries(iotnode, timeseries) };
        return retval;
    }

    const decodeOutput = (iotnode, symbolTable, data, time) => decodeOutputCombined(iotnode, symbolTable, data, time, false);
    const decodeCompressed = (iotnode, symbolTable, data, time) => decodeOutputCombined(iotnode, symbolTable, data, time, true);

    const addSemtechGnssObject = (result) => {
        let semtechObject = {
            msgtype: "gnss",
            gnss_capture_time: result.gnss.captureGpsTime,
            payload: result.gnss.completeHex,
        };
        // Note: Should probably be NaN instead of 0,0 as illegal position
        if (result.gnss.assistanceLatitude != 0.0 && result.gnss.assistanceLongitude != 0.0)
            semtechObject.gnss_assist_position = [result.gnss.assistanceLatitude, result.gnss.assistanceLongitude],

        result.semtechEncoded = semtechObject;
    }

    const encodeSemtechWifi = (wifi) => {
        let hex = "01"; // Tag indicating we have RSSI values included
        const aps = wifi.wifiAccessPoints;
        for (let i = 0; i < aps.length; ++i) {
            const ap = aps[i];
            const hexRSSI = encode_int8_hex(ap.signalStrength);
            let hexSSID  = "";
            hexSSID+=ap.macAddress.substring(0,2);
            hexSSID+=ap.macAddress.substring(3,5);
            hexSSID+=ap.macAddress.substring(6,8);
            hexSSID+=ap.macAddress.substring(9,11);
            hexSSID+=ap.macAddress.substring(12,14);
            hexSSID+=ap.macAddress.substring(15,17);
            hex+= hexRSSI + hexSSID;
            // console.log("Rssi", ap.signalStrength, hexRSSI, "Ssid", hexSSID);
        }
        return hex;
    }

    const addSemtechWifiObject = (result) => {
        let semtechObject = {
            msgtype: "wifi",
            payload: encodeSemtechWifi(result.wifi),
            timestamp: result.wifi.timestamp.getTime()/1000,
        };
        result.semtechEncoded = semtechObject;
    }

    const decodeGnssStream = (iotnode, symbolTable, data, time) => {
        const UNIX_GPS_EPOCH_OFFSET = 315964800;
        let pos = 0;
        let result = { gnss: {} };
        const bIsStreamHeader = data[0] & 0x80 ? true : false;
        let gnssCaptureGpsTime = 0;
        if (bIsStreamHeader) {
            if (data.length < 10) {
                // This is not good enough data, discard it
                console.log("Too small stream header");
                return {};
            }
            const bContainsAssistPosition = bIsStreamHeader && (data[0] & 0x40);
            const bWasAutonomousScan = bIsStreamHeader && (data[0] & 0x20);
            result.gnss.autonomous = bWasAutonomousScan ? 1 : 0;
            result.gnss.streamSize = ((data[0]&0x1f) << 8) | data[1];
            pos+=2;

            gnssCaptureGpsTime = (data[pos]<<24) | (data[pos+1] << 16) | (data[pos+2] << 8) | (data[pos+3]);  
            result.gnss.captureGpsTime = gnssCaptureGpsTime;
            pos+=4;

            if (bContainsAssistPosition) {
                const lat16 = ((data[pos] & 0x80 ? 0xFFFF<<16 : 0) | (data[pos] << 8) | data[pos+1]);
                pos+=2;
                const lon16 = ((data[pos] & 0x80 ? 0xFFFF<<16 : 0) | (data[pos] << 8) | data[pos+1]);
                pos+=2;
                // The below is magic: Convert from LR1110 driver 6.0 representation as used in va-gnss-stream.c
                result.gnss.assistanceLatitude  = 90.0*lat16/2048.0;
                result.gnss.assistanceLongitude = 180.0*lon16/2048.0;
            } else {
                result.gnss.assistanceLatitude  = 0; // TBD: how to erase field so not old field remains - this is a bug
                result.gnss.assistanceLongitude = 0; // TBD: how to erase field so not old field remains - this is a bug
            }
            let hex = "";
            for (let i = pos+1; i < data.length; ++i) // Note: skip first byte
                hex+=encode_uint8_hex(data[i]);
            if (hex.length/2 == result.gnss.streamSize-1) {
                result.gnss.completeHex = hex;
                result.gnss.incompleteHex = "";
                addSemtechGnssObject(result);
            } else {
                result.gnss.completeHex = "";
                result.gnss.incompleteHex = hex;
            }
        } else {
            if (data.length < 6) {
                // This is not good enough data, discard it
                console.log("Too small stream increment");
                return {};
            }

            const streamOffset = ((data[0]&0x3f) << 8) | data[1];
            pos+=2;
            gnssCaptureGpsTime = (data[pos]<<24) | (data[pos+1] << 16) | (data[pos+2] << 8) | (data[pos+3]);  // Must match
            pos+=4;
            if (!iotnode.hasOwnProperty("gnss")) {
                console.log("Partial frame error: could not read previous gnss property");
                return {}; // Not there, we cannot handle partial frame
            }
            if (iotnode.gnss.captureGpsTime !== gnssCaptureGpsTime) {
                console.log("Partial frame error: gnss capture time mismatch - expected:"  + gnssCaptureGpsTime);
                console.log(iotnode);
                return {}; // Not matching what is partially there
            }
            if (!iotnode.gnss.hasOwnProperty('incompleteHex')) {
                console.log("Partial frame error: could not read previous data");
                return {}; // Not ok / discard frame
            }
            if (streamOffset-1 /*bytes*/ !== iotnode.gnss.incompleteHex.length/2 /*hex*/) {
                console.log("Partial frame error: expected stream offset: " + streamOffset + " - current length: " + iotnode.gnss.incompleteHex.length/2);
                return {}; // Wrong frame / repeat frame
            }

            // Make sure to carry forward from first frame
            result.gnss.streamSize = iotnode.gnss.streamSize; 
            result.gnss.captureGpsTime = iotnode.gnss.captureGpsTime; 
            result.gnss.assistanceLatitude  = iotnode.gnss.assistanceLatitude;
            result.gnss.assistanceLongitude = iotnode.gnss.assistanceLongitude;
            result.gnss.timestamp =  new Date(1000*(gnssCaptureGpsTime + UNIX_GPS_EPOCH_OFFSET));

            let hex = iotnode.gnss.incompleteHex; // NOTE: Translators must be able to trust read-after-write semantics for iotnode
            for (let i = pos; i < data.length; ++i)
                hex += encode_uint8_hex(data[i]);
            if (hex.length/2 === iotnode.gnss.streamSize-1) {
                result.gnss.completeHex = hex;
                result.gnss.incompleteHex = "";
                addSemtechGnssObject(result);
            } else {
                result.gnss.incompleteHex = hex;            
                result.gnss.completeHex = "";
            }
        }
        return {result};
    }

    const decodeGnssMetadata = (iotnode, symbolTable, data, time) => {
        if (data.length == 2) {
            let result = { gnss: {} }
            result.gnss.almanacChunkChecksum = (data[0]<<8)|data[1];
            return { result };
            // This is a checksum for a downloaded rule
        } else if (data.length == 12 || data.length == 16) {
            // This is age (in seconds) for assistance position and almanac
            let assistanceTimestamp = (data[0] << 24) | (data[1] << 16) | (data[2]<<8) | data[3];
            let almanacTimestamp = (data[4] << 24) | (data[5] << 16) | (data[6]<<8) | data[7];
            let result = { gnss: {} }
            result.gnss.assistancePositionTimestamp = new Date(assistanceTimestamp*1000);
            result.gnss.almanacTimestamp = new Date(almanacTimestamp*1000);

            const lat16 = ((data[8] & 0x80 ? 0xFFFF<<16 : 0) | (data[8] << 8) | data[9]);
            const lon16 = ((data[10] & 0x80 ? 0xFFFF<<16 : 0) | (data[10] << 8) | data[11]);
            // The below is magic: Convert from LR1110 driver 6.0 representation as used in va-gnss-stream.c
            result.gnss.assistanceLatitude  = 90.0*lat16/2048.0;
            result.gnss.assistanceLongitude = 180.0*lon16/2048.0;

            // Device time
            let deviceTime;
            if (data.length >= 16) {
                deviceTime = (data[12] << 24) | (data[13] << 16) | (data[14]<<8) | data[15];
                result.gnss.deviceTime = new Date(1000*deviceTime);
                result.gnss.deviceTimeTimestamp = new Date(time);
            } 
            return { result };
        }
        return null;
    }

    const decodeWifiStream = (iotnode, symbolTable, data, time) => {
        if (data.length < 4)
            return null;
        let age = (data[0] << 24) | (data[1] << 16) | (data[2]<<8) | data[3];
        let pos = 4;
        if ((data.length-pos)%7 != 0)
            return null; // Bad
        let result = { wifi: { timestamp: new Date(1000*(time/1000 - age))} }
        let wifiAccessPoints = [];
        while (pos < data.length) {
            const signalStrength = 0xffffff00 | data[pos++];
            let macAddress = "";
            for (let i = 0; i < 6; ++i) {
                macAddress += encode_uint8_hex(data[pos++]);
                if (i < 5)
                    macAddress+=":";
            }
            wifiAccessPoints.push({signalStrength, macAddress});
        }
        result.wifi.wifiAccessPoints = wifiAccessPoints;
        addSemtechWifiObject(result);
        return {result};
    }

    const decodeStoredUplink = (iotnode, symbolTable, data, time) => {
        if (data.length < 5)
            return null;
        let linktime = 1000 * ((data[0] << 24) | (data[1] << 16) | (data[2]<<8) | data[3]);
        if (linktime > time)
            return null; // No future uplinks, thankyou very much
        let linkport = data[4];
        let linkdecoder = mapPortToDecode[linkport];
        if (!linkdecoder)
            return null;

        const strRest = data.toString('hex').substring(10); // Pull off 5 first bytes
        const newData = hexToBinary(strRest);
        return linkdecoder.decode(iotnode, symbolTable, newData, linktime);
    }

    const decodeIddData = (iotnode, symbolTable, data, time) => {
        if (data.length < 48)
            return null;
        let idd = {}
        idd.timestamp = new Date(time);

        let b = 0;

        idd.daysRunning    = data[b++]|data[b++]<<8;
        idd.startupCount   = data[b++]|data[b++]<<8;
        idd.firstJoinDay   = data[b++]|data[b++]<<8;
        idd.firstJoinedDay = data[b++]|data[b++]<<8;

        idd.loraStartupCount= data[b++]|data[b++]<<8;
        idd.loraMlmeCount= data[b++]|data[b++]<<8;
        idd.loraMlmeFailCount= data[b++]|data[b++]<<8;
        idd.loraMcpsCount= data[b++]|data[b++]<<8;

        // Byte 16
        if (b!=16) console.log("Expected 16 but had " + b);

        idd.loraMcpsFailCount = data[b++]|data[b++]<<8; // Number of failed MCPS LoRa transactions
        idd.joinCount = data[b++]|data[b++]<<8; // Number of 'NIF' in demo mode
        idd.watchdogCount = data[b++];
        idd.crashCount = data[b++];; // Number of crashes registerred
        idd.daysJoined = data[b++]|data[b++]<<8; // Number of half days included

        idd.firstDeviceTime = new Date((data[b++]|data[b++]<<8|data[b++]<<16|data[b++]<<24)*1000);
        idd.lastDeviceTime = new Date((data[b++]|data[b++]<<8|data[b++]<<16|data[b++]<<24)*1000);

        // Byte 32
        if (b!=32) console.log("Expected 32 but had " + b);

        idd.vmExecCount = data[b++]|data[b++]<<8|data[b++]<<16|data[b++]<<24;
        idd.crashStoreCount = data[b++];
        idd.gnssFoundSVLpf = data[b++]/10.0; 
        idd.gnssSnrLpf = (data[b++]|data[b++]<<8)/10.0;
        idd.gnssSnrMaxLpf = (data[b++]|data[b++]<<8)/10.0;
        idd.loraRssiLpf = (0xffff0000|data[b++]|data[b++]<<8)/10.0;
        idd.loraSnrLpf = ((data[b++]&0xff)|data[b++]<<8)/10.0;
        idd.wifiGwsLpf = data[b++]/10.0; 
        idd.gnssValidSVLpf = data[b++]/10.0; 

        if (b!=48) console.log("Expected 48 but had " + b);
        
        return {result: {idd}};
    }

    const decodePwrData = (iotnode, symbolTable, data, time) => {
        if (data.length === 1) {
            return {result: { vsm: { networkPowered:data[0] === 0 ? 1 : 0, batteryPercent:data[0] }}}
        } else {
            let pwr = { timestamp: new Date(time), data: data.toString('hex') }
            return {result: { vsm: { pwr }}};
        }
    }

    const decodePortForward = (iotnode, symbolTable, data, time, port) => {
        let result = {result: {forward: { }}}
        result.result.forward["port"+port] = {timestamp: new Date(time), data: data.toString('hex')}
        return result;
    }

    
    // Must match definitions in app.c
    const mapPortToDecode = {
        /* APP_LORA_PORT_OUTPUT     */   1: { decode: decodeOutput,       name: 'output'        },
        /* APP_LORA_PORT_DIAGNOSTICS */	 2: { decode: decodeDiagnostics,  name: 'diagnostics'   },
        /* APP_LORA_PORT_CRASH      */   3: { decode: decodeCrash,        name: 'crash'         },
        /* APP_LORA_PORT_IDD        */   4: { decode: decodeIddData,      name: 'idd'           },
        /* APP_LORA_PORT_PWR        */   5: { decode: decodePwrData,      name: 'pwr'           }, 
        /* APP_LORA_PORT_PWR        */   6: { decode: decodeLinkControl,  name: 'link control'  }, 
        /* APP_LORA_PORT_CUSTOMIZATION */7: { decode: decodeCustomization,name: 'customization' }, 
        /* APP_LORA_PORT_MESH */         8: { decode: decodeMesh,         name: 'mesh'          },
        /* APP_LORA_PORT_COMPRESSED */  11: { decode: decodeCompressed,   name: 'compressed'    },
        /* APP_LORA_PORT_STORED_UPLINK*/12: { decode: decodeStoredUplink, name: 'stored uplink' },
        /* APP_LORA_PORT_RULE	    */	15: { decode: decodeRule,         name: 'rule'          },
        /* APP_LORA_PORT_GNSS_RESULT*/  21: { decode: decodeGnssStream,   name: 'gnss stream'   },
        /* APP_LORA_PORT_GNSS_METADATA*/22: { decode: decodeGnssMetadata, name: 'gnss metadata' },
        /* APP_LORA_PORT_WIFI */        23: { decode: decodeWifiStream,   name: 'wifi stream'   },
        /* APP_LORA_PORT_WIFI_MOTION */ 24: { decode: decodeWifiStream,   name: 'wifi stream motion'},
        /* PORT FORWARD: 32 */          32: { decode: (n, s, d, t) => decodePortForward(n,s,d,t,32), name: "port forward 32"},
        /* PORT FORWARD: 33 */          33: { decode: (n, s, d, t) => decodePortForward(n,s,d,t,33), name: "port forward 33"},
        /* PORT FORWARD: 34 */          34: { decode: (n, s, d, t) => decodePortForward(n,s,d,t,34), name: "port forward 34"},
        /* PORT FORWARD: 35 */          35: { decode: (n, s, d, t) => decodePortForward(n,s,d,t,35), name: "port forward 35"},
        /* PORT FORWARD: 36 */          36: { decode: (n, s, d, t) => decodePortForward(n,s,d,t,36), name: "port forward 36"},
        /* PORT FORWARD: 37 */          37: { decode: (n, s, d, t) => decodePortForward(n,s,d,t,37), name: "port forward 37"},
        /* PORT FORWARD: 38 */          38: { decode: (n, s, d, t) => decodePortForward(n,s,d,t,38), name: "port forward 38"},
        /* PORT FORWARD: 39 */          39: { decode: (n, s, d, t) => decodePortForward(n,s,d,t,39), name: "port forward 39"},
    };

    // Convert a hexadecimal data representation to binary, check the Buffer.from second parameter should other encoding be needed
    function hexToBinary(data) {
        if (!data)
            return null;
        return Buffer.from(data, "hex");
    }

    // Generate a symbol table from the nodes vsm.schema field (todo: reference database of known CRCs to know?)
    function mkSymbolTable(iotnode) {
        let symbolTable = {};

        let description = "";
        if (iotnode.hasOwnProperty('vsm')) {
            if (iotnode.vsm.hasOwnProperty("schema")) {
                description = iotnode.vsm.schema;
            } else {
                if (iotnode.vsm.hasOwnProperty("rulesCrc32")) {
                    // Lookup schema in knownSchemas - this is fallback solution when we got crc32 but the translator
                    // did not previously regognize the CRC
                    if (knownSchemas.hasOwnProperty(iotnode.vsm.rulesCrc32)) {
                        description = knownSchemas[iotnode.vsm.rulesCrc32].mapData;
                    } else {
                        return symbolTable;
                    }
                } else {
                    return symbolTable;
                }
            }
        } else {
            return symbolTable; // Do not know which application this is
        }

        if (!description)
            return symbolTable;
        const descriptions = description.split(/\r\n|\r|\n/);
        for (let i = 0; i < descriptions.length; ++i) {
            // Example MAP file line:
            // M output OUTPUT_NOW 184 0xb8
            let matches = [...descriptions[i].matchAll(/^M\s(output|register|sensor|input|variable)\s+(\w+)\s+(\d+)\s+0x\w\w(\s+-?\d+.?\d*)?/g)];
            if (1 != matches.length)
                continue; // No match
            const item = matches[0];

            const type = item[1]; // One of register, output, sensor, input or variable
            const name = item[2];
            if (name.length <= 0) {
                console.log("Bad name length");
                console.log(descriptions[i]);
                continue;
            }
            const id = parseInt(item[3], 10);
            if (isNaN(id) || id < 0 || id > 255) {
                console.log("Bad id");
                continue;
            }

            let scale = 1;
            if (item.length>=5) {
                scale = parseFloat(item[4]);
                if ((typeof(scale) !== 'number') || isNaN(scale))
                    scale = 1;
            } 

            symbolTable[id] = {name, type, scale};
            // console.log("added " + id + ": " + name + " (" + type + ") scale: " + scale);
        }
        return symbolTable;
    }

    // Port decides which decoder to run
    let port = iotnode.encodedData.port;
    if (!port) {
        console.log("no port supplied");
        return null;
    }
    // Actual data
    let data = hexToBinary(iotnode.encodedData.hexEncoded);
    if (!data) {
        console.log("No valid hex data supplied: " + JSON.stringify(iotnode));
        return null;
    }

    let time;
    try {
        time = new Date(iotnode.encodedData.timestamp).getTime();
    } catch (e) {
        console.log("failed to obtain timestamp from iotnode.encodedData.timestamp")
        time = new Date().getTime();
    }

    // Symbol table to translate into "human-readable" format
    const symbolTable = mkSymbolTable(iotnode);
 
    if (mapPortToDecode.hasOwnProperty(port)) {
        return mapPortToDecode[port].decode(iotnode, symbolTable, data, time);
    } else {
        console.log("No decode function for port " + port);
        return null;
    }
    // NOT REACHABLE
  }

const selfTest = () => {
    // console.log("Running selftest before posting")
    const description =`
M output alarmTime 144 0x90
M output capAlarm 128 0x80 1
M output buttonAlarm 129 0x81 1 
M output capReport 176 0xb0 1
M output gpsTime 184 0xb8 1
M output gnssState 160 0xa0 1 
`;
    const tc = [
        { // 0
            input: {
                vsm: {schema: description },
                encodedData : {
                    port : 1,
                    hexEncoded : "7809619b8d7e10002c",
                    timestamp: new Date(1637323469000),
                }
            },
            expect: {
                "timeseries":[
                    {"timestamp":"2021-11-19T12:04:20.000Z","value":{"output":{"gpsTime":1637584254}}},
                    {"timestamp":"2021-11-19T12:04:20.001Z","value":{"output":{"alarmTime":44}}}
                ],
                "result": {
                    "output":{"gpsTime":1637584254,"alarmTime":44},
                    "timestamps":{"gpsTime":"2021-11-19T12:04:20.000Z","alarmTime":"2021-11-19T12:04:20.001Z"}}}
        },
        { // 1
            input: {
                vsm: {schema: description },
                encodedData : {
                    port : 1,
                    hexEncoded : "780b619b82402001100004",
                    timestamp: new Date(1637323469000),
                }
            },
            expect: {
                "timeseries":[
                    {"timestamp":"2021-11-19T12:04:18.000Z","value":{"output":{"gpsTime":1637581376}}},
                    {"timestamp":"2021-11-19T12:04:18.001Z","value":{"output":{"gnssState":1}}},
                    {"timestamp":"2021-11-19T12:04:18.001Z","value":{"output":{"alarmTime":4}}}
                ],
                "result":{
                    "output":{"gpsTime":1637581376,"gnssState":1,"alarmTime":4},
                    "timestamps":{"gpsTime":"2021-11-19T12:04:18.000Z","gnssState":"2021-11-19T12:04:18.001Z","alarmTime":"2021-11-19T12:04:18.001Z"}
                }
            }
        },
        { // 2
            input: {
                vsm: {schema: description },
                encodedData : {
                    port : 1,
                    hexEncoded : "410c00100000",
                    timestamp: new Date(1637323469000),
                }
            },
            expect: {
                "timeseries":[
                    {"timestamp":"2021-11-19T12:04:17.000Z","value":{"output":{"buttonAlarm":0}}},
                    {"timestamp":"2021-11-19T12:04:17.001Z","value":{"output":{"alarmTime":0}}}
                ],
                "result":{
                    "output":{"buttonAlarm":0,"alarmTime":0},
                    "timestamps":{"buttonAlarm":"2021-11-19T12:04:17.000Z","alarmTime":"2021-11-19T12:04:17.001Z"}
                }
            }
        },
        { // 3  Varying timestamps from unit that joined later
            input: {
                vsm: {schema: description },
                encodedData : {
                    port : 1,
                    hexEncoded : "410200100000502400022004410f01100001",
                    timestamp: new Date(1637323469000),
                },
                timestamps : {
                    gnssState: "2021-11-19T12:05:52.000Z", // Emulate that we have a more recent gnssState
                }
            },
            expect: {
                "timeseries": [
                    {"timestamp":"2021-11-19T12:04:27.000Z","value":{"output":{"buttonAlarm":0}}},
                    {"timestamp":"2021-11-19T12:04:27.001Z","value":{"output":{"alarmTime":0}}},
                    {"timestamp":"2021-11-19T12:03:51.000Z","value":{"output":{"alarmTime":2}}},
                    {"timestamp":"2021-11-19T12:03:51.001Z","value":{"output":{"gnssState":4}}},
                    {"timestamp":"2021-11-19T12:03:36.000Z","value":{"output":{"buttonAlarm":1}}},
                    {"timestamp":"2021-11-19T12:03:36.001Z","value":{"output":{"alarmTime":1}}}
                ],
                "result":{
                    "output":{"buttonAlarm":0,"alarmTime":0}, // Does not include gnss-state since there is a more recent
                    "timestamps":{"buttonAlarm":"2021-11-19T12:04:27.000Z","alarmTime":"2021-11-19T12:04:27.001Z"}}}
        },
        { // 4 compressed
            input: {
                vsm: {schema: description },
                encodedData : {
                    port : 11,
                    hexEncoded : "f80f56196001",
                    timestamp: new Date(1637323469000),
                }
            },
            expect: {
                "timeseries":[
                    {"timestamp":"2021-11-19T12:03:59.000Z","value":{"output":{"gpsTime":1611137049}}},
                    {"timestamp":"2021-11-19T12:03:59.001Z","value":{"output":{"gnssState":1}}}
                ],
                "result":{
                    "output":{"gpsTime":1611137049,"gnssState":1},
                    "timestamps":{"gpsTime":"2021-11-19T12:03:59.000Z","gnssState":"2021-11-19T12:03:59.001Z"}
                }
            }
        },
        { // 5 - compressed 41 01 50 00 01
            input: {
                vsm: {schema: description },
                encodedData : {
                    port : 11,
                    hexEncoded : "4101500001",
                    timestamp: new Date(1637323469000),
                }
            },
            expect: {
                "timeseries":[
                    {"timestamp":"2021-11-19T12:04:29.001Z","value":{"output":{"buttonAlarm":1}}},
                    {"timestamp":"2021-11-19T12:04:29.001Z","value":{"output":{"alarmTime":1}}}
                ],
                "result":{
                    "output":{"buttonAlarm":1,"alarmTime":1},
                    "timestamps":{"buttonAlarm":"2021-11-19T12:04:29.001Z","alarmTime":"2021-11-19T12:04:29.001Z"}
                }
            }
        }, 
        { // 6 - gnss stream single frame: // port 21, c0144ed0e13f04fb00990101140ef72913621c22358ecd48856332e25a07
            input: {
                vsm: {schema: description },
                encodedData : {
                    port : 21,
                    hexEncoded : "c0144ed0e13f04fb00990101140ef72913621c22358ecd48856332e25a07",
                    timestamp: new Date(1637323469000),
                }
            },
            expect: {result:{
                        gnss: {
                            "autonomous":0,
                            "streamSize":20,
                            "captureGpsTime":1322311999,
                            "assistanceLatitude":56.0302734375,
                            "assistanceLongitude":13.447265625,
                            "completeHex":"01140ef72913621c22358ecd48856332e25a07",
                            "incompleteHex":"",
                        },
                        "semtechEncoded":{
                            "msgtype":"gnss",
                            "gnss_capture_time":1322311999,
                            "payload":"01140ef72913621c22358ecd48856332e25a07",
                            "gnss_assist_position":[56.0302734375,13.447265625]
                        }
                    }
                }
            }, // 7 - gnss stream, single frame: // c0184ed143e604fb009901013e14f72913823e211175cf48e58133f282c88c503b00
        { 
            input: {
                vsm: {schema: description },
                encodedData : {
                    port : 21,
                    hexEncoded : "c0184ed143e604fb009901013e14f72913823e211175cf48e58133f282c88c503b00",
                    timestamp: new Date(1637323469000),
                }
            },
            expect: {result:{
                        gnss: {
                            "autonomous":0,
                            "streamSize":24,
                            "captureGpsTime":1322337254,
                            "assistanceLatitude":56.0302734375,
                            "assistanceLongitude":13.447265625,
                            "completeHex":"013e14f72913823e211175cf48e58133f282c88c503b00",
                            "incompleteHex":"",
                        },
                        "semtechEncoded":{
                            "msgtype":"gnss",
                            "gnss_capture_time":1322337254,
                            "payload":"013e14f72913823e211175cf48e58133f282c88c503b00",
                            "gnss_assist_position":[56.0302734375,13.447265625]
                        }
                    }
                }
        }, 
        // Gnss stream multiframe. Artificially limited uplink size to max 15 bytes
        // Format: [2b head] [14b size/offset]-[gpstime]-[lat/long assist optional]-payload 
        //  First uplink  : c018-4ee725e9-04f40095 01a25f727a
        //  Second uplink : 0005-4ee725e9 5202944d87849fb9fe
        //  Third uplink  : 000e-4ee725e9 7bdfc26c4390216e31
        //  Final uplink  : 0017-4ee725e9 05
        //                  1st        2nd                3rd                4th
        //  GNSS payload  : 01a25f727a 5202944d87849fb9fe 7bdfc26c4390216e31 05
        { // 8
            input: {
            vsm: {schema: description },
            encodedData : {
                port : 21,
                hexEncoded: "c0184ee725e904f4009501a25f727a",
                timestamp: new Date(),
                },
            },
            expect: {result:{
                          "gnss":{
                              "autonomous":0,
                              "streamSize":24,
                              "captureGpsTime":1323771369,
                              "assistanceLatitude":55.72265625,
                              "assistanceLongitude":13.095703125,
                              "completeHex":"",
                              "incompleteHex":"a25f727a"}}}
        },
        { // 9 - second uplink
            input: {
                vsm: {schema: description },
                encodedData : {
                    port : 21,
                    hexEncoded: "00054ee725e95202944d87849fb9fe",
                    timestamp: new Date(),
                    },
                "gnss":{ // As returned above
                    "streamSize":24,
                    "captureGpsTime":1323771369,
                    "assistanceLatitude":55.72265625,
                    "assistanceLongitude":13.095703125,
                    "completeHex":"",
                    "incompleteHex":"a25f727a"},
            },
            expect: {result:
                {"gnss":{"streamSize":24,"captureGpsTime":1323771369,
                         "assistanceLatitude":55.72265625,"assistanceLongitude":13.095703125,
                         "timestamp":"2021-12-17T10:16:09.000Z",
                         "incompleteHex":"a25f727a5202944d87849fb9fe","completeHex":""}}}
        },
        { // 10 - third gnss subframe
            input: {
                vsm: {schema: description },
                encodedData : {
                    port : 21,
                    hexEncoded: "000e4ee725e97bdfc26c4390216e31",
                    timestamp: new Date(),
                    },
                gnss : {"streamSize":24,"captureGpsTime":1323771369,"assistanceLatitude":55.72265625,"assistanceLongitude":13.095703125,"incompleteHex":"a25f727a5202944d87849fb9fe","completeHex":""},
            },
            expect: { 
                result: {
                    "gnss":{
                    "streamSize":24,"captureGpsTime":1323771369,
                    "assistanceLatitude":55.72265625,"assistanceLongitude":13.095703125,
                    "timestamp":"2021-12-17T10:16:09.000Z",
                    "incompleteHex":"a25f727a5202944d87849fb9fe7bdfc26c4390216e31","completeHex":""}
                }
            }
        },
        { // 11 - final (4th) gnss subframe
            input: {
                vsm: {schema: description },
                encodedData : {
                    port : 21,
                    hexEncoded: "00174ee725e905",
                    timestamp: new Date(),
                    },
                gnss : { // Same as returned above
                    "streamSize":24,
                    "captureGpsTime":1323771369,
                    "assistanceLatitude":55.72265625,
                    "assistanceLongitude":13.095703125,
                    "completeHex":"",
                    "incompleteHex":"a25f727a5202944d87849fb9fe7bdfc26c4390216e31"
                },
            },
            expect: {
                result: {
                    "gnss":{
                        "streamSize":24,"captureGpsTime":1323771369,
                        "assistanceLatitude":55.72265625,"assistanceLongitude":13.095703125,
                        "timestamp":"2021-12-17T10:16:09.000Z",
                        "completeHex":"a25f727a5202944d87849fb9fe7bdfc26c4390216e3105","incompleteHex":""},
                        "semtechEncoded":{
                            "msgtype":"gnss",
                            "gnss_capture_time":1323771369,
                            "payload":"a25f727a5202944d87849fb9fe7bdfc26c4390216e3105",
                            "gnss_assist_position":[55.72265625,13.095703125]
                        }
                    }
                }
        },
        { // 13 - Positioning metadata - with ages
            input: {
                encodedData : {
                    port: 22,
                    hexEncoded: "61CD8A6061CD8A65050e00a9",
                    timestamp: new Date(1640860261670),
                }
            },
            expect: {result: { gnss:{"assistancePositionTimestamp":"2021-12-30T10:30:56.000Z",
                                     "almanacTimestamp":"2021-12-30T10:31:01.000Z",
                                     "assistanceLatitude":56.865234375,
                                     "assistanceLongitude":14.853515625}}}
        },
        { // 14 - Positioning metadata - without ages or position
            input: {
                encodedData : {
                    port: 22,
                    hexEncoded: "000000000000000000000000",
                    timestamp: new Date(1640860261670),
                }
            },
            expect: {result:{"gnss":{"assistancePositionTimestamp":"1970-01-01T00:00:00.000Z","almanacTimestamp":"1970-01-01T00:00:00.000Z","assistanceLatitude":0,"assistanceLongitude":0}}}
        },
        { // 15 - Diagnostics service - crash
            input: {
                encodedData : {
                    port: 3,
                    hexEncoded: "0123102030405060708090",
                    timestamp: new Date(1640860261670),
                }
            },
            expect: {result:{"vsm":{"crash": {index: 291, bytes: "102030405060708090"}}}}
        },
        { // 16 - Diagnostics service - reference
            input: {
                encodedData : {
                    port: 2,
                    hexEncoded: "010000000f",
                    timestamp: new Date(1640860261670),
                }
            },
            expect: {result:{"vsm":{"debug": {"ref:1":15}}}}
        },
        { // 17 - Positioning service: WIFI capture
            input: {
                encodedData : {
                    port: 23,
                    hexEncoded: "00000003ace0b9e5ec24dda864209f206160b6f48ceb55f0a0abfc34974f6870affc34974f6891",
                    timestamp: new Date(1640860261670),
                }
            },
            expect: {result:
                {"wifi":{
                    "timestamp":"2021-12-30T10:30:58.670Z",
                    "wifiAccessPoints":[
                        {"signalStrength":-84,"macAddress":"e0:b9:e5:ec:24:dd"},
                        {"signalStrength":-88,"macAddress":"64:20:9f:20:61:60"},
                        {"signalStrength":-74,"macAddress":"f4:8c:eb:55:f0:a0"},
                        {"signalStrength":-85,"macAddress":"fc:34:97:4f:68:70"},
                        {"signalStrength":-81,"macAddress":"fc:34:97:4f:68:91"}]
                    },
                    "semtechEncoded":{
                        "msgtype":"wifi",
                        "payload":"01ace0b9e5ec24dda864209f206160b6f48ceb55f0a0abfc34974f6870affc34974f6891",
                        "timestamp":1640860258.67
                    }
                }
            }
        },
        { // 18 - Stored uplinks service (Diagnostics service - reference)
            input: {
                encodedData : {
                    port: 12,
                    hexEncoded: "61cd8a6202010000000f",
                    timestamp: new Date(1640860261670),
                }
            },
            expect: {result:{"vsm":{"debug": {"ref:1":15}}}}
        },
        { // 19
            input: {
                vsm: {schema: description },
                encodedData : {
                    port : 12,
                    hexEncoded : "61cd8a6201410c00100000",
                    timestamp: new Date(2640860261670), // Far in future as of writing this
                }
            },
            expect: {"timeseries":
                [
                    {"timestamp":"2021-12-30T10:30:46.000Z","value":{"output":{"buttonAlarm":0}}},
                    {"timestamp":"2021-12-30T10:30:46.001Z","value":{"output":{"alarmTime":0}}}
                ],
                "result":{
                    "output":{"buttonAlarm":0,"alarmTime":0},
                    "timestamps":{"buttonAlarm":"2021-12-30T10:30:46.000Z","alarmTime":"2021-12-30T10:30:46.001Z"}
                }
            }            
        },
        { // 20 - IDD data
            input: {
                vsm: {schema: description },
                encodedData : {
                    port : 4,
                    hexEncoded : "00000300000000000c000200000004000000040001020000698a116343d411633e000000020000000000f4fca1390308",
                    timestamp: new Date(2640860261670), // Not used
                }
            },
            expect: {
                "result": {
                    "idd":{
                        "timestamp":"2053-09-07T12:17:41.670Z",
                        "daysRunning":0,
                        "startupCount":3,
                        "firstJoinDay":0,
                        "firstJoinedDay":0,
                        "loraStartupCount":12,
                        "loraMlmeCount":2,
                        "loraMlmeFailCount":0,
                        "loraMcpsCount":4,
                        "loraMcpsFailCount":0,
                        "joinCount":4,
                        "watchdogCount":1,
                        "crashCount":2,
                        "daysJoined":0,
                        "firstDeviceTime":"2022-09-02T04:45:29.000Z",
                        "lastDeviceTime":"2022-09-02T10:00:35.000Z",
                        "vmExecCount":62,
                        "crashStoreCount":2,
                        "gnssFoundSVLpf":0,
                        "gnssSnrLpf":0,
                        "gnssSnrMaxLpf":0,
                        "loraRssiLpf":-78,
                        "loraSnrLpf":1475.3, // Strange value, correction made 20240527
                        "wifiGwsLpf":0.3,
                        "gnssValidSVLpf":0.8}
                    }
                }
        },
        { // 21 - PWR data [raw for now]
            input: {
                vsm: {schema: description },
                encodedData : {
                    port : 5,
                    hexEncoded : "0000111122223333",
                    timestamp: new Date(1640860261670), // Not used
                }
            },
            expect: {
                "result": {
                    "vsm":{
                        "pwr":{
                            "timestamp":"2021-12-30T10:31:01.670Z",
                            "data":"0000111122223333"
                        }
                    }
                }
            }
        },
        { // 22 - Port forward on port 32
            input: {
                vsm: {schema: description },
                encodedData : {
                    port : 32,
                    hexEncoded : "0102030405060708",
                    timestamp: new Date(1640860261670), // Not used
                }
            },
            expect: {
                "result": {
                    "forward":{
                        port32: {
                        "timestamp":"2021-12-30T10:31:01.670Z",
                        "data":"0102030405060708"
                        }
                    }
                }
            }
        }
    ];

    for (let c = 0; c < tc.length; ++c) {
        const translated = translate(tc[c].input);
        if (JSON.stringify(translated) !== JSON.stringify(tc[c].expect)) {
            console.log("Test failure:");
            console.log(" Test " + c + " Translated:", JSON.stringify(translated));
            console.log(" Test " + c + " Expected:  ", JSON.stringify(tc[c].expect));    
            throw (new Error("Unexpected result for case " + c));
        }
        else {
            // console.log("Test case " + c + " PASSED.");
        }
    }
}

// Actual script
try {
    selfTest();
} catch (error) {
    console.log(error);
    process.exit(1);
}

exports.translate = translate;
