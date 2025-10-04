import React, { useState } from 'react';
import { Plus, List } from 'lucide-react';
import ManualEntryForm from './ManualEntryForm';
import ManualEntryList from './ManualEntryList';
import { ManualEntry as ManualEntryType } from '../../config/supabase';

const ManualEntry: React.FC = () => {
  const [activeView, setActiveView] = useState<'list' | 'form'>('list');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleEntrySuccess = (entry: ManualEntryType) => {
    // Trigger a refresh of the list
    setRefreshTrigger(prev => prev + 1);
    // Switch back to list view
    setActiveView('list');
  };

  const handleNewEntry = () => {
    setActiveView('form');
  };

  const handleCancel = () => {
    setActiveView('list');
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manual Data Entry</h1>
          <p className="text-gray-600 mt-1">
            {activeView === 'form' 
              ? 'Record new observations and measurements'
              : 'View and manage your manual entries'
            }
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveView('list')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeView === 'list'
                ? 'bg-green-100 text-green-700'
                : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
            }`}
          >
            <List className="h-4 w-4" />
            <span>View Entries</span>
          </button>
          
          <button
            onClick={handleNewEntry}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeView === 'form'
                ? 'bg-green-600 text-white'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            <Plus className="h-4 w-4" />
            <span>New Entry</span>
          </button>
        </div>
      </div>

      {/* Content */}
      {activeView === 'form' ? (
        <ManualEntryForm onSuccess={handleEntrySuccess} onCancel={handleCancel} />
      ) : (
        <ManualEntryList refreshTrigger={refreshTrigger} />
      )}
    </div>
  );
};

export default ManualEntry;