import { OsType } from "@tauri-apps/api/os";

export type OsHotkeys = Partial<{
  [key in OsType]: string | string[];
}>;

export const osHotkeys = (keys: OsHotkeys, os: OsType | undefined) => {
  return (os && keys[os]) || [];
};
