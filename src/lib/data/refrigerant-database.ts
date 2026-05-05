export interface RefrigerantSpec {
  name: string;
  code: string;
  type: 'CFC' | 'HCFC' | 'HFC' | 'HFO' | 'HC' | 'Ammonia';
  ozoneDeplectionPotential: number;
  globalWarmingPotential: number;
  boilingPoint: number; // °C
  criticalTemperature: number; // °C
  molecularWeight: number;
  safetyGroup: 'A1' | 'A2' | 'A2L' | 'A3' | 'B1' | 'B2' | 'B3';
  commonUses: string[];
  phaseOutDate: string | null;
  notes: string;
}

export const REFRIGERANT_DATABASE: Record<string, RefrigerantSpec> = {
  R410A: {
    name: 'R410A (Puron)',
    code: 'R410A',
    type: 'HFC',
    ozoneDeplectionPotential: 0,
    globalWarmingPotential: 2088,
    boilingPoint: -51.6,
    criticalTemperature: 70.1,
    molecularWeight: 72.6,
    safetyGroup: 'A1',
    commonUses: ['Air conditioning', 'Heat pumps', 'Refrigeration'],
    phaseOutDate: '2030',
    notes: 'Most common modern refrigerant. Requires POE oil. Cannot be mixed with mineral oil.',
  },
  R22: {
    name: 'R22 (HCFC-22)',
    code: 'R22',
    type: 'HCFC',
    ozoneDeplectionPotential: 0.055,
    globalWarmingPotential: 1810,
    boilingPoint: -40.8,
    criticalTemperature: 96.2,
    molecularWeight: 86.5,
    safetyGroup: 'A1',
    commonUses: ['Air conditioning', 'Refrigeration', 'Heat pumps'],
    phaseOutDate: '2020',
    notes: 'Being phased out due to ozone depletion. Still used in older systems. Uses mineral oil.',
  },
  R134a: {
    name: 'R134a (Tetrafluoroethane)',
    code: 'R134a',
    type: 'HFC',
    ozoneDeplectionPotential: 0,
    globalWarmingPotential: 1430,
    boilingPoint: -26.1,
    criticalTemperature: 101.1,
    molecularWeight: 102.0,
    safetyGroup: 'A1',
    commonUses: ['Automotive AC', 'Refrigeration', 'Chillers'],
    phaseOutDate: '2030',
    notes: 'Common in automotive and small appliance systems. Requires POE oil.',
  },
  R404A: {
    name: 'R404A (Suva 404A)',
    code: 'R404A',
    type: 'HFC',
    ozoneDeplectionPotential: 0,
    globalWarmingPotential: 3922,
    boilingPoint: -46.6,
    criticalTemperature: 72.5,
    molecularWeight: 97.6,
    safetyGroup: 'A1',
    commonUses: ['Commercial refrigeration', 'Freezers', 'Low-temp applications'],
    phaseOutDate: '2030',
    notes: 'Blend of R125, R143a, R134a. High GWP. Requires POE oil.',
  },
  R32: {
    name: 'R32 (Difluoromethane)',
    code: 'R32',
    type: 'HFC',
    ozoneDeplectionPotential: 0,
    globalWarmingPotential: 675,
    boilingPoint: -51.6,
    criticalTemperature: 78.1,
    molecularWeight: 52.0,
    safetyGroup: 'A2L',
    commonUses: ['Air conditioning', 'Heat pumps', 'Refrigeration'],
    phaseOutDate: null,
    notes: 'Lower GWP alternative. Mildly flammable. Requires POE oil. Becoming more common.',
  },
  R290: {
    name: 'R290 (Propane)',
    code: 'R290',
    type: 'HC',
    ozoneDeplectionPotential: 0,
    globalWarmingPotential: 3,
    boilingPoint: -42.1,
    criticalTemperature: 96.7,
    molecularWeight: 44.1,
    safetyGroup: 'A3',
    commonUses: ['Commercial refrigeration', 'Heat pumps', 'Chillers'],
    phaseOutDate: null,
    notes: 'Natural refrigerant. Very low GWP. Highly flammable. Requires special handling.',
  },
  R744: {
    name: 'R744 (CO2)',
    code: 'R744',
    type: 'Ammonia',
    ozoneDeplectionPotential: 0,
    globalWarmingPotential: 1,
    boilingPoint: -78.5,
    criticalTemperature: 31.1,
    molecularWeight: 44.0,
    safetyGroup: 'A1',
    commonUses: ['Commercial refrigeration', 'Cascade systems', 'Transcritical'],
    phaseOutDate: null,
    notes: 'Natural refrigerant. Very low GWP. Non-toxic. Requires high pressure systems.',
  },
  R717: {
    name: 'R717 (Ammonia)',
    code: 'R717',
    type: 'Ammonia',
    ozoneDeplectionPotential: 0,
    globalWarmingPotential: 0,
    boilingPoint: -33.3,
    criticalTemperature: 132.4,
    molecularWeight: 17.0,
    safetyGroup: 'B2',
    commonUses: ['Industrial refrigeration', 'Large chillers', 'Ice plants'],
    phaseOutDate: null,
    notes: 'Natural refrigerant. Toxic and corrosive. Used in large industrial systems only.',
  },
};

export function getRefrigerantSpec(code: string): RefrigerantSpec | undefined {
  return REFRIGERANT_DATABASE[code];
}

export function getAllRefrigerants(): RefrigerantSpec[] {
  return Object.values(REFRIGERANT_DATABASE);
}

export function getRefrigerantsByType(type: string): RefrigerantSpec[] {
  return Object.values(REFRIGERANT_DATABASE).filter((r) => r.type === type);
}

export function getRefrigerantsByUse(use: string): RefrigerantSpec[] {
  return Object.values(REFRIGERANT_DATABASE).filter((r) => r.commonUses.includes(use));
}
