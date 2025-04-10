import { openDB, IDBPDatabase } from 'idb';
import { AppError, StorageError } from '../utils/error';
import { Schedule, StorageSchema, StorageKey } from '../types/api';

const DB_NAME = 'TwitchAgendaDB';
const SCHEDULE_STORE = 'schedules';
const DB_VERSION = 1;

class StorageService {
  private db: IDBPDatabase | null = null;
  private isInitialized = false;

  async init() {
    if (this.isInitialized) return;

    try {
      this.db = await openDB(DB_NAME, DB_VERSION, {
        upgrade(db: IDBPDatabase) {
          if (!db.objectStoreNames.contains(SCHEDULE_STORE)) {
            db.createObjectStore(SCHEDULE_STORE, { keyPath: 'streamerId' });
          }
        }
      });
      this.isInitialized = true;
    } catch (error: any) {
      console.error('Failed to initialize IndexedDB:', error);
      this.db = null;
      throw new AppError('Failed to initialize storage', 'STORAGE_INIT_ERROR');
    }
  }

  async setItem<K extends StorageKey>(key: K, value: StorageSchema[K]): Promise<void> {
    localStorage.setItem(key, JSON.stringify(value));
  }

  async getItem<K extends StorageKey>(key: K): Promise<StorageSchema[K] | null> {
    return new Promise((resolve) => {
      const item = localStorage.getItem(key);
      resolve(item ? JSON.parse(item) : null);
    });
  }

  async removeItem(key: StorageKey): Promise<void> {
    localStorage.removeItem(key);
  }

  async clear(): Promise<void> {
    localStorage.clear();
  }

  async setSchedule(streamerId: string, schedule: Schedule): Promise<void> {
    if (!this.db) {
      throw new StorageError('IndexedDB not initialized', 'setSchedule');
    }

    try {
      const tx = this.db.transaction(SCHEDULE_STORE, 'readwrite');
      await tx.store.put(schedule);
      await tx.done;
    } catch (error) {
      console.error(`Failed to set schedule for ${streamerId}:`, error);
      throw new StorageError(`Failed to set schedule for ${streamerId}`, 'setSchedule', error);
    }
  }

  async getSchedule(streamerId: string): Promise<Schedule | undefined> {
    if (!this.db) {
      throw new StorageError('IndexedDB not initialized', 'getSchedule');
    }

    try {
      return await this.db.get(SCHEDULE_STORE, streamerId);
    } catch (error) {
      console.warn(`Failed to get schedule for ${streamerId}:`, error);
      return undefined; // Not throwing an error as it might just not exist
    }
  }

  async deleteSchedule(streamerId: string): Promise<void> {
    if (!this.db) {
      throw new StorageError('IndexedDB not initialized', 'deleteSchedule');
    }

    try {
      const tx = this.db.transaction(SCHEDULE_STORE, 'readwrite');
      await tx.store.delete(streamerId);
      await tx.done;
    } catch (error) {
      console.error(`Failed to delete schedule for ${streamerId}:`, error);
      throw new StorageError(`Failed to delete schedule for ${streamerId}`, 'deleteSchedule', error);
    }
  }
}

export const storage = new StorageService();
