export interface ComponentType {
  id: string;
  name: string;
  category: 'compressor' | 'condenser' | 'evaporator' | 'expansion' | 'accumulator' | 'filter' | 'electrical';
  description: string;
  icon: string;
  color: string;
  dimensions: { width: number; height: number; depth: number };
  properties: Record<string, any>;
}

export const COMPONENT_LIBRARY: ComponentType[] = [
  // Compressors
  {
    id: 'reciprocating-compressor',
    name: 'Reciprocating Compressor',
    category: 'compressor',
    description: 'Positive displacement compressor with pistons',
    icon: '⚙️',
    color: '#FF6B6B',
    dimensions: { width: 1, height: 1.2, depth: 0.8 },
    properties: { displacement: 5, efficiency: 0.85 },
  },
  {
    id: 'scroll-compressor',
    name: 'Scroll Compressor',
    category: 'compressor',
    description: 'Smooth operation with two scrolls',
    icon: '🌀',
    color: '#FF8C42',
    dimensions: { width: 0.9, height: 1, depth: 0.7 },
    properties: { displacement: 3.5, efficiency: 0.88 },
  },
  {
    id: 'rotary-compressor',
    name: 'Rotary Compressor',
    category: 'compressor',
    description: 'Compact rotary vane compressor',
    icon: '🔄',
    color: '#FFA500',
    dimensions: { width: 0.8, height: 0.8, depth: 0.6 },
    properties: { displacement: 2.5, efficiency: 0.82 },
  },

  // Condensers
  {
    id: 'air-cooled-condenser',
    name: 'Air-Cooled Condenser',
    category: 'condenser',
    description: 'Heat exchanger with air cooling',
    icon: '❄️',
    color: '#4ECDC4',
    dimensions: { width: 1.2, height: 0.8, depth: 0.6 },
    properties: { capacity: 12000, fanSpeed: 1500 },
  },
  {
    id: 'water-cooled-condenser',
    name: 'Water-Cooled Condenser',
    category: 'condenser',
    description: 'Heat exchanger with water cooling',
    icon: '💧',
    color: '#45B7D1',
    dimensions: { width: 1, height: 0.6, depth: 0.8 },
    properties: { capacity: 50000, waterFlow: 200 },
  },

  // Evaporators
  {
    id: 'direct-expansion-evaporator',
    name: 'Direct Expansion Evaporator',
    category: 'evaporator',
    description: 'Refrigerant directly evaporates in coil',
    icon: '❄️',
    color: '#95E1D3',
    dimensions: { width: 1, height: 0.8, depth: 0.5 },
    properties: { capacity: 12000, efficiency: 0.9 },
  },
  {
    id: 'flooded-evaporator',
    name: 'Flooded Evaporator',
    category: 'evaporator',
    description: 'Refrigerant floods the coil tubes',
    icon: '🌊',
    color: '#38ADA9',
    dimensions: { width: 1.2, height: 0.9, depth: 0.7 },
    properties: { capacity: 50000, efficiency: 0.92 },
  },

  // Expansion Devices
  {
    id: 'thermostatic-expansion-valve',
    name: 'Thermostatic Expansion Valve',
    category: 'expansion',
    description: 'Maintains constant superheat',
    icon: '🎛️',
    color: '#F38181',
    dimensions: { width: 0.3, height: 0.6, depth: 0.3 },
    properties: { capacity: 12000, precision: 'high' },
  },
  {
    id: 'electronic-expansion-valve',
    name: 'Electronic Expansion Valve',
    category: 'expansion',
    description: 'Computer-controlled refrigerant flow',
    icon: '🖥️',
    color: '#AA96DA',
    dimensions: { width: 0.4, height: 0.5, depth: 0.3 },
    properties: { capacity: 50000, controlType: 'electronic' },
  },
  {
    id: 'capillary-tube',
    name: 'Capillary Tube',
    category: 'expansion',
    description: 'Fixed orifice expansion device',
    icon: '📍',
    color: '#FCBAD3',
    dimensions: { width: 0.1, height: 1, depth: 0.1 },
    properties: { diameter: 0.5, length: 5 },
  },

  // Accumulators & Receivers
  {
    id: 'suction-accumulator',
    name: 'Suction Accumulator',
    category: 'accumulator',
    description: 'Protects compressor from liquid',
    icon: '🛡️',
    color: '#FCBAD3',
    dimensions: { width: 0.6, height: 0.8, depth: 0.5 },
    properties: { volume: 5, maxPressure: 500 },
  },
  {
    id: 'receiver-tank',
    name: 'Receiver Tank',
    category: 'accumulator',
    description: 'Stores liquid refrigerant',
    icon: '🏺',
    color: '#F8B500',
    dimensions: { width: 0.5, height: 1, depth: 0.5 },
    properties: { volume: 20, maxPressure: 600 },
  },
  {
    id: 'check-valve',
    name: 'Check Valve',
    category: 'accumulator',
    description: 'Prevents backflow',
    icon: '✓',
    color: '#A8E6CF',
    dimensions: { width: 0.3, height: 0.4, depth: 0.2 },
    properties: { maxPressure: 500, flowDirection: 'one-way' },
  },

  // Filters & Driers
  {
    id: 'filter-drier',
    name: 'Filter-Drier',
    category: 'filter',
    description: 'Removes moisture and particles',
    icon: '🔽',
    color: '#FFE66D',
    dimensions: { width: 0.4, height: 0.6, depth: 0.3 },
    properties: { capacity: 50, microns: 10 },
  },
  {
    id: 'oil-separator',
    name: 'Oil Separator',
    category: 'filter',
    description: 'Separates oil from refrigerant',
    icon: '⛔',
    color: '#95E1D3',
    dimensions: { width: 0.5, height: 0.7, depth: 0.4 },
    properties: { capacity: 100, efficiency: 0.98 },
  },

  // Electrical Components
  {
    id: 'contactor',
    name: 'Contactor',
    category: 'electrical',
    description: 'Electrical switching device',
    icon: '⚡',
    color: '#FFD93D',
    dimensions: { width: 0.4, height: 0.5, depth: 0.3 },
    properties: { voltage: 480, amps: 30 },
  },
  {
    id: 'overload-protector',
    name: 'Overload Protector',
    category: 'electrical',
    description: 'Protects motor from overload',
    icon: '🔌',
    color: '#FF6B9D',
    dimensions: { width: 0.3, height: 0.4, depth: 0.2 },
    properties: { amps: 25, tripPoint: 1.3 },
  },
  {
    id: 'capacitor',
    name: 'Run Capacitor',
    category: 'electrical',
    description: 'Improves motor efficiency and power factor',
    icon: '🔋',
    color: '#6BCB77',
    dimensions: { width: 0.2, height: 0.4, depth: 0.2 },
    properties: { microfarads: 35, voltage: 440 },
  },
  {
    id: 'start-capacitor',
    name: 'Start Capacitor',
    category: 'electrical',
    description: 'Provides starting torque to motor',
    icon: '⚡',
    color: '#4D96FF',
    dimensions: { width: 0.25, height: 0.45, depth: 0.25 },
    properties: { microfarads: 88, voltage: 440 },
  },
  {
    id: 'transformer',
    name: 'Control Transformer',
    category: 'electrical',
    description: 'Steps down voltage for control circuits',
    icon: '🔀',
    color: '#9B59B6',
    dimensions: { width: 0.5, height: 0.6, depth: 0.4 },
    properties: { primaryVoltage: 480, secondaryVoltage: 120 },
  },
  {
    id: 'disconnect-switch',
    name: 'Disconnect Switch',
    category: 'electrical',
    description: 'Isolates equipment for maintenance',
    icon: '🔐',
    color: '#E74C3C',
    dimensions: { width: 0.4, height: 0.6, depth: 0.3 },
    properties: { voltage: 480, amps: 60 },
  },
  {
    id: 'pressure-switch',
    name: 'Pressure Switch',
    category: 'electrical',
    description: 'Monitors system pressure',
    icon: '📊',
    color: '#3498DB',
    dimensions: { width: 0.3, height: 0.4, depth: 0.2 },
    properties: { minPressure: 50, maxPressure: 500 },
  },
  {
    id: 'temperature-sensor',
    name: 'Temperature Sensor',
    category: 'electrical',
    description: 'Monitors system temperature',
    icon: '🌡️',
    color: '#E67E22',
    dimensions: { width: 0.2, height: 0.3, depth: 0.1 },
    properties: { minTemp: -40, maxTemp: 150 },
  },
  {
    id: 'motor-starter',
    name: 'Motor Starter',
    category: 'electrical',
    description: 'Soft-start device for compressor motor',
    icon: '⚙️',
    color: '#1ABC9C',
    dimensions: { width: 0.6, height: 0.7, depth: 0.4 },
    properties: { voltage: 480, amps: 40, rampTime: 10 },
  },
];

export function getComponentsByCategory(category: string): ComponentType[] {
  return COMPONENT_LIBRARY.filter((comp) => comp.category === category);
}

export function getComponentById(id: string): ComponentType | undefined {
  return COMPONENT_LIBRARY.find((comp) => comp.id === id);
}
