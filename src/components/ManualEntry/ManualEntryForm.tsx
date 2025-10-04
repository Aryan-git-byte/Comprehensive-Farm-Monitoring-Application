import React, { useState } from 'react';
import { Save, X, MapPin, Calendar, FileText } from 'lucide-react';
import { ManualEntryService } from '../../services/manualEntryService';
import { ManualEntry } from '../../config/supabase';

interface ManualEntryFormProps {
  onSuccess?: (entry: ManualEntry) => void;
  onCancel?: () => void;
}

const ManualEntryForm: React.FC<ManualEntryFormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    entry_type: 'custom' as ManualEntry['entry_type'],
    title: '',
    description: '',
    location: '',
    data: {} as Record<string, any>
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form fields for different entry types
  const entryTypeFields = {
    water_quality: [
      { key: 'ph_level', label: 'pH Level', type: 'number', min: 0, max: 14, step: 0.1, required: true },
      { key: 'dissolved_oxygen', label: 'Dissolved Oxygen (ppm)', type: 'number', min: 0, step: 0.1, required: true },
      { key: 'turbidity', label: 'Turbidity (NTU)', type: 'number', min: 0, step: 0.1, required: false },
      { key: 'temperature', label: 'Water Temperature (°C)', type: 'number', step: 0.1, required: false },
      { key: 'conductivity', label: 'Electrical Conductivity (μS/cm)', type: 'number', min: 0, required: false }
    ],
    fertilizer: [
      { key: 'fertilizer_type', label: 'Fertilizer Type', type: 'select', options: ['Nitrogen', 'Phosphorus', 'Potassium', 'NPK Blend', 'Organic Compost', 'Other'], required: true },
      { key: 'application_rate', label: 'Application Rate (kg/hectare)', type: 'number', min: 0, step: 0.1, required: true },
      { key: 'application_method', label: 'Application Method', type: 'select', options: ['Broadcasting', 'Side Dressing', 'Foliar Spray', 'Fertigation', 'Other'], required: true },
      { key: 'area_covered', label: 'Area Covered (hectares)', type: 'number', min: 0, step: 0.01, required: true },
      { key: 'weather_conditions', label: 'Weather Conditions', type: 'text', required: false },
      { key: 'notes', label: 'Additional Notes', type: 'textarea', required: false }
    ],
    weather: [
      { key: 'temperature', label: 'Temperature (°C)', type: 'number', step: 0.1, required: true },
      { key: 'humidity', label: 'Humidity (%)', type: 'number', min: 0, max: 100, step: 1, required: true },
      { key: 'precipitation', label: 'Precipitation (mm)', type: 'number', min: 0, step: 0.1, required: false },
      { key: 'wind_speed', label: 'Wind Speed (km/h)', type: 'number', min: 0, step: 0.1, required: false },
      { key: 'wind_direction', label: 'Wind Direction', type: 'select', options: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'], required: false },
      { key: 'cloud_cover', label: 'Cloud Cover (%)', type: 'number', min: 0, max: 100, step: 5, required: false },
      { key: 'visibility', label: 'Visibility (km)', type: 'number', min: 0, step: 0.1, required: false }
    ],
    custom: [
      { key: 'custom_field_1', label: 'Custom Field 1', type: 'text', required: false },
      { key: 'custom_field_2', label: 'Custom Field 2', type: 'number', required: false },
      { key: 'custom_field_3', label: 'Custom Field 3', type: 'textarea', required: false }
    ]
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        throw new Error('Title is required');
      }
      if (!formData.location.trim()) {
        throw new Error('Location is required');
      }

      const entry = await ManualEntryService.addManualEntry(formData);
      setSuccess(true);
      
      // Reset form
      setFormData({
        entry_type: 'custom',
        title: '',
        description: '',
        location: '',
        data: {}
      });

      if (onSuccess) {
        onSuccess(entry);
      }

      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [key]: value
      }
    }));
  };

  const renderField = (field: any) => {
    const value = formData.data[field.key] || '';

    switch (field.type) {
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            required={field.required}
            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Select {field.label}</option>
            {field.options?.map((option: string) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            required={field.required}
            rows={3}
            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        );
      
      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleFieldChange(field.key, e.target.value ? Number(e.target.value) : '')}
            required={field.required}
            min={field.min}
            max={field.max}
            step={field.step}
            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        );
      
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            required={field.required}
            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('manualEntry')}</h1>
        <p className="text-gray-600 mt-2">
          {t('recordObservations')}
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FileText className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-green-800 font-medium">{t('entrySaved')}</p>
              <p className="text-green-700 text-sm">{t('entrySavedDesc')}</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-red-800 font-medium">{t('errorSavingEntry')}</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('entryType')} *
              </label>
              <select
                value={formData.entry_type}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  entry_type: e.target.value as ManualEntry['entry_type'],
                  data: {} // Reset data when changing type
                }))}
                required
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="custom">{t('customEntry')}</option>
                <option value="water_quality">{t('waterQualityEntry')}</option>
                <option value="fertilizer">{t('fertilizerApplication')}</option>
                <option value="weather">{t('weatherObservation')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                <MapPin className="inline h-4 w-4 mr-1" />
                Location *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                required
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder={t('location')}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                <FileText className="inline h-4 w-4 mr-1" />
                {t('title')} *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder={t('title')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('description')}
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder={t('optionalDescription')}
              />
            </div>
          </div>

          {/* Dynamic Fields Based on Entry Type */}
          {entryTypeFields[formData.entry_type].length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {formData.entry_type === 'custom' ? t('custom') : 
                 formData.entry_type === 'water_quality' ? t('waterQuality') :
                 formData.entry_type === 'fertilizer' ? t('fertilizer') :
                 formData.entry_type === 'weather' ? t('weather') : t('custom')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {entryTypeFields[formData.entry_type].map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-gray-700">
                      {field.label} {field.required && '*'}
                    </label>
                    {renderField(field)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <X className="inline h-4 w-4 mr-1" />
              {t('cancel')}
            </button>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            <Save className="h-4 w-4 mr-1" />
            {loading ? t('saving') : t('saveEntry')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManualEntryForm;