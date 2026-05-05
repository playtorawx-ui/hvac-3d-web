import { useState } from 'react';
import { useHVACStore } from '../lib/store/hvac-store';
import { WebBuilderScene } from '../components/3d/web-builder-scene';
import { ComponentSidebar } from '../components/component-sidebar';
import { ComponentPropertyEditor } from '../components/component-property-editor';
import { DiagnosticsPanel } from '../components/diagnostics-panel';
import { SuggestionsPanel } from '../components/suggestions-panel';
import { ExportModal } from '../components/export-modal';

interface EditorScreenProps {
  onNavigateHome: () => void;
}

export default function EditorScreen({ onNavigateHome }: EditorScreenProps) {
  const { currentSystem, selectedComponentId, canUndo, canRedo, undo, redo } = useHVACStore();
  const [showProperties, setShowProperties] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showExport, setShowExport] = useState(false);

  if (!currentSystem) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-muted">No system loaded</p>
      </div>
    );
  }

  const selectedComponent = selectedComponentId
    ? currentSystem.components.find((c) => c.id === selectedComponentId)
    : null;

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="bg-surface border-b border-border p-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{currentSystem.name}</h1>
          <p className="text-sm text-muted">{currentSystem.refrigerant} • {currentSystem.components.length} components</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={undo}
            disabled={!canUndo}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            title="Undo (Ctrl+Z)"
          >
            ↶ Undo
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            title="Redo (Ctrl+Y)"
          >
            ↷ Redo
          </button>
          <button
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition"
          >
            💡 Suggestions
          </button>
          <button
            onClick={() => setShowExport(true)}
            className="px-4 py-2 bg-warning text-white rounded-lg hover:opacity-90 transition"
          >
            Export
          </button>
          <button
            onClick={() => setShowDiagnostics(!showDiagnostics)}
            className="px-4 py-2 bg-success text-white rounded-lg hover:opacity-90 transition"
          >
            Diagnostics
          </button>
          {selectedComponent && (
            <button
              onClick={() => setShowProperties(!showProperties)}
              className="px-4 py-2 bg-secondary text-white rounded-lg hover:opacity-90 transition"
            >
              Properties
            </button>
          )}
          <button
            onClick={onNavigateHome}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition"
          >
            Back to Home
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Component Sidebar */}
        <ComponentSidebar />

        {/* 3D Builder */}
        <div className="flex-1 overflow-hidden">
          <WebBuilderScene />
        </div>

        {/* Properties Panel */}
        {showProperties && selectedComponent && (
          <ComponentPropertyEditor component={selectedComponent} />
        )}

        {/* Diagnostics Panel */}
        {showDiagnostics && (
          <DiagnosticsPanel system={currentSystem} />
        )}

        {/* Suggestions Panel */}
        {showSuggestions && (
          <SuggestionsPanel system={currentSystem} />
        )}
      </div>

      {/* Export Modal */}
      {showExport && (
        <ExportModal system={currentSystem} onClose={() => setShowExport(false)} />
      )}
    </div>
  );
}
