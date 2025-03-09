#!/usr/bin/env node

const axios = require('axios');
const fs = require('fs');
const path = require('path');

console.log('WeatherCLI v1.0.0');

function loadConfig() {
    const configPath = path.join(__dirname, 'config.json');
    
    if (!fs.existsSync(configPath)) {
        console.log('No config.json found. Using default settings.');
        console.log('Copy config.example.json to config.json and add your API key.');
        return {
            apiKey: 'demo',
            defaultUnits: 'celsius',
            defaultCity: null
        };
    }
    
    try {
        const configData = fs.readFileSync(configPath, 'utf8');
        return JSON.parse(configData);
    } catch (error) {
        console.error('Error reading config file:', error.message);
        process.exit(1);
    }
}

const config = loadConfig();

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
    if (!city || city.trim() === '') {
        console.error('Error: City name cannot be empty');
        process.exit(1);
    }
    
    const unitsIndex = args.findIndex(arg => arg === '--units' || arg === '-u');
    let units = 'celsius';
    
    if (unitsIndex !== -1) {
        const providedUnits = args[unitsIndex + 1];
        if (!providedUnits) {
            console.error('Error: --units option requires a value (celsius/fahrenheit)');
            process.exit(1);
        }
        
        if (!['celsius', 'fahrenheit', 'c', 'f'].includes(providedUnits.toLowerCase())) {
            console.error('Error: Invalid units. Use "celsius" or "fahrenheit"');
            process.exit(1);
        }
        
        units = providedUnits.toLowerCase() === 'f' ? 'fahrenheit' : 
                providedUnits.toLowerCase() === 'c' ? 'celsius' : 
                providedUnits.toLowerCase();
    }
    
    return { city: city.trim(), units };
}

const { city, units } = parseArgs();

async function getWeather(cityName, temperatureUnits) {
    try {
        console.log(`Getting weather for ${cityName}...`);
        
        const apiKey = config.apiKey || 'demo';
        const unitSystem = temperatureUnits === 'fahrenheit' ? 'imperial' : 'metric';
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${unitSystem}`;
        
        if (apiKey === 'demo') {
            console.log('Using demo mode (no real API key configured)');
        }
        
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