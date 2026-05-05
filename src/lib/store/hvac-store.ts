import { create } from 'zustand';
import { HVACSystem, HVACComponent, PipeConnection } from '../types/hvac';
import { globalHistoryManager } from './history-manager';
import { LocalStorageService } from '../storage/local-storage-service';

interface HVACStore {
  currentSystem: HVACSystem | null;
  selectedComponentId: string | null;
  systems: HVACSystem[];
  canUndo: boolean;
  canRedo: boolean;
  searchQuery: string;

  createSystem: (name: string, refrigerant: string) => void;
  loadSystem: (systemId: string) => void;
  saveSystem: (system: HVACSystem) => void;
  deleteSystem: (systemId: string) => void;
  cloneSystem: (systemId: string) => void;
  addComponent: (component: HVACComponent) => void;
  updateComponent: (componentId: string, updates: Partial<HVACComponent>) => void;
  deleteComponent: (componentId: string) => void;
  selectComponent: (componentId: string | null) => void;
  addConnection: (connection: PipeConnection) => void;
  deleteConnection: (connectionId: string) => void;
  undo: () => void;
  redo: () => void;
  hydrate: () => void;
  setSearchQuery: (query: string) => void;
  getFilteredSystems: () => HVACSystem[];
}

export const useHVACStore = create<HVACStore>((set, get) => ({
  currentSystem: null,
  selectedComponentId: null,
  systems: [],
  canUndo: false,
  canRedo: false,
  searchQuery: '',

  hydrate: () => {
    const systems = LocalStorageService.getAllSystems();
    set({ systems });
  },

  createSystem: (name: string, refrigerant: string) => {
    const newSystem: HVACSystem = {
      id: `system_${Date.now()}`,
      name,
      refrigerant: refrigerant as any,
      components: [],
      connections: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    LocalStorageService.saveSystem(newSystem);
    set((state) => {
      const newState = {
        systems: [...state.systems, newSystem],
        currentSystem: newSystem,
      };
      globalHistoryManager.push(newSystem);
      return {
        ...newState,
        canUndo: globalHistoryManager.canUndo(),
        canRedo: globalHistoryManager.canRedo(),
      };
    });
  },

  loadSystem: (systemId: string) => {
    const state = get();
    const system = state.systems.find((s) => s.id === systemId);
    if (system) {
      set({ currentSystem: system });
      globalHistoryManager.clear();
      globalHistoryManager.push(system);
      set({
        canUndo: globalHistoryManager.canUndo(),
        canRedo: globalHistoryManager.canRedo(),
      });
    }
  },

  saveSystem: (system: HVACSystem) => {
    LocalStorageService.saveSystem(system);
    set((state) => {
      const existingIndex = state.systems.findIndex((s) => s.id === system.id);
      const updatedSystems = existingIndex === -1
        ? [...state.systems, system]
        : state.systems.map((s) => (s.id === system.id ? system : s));
      return {
        systems: updatedSystems,
        currentSystem: system,
      };
    });
  },

  deleteSystem: (systemId: string) => {
    LocalStorageService.deleteSystem(systemId);
    set((state) => ({
      systems: state.systems.filter((s) => s.id !== systemId),
      currentSystem: state.currentSystem?.id === systemId ? null : state.currentSystem,
    }));
  },

  cloneSystem: (systemId: string) => {
    const state = get();
    const system = state.systems.find((s) => s.id === systemId);
    if (system) {
      const cloned: HVACSystem = {
        ...system,
        id: `system_${Date.now()}`,
        name: `${system.name} (Copy)`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      LocalStorageService.saveSystem(cloned);
      set((s) => ({
        systems: [...s.systems, cloned],
      }));
    }
  },

  addComponent: (component: HVACComponent) => {
    set((state) => {
      if (!state.currentSystem) return state;
      const updated = {
        ...state.currentSystem,
        components: [...state.currentSystem.components, component],
        updatedAt: Date.now(),
      };
      LocalStorageService.saveSystem(updated);
      globalHistoryManager.push(updated);
      return {
        currentSystem: updated,
        canUndo: globalHistoryManager.canUndo(),
        canRedo: globalHistoryManager.canRedo(),
      };
    });
  },

  updateComponent: (componentId: string, updates: Partial<HVACComponent>) => {
    set((state) => {
      if (!state.currentSystem) return state;
      const updated = {
        ...state.currentSystem,
        components: state.currentSystem.components.map((c) =>
          c.id === componentId ? { ...c, ...updates } : c
        ),
        updatedAt: Date.now(),
      };
      LocalStorageService.saveSystem(updated);
      globalHistoryManager.push(updated);
      return {
        currentSystem: updated,
        canUndo: globalHistoryManager.canUndo(),
        canRedo: globalHistoryManager.canRedo(),
      };
    });
  },

  deleteComponent: (componentId: string) => {
    set((state) => {
      if (!state.currentSystem) return state;
      const updated = {
        ...state.currentSystem,
        components: state.currentSystem.components.filter((c) => c.id !== componentId),
        connections: state.currentSystem.connections.filter(
          (conn) => conn.fromComponentId !== componentId && conn.toComponentId !== componentId
        ),
        updatedAt: Date.now(),
      };
      LocalStorageService.saveSystem(updated);
      globalHistoryManager.push(updated);
      return {
        currentSystem: updated,
        selectedComponentId: null,
        canUndo: globalHistoryManager.canUndo(),
        canRedo: globalHistoryManager.canRedo(),
      };
    });
  },

  selectComponent: (componentId: string | null) => {
    set({ selectedComponentId: componentId });
  },

  addConnection: (connection: PipeConnection) => {
    set((state) => {
      if (!state.currentSystem) return state;
      const updated = {
        ...state.currentSystem,
        connections: [...state.currentSystem.connections, connection],
        updatedAt: Date.now(),
      };
      LocalStorageService.saveSystem(updated);
      globalHistoryManager.push(updated);
      return {
        currentSystem: updated,
        canUndo: globalHistoryManager.canUndo(),
        canRedo: globalHistoryManager.canRedo(),
      };
    });
  },

  deleteConnection: (connectionId: string) => {
    set((state) => {
      if (!state.currentSystem) return state;
      const updated = {
        ...state.currentSystem,
        connections: state.currentSystem.connections.filter((c) => c.id !== connectionId),
        updatedAt: Date.now(),
      };
      LocalStorageService.saveSystem(updated);
      globalHistoryManager.push(updated);
      return {
        currentSystem: updated,
        canUndo: globalHistoryManager.canUndo(),
        canRedo: globalHistoryManager.canRedo(),
      };
    });
  },

  undo: () => {
    const previousState = globalHistoryManager.undo();
    if (previousState) {
      LocalStorageService.saveSystem(previousState);
      set({
        currentSystem: previousState,
        canUndo: globalHistoryManager.canUndo(),
        canRedo: globalHistoryManager.canRedo(),
      });
    }
  },

  redo: () => {
    const nextState = globalHistoryManager.redo();
    if (nextState) {
      LocalStorageService.saveSystem(nextState);
      set({
        currentSystem: nextState,
        canUndo: globalHistoryManager.canUndo(),
        canRedo: globalHistoryManager.canRedo(),
      });
    }
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  getFilteredSystems: () => {
    const state = get();
    const query = state.searchQuery.toLowerCase();
    if (!query) return state.systems;
    return state.systems.filter(
      (system) =>
        system.name.toLowerCase().includes(query) ||
        system.refrigerant.toLowerCase().includes(query) ||
        system.components.some((c) => c.name.toLowerCase().includes(query))
    );
  },
}));
