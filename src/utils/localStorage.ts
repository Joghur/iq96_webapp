import {useCallback, useState, useEffect} from 'react';

export const LOCALSTORAGE_PREFIX = 'iq96webapp';

export const useLocalStorage = <T>(key: string, defaultValue: T) => {
  return useStorage(key, defaultValue, window.localStorage);
};

const useStorage = <T>(
  key: string,
  defaultValue: T,
  storageObject: Storage,
) => {
  const [value, setValue] = useState(() => {
    const jsonValue = storageObject.getItem(key);
    if (jsonValue != null) {
      return JSON.parse(jsonValue);
    }

    if (typeof defaultValue === 'function') {
      return defaultValue();
    } else {
      return defaultValue;
    }
  });

  useEffect(() => {
    if (value === undefined) {
      return storageObject.removeItem(key);
    }
    storageObject.setItem(key, JSON.stringify(value));
  }, [key, value, storageObject]);

  const remove = useCallback(() => {
    setValue(undefined);
  }, []);

  return [value, setValue, remove];
};

export const getLocalStorage = <T>(key: string) => {
  const res = localStorage.getItem(key);

  try {
    if (res) {
      return JSON.parse(res) as T;
    }
  } catch (error) {
    // console.log('getStorage error: ', error);
    console.log('Local Storage error');
  }
  return null;
};

export const setLocalStorage = <T>(key: string, obj: T) => {
  if (key) {
    localStorage.setItem(key, JSON.stringify(obj));
    return obj;
  }
  return null;
};
