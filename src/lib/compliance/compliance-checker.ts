import { HVACSystem } from '../types/hvac';
import { getRefrigerantSpec } from '../data/refrigerant-database';

export interface ComplianceIssue {
  id: string;
  severity: 'error' | 'warning' | 'info';
  title: string;
  description: string;
  regulation: string;
  solution: string;
}

export class ComplianceChecker {
  static checkCompliance(system: HVACSystem): ComplianceIssue[] {
    const issues: ComplianceIssue[] = [];

    // Check refrigerant compliance
    const refrigerantIssues = this.checkRefrigerantCompliance(system);
    issues.push(...refrigerantIssues);

    // Check system configuration
    const configIssues = this.checkSystemConfiguration(system);
    issues.push(...configIssues);

    // Check safety requirements
    const safetyIssues = this.checkSafetyRequirements(system);
    issues.push(...safetyIssues);

    // Check environmental compliance
    const envIssues = this.checkEnvironmentalCompliance(system);
    issues.push(...envIssues);

    return issues.sort((a, b) => {
      const severityOrder = { error: 0, warning: 1, info: 2 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  }

  private static checkRefrigerantCompliance(system: HVACSystem): ComplianceIssue[] {
    const issues: ComplianceIssue[] = [];
    const refrigerantSpec = getRefrigerantSpec(system.refrigerant);

    if (!refrigerantSpec) {
      issues.push({
        id: 'unknown-refrigerant',
        severity: 'error',
        title: 'Unknown Refrigerant',
        description: `Refrigerant ${system.refrigerant} is not recognized in the database`,
        regulation: 'EPA Refrigerant Management',
        solution: 'Select a recognized refrigerant type',
      });
      return issues;
    }

    // Check for phased-out refrigerants
    if (refrigerantSpec.phaseOutDate) {
      const phaseOutYear = parseInt(refrigerantSpec.phaseOutDate);
      const currentYear = new Date().getFullYear();
      if (currentYear >= phaseOutYear) {
        issues.push({
          id: 'phased-out-refrigerant',
          severity: 'error',
          title: 'Phased-Out Refrigerant',
          description: `${refrigerantSpec.name} was phased out in ${refrigerantSpec.phaseOutDate}`,
          regulation: 'EPA Refrigerant Phase-Out Schedule',
          solution: `Upgrade to a compliant refrigerant like ${refrigerantSpec.globalWarmingPotential > 1000 ? 'R32 or R290' : 'R410A'}`,
        });
      } else {
        issues.push({
          id: 'upcoming-phase-out',
          severity: 'warning',
          title: 'Upcoming Phase-Out',
          description: `${refrigerantSpec.name} will be phased out in ${refrigerantSpec.phaseOutDate}. Plan for replacement.`,
          regulation: 'EPA Refrigerant Phase-Out Schedule',
          solution: 'Consider upgrading to a lower-GWP alternative',
        });
      }
    }

    // Check GWP compliance
    if (refrigerantSpec.globalWarmingPotential > 2500) {
      issues.push({
        id: 'high-gwp',
        severity: 'warning',
        title: 'High Global Warming Potential',
        description: `${refrigerantSpec.name} has a GWP of ${refrigerantSpec.globalWarmingPotential}, which is above recommended levels`,
        regulation: 'EU F-Gas Regulation / EPA Climate Protection',
        solution: 'Consider switching to a lower-GWP refrigerant like R32 or R290',
      });
    }

    // Check ODP
    if (refrigerantSpec.ozoneDeplectionPotential > 0) {
      issues.push({
        id: 'ozone-depleting',
        severity: 'warning',
        title: 'Ozone-Depleting Substance',
        description: `${refrigerantSpec.name} has an ODP of ${refrigerantSpec.ozoneDeplectionPotential}`,
        regulation: 'Montreal Protocol',
        solution: 'Transition to ozone-safe alternatives',
      });
    }

    return issues;
  }

  private static checkSystemConfiguration(system: HVACSystem): ComplianceIssue[] {
    const issues: ComplianceIssue[] = [];

    // Check for required components
    const hasCompressor = system.components.some((c) => c.type.includes('compressor'));
    const hasCondenser = system.components.some((c) => c.type.includes('condenser'));
    const hasEvaporator = system.components.some((c) => c.type.includes('evaporator'));
    const hasExpansionDevice = system.components.some((c) => c.type.includes('expansion') || c.type.includes('valve'));

    if (!hasCompressor) {
      issues.push({
        id: 'missing-compressor',
        severity: 'error',
        title: 'Missing Compressor',
        description: 'System must have at least one compressor',
        regulation: 'ASHRAE 15 - Safety Standard for Refrigeration',
        solution: 'Add a compressor to the system',
      });
    }

    if (!hasCondenser) {
      issues.push({
        id: 'missing-condenser',
        severity: 'error',
        title: 'Missing Condenser',
        description: 'System must have at least one condenser',
        regulation: 'ASHRAE 15 - Safety Standard for Refrigeration',
        solution: 'Add a condenser to the system',
      });
    }

    if (!hasEvaporator) {
      issues.push({
        id: 'missing-evaporator',
        severity: 'error',
        title: 'Missing Evaporator',
        description: 'System must have at least one evaporator',
        regulation: 'ASHRAE 15 - Safety Standard for Refrigeration',
        solution: 'Add an evaporator to the system',
      });
    }

    if (!hasExpansionDevice) {
      issues.push({
        id: 'missing-expansion-device',
        severity: 'error',
        title: 'Missing Expansion Device',
        description: 'System must have an expansion device to control refrigerant flow',
        regulation: 'ASHRAE 15 - Safety Standard for Refrigeration',
        solution: 'Add an expansion valve or capillary tube',
      });
    }

    // Check for protection devices
    const hasAccumulator = system.components.some((c) => c.type.includes('accumulator'));
    if (!hasAccumulator && hasCompressor) {
      issues.push({
        id: 'missing-accumulator',
        severity: 'warning',
        title: 'Missing Suction Accumulator',
        description: 'Suction accumulator is recommended to protect the compressor',
        regulation: 'ASHRAE 15 - Best Practices',
        solution: 'Add a suction accumulator before the compressor inlet',
      });
    }

    const hasFilterDrier = system.components.some((c) => c.type.includes('filter'));
    if (!hasFilterDrier) {
      issues.push({
        id: 'missing-filter-drier',
        severity: 'warning',
        title: 'Missing Filter-Drier',
        description: 'Filter-drier is recommended to remove moisture and contaminants',
        regulation: 'ASHRAE 15 - Best Practices',
        solution: 'Add a filter-drier in the liquid line',
      });
    }

    return issues;
  }

  private static checkSafetyRequirements(system: HVACSystem): ComplianceIssue[] {
    const issues: ComplianceIssue[] = [];

    // Check for electrical components
    const hasContactor = system.components.some((c) => c.type === 'contactor');
    const hasOverloadProtector = system.components.some((c) => c.type === 'overload-protector');

    if (!hasContactor) {
      issues.push({
        id: 'missing-contactor',
        severity: 'warning',
        title: 'Missing Contactor',
        description: 'Electrical contactor is recommended for motor control',
        regulation: 'NEC (National Electrical Code)',
        solution: 'Add a contactor for safe motor control',
      });
    }

    if (!hasOverloadProtector) {
      issues.push({
        id: 'missing-overload-protection',
        severity: 'warning',
        title: 'Missing Overload Protection',
        description: 'Motor overload protection is recommended',
        regulation: 'NEC (National Electrical Code)',
        solution: 'Add an overload protector to the motor circuit',
      });
    }

    return issues;
  }

  private static checkEnvironmentalCompliance(system: HVACSystem): ComplianceIssue[] {
    const issues: ComplianceIssue[] = [];
    const refrigerantSpec = getRefrigerantSpec(system.refrigerant);

    if (refrigerantSpec && refrigerantSpec.globalWarmingPotential > 750) {
      issues.push({
        id: 'high-environmental-impact',
        severity: 'info',
        title: 'High Environmental Impact',
        description: `This refrigerant has a GWP of ${refrigerantSpec.globalWarmingPotential}. Consider lower-GWP alternatives.`,
        regulation: 'EU F-Gas Regulation / Kigali Amendment',
        solution: 'Evaluate low-GWP alternatives like R32, R290, or R744',
      });
    }

    return issues;
  }

  static getComplianceReport(system: HVACSystem): string {
    const issues = this.checkCompliance(system);
    const errors = issues.filter((i) => i.severity === 'error');
    const warnings = issues.filter((i) => i.severity === 'warning');
    const infos = issues.filter((i) => i.severity === 'info');

    let report = `COMPLIANCE REPORT: ${system.name}\n`;
    report += `Generated: ${new Date().toLocaleString()}\n\n`;

    report += `SUMMARY:\n`;
    report += `- Errors: ${errors.length}\n`;
    report += `- Warnings: ${warnings.length}\n`;
    report += `- Information: ${infos.length}\n\n`;

    if (errors.length > 0) {
      report += `ERRORS (Must Fix):\n`;
      errors.forEach((issue) => {
        report += `\n${issue.title}\n`;
        report += `${issue.description}\n`;
        report += `Solution: ${issue.solution}\n`;
      });
    }

    if (warnings.length > 0) {
      report += `\n\nWARNINGS (Recommended):\n`;
      warnings.forEach((issue) => {
        report += `\n${issue.title}\n`;
        report += `${issue.description}\n`;
        report += `Solution: ${issue.solution}\n`;
      });
    }

    if (infos.length > 0) {
      report += `\n\nINFORMATION:\n`;
      infos.forEach((issue) => {
        report += `\n${issue.title}\n`;
        report += `${issue.description}\n`;
      });
    }

    return report;
  }
}
