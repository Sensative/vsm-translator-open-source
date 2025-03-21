/*
The MIT License (MIT)

Copyright (c) 2024 Sensative AB

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

// Copyright (C) 2024, Sensative AB, All rights reserved Author: Lars Mats & Dhiraj Paryani
//
// Decode decodes an array of bytes into an object.
//  - fPort contains the LoRaWAN fPort number
//  - bytes is an array of bytes, e.g. [225, 230, 255, 0]
//  - variables contains the device variables e.g. {"calibration": "3.5"} (both the key / value are of type string)
// The function must return an object, e.g. {"temperature": 22.5}
//
// This Decoder is also applicable for Chirpstack v4

function decodeUplink(input) {
    var iotnode = {
        encodedData: {
            port: input.fPort,
            hexEncoded: input.bytes,
            timestamp: Date.now(),
            maxSize: 256
        },
        vsm: {
            rulesCrc32: 3227680283 //Hardcoded - IT IS REPLACED AUTOMATICALLY WITH KNOWN SCHEMAS
        }
    }    

    // Decode an uplink message from a buffer (array) of bytes to an object of fields.
    var decoded = translate(iotnode);

    return {
        data: {
            decoded
        },
        warnings: [],
        errors: []
    };  
}

function translate(iotnode) {

    var MESH_PORT_OFFSET = 300;
    /// DO NOT CHANGE THE BELOW - IT IS REPLACED AUTOMATICALLY WITH KNOWN SCHEMA
    var schema = 
    {
        3227680283: {
            name: "Lifefinder-alternating",
            versions: "R27",
            mapData: "M input alarmAck 164 0xa4  1 + M input alarmResendsBeforeUnjoin 181 0xb5  1 + M input alarmResendTime 167 0xa7  1 + M input humidityThreshold 177 0xb1  0.01 + M input limitedScanChannels 184 0xb8  1 + M input maxAlarmMinutes 180 0xb4  1 + M input maxTraceMinutes 163 0xa3  1 + M input nfcDisablesAlarm 169 0xa9  1 + M input positioningFreqency 170 0xaa  1 + M input quickAlarm 168 0xa8  1 + M input resendsBeforeUnjoin 166 0xa6  1 + M input scanTimeMs 182 0xb6  1 + M input tempAlarmHighLevel 161 0xa1  1 + M input tempAlarmLowLevel 160 0xa0  1 + M input tempHysteresis 178 0xb2  0.01 + M input traceTriggerMinutes 165 0xa5  1 + M output alarmAccumulatedTime 152 0x98  1 + M output alarmTime 144 0x90  1 + M output batteryPercent 162 0xa2  1 + M output humidity 176 0xb0  0.01 + M output nfcDisabledAlarm 129 0x81  1 + M output temp 146 0x92  0.01 + M output tempAlarm 128 0x80  1 + M output traceTime 145 0x91  1 + M output traceTrigger 130 0x82  1 + M output volts 179 0xb3  0.001"
        }
    };
    /// END DO NOT CHANGE THE ABOVE 

    // Response to a reference value query     
    var decodeReferences = function (iotnode, symbolTable, data, time) {
        var result = {};
        for (var used = 0; used < data.length;) {
            var ref = data[used++];
            var name = "";
            var val = (data[used++] << 24) | (data[used++] << 16) | (data[used++] << 8) | (data[used++]);
            if (symbolTable.hasOwnProperty(ref)) {
                name = symbolTable[ref].name;
            } else 
                name = 'ref:' + ref;
            result[name] = val;
        }
        return {
            result: {
                vsm: {
                    debug: result
                }
            }
        };
    };

    // Control status update

    // Error bitmask
    var errorBits = {
        0:'UnknownCommand',   // Typically received a message where port or command does not match
        1:'Hysterical',       // The VM did not finish execution in the max number of iterations
        2:'WrongCustomization',  // The customization is for another app than what is in the device
        3:'Blocked',          // A service had data that could not be sent due to poor DR
        4:'PriorityInverted', // There was confirmed output to send that did not fit the max size
        5:'IllegalCommand',   // An otherwise fine downlink had incorrect data
        6:'BadCustomization', // The customization file did not have a correct CRC
        7:'CannotJoinRadioBusy', // The radio was occupied when trying to join    
    };
    // VM Status Values
    var statusValues = {
        0: 'OK',
        1: 'BadParameter',        // A function was called with incorrect parameters
        2: 'BadRuleLength',       // A rule longer than the max length was provided to VM
        3: 'RuleNotSet',          // The referenced rule had not been set
        4: 'BadVersion',          // Bad rule version vs this VM
        5: 'BadReference',        // Reference to an illegal address
        6: 'StackUnderflow',      // Stack underflow
        7: 'StackOverflow',       // Stack overflow
        8: 'DivByZero',           // Division by zero
        9: 'IllegalInstruction',  // Bad instruction format
        10: 'ProgramOverflow',    // Code did not terminate before reaching next rule
        11: 'BadRuleState',       // A rule had a RAM state inconsistent with its code
        12: 'RegisterReadOnly',   // Attempting to write to a read-only register
        13: 'DependencyOverflow', // Too many dependencies in this ruleset
        14: 'NotSupported',       // Functionality not supported on this HW
        15: 'DeviceError',        // Error reported from a hardware device
        };

    var decodeControl = function(iotnode, symbolTable, data, time) {
        var vmError = data[0];
        var vmErrorText = "";
        for (var i = 0; i < 8; ++i) {
            if (vmError & (1<<i))
                vmErrorText += errorBits[i] + " ";
        }
        if (vmErrorText === "")
            vmErrorText = "OK";
        else
            vmErrorText = vmErrorText.trim();
            var vmStatus  = data[1];
            var vmStatusText = statusValues.hasOwnProperty(vmStatus) ? statusValues[vmStatus] : "Unknown";
        return { 
            result: { 
                vsm: {
                    status: {
                        vmError: vmError,
                        vmStatus: vmStatus, 
                        vmErrorText: vmErrorText, 
                        vmStatusText: vmStatusText, 
                        timestamp: new Date().toISOString()
                    }
                }
            }
        };
    }

    var decodeCrash = function(iotnode, symbolTable, data, time) {
        var index = (data[0] << 8) | data[1];
        var bytes = "";
        for (var i = 2; i < data.length; ++i) {
            var byte = data[i].toString(16);
            if (byte.length == 1) 
                byte = "0" + byte;
            bytes += byte;
        }
        return {
            result: {
                vsm: {
                    crash: {
                        index: index,
                        bytes: bytes
                    }
                }
            }
        };
    }

    // Diagnostics output
    var decodeDiagnostics = function(iotnode, symbolTable, data, time) {
        if (data.length === 2) 
            return decodeControl(iotnode, symbolTable, data, time);
        if (data.length % 5 === 0) 
            return decodeReferences(iotnode, symbolTable, data, time);
        throw new Error("Failed to decode diagnostics data");
    }

    // Link Control service output
    var decodeLinkControl = function(iotnode, symbolTable, data, time) {
        if (data.length == 3) {
            var linkControlIndex = data[0];
            var linkControlDL_RSSI = data[1] << 24 >> 24; // Sign extension
            var linkControlDL_SNR = data[2] << 24 >> 24; // Sign extension
            return {
                result: {
                    vsm: {
                        linkControl: {
                            linkControlIndex: linkControlIndex,
                            linkControlDL_RSSI: linkControlDL_RSSI,
                            linkControlDL_SNR: linkControlDL_SNR,
                            adr: 0,
                            timestamp: new Date(time).toISOString()
                        }
                    }
                }
            };
        } else if (data.length == 2) {
            var linkControlDL_RSSI = data[0] << 24 >> 24; // Sign extension
            var linkControlDL_SNR = data[1] << 24 >> 24; // Sign extension
            return {
                result: {
                    vsm: {
                        linkControl: {
                            linkControlIndex: -1,
                            linkControlDL_RSSI: linkControlDL_RSSI,
                            linkControlDL_SNR: linkControlDL_SNR,
                            adr: 1,
                            timestamp: new Date(time).toISOString()
                        }
                    }
                }
            };
        }
        throw new Error("Failed to decode link control message")
    }

    // Link Control service output
    var translateCustomizationStatus = function(byte) {
        switch(byte) {
            case 0: return "None";
            case 1: return "Applied";
            case 2: return "Error";
            case 3: return "Dirty";
            default: return "Unknown";
        }
    };

    var decodeCustomization = function(iotnode, symbolTable, data, time) {
        var status;
        if (data.length == 1) {
            status = translateCustomizationStatus(data[0]);
            return { result: { vsm: {customization: {status: status, customizedAppCRC: 0, customizationCRC: 0, timestamp: new Date(time).toISOString() }}}};
        } else if (data.length == 9) {
            var customizationCRC = (data[0] << 24) | (data[1] << 16) | (data[2] << 8) | data[3];
            if (data[0] & 0x80) {
                customizationCRC += 0x100000000;    
            }
            var customizedAppCRC = (data[4] << 24) | (data[5] << 16) | (data[6] << 8) | data[7];
            if (data[4] & 0x80) {
                customizedAppCRC += 0x100000000;
            }
            status = translateCustomizationStatus(data[8]);
            return { result: { vsm: {customization: {status: status, customizedAppCRC: customizedAppCRC, customizationCRC: customizationCRC, timestamp: new Date(time).toISOString() }}}};
        }
        throw new Error("Failed to decode link control message");
    };

    // Rule update - CRC value (+build time, +version)
    var decodeRule = function(iotnode, symbolTable, data, time) {
        var rulesCrc32 = ((data[0]) << 24) | (data[1] << 16) | (data[2] << 8) | data[3];
        if (data[0] & 0x80)
            rulesCrc32+=0x100000000;
        
        var schemaInfo = {}
        if (schema[rulesCrc32]) {
            // there is a known schema for this node, use it
            schemaInfo = {
                appName: schema[rulesCrc32].name,
                schema: schema[rulesCrc32].mapData,
                appVersions: schema[rulesCrc32].versions,
                // Added as requirement from product owner:
                appDocumentationUrl: `https://github.com/Sensative/vsm-application-documentation/blob/master/${rulesCrc32}-${knownSchemas[rulesCrc32].name}.vso.md`,
                appConfigurationUrl: `https://vsm-lora-config-app.service.sensative.net/?app=${rulesCrc32}`,
                // Good to know how old this information is
                timestamp: new Date().toISOString(),
            }
        } else {
            console.log("Unknown application with CRC32: " + rulesCrc32);
        }

        var translatorVersion = "0.2.152"; // Replaced when creating new CRC based basic translators
        if (data.length < 8) {
            var resultVsm = {}; // This new object will hold the combined properties.

            for (var prop in schemaInfo) {
                if (schemaInfo.hasOwnProperty(prop)) {
                    resultVsm[prop] = schemaInfo[prop];
                }
            }
            resultVsm.rulesCrc32 = rulesCrc32;
            resultVsm.translatorVersion = translatorVersion;

            return {
                result: {
                    vsm: resultVsm
                }
            };
        }

        // We have at least 8 bytes, a build timestamp follows
        var buildTime = ((data[4] << 24) | (data[5] << 16) | (data[6] << 8) | data[7]) & 0xfffffffc;
        var buildType = 0;
        if (buildTime > 1665684561) // Time when this feature was introduced
            buildType = data[7] & 0x3;
        var buildDate = new Date(1000 * buildTime).toISOString();
        if (data.length < 12) {
            // Create a new object to hold the combined properties.
            var resultVsm = {};

            // Copy over all properties from schemaInfo 
            for (var prop in schemaInfo) {
                if (schemaInfo.hasOwnProperty(prop)) {
                    resultVsm[prop] = schemaInfo[prop];
                }
            }

            // Manually add the additional properties.
            resultVsm.rulesCrc32 = rulesCrc32;
            resultVsm.buildDate = buildDate;
            resultVsm.buildType = buildType;
            resultVsm.translatorVersion = translatorVersion;

            // Use the combined object in the return statement.
            return {
                result: {
                    vsm: resultVsm
                }
            };
        }
        // We have 12 bytes or more, fill in the version as well
        var buildGitVersion = "";
        for (var pos = 8; pos < data.length; ++pos) 
            buildGitVersion += String.fromCharCode(data[pos]);
        // Create a new object to hold the combined properties
        var resultVsm = {};

        // Copy over all properties from schemaInfo
        for (var prop in schemaInfo) {
            if (schemaInfo.hasOwnProperty(prop)) {
                resultVsm[prop] = schemaInfo[prop];
            }
        }

        // Manually add the additional properties
        resultVsm.rulesCrc32 = rulesCrc32;
        resultVsm.buildDate = buildDate;
        resultVsm.buildType = buildType;
        resultVsm.buildGitVersion = buildGitVersion;
        resultVsm.translatorVersion = translatorVersion;

        // Use the combined object in the return statement
        return {
            result: {
                vsm: resultVsm
            }
        };
    }

    var decodeMesh = function (iotnode, symbolTable, data, time) {
        if (data.length == 2) { // Mesh key last 4 digits (decimal) (uplinked as result of 0x02 on port 8)
            return { result: {
                mesh: { stats : { keyLast4 : data[0]<<8 | data[1] }}
            }};
        }

        if (data.length == 8) // Mesh statistics (uplinked as result of sending 0x01 on port 8)
            return { result: {
                mesh : { stats : { 
                    maxRate: data[0],
                    minRate: data[1], 
                    mode : data[2],
                    sync : data[3],
                    rssiWorst : data[4] << 24 >> 24 /* sign extension */ ,
                    rssiAverage : data[5] << 24 >> 24 /* sign extension */ ,
                    msgCount : data[6]*256+data[7],
                    timestamp : new Date().toISOString(),
                }
            } }
        };
        if (data.length < 10)
            // Illegal mesh message
            return {result: {} };

        var serial = ((data[0] << 24) | (data[1] << 16) | (data[2] << 8) | data[3]) & 0xffffffff;
        var upsideRate = (data[4] >> 4) & 0xf;
        if (upsideRate === 0xf) upsideRate = -1; // Not enabled
        var downsideRate = data[4] & 0xf;
        if (downsideRate === 0xf) downsideRate = -1; // Not enabled
        var age_s  = ((data[5] << 16) | (data[6] << 8) | data[7]) & 0xffffff;
        var port   = data[8];
        var len    = data[9]; // Included since there may be multiple messages packed in one in some future
        var pos = 10;
        var hex = '';
        for (var i = 0; i < len; ++i) {
            var byte = data[i+pos].toString(16);
            if (byte.length < 2)
                byte = "0"+byte;
            hex += byte;
        }
        var producedTimestamp = new Date((new Date(time)).getTime()-1000*age_s).toISOString();
        var receivedTimestamp = new Date(time).toISOString();        
        // The mesh data is both recorded in the result object, and in the yggio-specific additionalDeviceUpdates
        // field (which should magically update nodes with the set secret)
        var result = {mesh: { stats: {upsideRate: upsideRate, downsideRate: downsideRate, receivedTimestamp: receivedTimestamp, serial: serial} } };
        var carrier = iotnode && iotnode.name ? iotnode.name : "";
        return { 
            result: result, 
            additionalDeviceUpdates : [ {
                identifier: {secret:""+serial},
                result: { 
                    mesh : { 
		    	     transport : { 
			                   receivedTimestamp: receivedTimestamp, 
					   producedTimestamp: producedTimestamp, 
					   port: port, 
					   hex: hex, 
					   carrier: carrier, 
					   rate: downsideRate /* current nodes downside rate is the transmitting nodes upside rate */ } },
                    encodedData : {
                        port: port + MESH_PORT_OFFSET,
                        hexEncoded: hex,
                        timestamp: producedTimestamp,
                    },
                }
            }]
        }
    }
    // Decode uint32_8_t compressed time format
    var decode_uint32_8_t = function(fp) {
        var exp = (fp >> 3);
        var base = fp & 0x7;
        if (0 == exp) 
            return base;
        else if (1 == exp) // compressed
            return (8 + base);
        else // Round to center of interval
            return ((8 + base) << (exp - 1)) + (1 << (exp - 2));
        }
    
    // Decode int32_16_t compressed value format
    var decode_int32_16_t = function(fp) {
        var neg = fp & 0x8000;
        var exp = (fp >> 10) & 0x1f;
        var base = fp & 0x3ff
        if (0 == exp)
            return neg ? -base : base;
        else if (1 == exp) { // compressed
            var value = (0x400 + base);
            return neg ? -value : value;
        } else { // Round to center of interval
            var value = ((0x400 + base) << (exp - 1)) + (1 << (exp - 2));
            return neg ? -value : value;
        }
    }

    var encode_uint8_hex = function(hex) {
        var byte = hex.toString(16);
        if (byte.length === 1) 
            byte = "0" + byte;
        return byte;
    }

    var encode_int8_hex = function(hex) {
        var byte = (hex & 0xff).toString(16);
        if (byte.length === 1) 
            byte = "0" + byte;
        return byte;
    }

    // Determine latest value on each field in time series, return that as a result object
    var createResultFromTimeSeries = function(iotnode, series) {
        var timestamps = iotnode.timestamps;
        var result = {
            output: {},
            timestamps: {}
        };
        if (!timestamps) 
            timestamps = {}
      series.map(function(sample) {
            // Each sample has a field called value and a field called timestamp
            var sampleTimestamp = sample.timestamp;
            var sampleValues = sample.value;
            if (!sampleValues.output) 
                throw new Error("The sample does not have output structure");
            
            // Now check each field of this output (should be just one)
            var keys = Object.keys(sampleValues.output);
            for (var k = 0; k < keys.length; ++k) {
                var name = keys[k];
                if (timestamps.hasOwnProperty(name)) {
                    var lastSampleTime = new Date(timestamps[name]);                    
                    if (lastSampleTime.getTime() < sampleTimestamp.getTime()) {
                        timestamps[name] = sampleTimestamp; // Avoid overwrite from this series
                        result.timestamps[name] = sampleTimestamp;
                        result.output[name] = sampleValues.output[name];
                    } else {
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
    var decodeOutputCombined = function(iotnode, symbolTable, data, time, compressed) {
        var pos = 0;
        var time_s = Math.floor(time / 1000);
        var timeseries = [];
        while (pos < data.length) {
            if (data.length < pos + 1) {
                console.log("Incomplete message (pos: " + pos + " len: " + data.length);
                return null;
            }
            var head = data[pos++];
            var kind = head & 0x3f;
            var timesize = 0;
            var datasize = 1; // single byte
            if (!compressed) {
                switch ((head >> 6) & 0x3) {
                    case 0:
                        break;
                    case 1:
                        timesize = 1;
                        break;
                    case 2:
                        timesize = 2;
                        break;
                    case 3:
                        timesize = 4;
                        break;
                }
            } else { // Compressed format
                timesize = (head & 0x80) ? 1 : 0;
            }
            var confirmed = true;
            var decompressvalue = false;
            if (compressed && ((head & 0x40) == 0)) {
                datasize = 0; // No data representation, value is 0
                confirmed = (head & 0b100000) ? false : true;
            } else {
                switch ((head >> 3) & 0b111) {
                    case 0:
                        confirmed = true;
                        datasize = 1;
                        break;
                    case 1:
                        confirmed = true;
                        datasize = 1;
                        break;
                    case 2:
                        confirmed = true;
                        datasize = 2;
                        break;
                    case 3:
                        confirmed = true;
                        if (compressed) {
                            datasize = 2;
                            decompressvalue = true;
                        } else 
                            datasize = 4;
                        break;
                    case 4:
                        confirmed = false;
                        datasize = 1;
                        break;
                    case 5:
                        confirmed = false;
                        datasize = 1;
                        break;
                    case 6:
                        confirmed = false;
                        datasize = 2;
                        break;
                    case 7:
                        confirmed = false;
                        if (compressed) {
                            datasize = 2;
                            decompressvalue = true;
                        } else 
                            datasize = 4;
                        break;
                }
            }

            // Check that enough data remain
            var age_s = 0;
            var age_ms = 0;
            if (pos + timesize + datasize > data.length) {
                console.log("Incomplete message (pos: " + pos + " datasize: " + datasize + " timesize: " + timesize + " len: " + data.length + ")");
                return null;
            }

            switch (timesize) {
                case 4:
                    age_s = (data[pos + 0] << 24) | (data[pos + 1] << 16) | (data[pos + 2] << 8) | (data[pos + 3]);
                    pos += 4;
                    break;
                case 2:
                    age_s = (data[pos + 0] << 8) | (data[pos + 1]);
                    pos += 2;
                    break;
                case 1:
                    age_s = compressed ? decode_uint32_8_t(data[pos]) * 2 : (data[pos]);
                    pos++;
                    break;
                case 0:
                    age_ms += 1;
                    break; // Adding a syntetic time difference
            }
            time_s -= age_s; // Go back in time

            var value = 0;
            switch (datasize) {
                case 4:
                    value = (data[pos + 0] << 24) | (data[pos + 1] << 16) | (data[pos + 2] << 8) | (data[pos + 3]);
                    pos += 4;
                    break;
                case 2:
                    if (decompressvalue) {
                        value = decode_int32_16_t(data[pos + 0] << 8) | (data[pos + 1]);
                        pos += 2;
                        break;
                    } else {
                        value = ((data[pos + 0] << 8) | (data[pos + 1])) << 16 >> 16;
                        pos += 2;
                        break;
                    }
                case 1:
                    value = (data[pos] << 24 >> 24);
                    pos++;
                    break;
            }

            if (symbolTable.hasOwnProperty(kind + 128)) {
                var name = symbolTable[kind + 128].name;
                var scale = symbolTable[kind + 128].scale;

                var valuestruct = {};
                valuestruct[name] = value * scale;
                var sample = {
                    timestamp: new Date(time_s * 1000 + age_ms).toISOString(),
                    value: {
                        output: valuestruct
                    }
                };                
                timeseries.push(sample);
            } else {
                console.log("No symbol table entry for message id " + (kind + 128) + " value " + value);
            }
        }
        var retval = {
            timeseries: timeseries,
            result: createResultFromTimeSeries(iotnode, timeseries)
        };
        return retval;
    }

    var decodeOutput = function (iotnode, symbolTable, data, time) {
        return decodeOutputCombined(iotnode, symbolTable, data, time, false);
    }
    var decodeCompressed = function (iotnode, symbolTable, data, time) {
        return decodeOutputCombined(iotnode, symbolTable, data, time, true);
    }

    var addSemtechGnssObject = function(result) {
        var semtechObject = {
            msgtype: "gnss",
            gnss_capture_time: result.gnss.captureGpsTime,
            payload: result.gnss.completeHex
        };
        // Note: Should probably be NaN instead of 0,0 as illegal position
        if (result.gnss.assistanceLatitude != 0.0 && result.gnss.assistanceLongitude != 0.0) 
            semtechObject.gnss_assist_position = [
                result.gnss.assistanceLatitude, result.gnss.assistanceLongitude
            ],

            result.semtechEncoded = semtechObject;
        }
    
    var encodeSemtechWifi = function(wifi) {
        var hex = "01"; // Tag indicating we have RSSI values included
        var aps = wifi.wifiAccessPoints;
        for (var i = 0; i < aps.length; ++i) {
            var ap = aps[i];
            var hexRSSI = encode_int8_hex(ap.signalStrength);
            var hexSSID = "";
            hexSSID += ap
                .macAddress
                .substring(0, 2);
            hexSSID += ap
                .macAddress
                .substring(3, 5);
            hexSSID += ap
                .macAddress
                .substring(6, 8);
            hexSSID += ap
                .macAddress
                .substring(9, 11);
            hexSSID += ap
                .macAddress
                .substring(12, 14);
            hexSSID += ap
                .macAddress
                .substring(15, 17);
            hex += hexRSSI + hexSSID;
        }
        return hex;
    }

    var addSemtechWifiObject = function (result) {
        var semtechObject = {
            msgtype: "wifi",
            payload: encodeSemtechWifi(result.wifi),
            timestamp: result
                .wifi
                .timestamp
		.getTime()/1000
        };
        result.semtechEncoded = semtechObject;
    }

    var decodeGnssStream = function(iotnode, symbolTable, data, time) {
        var UNIX_GPS_EPOCH_OFFSET = 315964800;
        var pos = 0;
        var result = {
            gnss: {}
        };
        var bIsStreamHeader = data[0] & 0x80 ? true : false;
        var gnssCaptureGpsTime = 0;
        if (bIsStreamHeader) {
            if (data.length < 10) {
                // This is not good enough data, discard it
                console.log("Too small stream header");
                return {};
            }
            var bContainsAssistPosition = bIsStreamHeader && (data[0] & 0x40);
            var bWasAutonomousScan = bIsStreamHeader && (data[0] & 0x20);
            result.gnss.autonomous = bWasAutonomousScan ? 1 : 0;
            result.gnss.streamSize = ((data[0] & 0x1f) << 8) | data[1];
            pos += 2;

            gnssCaptureGpsTime = (data[pos] << 24) | (data[pos + 1] << 16) | (data[pos + 2] << 8) | (data[pos + 3]);
            result.gnss.captureGpsTime = gnssCaptureGpsTime;
            pos += 4;

            if (bContainsAssistPosition) {
                var lat16 = ((data[pos] & 0x80 ? 0xFFFF << 16 : 0) | (data[pos] << 8) | data[pos + 1]);
                pos += 2;
                var lon16 = ((data[pos] & 0x80 ? 0xFFFF << 16 : 0) | (data[pos] << 8) | data[pos + 1]);
                pos += 2;
                // The below is magic: Convert from LR1110 driver 6.0 representation as used in va-gnss-stream.c
                result.gnss.assistanceLatitude = 90.0 * lat16 / 2048.0;
                result.gnss.assistanceLongitude = 180.0 * lon16 / 2048.0;
            } else {
                result.gnss.assistanceLatitude = 0;
                result.gnss.assistanceLongitude = 0;
            }
            var hex = "";
            for (var i = pos + 1; i < data.length; ++i) // Note: skip first byte
                hex += encode_uint8_hex(data[i]);
            if (hex.length / 2 == result.gnss.streamSize - 1) {
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

            var streamOffset = ((data[0] & 0x3f) << 8) | data[1];
            pos += 2;
            gnssCaptureGpsTime = (data[pos] << 24) | (data[pos + 1] << 16) | (data[pos + 2] << 8) | (data[pos + 3]); // Must match
            pos += 4;
            if (!iotnode.hasOwnProperty("gnss")) {
                console.log("Partial frame error: could not read previous gnss property");
                return {}; // Not there, we cannot handle partial frame
            }
            if (iotnode.gnss.captureGpsTime !== gnssCaptureGpsTime) {
                console.log("Partial frame error: gnss capture time mismatch - expected:" + gnssCaptureGpsTime);
                console.log(iotnode);
                return {}; // Not matching what is partially there
            }
            if (!iotnode.gnss.hasOwnProperty('incompleteHex')) {
                console.log("Partial frame error: could not read previous data");
                return {}; // Not ok / discard frame
            }
            if (streamOffset - 1 /*bytes*/ !== iotnode.gnss.incompleteHex.length / 2 /*hex*/ ) {
                console.log("Partial frame error: expected stream offset: " + streamOffset + " - current length: " + iotnode.gnss.incompleteHex.length / 2);
                return {}; // Wrong frame / repeat frame
            }

            // Make sure to carry forward from first frame
            result.gnss.streamSize = iotnode.gnss.streamSize;
            result.gnss.captureGpsTime = iotnode.gnss.captureGpsTime;
            result.gnss.assistanceLatitude = iotnode.gnss.assistanceLatitude;
            result.gnss.assistanceLongitude = iotnode.gnss.assistanceLongitude;
            result.gnss.timestamp = new Date(1000 * (gnssCaptureGpsTime + UNIX_GPS_EPOCH_OFFSET)).toISOString();

            var hex = iotnode.gnss.incompleteHex;
            for (var i = pos; i < data.length; ++i)
                hex += encode_uint8_hex(data[i]);
            if (hex.length / 2 === iotnode.gnss.streamSize - 1) {
                result.gnss.completeHex = hex;
                result.gnss.incompleteHex = "";
                addSemtechGnssObject(result);
            } else {
                result.gnss.incompleteHex = hex;
                result.gnss.completeHex = "";
            }
        }
        return {
            result: result
        };
    }

    var decodeGnssMetadata = function(iotnode, symbolTable, data, time) {
        if (data.length == 2) {
            var result = {
                gnss: {}
            }
            result.gnss.almanacChunkChecksum = (data[0] << 8) | data[1];
            return {
                result: result
            };
            // This is a checksum for a downloaded rule
        } else if (data.length == 12 || data.length == 16) {
            // This is age (in seconds) for assistance position and almanac
            var assistanceTimestamp = (data[0] << 24) | (data[1] << 16) | (data[2] << 8) | data[3];
            var almanacTimestamp = (data[4] << 24) | (data[5] << 16) | (data[6] << 8) | data[7];
            var result = {
                gnss: {}
            }
            result.gnss.assistancePositionTimestamp = new Date(assistanceTimestamp * 1000).toISOString();
            result.gnss.almanacTimestamp = new Date(almanacTimestamp * 1000).toISOString();

            var lat16 = ((data[8] & 0x80 ?
                0xFFFF << 16 :
                0) | (data[8] << 8) | data[9]);
            var lon16 = ((data[10] & 0x80 ?
                0xFFFF << 16 :
                0) | (data[10] << 8) | data[11]);
            // The below is magic: Convert from LR1110 driver 6.0 representation as used in va-gnss-stream.c
            result.gnss.assistanceLatitude = 90.0 * lat16 / 2048.0;
            result.gnss.assistanceLongitude = 180.0 * lon16 / 2048.0;

            // Device time
            var deviceTime;
            if (data.length >= 16) {
                deviceTime = (data[12] << 24) | (data[13] << 16) | (data[14] << 8) | data[15];
                result.gnss.deviceTime = new Date(1000 * deviceTime).toISOString();
                result.gnss.deviceTimeTimestamp = new Date(time).toISOString();
            }
            return {
                result: result
            };
        }
        return null;
    }

    var decodeWifiStream = function(iotnode, symbolTable, data, time) {
        if (data.length < 4) 
            return null;
        var age = (data[0] << 24) | (data[1] << 16) | (data[2] << 8) | data[3];
        var pos = 4;
        if ((data.length - pos) % 7 != 0) 
            return null; // Bad
        var result = {
            wifi: {
                timestamp: new Date(1000 * (time / 1000 - age)).toISOString()
            }
        }
        var wifiAccessPoints = [];
        while (pos < data.length) {
            var signalStrength = 0xffffff00 | data[pos++];
            var macAddress = "";
            for (var i = 0; i < 6; ++i) {
                macAddress += encode_uint8_hex(data[pos++]);
                if (i < 5) 
                    macAddress += ":";
            }
            wifiAccessPoints.push({
                signalStrength: signalStrength,
                macAddress: macAddress
            });
        }
        result.wifi.wifiAccessPoints = wifiAccessPoints;
        addSemtechWifiObject(result);
        return {
            result: result
        };
    }

    var decodeStoredUplink = function(iotnode, symbolTable, data, time) {
        if (data.length < 5) 
            return null;
        var linktime = 1000 * ((data[0] << 24) | (data[1] << 16) | (data[2] << 8) | data[3]);
        if (linktime > time) 
            return null; // No future uplinks
        var linkport = data[4];
        var linkdecoder = mapPortToDecode[linkport];
        if (!linkdecoder) 
            return null;
        
        var strRest = data
            .toString('hex')
            .substring(10); // Pull off 5 first bytes
        var newData = hexToDecimalArray(strRest);
        return linkdecoder.decode(iotnode, symbolTable, newData, linktime);
    }

    var decodeIddData = function(iotnode, symbolTable, data, time) {
        if (data.length < 48) 
            return null;
        var idd = {}
        idd.timestamp = new Date(time).toISOString();

        var b = 0;

        idd.daysRunning = data[b++] | data[b++] << 8;
        idd.startupCount = data[b++] | data[b++] << 8;
        idd.firstJoinDay = data[b++] | data[b++] << 8;
        idd.firstJoinedDay = data[b++] | data[b++] << 8;

        idd.loraStartupCount = data[b++] | data[b++] << 8;
        idd.loraMlmeCount = data[b++] | data[b++] << 8;
        idd.loraMlmeFailCount = data[b++] | data[b++] << 8;
        idd.loraMcpsCount = data[b++] | data[b++] << 8;

        // Byte 16
        if (b != 16) 
            console.log("Expected 16 but had " + b);
        
        idd.loraMcpsFailCount = data[b++] | data[b++] << 8; // Number of failed MCPS LoRa transactions
        idd.joinCount = data[b++] | data[b++] << 8; // Number of 'NIF' in demo mode
        idd.watchdogCount = data[b++];
        idd.crashCount = data[b++];; // Number of crashes registerred
        idd.daysJoined = data[b++] | data[b++] << 8; // Number of half days included

        idd.firstDeviceTime = new Date((data[b++] | data[b++] << 8 | data[b++] << 16 | data[b++] << 24) * 1000).toISOString();
        idd.lastDeviceTime = new Date((data[b++] | data[b++] << 8 | data[b++] << 16 | data[b++] << 24) * 1000).toISOString();

        // Byte 32
        if (b != 32) 
            console.log("Expected 32 but had " + b);
        
        idd.vmExecCount = data[b++] | data[b++] << 8 | data[b++] << 16 | data[b++] << 24;
        idd.crashStoreCount = data[b++];
        idd.gnssFoundSVLpf = data[b++] / 10.0;
        idd.gnssSnrLpf = (data[b++] | data[b++] << 8) / 10.0;
        idd.gnssSnrMaxLpf = (data[b++] | data[b++] << 8) / 10.0;
        idd.loraRssiLpf = (0xffff0000 | data[b++] | data[b++] << 8) / 10.0;
        idd.loraSnrLpf = ((data[b++]&0xff)|data[b++]<<8)/10.0;
        idd.wifiGwsLpf = data[b++] / 10.0;
        idd.gnssValidSVLpf = data[b++] / 10.0;

        if (b != 48) 
            console.log("Expected 48 but had " + b);

        return {
            result: {
                idd: idd
            }
        };
    }

    var decodePwrData = function(iotnode, symbolTable, data, time) {
        if (data.length === 1) {
            return {
                result: {
                    vsm: {
                        networkPowered: data[0] === 0 ? 1 : 0,
                        batteryPercent: data[0]
                    }
                }
            }
        } else {
            var pwr = {
                timestamp: new Date(time).toISOString(),
                data: data.toString('hex')
            }
            return {
                result: {
                    vsm: {
                        pwr: pwr
                    }
                }
            };
        }
    }

    var decodePortForward = function(iotnode, symbolTable, data, time, port) {
        var result = {
            result: {
                forward: {}
            }
        }
        var ascii = undefined;
        if (port === 32 /* puck radar sent a command response */ ) {
            try {
                ascii = data.toString('ascii');
            } catch (ignored) { ascii = undefined; }
        }
        // Standard packaging
        result.result.forward["port" + port] = {
            timestamp: new Date(time).toISOString(),
            data: data.toString('hex')
        }
	// Port 32 interpreted as ascii data
        if (ascii)
            result.result.forward["radar"] = { timestamp: new Date(time).toISOString(), ascii: ascii};
        return result;
    }

    // Must match definitions in app.c
    var mapPortToDecode = {
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
        /* PORT FORWARD: 39 */          39: { decode: (n, s, d, t) => decodePortForward(n,s,d,t,39), name: "port forward 39"}
    };

    // Convert a hexadecimal data representation to binary
    function hexToDecimalArray(data) {
        if (!data) 
            return null;

        // Convert data to a string if it isn't already
        if (typeof data !== 'string') {
            data = data.toString();
        }
        
        var decimalArray = [];

        for (var i = 0; i < data.length; i += 2) {
            var hexValue = data.substring(i, i+2);
            decimalArray.push(parseInt(hexValue, 16));
        }
    
        return decimalArray;
    }    

    // Generate a symbol table from the nodes vsm.schema field
    function mkSymbolTable(iotnode) {
        var symbolTable = {};

        var description = "";
        if (iotnode.hasOwnProperty('vsm')) {
            if (iotnode.vsm.hasOwnProperty("schema")) {
                description = iotnode.vsm.schema;
            } else {
                if (iotnode.vsm.hasOwnProperty("rulesCrc32")) {
                    // Lookup schema in schema - this is fallback solution when we got crc32
                    // but the translator did not previously regognize the CRC
                    if (schema.hasOwnProperty(iotnode.vsm.rulesCrc32)) {
                        description = schema[iotnode.vsm.rulesCrc32].mapData;
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

        var descriptions = description.split(' + ');
        for (var i = 0; i < descriptions.length; ++i) {
            // Example MAP file line: M output OUTPUT_NOW 184 0xb8
            var regex = /^M\s(output|register|sensor|input|variable)\s+(\w+)\s+(\d+)\s+0x\w\w(\s+-?\d+.?\d*)?/g;
            var matches = [];
            var match;

            while ((match = regex.exec(descriptions[i])) !== null) {
                matches.push(match);
            }
            if (1 != matches.length) 
                continue; // No match
            var item = matches[0];

            var type = item[1]; // One of register, output, sensor, input or variable
            var name = item[2];
            if (name.length <= 0) {
                console.log("Bad name length");
                console.log(descriptions[i]);
                continue;
            }
            var id = parseInt(item[3], 10);
            if (isNaN(id) || id < 0 || id > 255) {
                console.log("Bad id");
                continue;
            }

            var scale = 1;
            if (item.length >= 5) {
                scale = parseFloat(item[4]);
                if ((typeof(scale) !== 'number') || isNaN(scale)) 
                    scale = 1;
                }
            
            symbolTable[id] = {
                name: name,
                type: type,
                scale: scale
            };
        }
        return symbolTable;
    }

    // Port decides which decoder to run
    var port = iotnode.encodedData.port;
    if (!port) {
        console.log("no port supplied");
        return null;
    }
    // Actual data    
    var data = iotnode.encodedData.hexEncoded;    
    if (!data) {
        console.log("No valid hex data supplied: " + JSON.stringify(iotnode));
        return null;
    }

    var time;
    try {
        time = new Date(iotnode.encodedData.timestamp).getTime();
    } catch (e) {
        console.log("failed to obtain timestamp from iotnode.encodedData.timestamp")
        time = new Date().getTime();
    }

    // Symbol table to translate into "human-readable" format
    var symbolTable = mkSymbolTable(iotnode);

    // Lora ports range is less than 1000. Mesh translation will add 1000 to the port so we can distinguish
    var clearMeshTransport = false;
    if (port < MESH_PORT_OFFSET) { // Message transported by lorawan
        if (iotnode && iotnode.mesh && iotnode.mesh.transport && iotnode.mesh.transport.carrier)
            clearMeshTransport = true;
    }
    else { // Message transported by mesh
        port -= MESH_PORT_OFFSET;
    }

    if (mapPortToDecode.hasOwnProperty(port)) {
        var result = mapPortToDecode[port].decode(iotnode, symbolTable, data, time);
        if (clearMeshTransport && result && result.result)
            result.result.mesh = {transport:{carrier:"LoRaWan"}}
        return result;
    } else {
        console.log("No decode function for port " + port);
        return null;
    }
}