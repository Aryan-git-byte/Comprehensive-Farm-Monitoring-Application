import React, { useState, useEffect } from 'react';
import { Cloud, Thermometer, Droplets, Wind, Eye, Calendar, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { WeatherService, WeatherData, WeatherForecast } from '../../services/weatherService';
import LoadingSpinner from '../Common/LoadingSpinner';

interface WeatherDashboardProps {
  latitude: number;
  longitude: number;
}

const WeatherDashboard: React.FC<WeatherDashboardProps> = ({ latitude, longitude }) => {
  const { t, language } = useLanguage();
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<WeatherForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWeatherData();
  }, [latitude, longitude]);

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [weather, forecastData] = await Promise.all([
        WeatherService.getCurrentWeather(latitude, longitude),
        WeatherService.getWeatherForecast(latitude, longitude)
      ]);

      setCurrentWeather(weather);
      setForecast(forecastData);
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition: string) => {
    return WeatherService.getWeatherIcon(condition);
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-center h-32">
          <LoadingSpinner size="medium" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-center h-32 text-center">
          <div>
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Cloud className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {t('currentWeather')}
        </h2>
      </div>

      {currentWeather && (
        <div className="space-y-6">
          {/* Current Weather */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">
                  {getWeatherIcon(currentWeather.weather_condition)}
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {currentWeather.temperature}°C
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 capitalize">
                    {currentWeather.weather_description}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-500">
                    {currentWeather.location}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {t('humidity')}
                  </span>
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {currentWeather.humidity}%
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <Wind className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {t('windSpeed')}
                  </span>
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {currentWeather.wind_speed} km/h
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <Thermometer className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Pressure
                  </span>
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {currentWeather.pressure} hPa
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <Eye className="h-4 w-4 text-purple-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {t('visibility')}
                  </span>
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {currentWeather.visibility} km
                </div>
              </div>
            </div>
          </div>

          {/* 5-Day Forecast */}
          {forecast.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>{t('weatherForecast')}</span>
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {forecast.map((day, index) => (
                  <div key={day.date} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {index === 0 ? t('today') : new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
                    </div>
                    <div className="text-2xl mb-2">
                      {getWeatherIcon(day.weather_condition)}
                    </div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {day.temperature_max}°/{day.temperature_min}°
                    </div>
                    {day.rainfall > 0 && (
                      <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        {day.rainfall}mm
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WeatherDashboard;