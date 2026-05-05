import { HVACSystem } from '../types/hvac';
import { COMPONENT_LIBRARY } from '../data/component-library';

export interface SystemStatistics {
  totalComponents: number;
  totalCapacity: number; // BTU/h
  averageEfficiency: number; // 0-1
  estimatedCost: number; // USD
  estimatedWeight: number; // kg
  totalConnections: number;
  compressorCount: number;
  condenserCount: number;
  evaporatorCount: number;
  expansionDeviceCount: number;
  protectionDeviceCount: number;
  electricalComponentCount: number;
  systemEfficiencyRating: 'A' | 'B' | 'C' | 'D' | 'F'; // Energy rating
  estimatedSEER: number; // Seasonal Energy Efficiency Ratio
  estimatedEER: number; // Energy Efficiency Ratio
  estimatedCOP: number; // Coefficient of Performance
}

export class SystemStatisticsCalculator {
  static calculateStatistics(system: HVACSystem): SystemStatistics {
    const components = system.components;

    // Count components by type
    const compressorCount = components.filter((c) => c.type.includes('compressor')).length;
    const condenserCount = components.filter((c) => c.type.includes('condenser')).length;
    const evaporatorCount = components.filter((c) => c.type.includes('evaporator')).length;
    const expansionDeviceCount = components.filter((c) => c.type.includes('expansion') || c.type.includes('valve')).length;
    const protectionDeviceCount = components.filter((c) => c.type.includes('accumulator') || c.type.includes('filter')).length;
    const electricalComponentCount = components.filter((c) => c.type.includes('electrical')).length;

    // Calculate total capacity
    const totalCapacity = components.reduce((sum, c) => {
      const spec = COMPONENT_LIBRARY.find((s) => s.id === c.type);
      return sum + (spec?.properties?.capacity || 0);
    }, 0);

    // Calculate average efficiency
    const efficiencies = components
      .map((c) => {
        const spec = COMPONENT_LIBRARY.find((s) => s.id === c.type);
        return spec?.properties?.efficiency || 0;
      })
      .filter((e) => e > 0);
    const averageEfficiency = efficiencies.length > 0 ? efficiencies.reduce((a, b) => a + b) / efficiencies.length : 0;

    // Estimate cost
    const estimatedCost = components.reduce((sum, c) => {
      const spec = COMPONENT_LIBRARY.find((s) => s.id === c.type);
      const baseCost = spec?.properties?.cost || 500;
      return sum + baseCost;
    }, 0);

    // Estimate weight
    const estimatedWeight = components.reduce((sum, c) => {
      const spec = COMPONENT_LIBRARY.find((s) => s.id === c.type);
      return sum + (spec?.properties?.weight || 10);
    }, 0);

    // Calculate efficiency ratings
    const systemEfficiencyRating = this.calculateEfficiencyRating(averageEfficiency);
    const estimatedSEER = this.calculateSEER(averageEfficiency, totalCapacity);
    const estimatedEER = this.calculateEER(averageEfficiency, totalCapacity);
    const estimatedCOP = this.calculateCOP(averageEfficiency);

    return {
      totalComponents: components.length,
      totalCapacity,
      averageEfficiency,
      estimatedCost,
      estimatedWeight,
      totalConnections: system.connections.length,
      compressorCount,
      condenserCount,
      evaporatorCount,
      expansionDeviceCount,
      protectionDeviceCount,
      electricalComponentCount,
      systemEfficiencyRating,
      estimatedSEER,
      estimatedEER,
      estimatedCOP,
    };
  }

  private static calculateEfficiencyRating(efficiency: number): 'A' | 'B' | 'C' | 'D' | 'F' {
    if (efficiency >= 0.95) return 'A';
    if (efficiency >= 0.85) return 'B';
    if (efficiency >= 0.75) return 'C';
    if (efficiency >= 0.65) return 'D';
    return 'F';
  }

  private static calculateSEER(efficiency: number, capacity: number): number {
    // Simplified SEER calculation
    return Math.round((efficiency * 15 + capacity / 1000) * 10) / 10;
  }

  private static calculateEER(efficiency: number, capacity: number): number {
    // Simplified EER calculation
    return Math.round((efficiency * 12 + capacity / 1500) * 10) / 10;
  }

  private static calculateCOP(efficiency: number): number {
    // Coefficient of Performance
    return Math.round(efficiency * 4 * 10) / 10;
  }

  static getStatisticsReport(system: HVACSystem): string {
    const stats = this.calculateStatistics(system);
    return `
System: ${system.name}
Refrigerant: ${system.refrigerant}

Component Summary:
- Total Components: ${stats.totalComponents}
- Compressors: ${stats.compressorCount}
- Condensers: ${stats.condenserCount}
- Evaporators: ${stats.evaporatorCount}
- Expansion Devices: ${stats.expansionDeviceCount}
- Protection Devices: ${stats.protectionDeviceCount}
- Electrical Components: ${stats.electricalComponentCount}

Performance Metrics:
- Total Capacity: ${stats.totalCapacity.toLocaleString()} BTU/h
- Average Efficiency: ${(stats.averageEfficiency * 100).toFixed(1)}%
- System Rating: ${stats.systemEfficiencyRating}
- Estimated SEER: ${stats.estimatedSEER}
- Estimated EER: ${stats.estimatedEER}
- Estimated COP: ${stats.estimatedCOP}

System Details:
- Total Connections: ${stats.totalConnections}
- Estimated Weight: ${stats.estimatedWeight.toFixed(1)} kg
- Estimated Cost: $${stats.estimatedCost.toLocaleString()}
    `.trim();
  }
}
