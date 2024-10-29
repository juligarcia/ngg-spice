type NestedKeysOf<T> = T extends object
  ? {
      [K in keyof T & (string | number)]: T[K] extends object
        ? `${K}` | `${K}.${NestedKeysOf<T[K]>}`
        : `${K}`;
    }[keyof T & (string | number)]
  : never;

type UnionNestedKeysOf<T> = T extends any ? NestedKeysOf<T> : never;
