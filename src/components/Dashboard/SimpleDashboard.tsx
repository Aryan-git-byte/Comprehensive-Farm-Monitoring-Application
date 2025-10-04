import React, { useState, useEffect } from 'react';
import { RefreshCw, Calendar } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { SensorService } from '../../services/sensorService';
import { SensorData } from '../../config/supabase';
import StatusIndicator from '../Common/StatusIndicator';
import ComparisonCard from '../Common/ComparisonCard';
import LoadingSpinner from '../Common/LoadingSpinner';

const SimpleDashboard: React.FC = () => {
  const { t } = useLanguage();
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [latestReadings, setLatestReadings] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [statusCounts, setStatusCounts] = useState({ optimal: 0, warning: 0, critical: 0 });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);

      const [data, latest, counts] = await Promise.all([
        SensorService.getSensorData({ 
          dateRange: { start: startDate, end: endDate },
          limit: 1000 
        }),
        SensorService.getLatestReadings(),
        SensorService.getStatusCounts()
      ]);

      setSensorData(data);
      setLatestReadings(latest);
      setStatusCounts(counts);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Auto refresh every 60 seconds
    const interval = setInterval(fetchDashboardData, 60000);
    return () => clearInterval(interval);
  }, []);

  const getSensorDisplayName = (sensorType: string) => {
    const sensorNames: Record<string, string> = {
      moisture: t('soilMoisture'),
      ph: t('soilHealth'),
      temperature: t('temperature'),
      humidity: t('humidity'),
      nitrogen: t('soilHealth'),
      phosphorus: t('soilHealth'),
      potassium: t('soilHealth')
    };
    return sensorNames[sensorType] || sensorType;
  };

  const getPreviousReading = (currentReading: SensorData): SensorData | null => {
    const sameTypeLocation = sensorData
      .filter(r => 
        r.sensor_type === currentReading.sensor_type && 
        r.sensor_location === currentReading.sensor_location &&
        r.id !== currentReading.id
      )
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return sameTypeLocation[0] || null;
  };

  const getTrend = (current: SensorData, previous: SensorData | null): 'improving' | 'declining' | 'stable' => {
    if (!previous) return 'stable';
    
    const statusOrder = { critical: 0, warning: 1, optimal: 2 };
    const currentScore = statusOrder[current.status];
    const previousScore = statusOrder[previous.status];
    
    if (currentScore > previousScore) return 'improving';
    if (currentScore < previousScore) return 'declining';
    return 'stable';
  };

  if (loading && sensorData.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('todayStatus')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {lastUpdate && (
            <>
              {t('lastChecked')}: {lastUpdate.toLocaleTimeString()}
            </>
          )}
        </p>
      </div>

      {/* Overall Status Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-2xl p-6 text-center">
          <div className="text-3xl font-bold text-green-700 dark:text-green-400 mb-2">
            {statusCounts.optimal}
          </div>
          <p className="text-green-600 dark:text-green-400 font-medium">
            {t('goodConditions')}
          </p>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-2xl p-6 text-center">
          <div className="text-3xl font-bold text-yellow-700 dark:text-yellow-400 mb-2">
            {statusCounts.warning}
          </div>
          <p className="text-yellow-600 dark:text-yellow-400 font-medium">
            {t('needsAttention')}
          </p>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-6 text-center">
          <div className="text-3xl font-bold text-red-700 dark:text-red-400 mb-2">
            {statusCounts.critical}
          </div>
          <p className="text-red-600 dark:text-red-400 font-medium">
            {t('urgentAction')}
          </p>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="text-center">
        <button
          onClick={fetchDashboardData}
          disabled={loading}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg font-medium"
        >
          <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          <span>{t('refresh')}</span>
        </button>
      </div>

      {/* Sensor Status Cards */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
          {t('farmStatus')}
        </h2>
        
        {latestReadings.length === 0 ? (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-8 text-center">
            <Calendar className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-blue-900 dark:text-blue-400 mb-2">
              No Data Available
            </h3>
            <p className="text-blue-700 dark:text-blue-300 mb-4">
              No sensor data found. Please check back later or add some sample data.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {latestReadings.map((reading) => {
              const previousReading = getPreviousReading(reading);
              const trend = getTrend(reading, previousReading);
              
              return (
                <ComparisonCard
                  key={`${reading.sensor_type}-${reading.sensor_location}`}
                  title={getSensorDisplayName(reading.sensor_type)}
                  currentStatus={reading.status}
                  previousStatus={previousReading?.status || reading.status}
                  previousDate={previousReading?.timestamp || reading.timestamp}
                  location={reading.sensor_location}
                  trend={trend}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleDashboard;