#!/usr/bin/env node

console.log('WeatherCLI v1.0.0');

const city = process.argv[2];

if (!city) {
    console.log('Usage: node weather.js <city>');
    console.log('Example: node weather.js London');
    process.exit(1);
}

console.log(`Getting weather for ${city}...`);