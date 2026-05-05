import { HVACSystem } from '../types/hvac';

export interface TrainingScenario {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  objective: string;
  system: HVACSystem;
  hints: string[];
  solution: string;
}

export const TRAINING_SCENARIOS: TrainingScenario[] = [
  {
    id: 'scenario-1',
    title: 'Basic System Assembly',
    description: 'Build a simple refrigeration cycle with the four main components',
    difficulty: 'beginner',
    objective: 'Create a system with a compressor, condenser, evaporator, and expansion device, then connect them in the correct order',
    system: {
      id: 'training_1',
      name: 'Basic System Assembly',
      refrigerant: 'R410A',
      components: [],
      connections: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    hints: [
      'Start by adding a compressor',
      'Add a condenser after the compressor',
      'Add an evaporator after the condenser',
      'Add an expansion valve before the evaporator',
      'Connect them in order: Compressor → Condenser → Expansion Valve → Evaporator → Compressor',
    ],
    solution: 'The basic refrigeration cycle flows: Compressor (high pressure) → Condenser (heat rejection) → Expansion Valve (pressure reduction) → Evaporator (heat absorption) → back to Compressor',
  },
  {
    id: 'scenario-2',
    title: 'Identify System Faults',
    description: 'Diagnose issues in a malfunctioning refrigeration system',
    difficulty: 'intermediate',
    objective: 'Use the diagnostics tool to identify what is wrong with this system and suggest fixes',
    system: {
      id: 'training_2',
      name: 'Faulty System Diagnosis',
      refrigerant: 'R22',
      components: [],
      connections: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    hints: [
      'Check if all required components are present',
      'Look at the system health score',
      'Read the diagnostic issues carefully',
      'Consider the refrigerant type',
      'Check if components are properly connected',
    ],
    solution: 'The system uses deprecated R22 refrigerant and may be missing proper connections. Modern systems should use R410A or R134a.',
  },
  {
    id: 'scenario-3',
    title: 'Multi-Compressor System',
    description: 'Design a system with multiple compressors for higher capacity',
    difficulty: 'advanced',
    objective: 'Create a dual-compressor system with proper load balancing and connections',
    system: {
      id: 'training_3',
      name: 'Multi-Compressor System',
      refrigerant: 'R410A',
      components: [],
      connections: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    hints: [
      'Add two compressors to increase capacity',
      'Both compressors should feed into a common discharge line',
      'Use check valves to prevent backflow',
      'Ensure both compressors have suction accumulators',
      'Balance the load between compressors',
    ],
    solution: 'Multi-compressor systems require proper valve arrangements to prevent backflow and ensure balanced operation. Each compressor should have its own suction accumulator.',
  },
  {
    id: 'scenario-4',
    title: 'System Protection',
    description: 'Add protective components to a basic system',
    difficulty: 'intermediate',
    objective: 'Enhance a basic system with filter-driers, accumulators, and other protective devices',
    system: {
      id: 'training_4',
      name: 'Protected System',
      refrigerant: 'R410A',
      components: [],
      connections: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    hints: [
      'Add a suction accumulator to protect the compressor',
      'Add a liquid-line filter-drier to remove moisture',
      'Add a receiver tank for liquid storage',
      'Consider adding a check valve to prevent backflow',
      'Place protective devices strategically',
    ],
    solution: 'Protective components should be placed at critical points: suction accumulator before compressor inlet, filter-drier in liquid line, and receiver tank after condenser.',
  },
  {
    id: 'scenario-5',
    title: 'Troubleshooting High Pressure',
    description: 'Diagnose and fix a system with excessive discharge pressure',
    difficulty: 'advanced',
    objective: 'Identify why discharge pressure is high and make corrections',
    system: {
      id: 'training_5',
      name: 'High Pressure System',
      refrigerant: 'R410A',
      components: [],
      connections: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    hints: [
      'High discharge pressure could indicate condenser issues',
      'Check if the condenser is properly sized',
      'Verify adequate airflow through the condenser',
      'Check for non-condensable gases',
      'Verify refrigerant charge level',
    ],
    solution: 'High discharge pressure typically indicates: inadequate condenser capacity, restricted airflow, non-condensable gases, or overcharge of refrigerant. Verify condenser operation first.',
  },
];

export function getScenarioById(id: string): TrainingScenario | undefined {
  return TRAINING_SCENARIOS.find((s) => s.id === id);
}

export function getScenariosByDifficulty(difficulty: string): TrainingScenario[] {
  return TRAINING_SCENARIOS.filter((s) => s.difficulty === difficulty);
}
