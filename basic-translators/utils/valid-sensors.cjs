// List of allowed Sensative sensors and devices
const validSensors = [
    "Digital-gpio",             // Digital General Purpose Input/Output
    "Lifefinder-alternating",   // Lifefinder sensor with alternating signal
    "Lifefinder-gnss",          // Lifefinder sensor with GNSS (Global Navigation Satellite System)
    "Lifefinder-wifi",          // Lifefinder sensor with WiFi capability
    "Motion-measure",           // Motion measurement sensor
    "Motion-spectrum",          // Motion spectrum sensor
    "Puck-radar",               // Puck-shaped radar sensor
    "Seat-occupancy",           // Prism - Seat occupancy application
    "Square-air",               // Square-shaped air quality sensor
    "Square-comfort",           // Square-shaped comfort sensor
    "Square-comfort-sound",     // Square-shaped comfort sensor with sound measurement
    "Square-sound",             // Square-shaped sound sensor
    "Tracker"                   // Tracker device
];

module.exports = {
    validSensors
};
