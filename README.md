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

Should you require a simpler solution in the form of a single JS function to translate a single type of device, for example for Chirpstack, check out the Basic Translators branch https://github.com/Sensative/vsm-translator-open-source/tree/dots-basic-translators of this git repo. These translators are still under development and may be subject to bugs. The README of that branch contains more information on how to use them and the limitations inherit to them.
