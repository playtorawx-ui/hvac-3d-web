import { useState } from 'react';
import { useHVACStore } from '../lib/store/hvac-store';
import { useTheme } from '../lib/theme/theme-context';
import { useKeyboardShortcuts } from '../hooks/use-keyboard-shortcuts';
import { TemplatesModal } from '../components/templates-modal';
import { toastManager } from '../lib/notifications/toast';

interface HomeScreenProps {
  onNavigateToEditor: () => void;
  onNavigateToTraining: () => void;
}

export default function HomeScreen({ onNavigateToEditor, onNavigateToTraining }: HomeScreenProps) {
  const { systems, createSystem, loadSystem, deleteSystem, cloneSystem, searchQuery, setSearchQuery, getFilteredSystems } = useHVACStore();
  const { theme, toggleTheme } = useTheme();
  const [showNewSystemModal, setShowNewSystemModal] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [systemName, setSystemName] = useState('');
  const [selectedRefrigerant, setSelectedRefrigerant] = useState('R410A');

  const filteredSystems = getFilteredSystems();

  useKeyboardShortcuts([
    {
      key: 'n',
      ctrl: true,
      callback: () => setShowNewSystemModal(true),
    },
  ]);

  const handleCreateSystem = () => {
    if (systemName.trim()) {
      createSystem(systemName, selectedRefrigerant);
      setSystemName('');
      setShowNewSystemModal(false);
      toastManager.success(`System "${systemName}" created successfully`);
      onNavigateToEditor();
    }
  };

  const handleLoadSystem = (systemId: string) => {
    loadSystem(systemId);
    toastManager.success('System loaded');
    onNavigateToEditor();
  };

  const handleDeleteSystem = (systemId: string) => {
    const system = systems.find((s) => s.id === systemId);
    deleteSystem(systemId);
    toastManager.success(`System "${system?.name}" deleted`);
  };

  const handleCloneSystem = (systemId: string) => {
    const system = systems.find((s) => s.id === systemId);
    cloneSystem(systemId);
    toastManager.success(`System "${system?.name}" cloned`);
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="bg-surface border-b border-border p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">HVAC 3D Troubleshooter</h1>
            <p className="text-sm text-muted">Design and diagnose refrigeration systems</p>
          </div>
          <button
            onClick={toggleTheme}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => setShowNewSystemModal(true)}
              className="w-full bg-primary text-white rounded-lg p-4 font-bold text-lg hover:opacity-90 transition"
              title="Ctrl+N"
            >
              + New System
            </button>
            <button
              onClick={() => setShowTemplates(true)}
              className="w-full bg-secondary text-white rounded-lg p-4 font-bold text-lg hover:opacity-90 transition"
            >
              📋 Templates
            </button>
            <button
              onClick={onNavigateToTraining}
              className="w-full bg-success text-white rounded-lg p-4 font-bold text-lg hover:opacity-90 transition"
            >
              📚 Training Mode
            </button>
          </div>

          {/* Search Bar */}
          <div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search systems by name, refrigerant, or components..."
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {searchQuery && (
              <p className="text-xs text-muted mt-2">
                Found {filteredSystems.length} system{filteredSystems.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Systems List */}
          {filteredSystems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <h2 className="text-xl font-semibold text-foreground">
                {searchQuery ? 'No systems found' : 'No systems yet'}
              </h2>
              <p className="text-sm text-muted text-center max-w-xs">
                {searchQuery
                  ? 'Try adjusting your search query'
                  : 'Create a new system to get started with 3D design and troubleshooting'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-foreground">
                {searchQuery ? 'Search Results' : 'Recent Systems'}
              </h2>
              {filteredSystems.map((system) => (
                <div key={system.id} className="bg-surface rounded-lg border border-border overflow-hidden">
                  <div className="p-4">
                    <h3 className="text-base font-semibold text-foreground">{system.name}</h3>
                    <p className="text-xs text-muted mt-1">
                      {system.components.length} components • {system.refrigerant}
                    </p>
                  </div>

                  {/* System Card Actions */}
                  <div className="bg-background/50 p-3 border-t border-border flex gap-2">
                    <button
                      onClick={() => handleLoadSystem(system.id)}
                      className="flex-1 bg-primary text-white rounded-lg p-2 text-xs font-semibold hover:opacity-90 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleCloneSystem(system.id)}
                      className="flex-1 bg-secondary text-white rounded-lg p-2 text-xs font-semibold hover:opacity-90 transition"
                    >
                      Clone
                    </button>
                    <button
                      onClick={() => handleDeleteSystem(system.id)}
                      className="flex-1 bg-error text-white rounded-lg p-2 text-xs font-semibold hover:opacity-90 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* New System Modal */}
      {showNewSystemModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-surface rounded-lg p-6 max-w-md w-full mx-4 space-y-4">
            <h2 className="text-xl font-bold text-foreground">Create New System</h2>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">System Name</label>
              <input
                type="text"
                value={systemName}
                onChange={(e) => setSystemName(e.target.value)}
                placeholder="Enter system name"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Refrigerant Type</label>
              <select
                value={selectedRefrigerant}
                onChange={(e) => setSelectedRefrigerant(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option>R410A</option>
                <option>R22</option>
                <option>R134a</option>
                <option>R404A</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowNewSystemModal(false)}
                className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-background transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSystem}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Templates Modal */}
      {showTemplates && (
        <TemplatesModal
          onClose={() => setShowTemplates(false)}
          onTemplateLoaded={() => {
            setShowTemplates(false);
            toastManager.success('Template loaded');
            onNavigateToEditor();
          }}
        />
      )}
    </div>
  );
}
