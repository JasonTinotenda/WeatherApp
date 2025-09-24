import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const HourlyForecast = () => {
  const [hourlyData, setHourlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleDataPoints, setVisibleDataPoints] = useState(9);

  useEffect(() => {
    async function fetchHourlyWeather() {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=-17.875&longitude=30.875&hourly=temperature_2m,precipitation_probability,wind_speed_10m,weather_code&timezone=Europe%2FLondon&forecast_days=1`
        );
        
        if (!response.ok) {
          throw new Error('Weather data fetch failed');
        }
        
        const data = await response.json();
        
        const currentHour = new Date().getHours();
        const hourlySlice = data.hourly.time.slice(currentHour, currentHour + 9);
        
        const transformedData = hourlySlice.map((time, index) => {
          const date = new Date(time);
          const hour = date.getHours();
          const actualIndex = currentHour + index;
          
          let timeDisplay;
          if (index === 0) {
            timeDisplay = 'Now';
          } else if (hour === 0 && index > 0) {
            timeDisplay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          } else {
            timeDisplay = date.toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              hour12: true 
            });
          }

          return {
            time: timeDisplay,
            temp: Math.round(data.hourly.temperature_2m[actualIndex] || 0),
            precipitation: data.hourly.precipitation_probability[actualIndex] || 0,
            windSpeed: `${(data.hourly.wind_speed_10m[actualIndex] || 0).toFixed(1)}m/s`,
            conditions: getWeatherDescription(data.hourly.weather_code[actualIndex] || 0),
          };
        });
        
        setHourlyData(transformedData);
        setError(null);
      } catch (err) {
        setError('Failed to load hourly weather data');
        console.error('Hourly weather fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchHourlyWeather();
  }, []);

  useEffect(() => {
    const updateVisibleDataPoints = () => {
      const width = window.innerWidth;
      if (width < 480) {
        setVisibleDataPoints(4);
      } else if (width < 640) {
        setVisibleDataPoints(4); 
      } else if (width < 768) {
        setVisibleDataPoints(5); 
      } else if (width < 1024) {
        setVisibleDataPoints(6);
      } else {
        setVisibleDataPoints(8); 
      }
    };

    updateVisibleDataPoints();
    window.addEventListener('resize', updateVisibleDataPoints);
    
    return () => window.removeEventListener('resize', updateVisibleDataPoints);
  }, []);

  const getWeatherDescription = (weatherCode) => {
    const descriptions = {
      0: "clear sky",
      1: "mainly clear",
      2: "partly cloudy",
      3: "overcast",
      45: "fog",
      48: "depositing rime fog",
      51: "light drizzle",
      53: "moderate drizzle",
      55: "dense drizzle",
      61: "slight rain",
      63: "moderate rain",
      65: "heavy rain",
      71: "slight snow",
      73: "moderate snow",
      75: "heavy snow",
      77: "snow grains",
      80: "slight rain showers",
      81: "moderate rain showers",
      82: "violent rain showers",
      85: "slight snow showers",
      86: "heavy snow showers"
    };
    
    return descriptions[weatherCode] || "scattered clouds";
  };

  const getYAxisDomain = () => {
    if (hourlyData.length === 0) return [5, 20];
    
    const temps = hourlyData.slice(0, visibleDataPoints).map(d => d.temp);
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);
    const padding = 2;
    
    return [minTemp - padding, maxTemp + padding];
  };

  const displayData = hourlyData.slice(0, visibleDataPoints);

  if (loading) {
    return (
      <div className="bg-gray-50 rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Hourly forecast
        </h2>
        <div className="text-center py-8 text-gray-500">Loading hourly forecast...</div>
      </div>
    );
  }

  if (error && hourlyData.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Hourly forecast
        </h2>
        <div className="text-center py-8 text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-400 to-gray-100 rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Hourly forecast
      </h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={displayData}
            margin={{
              top: 20,
              right: 20,
              left: 0,
              bottom: 0,
            }}
          >
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 12,
              }}
            />
            <YAxis
              domain={getYAxisDomain()}
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 12,
              }}
              tickFormatter={(value) => `${value}°`}
            />
            <Line
              type="monotone"
              dataKey="temp"
              stroke="#f97316"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div 
        className="grid gap-1 mt-2 text-center text-xs text-gray-600"
        style={{ gridTemplateColumns: `repeat(${visibleDataPoints}, minmax(0, 1fr))` }}
      >
        {displayData.map((hour, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="mt-2 font-bold">{hour.temp}°C</div>
            <div className="mt-2">{hour.windSpeed}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HourlyForecast;