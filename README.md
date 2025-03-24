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
    Install this translator in a Yggio server. User account is required. Contact Sensative for user account.
    For this there is a dependency to the node-fetch package.


# Troubleshooting

## Device does not get output field (or it is empty)

The indication looking at the data is that the translator is either not assigned (should be set to sensative-vsm-translator), or that for some reason the translator was not active at the time of joining the device.

The data for the device should contain a .vsm field with device meta-information which in particular should hold the software revision of the sensor and which application it is running (including its translation schema). Without that information it does not know how to translate the sensor app output.

So, check the following two items:
* Is the translator active?
* Rejoin the device if/when sure the translator is active.
Should the problem persist after that I need to check with the yggio team how the server is configured.



# About the Translator
The translator is a partially context-free parser of uplinks from Sensative devices built on the VSM (Virtual Sensor Machine) architecture.
Sensors run apps (aka rules or apps) which define their behaviour. Each app (ruleset) when compiled gets a map file which maps binary 
output and input identifiers to their logical meaning. In the dots-translator-generated.cjs there is a table which provides the mapping 
information for all released apps. Should you have a custom app, you can add that app to the table.

In case you wish to integrate a particular Sensative or affiliate product to your platform, you need to provide this map file to the translator. 

The expected input to the translate function is a javascript object which is expected to be the union of the previous translation results.

In many cases the translation depends on the previous translation result, e.g. when an object is too large for a single LoRaWan uplink. In order to support such large 
objects, the translator assumes that it has the previous translation result available when doing the next translation. This is particularily required for GNSS translation 
but also in order to generate correct time series.

Code Example: 

```
    // First uplink
    let initialObject = { encodedData: { hexEncoded: "63F74F110000000004F30096", port:22, timestamp: "2023-02-23T17:01:07.473Z" } };
    let {result1, timeseries1} = translate(initialObject);
    store(result1 in your database for use in the next translation);

    ...

    // When second uplink comes, merge the first object with new uplink
    let lastResult = restore(result from previous translation in your database);
    let secondObject = { ...lastResult, encodedData: { hexEncoded: "000102", port:1, timestamp: "2023-02-23T17:01:11.213Z" } };}
    let {result2, timeseries2} = translate(secondObject);
```


For outputs from the VM the translator generates two return values:
1. Time series (set for values older than the latest value) - an array of values older than the latest values.
2. Latest values (only set if the uplink contained the latest value of a particular data).

Note that if the device has been off-line (common for mobile use-cases or if network goes down) or if a more urgent signal is generated it can generate out-of-order events and later upload older events.
Also for this functionality the translator requires the previous translation result (timestamps object) to determine if an uplink is newer than the previous value.

All this is made available in the MQTT client, which also support reformatting the output to fit your environment, and publishing it there.

# Basic Translator

Should you be using only a single type of unit and have no ability to set up a independent MQTT client for any reason you can instead use the simplified translators in /basic-translators/ instead of adapting the universal generated translator to your system, as that requires persistent data memory that most LNSes lack. Navigate to the folder compatible with your LNS and find your product and app version and use it in your LNS.

## How to identify which version to use

If you are unsure which version to use, simply chose any version of your product and join your device to the network. After the join sequence, the device will upload data on port 15, which when translated will contain a ´ruleCrc32´ value. If your device is already joined, you can trigger the device to resend the information by sending a downlink with the hex data 00 to port 15. (Note that you will have to wait for the device to send an uplink before it will accept the downlink.)

When you have your CRC, compare that value to the table in vsm-translator-open-source/basic-translator/x/dots-basic-x-translator-index.csv. If your CRC is compatible with the version you already picked you're good to go, if it does not match, simply switch to the correct version and any future data will be decoded correctly.

## Drawbacks to basic translators

To handle large uplinks the device will normally split an uplink into multiple frames when they cannot fit in the max frame allowed by the data rate. The basic translator lacks the memory to access the previous frames and therefore this functionality will not work. This is mainly a concern for the uplink of WiFi and GNSS geopositioning scanning, however, but may in some very rare cases also affect normal data transfer on networks with very poor conditions.

Any positioning data you do manage to get through will also not result in a solved position, as positioning solving requires an external service such as Semtech LoRa Cloud to function which you will have to set up seperately.
