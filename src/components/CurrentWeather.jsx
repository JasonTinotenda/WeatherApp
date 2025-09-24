import React, { useState, useEffect } from 'react';
import { FaCloud, FaTimes, FaArrowUp, FaSun, FaCloudRain } from 'react-icons/fa';
import HourlyWeather from './HourlyWeather';


const CurrentWeather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCurrentWeather() {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=-17.875&longitude=30.875&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,visibility&timezone=Europe%2FLondon`
        );
        
        if (!response.ok) {
          throw new Error('Weather data fetch failed');
        }
        
        const data = await response.json();
        setWeatherData(data.current);
        setError(null);
      } catch (err) {
        setError('Failed to load weather data');
        console.error('Weather fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCurrentWeather();
  }, []);

  const getWeatherIcon = (weatherCode) => {
    if (!weatherCode) return <FaCloud className="text-gray-700" size={36} />;
    
    if (weatherCode <= 3) {
      return <FaCloud className="text-gray-700" size={36} />;
    } else if (weatherCode <= 67) {
      return <FaCloud className="text-blue-500" size={36} />;
    } else {
      return <FaCloud className="text-gray-600" size={36} />;
    }
  };

  const getWeatherDescription = (weatherCode) => {
    if (!weatherCode) return "Clear sky";
    
    const descriptions = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Fog",
      48: "Depositing rime fog",
      51: "Light drizzle",
      53: "Moderate drizzle",
      55: "Dense drizzle",
      61: "Slight rain",
      63: "Moderate rain",
      65: "Heavy rain"
    };
    
    return descriptions[weatherCode] || "Broken clouds";
  };

  const formatDateTime = () => {
    const now = new Date();
    const options = { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    };
    return now.toLocaleDateString('en-US', options).replace(',', ', ');
  };

  const getWindDirection = (degrees) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  };

  if (loading) {
    return (
      <div className="bg-gray-50 rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="text-center py-8 text-gray-500">Loading current weather...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="text-center py-8 text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-100 to-gray-400 rounded-lg shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="text-orange-600">{formatDateTime()}</div>
        <div className="text-5xl font-bold text-gray-800 mt-4">Harare, ZW</div>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mt-4 p-5">
            <div className="flex lg:justify-items-center items-center mt-2">
                {getWeatherIcon(weatherData?.weather_code)}
                <span className="flex flex-1 text-5xl font-bold text-gray-800 ml-4">
                    {weatherData?.temperature_2m ? Math.round(weatherData.temperature_2m) : '--'}°C
                </span>
            </div>
            <div className="flex flex-1 items-center justify-between mt-4 lg:ml-25">
                <p className="flex justify-center items-center text-gray-800 text-2xl font-semibold ">
                    Feels like {weatherData?.apparent_temperature ? Math.round(weatherData.apparent_temperature) : '--'}°C. {getWeatherDescription(weatherData?.weather_code)}. Light breeze
                </p>
            </div>
            <div className="flex lg:flex-1 justify-center items-center text-gray-800 text-4xl font-semibold mt-4 ">
                <FaArrowUp 
                    size={18} 
                    className="mr-1" 
                    style={{ transform: `rotate(${(weatherData?.wind_direction_10m || 0) + 45}deg)` }}
                />
                <span>
                    {weatherData?.wind_speed_10m ? weatherData.wind_speed_10m.toFixed(1) : '--'}m/s {getWindDirection(weatherData?.wind_direction_10m || 0)}
                </span>
            </div>
        </div>             
        <div className="mt-2 text-gray-700">
          
          <div className="grid grid-cols-2 gap-4 mt-4">            
            <div>
              <span>{weatherData?.surface_pressure ? Math.round(weatherData.surface_pressure) : '--'}hPa</span>
            </div>
            <div>
              <span>Humidity: {weatherData?.relative_humidity_2m ? weatherData.relative_humidity_2m : '--'}%</span>
            </div>
            <div>
              <span>Dew point: {weatherData?.temperature_2m && weatherData?.relative_humidity_2m ? 
                Math.round(weatherData.temperature_2m - ((100 - weatherData.relative_humidity_2m) / 5)) : '--'}°C</span>
            </div>
            <div>
              <span>Visibility: {weatherData?.visibility ? (weatherData.visibility / 1000).toFixed(1) : '10.0'}km</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CurrentWeather;