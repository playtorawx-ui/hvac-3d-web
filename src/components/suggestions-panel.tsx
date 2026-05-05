import { HVACSystem } from '../lib/types/hvac';
import { SuggestionsEngine, Suggestion } from '../lib/ai/suggestions-engine';
import { useState } from 'react';

interface SuggestionsPanelProps {
  system: HVACSystem;
}

export function SuggestionsPanel({ system }: SuggestionsPanelProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const suggestions = SuggestionsEngine.generateSuggestions(system);

  if (suggestions.length === 0) {
    return (
      <div className="w-64 bg-surface border-l border-border p-4 flex flex-col items-center justify-center">
        <p className="text-sm text-success font-semibold">✓ System looks good!</p>
        <p className="text-xs text-muted text-center mt-2">No suggestions at this time</p>
      </div>
    );
  }

  const priorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-error/20 text-error border-error';
      case 'medium':
        return 'bg-warning/20 text-warning border-warning';
      case 'low':
        return 'bg-primary/20 text-primary border-primary';
      default:
        return 'bg-muted/20 text-muted border-muted';
    }
  };

  return (
    <div className="w-64 bg-surface border-l border-border overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-bold text-foreground">💡 Suggestions</h3>
        <p className="text-xs text-muted mt-1">{suggestions.length} recommendation{suggestions.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Suggestions List */}
      <div className="flex-1 overflow-y-auto">
        {suggestions.map((suggestion) => (
          <div key={suggestion.id} className="border-b border-border">
            <button
              onClick={() => setExpandedId(expandedId === suggestion.id ? null : suggestion.id)}
              className="w-full p-3 text-left hover:bg-background transition"
            >
              <div className="flex items-start gap-2">
                <span className={`px-2 py-1 rounded text-xs font-semibold border ${priorityColor(suggestion.priority)}`}>
                  {suggestion.priority.charAt(0).toUpperCase()}
                </span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-foreground truncate">{suggestion.title}</h4>
                  <p className="text-xs text-muted mt-1 line-clamp-2">{suggestion.description}</p>
                </div>
                <span className="text-xs text-muted flex-shrink-0">
                  {expandedId === suggestion.id ? '▼' : '▶'}
                </span>
              </div>
            </button>

            {/* Expanded Details */}
            {expandedId === suggestion.id && (
              <div className="px-3 pb-3 bg-background/50">
                <p className="text-xs text-foreground leading-relaxed">{suggestion.description}</p>
                <div className="mt-2 flex gap-2">
                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                    {suggestion.category}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="p-3 border-t border-border bg-background/50 text-xs text-muted">
        <p>
          {suggestions.filter((s) => s.priority === 'high').length} high priority
          {suggestions.filter((s) => s.priority === 'medium').length > 0 &&
            `, ${suggestions.filter((s) => s.priority === 'medium').length} medium`}
        </p>
      </div>
    </div>
  );
}
