import { HVACSystem } from '../types/hvac';

export interface DiagnosticIssue {
  id: string;
  severity: 'info' | 'warning' | 'error';
  title: string;
  description: string;
  affectedComponentIds: string[];
  suggestedFix: string;
}

export interface DiagnosticReport {
  systemId: string;
  timestamp: number;
  issues: DiagnosticIssue[];
  overallHealth: 'good' | 'fair' | 'poor';
  score: number; // 0-100
}

export function runDiagnostics(system: HVACSystem): DiagnosticReport {
  const issues: DiagnosticIssue[] = [];
  let score = 100;

  // Check for missing components
  const requiredComponents = ['compressor', 'condenser', 'evaporator'];
  const componentTypes = system.components.map((c) => c.type);

  requiredComponents.forEach((required) => {
    if (!componentTypes.some((ct) => ct.includes(required))) {
      issues.push({
        id: `missing_${required}`,
        severity: 'error',
        title: `Missing ${required}`,
        description: `Your system is missing a ${required} component. This is essential for operation.`,
        affectedComponentIds: [],
        suggestedFix: `Add a ${required} component to your system.`,
      });
      score -= 20;
    }
  });

  // Check for unconnected components
  const connectedComponentIds = new Set<string>();
  system.connections.forEach((conn) => {
    connectedComponentIds.add(conn.fromComponentId);
    connectedComponentIds.add(conn.toComponentId);
  });

  system.components.forEach((component) => {
    if (!connectedComponentIds.has(component.id) && system.components.length > 1) {
      issues.push({
        id: `unconnected_${component.id}`,
        severity: 'warning',
        title: `Unconnected component: ${component.name}`,
        description: `The ${component.name} is not connected to other components.`,
        affectedComponentIds: [component.id],
        suggestedFix: `Connect this component to the rest of the system using pipes.`,
      });
      score -= 10;
    }
  });

  // Check for potential refrigerant issues
  if (system.refrigerant === 'R22') {
    issues.push({
      id: 'r22_deprecated',
      severity: 'warning',
      title: 'R22 Refrigerant (Deprecated)',
      description: 'R22 is being phased out due to environmental concerns.',
      affectedComponentIds: [],
      suggestedFix: 'Consider upgrading to R410A or another modern refrigerant.',
    });
    score -= 5;
  }

  // Check for system balance
  const compressorCount = system.components.filter((c) => c.type.includes('compressor')).length;
  const condenserCount = system.components.filter((c) => c.type.includes('condenser')).length;
  const evaporatorCount = system.components.filter((c) => c.type.includes('evaporator')).length;

  if (compressorCount > 1 && (condenserCount !== compressorCount || evaporatorCount !== compressorCount)) {
    issues.push({
      id: 'component_mismatch',
      severity: 'warning',
      title: 'Component Count Mismatch',
      description: 'The number of compressors, condensers, and evaporators do not match.',
      affectedComponentIds: [],
      suggestedFix: 'Ensure you have matching numbers of each component type.',
    });
    score -= 5;
  }

  // Ensure score is between 0-100
  score = Math.max(0, Math.min(100, score));

  const overallHealth = score >= 80 ? 'good' : score >= 50 ? 'fair' : 'poor';

  return {
    systemId: system.id,
    timestamp: Date.now(),
    issues,
    overallHealth,
    score,
  };
}

export function formatDiagnosticReport(report: DiagnosticReport): string {
  let output = `HVAC System Diagnostic Report\n`;
  output += `Generated: ${new Date(report.timestamp).toLocaleString()}\n`;
  output += `Overall Health: ${report.overallHealth.toUpperCase()} (${report.score}/100)\n\n`;

  if (report.issues.length === 0) {
    output += `✓ No issues found. Your system is operating normally.\n`;
  } else {
    output += `Issues Found: ${report.issues.length}\n\n`;
    report.issues.forEach((issue) => {
      const icon = issue.severity === 'error' ? '✗' : issue.severity === 'warning' ? '⚠' : 'ℹ';
      output += `${icon} [${issue.severity.toUpperCase()}] ${issue.title}\n`;
      output += `   ${issue.description}\n`;
      output += `   Fix: ${issue.suggestedFix}\n\n`;
    });
  }

  return output;
}
