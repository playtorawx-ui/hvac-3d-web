import * as THREE from 'three';
import { PipeConnection, HVACSystem, HVACComponent } from '../../lib/types/hvac';

export function createPipeMesh(
  connection: PipeConnection,
  system: HVACSystem,
  scene: THREE.Scene
): THREE.Line | null {
  const fromComponent = system.components.find((c) => c.id === connection.fromComponentId);
  const toComponent = system.components.find((c) => c.id === connection.toComponentId);

  if (!fromComponent || !toComponent) return null;

  const points = [
    new THREE.Vector3(fromComponent.position.x, fromComponent.position.y, fromComponent.position.z),
    new THREE.Vector3(toComponent.position.x, toComponent.position.y, toComponent.position.z),
  ];

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: 0x888888, linewidth: 2 });
  const line = new THREE.Line(geometry, material);

  scene.add(line);
  return line;
}

export function createTubeMesh(
  connection: PipeConnection,
  system: HVACSystem,
  scene: THREE.Scene
): THREE.Mesh | null {
  const fromComponent = system.components.find((c) => c.id === connection.fromComponentId);
  const toComponent = system.components.find((c) => c.id === connection.toComponentId);

  if (!fromComponent || !toComponent) return null;

  const start = new THREE.Vector3(fromComponent.position.x, fromComponent.position.y, fromComponent.position.z);
  const end = new THREE.Vector3(toComponent.position.x, toComponent.position.y, toComponent.position.z);

  const distance = start.distanceTo(end);
  const midpoint = start.clone().add(end).multiplyScalar(0.5);

  const geometry = new THREE.CylinderGeometry(0.05, 0.05, distance, 8);
  const material = new THREE.MeshStandardMaterial({ color: 0x888888 });
  const mesh = new THREE.Mesh(geometry, material);

  mesh.position.copy(midpoint);
  mesh.lookAt(end);
  mesh.rotateX(Math.PI / 2);

  scene.add(mesh);
  return mesh;
}

export function renderConnections(
  connections: PipeConnection[],
  system: HVACSystem,
  scene: THREE.Scene
): THREE.Object3D[] {
  const meshes: THREE.Object3D[] = [];

  connections.forEach((connection) => {
    const tube = createTubeMesh(connection, system, scene);
    if (tube) meshes.push(tube);
  });

  return meshes;
}
