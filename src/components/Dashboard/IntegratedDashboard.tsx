import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Thermometer, AlertTriangle, CheckCircle, Clock, MapPin } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { SensorService } from '../../services/sensorService';
import { SensorData, ProcessedSensorReading } from '../../config/supabase';
import StatusIndicator from '../Common/StatusIndicator';
import LoadingSpinner from '../Common/LoadingSpinner';
import WeatherDashboard from './WeatherDashboard';

const IntegratedDashboard: React.FC = () => {
  const { t, language } = useLanguage();
  const [sensorData, setSensorData] = useState<ProcessedSensorReading[]>([]);
  const [latestSensorReadings, setLatestSensorReadings] = useState<ProcessedSensorReading[]>([]);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lon: number; name: string } | null>(null);
  const [statusCounts, setStatusCounts] = useState({ optimal: 0, warning: 0, critical: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch all integrated data
  const fetchIntegratedData = useCallback(async () => {
    try {
      setError(null);
      
      // Fetch sensor data
      const sensors = await SensorService.getSensorData({ limit: 100 });
      setSensorData(sensors);

      // Get latest sensor readings
      const latestReadings = await SensorService.getLatestReadings();
      setLatestSensorReadings(latestReadings);

      // Calculate status counts
      const counts = latestReadings.reduce(
        (acc, reading) => {
          acc[reading.status]++;
          return acc;
        },
        { optimal: 0, warning: 0, critical: 0 }
      );
      setStatusCounts(counts);

      // Extract location from sensor data
      let location: { lat: number; lon: number; name: string } | null = null;
      if (latestReadings.length > 0) {
        const firstReading = latestReadings[0];
        if (firstReading.latitude && firstReading.longitude) {
          location = {
            lat: firstReading.latitude,
            lon: firstReading.longitude,
            name: 'Sensor Location'
          };
        }
      }
      
      // Default location if no sensor data
      if (!location) {
        location = { lat: 28.6139, lon: 77.2090, name: 'Delhi, India' };
      }
      
      setCurrentLocation(location);

      setLastUpdate(new Date());
    } catch (err) {
      console.error('Error fetching integrated data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchIntegratedData();
  }, [fetchIntegratedData]);

  // Auto refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading && !refreshing) {
        setRefreshing(true);
        fetchIntegratedData();
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [loading, refreshing, fetchIntegratedData]);

  // Manual refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchIntegratedData();
  };

  const getSensorDisplayName = (sensorType: string) => {
    const sensorNames: Record<string, string> = {
      soil_moisture: t('soilMoisture'),
      ph: t('soilHealth'),
      soil_temperature: t('temperature'),
      ec: 'EC',
      n: 'Nitrogen',
      p: 'Phosphorus',
      k: 'Potassium'
    };
    return sensorNames[sensorType] || sensorType;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-2xl p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-900 dark:text-red-400 mb-2">
            {t('error')}
          </h3>
          <p className="text-red-700 dark:text-red-300 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            {t('retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('farmStatus')}
          </h1>
          <div className="flex items-center space-x-2 mt-1">
            {lastUpdate && (
              <span className="text-sm text-gray-500">
                {t('lastChecked')}: {lastUpdate.toLocaleTimeString()}
              </span>
            )}
            {currentLocation && (
              <span className="text-sm text-gray-500 flex items-center space-x-1">
                <MapPin className="h-3 w-3" />
                <span>{currentLocation.name}</span>
              </span>
            )}
          </div>
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{t('refresh')}</span>
        </button>
      </div>

      {/* Urgency Overview - Top Priority */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-2xl p-6 text-center">
          <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-3" />
          <div className="text-4xl font-bold text-green-700 dark:text-green-400 mb-2">
            {statusCounts.optimal}
          </div>
          <p className="text-green-600 dark:text-green-400 font-medium">
            {language === 'hi' ? 'अच्छा' : 'Good'}
          </p>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-2xl p-6 text-center">
          <Clock className="h-12 w-12 text-yellow-600 dark:text-yellow-400 mx-auto mb-3" />
          <div className="text-4xl font-bold text-yellow-700 dark:text-yellow-400 mb-2">
            {statusCounts.warning}
          </div>
          <p className="text-yellow-600 dark:text-yellow-400 font-medium">
            {language === 'hi' ? 'सावधान' : 'Warning'}
          </p>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-red-600 dark:text-red-400 mx-auto mb-3" />
          <div className="text-4xl font-bold text-red-700 dark:text-red-400 mb-2">
            {statusCounts.critical}
          </div>
          <p className="text-red-600 dark:text-red-400 font-medium">
            {language === 'hi' ? 'खतरनाक' : 'Critical'}
          </p>
        </div>
      </div>

      {/* Weather Dashboard */}
      {currentLocation && (
        <WeatherDashboard 
          latitude={currentLocation.lat} 
          longitude={currentLocation.lon} 
        />
      )}

      {/* Sensor Data */}
      {latestSensorReadings.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {language === 'hi' ? 'सेंसर डेटा' : 'Sensor Data'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {latestSensorReadings.map((reading) => (
              <div key={reading.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {getSensorDisplayName(reading.sensor_type)}
                  </h3>
                  <StatusIndicator status={reading.status} size="small" showText={false} />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {reading.value}{reading.unit}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(reading.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* No Data Message */
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-8 text-center">
          <Thermometer className="h-12 w-12 text-blue-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-blue-900 dark:text-blue-400 mb-2">
            {language === 'hi' ? 'कोई डेटा उपलब्ध नहीं' : 'No Data Available'}
          </h3>
          <p className="text-blue-700 dark:text-blue-300 mb-4">
            {language === 'hi' 
              ? 'सेंसर डेटा उपलब्ध नहीं है। नमूना डेटा डालने के लिए सेटिंग्स में जाएं।'
              : 'No sensor data available. Go to Settings to insert sample data.'
            }
          </p>
          <button
            onClick={handleRefresh}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('refresh')}
          </button>
        </div>
      )}

      {/* AI Assistant Tip */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-700 rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-2">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {language === 'hi' ? 'तेज़ AI सहायक उपलब्ध है' : 'Fast AI Assistant Available'}
          </h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {language === 'hi' 
            ? 'ऊपर दाईं ओर चैट आइकन पर क्लिक करके 20 सेकंड में जवाब पाएं।'
            : 'Click the chat icon in the top right to get answers within 20 seconds.'
          }
        </p>
      </div>
    </div>
  );
};

export default IntegratedDashboard;