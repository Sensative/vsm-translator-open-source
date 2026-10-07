# README

This software is designed to decode LoRaWan uplink traffic from the Sensative VSM driven applications in LoRaWan sensors.

* WE STRONGLY RECOMMEND NOT FORKING THIS OR MAKING A SEPARATE IMPLEMENTATION. THE CONTENT OF THIS REPOSITORY IS PARTIALLY
GENERATED AND WILL BE UPDATED FREQUENTLY. INSTEAD USE THE VSM MQTT CLIENT FOR INTEGRATING THESE PRODUCTS INTO YOUR SYSTEM.

* The entire software is under MIT license, see LICENSE.txt.

## VSM MQTT CLIENT

The recommended integration is through the https://github.com/Sensative/vsm-mqtt-client-open-source project.

## Required Files

LICENSE.txt
    The MIT software license.

dots-translator-generated.cjs
    Actual translator AND testcases/example calls to the translator.

## Optional Files 

install.sh
    Wrapper for install-yggio-translator.js

install-yggio-translator.js
    Install this translator in an Yggio server. User account is required. Contact Sensative for user account.
    For this there is a dependency to the node-fetch package (i.e. run yarn install before this script).

# Introduction to Translating Sensative VSM driven sensors

## Conceptual model

The sensors are similar to smart phones, and an app is typically installed in the sensor. The app can be changed or updated via NFC or LoRaWan during the lifetime of the sensor.

Depending on which app is currently installed, the device will after joining a network send the applications unique ID (appCrc32) in an uplink on port 15. Upon receiving this uplink, the translator will match the uplink with its built-in list of known application revisions, and it will attempt to store the CRC and data translation table for the individual sensor (by reporting a result.vsm.rulesCrc32 value). For correct further translation, this rulesCrc32 needs to be input in the next translation, using an object with .vsm.rulesCrc32 set.

Hence, for proper translation and handling of updates of applications there are two requirements on the environment in which the translator runs:

1. Persistent per-node storage, of at least the .vsm.rulesCrc32 variable.
2. Recurring updates of the translator so that any new applications will be available to the translator. 
   New applications and updates will be released without notice by Sensative or partner companies, so it is highly recommended that this process is automated.

Additionally, in order to correctly translate streaming data from the sensor, it is recommended that the whole returned .result object from the translator is also stored and provided as input on the next translation of data from the same node. This will enable correct behaviour for

* Delayed/offline data translation.
* GNSS positioning where stream data was split in multiple uplinks.
* Mesh data forwarding

## Levels of integration

### Basic Translator

   This puts the requirement on the user to ensure that each device has the correct translator assigned. 

   Pros:
   * Does not require individual state for each device, except for the selection of translator.

   Cons: 
   * It will not support application updates in the devices without explicit user action to select & replace the translator.
   * It does not support GNSS positioning where GNSS data was split in multiple uplinks.
   * It does not support offline/delayed data timing correctly in all cases (since it will not know when was the latest updated value for the device).
   * It does not support combined mesh networking.
   * It does not do dynamic tracker device management over LoRaWan (such as device time, almanac, assistance positioning).

### Using the dynamic translator, only saving rulesCrc32 for next translation

   Pros:
   * Supports application updates in the devices.
   * Automatic application selection
   
   Cons: 
   * Requires saving one variable specific to the device.
   * It does not support GNSS positioning where GNSS data was split in multiple uplinks.
   * It does not support offline/delayed data timing correctly in all cases (since it will not know when was the latest updated value for the device).
   * It does not support combined mesh networking.
   * It does not do dynamic tracker device management over LoRaWan (such as device time, almanac, assistance positioning).

### Using the dynamic translator, storing the full state output for next translation

   Pros:
   * Supports application updates in the devices.
   * Automatic application selection.
   * Support GNSS data transfer and storage where GNSS data was split in multiple uplinks.
   * Support offline/delayed data timing correctly in all cases.
   
   Cons: 
   * Requires periodic updates to the translator to introduce new applications and versions.
   * Requires saving one object specific to the device.
   * It does not do dynamic tracker device management over LoRaWan (such as device time, almanac, assistance positioning).

### Using the vsm-mqtt-client-open-source for translation and tracker device management

   Pros:
   * Supports application updates in the devices.
   * Automatic application selection.
   * Support GNSS data transfer and storage.
   * Support offline/delayed data timing correctly in all cases.
   * Saves device state as required by translator.
   * Does dynamic tracker device management over LoRaWan (such as device time, almanac, assistance positioning).
   
   Cons: 
   * Requires periodic updates to the translator to introduce new applications and versions.
   * Requires a managed process to be running at a server with regular updates and persistent object storage.

# Troubleshooting

## Device does not get output field (or it is empty)

The indication looking at the data is that the translator is either not assigned (should be set to sensative-vsm-translator), or that for some reason the translator was not active at the time of joining the device.

The data for the device should contain a .vsm field with device meta-information which in particular should hold the software revision of the sensor and which application it is running (including its translation schema). Without that information it does not know how to translate the sensor app output.

So, check the following items:
* Is the translator active?
* Is the translator up-to-date?
* Send a downlink of 00 on port 15 to the device, which will trigger it re-sending the metadata including the rulesCrc32.


# Command line

`cli.js` decodes a single uplink, encodes a downlink that sets an application's inputs, and decodes such a downlink back. `npm test` runs its tests.

## Decoding an uplink

```
node cli.js decode <application CRC> <port> <hexdata> [timestamp]
node cli.js decode 1325798073 1 509b0074110197 2024-11-28T14:57:19.000Z
```

The word `decode` may be left out: `node cli.js <application CRC> <port> <hexdata> [timestamp]` does the same. With a port it is an uplink; without one, `decode` reads a settings downlink (below).

## Encoding a settings downlink

Give the application by its CRC and the settings as `name=value`, in the units the application's documentation gives (the translate scale is applied). The encoder prints each downlink's port, hex and base64 (for the ChirpStack queue), and checks it by decoding it back with the translator.

```
node cli.js encode <application CRC> name=value [name=value ...] [options]
node cli.js encode --vso <file.vso> name=value ...     # an application the translator does not know yet
node cli.js encode <application CRC> --list            # what can be set, with id, size and scale

node cli.js encode 40829709 motionThreshold_m_s2=0.92
Motion-measure (40829709), port 2: 1 downlink
  1/1  fPort 2  5 bytes  hex B300000398  base64 swAAA5g=
        motionThreshold_m_s2 = 0.92 (raw 920)
```

Two ports can set inputs:

* **Port 2** (default): records of 5 bytes, the reference id and the value as a signed 32-bit integer, big-endian. The device writes each value as one of its rules would, so a read-only reference is refused, and it answers on port 2 with the values it now has. Inputs and registers; `--any` also allows outputs and sensors.
* **Port 1** (`--port 1`): the id's low 6 bits, then the value in 1, 2 or 4 bytes as the id says. More compact, inputs only, and without an answer. A byte holds -128..127 and a word -32768..32767. Firmware before dots `8b47e73` misreads a 4-byte value that is not last in the downlink, so by default each downlink carries at most one, at the end; `--no-legacy` packs them freely.

Other options: `--raw` takes the values as they are sent, without the scale, and `--max-size N` sets the largest downlink payload (default 51 bytes, EU868 at DR0) and splits across downlinks.

## Decoding a settings downlink

The mirror of `encode`: give the application and the payload, without a port before it, and it lists what the device would set, read the way the device reads it. The device's answer on port 2 has the same layout, so it decodes that too.

```
node cli.js decode <application CRC> <hexdata> [--port 2|1] [--raw]
node cli.js decode --vso <file.vso> <hexdata> [--port 2|1] [--raw]

node cli.js decode 40829709 B300000398A300000005
Motion-measure (40829709), port 2: 10 bytes
        motionThreshold_m_s2 = 0.92 (raw 920)  input id 179
        sampleInterval_s = 5 (raw 5)  input id 163
```

On port 2, a payload of 1-4 bytes is a read request: a list of references whose values the device sends back. On port 1, a 4-byte value that is not last is flagged, as firmware before dots `8b47e73` misreads what follows it.


# About the Translator
The translator is a partially context-free parser of uplinks from Sensative devices built on the VSM (Virtual Sensor Machine) architecture.
Sensors run apps (aka rules or apps) which define their behaviour. Each app (ruleset) when compiled gets a map file which maps binary 
output and input identifiers to their logical meaning. In the dots-translator-generated.cjs there is a table which provides the mapping 
information for all released apps. Should you have a custom app, you can add that app to the table.

In case you wish to integrate a particular Sensative or partner product to your platform, you need to provide this map file to the translator. All released applications are included in this translator so this is only for custom applications.

The expected input to the translate function is a javascript object which is expected to be the deep-merged union of the previous translation results. See implementation in vsm-mqtt-client-open-source for inspiration.

In many cases the translation depends on the previous translation result, e.g. when an object is too large for a single LoRaWan uplink. In order to support such large 
objects, the translator assumes that it has the previous translation result available when doing the next translation. This is particularily required for GNSS translation 
but also in order to generate correct time series.

Code Example: 

```
    // First uplink
    let initialObject = { encodedData: { hexEncoded: "63F74F110000000004F30096", port:22, timestamp: "2023-02-23T17:01:07.473Z" } };
    let {result, timeseries} = translate(initialObject);
    store(result in your database for use in the next translation);

    ...

    // When second uplink comes, merge the first object with new uplink
    let lastResult = restore(result from previous translation in your database);
    let secondObject = { ...lastResult, encodedData: { hexEncoded: "000102", port:1, timestamp: "2023-02-23T17:01:11.213Z" } };}
    let {result2, timeseries2} = translate(secondObject);
    store(result2 in your database for use in the next translation)
```


For outputs from the VM the translator generates two return values:
1. Time series (set for values older than the latest value) - an array of values older than the latest values.
2. Latest values (only set if the uplink contained the latest value of a particular data).

Note that if the device has been off-line (common for mobile use-cases or if network goes down) or if a more urgent signal is generated it can generate out-of-order events and later upload older events.
Also for this functionality the translator requires the previous translation result (timestamps object) to determine if an uplink is newer than the previous value.

All this is made available in the MQTT client, which also support reformatting the output to fit your environment, and publishing it with a choice of or your own publisher.

# Basic Translator

Should you be using only a single type of unit and have no ability to set up a independent MQTT client for any reason you can instead use the simplified translators in /basic-translators/ instead of adapting the universal generated translator to your system, as that requires persistent data memory that most LNSes lack. Navigate to the folder compatible with your LNS and find your product and app version and use it in your LNS.

## How to identify which version to use

If you are unsure which version to use, simply chose any version of your product and join your device to the network. After the join sequence, the device will upload data on port 15, which when translated will contain a ´ruleCrc32´ value. If your device is already joined, you can trigger the device to resend the information by sending a downlink with the hex data 00 to port 15. (Note that you will have to wait for the device to send an uplink before it will accept the downlink.)

When you have your CRC, compare that value to the table in vsm-translator-open-source/basic-translator/x/dots-basic-x-translator-index.csv. If your CRC is compatible with the version you already picked you're good to go, if it does not match, simply switch to the correct version and any future data will be decoded correctly.

## Drawbacks to basic translators

To handle large uplinks the device will normally split an uplink into multiple frames when they cannot fit in the max frame allowed by the data rate. The basic translator lacks the memory to access the previous frames and therefore this functionality will not work. This is mainly a concern for the uplink of WiFi and GNSS geopositioning scanning, however, but may in some very rare cases also affect normal data transfer on networks with very poor conditions.

Any positioning data you do manage to get through will also not result in a solved position, as positioning solving requires an external service such as Semtech LoRa Cloud to function which you will have to set up seperately.
