import React from 'react';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { formatDateTime } from '../../utils/dateUtils';

interface StatusCardProps {
  title: string;
  value: string;
  unit?: string;
  status: 'optimal' | 'warning' | 'critical';
  trend?: 'up' | 'down' | 'stable';
  location: string;
  timestamp: string;
  className?: string;
}

const StatusCard: React.FC<StatusCardProps> = ({
  title,
  value,
  unit,
  status,
  trend,
  location,
  timestamp,
  className = ''
}) => {
  const statusConfig = {
    optimal: {
      color: 'text-green-700',
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: CheckCircle,
      iconColor: 'text-green-600'
    },
    warning: {
      color: 'text-yellow-700',
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: AlertTriangle,
      iconColor: 'text-yellow-600'
    },
    critical: {
      color: 'text-red-700',
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: XCircle,
      iconColor: 'text-red-600'
    }
  };

  const trendConfig = {
    up: { icon: TrendingUp, color: 'text-green-500' },
    down: { icon: TrendingDown, color: 'text-red-500' },
    stable: { icon: Minus, color: 'text-gray-500' }
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;
  const TrendIcon = trend ? trendConfig[trend].icon : null;

  return (
    <div className={`${config.bg} ${config.border} border-2 rounded-xl p-6 shadow-sm transition-all duration-300 hover:shadow-md ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <StatusIcon className={`h-5 w-5 ${config.iconColor}`} />
            <h3 className={`font-semibold ${config.color}`}>{title}</h3>
          </div>
          
          <div className="flex items-baseline space-x-1 mb-3">
            <span className={`text-3xl font-bold ${config.color}`}>{value}</span>
            {unit && <span className={`text-lg ${config.color} opacity-75`}>{unit}</span>}
            {TrendIcon && (
              <TrendIcon className={`h-5 w-5 ml-2 ${trendConfig[trend!].color}`} />
            )}
          </div>
          
          <div className="space-y-1">
            <p className={`text-sm ${config.color} opacity-75`}>Location: {location}</p>
            <p className={`text-xs ${config.color} opacity-60`}>
              Updated: {formatDateTime(timestamp)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusCard;