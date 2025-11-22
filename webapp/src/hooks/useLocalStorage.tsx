import { SetStateAction, useEffect, useState } from "react";

interface LocalStorage {
  key: string;
  default?: object | [];
}

/**
 * Local storage hook that exposes a key specific API.
 * Stores values within the key as a stringified JSON array or object;
 *
 * Effectively a useState proxy that persists as Stringified JSON to local storage.
 * @param key
 * @returns
 */
export const useLocalStorage = <T,>({ key, default: defaultValue = [] }: LocalStorage) => {
  const hydrated = localStorage.getItem(key);
  const [data, setData] = useState<T>((hydrated && JSON.parse(hydrated)) || defaultValue as T);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(data));
  }, [data, key]);

  return [data, setData] as [T, React.Dispatch<SetStateAction<T>>];
};
