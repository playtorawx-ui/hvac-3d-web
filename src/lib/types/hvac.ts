export type Refrigerant = 'R410A' | 'R22' | 'R134a' | 'R404A';

export interface Position3D {
  x: number;
  y: number;
  z: number;
}

export interface Scale3D {
  x: number;
  y: number;
  z: number;
}

export interface Rotation3D {
  x: number;
  y: number;
  z: number;
}

export interface HVACComponent {
  id: string;
  type: string;
  name: string;
  position: Position3D;
  scale?: Scale3D;
  rotation?: Rotation3D;
  properties: Record<string, any>;
  createdAt: number;
  updatedAt: number;
}

export interface PipeConnection {
  id: string;
  fromComponentId: string;
  toComponentId: string;
  type: string;
  properties: Record<string, any>;
  createdAt: number;
  updatedAt: number;
}

export interface HVACSystem {
  id: string;
  name: string;
  refrigerant: Refrigerant;
  components: HVACComponent[];
  connections: PipeConnection[];
  createdAt: number;
  updatedAt: number;
}
