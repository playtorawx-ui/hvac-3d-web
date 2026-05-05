import { HVACSystem, HVACComponent } from '../types/hvac';

export interface Suggestion {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  action?: () => void;
}

export class SuggestionsEngine {
  static generateSuggestions(system: HVACSystem): Suggestion[] {
    const suggestions: Suggestion[] = [];

    // Check for missing protective components
    if (system.components.length > 0) {
      const hasAccumulator = system.components.some((c) => c.type === 'suction-accumulator');
      if (!hasAccumulator) {
        suggestions.push({
          id: 'suggest-accumulator',
          title: 'Add Suction Accumulator',
          description: 'Protect your compressor from liquid slugging by adding a suction accumulator before the compressor inlet',
          priority: 'high',
          category: 'Protection',
        });
      }

      const hasFilterDrier = system.components.some((c) => c.type === 'filter-drier');
      if (!hasFilterDrier) {
        suggestions.push({
          id: 'suggest-filter-drier',
          title: 'Add Filter-Drier',
          description: 'Remove moisture and contaminants from the refrigerant by adding a filter-drier in the liquid line',
          priority: 'high',
          category: 'Protection',
        });
      }

      const hasCheckValve = system.components.some((c) => c.type === 'check-valve');
      if (!hasCheckValve && system.components.length > 2) {
        suggestions.push({
          id: 'suggest-check-valve',
          title: 'Add Check Valve',
          description: 'Prevent backflow in your system by adding a check valve',
          priority: 'medium',
          category: 'Protection',
        });
      }
    }

    // Check for unbalanced system
    const compressors = system.components.filter((c) => c.type.includes('compressor'));
    const evaporators = system.components.filter((c) => c.type.includes('evaporator'));
    const condensers = system.components.filter((c) => c.type.includes('condenser'));

    if (compressors.length > 0 && evaporators.length === 0) {
      suggestions.push({
        id: 'suggest-evaporator',
        title: 'Add Evaporator',
        description: 'Your system has a compressor but no evaporator. Add an evaporator to complete the refrigeration cycle',
        priority: 'high',
        category: 'Completeness',
      });
    }

    if (compressors.length > 0 && condensers.length === 0) {
      suggestions.push({
        id: 'suggest-condenser',
        title: 'Add Condenser',
        description: 'Your system has a compressor but no condenser. Add a condenser to complete the refrigeration cycle',
        priority: 'high',
        category: 'Completeness',
      });
    }

    // Check for old refrigerant
    if (system.refrigerant === 'R22') {
      suggestions.push({
        id: 'suggest-refrigerant-upgrade',
        title: 'Consider Upgrading Refrigerant',
        description: 'R22 is being phased out. Consider migrating to R410A or R134a for better efficiency and environmental compliance',
        priority: 'medium',
        category: 'Efficiency',
      });
    }

    // Check for capacity optimization
    if (compressors.length > 1 && !system.components.some((c) => c.type === 'oil-separator')) {
      suggestions.push({
        id: 'suggest-oil-separator',
        title: 'Add Oil Separator',
        description: 'With multiple compressors, an oil separator helps prevent oil from accumulating in the evaporator',
        priority: 'medium',
        category: 'Optimization',
      });
    }

    // Check for receiver tank
    if (condensers.length > 0 && !system.components.some((c) => c.type === 'receiver-tank')) {
      suggestions.push({
        id: 'suggest-receiver',
        title: 'Add Receiver Tank',
        description: 'Store excess liquid refrigerant and improve system stability with a receiver tank',
        priority: 'low',
        category: 'Optimization',
      });
    }

    // Check for proper connections
    if (system.connections.length === 0 && system.components.length > 1) {
      suggestions.push({
        id: 'suggest-connections',
        title: 'Connect Components',
        description: 'Your system has multiple components but no connections. Connect them to form a complete refrigeration cycle',
        priority: 'high',
        category: 'Completeness',
      });
    }

    return suggestions.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  static getSuggestionsByCategory(system: HVACSystem, category: string): Suggestion[] {
    return this.generateSuggestions(system).filter((s) => s.category === category);
  }

  static getHighPrioritySuggestions(system: HVACSystem): Suggestion[] {
    return this.generateSuggestions(system).filter((s) => s.priority === 'high');
  }
}
