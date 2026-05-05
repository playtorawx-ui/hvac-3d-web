export interface ComponentSpec {
  componentId: string;
  name: string;
  manufacturer?: string;
  model?: string;
  capacity: number; // BTU/h or tons
  efficiency: number; // 0-1
  voltage: number; // Volts
  amps: number; // Amperes
  weight: number; // kg
  dimensions: { width: number; height: number; depth: number }; // cm
  operatingRange: { minTemp: number; maxTemp: number }; // °C
  refrigerants: string[];
  certifications: string[];
  warranty: number; // years
  cost: number; // USD
  notes: string;
}

export const COMPONENT_SPECIFICATIONS: Record<string, ComponentSpec[]> = {
  'reciprocating-compressor': [
    {
      componentId: 'reciprocating-compressor',
      name: 'Copeland 4D3A-300',
      manufacturer: 'Emerson Copeland',
      model: '4D3A-300',
      capacity: 30000,
      efficiency: 0.85,
      voltage: 480,
      amps: 45,
      weight: 250,
      dimensions: { width: 60, height: 80, depth: 50 },
      operatingRange: { minTemp: -40, maxTemp: 65 },
      refrigerants: ['R22', 'R410A'],
      certifications: ['UL', 'CSA', 'CE'],
      warranty: 5,
      cost: 3500,
      notes: 'Semi-hermetic compressor for medium capacity systems',
    },
  ],
  'scroll-compressor': [
    {
      componentId: 'scroll-compressor',
      name: 'Copeland ZR Series',
      manufacturer: 'Emerson Copeland',
      model: 'ZR36K3-PFV',
      capacity: 36000,
      efficiency: 0.88,
      voltage: 480,
      amps: 40,
      weight: 180,
      dimensions: { width: 55, height: 75, depth: 45 },
      operatingRange: { minTemp: -30, maxTemp: 60 },
      refrigerants: ['R410A', 'R22'],
      certifications: ['UL', 'CSA', 'CE'],
      warranty: 5,
      cost: 4200,
      notes: 'High-efficiency scroll compressor for commercial AC',
    },
  ],
  'air-cooled-condenser': [
    {
      componentId: 'air-cooled-condenser',
      name: 'Carrier AquaEdge',
      manufacturer: 'Carrier',
      model: 'AQ-30XL',
      capacity: 30000,
      efficiency: 0.92,
      voltage: 480,
      amps: 15,
      weight: 400,
      dimensions: { width: 150, height: 100, depth: 80 },
      operatingRange: { minTemp: -10, maxTemp: 55 },
      refrigerants: ['R410A', 'R134a'],
      certifications: ['AHRI', 'UL', 'CSA'],
      warranty: 10,
      cost: 5000,
      notes: 'High-efficiency air-cooled condenser with variable speed fan',
    },
  ],
  'direct-expansion-evaporator': [
    {
      componentId: 'direct-expansion-evaporator',
      name: 'Trane CenTraVac',
      manufacturer: 'Trane',
      model: 'CVHF-300',
      capacity: 30000,
      efficiency: 0.90,
      voltage: 0,
      amps: 0,
      weight: 350,
      dimensions: { width: 120, height: 90, depth: 70 },
      operatingRange: { minTemp: -30, maxTemp: 20 },
      refrigerants: ['R410A', 'R22'],
      certifications: ['AHRI', 'UL'],
      warranty: 7,
      cost: 4500,
      notes: 'Direct expansion evaporator for commercial cooling',
    },
  ],
  'thermostatic-expansion-valve': [
    {
      componentId: 'thermostatic-expansion-valve',
      name: 'Danfoss TX2',
      manufacturer: 'Danfoss',
      model: 'TX2-N25',
      capacity: 25000,
      efficiency: 0.95,
      voltage: 0,
      amps: 0,
      weight: 2,
      dimensions: { width: 8, height: 15, depth: 8 },
      operatingRange: { minTemp: -40, maxTemp: 80 },
      refrigerants: ['R22', 'R410A', 'R134a'],
      certifications: ['UL', 'CSA'],
      warranty: 2,
      cost: 150,
      notes: 'Precision thermostatic expansion valve',
    },
  ],
  'filter-drier': [
    {
      componentId: 'filter-drier',
      name: 'Sporlan 41-T',
      manufacturer: 'Parker Sporlan',
      model: '41-T',
      capacity: 50000,
      efficiency: 0.98,
      voltage: 0,
      amps: 0,
      weight: 1.5,
      dimensions: { width: 10, height: 20, depth: 10 },
      operatingRange: { minTemp: -40, maxTemp: 100 },
      refrigerants: ['R22', 'R410A', 'R134a', 'R404A'],
      certifications: ['UL', 'CSA'],
      warranty: 1,
      cost: 75,
      notes: 'Replaceable core filter-drier cartridge',
    },
  ],
};

export function getComponentSpecifications(componentId: string): ComponentSpec[] {
  return COMPONENT_SPECIFICATIONS[componentId] || [];
}

export function getComponentSpecById(componentId: string, specIndex: number): ComponentSpec | undefined {
  const specs = COMPONENT_SPECIFICATIONS[componentId];
  return specs ? specs[specIndex] : undefined;
}

export function getSpecificationsByCapacity(minCapacity: number, maxCapacity: number): ComponentSpec[] {
  const allSpecs: ComponentSpec[] = [];
  Object.values(COMPONENT_SPECIFICATIONS).forEach((specs) => {
    allSpecs.push(...specs);
  });
  return allSpecs.filter((spec) => spec.capacity >= minCapacity && spec.capacity <= maxCapacity);
}

export function getSpecificationsByManufacturer(manufacturer: string): ComponentSpec[] {
  const allSpecs: ComponentSpec[] = [];
  Object.values(COMPONENT_SPECIFICATIONS).forEach((specs) => {
    allSpecs.push(...specs);
  });
  return allSpecs.filter((spec) => spec.manufacturer === manufacturer);
}
