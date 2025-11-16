import React, { useState } from 'react';
import { FileText, Search, Download, ExternalLink, AlertCircle } from 'lucide-react';

const Standards: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock standards data - in production, this would come from Supabase
  const standardsData = [
    {
      id: 1,
      category: 'Water Quality',
      title: 'Irrigation Water Quality Standards',
      description: 'Guidelines for assessing water quality for agricultural irrigation purposes.',
      standards: {
        'pH Level': '6.0 - 8.5',
        'Dissolved Oxygen': '> 5.0 ppm',
        'Turbidity': '< 4 NTU',
        'Electrical Conductivity': '< 3000 μS/cm'
      },
      source: 'WHO Guidelines',
      lastUpdated: '2024-01-15'
    },
    {
      id: 2,
      category: 'Soil Health',
      title: 'Optimal Soil Conditions',
      description: 'Recommended soil parameter ranges for healthy crop growth.',
      standards: {
        'Soil pH': '6.0 - 7.5',
        'Moisture Content': '40% - 70%',
        'Nitrogen (N)': '20 - 60 ppm',
        'Phosphorus (P)': '5 - 25 ppm',
        'Potassium (K)': '15 - 40 ppm'
      },
      source: 'Agricultural Extension Service',
      lastUpdated: '2024-01-10'
    },
    {
      id: 3,
      category: 'Environmental',
      title: 'Climate Control Standards',
      description: 'Optimal environmental conditions for greenhouse and field operations.',
      standards: {
        'Temperature': '18°C - 28°C',
        'Humidity': '50% - 80%',
        'Air Circulation': 'Minimum 0.5 m/s',
        'Light Intensity': '200 - 400 μmol/m²/s'
      },
      source: 'International Greenhouse Standards',
      lastUpdated: '2023-12-20'
    },
    {
      id: 4,
      category: 'Fertilizer Application',
      title: 'NPK Application Guidelines',
      description: 'Recommended fertilizer application rates and timing for optimal crop yield.',
      standards: {
        'Nitrogen Application': '100 - 200 kg/hectare',
        'Phosphorus Application': '50 - 100 kg/hectare',
        'Potassium Application': '80 - 150 kg/hectare',
        'Application Frequency': 'Every 4-6 weeks'
      },
      source: 'Crop Nutrition Institute',
      lastUpdated: '2024-01-05'
    }
  ];

  const filteredStandards = standardsData.filter(standard =>
    standard.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    standard.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    standard.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryColor = (category: string) => {
    const colors = {
      'Water Quality': 'bg-blue-100 text-blue-800',
      'Soil Health': 'bg-green-100 text-green-800',
      'Environmental': 'bg-yellow-100 text-yellow-800',
      'Fertilizer Application': 'bg-purple-100 text-purple-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Farming Standards & Guidelines</h1>
        <p className="text-gray-600">
          Reference standards and best practices for agricultural operations
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search standards and guidelines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>

      {/* Standards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredStandards.map((standard) => (
          <div
            key={standard.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(standard.category)}`}>
                    {standard.category}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {standard.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {standard.description}
                </p>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <button
                  className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Download as PDF"
                >
                  <Download className="h-4 w-4" />
                </button>
                <button
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="View external source"
                >
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Standards Table */}
            <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                <h4 className="text-sm font-medium text-gray-900">Recommended Values</h4>
              </div>
              <div className="divide-y divide-gray-200">
                {Object.entries(standard.standards).map(([parameter, value]) => (
                  <div key={parameter} className="px-4 py-3 flex justify-between">
                    <span className="text-sm text-gray-600">{parameter}</span>
                    <span className="text-sm font-medium text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Source: {standard.source}</span>
              <span>Updated: {new Date(standard.lastUpdated).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

      {filteredStandards.length === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No standards found</h3>
          <p className="text-gray-600">
            {searchTerm 
              ? `No standards match "${searchTerm}". Try adjusting your search terms.`
              : 'No standards are currently available.'
            }
          </p>
        </div>
      )}

      {/* Info Banner */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="text-blue-900 font-medium mb-1">Note on Standards</h3>
            <p className="text-blue-800 text-sm">
              These standards are provided as general guidelines and may vary based on crop type, local conditions, and specific requirements. 
              Always consult with local agricultural extensions and professionals for region-specific recommendations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Standards;