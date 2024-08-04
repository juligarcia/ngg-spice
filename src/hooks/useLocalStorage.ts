import type { Dispatch, SetStateAction } from "react";
import { useCallback, useState } from "react";

type Initializer<T> = T | (() => T);

export const useLocalStorage = <T = string>(
  key: string,
  defaultValue: Initializer<T>,
  parser: (value: string) => T
): [T, Dispatch<SetStateAction<T>>] => {
  const [state, innerSetState] = useState<T>(() => {
    const localItem = localStorage.getItem(key);

    if (!localItem) {
      return defaultValue instanceof Function ? defaultValue() : defaultValue;
    }

    return parser(localItem);
  });

  const setState = useCallback(
    (newState: SetStateAction<T>) => {
      if (newState instanceof Function) {
        innerSetState((prev) => {
          localStorage.setItem(key, JSON.stringify(newState(prev)));
          return newState(prev) as T;
        });
      } else {
        innerSetState(newState);
        localStorage.setItem(key, JSON.stringify(newState));
      }
    },
    [key]
  );

  return [state, setState];
};
