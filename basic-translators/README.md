# README

* The decoders for Chirpstack V3 can be found in the `chirpstack-v3` folder

* The decoders for Chirpstack V4 & The Things Network (TTN) can be found in the `thethingsnetwork-chirpstack-v4` folder

* Developers regenerating these decoders: see [README-DEVELOPER.md](README-DEVELOPER.md)

<br>

### The following decoders/translators are valid for the following applications and respective firmware version:

Versions R1000 and above are generation II firmware. A decoder that supports both generations has both ranges in its filename, for example `Seat-occupancy-R30-to-R33-and-R1000-to-R1001.js`.

When two decoders cover the same version, pick the one whose CRC matches the application running on your device. Decoders that cover exactly the same versions also end their filename with a CRC, for example `Air-R1000-to-R1001-1270577071.js`.

| Product Application    | Versions                                                                                            | CRCs                                                                  |
|------------------------|-----------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------|
| Air                    | R1000 R1001                                                                                         | 156242849, 1167154829, 3563830815                                     |
| Air                    | R1000 R1001                                                                                         | 1270577071, 1992308244                                                |
| Air                    | R1000                                                                                               | 1843680688                                                            |
| Air                    | R1002                                                                                               | 1311905073, 3672498527                                                |
| Air                    | R1002                                                                                               | 2367958298                                                            |
| Digital-gpio           | R11 R12 R13 R14 R15 R16 R18 R19 R20 R21 R22 R23                                                     | 1617091456, 3497448490                                                |
| Digital-gpio           | R24 R25 R26 R1002                                                                                   | 617437349, 1368947946, 1625058930                                     |
| Digital-gpio           | R27 R28 R29                                                                                         | 3409025270                                                            |
| Digital-gpio           | R30 R31 R32 R33 R1000 R1001                                                                         | 3392161576                                                            |
| Lifefinder-alternating | R22 R23 R24 R25                                                                                     | 501251891, 1188116463, 1936564868                                     |
| Lifefinder-alternating | R26                                                                                                 | 1592932210                                                            |
| Lifefinder-alternating | R27 R28 R29 R30                                                                                     | 393429851, 1161910006, 3227680283                                     |
| Lifefinder-alternating | R31 R32 R33 R1000 R1001 R1002                                                                       | 337227680, 3536868539                                                 |
| Lifefinder-gnss        | R22 R23 R24 R25                                                                                     | 58620517, 2566472474, 2907035249                                      |
| Lifefinder-gnss        | R26                                                                                                 | 3441810944                                                            |
| Lifefinder-gnss        | R27 R28 R29 R30                                                                                     | 892254780, 2591224998, 3795814268                                     |
| Lifefinder-gnss        | R31 R32 R33 R1000 R1001 R1002                                                                       | 523897088, 3756050244                                                 |
| Lifefinder-wifi        | R11 R12 R13 R14 R15 R16 R18 R19 R20 R21                                                             | 691254335, 2274655646, 3994244140                                     |
| Lifefinder-wifi        | R22 R23 R24 R25                                                                                     | 493404408, 685004179, 1920568829                                      |
| Lifefinder-wifi        | R26                                                                                                 | 232953314                                                             |
| Lifefinder-wifi        | R27 R28 R29 R30                                                                                     | 1005192630, 1388527692, 2409062033                                    |
| Lifefinder-wifi        | R31 R32 R33 R1000 R1001 R1002                                                                       | 1793139152, 2569610816                                                |
| Motion-measure         | R11 R12 R13 R14 R15 R16 R18 R19 R20 R21 R22 R23 R24 R25 R26 R27 R28 R29 R30 R31 R32 R33 R1000 R1001 | 40829709, 289128601, 2297466901                                       |
| Motion-measure         | R30 R31 R32 R33 R1000 R1001                                                                         | 2473725182                                                            |
| Motion-measure         | R1002                                                                                               | 786337538                                                             |
| Motion-spectrum        | R26 R27 R28 R29                                                                                     | 1367119623, 1548534003                                                |
| Motion-spectrum        | R30 R31 R32 R33 R1000 R1001                                                                         | 618828819, 1459643068, 2409246216, 4173659976                         |
| Motion-spectrum        | R1002                                                                                               | 3472037336                                                            |
| Presence               | R1001                                                                                               | 119034373                                                             |
| Presence               | R1002                                                                                               | 41180807                                                              |
| Puck-radar             | R11 R12 R13 R14 R15 R16 R18 R19 R20 R21 R22 R23 R24 R25 R26                                         | 561898260, 1325798073                                                 |
| Puck-radar             | R27 R28 R29                                                                                         | 2025703382, 2847964315                                                |
| Puck-radar             | R30                                                                                                 | 1977453069                                                            |
| Puck-radar             | R31 R32 R33 R1000 R1001                                                                             | 1946060128                                                            |
| Puck-radar             | R1002                                                                                               | 133175945                                                             |
| Seat-occupancy         | R29                                                                                                 | 2793176638                                                            |
| Seat-occupancy         | R30 R31 R32 R33 R1000 R1001                                                                         | 3297213463                                                            |
| Seat-occupancy         | R1002                                                                                               | 3436447087                                                            |
| Square-air             | R11 R12 R13 R14 R15                                                                                 | 472391447, 915094797, 3634715455, 4002204643                          |
| Square-air             | R16 R18 R19 R20 R21 R22 R23 R24 R25 R26                                                             | 3241343967, 3906402051                                                |
| Square-air             | R27 R28 R29                                                                                         | 4231041369                                                            |
| Square-air             | R30 R31 R32 R33 R1000 R1001                                                                         | 114894312, 2878174033                                                 |
| Square-air             | R1002                                                                                               | 3007941823                                                            |
| Square-comfort         | R11 R12 R13 R14 R15 R16 R18 R19 R20 R21 R22 R23 R24 R25 R26                                         | 2266505222, 2696231198, 2935762138, 3530880224, 4174894842            |
| Square-comfort         | R27 R28 R29                                                                                         | 3679384538                                                            |
| Square-comfort         | R30 R31 R32 R33 R1000 R1001                                                                         | 4055310652                                                            |
| Square-comfort         | R31 R32 R33 R1000 R1001                                                                             | 186643291, 3502401091                                                 |
| Square-comfort         | R1002                                                                                               | 271570992                                                             |
| Square-comfort         | R1002                                                                                               | 701440494                                                             |
| Square-sound           | R11 R12 R13 R14 R15 R16 R18 R19 R20 R21 R22                                                         | 517999093, 1355326083, 2338085954, 2387046759, 2766427005, 3090458506 |
| Square-sound           | R23 R24 R25 R26                                                                                     | 3437792987, 3842802183                                                |
| Square-sound           | R27 R28 R29                                                                                         | 3500434333                                                            |
| Square-sound           | R30 R31 R32 R33 R1000 R1001                                                                         | 1030541641                                                            |
| Square-sound           | R31 R32 R33 R1000 R1001                                                                             | 1396760839, 2292020255                                                |
| Square-sound           | R1002                                                                                               | 911051251                                                             |
| Square-sound           | R1002                                                                                               | 3172521889                                                            |
| Tracker                | R11 R12 R13 R14 R15 R16 R18 R19 R20 R21                                                             | 489186430                                                             |
| Tracker                | R22 R23 R24 R25 R26 R27 R28 R29 R30 R31 R32 R33 R1000 R1001                                         | 2029355788, 2093063534, 3802553086                                    |
| Tracker                | R1002                                                                                               | 632987839                                                             |
