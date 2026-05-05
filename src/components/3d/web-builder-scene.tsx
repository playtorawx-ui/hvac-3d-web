import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useHVACStore } from '../../lib/store/hvac-store';
import { getComponentById } from '../../lib/data/component-library';
import { renderConnections } from './pipe-renderer';

export function WebBuilderScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { currentSystem, selectedComponentId, selectComponent, addConnection } = useHVACStore();
  const [connectMode, setConnectMode] = useState(false);
  const [firstComponent, setFirstComponent] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current || !currentSystem) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Add grid helper
    const gridHelper = new THREE.GridHelper(10, 10, 0xcccccc, 0xeeeeee);
    scene.add(gridHelper);

    // Add components
    const meshes: THREE.Mesh[] = [];
    currentSystem.components.forEach((component) => {
      const componentType = getComponentById(component.type);
      const colorHex = componentType ? componentType.color : '#6c757d';
      const color = parseInt(colorHex.replace('#', '0x'), 16);
      const isSelected = selectedComponentId === component.id;

      const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
      const material = new THREE.MeshStandardMaterial({
        color: isSelected ? 0x0a7ea4 : color,
        emissive: isSelected ? 0x0a7ea4 : 0x000000,
        emissiveIntensity: isSelected ? 0.3 : 0,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(component.position.x, component.position.y, component.position.z);
      (mesh as any).userData = { componentId: component.id };
      scene.add(mesh);
      meshes.push(mesh);
    });

    // Render pipe connections
    const connectionMeshes = renderConnections(currentSystem.connections, currentSystem, scene);

    // Handle mouse clicks
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children);

      if (intersects.length > 0) {
        const object = intersects[0].object as any;
        if (object.userData?.componentId) {
          if (connectMode) {
            if (!firstComponent) {
              setFirstComponent(object.userData.componentId);
            } else if (firstComponent !== object.userData.componentId) {
              addConnection({
                id: `connection_${Date.now()}`,
                fromComponentId: firstComponent,
                toComponentId: object.userData.componentId,
                type: 'pipe',
                properties: {},
                createdAt: Date.now(),
                updatedAt: Date.now(),
              });
              setConnectMode(false);
              setFirstComponent(null);
            }
          } else {
            selectComponent(object.userData.componentId);
          }
        }
      }
    };

    renderer.domElement.addEventListener('click', onMouseClick);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      const newWidth = containerRef.current?.clientWidth || width;
      const newHeight = containerRef.current?.clientHeight || height;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', onMouseClick);
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      meshes.forEach(mesh => {
        mesh.geometry.dispose();
        (mesh.material as THREE.Material).dispose();
      });
      connectionMeshes.forEach(mesh => {
        if (mesh instanceof THREE.Mesh) {
          mesh.geometry.dispose();
          (mesh.material as THREE.Material).dispose();
        }
      });
      renderer.dispose();
    };
  }, [currentSystem, selectedComponentId, selectComponent, addConnection, connectMode, firstComponent]);

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />
      {connectMode && (
        <div className="absolute top-4 left-4 bg-warning text-white px-4 py-2 rounded-lg">
          {firstComponent ? 'Click second component to connect' : 'Click first component to connect'}
        </div>
      )}
      <button
        onClick={() => {
          setConnectMode(!connectMode);
          setFirstComponent(null);
        }}
        className={`absolute bottom-4 right-4 px-4 py-2 rounded-lg font-semibold transition ${
          connectMode
            ? 'bg-warning text-white'
            : 'bg-primary text-white hover:opacity-90'
        }`}
      >
        {connectMode ? 'Cancel Connection' : 'Connect Components'}
      </button>
    </div>
  );
}
