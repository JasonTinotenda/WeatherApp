import CurrentWeather from "./CurrentWeather";
import HourlyWeather from "./HourlyWeather";
import DailyWeather from "./DailyWeather";

const WeatherDashboard = () => {
  return (
    <div className="min-h-screenp-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        <CurrentWeather className="w-full" />
        <div className="sm:hidden md:hidden lg:grid lg:grid-cols-2 gap-4 sm:gap-6">
          <HourlyWeather className="w-full" />
          <DailyWeather className="w-full" />
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard;