import { useEffect, useState } from 'react';
import { HVACSystem } from '../lib/types/hvac';
import { runDiagnostics, DiagnosticReport } from '../lib/diagnostics/hvac-diagnostics';

interface DiagnosticsPanelProps {
  system: HVACSystem;
}

export function DiagnosticsPanel({ system }: DiagnosticsPanelProps) {
  const [report, setReport] = useState<DiagnosticReport | null>(null);

  useEffect(() => {
    const newReport = runDiagnostics(system);
    setReport(newReport);
  }, [system]);

  if (!report) return null;

  const healthColor =
    report.overallHealth === 'good'
      ? '#22C55E'
      : report.overallHealth === 'fair'
        ? '#F59E0B'
        : '#EF4444';

  return (
    <div className="w-96 bg-surface border-l border-border flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-bold text-foreground">System Diagnostics</h2>
      </div>

      {/* Health Score */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-foreground">Overall Health</span>
          <span
            className="text-2xl font-bold"
            style={{ color: healthColor }}
          >
            {report.score}%
          </span>
        </div>
        <div className="w-full bg-border rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all"
            style={{
              width: `${report.score}%`,
              backgroundColor: healthColor,
            }}
          />
        </div>
        <p className="text-xs text-muted mt-2 capitalize">Status: {report.overallHealth}</p>
      </div>

      {/* Issues */}
      <div className="flex-1 overflow-y-auto p-4">
        {report.issues.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted">✓ No issues found</p>
            <p className="text-xs text-muted mt-1">Your system is operating normally</p>
          </div>
        ) : (
          <div className="space-y-3">
            {report.issues.map((issue) => (
              <div
                key={issue.id}
                className={`p-3 rounded-lg border ${
                  issue.severity === 'error'
                    ? 'bg-error/10 border-error text-error'
                    : issue.severity === 'warning'
                      ? 'bg-warning/10 border-warning text-warning'
                      : 'bg-primary/10 border-primary text-primary'
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className="text-lg flex-shrink-0">
                    {issue.severity === 'error' ? '✗' : issue.severity === 'warning' ? '⚠' : 'ℹ'}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{issue.title}</p>
                    <p className="text-xs mt-1 opacity-90">{issue.description}</p>
                    <p className="text-xs mt-2 font-semibold">Fix: {issue.suggestedFix}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border text-xs text-muted">
        <p>Last checked: {new Date(report.timestamp).toLocaleTimeString()}</p>
      </div>
    </div>
  );
}
