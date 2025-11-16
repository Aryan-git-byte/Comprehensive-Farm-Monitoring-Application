import React, { useEffect, useRef } from 'react';
import { Chart, ChartConfiguration, ChartOptions } from 'chart.js';
import { SensorData } from '../../config/supabase';
import 'chartjs-adapter-date-fns';


// Import Chart.js components
import {
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler
} from 'chart.js';

// Register Chart.js components
Chart.register(
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler
);

interface SensorChartProps {
  data: SensorData[];
  title: string;
  sensorType: string;
  height?: number;
  className?: string;
}

const SensorChart: React.FC<SensorChartProps> = ({
  data,
  title,
  sensorType,
  height = 300,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !data.length) return;

    // Destroy existing chart
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Sort data by timestamp
    const sortedData = [...data].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    // Group data by location
    const locationGroups = sortedData.reduce((acc, reading) => {
      if (!acc[reading.sensor_location]) {
        acc[reading.sensor_location] = [];
      }
      acc[reading.sensor_location].push(reading);
      return acc;
    }, {} as Record<string, SensorData[]>);

    // Colors for different locations
    const colors = [
      { bg: 'rgba(34, 197, 94, 0.1)', border: 'rgb(34, 197, 94)' },
      { bg: 'rgba(59, 130, 246, 0.1)', border: 'rgb(59, 130, 246)' },
      { bg: 'rgba(249, 115, 22, 0.1)', border: 'rgb(249, 115, 22)' },
      { bg: 'rgba(168, 85, 247, 0.1)', border: 'rgb(168, 85, 247)' }
    ];

    // Create datasets for each location
    const datasets = Object.keys(locationGroups).map((location, index) => {
      const locationData = locationGroups[location];
      const color = colors[index % colors.length];

      return {
        label: location,
        data: locationData.map(reading => ({
          x: reading.timestamp,
          y: reading.value
        })),
        backgroundColor: color.bg,
        borderColor: color.border,
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: color.border,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      };
    });

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'time',
            time: {
              displayFormats: {
                hour: 'MMM dd HH:mm',
                day: 'MMM dd'
              }
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            },
            ticks: {
              color: 'rgb(75, 85, 99)',
              maxTicksLimit: 6
            }
          },
          y: {
            beginAtZero: false,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            },
            ticks: {
              color: 'rgb(75, 85, 99)',
              callback: function(value) {
                const unit = data[0]?.unit || '';
                return `${value}${unit}`;
              }
            }
          }
        },
        plugins: {
          title: {
            display: true,
            text: title,
            font: {
              size: 16,
              weight: 'bold'
            },
            color: 'rgb(17, 24, 39)',
            padding: 20
          },
          legend: {
            position: 'top',
            labels: {
              color: 'rgb(75, 85, 99)',
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 15
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: 'white',
            bodyColor: 'white',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            callbacks: {
              label: function(context) {
                const unit = data[0]?.unit || '';
                return `${context.dataset.label}: ${context.parsed.y}${unit}`;
              },
              title: function(context) {
                const date = new Date(context[0].parsed.x);
                return date.toLocaleString();
              }
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        },
        elements: {
          point: {
            hoverBorderWidth: 3
          }
        }
      } as ChartOptions
    };

    chartRef.current = new Chart(ctx, config);

    // Cleanup function
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data, title, sensorType]);

  if (!data.length) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">No data available for {title}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
      <div style={{ height: `${height}px` }}>
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          aria-label={`Chart showing ${title} over time`}
        />
      </div>
    </div>
  );
};

export default SensorChart;