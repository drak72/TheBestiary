import { renderHook, act } from '@testing-library/react-hooks';
import { useLocalStorage } from '../useLocalStorage';

describe('useLocalStorage', () => {
  const key = 'testKey';
  const initialValue = ["1", "2", "3"];

  beforeEach(() => {
    localStorage.clear(); // Clear localStorage before each test
  });

  it('should initialize with the default value', () => {
    const { result } = renderHook(() => useLocalStorage<string[]>({key, initialValue}));
    expect(result.current[0]).toBe(initialValue);
  });

  it('should update the value in localStorage', () => {
    const { result } = renderHook(() => useLocalStorage<string[]>({key, initialValue}));
    
    act(() => {
      result.current[1](['1', '2', '3','4']);
    });

    const storedValue = localStorage.getItem(key);
    expect(storedValue).not.toBeNull();
    expect(JSON.parse(storedValue!)[0]).toBe('1');
  });

  it('should persist the value in localStorage', () => {
    const { result } = renderHook(() => useLocalStorage<string[]>({key, initialValue}));
    
    act(() => {
      result.current[1](['1', '2', '3','4','5']);
    });

    const { result: newResult } = renderHook(() => useLocalStorage<string[]>({key, initialValue}));
    const storedValue = localStorage.getItem(key);
    expect(storedValue).not.toBeNull();
    expect(JSON.parse(storedValue!)[0]).toBe('1');
    expect(newResult.current[0]).toStrictEqual(['1', '2', '3','4','5']);
  });
}); 