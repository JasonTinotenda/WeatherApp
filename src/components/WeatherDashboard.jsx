import CurrentWeather from "./CurrentWeather";
import HourlyWeather from "./HourlyWeather";
import DailyWeather from "./DailyWeather";

const WeatherDashboard = () => {
  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        <CurrentWeather className="w-full" />
        <div className="lg:grid lg:grid-cols-2 gap-4 flex flex-col">
          <HourlyWeather className="w-full" />
          <DailyWeather className="w-full mt-4" />
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard;