import { useState, useEffect } from 'react';

interface DBConfig {
  dbName: string;
  storeName: string;
  version: number;
}

const defaultConfig: DBConfig = {
  dbName: 'ExpenseTrackerDB',
  storeName: 'settings',
  version: 1,
};

export const useIndexedDB = <T>(key: string, defaultValue: T, config = defaultConfig) => {
  const [value, setValue] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);

  const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(config.dbName, config.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(config.storeName)) {
          db.createObjectStore(config.storeName, { keyPath: 'key' });
        }
      };
    });
  };

  const getItem = async (): Promise<T> => {
    try {
      const db = await openDB();
      const transaction = db.transaction([config.storeName], 'readonly');
      const store = transaction.objectStore(config.storeName);
      const request = store.get(key);
      
      return new Promise((resolve) => {
        request.onsuccess = () => {
          resolve(request.result?.value ?? defaultValue);
        };
        request.onerror = () => resolve(defaultValue);
      });
    } catch {
      return defaultValue;
    }
  };

  const setItem = async (newValue: T): Promise<void> => {
    try {
      const db = await openDB();
      const transaction = db.transaction([config.storeName], 'readwrite');
      const store = transaction.objectStore(config.storeName);
      await store.put({ key, value: newValue });
      setValue(newValue);
    } catch (error) {
      console.error('Error saving to IndexedDB:', error);
    }
  };

  useEffect(() => {
    getItem().then((savedValue) => {
      setValue(savedValue);
      setLoading(false);
    });
  }, [key]);

  return [value, setItem, loading] as const;
};