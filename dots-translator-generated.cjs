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

    const MESH_PORT_OFFSET = 300;
/// DO NOT CHANGE THE BELOW - IT IS REPLACED AUTOMATICALLY WITH KNOWN SCHEMAS
const knownSchemas = {


            40829709: {
                name: "Motion-measure",
                versions: "R28 R27 R26",
                mapData: `M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalHours 160 0xa0  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 161 0xa1  1
M input tempAlarmHighLevel 162 0xa2  1
M output accX 144 0x90  0.001
M output accY 145 0x91  0.001
M output accZ 146 0x92  0.001
M output acc 147 0x93  0.001
M output pressure_hPa 184 0xb8  0.01
M input motionThreshold_m_s2 179 0xb3  0.001
M input sampleInterval_s 163 0xa3  1
M input sampleCountMax 164 0xa4  1
M input enableBarometer 165 0xa5  1
M output motion 166 0xa6  1
M output batteryPercent 167 0xa7  1
`,
            }, 
        

            47853213: {
                name: "Lifefinder",
                versions: "R9 R12 R11 R10",
                mapData: `M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalMinutes 160 0xa0  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 161 0xa1  1
M input tempAlarmHighLevel 162 0xa2  1
M output batteryPercent 163 0xa3  1
M output alarmTime 144 0x90  1
M output capAlarm 129 0x81  1
M output buttonAlarm 130 0x82  1
M output capReport1 179 0xb3  1
M output capReport2 180 0xb4  1
M output soundAlarm 131 0x83  1
M output volts 181 0xb5  0.001
M input enableCapReports 165 0xa5  1
M input capAlarmLevel 182 0xb6  1
M input alarmAck 164 0xa4  1
`,
            }, 
        

            57715230: {
                name: "Tracker-stats",
                versions: "R8 R7 R6 R5",
                mapData: `M output volts 176 0xb0  0.001
M input gnssIntervalMinutes 160 0xa0  1
M input gnssScanMode 177 0xb1  1
M output numSatellites 161 0xa1  1
M output bestSatellites 184 0xb8  1
M output scanCount 185 0xb9  1
M output gpsTime 186 0xba  1
M output downlinkRssi 162 0xa2  1
M input air_pressure_hysteresis_bar 163 0xa3  1
M output air_pressure 187 0xbb  0.01
`,
            }, 
        

            58620517: {
                name: "Lifefinder-gnss",
                versions: "R25 R24",
                mapData: `M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalMinutes 160 0xa0  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 161 0xa1  1
M input tempAlarmHighLevel 162 0xa2  1
M output batteryPercent 163 0xa3  1
M output volts 179 0xb3  0.001
M output alarmTime 144 0x90  1
M output buttonAlarm 129 0x81  1
M output nfcDisabledAlarm 130 0x82  1
M output alarmAccumulatedTime 152 0x98  1
M output humidity 180 0xb4  0.01
M input maxAlarmMinutes 181 0xb5  1
M input humidityThreshold 182 0xb6  0.01
M input alarmResendsBeforeUnjoin 183 0xb7  1
M input alarmResendTime 165 0xa5  1
M input alarmAck 164 0xa4  1
`,
            }, 
        

            78751172: {
                name: "Radiotest",
                versions: "R28 R27 R26 R25 R24 R23",
                mapData: `M input frequency 184 0xb8  1
`,
            }, 
        

            79276854: {
                name: "Lifefinder-squad",
                versions: "R8 R7",
                mapData: `M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalMinutes 160 0xa0  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 161 0xa1  1
M input tempAlarmHighLevel 162 0xa2  1
M output alarmTime 144 0x90  1
M output buttonAlarm 129 0x81  1
M output volts 179 0xb3  0.001
M input maxAlarmMinutes 180 0xb4  1
M input alarmAck 164 0xa4  1
`,
            }, 
        

            90459126: {
                name: "Lifefinder-motion-nfc-both",
                versions: "R27",
                mapData: `M output temp 145 0x91  0.01
M output tempAlarm 128 0x80  1
M output humidity 176 0xb0  0.01
M input humidityThreshold 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input tempAlarmLowLevel 160 0xa0  1
M input tempAlarmHighLevel 161 0xa1  1
M output batteryPercent 162 0xa2  1
M output volts 179 0xb3  0.001
M output deviceActive 129 0x81  1
M output alarmTime 144 0x90  1
M input activeTimeMaxMinutes 180 0xb4  1
M input alarmAck 164 0xa4  1
M input maxAlarmMinutes 181 0xb5  1
M input stillMotionThreshold_mm_s2 182 0xb6  1
M input movingMotionThreshold_mm_s2 183 0xb7  1
M input stationaryPositionMinutes 163 0xa3  1
M input movingPositionMinutes 165 0xa5  1
M output accumulatedStationaryTime 146 0x92  1
M output accumulatedMovingTime 147 0x93  1
M input limitedScanChannels 184 0xb8  1
M input minimumWifiResult 166 0xa6  1
M input positioningFreqency 167 0xa7  1
`,
            }, 
        

            174308877: {
                name: "Airport-int",
                versions: "R10",
                mapData: `M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalHours 160 0xa0  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 161 0xa1  1
M input tempAlarmHighLevel 162 0xa2  1
M input motionThreshold_mm_s2 179 0xb3  1
M input limitedScanChannels 184 0xb8  1
M input fullScanChannels 185 0xb9  1
M output motionCount 186 0xba  1
M input quarterlyScanBudget 163 0xa3  1
M input maxBudget 180 0xb4  1
M input singleWifiScanAgain_minutes 164 0xa4  1
M input minimumWifiCount 165 0xa5  1
M input fullWifiScan_minutes 166 0xa6  1
M input gpsScan_minutes 167 0xa7  1
M input motionCountEnabled 168 0xa8  1
M output batteryPercent 169 0xa9  1
`,
            }, 
        

            190349531: {
                name: "Radiotest-measure",
                versions: "R13 R12",
                mapData: ``,
            }, 
        

            232953314: {
                name: "Lifefinder-wifi",
                versions: "R26",
                mapData: `M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalMinutes 160 0xa0  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 161 0xa1  1
M input tempAlarmHighLevel 162 0xa2  1
M output batteryPercent 163 0xa3  1
M output volts 179 0xb3  0.001
M output alarmTime 144 0x90  1
M output traceTime 145 0x91  1
M output nfcDisabledAlarm 129 0x81  1
M output alarmAccumulatedTime 152 0x98  1
M output humidity 180 0xb4  0.01
M output traceTrigger 130 0x82  1
M input maxAlarmMinutes 181 0xb5  1
M input maxTraceMinutes 165 0xa5  1
M input traceTriggerMinutes 166 0xa6  1
M input humidityThreshold 182 0xb6  0.01
M input alarmResendsBeforeUnjoin 183 0xb7  1
M input resendsBeforeUnjoin 167 0xa7  1
M input alarmResendTime 168 0xa8  1
M input quickAlarm 169 0xa9  1
M input nfcDisablesAlarm 170 0xaa  1
M input alarmAck 164 0xa4  1
M input positioningFreqency 171 0xab  1
`,
            }, 
        

            238715532: {
                name: "MeshComfortExtender",
                versions: "",
                mapData: `M input meshSyncInterval_minutes 176 0xb0  1
M input meshEnableUpside 160 0xa0  1
M input meshEnableDownside 161 0xa1  1
M input powerIndexFilterFactor 162 0xa2  1
M input maxPowerIndex 163 0xa3  1
M output temp 177 0xb1  0.01
M output averageTemp 178 0xb2  0.01
M input tempHysteresis 179 0xb3  0.01
M input averageTempHysteresis 164 0xa4  0.1
M input averageTempIntervalMinutes 165 0xa5  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 166 0xa6  1
M input tempAlarmHighLevel 167 0xa7  1
M output humidity 180 0xb4  0.01
M output averageHumidity 144 0x90  0.01
M input humidityTreshold 181 0xb5  0.01
M input averageHumidityIntervalMinutes 168 0xa8  1
M output batteryPercent 169 0xa9  1
M input wifiScanInterval_h 170 0xaa  1
`,
            }, 
        

            289128601: {
                name: "Motion-measure",
                versions: "R28 R27",
                mapData: `M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalHours 160 0xa0  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 161 0xa1  1
M input tempAlarmHighLevel 162 0xa2  1
M output accX 144 0x90  0.001
M output accY 145 0x91  0.001
M output accZ 146 0x92  0.001
M output acc 147 0x93  0.001
M output pressure_hPa 184 0xb8  0.01
M input motionThreshold_m_s2 179 0xb3  0.001
M input sampleInterval_s 163 0xa3  1
M input sampleCountMax 164 0xa4  1
M input enableBarometer 165 0xa5  1
M output motion 166 0xa6  1
M output batteryPercent 167 0xa7  1
M input powerIndexFilterFactor 168 0xa8  1
M input maxPowerIndex 169 0xa9  1
`,
            }, 
        

            305267858: {
                name: "MeshBridge",
                versions: "",
                mapData: `M input meshSyncInterval_minutes 176 0xb0  1
M input meshEnableUpside 160 0xa0  1
M input meshEnableDownside 161 0xa1  1
M input powerIndexFilterFactor 162 0xa2  1
M input maxPowerIndex 163 0xa3  1
M output temp 177 0xb1  0.01
M output averageTemp 178 0xb2  0.01
M input tempHysteresis 179 0xb3  0.01
M input averageTempHysteresis 164 0xa4  0.1
M input averageTempIntervalMinutes 165 0xa5  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 166 0xa6  1
M input tempAlarmHighLevel 167 0xa7  1
M output batteryPercent 168 0xa8  1
M input rejoinBudgetMax 169 0xa9  1
M input rejoinBudgetRefill 170 0xaa  1
M input rejoinTime 180 0xb4  1
M input wifiScanInterval_h 171 0xab  1
`,
            }, 
        

            313796611: {
                name: "MeshRadar",
                versions: "",
                mapData: `M input meshSyncInterval_minutes 176 0xb0  1
M input meshEnableUpside 160 0xa0  1
M input meshEnableDownside 161 0xa1  1
M output amplitude 144 0x90  1
M output distance 145 0x91  0.01
M output occupied 128 0x80  1
M input amplitudeHysteresis 177 0xb1  1
M input distanceHysteresis 162 0xa2  0.01
M output distanceAverage 146 0x92  0.01
M input averageDistanceIntervalMinutes 178 0xb2  1
M input averageDistanceLowAlarmLevel 179 0xb3  0.01
M input averageDistanceHighAlarmLevel 180 0xb4  0.01
M output averageDistanceAlarm 129 0x81  1
M output nfcContactCount 152 0x98  1
M output radarVoltage_V 181 0xb5  0.001
M output batteryPercent 163 0xa3  1
M output temp 182 0xb6  0.01
`,
            }, 
        

            376700598: {
                name: "Puck-tracker",
                versions: "R6 R5",
                mapData: `M input roamNetworkCount 160 0xa0  1
M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalHours 161 0xa1  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 162 0xa2  1
M input tempAlarmHighLevel 163 0xa3  1
M output volts 179 0xb3  0.001
M input gnssIntervalMinutes 164 0xa4  1
M input wifiIntervalMinutes 165 0xa5  1
`,
            }, 
        

            380665685: {
                name: "MeshComfortTimeCount",
                versions: "",
                mapData: `M input meshSyncInterval_minutes 176 0xb0  1
M input meshEnableUpside 160 0xa0  1
M input meshEnableDownside 161 0xa1  1
M input powerIndexFilterFactor 162 0xa2  1
M input maxPowerIndex 163 0xa3  1
M output hours 177 0xb1  1
M output temp 178 0xb2  0.01
M output averageTemp 179 0xb3  0.01
M input tempHysteresis 180 0xb4  0.01
M input averageTempHysteresis 164 0xa4  0.1
M input averageTempIntervalMinutes 165 0xa5  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 166 0xa6  1
M input tempAlarmHighLevel 167 0xa7  1
M output humidity 181 0xb5  0.01
M output averageHumidity 144 0x90  0.01
M input humidityTreshold 182 0xb6  0.01
M input averageHumidityIntervalMinutes 168 0xa8  1
M output batteryPercent 169 0xa9  1
M input wifiScanInterval_h 170 0xaa  1
`,
            }, 
        

            393429851: {
                name: "Lifefinder-alternating",
                versions: "R28",
                mapData: `M output temp 146 0x92  0.01
M output tempAlarm 128 0x80  1
M output humidity 176 0xb0  0.01
M input humidityThreshold 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input tempAlarmLowLevel 160 0xa0  1
M input tempAlarmHighLevel 161 0xa1  1
M output batteryPercent 162 0xa2  1
M output volts 179 0xb3  0.001
M output alarmTime 144 0x90  1
M output traceTime 145 0x91  1
M output nfcDisabledAlarm 129 0x81  1
M output alarmAccumulatedTime 152 0x98  1
M output traceTrigger 130 0x82  1
M input maxAlarmMinutes 180 0xb4  1
M input maxTraceMinutes 163 0xa3  1
M input traceTriggerMinutes 165 0xa5  1
M input alarmResendsBeforeUnjoin 181 0xb5  1
M input resendsBeforeUnjoin 166 0xa6  1
M input alarmResendTime 167 0xa7  1
M input quickAlarm 168 0xa8  1
M input nfcDisablesAlarm 169 0xa9  1
M input alarmAck 164 0xa4  1
M input positioningFreqency 170 0xaa  1
M input scanTimeMs 182 0xb6  1
M input limitedScanChannels 184 0xb8  1
`,
            }, 
        

            399948366: {
                name: "Lifefinder-squad",
                versions: "R9 R12 R11 R10",
                mapData: `M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalMinutes 160 0xa0  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 161 0xa1  1
M input tempAlarmHighLevel 162 0xa2  1
M output batteryPercent 163 0xa3  1
M output alarmTime 144 0x90  1
M output buttonAlarm 129 0x81  1
M output volts 179 0xb3  0.001
M input maxAlarmMinutes 180 0xb4  1
M input alarmAck 164 0xa4  1
`,
            }, 
        

            472391447: {
                name: "Square-air",
                versions: "R13",
                mapData: `M input roamNetworkCount 160 0xa0  1
M output batteryPercent 161 0xa1  1
M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalMinutes 162 0xa2  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 163 0xa3  1
M input tempAlarmHighLevel 164 0xa4  1
M output humidity 179 0xb3  0.01
M output averageHumidity 144 0x90  0.01
M input humidityTreshold 180 0xb4  0.01
M input averageHumidityIntervalMinutes 165 0xa5  1
M output lux 181 0xb5  1
M output averageLux 145 0x91  1
M input luxTresholdPercent 182 0xb6  1
M input averageLuxIntervalMinutes 166 0xa6  1
M output air_run_in_status 167 0xa7  1
M output air_stab_status 168 0xa8  1
M output air_iaq_accuracy 169 0xa9  1
M output air_iaq 146 0x92  1
M output air_co2 147 0x93  1
M output air_pressure 184 0xb8  0.01
M output air_breath_voc_equivalent 152 0x98  0.01
M output air_static_iaq 185 0xb9  1
M input air_interval_minutes 170 0xaa  1
M input air_static_iaq_alarm_level 186 0xba  1
M input air_iaq_alarm_level 187 0xbb  1
M output air_iaq_alarm 129 0x81  1
`,
            }, 
        

            489186430: {
                name: "Tracker",
                versions: "R21 R20 R19 R18 R16 R15 R14 R13 R12 R11 R10",
                mapData: `M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalHours 160 0xa0  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 161 0xa1  1
M input tempAlarmHighLevel 162 0xa2  1
M input roamNetworkCount 163 0xa3  1
M input motionThreshold_mm_s2 179 0xb3  1
M input limitedScanChannels 184 0xb8  1
M input fullScanChannels 185 0xb9  1
M output motionCount 186 0xba  1
M output motionTimeMinutes 187 0xbb  1
M input quarterlyScanBudget 164 0xa4  1
M input maxBudget 180 0xb4  1
M input singleWifiScanAgain_minutes 165 0xa5  1
M input minimumWifiCount 166 0xa6  1
M input fullWifiScan_minutes 167 0xa7  1
M input gpsScan_minutes 168 0xa8  1
M input motionCountEnabled 169 0xa9  1
M input motionTimeEnabled 170 0xaa  1
M input movingScanIntervalMinutes 181 0xb5  1
M input stationaryScanIntervalMinutes 182 0xb6  1
M output batteryPercent 171 0xab  1
`,
            }, 
        

            493404408: {
                name: "Lifefinder-wifi",
                versions: "R23",
                mapData: `M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalMinutes 160 0xa0  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 161 0xa1  1
M input tempAlarmHighLevel 162 0xa2  1
M output batteryPercent 163 0xa3  1
M output volts 179 0xb3  0.001
M output alarmTime 144 0x90  1
M output buttonAlarm 129 0x81  1
M output nfcDisabledAlarm 130 0x82  1
M output alarmAccumulatedTime 152 0x98  1
M output humidity 180 0xb4  0.01
M input maxAlarmMinutes 181 0xb5  1
M input humidityThreshold 182 0xb6  0.01
M input alarmResendsBeforeUnjoin 183 0xb7  1
M input alarmResendTime 165 0xa5  1
M input alarmAck 164 0xa4  1
`,
            }, 
        

            501251891: {
                name: "Lifefinder-alternating",
                versions: "R25 R24",
                mapData: `M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalMinutes 160 0xa0  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 161 0xa1  1
M input tempAlarmHighLevel 162 0xa2  1
M output batteryPercent 163 0xa3  1
M output volts 179 0xb3  0.001
M output alarmTime 144 0x90  1
M output buttonAlarm 129 0x81  1
M output nfcDisabledAlarm 130 0x82  1
M output alarmAccumulatedTime 152 0x98  1
M output humidity 180 0xb4  0.01
M input maxAlarmMinutes 181 0xb5  1
M input humidityThreshold 182 0xb6  0.01
M input alarmResendsBeforeUnjoin 183 0xb7  1
M input alarmResendTime 165 0xa5  1
M input alarmAck 164 0xa4  1
`,
            }, 
        

            517999093: {
                name: "Square-comfort-sound",
                versions: "R14",
                mapData: `M input roamNetworkCount 160 0xa0  1
M output batteryPercent 161 0xa1  1
M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalMinutes 162 0xa2  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 163 0xa3  1
M input tempAlarmHighLevel 164 0xa4  1
M output humidity 179 0xb3  0.01
M output averageHumidity 144 0x90  0.01
M input humidityTreshold 180 0xb4  0.01
M input averageHumidityIntervalMinutes 165 0xa5  1
M output lux 181 0xb5  1
M output averageLux 145 0x91  1
M input luxTresholdPercent 182 0xb6  1
M input averageLuxIntervalMinutes 166 0xa6  1
M output soundLevel 183 0xb7  0.1
M input soundThreshold 167 0xa7  1
M input soundMinLevel 168 0xa8  1
M input soundAvgMinutes 169 0xa9  1
`,
            }, 
        

            534670557: {
                name: "Tracker",
                versions: "R9",
                mapData: `M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalHours 160 0xa0  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 161 0xa1  1
M input tempAlarmHighLevel 162 0xa2  1
M input roamNetworkCount 163 0xa3  1
M input motionThreshold_mm_s2 179 0xb3  1
M input limitedScanChannels 184 0xb8  1
M input fullScanChannels 185 0xb9  1
M output motionCount 186 0xba  1
M output motionTimeMinutes 187 0xbb  1
M input quarterlyScanBudget 164 0xa4  1
M input maxBudget 180 0xb4  1
M input singleWifiScanAgain_minutes 165 0xa5  1
M input minimumWifiCount 166 0xa6  1
M input fullWifiScan_minutes 167 0xa7  1
M input gpsScan_minutes 168 0xa8  1
M input motionCountEnabled 169 0xa9  1
M input motionTimeEnabled 170 0xaa  1
M input movingScanIntervalMinutes 181 0xb5  1
M input stationaryScanIntervalMinutes 182 0xb6  1
M output batteryPercent 171 0xab  1
`,
            }, 
        

            561898260: {
                name: "Puck-radar",
                versions: "R26 R25 R24 R23 R22 R21 R20 R19 R18 R16 R15 R14 R13",
                mapData: `M input roamNetworkCount 160 0xa0  1
M output amplitude 144 0x90  1
M output distance 145 0x91  0.01
M output occupied 128 0x80  1
M input amplitudeHysteresis 176 0xb0  1
M input distanceHysteresis 161 0xa1  0.01
M output distanceAverage 146 0x92  0.01
M input averageDistanceIntervalMinutes 177 0xb1  1
M input averageDistanceLowAlarmLevel 178 0xb2  0.01
M input averageDistanceHighAlarmLevel 179 0xb3  0.01
M output averageDistanceAlarm 129 0x81  1
M output nfcContactCount 152 0x98  1
M output radarVoltage_V 180 0xb4  0.001
`,
            }, 
        

            584652534: {
                name: "Gnss-autonomous-test",
                versions: "R8 R7",
                mapData: `M output numSatellites 160 0xa0  1
M output bestSatellites 184 0xb8  1
M output scanCount 185 0xb9  1
`,
            }, 
        

            596652351: {
                name: "Lifefinder",
                versions: "R6 R5",
                mapData: `M input roamNetworkCount 160 0xa0  1
M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalMinutes 161 0xa1  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 162 0xa2  1
M input tempAlarmHighLevel 163 0xa3  1
M output alarmTime 144 0x90  1
M output capAlarm 129 0x81  1
M output buttonAlarm 130 0x82  1
M output capReport1 179 0xb3  1
M output capReport2 180 0xb4  1
M output soundAlarm 131 0x83  1
M output volts 181 0xb5  0.001
M input enableCapReports 165 0xa5  1
M input capAlarmLevel 182 0xb6  1
M input alarmAck 164 0xa4  1
`,
            }, 
        

            656740722: {
                name: "Square-comfort",
                versions: "R8 R7 R6 R5",
                mapData: `M input roamNetworkCount 160 0xa0  1
M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalMinutes 161 0xa1  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 162 0xa2  1
M input tempAlarmHighLevel 163 0xa3  1
M output humidity 179 0xb3  0.01
M output averageHumidity 144 0x90  0.01
M input humidityTreshold 180 0xb4  0.01
M input averageHumidityIntervalMinutes 164 0xa4  1
M output lux 181 0xb5  1
M output averageLux 145 0x91  1
M input luxTresholdPercent 182 0xb6  1
M input averageLuxIntervalMinutes 165 0xa5  1
`,
            }, 
        

            685004179: {
                name: "Lifefinder-wifi",
                versions: "R22",
                mapData: `M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalMinutes 160 0xa0  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 161 0xa1  1
M input tempAlarmHighLevel 162 0xa2  1
M output batteryPercent 163 0xa3  1
M output volts 179 0xb3  0.001
M output alarmTime 144 0x90  1
M output buttonAlarm 129 0x81  1
M output nfcDisabledAlarm 130 0x82  1
M output alarmAccumulatedTime 152 0x98  1
M output humidity 180 0xb4  0.01
M input maxAlarmMinutes 181 0xb5  1
M input humidityThreshold 182 0xb6  0.01
M input alarmResendsBeforeUnjoin 183 0xb7  1
M input alarmResendTime 165 0xa5  1
M input alarmAck 164 0xa4  1
`,
            }, 
        

            691254335: {
                name: "Lifefinder-wifi",
                versions: "R15 R14 R13",
                mapData: `M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalMinutes 160 0xa0  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 161 0xa1  1
M input tempAlarmHighLevel 162 0xa2  1
M output batteryPercent 163 0xa3  1
M output alarmTime 144 0x90  1
M output buttonAlarm 129 0x81  1
M output volts 179 0xb3  0.001
M input maxAlarmMinutes 180 0xb4  1
M input alarmAck 164 0xa4  1
M input limitedScanChannels 184 0xb8  1
`,
            }, 
        

            729172455: {
                name: "Puck-radar-fast-rejoin",
                versions: "R12",
                mapData: `M input roamNetworkCount 160 0xa0  1
M output amplitude 144 0x90  1
M output distance 145 0x91  0.01
M output occupied 128 0x80  1
M input amplitudeHysteresis 176 0xb0  1
M input distanceHysteresis 161 0xa1  0.01
M output distanceAverage 146 0x92  0.01
M input averageDistanceIntervalMinutes 177 0xb1  1
M input averageDistanceLowAlarmLevel 178 0xb2  0.01
M input averageDistanceHighAlarmLevel 179 0xb3  0.01
M output averageDistanceAlarm 129 0x81  1
M output nfcContactCount 152 0x98  1
`,
            }, 
        

            871865531: {
                name: "Lifefinder",
                versions: "R8 R7",
                mapData: `M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalMinutes 160 0xa0  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 161 0xa1  1
M input tempAlarmHighLevel 162 0xa2  1
M output alarmTime 144 0x90  1
M output capAlarm 129 0x81  1
M output buttonAlarm 130 0x82  1
M output capReport1 179 0xb3  1
M output capReport2 180 0xb4  1
M output soundAlarm 131 0x83  1
M output volts 181 0xb5  0.001
M input enableCapReports 163 0xa3  1
M input capAlarmLevel 182 0xb6  1
M input alarmAck 164 0xa4  1
`,
            }, 
        

            875676680: {
                name: "Square-air",
                versions: "R7 R6",
                mapData: `M input roamNetworkCount 160 0xa0  1
M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalMinutes 161 0xa1  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 162 0xa2  1
M input tempAlarmHighLevel 163 0xa3  1
M output humidity 179 0xb3  0.01
M output averageHumidity 144 0x90  0.01
M input humidityTreshold 180 0xb4  0.01
M input averageHumidityIntervalMinutes 164 0xa4  1
M output lux 181 0xb5  1
M output averageLux 145 0x91  1
M input luxTresholdPercent 182 0xb6  1
M input averageLuxIntervalMinutes 165 0xa5  1
M output soundLevel 183 0xb7  0.1
M input soundThreshold 166 0xa6  1
M input soundMinLevel 167 0xa7  1
M input soundAvgMinutes 168 0xa8  1
M output air_run_in_status 169 0xa9  1
M output air_stab_status 170 0xaa  1
M output air_iaq_accuracy 171 0xab  1
M output air_iaq 146 0x92  1
M output air_co2 147 0x93  1
M output air_pressure 184 0xb8  0.01
M output air_breath_voc_equivalent 152 0x98  0.01
M output air_static_iaq 185 0xb9  1
M input air_interval_minutes 172 0xac  1
`,
            }, 
        

            880650985: {
                name: "Generic-NFC-Reader",
                versions: "",
                mapData: `M output card_1 152 0x98  1
M output card_2 153 0x99  1
M output card_3 154 0x9a  1
`,
            }, 
        

            892254780: {
                name: "Lifefinder-gnss",
                versions: "R27",
                mapData: `M output temp 146 0x92  0.01
M output tempAlarm 128 0x80  1
M output humidity 176 0xb0  0.01
M input humidityThreshold 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input tempAlarmLowLevel 160 0xa0  1
M input tempAlarmHighLevel 161 0xa1  1
M output batteryPercent 162 0xa2  1
M output volts 179 0xb3  0.001
M output alarmTime 144 0x90  1
M output traceTime 145 0x91  1
M output nfcDisabledAlarm 129 0x81  1
M output alarmAccumulatedTime 152 0x98  1
M output traceTrigger 130 0x82  1
M input maxAlarmMinutes 180 0xb4  1
M input maxTraceMinutes 163 0xa3  1
M input traceTriggerMinutes 165 0xa5  1
M input alarmResendsBeforeUnjoin 181 0xb5  1
M input resendsBeforeUnjoin 166 0xa6  1
M input alarmResendTime 167 0xa7  1
M input quickAlarm 168 0xa8  1
M input nfcDisablesAlarm 169 0xa9  1
M input alarmAck 164 0xa4  1
M input positioningFreqency 170 0xaa  1
`,
            }, 
        

            915094797: {
                name: "Square-air",
                versions: "R12 R11",
                mapData: `M input roamNetworkCount 160 0xa0  1
M output batteryPercent 161 0xa1  1
M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalMinutes 162 0xa2  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 163 0xa3  1
M input tempAlarmHighLevel 164 0xa4  1
M output humidity 179 0xb3  0.01
M output averageHumidity 144 0x90  0.01
M input humidityTreshold 180 0xb4  0.01
M input averageHumidityIntervalMinutes 165 0xa5  1
M output lux 181 0xb5  1
M output averageLux 145 0x91  1
M input luxTresholdPercent 182 0xb6  1
M input averageLuxIntervalMinutes 166 0xa6  1
M output air_run_in_status 167 0xa7  1
M output air_stab_status 168 0xa8  1
M output air_iaq_accuracy 169 0xa9  1
M output air_iaq 146 0x92  1
M output air_co2 147 0x93  1
M output air_pressure 184 0xb8  0.01
M output air_breath_voc_equivalent 152 0x98  0.01
M output air_static_iaq 185 0xb9  1
M input air_interval_minutes 170 0xaa  1
M input air_static_iaq_alarm_level 186 0xba  1
M input air_iaq_alarm_level 187 0xbb  1
M output air_iaq_alarm 129 0x81  1
`,
            }, 
        

            924779957: {
                name: "Puck-radar-v6",
                versions: "R8 R7",
                mapData: `M input roamNetworkCount 160 0xa0  1
M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalHours 161 0xa1  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 162 0xa2  1
M input tempAlarmHighLevel 163 0xa3  1
M output amplitude 144 0x90  1
M output distance 145 0x91  0.01
M output occupied 129 0x81  1
M output bluetoothMacLS 184 0xb8  1
M output bluetoothMacMS 185 0xb9  1
M input amplitudeHysteresis 179 0xb3  1
M input distanceHysteresis 164 0xa4  0.01
M output batteryPercent 165 0xa5  1
M output underVoltage 166 0xa6  1
`,
            }, 
        

            1005192630: {
                name: "Lifefinder-wifi",
                versions: "",
                mapData: `M output temp 146 0x92  0.01
M output tempAlarm 128 0x80  1
M output humidity 176 0xb0  0.01
M input humidityThreshold 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input tempAlarmLowLevel 160 0xa0  1
M input tempAlarmHighLevel 161 0xa1  1
M output batteryPercent 162 0xa2  1
M output volts 179 0xb3  0.001
M output alarmTime 144 0x90  1
M output traceTime 145 0x91  1
M output nfcDisabledAlarm 129 0x81  1
M output alarmAccumulatedTime 152 0x98  1
M output traceAccumulatedTime 153 0x99  1
M output traceTrigger 130 0x82  1
M input maxAlarmMinutes 180 0xb4  1
M input maxTraceMinutes 163 0xa3  1
M input traceTriggerMinutes 165 0xa5  1
M input alarmResendsBeforeUnjoin 181 0xb5  1
M input resendsBeforeUnjoin 166 0xa6  1
M input alarmResendTime 167 0xa7  1
M input quickAlarm 168 0xa8  1
M input nfcDisablesAlarm 169 0xa9  1
M input alarmAck 164 0xa4  1
M input positioningFreqency 170 0xaa  1
M input scanTimeMs 182 0xb6  1
M input limitedScanChannels 184 0xb8  1
M input wifiDoubleScan 171 0xab  1
`,
            }, 
        

            1016353446: {
                name: "Airport-int-R6-fw-patch",
                versions: "R21 R20",
                mapData: `M input stillMotionThreshold_mm_s2 176 0xb0  1
M input movingMotionThreshold_mm_s2 177 0xb1  1
M input limitedScanChannels 184 0xb8  1
M input fullScanChannels 185 0xb9  1
M output motionCount 186 0xba  1
M input quarterlyScanBudget 160 0xa0  1
M input maxBudget 178 0xb2  1
M input singleWifiScanAgain_minutes 161 0xa1  1
M input movingWifiScanAgain_minutes 162 0xa2  1
M input minimumWifiCount 163 0xa3  1
M input fullWifiScan_minutes 164 0xa4  1
M input gpsScan_minutes 165 0xa5  1
M input motionCountEnabled 166 0xa6  1
M input abandonedCartTime_minutes 179 0xb3  1
M output abandonedCart 167 0xa7  1
M input quickRejoinBudgetMax 180 0xb4  1
M input motionDebugEnable 168 0xa8  1
M output motionDebug 169 0xa9  1
M output accelerometerStateDebug 170 0xaa  1
M input motionReleaseDelay 171 0xab  1
M output batteryPercent 172 0xac  1
`,
            }, 
        

            1047034189: {
                name: "Sniffer",
                versions: "R28 R27 R26 R25 R24 R23 R22 R21 R20 R19 R18 R16 R15 R14 R13 R12",
                mapData: ``,
            }, 
        

            1121182195: {
                name: "Puck-radar-fast-rejoin",
                versions: "R21 R20 R19 R18 R16 R15 R14 R13",
                mapData: `M input roamNetworkCount 160 0xa0  1
M output amplitude 144 0x90  1
M output distance 145 0x91  0.01
M output occupied 128 0x80  1
M input amplitudeHysteresis 176 0xb0  1
M input distanceHysteresis 161 0xa1  0.01
M output distanceAverage 146 0x92  0.01
M input averageDistanceIntervalMinutes 177 0xb1  1
M input averageDistanceLowAlarmLevel 178 0xb2  0.01
M input averageDistanceHighAlarmLevel 179 0xb3  0.01
M output averageDistanceAlarm 129 0x81  1
M output nfcContactCount 152 0x98  1
M output radarVoltage_V 180 0xb4  0.001
`,
            }, 
        

            1128699053: {
                name: "Square-air",
                versions: "R9 R10",
                mapData: `M input roamNetworkCount 160 0xa0  1
M output batteryPercent 161 0xa1  1
M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalMinutes 162 0xa2  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 163 0xa3  1
M input tempAlarmHighLevel 164 0xa4  1
M output humidity 179 0xb3  0.01
M output averageHumidity 144 0x90  0.01
M input humidityTreshold 180 0xb4  0.01
M input averageHumidityIntervalMinutes 165 0xa5  1
M output lux 181 0xb5  1
M output averageLux 145 0x91  1
M input luxTresholdPercent 182 0xb6  1
M input averageLuxIntervalMinutes 166 0xa6  1
M output air_run_in_status 167 0xa7  1
M output air_stab_status 168 0xa8  1
M output air_iaq_accuracy 169 0xa9  1
M output air_iaq 146 0x92  1
M output air_co2 147 0x93  1
M output air_pressure 184 0xb8  0.01
M output air_breath_voc_equivalent 152 0x98  0.01
M output air_static_iaq 185 0xb9  1
M input air_interval_minutes 170 0xaa  1
M input air_static_iaq_alarm_level 186 0xba  1
M input air_iaq_alarm_level 187 0xbb  1
M output air_iaq_alarm 129 0x81  1
`,
            }, 
        

            1161910006: {
                name: "Lifefinder-alternating",
                versions: "",
                mapData: `M output temp 146 0x92  0.01
M output tempAlarm 128 0x80  1
M output humidity 176 0xb0  0.01
M input humidityThreshold 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input tempAlarmLowLevel 160 0xa0  1
M input tempAlarmHighLevel 161 0xa1  1
M output batteryPercent 162 0xa2  1
M output volts 179 0xb3  0.001
M output alarmTime 144 0x90  1
M output traceTime 145 0x91  1
M output nfcDisabledAlarm 129 0x81  1
M output alarmAccumulatedTime 152 0x98  1
M output traceAccumulatedTime 153 0x99  1
M output traceTrigger 130 0x82  1
M input maxAlarmMinutes 180 0xb4  1
M input maxTraceMinutes 163 0xa3  1
M input traceTriggerMinutes 165 0xa5  1
M input alarmResendsBeforeUnjoin 181 0xb5  1
M input resendsBeforeUnjoin 166 0xa6  1
M input alarmResendTime 167 0xa7  1
M input quickAlarm 168 0xa8  1
M input nfcDisablesAlarm 169 0xa9  1
M input alarmAck 164 0xa4  1
M input positioningFreqency 170 0xaa  1
M input scanTimeMs 182 0xb6  1
M input limitedScanChannels 184 0xb8  1
`,
            }, 
        

            1188116463: {
                name: "Lifefinder-alternating",
                versions: "R22",
                mapData: `M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalMinutes 160 0xa0  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 161 0xa1  1
M input tempAlarmHighLevel 162 0xa2  1
M output batteryPercent 163 0xa3  1
M output volts 179 0xb3  0.001
M output alarmTime 144 0x90  1
M output buttonAlarm 129 0x81  1
M output nfcDisabledAlarm 130 0x82  1
M output alarmAccumulatedTime 152 0x98  1
M output humidity 180 0xb4  0.01
M input maxAlarmMinutes 181 0xb5  1
M input humidityThreshold 182 0xb6  0.01
M input alarmResendsBeforeUnjoin 183 0xb7  1
M input alarmResendTime 165 0xa5  1
M input alarmAck 164 0xa4  1
`,
            }, 
        

            1188848834: {
                name: "Motion-measure",
                versions: "R8",
                mapData: `M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalHours 160 0xa0  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 161 0xa1  1
M input tempAlarmHighLevel 162 0xa2  1
M output accX 144 0x90  0.001
M output accY 145 0x91  0.001
M output accZ 146 0x92  0.001
M output pressure_hPa 184 0xb8  0.01
M input motionThreshold_m_s2 179 0xb3  0.001
M input sampleInterval_s 163 0xa3  1
M input sampleCountMax 164 0xa4  1
M input enableBarometer 165 0xa5  1
M output motion 166 0xa6  1
`,
            }, 
        

            1239299816: {
                name: "MeshAir",
                versions: "",
                mapData: `M input meshSyncInterval_minutes 176 0xb0  1
M input meshEnableUpside 160 0xa0  1
M input meshEnableDownside 161 0xa1  1
M input powerIndexFilterFactor 162 0xa2  1
M input maxPowerIndex 163 0xa3  1
M output temp 177 0xb1  0.01
M output averageTemp 178 0xb2  0.01
M input tempHysteresis 179 0xb3  0.01
M input averageTempHysteresis 164 0xa4  0.1
M input averageTempIntervalMinutes 165 0xa5  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 166 0xa6  1
M input tempAlarmHighLevel 167 0xa7  1
M output humidity 180 0xb4  0.01
M output averageHumidity 144 0x90  0.01
M input humidityTreshold 181 0xb5  0.01
M input averageHumidityIntervalMinutes 168 0xa8  1
M output batteryPercent 169 0xa9  1
M input wifiScanInterval_h 170 0xaa  1
M output air_run_in_status 171 0xab  1
M output air_stab_status 172 0xac  1
M output air_iaq_accuracy 173 0xad  1
M output air_iaq 184 0xb8  1
M output air_co2 185 0xb9  1
M output air_pressure 186 0xba  0.01
M output air_breath_voc_equivalent 187 0xbb  0.01
M output air_static_iaq 188 0xbc  1
M input air_interval_minutes 174 0xae  1
M input air_static_iaq_alarm_level 189 0xbd  1
M input air_iaq_alarm_level 190 0xbe  1
M output air_iaq_alarm 129 0x81  1
`,
            }, 
        

            1274106153: {
                name: "Airport-int",
                versions: "R9",
                mapData: `M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalHours 160 0xa0  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 161 0xa1  1
M input tempAlarmHighLevel 162 0xa2  1
M input motionThreshold_mm_s2 179 0xb3  1
M input limitedScanChannels 184 0xb8  1
M input fullScanChannels 185 0xb9  1
M output motionCount 186 0xba  1
M input quarterlyScanBudget 163 0xa3  1
M input maxBudget 180 0xb4  1
M input singleWifiScanAgain_minutes 164 0xa4  1
M input minimumWifiCount 165 0xa5  1
M input fullWifiScan_minutes 166 0xa6  1
M input gpsScan_minutes 167 0xa7  1
M input motionCountEnabled 168 0xa8  1
M output batteryPercent 169 0xa9  1
`,
            }, 
        

            1280712094: {
                name: "Lifefinder-alternating",
                versions: "",
                mapData: `M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalMinutes 160 0xa0  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 161 0xa1  1
M input tempAlarmHighLevel 162 0xa2  1
M output batteryPercent 163 0xa3  1
M output volts 179 0xb3  0.001
M output alarmTime 144 0x90  1
M output traceTime 145 0x91  1
M output nfcDisabledAlarm 129 0x81  1
M output alarmAccumulatedTime 152 0x98  1
M output humidity 180 0xb4  0.01
M output traceTrigger 165 0xa5  1
M input maxAlarmMinutes 181 0xb5  1
M input maxTraceMinutes 166 0xa6  1
M input traceTriggerMinutes 167 0xa7  1
M input humidityThreshold 182 0xb6  0.01
M input alarmResendsBeforeUnjoin 183 0xb7  1
M input alarmResendTime 168 0xa8  1
M input quickAlarm 169 0xa9  1
M input nfcDisablesAlarm 170 0xaa  1
M input alarmAck 164 0xa4  1
M input positioningFreqency 171 0xab  1
`,
            }, 
        

            1304526571: {
                name: "Motion-measure-unconf",
                versions: "R28 R27 R26",
                mapData: `M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalHours 160 0xa0  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 161 0xa1  1
M input tempAlarmHighLevel 162 0xa2  1
M output accX 179 0xb3  0.001
M output accY 180 0xb4  0.001
M output accZ 181 0xb5  0.001
M output acc 182 0xb6  0.001
M output pressure_hPa 184 0xb8  0.01
M input motionThreshold_m_s2 183 0xb7  0.001
M input sampleInterval_s 163 0xa3  1
M input sampleCountMax 164 0xa4  1
M input enableBarometer 165 0xa5  1
M output motion 166 0xa6  1
M output batteryPercent 167 0xa7  1
`,
            }, 
        

            1319111708: {
                name: "Compliance-test",
                versions: "R9 R8 R7 R6 R5 R28 R27 R26 R25 R24 R23 R22 R21 R20 R19 R18 R16 R15 R14 R13 R12 R11 R10",
                mapData: ``,
            }, 
        

            1325798073: {
                name: "Puck-radar",
                versions: "R12 R11",
                mapData: `M input roamNetworkCount 160 0xa0  1
M output amplitude 144 0x90  1
M output distance 145 0x91  0.01
M output occupied 128 0x80  1
M input amplitudeHysteresis 176 0xb0  1
M input distanceHysteresis 161 0xa1  0.01
M output distanceAverage 146 0x92  0.01
M input averageDistanceIntervalMinutes 177 0xb1  1
M input averageDistanceLowAlarmLevel 178 0xb2  0.01
M input averageDistanceHighAlarmLevel 179 0xb3  0.01
M output averageDistanceAlarm 129 0x81  1
M output nfcContactCount 152 0x98  1
`,
            }, 
        

            1340832739: {
                name: "Lifefinder-motion-nfc-both",
                versions: "R28",
                mapData: `M output temp 145 0x91  0.01
M output tempAlarm 128 0x80  1
M output humidity 176 0xb0  0.01
M input humidityThreshold 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input tempAlarmLowLevel 160 0xa0  1
M input tempAlarmHighLevel 161 0xa1  1
M output batteryPercent 162 0xa2  1
M output volts 179 0xb3  0.001
M output deviceActive 129 0x81  1
M output alarmTime 144 0x90  1
M input activeTimeMaxMinutes 184 0xb8  1
M input alarmAck 164 0xa4  1
M input maxAlarmMinutes 180 0xb4  1
M input stillMotionThreshold_mm_s2 181 0xb5  1
M input movingMotionThreshold_mm_s2 182 0xb6  1
M input stationaryPositionMinutes 163 0xa3  1
M input movingPositionMinutes 165 0xa5  1
M output accumulatedStationaryTime 146 0x92  1
M output accumulatedMovingTime 147 0x93  1
M input scanTimeMs 183 0xb7  1
M input limitedScanChannels 185 0xb9  1
M input minimumWifiResult 166 0xa6  1
M input positioningFreqency 167 0xa7  1
`,
            }, 
        

            1355326083: {
                name: "Square-comfort-sound",
                versions: "R18 R16",
                mapData: `M input roamNetworkCount 160 0xa0  1
M output batteryPercent 161 0xa1  1
M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalMinutes 162 0xa2  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 163 0xa3  1
M input tempAlarmHighLevel 164 0xa4  1
M output humidity 179 0xb3  0.01
M output averageHumidity 144 0x90  0.01
M input humidityTreshold 180 0xb4  0.01
M input averageHumidityIntervalMinutes 165 0xa5  1
M output lux 181 0xb5  1
M output averageLux 145 0x91  1
M input luxTresholdPercent 182 0xb6  1
M input averageLuxIntervalMinutes 166 0xa6  1
M output soundLevel 183 0xb7  0.1
M input soundThreshold 167 0xa7  1
M input soundMinLevel 168 0xa8  1
M input soundAvgMinutes 169 0xa9  1
M output soundAlarm 129 0x81  1
M input soundAlarmTimeoutMinutes 170 0xaa  1
`,
            }, 
        

            1367119623: {
                name: "Motion-spectrum",
                versions: "R26",
                mapData: `M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalHours 160 0xa0  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 161 0xa1  1
M input tempAlarmHighLevel 162 0xa2  1
M input motionThreshold_m_s2 179 0xb3  0.001
M input motionSpectrumMode 163 0xa3  1
M output acc_1hz 129 0x81  1
M output acc_2hz 130 0x82  1
M output acc_4hz 131 0x83  1
M output acc_8hz 132 0x84  1
M output acc_16hz 133 0x85  1
M output acc_32hz 134 0x86  1
M output acc_64hz 135 0x87  1
M output acc_128hz 136 0x88  1
M output acc_256hz 137 0x89  1
M output acc_energy_sum_mms2_square 184 0xb8  1
M output motion 164 0xa4  1
M input motionPollIntervalMinutes 165 0xa5  1
M output batteryPercent 166 0xa6  1
`,
            }, 
        

            1368947946: {
                name: "Digital-gpio",
                versions: "R25 R24",
                mapData: `M input roamNetworkCount 160 0xa0  1
M output detection 128 0x80  1
M input activation 129 0x81  1
M input resendTime 161 0xa1  1
M input heartbeatMinutes 162 0xa2  1
M output heartbeat 130 0x82  1
M input pollInterval 163 0xa3  1
M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalHours 164 0xa4  1
M output tempAlarm 131 0x83  1
M input tempAlarmLowLevel 165 0xa5  1
M input tempAlarmHighLevel 166 0xa6  1
`,
            }, 
        

            1388527692: {
                name: "Lifefinder-wifi",
                versions: "R28",
                mapData: `M output temp 146 0x92  0.01
M output tempAlarm 128 0x80  1
M output humidity 176 0xb0  0.01
M input humidityThreshold 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input tempAlarmLowLevel 160 0xa0  1
M input tempAlarmHighLevel 161 0xa1  1
M output batteryPercent 162 0xa2  1
M output volts 179 0xb3  0.001
M output alarmTime 144 0x90  1
M output traceTime 145 0x91  1
M output nfcDisabledAlarm 129 0x81  1
M output alarmAccumulatedTime 152 0x98  1
M output traceTrigger 130 0x82  1
M input maxAlarmMinutes 180 0xb4  1
M input maxTraceMinutes 163 0xa3  1
M input traceTriggerMinutes 165 0xa5  1
M input alarmResendsBeforeUnjoin 181 0xb5  1
M input resendsBeforeUnjoin 166 0xa6  1
M input alarmResendTime 167 0xa7  1
M input quickAlarm 168 0xa8  1
M input nfcDisablesAlarm 169 0xa9  1
M input alarmAck 164 0xa4  1
M input positioningFreqency 170 0xaa  1
M input scanTimeMs 182 0xb6  1
M input limitedScanChannels 184 0xb8  1
M input wifiDoubleScan 171 0xab  1
`,
            }, 
        

            1394329318: {
                name: "Seat-occupancy",
                versions: "",
                mapData: `M input roamNetworkCount 160 0xa0  1
M input powerIndexFilterFactor 161 0xa1  1
M input maxPowerIndex 162 0xa2  1
M output occupied 128 0x80  1
M output object 129 0x81  1
M output radarVoltage_V 176 0xb0  0.001
M output nfcContactCount 152 0x98  1
M output temp 177 0xb1  0.01
M input timeBetweenJoinAttemts 184 0xb8  1
M input timeBeforeUnjoin 178 0xb2  1
M input minResendWaitTime 179 0xb3  1
M input batteryReportInterval 163 0xa3  1
M input temperatureReportInterval 164 0xa4  1
M input temperatureUserCalibration 180 0xb4  0.01
M input debugLevel 165 0xa5  1
M output amplitude 144 0x90  1
M output distance 145 0x91  0.01
M output amplitude2 146 0x92  1
M output distance2 147 0x93  0.01
M output state 181 0xb5  1
`,
            }, 
        

            1431126559: {
                name: "Lifefinder-motion-nfc-wifi",
                versions: "R27",
                mapData: `M output temp 145 0x91  0.01
M output tempAlarm 128 0x80  1
M output humidity 176 0xb0  0.01
M input humidityThreshold 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input tempAlarmLowLevel 160 0xa0  1
M input tempAlarmHighLevel 161 0xa1  1
M output batteryPercent 162 0xa2  1
M output volts 179 0xb3  0.001
M output deviceActive 129 0x81  1
M output alarmTime 144 0x90  1
M input activeTimeMaxMinutes 180 0xb4  1
M input alarmAck 164 0xa4  1
M input maxAlarmMinutes 181 0xb5  1
M input stillMotionThreshold_mm_s2 182 0xb6  1
M input movingMotionThreshold_mm_s2 183 0xb7  1
M input stationaryPositionMinutes 163 0xa3  1
M input movingPositionMinutes 165 0xa5  1
M output accumulatedStationaryTime 146 0x92  1
M output accumulatedMovingTime 147 0x93  1
M input limitedScanChannels 184 0xb8  1
M input positioningFreqency 166 0xa6  1
`,
            }, 
        

            1548534003: {
                name: "Motion-spectrum",
                versions: "R28 R27",
                mapData: `M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalHours 160 0xa0  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 161 0xa1  1
M input tempAlarmHighLevel 162 0xa2  1
M input motionThreshold_m_s2 179 0xb3  0.001
M input motionSpectrumMode 163 0xa3  1
M output acc_1hz 129 0x81  1
M output acc_2hz 130 0x82  1
M output acc_4hz 131 0x83  1
M output acc_8hz 132 0x84  1
M output acc_16hz 133 0x85  1
M output acc_32hz 134 0x86  1
M output acc_64hz 135 0x87  1
M output acc_128hz 136 0x88  1
M output acc_256hz 137 0x89  1
M output acc_energy_sum_mms2_square 184 0xb8  1
M output motion 164 0xa4  1
M input motionPollIntervalMinutes 165 0xa5  1
M output batteryPercent 166 0xa6  1
M input powerIndexFilterFactor 167 0xa7  1
M input maxPowerIndex 168 0xa8  1
M output accX 144 0x90  0.001
M output accY 145 0x91  0.001
M output accZ 146 0x92  0.001
M input enableXYZ 169 0xa9  1
`,
            }, 
        

            1586871679: {
                name: "Motion-measure-unconf",
                versions: "R28 R27",
                mapData: `M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalHours 160 0xa0  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 161 0xa1  1
M input tempAlarmHighLevel 162 0xa2  1
M output accX 179 0xb3  0.001
M output accY 180 0xb4  0.001
M output accZ 181 0xb5  0.001
M output acc 182 0xb6  0.001
M output pressure_hPa 184 0xb8  0.01
M input motionThreshold_m_s2 183 0xb7  0.001
M input sampleInterval_s 163 0xa3  1
M input sampleCountMax 164 0xa4  1
M input enableBarometer 165 0xa5  1
M output motion 166 0xa6  1
M output batteryPercent 167 0xa7  1
M input powerIndexFilterFactor 168 0xa8  1
M input maxPowerIndex 169 0xa9  1
`,
            }, 
        

            1592932210: {
                name: "Lifefinder-alternating",
                versions: "R26",
                mapData: `M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalMinutes 160 0xa0  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 161 0xa1  1
M input tempAlarmHighLevel 162 0xa2  1
M output batteryPercent 163 0xa3  1
M output volts 179 0xb3  0.001
M output alarmTime 144 0x90  1
M output traceTime 145 0x91  1
M output nfcDisabledAlarm 129 0x81  1
M output alarmAccumulatedTime 152 0x98  1
M output humidity 180 0xb4  0.01
M output traceTrigger 130 0x82  1
M input maxAlarmMinutes 181 0xb5  1
M input maxTraceMinutes 165 0xa5  1
M input traceTriggerMinutes 166 0xa6  1
M input humidityThreshold 182 0xb6  0.01
M input alarmResendsBeforeUnjoin 183 0xb7  1
M input resendsBeforeUnjoin 167 0xa7  1
M input alarmResendTime 168 0xa8  1
M input quickAlarm 169 0xa9  1
M input nfcDisablesAlarm 170 0xaa  1
M input alarmAck 164 0xa4  1
M input positioningFreqency 171 0xab  1
`,
            }, 
        

            1617091456: {
                name: "Digital-gpio",
                versions: "R23 R22 R21 R20 R19 R18 R16 R15 R14 R13",
                mapData: `M input roamNetworkCount 160 0xa0  1
M output detection 128 0x80  1
M input activation 129 0x81  1
M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalHours 161 0xa1  1
M output tempAlarm 130 0x82  1
M input tempAlarmLowLevel 162 0xa2  1
M input tempAlarmHighLevel 163 0xa3  1
`,
            }, 
        

            1619903829: {
                name: "Airport-budget",
                versions: "R6",
                mapData: `M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalHours 160 0xa0  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 161 0xa1  1
M input tempAlarmHighLevel 162 0xa2  1
M input motionThreshold_mm_s2 179 0xb3  1
M output volts 180 0xb4  0.001
M input limitedScanChannels 184 0xb8  1
M input fullScanChannels 185 0xb9  1
M input quarterlyScanBudget 163 0xa3  1
M input maxBudget 181 0xb5  1
M input singleWifiScanAgain_minutes 164 0xa4  1
M input minimumWifiCount 165 0xa5  1
M input fullWifiScan_minutes 166 0xa6  1
M input gpsScan_minutes 167 0xa7  1
`,
            }, 
        

            1625058930: {
                name: "Digital-gpio",
                versions: "R26",
                mapData: `M input roamNetworkCount 160 0xa0  1
M output detection 128 0x80  1
M input activation 129 0x81  1
M input resendTime 161 0xa1  1
M input heartbeatMinutes 162 0xa2  1
M output heartbeat 130 0x82  1
M input pollInterval 163 0xa3  1
M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalHours 164 0xa4  1
M output tempAlarm 131 0x83  1
M input tempAlarmLowLevel 165 0xa5  1
M input tempAlarmHighLevel 166 0xa6  1
`,
            }, 
        

            1643871491: {
                name: "Tracker-time",
                versions: "R8 R7",
                mapData: `M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalHours 160 0xa0  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 161 0xa1  1
M input tempAlarmHighLevel 162 0xa2  1
M input roamNetworkCount 163 0xa3  1
M output volts 179 0xb3  0.001
M input gnssIntervalMinutes 164 0xa4  1
M input wifiIntervalMinutes 165 0xa5  1
`,
            }, 
        

            1654085923: {
                name: "Lifefinder-wifi-pos-tester",
                versions: "R28",
                mapData: `M input scanFrequency 176 0xb0  1
M input scanTimeMs 177 0xb1  1
M input limitedScanChannels 184 0xb8  1
`,
            }, 
        

            1657727329: {
                name: "Heartstarter",
                versions: "R28 R27 R26",
                mapData: `M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalHours 160 0xa0  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 161 0xa1  1
M input tempAlarmHighLevel 162 0xa2  1
M output buttonDetect 129 0x81  1
M output motionDetect 130 0x82  1
M input soundScanIntervalMinutes 179 0xb3  1
M input soundScanMinimumRepeat 163 0xa3  1
M output soundIntervalS 152 0x98  0.001
M output soundRepeat 131 0x83  1
M input motionThresholdG 180 0xb4  0.001
M output volts 181 0xb5  0.001
M output batteryPercent 164 0xa4  1
`,
            }, 
        

            1695912328: {
                name: "Airport-int",
                versions: "R15 R14 R13 R12 R11",
                mapData: `M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalHours 160 0xa0  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 161 0xa1  1
M input tempAlarmHighLevel 162 0xa2  1
M input motionThreshold_mm_s2 179 0xb3  1
M input limitedScanChannels 184 0xb8  1
M input fullScanChannels 185 0xb9  1
M output motionCount 186 0xba  1
M input quarterlyScanBudget 163 0xa3  1
M input maxBudget 180 0xb4  1
M input singleWifiScanAgain_minutes 164 0xa4  1
M input minimumWifiCount 165 0xa5  1
M input fullWifiScan_minutes 166 0xa6  1
M input gpsScan_minutes 167 0xa7  1
M input motionCountEnabled 168 0xa8  1
M input abandonedCartTime_minutes 181 0xb5  1
M output abandonedCart 169 0xa9  1
M output batteryPercent 170 0xaa  1
`,
            }, 
        

            1711284143: {
                name: "Tracker-stats",
                versions: "R9 R28 R27 R26 R25 R24 R23 R22 R21 R20 R19 R18 R16 R15 R14 R13 R12 R11 R10",
                mapData: `M output volts 176 0xb0  0.001
M input gnssIntervalMinutes 160 0xa0  1
M input gnssScanMode 177 0xb1  1
M output numSatellites 161 0xa1  1
M output bestSatellites 184 0xb8  1
M output scanCount 185 0xb9  1
M output gpsTime 186 0xba  1
M output downlinkRssi 162 0xa2  1
M input air_pressure_hysteresis_bar 163 0xa3  1
M output air_pressure 187 0xbb  0.01
M output batteryPercent 164 0xa4  1
`,
            }, 
        

            1727723267: {
                name: "Heartstarter",
                versions: "R9 R25 R24 R23 R22 R21 R20 R19 R18 R16 R15 R14 R13 R12 R11 R10",
                mapData: `M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalHours 160 0xa0  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 161 0xa1  1
M input tempAlarmHighLevel 162 0xa2  1
M output buttonDetect 129 0x81  1
M output motionDetect 130 0x82  1
M input soundScanIntervalMinutes 179 0xb3  1
M input soundScanMinimumRepeat 163 0xa3  1
M output soundIntervalS 152 0x98  0.001
M output soundRepeat 131 0x83  1
M input motionThresholdG 180 0xb4  0.001
M output volts 181 0xb5  0.001
M output batteryPercent 164 0xa4  1
`,
            }, 
        

            1742321452: {
                name: "Square-comfort-sound",
                versions: "R9 R10",
                mapData: `M input roamNetworkCount 160 0xa0  1
M output batteryPercent 161 0xa1  1
M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalMinutes 162 0xa2  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 163 0xa3  1
M input tempAlarmHighLevel 164 0xa4  1
M output humidity 179 0xb3  0.01
M output averageHumidity 144 0x90  0.01
M input humidityTreshold 180 0xb4  0.01
M input averageHumidityIntervalMinutes 165 0xa5  1
M output lux 181 0xb5  1
M output averageLux 145 0x91  1
M input luxTresholdPercent 182 0xb6  1
M input averageLuxIntervalMinutes 166 0xa6  1
M output soundLevel 183 0xb7  0.1
M input soundThreshold 167 0xa7  1
M input soundMinLevel 168 0xa8  1
M input soundAvgMinutes 169 0xa9  1
`,
            }, 
        

            1800402764: {
                name: "Lifefinder-gnss",
                versions: "",
                mapData: `M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalMinutes 160 0xa0  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 161 0xa1  1
M input tempAlarmHighLevel 162 0xa2  1
M output batteryPercent 163 0xa3  1
M output volts 179 0xb3  0.001
M output alarmTime 144 0x90  1
M output traceTime 145 0x91  1
M output nfcDisabledAlarm 129 0x81  1
M output alarmAccumulatedTime 152 0x98  1
M output humidity 180 0xb4  0.01
M output traceTrigger 165 0xa5  1
M input maxAlarmMinutes 181 0xb5  1
M input maxTraceMinutes 166 0xa6  1
M input traceTriggerMinutes 167 0xa7  1
M input humidityThreshold 182 0xb6  0.01
M input alarmResendsBeforeUnjoin 183 0xb7  1
M input alarmResendTime 168 0xa8  1
M input quickAlarm 169 0xa9  1
M input nfcDisablesAlarm 170 0xaa  1
M input alarmAck 164 0xa4  1
M input positioningFreqency 171 0xab  1
`,
            }, 
        

            1815337626: {
                name: "Gnss-autonomous-test",
                versions: "R9 R28 R27 R26 R25 R24 R23 R22 R21 R20 R19 R18 R16 R15 R14 R13 R12 R11 R10",
                mapData: `M output numSatellites 160 0xa0  1
M output bestSatellites 184 0xb8  1
M output scanCount 185 0xb9  1
M output batteryPercent 161 0xa1  1
`,
            }, 
        

            1816763371: {
                name: "Lifefinder-squad",
                versions: "R6 R5",
                mapData: `M input roamNetworkCount 160 0xa0  1
M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalMinutes 161 0xa1  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 162 0xa2  1
M input tempAlarmHighLevel 163 0xa3  1
M output alarmTime 144 0x90  1
M output buttonAlarm 129 0x81  1
M output volts 179 0xb3  0.001
M input maxAlarmMinutes 180 0xb4  1
M input alarmAck 164 0xa4  1
`,
            }, 
        

            1835409134: {
                name: "Lifefinder-wifi",
                versions: "",
                mapData: `M output temp 146 0x92  0.01
M output tempAlarm 128 0x80  1
M output humidity 176 0xb0  0.01
M input humidityThreshold 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input tempAlarmLowLevel 160 0xa0  1
M input tempAlarmHighLevel 161 0xa1  1
M output batteryPercent 162 0xa2  1
M output volts 179 0xb3  0.001
M output alarmTime 144 0x90  1
M output traceTime 145 0x91  1
M output nfcDisabledAlarm 129 0x81  1
M output alarmAccumulatedTime 152 0x98  1
M output traceTrigger 130 0x82  1
M input maxAlarmMinutes 180 0xb4  1
M input maxTraceMinutes 163 0xa3  1
M input traceTriggerMinutes 165 0xa5  1
M input alarmResendsBeforeUnjoin 181 0xb5  1
M input resendsBeforeUnjoin 166 0xa6  1
M input alarmResendTime 167 0xa7  1
M input quickAlarm 168 0xa8  1
M input nfcDisablesAlarm 169 0xa9  1
M input alarmAck 164 0xa4  1
M input positioningFreqency 170 0xaa  1
M input scanTimeMs 182 0xb6  1
M input limitedScanChannels 184 0xb8  1
M input wifiDoubleScan 171 0xab  1
`,
            }, 
        

            1872032769: {
                name: "Airport-int",
                versions: "R15 R14 R13",
                mapData: `M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalHours 160 0xa0  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 161 0xa1  1
M input tempAlarmHighLevel 162 0xa2  1
M input motionThreshold_mm_s2 179 0xb3  1
M input limitedScanChannels 184 0xb8  1
M input fullScanChannels 185 0xb9  1
M output motionCount 186 0xba  1
M input quarterlyScanBudget 163 0xa3  1
M input maxBudget 180 0xb4  1
M input singleWifiScanAgain_minutes 164 0xa4  1
M input minimumWifiCount 165 0xa5  1
M input fullWifiScan_minutes 166 0xa6  1
M input gpsScan_minutes 167 0xa7  1
M input motionCountEnabled 168 0xa8  1
M input abandonedCartTime_minutes 181 0xb5  1
M output abandonedCart 169 0xa9  1
M output batteryPercent 170 0xaa  1
`,
            }, 
        

            1920568829: {
                name: "Lifefinder-wifi",
                versions: "R25 R24",
                mapData: `M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalMinutes 160 0xa0  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 161 0xa1  1
M input tempAlarmHighLevel 162 0xa2  1
M output batteryPercent 163 0xa3  1
M output volts 179 0xb3  0.001
M output alarmTime 144 0x90  1
M output buttonAlarm 129 0x81  1
M output nfcDisabledAlarm 130 0x82  1
M output alarmAccumulatedTime 152 0x98  1
M output humidity 180 0xb4  0.01
M input maxAlarmMinutes 181 0xb5  1
M input humidityThreshold 182 0xb6  0.01
M input alarmResendsBeforeUnjoin 183 0xb7  1
M input alarmResendTime 165 0xa5  1
M input alarmAck 164 0xa4  1
`,
            }, 
        

            1936564868: {
                name: "Lifefinder-alternating",
                versions: "R23",
                mapData: `M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalMinutes 160 0xa0  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 161 0xa1  1
M input tempAlarmHighLevel 162 0xa2  1
M output batteryPercent 163 0xa3  1
M output volts 179 0xb3  0.001
M output alarmTime 144 0x90  1
M output buttonAlarm 129 0x81  1
M output nfcDisabledAlarm 130 0x82  1
M output alarmAccumulatedTime 152 0x98  1
M output humidity 180 0xb4  0.01
M input maxAlarmMinutes 181 0xb5  1
M input humidityThreshold 182 0xb6  0.01
M input alarmResendsBeforeUnjoin 183 0xb7  1
M input alarmResendTime 165 0xa5  1
M input alarmAck 164 0xa4  1
`,
            }, 
        

            1937430598: {
                name: "Square-air",
                versions: "R8",
                mapData: `M input roamNetworkCount 160 0xa0  1
M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalMinutes 161 0xa1  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 162 0xa2  1
M input tempAlarmHighLevel 163 0xa3  1
M output humidity 179 0xb3  0.01
M output averageHumidity 144 0x90  0.01
M input humidityTreshold 180 0xb4  0.01
M input averageHumidityIntervalMinutes 164 0xa4  1
M output lux 181 0xb5  1
M output averageLux 145 0x91  1
M input luxTresholdPercent 182 0xb6  1
M input averageLuxIntervalMinutes 165 0xa5  1
M output air_run_in_status 166 0xa6  1
M output air_stab_status 167 0xa7  1
M output air_iaq_accuracy 168 0xa8  1
M output air_iaq 146 0x92  1
M output air_co2 147 0x93  1
M output air_pressure 184 0xb8  0.01
M output air_breath_voc_equivalent 152 0x98  0.01
M output air_static_iaq 185 0xb9  1
M input air_interval_minutes 169 0xa9  1
`,
            }, 
        

            1938827428: {
                name: "Lifefinder-motion",
                versions: "R9 R12 R11 R10",
                mapData: `M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalMinutes 160 0xa0  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 161 0xa1  1
M input tempAlarmHighLevel 162 0xa2  1
M output batteryPercent 163 0xa3  1
M output alarmTime 144 0x90  1
M output buttonAlarm 129 0x81  1
M output volts 179 0xb3  0.001
M input alarmAck 164 0xa4  1
M output motion 165 0xa5  1
M output motionAlarm 166 0xa6  1
M input motionThreshold 180 0xb4  0.001
`,
            }, 
        

            2014504806: {
                name: "Lifefinder-motion-button-wifi",
                versions: "R28",
                mapData: `M output temp 144 0x90  0.01
M output tempAlarm 128 0x80  1
M output humidity 176 0xb0  0.01
M input humidityThreshold 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input tempAlarmLowLevel 160 0xa0  1
M input tempAlarmHighLevel 161 0xa1  1
M output batteryPercent 162 0xa2  1
M output volts 179 0xb3  0.001
M output deviceActive 129 0x81  1
M input activeTimeMaxMinutes 180 0xb4  1
M input stillMotionThreshold_mm_s2 181 0xb5  1
M input movingMotionThreshold_mm_s2 182 0xb6  1
M input stationaryPositionMinutes 163 0xa3  1
M input movingPositionMinutes 164 0xa4  1
M output accumulatedStationaryTime 145 0x91  1
M output accumulatedMovingTime 146 0x92  1
M input scanTimeMs 183 0xb7  1
M input limitedScanChannels 184 0xb8  1
`,
            }, 
        

            2025703382: {
                name: "Puck-radar",
                versions: "",
                mapData: `M input roamNetworkCount 160 0xa0  1
M input powerIndexFilterFactor 161 0xa1  1
M input maxPowerIndex 162 0xa2  1
M output amplitude 144 0x90  1
M output distance 145 0x91  0.01
M output occupied 128 0x80  1
M input amplitudeHysteresis 176 0xb0  1
M input distanceHysteresis 163 0xa3  0.01
M output distanceAverage 146 0x92  0.01
M input averageDistanceIntervalMinutes 177 0xb1  1
M input averageDistanceLowAlarmLevel 178 0xb2  0.01
M input averageDistanceHighAlarmLevel 179 0xb3  0.01
M input reportFailedDistanceMeasurements 164 0xa4  1
M output averageDistanceAlarm 129 0x81  1
M output radarDetectionPercentageHourly 130 0x82  1
M output nfcContactCount 152 0x98  1
M output radarVoltage_V 180 0xb4  0.001
`,
            }, 
        

            2029355788: {
                name: "Tracker",
                versions: "R25 R24 R23 R22",
                mapData: `M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalHours 160 0xa0  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 161 0xa1  1
M input tempAlarmHighLevel 162 0xa2  1
M input roamNetworkCount 163 0xa3  1
M input stillMotionThreshold_mm_s2 179 0xb3  1
M input movingMotionThreshold_mm_s2 180 0xb4  1
M input limitedScanChannels 184 0xb8  1
M input fullScanChannels 185 0xb9  1
M output motionCount 186 0xba  1
M output motionTimeMinutes 187 0xbb  1
M input quarterlyScanBudget 164 0xa4  1
M input maxBudget 181 0xb5  1
M input quickRejoinBudgetMax 182 0xb6  1
M input singleWifiScanAgain_minutes 165 0xa5  1
M input minimumWifiCount 166 0xa6  1
M input minimumGnssCount 167 0xa7  1
M input fullWifiScan_minutes 168 0xa8  1
M input gpsScan_minutes 169 0xa9  1
M input motionCountEnabled 170 0xaa  1
M input motionTimeEnabled 171 0xab  1
M input gnssMode 172 0xac  1
M input movingScanIntervalMinutes 188 0xbc  1
M input stationaryScanIntervalMinutes 189 0xbd  1
M input backUpWifiGnssScanMinutes 173 0xad  1
M output batteryPercent 174 0xae  1
`,
            }, 
        

            2087078277: {
                name: "Lifefinder-motion-button-both",
                versions: "R27",
                mapData: `M output temp 144 0x90  0.01
M output tempAlarm 128 0x80  1
M output humidity 176 0xb0  0.01
M input humidityThreshold 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input tempAlarmLowLevel 160 0xa0  1
M input tempAlarmHighLevel 161 0xa1  1
M output batteryPercent 162 0xa2  1
M output volts 179 0xb3  0.001
M output deviceActive 129 0x81  1
M input activeTimeMaxMinutes 180 0xb4  1
M input stillMotionThreshold_mm_s2 181 0xb5  1
M input movingMotionThreshold_mm_s2 182 0xb6  1
M input stationaryPositionMinutes 163 0xa3  1
M input movingPositionMinutes 164 0xa4  1
M output accumulatedStationaryTime 145 0x91  1
M output accumulatedMovingTime 146 0x92  1
M input limitedScanChannels 184 0xb8  1
M input minimumWifiResult 165 0xa5  1
`,
            }, 
        

            2093063534: {
                name: "Tracker",
                versions: "R26",
                mapData: `M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalHours 160 0xa0  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 161 0xa1  1
M input tempAlarmHighLevel 162 0xa2  1
M input roamNetworkCount 163 0xa3  1
M input stillMotionThreshold_mm_s2 179 0xb3  1
M input movingMotionThreshold_mm_s2 180 0xb4  1
M input limitedScanChannels 184 0xb8  1
M input fullScanChannels 185 0xb9  1
M output motionCount 186 0xba  1
M output motionTimeMinutes 187 0xbb  1
M input quarterlyScanBudget 164 0xa4  1
M input maxBudget 181 0xb5  1
M input quickRejoinBudgetMax 182 0xb6  1
M input singleWifiScanAgain_minutes 165 0xa5  1
M input minimumWifiCount 166 0xa6  1
M input minimumGnssCount 167 0xa7  1
M input fullWifiScan_minutes 168 0xa8  1
M input gpsScan_minutes 169 0xa9  1
M input motionCountEnabled 170 0xaa  1
M input motionTimeEnabled 171 0xab  1
M input gnssMode 172 0xac  1
M input movingScanIntervalMinutes 188 0xbc  1
M input stationaryScanIntervalMinutes 189 0xbd  1
M input backUpWifiGnssScanMinutes 173 0xad  1
M output batteryPercent 174 0xae  1
`,
            }, 
        

            2132727044: {
                name: "Default",
                versions: "R9 R28 R27 R26 R25 R24 R23 R22 R21 R20 R19 R18 R16 R15 R14 R13 R12 R11 R10",
                mapData: `M output helloDefaultApp 160 0xa0  1
`,
            }, 
        

            2182170139: {
                name: "Radiotest",
                versions: "R9 R8 R7 R6 R5 R11 R10",
                mapData: ``,
            }, 
        

            2230085897: {
                name: "Radiotest",
                versions: "R22 R21 R20 R19 R18 R16 R15 R14 R13 R12",
                mapData: ``,
            }, 
        

            2266505222: {
                name: "Square-comfort",
                versions: "R25 R24 R23 R22 R21 R20 R19 R18 R16 R15",
                mapData: `M input roamNetworkCount 160 0xa0  1
M output batteryPercent 161 0xa1  1
M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalMinutes 162 0xa2  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 163 0xa3  1
M input tempAlarmHighLevel 164 0xa4  1
M output humidity 179 0xb3  0.01
M output averageHumidity 144 0x90  0.01
M input humidityTreshold 180 0xb4  0.01
M input averageHumidityIntervalMinutes 165 0xa5  1
`,
            }, 
        

            2274655646: {
                name: "Lifefinder-wifi",
                versions: "R21 R20 R19 R18 R16",
                mapData: `M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalMinutes 160 0xa0  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 161 0xa1  1
M input tempAlarmHighLevel 162 0xa2  1
M output batteryPercent 163 0xa3  1
M output volts 179 0xb3  0.001
M output alarmTime 144 0x90  1
M output buttonAlarm 129 0x81  1
M output nfcDisabledAlarm 130 0x82  1
M input maxAlarmMinutes 180 0xb4  1
M input alarmAck 164 0xa4  1
`,
            }, 
        

            2281120690: {
                name: "Square-air",
                versions: "R5",
                mapData: `M input roamNetworkCount 160 0xa0  1
M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalMinutes 161 0xa1  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 162 0xa2  1
M input tempAlarmHighLevel 163 0xa3  1
M output humidity 179 0xb3  0.01
M output averageHumidity 144 0x90  0.01
M input humidityTreshold 180 0xb4  0.01
M input averageHumidityIntervalMinutes 164 0xa4  1
M output lux 181 0xb5  1
M output averageLux 145 0x91  1
M input luxTresholdPercent 182 0xb6  1
M input averageLuxIntervalMinutes 165 0xa5  1
M output soundLevel 183 0xb7  0.1
M input soundThreshold 166 0xa6  1
M input soundMinLevel 167 0xa7  1
M input soundAvgMinutes 168 0xa8  1
M output air_run_in_status 169 0xa9  1
M output air_stab_status 170 0xaa  1
M output air_iaq_accuracy 171 0xab  1
M output air_iaq 146 0x92  1
M output air_co2 147 0x93  1
M output air_pressure 184 0xb8  0.01
M output air_breath_voc_equivalent 152 0x98  0.01
M input air_interval_minutes 172 0xac  1
`,
            }, 
        

            2297466901: {
                name: "Motion-measure",
                versions: "R9 R25 R24 R23 R22 R21 R20 R19 R18 R16 R15 R14 R13 R12 R11 R10",
                mapData: `M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalHours 160 0xa0  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 161 0xa1  1
M input tempAlarmHighLevel 162 0xa2  1
M output accX 144 0x90  0.001
M output accY 145 0x91  0.001
M output accZ 146 0x92  0.001
M output pressure_hPa 184 0xb8  0.01
M input motionThreshold_m_s2 179 0xb3  0.001
M input sampleInterval_s 163 0xa3  1
M input sampleCountMax 164 0xa4  1
M input enableBarometer 165 0xa5  1
M output motion 166 0xa6  1
M output batteryPercent 167 0xa7  1
`,
            }, 
        

            2338085954: {
                name: "Square-comfort-sound",
                versions: "R15",
                mapData: `M input roamNetworkCount 160 0xa0  1
M output batteryPercent 161 0xa1  1
M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalMinutes 162 0xa2  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 163 0xa3  1
M input tempAlarmHighLevel 164 0xa4  1
M output humidity 179 0xb3  0.01
M output averageHumidity 144 0x90  0.01
M input humidityTreshold 180 0xb4  0.01
M input averageHumidityIntervalMinutes 165 0xa5  1
M output lux 181 0xb5  1
M output averageLux 145 0x91  1
M input luxTresholdPercent 182 0xb6  1
M input averageLuxIntervalMinutes 166 0xa6  1
M output soundLevel 183 0xb7  0.1
M input soundThreshold 167 0xa7  1
M input soundMinLevel 168 0xa8  1
M input soundAvgMinutes 169 0xa9  1
`,
            }, 
        

            2355202201: {
                name: "IR-proximity",
                versions: "R23 R22 R21 R20 R19 R18 R16",
                mapData: `M output proximityValue 152 0x98  1
M input pollInterval 160 0xa0  1
M input irMode 161 0xa1  1
M input proximityHysteresis 176 0xb0  1
M input irPower 162 0xa2  1
M output temp 177 0xb1  0.01
M output averageTemp 178 0xb2  0.01
M input tempHysteresis 179 0xb3  0.01
M input averageTempIntervalHours 163 0xa3  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 164 0xa4  1
M input tempAlarmHighLevel 165 0xa5  1
M output batteryPercent 166 0xa6  1
M output volts 180 0xb4  0.001
`,
            }, 
        

            2359357756: {
                name: "Lifefinder-motion-button-gnss",
                versions: "R28",
                mapData: `M output temp 144 0x90  0.01
M output tempAlarm 128 0x80  1
M output humidity 176 0xb0  0.01
M input humidityThreshold 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input tempAlarmLowLevel 160 0xa0  1
M input tempAlarmHighLevel 161 0xa1  1
M output batteryPercent 162 0xa2  1
M output volts 179 0xb3  0.001
M output deviceActive 129 0x81  1
M input activeTimeMaxMinutes 180 0xb4  1
M input stillMotionThreshold_mm_s2 181 0xb5  1
M input movingMotionThreshold_mm_s2 182 0xb6  1
M input stationaryPositionMinutes 163 0xa3  1
M input movingPositionMinutes 164 0xa4  1
M output accumulatedStationaryTime 145 0x91  1
M output accumulatedMovingTime 146 0x92  1
`,
            }, 
        

            2371105800: {
                name: "Airport-int",
                versions: "R21",
                mapData: `M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalHours 160 0xa0  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 161 0xa1  1
M input tempAlarmHighLevel 162 0xa2  1
M input stillMotionThreshold_mm_s2 179 0xb3  1
M input movingMotionThreshold_mm_s2 180 0xb4  1
M input limitedScanChannels 184 0xb8  1
M input fullScanChannels 185 0xb9  1
M output motionCount 186 0xba  1
M input quarterlyScanBudget 163 0xa3  1
M input maxBudget 181 0xb5  1
M input singleWifiScanAgain_minutes 164 0xa4  1
M input movingWifiScanAgain_minutes 165 0xa5  1
M input minimumWifiCount 166 0xa6  1
M input fullWifiScan_minutes 167 0xa7  1
M input gpsScan_minutes 168 0xa8  1
M input motionCountEnabled 169 0xa9  1
M input abandonedCartTime_minutes 182 0xb6  1
M output abandonedCart 170 0xaa  1
M input quickRejoinBudgetMax 183 0xb7  1
M output batteryPercent 171 0xab  1
`,
            }, 
        

            2387046759: {
                name: "Square-comfort-sound",
                versions: "R12 R11",
                mapData: `M input roamNetworkCount 160 0xa0  1
M output batteryPercent 161 0xa1  1
M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalMinutes 162 0xa2  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 163 0xa3  1
M input tempAlarmHighLevel 164 0xa4  1
M output humidity 179 0xb3  0.01
M output averageHumidity 144 0x90  0.01
M input humidityTreshold 180 0xb4  0.01
M input averageHumidityIntervalMinutes 165 0xa5  1
M output lux 181 0xb5  1
M output averageLux 145 0x91  1
M input luxTresholdPercent 182 0xb6  1
M input averageLuxIntervalMinutes 166 0xa6  1
M output soundLevel 183 0xb7  0.1
M input soundThreshold 167 0xa7  1
M input soundMinLevel 168 0xa8  1
M input soundAvgMinutes 169 0xa9  1
`,
            }, 
        

            2391995788: {
                name: "Square-comfort-sound",
                versions: "R8 R7 R6 R5",
                mapData: `M input roamNetworkCount 160 0xa0  1
M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalMinutes 161 0xa1  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 162 0xa2  1
M input tempAlarmHighLevel 163 0xa3  1
M output humidity 179 0xb3  0.01
M output averageHumidity 144 0x90  0.01
M input humidityTreshold 180 0xb4  0.01
M input averageHumidityIntervalMinutes 164 0xa4  1
M output lux 181 0xb5  1
M output averageLux 145 0x91  1
M input luxTresholdPercent 182 0xb6  1
M input averageLuxIntervalMinutes 165 0xa5  1
M output soundLevel 183 0xb7  0.1
M input soundThreshold 166 0xa6  1
M input soundMinLevel 167 0xa7  1
M input soundAvgMinutes 168 0xa8  1
`,
            }, 
        

            2409062033: {
                name: "Lifefinder-wifi",
                versions: "R27",
                mapData: `M output temp 146 0x92  0.01
M output tempAlarm 128 0x80  1
M output humidity 176 0xb0  0.01
M input humidityThreshold 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input tempAlarmLowLevel 160 0xa0  1
M input tempAlarmHighLevel 161 0xa1  1
M output batteryPercent 162 0xa2  1
M output volts 179 0xb3  0.001
M output alarmTime 144 0x90  1
M output traceTime 145 0x91  1
M output nfcDisabledAlarm 129 0x81  1
M output alarmAccumulatedTime 152 0x98  1
M output traceTrigger 130 0x82  1
M input maxAlarmMinutes 180 0xb4  1
M input maxTraceMinutes 163 0xa3  1
M input traceTriggerMinutes 165 0xa5  1
M input alarmResendsBeforeUnjoin 181 0xb5  1
M input resendsBeforeUnjoin 166 0xa6  1
M input alarmResendTime 167 0xa7  1
M input quickAlarm 168 0xa8  1
M input nfcDisablesAlarm 169 0xa9  1
M input alarmAck 164 0xa4  1
M input positioningFreqency 170 0xaa  1
M input scanTimeMs 182 0xb6  1
M input limitedScanChannels 184 0xb8  1
`,
            }, 
        

            2566472474: {
                name: "Lifefinder-gnss",
                versions: "R23",
                mapData: `M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalMinutes 160 0xa0  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 161 0xa1  1
M input tempAlarmHighLevel 162 0xa2  1
M output batteryPercent 163 0xa3  1
M output volts 179 0xb3  0.001
M output alarmTime 144 0x90  1
M output buttonAlarm 129 0x81  1
M output nfcDisabledAlarm 130 0x82  1
M output alarmAccumulatedTime 152 0x98  1
M output humidity 180 0xb4  0.01
M input maxAlarmMinutes 181 0xb5  1
M input humidityThreshold 182 0xb6  0.01
M input alarmResendsBeforeUnjoin 183 0xb7  1
M input alarmResendTime 165 0xa5  1
M input alarmAck 164 0xa4  1
`,
            }, 
        

            2586467524: {
                name: "Lifefinder-wifi",
                versions: "",
                mapData: `M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalMinutes 160 0xa0  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 161 0xa1  1
M input tempAlarmHighLevel 162 0xa2  1
M output batteryPercent 163 0xa3  1
M output volts 179 0xb3  0.001
M output alarmTime 144 0x90  1
M output traceTime 145 0x91  1
M output nfcDisabledAlarm 129 0x81  1
M output alarmAccumulatedTime 152 0x98  1
M output humidity 180 0xb4  0.01
M output traceTrigger 165 0xa5  1
M input maxAlarmMinutes 181 0xb5  1
M input maxTraceMinutes 166 0xa6  1
M input traceTriggerMinutes 167 0xa7  1
M input humidityThreshold 182 0xb6  0.01
M input alarmResendsBeforeUnjoin 183 0xb7  1
M input alarmResendTime 168 0xa8  1
M input quickAlarm 169 0xa9  1
M input nfcDisablesAlarm 170 0xaa  1
M input alarmAck 164 0xa4  1
M input positioningFreqency 171 0xab  1
`,
            }, 
        

            2591224998: {
                name: "Lifefinder-gnss",
                versions: "",
                mapData: `M output temp 146 0x92  0.01
M output tempAlarm 128 0x80  1
M output humidity 176 0xb0  0.01
M input humidityThreshold 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input tempAlarmLowLevel 160 0xa0  1
M input tempAlarmHighLevel 161 0xa1  1
M output batteryPercent 162 0xa2  1
M output volts 179 0xb3  0.001
M output alarmTime 144 0x90  1
M output traceTime 145 0x91  1
M output nfcDisabledAlarm 129 0x81  1
M output alarmAccumulatedTime 152 0x98  1
M output traceAccumulatedTime 153 0x99  1
M output traceTrigger 130 0x82  1
M input maxAlarmMinutes 180 0xb4  1
M input maxTraceMinutes 163 0xa3  1
M input traceTriggerMinutes 165 0xa5  1
M input alarmResendsBeforeUnjoin 181 0xb5  1
M input resendsBeforeUnjoin 166 0xa6  1
M input alarmResendTime 167 0xa7  1
M input quickAlarm 168 0xa8  1
M input nfcDisablesAlarm 169 0xa9  1
M input alarmAck 164 0xa4  1
M input positioningFreqency 170 0xaa  1
M output numSatellites 171 0xab  1
M output bestSatellites 184 0xb8  1
M output scanCount 185 0xb9  1
`,
            }, 
        

            2604624720: {
                name: "Puck-radar",
                versions: "R9 R10",
                mapData: `M input roamNetworkCount 160 0xa0  1
M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalHours 161 0xa1  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 162 0xa2  1
M input tempAlarmHighLevel 163 0xa3  1
M output amplitude 144 0x90  1
M output distance 145 0x91  0.01
M output occupied 129 0x81  1
M input amplitudeHysteresis 179 0xb3  1
M input distanceHysteresis 164 0xa4  0.01
M output distanceAverage 146 0x92  0.01
M input averageDistanceIntervalMinutes 180 0xb4  1
M input averageDistanceLowAlarmLevel 181 0xb5  0.01
M input averageDistanceHighAlarmLevel 182 0xb6  0.01
M output averageDistanceAlarm 130 0x82  1
`,
            }, 
        

            2692618361: {
                name: "Seat-occupancy",
                versions: "",
                mapData: `M input roamNetworkCount 160 0xa0  1
M input powerIndexFilterFactor 161 0xa1  1
M input maxPowerIndex 162 0xa2  1
M output occupied 128 0x80  1
M output object 129 0x81  1
M output radarVoltage_V 176 0xb0  0.001
M output nfcContactCount 152 0x98  1
M output temp 177 0xb1  0.01
M input timeBetweenJoinAttemts 184 0xb8  1
M input timeBeforeUnjoin 178 0xb2  1
M input minResendWaitTime 179 0xb3  1
M input batteryReportInterval 163 0xa3  1
M input temperatureReportInterval 164 0xa4  1
M input temperatureUserCalibration 180 0xb4  0.01
M input debugLevel 165 0xa5  1
M output amplitude 144 0x90  1
M output distance 145 0x91  0.01
M output amplitude2 146 0x92  1
M output distance2 147 0x93  0.01
M output state 181 0xb5  1
`,
            }, 
        

            2696231198: {
                name: "Square-comfort",
                versions: "R14",
                mapData: `M input roamNetworkCount 160 0xa0  1
M output batteryPercent 161 0xa1  1
M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalMinutes 162 0xa2  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 163 0xa3  1
M input tempAlarmHighLevel 164 0xa4  1
M output humidity 179 0xb3  0.01
M output averageHumidity 144 0x90  0.01
M input humidityTreshold 180 0xb4  0.01
M input averageHumidityIntervalMinutes 165 0xa5  1
`,
            }, 
        

            2719891747: {
                name: "Airport-int",
                versions: "R20",
                mapData: `M input motionThreshold_mm_s2 176 0xb0  1
M input limitedScanChannels 184 0xb8  1
M input fullScanChannels 185 0xb9  1
M output motionCount 186 0xba  1
M input quarterlyScanBudget 160 0xa0  1
M input maxBudget 177 0xb1  1
M input singleWifiScanAgain_minutes 161 0xa1  1
M input movingWifiScanAgain_minutes 162 0xa2  1
M input minimumWifiCount 163 0xa3  1
M input fullWifiScan_minutes 164 0xa4  1
M input gpsScan_minutes 165 0xa5  1
M input motionCountEnabled 166 0xa6  1
M input abandonedCartTime_minutes 178 0xb2  1
M output abandonedCart 167 0xa7  1
M input quickRejoinBudgetMax 179 0xb3  1
M output batteryPercent 168 0xa8  1
`,
            }, 
        

            2738122399: {
                name: "Lifefinder-motion-button-both",
                versions: "R28",
                mapData: `M output temp 144 0x90  0.01
M output tempAlarm 128 0x80  1
M output humidity 176 0xb0  0.01
M input humidityThreshold 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input tempAlarmLowLevel 160 0xa0  1
M input tempAlarmHighLevel 161 0xa1  1
M output batteryPercent 162 0xa2  1
M output volts 179 0xb3  0.001
M output deviceActive 129 0x81  1
M input activeTimeMaxMinutes 180 0xb4  1
M input stillMotionThreshold_mm_s2 181 0xb5  1
M input movingMotionThreshold_mm_s2 182 0xb6  1
M input stationaryPositionMinutes 163 0xa3  1
M input movingPositionMinutes 164 0xa4  1
M output accumulatedStationaryTime 145 0x91  1
M output accumulatedMovingTime 146 0x92  1
M input scanTimeMs 183 0xb7  1
M input limitedScanChannels 184 0xb8  1
M input minimumWifiResult 165 0xa5  1
`,
            }, 
        

            2745602166: {
                name: "Airport-int-R6-fw-patch",
                versions: "R19 R18",
                mapData: `M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalHours 160 0xa0  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 161 0xa1  1
M input tempAlarmHighLevel 162 0xa2  1
M input motionThreshold_mm_s2 179 0xb3  1
M input limitedScanChannels 184 0xb8  1
M input fullScanChannels 185 0xb9  1
M output motionCount 186 0xba  1
M input quarterlyScanBudget 163 0xa3  1
M input maxBudget 180 0xb4  1
M input singleWifiScanAgain_minutes 164 0xa4  1
M input movingWifiScanAgain_minutes 165 0xa5  1
M input minimumWifiCount 166 0xa6  1
M input fullWifiScan_minutes 167 0xa7  1
M input gpsScan_minutes 168 0xa8  1
M input motionCountEnabled 169 0xa9  1
M input abandonedCartTime_minutes 181 0xb5  1
M output abandonedCart 170 0xaa  1
M input quickRejoinBudgetMax 182 0xb6  1
M output batteryPercent 171 0xab  1
`,
            }, 
        

            2766427005: {
                name: "Square-comfort-sound",
                versions: "R13",
                mapData: `M input roamNetworkCount 160 0xa0  1
M output batteryPercent 161 0xa1  1
M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalMinutes 162 0xa2  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 163 0xa3  1
M input tempAlarmHighLevel 164 0xa4  1
M output humidity 179 0xb3  0.01
M output averageHumidity 144 0x90  0.01
M input humidityTreshold 180 0xb4  0.01
M input averageHumidityIntervalMinutes 165 0xa5  1
M output lux 181 0xb5  1
M output averageLux 145 0x91  1
M input luxTresholdPercent 182 0xb6  1
M input averageLuxIntervalMinutes 166 0xa6  1
M output soundLevel 183 0xb7  0.1
M input soundThreshold 167 0xa7  1
M input soundMinLevel 168 0xa8  1
M input soundAvgMinutes 169 0xa9  1
`,
            }, 
        

            2767105504: {
                name: "MeshGateway",
                versions: "",
                mapData: `M output hours 176 0xb0  1
M output temp 177 0xb1  0.01
M output averageTemp 178 0xb2  0.01
M input tempHysteresis 179 0xb3  0.01
M input averageTempHysteresis 160 0xa0  0.1
M input averageTempIntervalMinutes 161 0xa1  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 162 0xa2  1
M input tempAlarmHighLevel 163 0xa3  1
`,
            }, 
        

            2769372849: {
                name: "Lifefinder-alternating",
                versions: "",
                mapData: `M output temp 146 0x92  0.01
M output tempAlarm 128 0x80  1
M output humidity 176 0xb0  0.01
M input humidityThreshold 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input tempAlarmLowLevel 160 0xa0  1
M input tempAlarmHighLevel 161 0xa1  1
M output batteryPercent 162 0xa2  1
M output volts 179 0xb3  0.001
M output alarmTime 144 0x90  1
M output traceTime 145 0x91  1
M output nfcDisabledAlarm 129 0x81  1
M output alarmAccumulatedTime 152 0x98  1
M output traceTrigger 130 0x82  1
M input maxAlarmMinutes 180 0xb4  1
M input maxTraceMinutes 163 0xa3  1
M input traceTriggerMinutes 165 0xa5  1
M input alarmResendsBeforeUnjoin 181 0xb5  1
M input resendsBeforeUnjoin 166 0xa6  1
M input alarmResendTime 167 0xa7  1
M input quickAlarm 168 0xa8  1
M input nfcDisablesAlarm 169 0xa9  1
M input alarmAck 164 0xa4  1
M input positioningFreqency 170 0xaa  1
`,
            }, 
        

            2794280370: {
                name: "Wifi-tracker",
                versions: "R8 R7 R6 R5",
                mapData: `M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalHours 160 0xa0  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 161 0xa1  1
M input tempAlarmHighLevel 162 0xa2  1
M input roamNetworkCount 163 0xa3  1
M output volts 179 0xb3  0.001
M input motionThresholdG 180 0xb4  0.001
`,
            }, 
        

            2831273160: {
                name: "MeshComfortExtender",
                versions: "",
                mapData: `M input meshSyncInterval_minutes 176 0xb0  1
M input meshEnableUpside 160 0xa0  1
M input meshEnableDownside 161 0xa1  1
M output temp 177 0xb1  0.01
M output averageTemp 178 0xb2  0.01
M input tempHysteresis 179 0xb3  0.01
M input averageTempIntervalMinutes 162 0xa2  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 163 0xa3  1
M input tempAlarmHighLevel 164 0xa4  1
M output humidity 180 0xb4  0.01
M output averageHumidity 144 0x90  0.01
M input humidityTreshold 181 0xb5  0.01
M input averageHumidityIntervalMinutes 165 0xa5  1
M output batteryPercent 166 0xa6  1
`,
            }, 
        

            2847964315: {
                name: "Puck-radar",
                versions: "R28 R27",
                mapData: `M input roamNetworkCount 160 0xa0  1
M input powerIndexFilterFactor 161 0xa1  1
M input maxPowerIndex 162 0xa2  1
M output amplitude 144 0x90  1
M output distance 145 0x91  0.01
M output occupied 128 0x80  1
M input amplitudeHysteresis 176 0xb0  1
M input distanceHysteresis 163 0xa3  0.01
M output distanceAverage 146 0x92  0.01
M input averageDistanceIntervalMinutes 177 0xb1  1
M input averageDistanceLowAlarmLevel 178 0xb2  0.01
M input averageDistanceHighAlarmLevel 179 0xb3  0.01
M input reportFailedDistanceMeasurements 164 0xa4  1
M output averageDistanceAlarm 129 0x81  1
M output radarDetectionPercentageHourly 130 0x82  1
M output nfcContactCount 152 0x98  1
M output radarVoltage_V 180 0xb4  0.001
`,
            }, 
        

            2907035249: {
                name: "Lifefinder-gnss",
                versions: "R22",
                mapData: `M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalMinutes 160 0xa0  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 161 0xa1  1
M input tempAlarmHighLevel 162 0xa2  1
M output batteryPercent 163 0xa3  1
M output volts 179 0xb3  0.001
M output alarmTime 144 0x90  1
M output buttonAlarm 129 0x81  1
M output nfcDisabledAlarm 130 0x82  1
M output alarmAccumulatedTime 152 0x98  1
M output humidity 180 0xb4  0.01
M input maxAlarmMinutes 181 0xb5  1
M input humidityThreshold 182 0xb6  0.01
M input alarmResendsBeforeUnjoin 183 0xb7  1
M input alarmResendTime 165 0xa5  1
M input alarmAck 164 0xa4  1
`,
            }, 
        

            2935762138: {
                name: "Square-comfort",
                versions: "R26",
                mapData: `M input roamNetworkCount 160 0xa0  1
M output batteryPercent 161 0xa1  1
M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalMinutes 162 0xa2  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 163 0xa3  1
M input tempAlarmHighLevel 164 0xa4  1
M output humidity 179 0xb3  0.01
M output averageHumidity 144 0x90  0.01
M input humidityTreshold 180 0xb4  0.01
M input averageHumidityIntervalMinutes 165 0xa5  1
`,
            }, 
        

            2944831603: {
                name: "Radiotest-measure",
                versions: "R22 R21 R20 R19 R18 R16 R15 R14",
                mapData: ``,
            }, 
        

            3031484599: {
                name: "Lifefinder-motion",
                versions: "R15 R14 R13",
                mapData: `M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalMinutes 160 0xa0  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 161 0xa1  1
M input tempAlarmHighLevel 162 0xa2  1
M output batteryPercent 163 0xa3  1
M output alarmTime 144 0x90  1
M output buttonAlarm 129 0x81  1
M output volts 179 0xb3  0.001
M input alarmAck 164 0xa4  1
M output motion 165 0xa5  1
M output motionAlarm 166 0xa6  1
M input motionThreshold 180 0xb4  0.001
`,
            }, 
        

            3040106327: {
                name: "Airport-int",
                versions: "R8",
                mapData: `M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalHours 160 0xa0  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 161 0xa1  1
M input tempAlarmHighLevel 162 0xa2  1
M input motionThreshold_mm_s2 179 0xb3  1
M input limitedScanChannels 184 0xb8  1
M input fullScanChannels 185 0xb9  1
M output motionCount 186 0xba  1
M input quarterlyScanBudget 163 0xa3  1
M input maxBudget 180 0xb4  1
M input singleWifiScanAgain_minutes 164 0xa4  1
M input minimumWifiCount 165 0xa5  1
M input fullWifiScan_minutes 166 0xa6  1
M input gpsScan_minutes 167 0xa7  1
M input motionCountEnabled 168 0xa8  1
`,
            }, 
        

            3086277881: {
                name: "Linkcheck",
                versions: "R8 R7 R6 R5",
                mapData: ``,
            }, 
        

            3090458506: {
                name: "Square-comfort-sound",
                versions: "R22 R21 R20 R19",
                mapData: `M input roamNetworkCount 160 0xa0  1
M output batteryPercent 161 0xa1  1
M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalMinutes 162 0xa2  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 163 0xa3  1
M input tempAlarmHighLevel 164 0xa4  1
M output humidity 179 0xb3  0.01
M output averageHumidity 144 0x90  0.01
M input humidityTreshold 180 0xb4  0.01
M input averageHumidityIntervalMinutes 165 0xa5  1
M output lux 181 0xb5  1
M output averageLux 145 0x91  1
M input luxTresholdPercent 182 0xb6  1
M input averageLuxIntervalMinutes 166 0xa6  1
M output soundLevel 183 0xb7  0.1
M input soundThreshold 167 0xa7  1
M input soundMinLevel 168 0xa8  1
M input soundAvgMinutes 169 0xa9  1
M output soundAlarm 129 0x81  1
M input soundAlarmTimeoutMinutes 170 0xaa  1
M output soundAvgMax 184 0xb8  0.1
`,
            }, 
        

            3094986737: {
                name: "Airport-int",
                versions: "R28 R27 R26 R25",
                mapData: `M input stillMotionThreshold_mm_s2 176 0xb0  1
M input movingMotionThreshold_mm_s2 177 0xb1  1
M input limitedScanChannels 184 0xb8  1
M input fullScanChannels 185 0xb9  1
M output motionCount 186 0xba  1
M input quarterlyScanBudget 160 0xa0  1
M input maxBudget 178 0xb2  1
M input singleWifiScanAgain_minutes 161 0xa1  1
M input movingWifiScanAgain_minutes 162 0xa2  1
M input minimumWifiCount 163 0xa3  1
M input fullWifiScan_minutes 164 0xa4  1
M input gpsScan_minutes 165 0xa5  1
M input motionCountEnabled 166 0xa6  1
M input abandonedCartTime_minutes 179 0xb3  1
M output abandonedCart 167 0xa7  1
M input quickRejoinBudgetMax 180 0xb4  1
M input movingScanIntervalMinutes 187 0xbb  1
M input stationaryScanIntervalMinutes 188 0xbc  1
M output batteryPercent 168 0xa8  1
`,
            }, 
        

            3137482613: {
                name: "MeshComfortSound",
                versions: "",
                mapData: `M input meshSyncInterval_minutes 176 0xb0  1
M input meshEnableUpside 160 0xa0  1
M input meshEnableDownside 161 0xa1  1
M input powerIndexFilterFactor 162 0xa2  1
M input maxPowerIndex 163 0xa3  1
M output hours 177 0xb1  1
M output temp 178 0xb2  0.01
M output averageTemp 179 0xb3  0.01
M input tempHysteresis 180 0xb4  0.01
M input averageTempHysteresis 164 0xa4  0.1
M input averageTempIntervalMinutes 165 0xa5  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 166 0xa6  1
M input tempAlarmHighLevel 167 0xa7  1
M output humidity 181 0xb5  0.01
M output averageHumidity 144 0x90  0.01
M input humidityTreshold 182 0xb6  0.01
M input averageHumidityIntervalMinutes 168 0xa8  1
M output batteryPercent 169 0xa9  1
M input wifiScanInterval_h 170 0xaa  1
M output soundLevel 183 0xb7  0.1
M input soundThreshold 171 0xab  1
M input soundMinLevel 172 0xac  1
M input soundAvgMinutes 173 0xad  1
M output soundAlarm 129 0x81  1
M input soundAlarmTimeoutMinutes 174 0xae  1
M output soundAvgMax 184 0xb8  0.1
`,
            }, 
        

            3169307235: {
                name: "Airport-int",
                versions: "R24 R23 R22 R21",
                mapData: `M input stillMotionThreshold_mm_s2 176 0xb0  1
M input movingMotionThreshold_mm_s2 177 0xb1  1
M input limitedScanChannels 184 0xb8  1
M input fullScanChannels 185 0xb9  1
M output motionCount 186 0xba  1
M input quarterlyScanBudget 160 0xa0  1
M input maxBudget 178 0xb2  1
M input singleWifiScanAgain_minutes 161 0xa1  1
M input movingWifiScanAgain_minutes 162 0xa2  1
M input minimumWifiCount 163 0xa3  1
M input fullWifiScan_minutes 164 0xa4  1
M input gpsScan_minutes 165 0xa5  1
M input motionCountEnabled 166 0xa6  1
M input abandonedCartTime_minutes 179 0xb3  1
M output abandonedCart 167 0xa7  1
M input quickRejoinBudgetMax 180 0xb4  1
M output batteryPercent 168 0xa8  1
`,
            }, 
        

            3227680283: {
                name: "Lifefinder-alternating",
                versions: "R27",
                mapData: `M output temp 146 0x92  0.01
M output tempAlarm 128 0x80  1
M output humidity 176 0xb0  0.01
M input humidityThreshold 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input tempAlarmLowLevel 160 0xa0  1
M input tempAlarmHighLevel 161 0xa1  1
M output batteryPercent 162 0xa2  1
M output volts 179 0xb3  0.001
M output alarmTime 144 0x90  1
M output traceTime 145 0x91  1
M output nfcDisabledAlarm 129 0x81  1
M output alarmAccumulatedTime 152 0x98  1
M output traceTrigger 130 0x82  1
M input maxAlarmMinutes 180 0xb4  1
M input maxTraceMinutes 163 0xa3  1
M input traceTriggerMinutes 165 0xa5  1
M input alarmResendsBeforeUnjoin 181 0xb5  1
M input resendsBeforeUnjoin 166 0xa6  1
M input alarmResendTime 167 0xa7  1
M input quickAlarm 168 0xa8  1
M input nfcDisablesAlarm 169 0xa9  1
M input alarmAck 164 0xa4  1
M input positioningFreqency 170 0xaa  1
M input scanTimeMs 182 0xb6  1
M input limitedScanChannels 184 0xb8  1
`,
            }, 
        

            3241343967: {
                name: "Square-air",
                versions: "R25 R24 R23 R22 R21 R20 R19 R18 R16",
                mapData: `M input roamNetworkCount 160 0xa0  1
M output batteryPercent 161 0xa1  1
M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalMinutes 162 0xa2  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 163 0xa3  1
M input tempAlarmHighLevel 164 0xa4  1
M output humidity 179 0xb3  0.01
M output averageHumidity 144 0x90  0.01
M input humidityTreshold 180 0xb4  0.01
M input averageHumidityIntervalMinutes 165 0xa5  1
M output lux 181 0xb5  1
M output averageLux 145 0x91  1
M input luxTresholdPercent 182 0xb6  1
M input averageLuxIntervalMinutes 166 0xa6  1
M output air_run_in_status 167 0xa7  1
M output air_stab_status 168 0xa8  1
M output air_iaq_accuracy 169 0xa9  1
M output air_iaq 184 0xb8  1
M output air_co2 185 0xb9  1
M output air_pressure 186 0xba  0.01
M output air_breath_voc_equivalent 187 0xbb  0.01
M output air_static_iaq 188 0xbc  1
M input air_interval_minutes 170 0xaa  1
M input air_static_iaq_alarm_level 189 0xbd  1
M input air_iaq_alarm_level 190 0xbe  1
M output air_iaq_alarm 129 0x81  1
`,
            }, 
        

            3251982802: {
                name: "Lifefinder-motion-nfc-wifi",
                versions: "R28",
                mapData: `M output temp 145 0x91  0.01
M output tempAlarm 128 0x80  1
M output humidity 176 0xb0  0.01
M input humidityThreshold 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input tempAlarmLowLevel 160 0xa0  1
M input tempAlarmHighLevel 161 0xa1  1
M output batteryPercent 162 0xa2  1
M output volts 179 0xb3  0.001
M output deviceActive 129 0x81  1
M output alarmTime 144 0x90  1
M input activeTimeMaxMinutes 184 0xb8  1
M input alarmAck 164 0xa4  1
M input maxAlarmMinutes 180 0xb4  1
M input stillMotionThreshold_mm_s2 181 0xb5  1
M input movingMotionThreshold_mm_s2 182 0xb6  1
M input stationaryPositionMinutes 163 0xa3  1
M input movingPositionMinutes 165 0xa5  1
M output accumulatedStationaryTime 146 0x92  1
M output accumulatedMovingTime 147 0x93  1
M input scanTimeMs 183 0xb7  1
M input limitedScanChannels 185 0xb9  1
M input positioningFreqency 166 0xa6  1
`,
            }, 
        

            3264322911: {
                name: "Square-comfort",
                versions: "R9 R10",
                mapData: `M input roamNetworkCount 160 0xa0  1
M output batteryPercent 161 0xa1  1
M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalMinutes 162 0xa2  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 163 0xa3  1
M input tempAlarmHighLevel 164 0xa4  1
M output humidity 179 0xb3  0.01
M output averageHumidity 144 0x90  0.01
M input humidityTreshold 180 0xb4  0.01
M input averageHumidityIntervalMinutes 165 0xa5  1
M output lux 181 0xb5  1
M output averageLux 145 0x91  1
M input luxTresholdPercent 182 0xb6  1
M input averageLuxIntervalMinutes 166 0xa6  1
`,
            }, 
        

            3321548430: {
                name: "Lifefinder",
                versions: "R15 R14 R13",
                mapData: `M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalMinutes 160 0xa0  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 161 0xa1  1
M input tempAlarmHighLevel 162 0xa2  1
M output batteryPercent 163 0xa3  1
M output alarmTime 144 0x90  1
M output capAlarm 129 0x81  1
M output buttonAlarm 130 0x82  1
M output capReport1 179 0xb3  1
M output capReport2 180 0xb4  1
M output soundAlarm 131 0x83  1
M output volts 181 0xb5  0.001
M input enableCapReports 165 0xa5  1
M input capAlarmLevel 182 0xb6  1
M input alarmAck 164 0xa4  1
`,
            }, 
        

            3328042723: {
                name: "Airport-budget",
                versions: "R8",
                mapData: `M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalHours 160 0xa0  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 161 0xa1  1
M input tempAlarmHighLevel 162 0xa2  1
M input motionThreshold_mm_s2 179 0xb3  1
M output volts 180 0xb4  0.001
M input limitedScanChannels 184 0xb8  1
M input fullScanChannels 185 0xb9  1
M output motionCount 186 0xba  1
M input quarterlyScanBudget 163 0xa3  1
M input maxBudget 181 0xb5  1
M input singleWifiScanAgain_minutes 164 0xa4  1
M input minimumWifiCount 165 0xa5  1
M input fullWifiScan_minutes 166 0xa6  1
M input gpsScan_minutes 167 0xa7  1
M input motionCountEnabled 168 0xa8  1
`,
            }, 
        

            3338740039: {
                name: "IR-proximity",
                versions: "R25 R24 R23 R22",
                mapData: `M output proximityValue 152 0x98  1
M input pollInterval 160 0xa0  1
M input irMode 161 0xa1  1
M input proximityHysteresis 176 0xb0  1
M input irPower 162 0xa2  1
M output temp 177 0xb1  0.01
M output averageTemp 178 0xb2  0.01
M input tempHysteresis 179 0xb3  0.01
M input averageTempIntervalHours 163 0xa3  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 164 0xa4  1
M input tempAlarmHighLevel 165 0xa5  1
M output batteryPercent 166 0xa6  1
M output volts 180 0xb4  0.001
`,
            }, 
        

            3343753478: {
                name: "Motion-spectrum",
                versions: "",
                mapData: `M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalHours 160 0xa0  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 161 0xa1  1
M input tempAlarmHighLevel 162 0xa2  1
M input motionThreshold_m_s2 179 0xb3  0.001
M input motionSpectrumMode 163 0xa3  1
M output acc_1hz 129 0x81  1
M output acc_2hz 130 0x82  1
M output acc_4hz 131 0x83  1
M output acc_8hz 132 0x84  1
M output acc_16hz 133 0x85  1
M output acc_32hz 134 0x86  1
M output acc_64hz 135 0x87  1
M output acc_128hz 136 0x88  1
M output acc_256hz 137 0x89  1
M output acc_energy_sum_mms2_square 184 0xb8  1
M output motion 164 0xa4  1
M input motionPollIntervalMinutes 165 0xa5  1
M output batteryPercent 166 0xa6  1
M input powerIndexFilterFactor 167 0xa7  1
M input maxPowerIndex 168 0xa8  1
`,
            }, 
        

            3409025270: {
                name: "Digital-gpio",
                versions: "R28 R27",
                mapData: `M input roamNetworkCount 160 0xa0  1
M input powerIndexFilterFactor 161 0xa1  1
M input maxPowerIndex 162 0xa2  1
M output detection 128 0x80  1
M input activation 129 0x81  1
M input resendTime 163 0xa3  1
M input heartbeatMinutes 164 0xa4  1
M output heartbeat 130 0x82  1
M input pollInterval 165 0xa5  1
M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalHours 166 0xa6  1
M output tempAlarm 131 0x83  1
M input tempAlarmLowLevel 167 0xa7  1
M input tempAlarmHighLevel 168 0xa8  1
`,
            }, 
        

            3437792987: {
                name: "Square-comfort-sound",
                versions: "R25 R24 R23",
                mapData: `M input roamNetworkCount 160 0xa0  1
M output batteryPercent 161 0xa1  1
M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalMinutes 162 0xa2  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 163 0xa3  1
M input tempAlarmHighLevel 164 0xa4  1
M output humidity 179 0xb3  0.01
M output averageHumidity 144 0x90  0.01
M input humidityTreshold 180 0xb4  0.01
M input averageHumidityIntervalMinutes 165 0xa5  1
M output soundLevel 181 0xb5  0.1
M input soundThreshold 166 0xa6  1
M input soundMinLevel 167 0xa7  1
M input soundAvgMinutes 168 0xa8  1
M output soundAlarm 129 0x81  1
M input soundAlarmTimeoutMinutes 169 0xa9  1
M output soundAvgMax 184 0xb8  0.1
`,
            }, 
        

            3441810944: {
                name: "Lifefinder-gnss",
                versions: "R26",
                mapData: `M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalMinutes 160 0xa0  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 161 0xa1  1
M input tempAlarmHighLevel 162 0xa2  1
M output batteryPercent 163 0xa3  1
M output volts 179 0xb3  0.001
M output alarmTime 144 0x90  1
M output traceTime 145 0x91  1
M output nfcDisabledAlarm 129 0x81  1
M output alarmAccumulatedTime 152 0x98  1
M output humidity 180 0xb4  0.01
M output traceTrigger 130 0x82  1
M input maxAlarmMinutes 181 0xb5  1
M input maxTraceMinutes 165 0xa5  1
M input traceTriggerMinutes 166 0xa6  1
M input humidityThreshold 182 0xb6  0.01
M input alarmResendsBeforeUnjoin 183 0xb7  1
M input resendsBeforeUnjoin 167 0xa7  1
M input alarmResendTime 168 0xa8  1
M input quickAlarm 169 0xa9  1
M input nfcDisablesAlarm 170 0xaa  1
M input alarmAck 164 0xa4  1
M input positioningFreqency 171 0xab  1
`,
            }, 
        

            3465514373: {
                name: "Lifefinder-motion-nfc-gnss",
                versions: "R27",
                mapData: `M output temp 145 0x91  0.01
M output tempAlarm 128 0x80  1
M output humidity 176 0xb0  0.01
M input humidityThreshold 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input tempAlarmLowLevel 160 0xa0  1
M input tempAlarmHighLevel 161 0xa1  1
M output batteryPercent 162 0xa2  1
M output volts 179 0xb3  0.001
M output deviceActive 129 0x81  1
M output alarmTime 144 0x90  1
M input activeTimeMaxMinutes 180 0xb4  1
M input alarmAck 164 0xa4  1
M input maxAlarmMinutes 181 0xb5  1
M input stillMotionThreshold_mm_s2 182 0xb6  1
M input movingMotionThreshold_mm_s2 183 0xb7  1
M input stationaryPositionMinutes 163 0xa3  1
M input movingPositionMinutes 165 0xa5  1
M output accumulatedStationaryTime 146 0x92  1
M output accumulatedMovingTime 147 0x93  1
M input positioningFreqency 166 0xa6  1
`,
            }, 
        

            3469695180: {
                name: "Lifefinder-NFC-Reader-V1",
                versions: "",
                mapData: `M output card_1 152 0x98  1
M output card_2 153 0x99  1
M output card_3 154 0x9a  1
M output serial 155 0x9b  1
M input debounceSeconds 176 0xb0  1
`,
            }, 
        

            3497448490: {
                name: "Digital-gpio",
                versions: "R12 R11",
                mapData: `M input roamNetworkCount 160 0xa0  1
M output detection 128 0x80  1
M input activation 129 0x81  1
M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalHours 161 0xa1  1
M output tempAlarm 130 0x82  1
M input tempAlarmLowLevel 162 0xa2  1
M input tempAlarmHighLevel 163 0xa3  1
`,
            }, 
        

            3500434333: {
                name: "Square-comfort-sound",
                versions: "R28 R27",
                mapData: `M input roamNetworkCount 160 0xa0  1
M output batteryPercent 161 0xa1  1
M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempHysteresis 162 0xa2  0.1
M input averageTempIntervalMinutes 163 0xa3  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 164 0xa4  1
M input tempAlarmHighLevel 165 0xa5  1
M output humidity 179 0xb3  0.01
M output averageHumidity 144 0x90  0.01
M input humidityTreshold 180 0xb4  0.01
M input averageHumidityIntervalMinutes 166 0xa6  1
M input powerIndexFilterFactor 167 0xa7  1
M input maxPowerIndex 168 0xa8  1
M output soundLevel 181 0xb5  0.1
M input soundThreshold 169 0xa9  1
M input soundMinLevel 170 0xaa  1
M input soundAvgMinutes 171 0xab  1
M output soundAlarm 129 0x81  1
M input soundAlarmTimeoutMinutes 172 0xac  1
M output soundAvgMax 184 0xb8  0.1
`,
            }, 
        

            3505805917: {
                name: "Lifefinder-squad",
                versions: "R15 R14 R13",
                mapData: `M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalMinutes 160 0xa0  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 161 0xa1  1
M input tempAlarmHighLevel 162 0xa2  1
M output batteryPercent 163 0xa3  1
M output alarmTime 144 0x90  1
M output buttonAlarm 129 0x81  1
M output volts 179 0xb3  0.001
M input maxAlarmMinutes 180 0xb4  1
M input alarmAck 164 0xa4  1
`,
            }, 
        

            3509502476: {
                name: "Sniffer",
                versions: "R9 R8 R7 R6 R5 R11 R10",
                mapData: ``,
            }, 
        

            3530880224: {
                name: "Square-comfort",
                versions: "R12 R11",
                mapData: `M input roamNetworkCount 160 0xa0  1
M output batteryPercent 161 0xa1  1
M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalMinutes 162 0xa2  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 163 0xa3  1
M input tempAlarmHighLevel 164 0xa4  1
M output humidity 179 0xb3  0.01
M output averageHumidity 144 0x90  0.01
M input humidityTreshold 180 0xb4  0.01
M input averageHumidityIntervalMinutes 165 0xa5  1
M output lux 181 0xb5  1
M output averageLux 145 0x91  1
M input luxTresholdPercent 182 0xb6  1
M input averageLuxIntervalMinutes 166 0xa6  1
`,
            }, 
        

            3532693249: {
                name: "Airport-int",
                versions: "R19 R18 R16",
                mapData: `M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalHours 160 0xa0  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 161 0xa1  1
M input tempAlarmHighLevel 162 0xa2  1
M input motionThreshold_mm_s2 179 0xb3  1
M input limitedScanChannels 184 0xb8  1
M input fullScanChannels 185 0xb9  1
M output motionCount 186 0xba  1
M input quarterlyScanBudget 163 0xa3  1
M input maxBudget 180 0xb4  1
M input singleWifiScanAgain_minutes 164 0xa4  1
M input movingWifiScanAgain_minutes 165 0xa5  1
M input minimumWifiCount 166 0xa6  1
M input fullWifiScan_minutes 167 0xa7  1
M input gpsScan_minutes 168 0xa8  1
M input motionCountEnabled 169 0xa9  1
M input abandonedCartTime_minutes 181 0xb5  1
M output abandonedCart 170 0xaa  1
M input quickRejoinBudgetMax 182 0xb6  1
M output batteryPercent 171 0xab  1
`,
            }, 
        

            3535569981: {
                name: "Lifefinder-NFC-Reader-V2",
                versions: "",
                mapData: `M output card_1 152 0x98  1
M output card_2 153 0x99  1
M output card_3 154 0x9a  1
M output serial 155 0x9b  1
M input debounceSeconds 176 0xb0  1
M input customResendTime 177 0xb1  1
M input maxResendCount 160 0xa0  1
`,
            }, 
        

            3550461869: {
                name: "Radiotest-measure",
                versions: "R28 R27 R26 R25 R24 R23",
                mapData: ``,
            }, 
        

            3561470814: {
                name: "Lifefinder-motion-button-wifi",
                versions: "R27",
                mapData: `M output temp 144 0x90  0.01
M output tempAlarm 128 0x80  1
M output humidity 176 0xb0  0.01
M input humidityThreshold 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input tempAlarmLowLevel 160 0xa0  1
M input tempAlarmHighLevel 161 0xa1  1
M output batteryPercent 162 0xa2  1
M output volts 179 0xb3  0.001
M output deviceActive 129 0x81  1
M input activeTimeMaxMinutes 180 0xb4  1
M input stillMotionThreshold_mm_s2 181 0xb5  1
M input movingMotionThreshold_mm_s2 182 0xb6  1
M input stationaryPositionMinutes 163 0xa3  1
M input movingPositionMinutes 164 0xa4  1
M output accumulatedStationaryTime 145 0x91  1
M output accumulatedMovingTime 146 0x92  1
M input limitedScanChannels 184 0xb8  1
`,
            }, 
        

            3605076574: {
                name: "Lifefinder-wifi",
                versions: "R8 R7",
                mapData: `M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalMinutes 160 0xa0  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 161 0xa1  1
M input tempAlarmHighLevel 162 0xa2  1
M output alarmTime 144 0x90  1
M output buttonAlarm 129 0x81  1
M output volts 179 0xb3  0.001
M input maxAlarmMinutes 180 0xb4  1
M input alarmAck 164 0xa4  1
M input limitedScanChannels 184 0xb8  1
`,
            }, 
        

            3625056904: {
                name: "Airport-int",
                versions: "R20 R19 R18 R16",
                mapData: `M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalHours 160 0xa0  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 161 0xa1  1
M input tempAlarmHighLevel 162 0xa2  1
M input motionThreshold_mm_s2 179 0xb3  1
M input limitedScanChannels 184 0xb8  1
M input fullScanChannels 185 0xb9  1
M output motionCount 186 0xba  1
M input quarterlyScanBudget 163 0xa3  1
M input maxBudget 180 0xb4  1
M input singleWifiScanAgain_minutes 164 0xa4  1
M input movingWifiScanAgain_minutes 165 0xa5  1
M input minimumWifiCount 166 0xa6  1
M input fullWifiScan_minutes 167 0xa7  1
M input gpsScan_minutes 168 0xa8  1
M input motionCountEnabled 169 0xa9  1
M input abandonedCartTime_minutes 181 0xb5  1
M output abandonedCart 170 0xaa  1
M input quickRejoinBudgetMax 182 0xb6  1
M output batteryPercent 171 0xab  1
`,
            }, 
        

            3629466160: {
                name: "Tracker-budget",
                versions: "R8 R7",
                mapData: `M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalHours 160 0xa0  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 161 0xa1  1
M input tempAlarmHighLevel 162 0xa2  1
M input roamNetworkCount 163 0xa3  1
M input motionThreshold_mm_s2 179 0xb3  1
M output volts 180 0xb4  0.001
M input limitedScanChannels 184 0xb8  1
M input fullScanChannels 185 0xb9  1
M input quarterlyScanBudget 164 0xa4  1
M input maxBudget 181 0xb5  1
M input singleWifiScanAgain_minutes 165 0xa5  1
M input minimumWifiCount 166 0xa6  1
M input fullWifiScan_minutes 167 0xa7  1
M input gpsScan_minutes 168 0xa8  1
M input gpsScanAgain_minutes 169 0xa9  1
M input minimumSatelliteCount 170 0xaa  1
`,
            }, 
        

            3634715455: {
                name: "Square-air",
                versions: "R15",
                mapData: `M input roamNetworkCount 160 0xa0  1
M output batteryPercent 161 0xa1  1
M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalMinutes 162 0xa2  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 163 0xa3  1
M input tempAlarmHighLevel 164 0xa4  1
M output humidity 179 0xb3  0.01
M output averageHumidity 144 0x90  0.01
M input humidityTreshold 180 0xb4  0.01
M input averageHumidityIntervalMinutes 165 0xa5  1
M output lux 181 0xb5  1
M output averageLux 145 0x91  1
M input luxTresholdPercent 182 0xb6  1
M input averageLuxIntervalMinutes 166 0xa6  1
M output air_run_in_status 167 0xa7  1
M output air_stab_status 168 0xa8  1
M output air_iaq_accuracy 169 0xa9  1
M output air_iaq 146 0x92  1
M output air_co2 147 0x93  1
M output air_pressure 184 0xb8  0.01
M output air_breath_voc_equivalent 152 0x98  0.01
M output air_static_iaq 185 0xb9  1
M input air_interval_minutes 170 0xaa  1
M input air_static_iaq_alarm_level 186 0xba  1
M input air_iaq_alarm_level 187 0xbb  1
M output air_iaq_alarm 129 0x81  1
`,
            }, 
        

            3679384538: {
                name: "Square-comfort",
                versions: "R28 R27",
                mapData: `M input roamNetworkCount 160 0xa0  1
M output batteryPercent 161 0xa1  1
M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempHysteresis 162 0xa2  0.1
M input averageTempIntervalMinutes 163 0xa3  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 164 0xa4  1
M input tempAlarmHighLevel 165 0xa5  1
M output humidity 179 0xb3  0.01
M output averageHumidity 144 0x90  0.01
M input humidityTreshold 180 0xb4  0.01
M input averageHumidityIntervalMinutes 166 0xa6  1
M input powerIndexFilterFactor 167 0xa7  1
M input maxPowerIndex 168 0xa8  1
`,
            }, 
        

            3685415244: {
                name: "Lifefinder-motion",
                versions: "R8 R7",
                mapData: `M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalMinutes 160 0xa0  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 161 0xa1  1
M input tempAlarmHighLevel 162 0xa2  1
M output alarmTime 144 0x90  1
M output buttonAlarm 129 0x81  1
M output volts 179 0xb3  0.001
M input alarmAck 164 0xa4  1
M output motion 163 0xa3  1
M output motionAlarm 165 0xa5  1
M input motionThreshold 180 0xb4  0.001
`,
            }, 
        

            3717913054: {
                name: "Lifefinder-gnss",
                versions: "",
                mapData: `M output temp 146 0x92  0.01
M output tempAlarm 128 0x80  1
M output humidity 176 0xb0  0.01
M input humidityThreshold 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input tempAlarmLowLevel 160 0xa0  1
M input tempAlarmHighLevel 161 0xa1  1
M output batteryPercent 162 0xa2  1
M output volts 179 0xb3  0.001
M output alarmTime 144 0x90  1
M output traceTime 145 0x91  1
M output nfcDisabledAlarm 129 0x81  1
M output alarmAccumulatedTime 152 0x98  1
M output traceTrigger 130 0x82  1
M input maxAlarmMinutes 180 0xb4  1
M input maxTraceMinutes 163 0xa3  1
M input traceTriggerMinutes 165 0xa5  1
M input alarmResendsBeforeUnjoin 181 0xb5  1
M input resendsBeforeUnjoin 166 0xa6  1
M input alarmResendTime 167 0xa7  1
M input quickAlarm 168 0xa8  1
M input nfcDisablesAlarm 169 0xa9  1
M input alarmAck 164 0xa4  1
M input positioningFreqency 170 0xaa  1
`,
            }, 
        

            3785611854: {
                name: "Lifefinder-motion-button-gnss",
                versions: "R27",
                mapData: `M output temp 144 0x90  0.01
M output tempAlarm 128 0x80  1
M output humidity 176 0xb0  0.01
M input humidityThreshold 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input tempAlarmLowLevel 160 0xa0  1
M input tempAlarmHighLevel 161 0xa1  1
M output batteryPercent 162 0xa2  1
M output volts 179 0xb3  0.001
M output deviceActive 129 0x81  1
M input activeTimeMaxMinutes 180 0xb4  1
M input stillMotionThreshold_mm_s2 181 0xb5  1
M input movingMotionThreshold_mm_s2 182 0xb6  1
M input stationaryPositionMinutes 163 0xa3  1
M input movingPositionMinutes 164 0xa4  1
M output accumulatedStationaryTime 145 0x91  1
M output accumulatedMovingTime 146 0x92  1
`,
            }, 
        

            3795814268: {
                name: "Lifefinder-gnss",
                versions: "R28",
                mapData: `M output temp 146 0x92  0.01
M output tempAlarm 128 0x80  1
M output humidity 176 0xb0  0.01
M input humidityThreshold 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input tempAlarmLowLevel 160 0xa0  1
M input tempAlarmHighLevel 161 0xa1  1
M output batteryPercent 162 0xa2  1
M output volts 179 0xb3  0.001
M output alarmTime 144 0x90  1
M output traceTime 145 0x91  1
M output nfcDisabledAlarm 129 0x81  1
M output alarmAccumulatedTime 152 0x98  1
M output traceTrigger 130 0x82  1
M input maxAlarmMinutes 180 0xb4  1
M input maxTraceMinutes 163 0xa3  1
M input traceTriggerMinutes 165 0xa5  1
M input alarmResendsBeforeUnjoin 181 0xb5  1
M input resendsBeforeUnjoin 166 0xa6  1
M input alarmResendTime 167 0xa7  1
M input quickAlarm 168 0xa8  1
M input nfcDisablesAlarm 169 0xa9  1
M input alarmAck 164 0xa4  1
M input positioningFreqency 170 0xaa  1
`,
            }, 
        

            3802553086: {
                name: "Tracker",
                versions: "R28 R27",
                mapData: `M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalHours 160 0xa0  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 161 0xa1  1
M input tempAlarmHighLevel 162 0xa2  1
M input roamNetworkCount 163 0xa3  1
M input stillMotionThreshold_mm_s2 179 0xb3  1
M input movingMotionThreshold_mm_s2 180 0xb4  1
M input limitedScanChannels 184 0xb8  1
M input fullScanChannels 185 0xb9  1
M output motionCount 186 0xba  1
M output motionTimeMinutes 187 0xbb  1
M input quarterlyScanBudget 164 0xa4  1
M input maxBudget 181 0xb5  1
M input quickRejoinBudgetMax 182 0xb6  1
M input singleWifiScanAgain_minutes 165 0xa5  1
M input minimumWifiCount 166 0xa6  1
M input minimumGnssCount 167 0xa7  1
M input fullWifiScan_minutes 168 0xa8  1
M input gpsScan_minutes 169 0xa9  1
M input motionCountEnabled 170 0xaa  1
M input motionTimeEnabled 171 0xab  1
M input gnssMode 172 0xac  1
M input movingScanIntervalMinutes 188 0xbc  1
M input stationaryScanIntervalMinutes 189 0xbd  1
M input backUpWifiGnssScanMinutes 173 0xad  1
M output batteryPercent 174 0xae  1
`,
            }, 
        

            3813895388: {
                name: "IR-proximity",
                versions: "R28 R27 R26",
                mapData: `M output proximityValue 152 0x98  1
M input pollInterval 160 0xa0  1
M input irMode 161 0xa1  1
M input proximityHysteresis 176 0xb0  1
M input irPower 162 0xa2  1
M output temp 177 0xb1  0.01
M output averageTemp 178 0xb2  0.01
M input tempHysteresis 179 0xb3  0.01
M input averageTempIntervalHours 163 0xa3  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 164 0xa4  1
M input tempAlarmHighLevel 165 0xa5  1
M output batteryPercent 166 0xa6  1
M output volts 180 0xb4  0.001
`,
            }, 
        

            3842802183: {
                name: "Square-comfort-sound",
                versions: "R26",
                mapData: `M input roamNetworkCount 160 0xa0  1
M output batteryPercent 161 0xa1  1
M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalMinutes 162 0xa2  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 163 0xa3  1
M input tempAlarmHighLevel 164 0xa4  1
M output humidity 179 0xb3  0.01
M output averageHumidity 144 0x90  0.01
M input humidityTreshold 180 0xb4  0.01
M input averageHumidityIntervalMinutes 165 0xa5  1
M output soundLevel 181 0xb5  0.1
M input soundThreshold 166 0xa6  1
M input soundMinLevel 167 0xa7  1
M input soundAvgMinutes 168 0xa8  1
M output soundAlarm 129 0x81  1
M input soundAlarmTimeoutMinutes 169 0xa9  1
M output soundAvgMax 184 0xb8  0.1
`,
            }, 
        

            3862345097: {
                name: "Lifefinder-wifi-pos-tester",
                versions: "R27 R26 R25 R24",
                mapData: `M input scanFrequency 176 0xb0  1
`,
            }, 
        

            3873093409: {
                name: "MeshRadar",
                versions: "",
                mapData: `M input meshSyncInterval_minutes 176 0xb0  1
M input meshEnableUpside 160 0xa0  1
M input meshEnableDownside 161 0xa1  1
M input powerIndexFilterFactor 162 0xa2  1
M input maxPowerIndex 163 0xa3  1
M output amplitude 144 0x90  1
M output distance 145 0x91  0.01
M output occupied 128 0x80  1
M input amplitudeHysteresis 177 0xb1  1
M input distanceHysteresis 164 0xa4  0.01
M output distanceAverage 146 0x92  0.01
M input averageDistanceIntervalMinutes 178 0xb2  1
M input averageDistanceLowAlarmLevel 179 0xb3  0.01
M input averageDistanceHighAlarmLevel 180 0xb4  0.01
M input reportFailedDistanceMeasurements 165 0xa5  1
M output averageDistanceAlarm 129 0x81  1
M output radarDetectionPercentageHourly 130 0x82  1
M output nfcContactCount 152 0x98  1
M output radarVoltage_V 181 0xb5  0.001
M output batteryPercent 166 0xa6  1
M output temp 182 0xb6  0.01
M input wifiScanInterval_h 167 0xa7  1
`,
            }, 
        

            3886254671: {
                name: "Heartstarter",
                versions: "R8 R7",
                mapData: `M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalHours 160 0xa0  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 161 0xa1  1
M input tempAlarmHighLevel 162 0xa2  1
M output buttonDetect 129 0x81  1
M output motionDetect 130 0x82  1
M input soundScanIntervalMinutes 179 0xb3  1
M input soundScanMinimumRepeat 163 0xa3  1
M output soundIntervalS 152 0x98  0.001
M output soundRepeat 131 0x83  1
M input motionThresholdG 180 0xb4  0.001
M output volts 181 0xb5  0.001
`,
            }, 
        

            3906402051: {
                name: "Square-air",
                versions: "R26",
                mapData: `M input roamNetworkCount 160 0xa0  1
M output batteryPercent 161 0xa1  1
M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalMinutes 162 0xa2  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 163 0xa3  1
M input tempAlarmHighLevel 164 0xa4  1
M output humidity 179 0xb3  0.01
M output averageHumidity 144 0x90  0.01
M input humidityTreshold 180 0xb4  0.01
M input averageHumidityIntervalMinutes 165 0xa5  1
M output lux 181 0xb5  1
M output averageLux 145 0x91  1
M input luxTresholdPercent 182 0xb6  1
M input averageLuxIntervalMinutes 166 0xa6  1
M output air_run_in_status 167 0xa7  1
M output air_stab_status 168 0xa8  1
M output air_iaq_accuracy 169 0xa9  1
M output air_iaq 184 0xb8  1
M output air_co2 185 0xb9  1
M output air_pressure 186 0xba  0.01
M output air_breath_voc_equivalent 187 0xbb  0.01
M output air_static_iaq 188 0xbc  1
M input air_interval_minutes 170 0xaa  1
M input air_static_iaq_alarm_level 189 0xbd  1
M input air_iaq_alarm_level 190 0xbe  1
M output air_iaq_alarm 129 0x81  1
`,
            }, 
        

            3907847420: {
                name: "Lifefinder-motion-button-both",
                versions: "",
                mapData: `M output temp 144 0x90  0.01
M output tempAlarm 128 0x80  1
M output humidity 176 0xb0  0.01
M input humidityThreshold 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input tempAlarmLowLevel 160 0xa0  1
M input tempAlarmHighLevel 161 0xa1  1
M output batteryPercent 162 0xa2  1
M output volts 179 0xb3  0.001
M output deviceActive 129 0x81  1
M input activeTimeMaxMinutes 180 0xb4  1
M input stillMotionThreshold_mm_s2 181 0xb5  1
M input movingMotionThreshold_mm_s2 182 0xb6  1
M input stationaryPositionMinutes 163 0xa3  1
M input movingPositionMinutes 164 0xa4  1
M output accumulatedStationaryTime 145 0x91  1
M output accumulatedMovingTime 146 0x92  1
M input scanTimeMs 183 0xb7  1
M input limitedScanChannels 184 0xb8  1
M input minimumWifiResult 165 0xa5  1
`,
            }, 
        

            3922413892: {
                name: "Airport-budget",
                versions: "R7",
                mapData: `M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalHours 160 0xa0  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 161 0xa1  1
M input tempAlarmHighLevel 162 0xa2  1
M input motionThreshold_mm_s2 179 0xb3  1
M output volts 180 0xb4  0.001
M input limitedScanChannels 184 0xb8  1
M input fullScanChannels 185 0xb9  1
M input quarterlyScanBudget 163 0xa3  1
M input maxBudget 181 0xb5  1
M input singleWifiScanAgain_minutes 164 0xa4  1
M input minimumWifiCount 165 0xa5  1
M input fullWifiScan_minutes 166 0xa6  1
M input gpsScan_minutes 167 0xa7  1
`,
            }, 
        

            3980641867: {
                name: "MeshComfortTimeCount",
                versions: "",
                mapData: `M input meshSyncInterval_minutes 176 0xb0  1
M input meshEnableUpside 160 0xa0  1
M input meshEnableDownside 161 0xa1  1
M output minutes 162 0xa2  1
M output hours 163 0xa3  1
M output days 164 0xa4  1
M output weeks 165 0xa5  1
M output years 166 0xa6  1
M input timecount_interval_minutes 167 0xa7  1
M output temp 177 0xb1  0.01
M output averageTemp 178 0xb2  0.01
M input tempHysteresis 179 0xb3  0.01
M input averageTempIntervalMinutes 168 0xa8  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 169 0xa9  1
M input tempAlarmHighLevel 170 0xaa  1
M output humidity 180 0xb4  0.01
M output averageHumidity 144 0x90  0.01
M input humidityTreshold 181 0xb5  0.01
M input averageHumidityIntervalMinutes 171 0xab  1
M output batteryPercent 172 0xac  1
`,
            }, 
        

            3994244140: {
                name: "Lifefinder-wifi",
                versions: "R9 R12 R11 R10",
                mapData: `M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalMinutes 160 0xa0  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 161 0xa1  1
M input tempAlarmHighLevel 162 0xa2  1
M output batteryPercent 163 0xa3  1
M output alarmTime 144 0x90  1
M output buttonAlarm 129 0x81  1
M output volts 179 0xb3  0.001
M input maxAlarmMinutes 180 0xb4  1
M input alarmAck 164 0xa4  1
M input limitedScanChannels 184 0xb8  1
`,
            }, 
        

            3999624005: {
                name: "US-Frequency-hop-test",
                versions: "R28 R27 R26 R25 R24 R23 R22 R21 R20 R19 R18 R16 R15 R14 R13 R12",
                mapData: `M input transmitInterval 176 0xb0  1
M input transmitCount 184 0xb8  1
M input count 185 0xb9  1
`,
            }, 
        

            4002204643: {
                name: "Square-air",
                versions: "R14",
                mapData: `M input roamNetworkCount 160 0xa0  1
M output batteryPercent 161 0xa1  1
M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalMinutes 162 0xa2  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 163 0xa3  1
M input tempAlarmHighLevel 164 0xa4  1
M output humidity 179 0xb3  0.01
M output averageHumidity 144 0x90  0.01
M input humidityTreshold 180 0xb4  0.01
M input averageHumidityIntervalMinutes 165 0xa5  1
M output lux 181 0xb5  1
M output averageLux 145 0x91  1
M input luxTresholdPercent 182 0xb6  1
M input averageLuxIntervalMinutes 166 0xa6  1
M output air_run_in_status 167 0xa7  1
M output air_stab_status 168 0xa8  1
M output air_iaq_accuracy 169 0xa9  1
M output air_iaq 146 0x92  1
M output air_co2 147 0x93  1
M output air_pressure 184 0xb8  0.01
M output air_breath_voc_equivalent 152 0x98  0.01
M output air_static_iaq 185 0xb9  1
M input air_interval_minutes 170 0xaa  1
M input air_static_iaq_alarm_level 186 0xba  1
M input air_iaq_alarm_level 187 0xbb  1
M output air_iaq_alarm 129 0x81  1
`,
            }, 
        

            4015071564: {
                name: "Lifefinder-wifi",
                versions: "",
                mapData: `M output temp 146 0x92  0.01
M output tempAlarm 128 0x80  1
M output humidity 176 0xb0  0.01
M input humidityThreshold 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input tempAlarmLowLevel 160 0xa0  1
M input tempAlarmHighLevel 161 0xa1  1
M output batteryPercent 162 0xa2  1
M output volts 179 0xb3  0.001
M output alarmTime 144 0x90  1
M output traceTime 145 0x91  1
M output nfcDisabledAlarm 129 0x81  1
M output alarmAccumulatedTime 152 0x98  1
M output traceTrigger 130 0x82  1
M input maxAlarmMinutes 180 0xb4  1
M input maxTraceMinutes 163 0xa3  1
M input traceTriggerMinutes 165 0xa5  1
M input alarmResendsBeforeUnjoin 181 0xb5  1
M input resendsBeforeUnjoin 166 0xa6  1
M input alarmResendTime 167 0xa7  1
M input quickAlarm 168 0xa8  1
M input nfcDisablesAlarm 169 0xa9  1
M input alarmAck 164 0xa4  1
M input positioningFreqency 170 0xaa  1
`,
            }, 
        

            4021230878: {
                name: "MeshWifiTracker",
                versions: "",
                mapData: `M input meshSyncInterval_minutes 176 0xb0  1
M input meshEnableUpside 160 0xa0  1
M input meshEnableDownside 161 0xa1  1
M output hours 177 0xb1  1
M output temp 178 0xb2  0.01
M output averageTemp 179 0xb3  0.01
M input tempHysteresis 180 0xb4  0.01
M input averageTempHysteresis 162 0xa2  0.1
M input averageTempIntervalMinutes 163 0xa3  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 164 0xa4  1
M input tempAlarmHighLevel 165 0xa5  1
M output batteryPercent 166 0xa6  1
M input rejoinBudgetMax 167 0xa7  1
M input rejoinBudgetRefill 168 0xa8  1
M input rejoinTime 181 0xb5  1
M input wifiStillScanInterval_h 169 0xa9  1
M input wifiMovingScanInterval_min 170 0xaa  1
M input motionThreshold_m_s2 182 0xb6  0.01
`,
            }, 
        

            4030513719: {
                name: "MeshBasicMotion",
                versions: "",
                mapData: `M input meshSyncInterval_minutes 176 0xb0  1
M input meshEnableUpside 160 0xa0  1
M input meshEnableDownside 161 0xa1  1
M input powerIndexFilterFactor 162 0xa2  1
M input maxPowerIndex 163 0xa3  1
M output temp 177 0xb1  0.01
M output averageTemp 178 0xb2  0.01
M input tempHysteresis 179 0xb3  0.01
M input averageTempHysteresis 164 0xa4  0.1
M input averageTempIntervalMinutes 165 0xa5  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 166 0xa6  1
M input tempAlarmHighLevel 167 0xa7  1
M output batteryPercent 168 0xa8  1
M input wifiScanInterval_h 169 0xa9  1
M output accX 144 0x90  0.001
M output accY 145 0x91  0.001
M output accZ 146 0x92  0.001
M output pressure_hPa 184 0xb8  0.01
M input motionThreshold_m_s2 180 0xb4  0.001
M input enableBarometer 170 0xaa  1
M output motion 171 0xab  1
`,
            }, 
        

            4058561182: {
                name: "Empty",
                versions: "R9 R8 R7 R6 R5 R28 R27 R26 R25 R24 R23 R22 R21 R20 R19 R18 R16 R15 R14 R13 R12 R11 R10",
                mapData: ``,
            }, 
        

            4072134224: {
                name: "Lifefinder-motion-nfc-gnss",
                versions: "R28",
                mapData: `M output temp 145 0x91  0.01
M output tempAlarm 128 0x80  1
M output humidity 176 0xb0  0.01
M input humidityThreshold 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input tempAlarmLowLevel 160 0xa0  1
M input tempAlarmHighLevel 161 0xa1  1
M output batteryPercent 162 0xa2  1
M output volts 179 0xb3  0.001
M output deviceActive 129 0x81  1
M output alarmTime 144 0x90  1
M input activeTimeMaxMinutes 184 0xb8  1
M input alarmAck 164 0xa4  1
M input maxAlarmMinutes 180 0xb4  1
M input stillMotionThreshold_mm_s2 181 0xb5  1
M input movingMotionThreshold_mm_s2 182 0xb6  1
M input stationaryPositionMinutes 163 0xa3  1
M input movingPositionMinutes 165 0xa5  1
M output accumulatedStationaryTime 146 0x92  1
M output accumulatedMovingTime 147 0x93  1
M input positioningFreqency 166 0xa6  1
`,
            }, 
        

            4078507651: {
                name: "Puck-radar-v6",
                versions: "R6 R5",
                mapData: `M input roamNetworkCount 160 0xa0  1
M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalHours 161 0xa1  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 162 0xa2  1
M input tempAlarmHighLevel 163 0xa3  1
M output amplitude 144 0x90  1
M output distance 145 0x91  0.01
M output occupied 129 0x81  1
M output bluetoothMacLS 184 0xb8  1
M output bluetoothMacMS 185 0xb9  1
M input amplitudeHysteresis 179 0xb3  1
M input distanceHysteresis 164 0xa4  0.01
M output batteryPercent 165 0xa5  1
M output underVoltage 166 0xa6  1
`,
            }, 
        

            4120107816: {
                name: "Linkcheck",
                versions: "R9 R28 R27 R26 R25 R24 R23 R22 R21 R20 R19 R18 R16 R15 R14 R13 R12 R11 R10",
                mapData: `M input linkCheckRate 160 0xa0  1
`,
            }, 
        

            4174894842: {
                name: "Square-comfort",
                versions: "R13",
                mapData: `M input roamNetworkCount 160 0xa0  1
M output batteryPercent 161 0xa1  1
M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempIntervalMinutes 162 0xa2  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 163 0xa3  1
M input tempAlarmHighLevel 164 0xa4  1
M output humidity 179 0xb3  0.01
M output averageHumidity 144 0x90  0.01
M input humidityTreshold 180 0xb4  0.01
M input averageHumidityIntervalMinutes 165 0xa5  1
M output lux 181 0xb5  1
M output averageLux 145 0x91  1
M input luxTresholdPercent 182 0xb6  1
M input averageLuxIntervalMinutes 166 0xa6  1
`,
            }, 
        

            4209750967: {
                name: "MeshBridge",
                versions: "",
                mapData: `M input meshSyncInterval_minutes 176 0xb0  1
M input meshEnableUpside 160 0xa0  1
M input meshEnableDownside 161 0xa1  1
M output temp 177 0xb1  0.01
M output averageTemp 178 0xb2  0.01
M input tempHysteresis 179 0xb3  0.01
M input averageTempIntervalMinutes 162 0xa2  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 163 0xa3  1
M input tempAlarmHighLevel 164 0xa4  1
M output batteryPercent 165 0xa5  1
M input rejoinBudgetMax 166 0xa6  1
M input rejoinBudgetRefill 167 0xa7  1
M input rejoinTime 180 0xb4  1
`,
            }, 
        

            4214096358: {
                name: "Lifefinder-alternating",
                versions: "",
                mapData: `M output temp 146 0x92  0.01
M output tempAlarm 128 0x80  1
M output humidity 176 0xb0  0.01
M input humidityThreshold 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input tempAlarmLowLevel 160 0xa0  1
M input tempAlarmHighLevel 161 0xa1  1
M output batteryPercent 162 0xa2  1
M output volts 179 0xb3  0.001
M output alarmTime 144 0x90  1
M output traceTime 145 0x91  1
M output nfcDisabledAlarm 129 0x81  1
M output alarmAccumulatedTime 152 0x98  1
M output traceTrigger 130 0x82  1
M input maxAlarmMinutes 180 0xb4  1
M input maxTraceMinutes 163 0xa3  1
M input traceTriggerMinutes 165 0xa5  1
M input alarmResendsBeforeUnjoin 181 0xb5  1
M input resendsBeforeUnjoin 166 0xa6  1
M input alarmResendTime 167 0xa7  1
M input quickAlarm 168 0xa8  1
M input nfcDisablesAlarm 169 0xa9  1
M input alarmAck 164 0xa4  1
M input positioningFreqency 170 0xaa  1
M input scanTimeMs 182 0xb6  1
M input limitedScanChannels 184 0xb8  1
`,
            }, 
        

            4231041369: {
                name: "Square-air",
                versions: "R28 R27",
                mapData: `M input roamNetworkCount 160 0xa0  1
M output batteryPercent 161 0xa1  1
M output temp 176 0xb0  0.01
M output averageTemp 177 0xb1  0.01
M input tempHysteresis 178 0xb2  0.01
M input averageTempHysteresis 162 0xa2  0.1
M input averageTempIntervalMinutes 163 0xa3  1
M output tempAlarm 128 0x80  1
M input tempAlarmLowLevel 164 0xa4  1
M input tempAlarmHighLevel 165 0xa5  1
M output humidity 179 0xb3  0.01
M output averageHumidity 144 0x90  0.01
M input humidityTreshold 180 0xb4  0.01
M input averageHumidityIntervalMinutes 166 0xa6  1
M input powerIndexFilterFactor 167 0xa7  1
M input maxPowerIndex 168 0xa8  1
M output lux 181 0xb5  1
M output averageLux 145 0x91  1
M input luxTresholdPercent 182 0xb6  1
M input averageLuxIntervalMinutes 169 0xa9  1
M output air_run_in_status 170 0xaa  1
M output air_stab_status 171 0xab  1
M output air_iaq_accuracy 172 0xac  1
M output air_iaq 184 0xb8  1
M output air_co2 185 0xb9  1
M output air_pressure 186 0xba  0.01
M output air_breath_voc_equivalent 187 0xbb  0.01
M output air_static_iaq 188 0xbc  1
M input air_interval_minutes 173 0xad  1
M input air_static_iaq_alarm_level 189 0xbd  1
M input air_iaq_alarm_level 190 0xbe  1
M output air_iaq_alarm 129 0x81  1
`,
            }, 
          // Additional known schemas:


            777944170: {
                name: "dots,temp,radar-v5-experimental",
                versions: "R0-update",
                mapData: `M output temp 176 0xb0 0.01 
M output averageTemp 177 0xb1 0.01 
M input tempHysteresis 178 0xb2 0.01 
M input averageTempIntervalMinutes 160 0xa0 1 
M output tempAlarm 128 0x80 1 
M input tempAlarmLowLevel 161 0xa1 1 
M input tempAlarmHighLevel 162 0xa2 1 
M output amplitude 144 0x90 1 
M output distance 145 0x91 0.01 
M output occupied 129 0x81 1 
M input amplitudeHysteresis 179 0xb3 1 
M input distanceHysteresis 163 0xa3 0.01 
M output batteryPercent 164 0xa4 1 
M output underVoltage 165 0xa5 1
`,
            }, 
        };

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

    // Error bitmask
    const errorBits = {
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
    const statusValues = {
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

    const decodeControl = (iotnode, symbolTable, data, time) => {
        const vmError   = data[0];
        let vmErrorText = "";
        for (let i = 0; i < 8; ++i) {
            if (vmError & (1<<i))
                vmErrorText += errorBits[i] + " ";
        }
        if (vmErrorText === "")
            vmErrorText = "OK";
        else
            vmErrorText = vmErrorText.trim();
        const vmStatus  = data[1];
        let vmStatusText = statusValues.hasOwnProperty(vmStatus) ? statusValues[vmStatus] : "Unknown";
        return { result: { vsm: {status: {vmError, vmStatus, vmErrorText, vmStatusText, timestamp: new Date()}}}};
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
            schemaInfo = { 
                appName: knownSchemas[rulesCrc32].name, 
                schema: knownSchemas[rulesCrc32].mapData, 
                appVersions: knownSchemas[rulesCrc32].versions,
                // Added as requirement from product owner:
                appDocumentationUrl: `https://github.com/Sensative/vsm-application-documentation/blob/master/${rulesCrc32}-${knownSchemas[rulesCrc32].name}.vso.md`,
                appConfigurationUrl: `https://vsm-lora-config-app.service.sensative.net/?app=${rulesCrc32}`,
                // Good to know how old this information is
                timestamp: new Date(),
            }
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
                    timestamp : new Date(),
                }
            } }
        };

        if (data.length < 10) {
            // Illegal mesh message
            return {};
        }

        let serial = ((data[0] << 24) | (data[1] << 16) | (data[2] << 8) | data[3]) & 0xffffffff;
        let upsideRate = (data[4] >> 4) & 0xf;
        if (upsideRate === 0xf) upsideRate = -1; // Not enabled
        let downsideRate = data[4] & 0xf;
        if (downsideRate === 0xf) downsideRate = -1; // Not enabled
        let age_s  = ((data[5] << 16) | (data[6] << 8) | data[7]) & 0xffffff;
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
        // The mesh data is both recorded in the result object, and in the yggio-specific additionalDeviceUpdates
        // field (which should magically update nodes with the set secret)
        let result = {mesh: { stats: {upsideRate, downsideRate, receivedTimestamp, serial} } };
        const carrier = iotnode && iotnode.name ? iotnode.name : "";
        return { 
            result, 
            additionalDeviceUpdates : [ {
                identifier: {secret:""+serial},
                result: { 
                    mesh : { transport : { receivedTimestamp, producedTimestamp, port, hex, carrier, rate: downsideRate /* current nodes downside rate is the transmitting nodes upside rate */} },
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
                    timestamp: new Date(time_s*1000 - age_ms /* note, subsequent data with no time diff were earlier */),
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
        let ascii = undefined;
        if (port === 32 /* puck radar sent a command response */ ) {
            try {
                ascii = data.toString('ascii');
            } catch (ignored) { ascii = undefined; }
        }
        // Standard packaging
        result.result.forward["port"+port] = {timestamp: new Date(time), data: data.toString('hex')}
        // Port 32 interpreted as ascii data
        if (ascii)
            result.result.forward["radar"] = { timestamp: new Date(time), ascii};
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

    // Lora ports range is less than 1000. Mesh translation will add 1000 to the port so we can distinguish
    let clearMeshTransport = false;
    if (port < MESH_PORT_OFFSET) { // Message transported by lorawan
        if (iotnode && iotnode.mesh && iotnode.mesh.transport && iotnode.mesh.transport.carrier)
            clearMeshTransport = true;
    }
    else { // Message transported by mesh
        port -= MESH_PORT_OFFSET;
    }

    if (mapPortToDecode.hasOwnProperty(port)) {
        let result = mapPortToDecode[port].decode(iotnode, symbolTable, data, time);
        if (clearMeshTransport && result && result.result)
            result.result.mesh = {transport:{carrier:"LoRaWan"}}
        return result;
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
                    {"timestamp":"2021-11-19T12:04:19.999Z","value":{"output":{"alarmTime":44}}}
                ],
                "result": {
                    "output":{"gpsTime":1637584254,"alarmTime":44},
                    "timestamps":{"gpsTime":"2021-11-19T12:04:20.000Z","alarmTime":"2021-11-19T12:04:19.999Z"}}}
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
                    {"timestamp":"2021-11-19T12:04:17.999Z","value":{"output":{"gnssState":1}}},
                    {"timestamp":"2021-11-19T12:04:17.999Z","value":{"output":{"alarmTime":4}}}
                ],
                "result":{
                    "output":{"gpsTime":1637581376,"gnssState":1,"alarmTime":4},
                    "timestamps":{"gpsTime":"2021-11-19T12:04:18.000Z","gnssState":"2021-11-19T12:04:17.999Z","alarmTime":"2021-11-19T12:04:17.999Z"}
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
                    {"timestamp":"2021-11-19T12:04:16.999Z","value":{"output":{"alarmTime":0}}}
                ],
                "result":{
                    "output":{"buttonAlarm":0,"alarmTime":0},
                    "timestamps":{"buttonAlarm":"2021-11-19T12:04:17.000Z","alarmTime":"2021-11-19T12:04:16.999Z"}
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
                    {"timestamp":"2021-11-19T12:04:26.999Z","value":{"output":{"alarmTime":0}}},
                    {"timestamp":"2021-11-19T12:03:51.000Z","value":{"output":{"alarmTime":2}}},
                    {"timestamp":"2021-11-19T12:03:50.999Z","value":{"output":{"gnssState":4}}},
                    {"timestamp":"2021-11-19T12:03:36.000Z","value":{"output":{"buttonAlarm":1}}},
                    {"timestamp":"2021-11-19T12:03:35.999Z","value":{"output":{"alarmTime":1}}}
                ],
                "result":{
                    "output":{"buttonAlarm":0,"alarmTime":0}, // Does not include gnss-state since there is a more recent
                    "timestamps":{"buttonAlarm":"2021-11-19T12:04:27.000Z","alarmTime":"2021-11-19T12:04:26.999Z"}}}
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
                    {"timestamp":"2021-11-19T12:03:58.999Z","value":{"output":{"gnssState":1}}}
                ],
                "result":{
                    "output":{"gpsTime":1611137049,"gnssState":1},
                    "timestamps":{"gpsTime":"2021-11-19T12:03:59.000Z","gnssState":"2021-11-19T12:03:58.999Z"}
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
                    {"timestamp":"2021-11-19T12:04:28.999Z","value":{"output":{"buttonAlarm":1}}},
                    {"timestamp":"2021-11-19T12:04:28.999Z","value":{"output":{"alarmTime":1}}}
                ],
                "result":{
                    "output":{"buttonAlarm":1,"alarmTime":1},
                    "timestamps":{"buttonAlarm":"2021-11-19T12:04:28.999Z","alarmTime":"2021-11-19T12:04:28.999Z"}
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
        { // 12 - Positioning metadata - with ages
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
        { // 13 - Positioning metadata - without ages or position
            input: {
                encodedData : {
                    port: 22,
                    hexEncoded: "000000000000000000000000",
                    timestamp: new Date(1640860261670),
                }
            },
            expect: {result:{"gnss":{"assistancePositionTimestamp":"1970-01-01T00:00:00.000Z","almanacTimestamp":"1970-01-01T00:00:00.000Z","assistanceLatitude":0,"assistanceLongitude":0}}}
        },
        { // 14 - Diagnostics service - crash
            input: {
                encodedData : {
                    port: 3,
                    hexEncoded: "0123102030405060708090",
                    timestamp: new Date(1640860261670),
                }
            },
            expect: {result:{"vsm":{"crash": {index: 291, bytes: "102030405060708090"}}}}
        },
        { // 15 - Diagnostics service - reference
            input: {
                encodedData : {
                    port: 2,
                    hexEncoded: "010000000f",
                    timestamp: new Date(1640860261670),
                }
            },
            expect: {result:{"vsm":{"debug": {"ref:1":15}}}}
        },
        { // 16 - Positioning service: WIFI capture
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
        { // 17 - Stored uplinks service (Diagnostics service - reference)
            input: {
                encodedData : {
                    port: 12,
                    hexEncoded: "61cd8a6202010000000f",
                    timestamp: new Date(1640860261670),
                }
            },
            expect: {result:{"vsm":{"debug": {"ref:1":15}}}}
        },
        { // 18
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
                    {"timestamp":"2021-12-30T10:30:45.999Z","value":{"output":{"alarmTime":0}}}
                ],
                "result":{
                    "output":{"buttonAlarm":0,"alarmTime":0},
                    "timestamps":{"buttonAlarm":"2021-12-30T10:30:46.000Z","alarmTime":"2021-12-30T10:30:45.999Z"}
                }
            }            
        },
        { // 19 - IDD data
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
        { // 20 - PWR data [raw for now]
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
        { // 21 - Port forward on port 32
            input: {
                vsm: {schema: description },
                encodedData : {
                    port : 32,
                    hexEncoded : "7379733A3F",
                    timestamp: new Date(1640860261670), // Not used
                }
            },
            expect: {
                "result": {
                    "forward":{
                        port32: {
                        "timestamp":"2021-12-30T10:31:01.670Z",
                        "data":"7379733a3f"
                        },
                        radar: {
                            "timestamp":"2021-12-30T10:31:01.670Z",
                            "ascii":"sys:?"                                
                        },
                    }
                }
            }
        },
        // TODO: Mesh (port 8)
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
