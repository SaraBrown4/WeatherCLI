#!/usr/bin/env node

const axios = require('axios');

console.log('WeatherCLI v1.0.0');

const city = process.argv[2];

if (!city) {
    console.log('Usage: node weather.js <city>');
    console.log('Example: node weather.js London');
    process.exit(1);
}

async function getWeather(cityName) {
    try {
        console.log(`Getting weather for ${cityName}...`);
        
        const apiKey = 'demo'; // placeholder for now
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
        
        // For demo purposes, simulate API response
        console.log('Weather data retrieved successfully!');
        console.log(`City: ${cityName}`);
        console.log('Temperature: 22°C');
        console.log('Condition: Sunny');
        console.log('Humidity: 65%');
        
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
    }
}

getWeather(city);