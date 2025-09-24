import { useState, useEffect } from 'react';
import { FaSun, FaCloud, FaCloudRain } from 'react-icons/fa';

function getWeatherIcon(temp) {
  if (temp > 25) {
    return <FaSun className="text-yellow-500" />;
  } else if (temp > 15) {
    return <FaCloud className="text-gray-400" />;
  } else {
    return <FaCloudRain className="text-blue-500" />;
  }
}

function getConditions(temp) {
  if (temp > 25) return "Sunny";
  else if (temp > 15) return "Partly Cloudy";
  else return "Cool";
}

const DailyWeather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchWeatherData() {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=-17.875&longitude=30.875&daily=temperature_2m_max,temperature_2m_min&timezone=GMT`
        );
        
        if (!response.ok) {
          throw new Error('Weather data fetch failed');
        }
        
        const data = await response.json();

        const transformedData = data.daily.time.map((date, index) => ({
          day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
          date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          high: Math.round(data.daily.temperature_2m_max[index]),
          low: Math.round(data.daily.temperature_2m_min[index]),
          temp: data.daily.temperature_2m_max[index] 
        }));
        
        setWeatherData(transformedData);
        setError(null);
      } catch (err) {
        setError('Failed to load weather data');
        console.error('Weather fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchWeatherData();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-50 rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          7-day forecast
        </h2>
        <div className="text-center py-8 text-gray-500">Loading weather data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          7-day forecast
        </h2>
        <div className="text-center py-8 text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-gray-400 to-gray-100 rounded-lg shadow-sm p-6 mt-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">
        7-day forecast
      </h2>
      <div className="space-y-4">
        {weatherData?.map((day, index) => (
          <div
            key={index + 1}
            className="flex items-center justify-between py-2 border-b border-gray-600 last:border-0"
          >
            <div className="w-1/4">
              <div className="font-medium text-gray-900">
                {day.day}, {day.date}
              </div>
            </div>
            <div className="w-1/12 flex justify-center text-gray-900">
              {getWeatherIcon(day.temp)}
            </div>
            <div className="w-1/4 text-center font-medium text-gray-900">
              {day.high}° / {day.low}°C
            </div>
            <div className="w-1/3 text-right text-gray-900 text-sm">
              {getConditions(day.temp)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyWeather;