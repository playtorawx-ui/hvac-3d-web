import { HVACSystem } from '../types/hvac';

const STORAGE_KEY = 'hvac_systems';
const LAST_SYSTEM_KEY = 'hvac_last_system_id';

export class LocalStorageService {
  static getAllSystems(): HVACSystem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load systems from localStorage:', error);
      return [];
    }
  }

  static saveSystem(system: HVACSystem): void {
    try {
      const systems = this.getAllSystems();
      const existingIndex = systems.findIndex((s) => s.id === system.id);

      if (existingIndex === -1) {
        systems.push(system);
      } else {
        systems[existingIndex] = system;
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(systems));
      localStorage.setItem(LAST_SYSTEM_KEY, system.id);
    } catch (error) {
      console.error('Failed to save system to localStorage:', error);
    }
  }

  static getSystem(systemId: string): HVACSystem | null {
    try {
      const systems = this.getAllSystems();
      return systems.find((s) => s.id === systemId) || null;
    } catch (error) {
      console.error('Failed to get system from localStorage:', error);
      return null;
    }
  }

  static deleteSystem(systemId: string): void {
    try {
      const systems = this.getAllSystems();
      const filtered = systems.filter((s) => s.id !== systemId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));

      const lastSystemId = localStorage.getItem(LAST_SYSTEM_KEY);
      if (lastSystemId === systemId) {
        localStorage.removeItem(LAST_SYSTEM_KEY);
      }
    } catch (error) {
      console.error('Failed to delete system from localStorage:', error);
    }
  }

  static getLastSystemId(): string | null {
    try {
      return localStorage.getItem(LAST_SYSTEM_KEY);
    } catch (error) {
      console.error('Failed to get last system ID from localStorage:', error);
      return null;
    }
  }

  static clearAll(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(LAST_SYSTEM_KEY);
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }
}
