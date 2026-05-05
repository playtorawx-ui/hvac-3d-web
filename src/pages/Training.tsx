import { useState } from 'react';
import { TRAINING_SCENARIOS } from '../lib/data/training-scenarios';
import { useHVACStore } from '../lib/store/hvac-store';

interface TrainingPageProps {
  onNavigateToEditor: () => void;
  onNavigateHome: () => void;
}

export default function TrainingPage({ onNavigateToEditor, onNavigateHome }: TrainingPageProps) {
  const { saveSystem } = useHVACStore();
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const scenario = selectedScenario
    ? TRAINING_SCENARIOS.find((s) => s.id === selectedScenario)
    : null;

  const handleStartScenario = () => {
    if (scenario) {
      saveSystem(scenario.system);
      onNavigateToEditor();
    }
  };

  const difficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-success/20 text-success border-success';
      case 'intermediate':
        return 'bg-warning/20 text-warning border-warning';
      case 'advanced':
        return 'bg-error/20 text-error border-error';
      default:
        return 'bg-primary/20 text-primary border-primary';
    }
  };

  if (scenario) {
    return (
      <div className="w-full h-full flex flex-col">
        {/* Header */}
        <div className="bg-surface border-b border-border p-6">
          <button
            onClick={() => setSelectedScenario(null)}
            className="text-primary hover:underline text-sm mb-4"
          >
            ← Back to Scenarios
          </button>
          <h1 className="text-3xl font-bold text-foreground">{scenario.title}</h1>
          <p className="text-sm text-muted mt-2">{scenario.description}</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Difficulty */}
            <div>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${difficultyColor(
                  scenario.difficulty
                )}`}
              >
                {scenario.difficulty.charAt(0).toUpperCase() + scenario.difficulty.slice(1)}
              </span>
            </div>

            {/* Objective */}
            <div>
              <h2 className="text-lg font-bold text-foreground mb-2">Objective</h2>
              <p className="text-foreground">{scenario.objective}</p>
            </div>

            {/* Hints */}
            <div>
              <button
                onClick={() => setShowHints(!showHints)}
                className="flex items-center gap-2 text-primary hover:underline font-semibold mb-2"
              >
                {showHints ? '▼' : '▶'} Hints ({scenario.hints.length})
              </button>
              {showHints && (
                <div className="bg-primary/10 border border-primary rounded-lg p-4 space-y-2">
                  {scenario.hints.map((hint, index) => (
                    <div key={index} className="flex gap-2">
                      <span className="text-primary font-bold">{index + 1}.</span>
                      <p className="text-foreground">{hint}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Solution */}
            <div>
              <button
                onClick={() => setShowSolution(!showSolution)}
                className="flex items-center gap-2 text-success hover:underline font-semibold mb-2"
              >
                {showSolution ? '▼' : '▶'} Solution
              </button>
              {showSolution && (
                <div className="bg-success/10 border border-success rounded-lg p-4">
                  <p className="text-foreground">{scenario.solution}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-surface border-t border-border p-6 flex gap-2 justify-end">
          <button
            onClick={() => setSelectedScenario(null)}
            className="px-6 py-2 border border-border rounded-lg text-foreground hover:bg-background transition"
          >
            Cancel
          </button>
          <button
            onClick={handleStartScenario}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition"
          >
            Start Scenario
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="bg-surface border-b border-border p-6">
        <h1 className="text-3xl font-bold text-foreground">Training Mode</h1>
        <p className="text-sm text-muted mt-2">Learn HVAC system design through interactive scenarios</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {TRAINING_SCENARIOS.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => setSelectedScenario(scenario.id)}
              className="w-full text-left p-6 bg-surface rounded-lg border border-border hover:border-primary transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground">{scenario.title}</h3>
                  <p className="text-sm text-muted mt-1">{scenario.description}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${difficultyColor(
                        scenario.difficulty
                      )}`}
                    >
                      {scenario.difficulty.charAt(0).toUpperCase() + scenario.difficulty.slice(1)}
                    </span>
                  </div>
                </div>
                <span className="text-2xl text-primary">→</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-surface border-t border-border p-6 flex gap-2 justify-end">
        <button
          onClick={onNavigateHome}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
