import React from 'react';
import { Calendar, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import StatusIndicator from './StatusIndicator';
import { formatDate, isToday, isYesterday } from '../../utils/dateUtils';

interface ComparisonCardProps {
  title: string;
  currentStatus: 'optimal' | 'warning' | 'critical';
  previousStatus: 'optimal' | 'warning' | 'critical';
  previousDate: string;
  location: string;
  trend?: 'improving' | 'declining' | 'stable';
  className?: string;
}

const ComparisonCard: React.FC<ComparisonCardProps> = ({
  title,
  currentStatus,
  previousStatus,
  previousDate,
  location,
  trend,
  className = ''
}) => {
  const { t } = useLanguage();

  const getTrendIcon = () => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'declining':
        return <TrendingDown className="h-5 w-5 text-red-500" />;
      default:
        return <Minus className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTrendText = () => {
    switch (trend) {
      case 'improving':
        return t('improving');
      case 'declining':
        return t('declining');
      default:
        return t('stable');
    }
  };

  const formatDateForDisplay = (dateString: string) => {
    const date = new Date(dateString);
    
    if (isToday(date)) {
      return t('today');
    } else if (isYesterday(date)) {
      return t('yesterday');
    } else {
      return formatDate(date);
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
        {trend && (
          <div className="flex items-center space-x-1">
            {getTrendIcon()}
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {getTrendText()}
            </span>
          </div>
        )}
      </div>

      {/* Current Status */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {t('today')}:
        </p>
        <StatusIndicator status={currentStatus} size="large" />
      </div>

      {/* Comparison */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="flex items-center space-x-2 mb-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {formatDateForDisplay(previousDate)} {t('comparisonYesterday')}:
          </p>
        </div>
        <StatusIndicator status={previousStatus} size="medium" />
      </div>

      {/* Location */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {t('location')}: {location}
        </p>
      </div>
    </div>
  );
};

export default ComparisonCard;