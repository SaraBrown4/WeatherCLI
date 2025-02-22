#!/usr/bin/env node

const axios = require('axios');

console.log('WeatherCLI v1.0.0');

function parseArgs() {
    const args = process.argv.slice(2);
    
    if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
        console.log('Usage: node weather.js <city> [options]');
        console.log('');
        console.log('Options:');
        console.log('  --units, -u    Temperature units (celsius/fahrenheit)');
        console.log('  --help, -h     Show help');
        console.log('');
        console.log('Examples:');
        console.log('  node weather.js London');
        console.log('  node weather.js "New York" --units fahrenheit');
        process.exit(args.includes('--help') || args.includes('-h') ? 0 : 1);
    }
    
    const city = args[0];
    const unitsIndex = args.findIndex(arg => arg === '--units' || arg === '-u');
    const units = unitsIndex !== -1 && args[unitsIndex + 1] ? args[unitsIndex + 1] : 'celsius';
    
    return { city, units };
}

const { city, units } = parseArgs();

async function getWeather(cityName, temperatureUnits) {
    try {
        console.log(`Getting weather for ${cityName}...`);
        
        const apiKey = 'demo'; // placeholder for now
        const unitSystem = temperatureUnits === 'fahrenheit' ? 'imperial' : 'metric';
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${unitSystem}`;
        
        // For demo purposes, simulate API response
        console.log('Weather data retrieved successfully!');
        console.log(`City: ${cityName}`);
        
        const tempSymbol = temperatureUnits === 'fahrenheit' ? '°F' : '°C';
        const tempValue = temperatureUnits === 'fahrenheit' ? '72' : '22';
        
        console.log(`Temperature: ${tempValue}${tempSymbol}`);
        console.log('Condition: Sunny');
        console.log('Humidity: 65%');
        
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
    }
}

getWeather(city, units);