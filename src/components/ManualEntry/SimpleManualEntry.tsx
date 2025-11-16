import React, { useState } from 'react';
import { Save, MapPin, FileText, Droplets, Leaf, Cloud, Plus } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { ManualEntryService } from '../../services/manualEntryService';
import { ManualEntry } from '../../config/supabase';
import StatusIndicator from '../Common/StatusIndicator';

const SimpleManualEntry: React.FC = () => {
  const { t } = useLanguage();
  const [selectedType, setSelectedType] = useState<ManualEntry['entry_type'] | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    notes: '',
    status: 'optimal' as 'optimal' | 'warning' | 'critical'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const entryTypes = [
    {
      type: 'water_quality' as const,
      title: t('waterQuality'),
      icon: Droplets,
      color: 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-400'
    },
    {
      type: 'fertilizer' as const,
      title: t('fertilizer'),
      icon: Leaf,
      color: 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-700 dark:text-green-400'
    },
    {
      type: 'weather' as const,
      title: t('weather'),
      icon: Cloud,
      color: 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-400'
    },
    {
      type: 'custom' as const,
      title: t('custom'),
      icon: Plus,
      color: 'bg-gray-100 dark:bg-gray-900/30 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-400'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType) return;

    setLoading(true);
    setError(null);

    try {
      if (!formData.title.trim()) {
        throw new Error('Title is required');
      }
      if (!formData.location.trim()) {
        throw new Error('Location is required');
      }

      await ManualEntryService.addManualEntry({
        entry_type: selectedType,
        title: formData.title,
        description: formData.notes,
        latitude: 28.6139, // Default location for MVP
        longitude: 77.2090,
        data: { status: formData.status }
      });

      setSuccess(true);
      setFormData({ title: '', location: '', notes: '', status: 'optimal' });
      setSelectedType(null);

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setSelectedType(null);
    setError(null);
  };

  if (!selectedType) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('addNewData')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {t('selectDataType')}
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-2xl p-6">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <FileText className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <p className="text-green-800 dark:text-green-400 font-medium text-lg">
                  {t('success')}!
                </p>
                <p className="text-green-700 dark:text-green-300">
                  Your data has been saved successfully
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Entry Type Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {entryTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.type}
                onClick={() => setSelectedType(type.type)}
                className={`p-8 rounded-2xl border-2 transition-all duration-200 hover:shadow-lg ${type.color}`}
              >
                <div className="text-center">
                  <Icon className="h-16 w-16 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{type.title}</h3>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const selectedTypeConfig = entryTypes.find(t => t.type === selectedType)!;
  const Icon = selectedTypeConfig.icon;

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl border-2 mb-4 ${selectedTypeConfig.color}`}>
          <Icon className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {selectedTypeConfig.title}
        </h1>
        <button
          onClick={handleBack}
          className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium"
        >
          ← {t('selectDataType')}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-2xl p-4">
          <p className="text-red-700 dark:text-red-400 text-center">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-lg font-medium text-gray-900 dark:text-white mb-3">
              <FileText className="inline h-5 w-5 mr-2" />
              What did you observe? *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
              className="w-full text-lg border-2 border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
              placeholder="e.g., Applied fertilizer, Checked water level"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-lg font-medium text-gray-900 dark:text-white mb-3">
              <MapPin className="inline h-5 w-5 mr-2" />
              Location *
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              required
              className="w-full text-lg border-2 border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
              placeholder="e.g., Field A, Greenhouse 1"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-lg font-medium text-gray-900 dark:text-white mb-3">
              How does it look?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(['optimal', 'warning', 'critical'] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, status }))}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.status === status
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/30'
                      : 'border-gray-300 dark:border-gray-600 hover:border-green-300'
                  }`}
                >
                  <StatusIndicator status={status} size="medium" />
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-lg font-medium text-gray-900 dark:text-white mb-3">
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={4}
              className="w-full text-lg border-2 border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
              placeholder="Additional details about your observation..."
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-4 px-6 rounded-xl font-medium text-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
        >
          <Save className="h-5 w-5" />
          <span>{loading ? t('saving') : t('save')}</span>
        </button>
      </form>
    </div>
  );
};

export default SimpleManualEntry;