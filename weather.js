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
        console.log('  --units, -u      Temperature units (celsius/fahrenheit)');
        console.log('  --forecast, -f   Show 5-day forecast instead of current weather');
        console.log('  --help, -h       Show help');
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
    
    const showForecast = args.includes('--forecast') || args.includes('-f');
    
    return { city: city.trim(), units, showForecast };
}

const { city, units, showForecast } = parseArgs();

async function getWeather(cityName, temperatureUnits) {
    try {
        console.log(`Getting weather for ${cityName}...`);
        
        const apiKey = config.apiKey || 'demo';
        const unitSystem = temperatureUnits === 'fahrenheit' ? 'imperial' : 'metric';
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${unitSystem}`;
        
        if (apiKey === 'demo' || apiKey === 'your_openweathermap_api_key_here') {
            console.log('Using demo mode (no real API key configured)');
            showDemoData(cityName, temperatureUnits);
            return;
        }
        
        const response = await axios.get(url);
        const weatherData = response.data;
        
        console.log('Weather data retrieved successfully!');
        console.log(`\nWeather in ${weatherData.name}, ${weatherData.sys.country}:`);
        console.log(`Temperature: ${Math.round(weatherData.main.temp)}°${temperatureUnits === 'fahrenheit' ? 'F' : 'C'}`);
        console.log(`Feels like: ${Math.round(weatherData.main.feels_like)}°${temperatureUnits === 'fahrenheit' ? 'F' : 'C'}`);
        console.log(`Condition: ${weatherData.weather[0].description}`);
        console.log(`Humidity: ${weatherData.main.humidity}%`);
        console.log(`Wind Speed: ${weatherData.wind.speed} ${unitSystem === 'imperial' ? 'mph' : 'm/s'}`);
        
    } catch (error) {
        if (error.response) {
            const status = error.response.status;
            const message = error.response.data.message || 'Unknown error';
            
            switch (status) {
                case 401:
                    console.error('Error: Invalid API key. Please check your config.json file.');
                    break;
                case 404:
                    console.error(`Error: City "${cityName}" not found. Please check the spelling.`);
                    break;
                case 429:
                    console.error('Error: Too many requests. Please try again later.');
                    break;
                default:
                    console.error(`Error: ${message} (Status: ${status})`);
            }
        } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
            console.error('Error: Unable to connect to weather service. Check your internet connection.');
        } else {
            console.error('Error fetching weather data:', error.message);
        }
        process.exit(1);
    }
}

function showDemoData(cityName, temperatureUnits) {
    console.log('Weather data retrieved successfully!');
    console.log(`\nWeather in ${cityName}:`);
    
    const tempSymbol = temperatureUnits === 'fahrenheit' ? '°F' : '°C';
    const tempValue = temperatureUnits === 'fahrenheit' ? '72' : '22';
    const feelsLike = temperatureUnits === 'fahrenheit' ? '75' : '24';
    const windSpeed = temperatureUnits === 'fahrenheit' ? '8 mph' : '3.6 m/s';
    
    console.log(`Temperature: ${tempValue}${tempSymbol}`);
    console.log(`Feels like: ${feelsLike}${tempSymbol}`);
    console.log('Condition: partly cloudy');
    console.log('Humidity: 65%');
    console.log(`Wind Speed: ${windSpeed}`);
}

if (showForecast) {
    getForecast(city, units);
} else {
    getWeather(city, units);
}

async function getForecast(cityName, temperatureUnits) {
    try {
        console.log(`Getting 5-day forecast for ${cityName}...`);
        
        const apiKey = config.apiKey || 'demo';
        const unitSystem = temperatureUnits === 'fahrenheit' ? 'imperial' : 'metric';
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=${unitSystem}`;
        
        if (apiKey === 'demo' || apiKey === 'your_openweathermap_api_key_here') {
            console.log('Using demo mode (no real API key configured)');
            showDemoForecast(cityName, temperatureUnits);
            return;
        }
        
        const response = await axios.get(url);
        const forecastData = response.data;
        
        console.log('Forecast data retrieved successfully!');
        console.log(`\n5-Day Weather Forecast for ${forecastData.city.name}, ${forecastData.city.country}:\n`);
        
        const dailyForecasts = {};
        forecastData.list.forEach(item => {
            const date = new Date(item.dt * 1000).toDateString();
            if (!dailyForecasts[date]) {
                dailyForecasts[date] = item;
            }
        });
        
        Object.entries(dailyForecasts).slice(0, 5).forEach(([date, forecast]) => {
            const temp = Math.round(forecast.main.temp);
            const tempSymbol = temperatureUnits === 'fahrenheit' ? 'F' : 'C';
            
            console.log(`${date}:`);
            console.log(`  Temperature: ${temp}°${tempSymbol}`);
            console.log(`  Condition: ${forecast.weather[0].description}`);
            console.log(`  Humidity: ${forecast.main.humidity}%`);
            console.log('');
        });
        
    } catch (error) {
        if (error.response) {
            const status = error.response.status;
            const message = error.response.data.message || 'Unknown error';
            
            switch (status) {
                case 401:
                    console.error('Error: Invalid API key. Please check your config.json file.');
                    break;
                case 404:
                    console.error(`Error: City "${cityName}" not found. Please check the spelling.`);
                    break;
                case 429:
                    console.error('Error: Too many requests. Please try again later.');
                    break;
                default:
                    console.error(`Error: ${message} (Status: ${status})`);
            }
        } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
            console.error('Error: Unable to connect to weather service. Check your internet connection.');
        } else {
            console.error('Error fetching forecast data:', error.message);
        }
        process.exit(1);
    }
}

function showDemoForecast(cityName, temperatureUnits) {
    console.log('Forecast data retrieved successfully!');
    console.log(`\n5-Day Weather Forecast for ${cityName}:\n`);
    
    const tempSymbol = temperatureUnits === 'fahrenheit' ? 'F' : 'C';
    const baseTemp = temperatureUnits === 'fahrenheit' ? 70 : 20;
    
    const days = ['Mon Mar 17 2025', 'Tue Mar 18 2025', 'Wed Mar 19 2025', 'Thu Mar 20 2025', 'Fri Mar 21 2025'];
    const conditions = ['sunny', 'partly cloudy', 'light rain', 'cloudy', 'clear'];
    
    days.forEach((day, index) => {
        const temp = baseTemp + (Math.random() * 10 - 5);
        console.log(`${day}:`);
        console.log(`  Temperature: ${Math.round(temp)}°${tempSymbol}`);
        console.log(`  Condition: ${conditions[index]}`);
        console.log(`  Humidity: ${Math.round(60 + Math.random() * 20)}%`);
        console.log('');
    });
}