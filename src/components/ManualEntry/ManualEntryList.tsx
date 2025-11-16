import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, FileText, Edit, Trash2, Filter } from 'lucide-react';
import { ManualEntryService } from '../../services/manualEntryService';
import { ManualEntry } from '../../config/supabase';
import { useLanguage } from '../../contexts/LanguageContext';
import LoadingSpinner from '../Common/LoadingSpinner';
import { formatDateTime } from '../../utils/dateUtils';

interface ManualEntryListProps {
  refreshTrigger?: number;
}

const ManualEntryList: React.FC<ManualEntryListProps> = ({ refreshTrigger }) => {
  const { t } = useLanguage();
  const [entries, setEntries] = useState<ManualEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>('all');

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const filters = selectedType !== 'all' ? { entryType: selectedType } : undefined;
      const data = await ManualEntryService.getManualEntries(filters);
      setEntries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load entries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [selectedType, refreshTrigger]);

  const getEntryTypeColor = (type: ManualEntry['entry_type']) => {
    const colors = {
      water_quality: 'bg-blue-100 text-blue-800',
      fertilizer: 'bg-green-100 text-green-800',
      weather: 'bg-yellow-100 text-yellow-800',
      custom: 'bg-gray-100 text-gray-800'
    };
    return colors[type] || colors.custom;
  };

  const renderEntryData = (data: Record<string, any>, entryType: ManualEntry['entry_type']) => {
    if (!data || Object.keys(data).length === 0) return null;

    return (
      <div className="mt-3 space-y-1">
        {Object.entries(data).map(([key, value]) => {
          if (!value && value !== 0) return null;
          
          const displayKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          
          return (
            <div key={key} className="flex justify-between text-sm">
              <span className="text-gray-600">{displayKey}:</span>
              <span className="text-gray-900 font-medium">{value}</span>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <label className="text-sm font-medium text-gray-700">Filter by type:</label>
          </div>
          
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="all">{t('allTypes')}</option>
            <option value="water_quality">{t('waterQuality')}</option>
            <option value="fertilizer">{t('fertilizer')}</option>
            <option value="weather">{t('weather')}</option>
            <option value="custom">{t('custom')}</option>
          </select>
        </div>
      </div>

      {/* Entries List */}
      {entries.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('noEntriesFound')}</h3>
          <p className="text-gray-600">
            {selectedType === 'all' 
              ? t('noEntriesDesc')
              : `${selectedType.replace('_', ' ')} ${t('noEntriesForType')}`
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEntryTypeColor(entry.entry_type)}`}
                    >
                      {entry.entry_type.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {entry.title}
                  </h3>
                  
                  {entry.description && (
                    <p className="text-gray-600 mb-3">
                      {entry.description}
                    </p>
                  )}
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{entry.location}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDateTime(entry.timestamp)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {/* Edit functionality would go here */}}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    aria-label="Edit entry"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => {/* Delete functionality would go here */}}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    aria-label="Delete entry"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {renderEntryData(entry.data, entry.entry_type)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManualEntryList;