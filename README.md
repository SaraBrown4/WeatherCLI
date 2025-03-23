# WeatherCLI

A simple command-line tool to check current weather and forecasts for any city around the world.

## Features

- 🌤️ Current weather information
- 📅 5-day weather forecast
- 🌡️ Temperature in Celsius or Fahrenheit
- 💨 Wind speed and humidity data
- 🔧 Configurable API settings
- 📍 Support for any city worldwide
- 🖥️ Clean CLI output

## Installation

1. Clone the repository or download the files
2. Install dependencies:
```bash
npm install
```

3. (Optional) Set up your API key:
   - Copy `config.example.json` to `config.json`
   - Get a free API key from [OpenWeatherMap](https://openweathermap.org/api)
   - Add your API key to `config.json`

## Usage

### Current Weather
```bash
node weather.js <city>
node weather.js London
node weather.js "New York"
```

### 5-Day Forecast
```bash
node weather.js <city> --forecast
node weather.js London -f
```

### Temperature Units
```bash
node weather.js <city> --units fahrenheit
node weather.js London -u celsius
```

### Combined Options
```bash
node weather.js "Los Angeles" --forecast --units fahrenheit
```

## Options

- `--units, -u`: Temperature units (celsius/fahrenheit)
- `--forecast, -f`: Show 5-day forecast instead of current weather
- `--help, -h`: Show help information

## Configuration

Create a `config.json` file to customize default settings:

```json
{
  "apiKey": "your_openweathermap_api_key_here",
  "defaultUnits": "celsius",
  "defaultCity": "London"
}
```

## Demo Mode

If no API key is configured, the tool runs in demo mode with simulated data.

## Requirements

- Node.js
- Internet connection (for real weather data)