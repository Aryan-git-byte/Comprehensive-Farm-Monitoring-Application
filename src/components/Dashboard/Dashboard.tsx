import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Calendar, Filter, AlertCircle, TrendingUp } from 'lucide-react';
import { SensorService } from '../../services/sensorService';
import { SensorData } from '../../config/supabase';
import StatusCard from './StatusCard';
import SensorChart from './SensorChart';
import LoadingSpinner from '../Common/LoadingSpinner';

const Dashboard: React.FC = () => {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [latestReadings, setLatestReadings] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [statusCounts, setStatusCounts] = useState({ optimal: 0, warning: 0, critical: 0 });
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedSensor, setSelectedSensor] = useState<string>('all');
  const [dateRange, setDateRange] = useState(7); // days
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Get date range
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - dateRange);

      // Fetch sensor data
      const filters: any = { 
        dateRange: { start: startDate, end: endDate },
        limit: 1000 
      };
      
      if (selectedLocation !== 'all') filters.location = selectedLocation;
      if (selectedSensor !== 'all') filters.sensorType = selectedSensor;

      const [data, latest, counts] = await Promise.all([
        SensorService.getSensorData(filters),
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
  }, [selectedLocation, selectedSensor, dateRange]);

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Auto refresh every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchDashboardData();
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh, fetchDashboardData]);

  // Real-time updates
  useEffect(() => {
    const subscription = SensorService.subscribeToSensorData((payload) => {
      console.log('Real-time update:', payload);
      fetchDashboardData(); // Refresh data when changes occur
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchDashboardData]);

  // Manual refresh
  const handleRefresh = () => {
    fetchDashboardData();
  };

  // Get unique locations and sensor types for filters
  const locations = ['all', ...Array.from(new Set(latestReadings.map(r => r.sensor_location)))];
  const sensorTypes = ['all', ...Array.from(new Set(latestReadings.map(r => r.sensor_type)))];

  // Group sensor data by type for charts
  const groupedSensorData = sensorData.reduce((acc, reading) => {
    if (!acc[reading.sensor_type]) {
      acc[reading.sensor_type] = [];
    }
    acc[reading.sensor_type].push(reading);
    return acc;
  }, {} as Record<string, SensorData[]>);

  // Calculate trend for each reading (simplified)
  const calculateTrend = (readings: SensorData[], currentReading: SensorData): 'up' | 'down' | 'stable' => {
    const sameTypeLocation = readings.filter(r => 
      r.sensor_type === currentReading.sensor_type && 
      r.sensor_location === currentReading.sensor_location
    ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    if (sameTypeLocation.length < 2) return 'stable';
    
    const current = sameTypeLocation[0].value;
    const previous = sameTypeLocation[1].value;
    const threshold = current * 0.05; // 5% threshold
    
    if (current > previous + threshold) return 'up';
    if (current < previous - threshold) return 'down';
    return 'stable';
  };

  if (loading && sensorData.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Farm Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Real-time monitoring of your farm's vital signs
            {lastUpdate && (
              <span className="ml-2 text-sm">
                • Last updated: {lastUpdate.toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Refresh dashboard data"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          
          <label className="flex items-center space-x-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded"
            />
            <span>Auto-refresh</span>
          </label>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Optimal Systems</p>
              <p className="text-3xl font-bold text-green-700">{statusCounts.optimal}</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">Warning Systems</p>
              <p className="text-3xl font-bold text-yellow-700">{statusCounts.warning}</p>
            </div>
            <div className="bg-yellow-100 rounded-full p-3">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">Critical Systems</p>
              <p className="text-3xl font-bold text-red-700">{statusCounts.critical}</p>
            </div>
            <div className="bg-red-100 rounded-full p-3">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <label className="text-sm font-medium text-gray-700">Filters:</label>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              {locations.map(location => (
                <option key={location} value={location}>
                  {location === 'all' ? 'All Locations' : location}
                </option>
              ))}
            </select>

            <select
              value={selectedSensor}
              onChange={(e) => setSelectedSensor(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              {sensorTypes.map(sensor => (
                <option key={sensor} value={sensor}>
                  {sensor === 'all' ? 'All Sensors' : sensor.charAt(0).toUpperCase() + sensor.slice(1)}
                </option>
              ))}
            </select>

            <select
              value={dateRange}
              onChange={(e) => setDateRange(Number(e.target.value))}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value={1}>Last 24 Hours</option>
              <option value={7}>Last 7 Days</option>
              <option value={30}>Last 30 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Latest Readings */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {latestReadings.map((reading) => (
            <StatusCard
              key={`${reading.sensor_type}-${reading.sensor_location}`}
              title={reading.sensor_type.charAt(0).toUpperCase() + reading.sensor_type.slice(1)}
              value={reading.value.toString()}
              unit={reading.unit}
              status={reading.status}
              trend={calculateTrend(sensorData, reading)}
              location={reading.sensor_location}
              timestamp={reading.timestamp}
            />
          ))}
        </div>
      </div>

      {/* Charts */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Historical Trends</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.entries(groupedSensorData).map(([sensorType, data]) => (
            <SensorChart
              key={sensorType}
              data={data}
              title={`${sensorType.charAt(0).toUpperCase() + sensorType.slice(1)} Levels`}
              sensorType={sensorType}
              height={300}
            />
          ))}
        </div>
      </div>

      {sensorData.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
          <Calendar className="h-12 w-12 text-blue-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-blue-900 mb-2">No Data Available</h3>
          <p className="text-blue-700 mb-4">
            No sensor data found for the selected filters. Try adjusting your filter criteria or check back later.
          </p>
          <button
            onClick={handleRefresh}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh Data
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;