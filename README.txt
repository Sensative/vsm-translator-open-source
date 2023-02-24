README
^^^^^^

This software is designed to decode LoRaWan uplink traffic from the Sensative VSM driven applications in LoRaWan sensors.
Documentation is available on request from Sensative AB (www.sensative.com).
The entire software is under MIT license, see LICENSE.txt.

Required Files
^^^^^^^^^^^^^^

LICENSE.txt
    The MIT software license.

dots-translator-generated.cjs
    Actual translator AND testcases/example calls to the translator.

Optional Files 
^^^^^^^^^^^^^^

install.sh
    Wrapper for install-yggio-translator.js

install-yggio-translator.js
    Install this translator in a Yggio server. User account is required. Contact Sensative for user account.
    For this there is a dependency to the node-fetch package.


About the translator
^^^^^^^^^^^^^^^^^^^^
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

    // First uplink
    let initialObject = { encodedData: { hexEncoded: "63F74F110000000004F30096", port:22, timestamp: "2023-02-23T17:01:07.473Z" } };
    let {result1, timeseries1} = translate(initialObject);
    store(result1 in your database for use in the next translation);

    ...

    // When second uplink comes, merge the first object with new uplink
    let lastResult = restore(result from previous translation in your database);
    let secondObject = { ...lastResult, encodedData: { hexEncoded: "000102", port:1, timestamp: "2023-02-23T17:01:11.213Z" } };}
    let {result2, timeseries2} = translate(secondObject);


For outputs from the VM the translator generates two return values:
1. Time series (set for values older than the latest value) - an array of values older than the latest values.
2. Latest values (only set if the uplink contained the latest value of a particular data).

Note that if the device has been off-line (common for mobile use-cases or if network goes down) or if a more urgent signal is generated it can generate out-of-order events and later upload older events.
Also for this functionality the translator requires the previous translation result (timestamps object) to determine if an uplink is newer than the previous value.


