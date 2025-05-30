import { OsType } from "@tauri-apps/plugin-os";

export type OsHotkeys = Partial<{
  [key in OsType]: string | string[];
}>;

export const osHotkeys = (
  keys: OsHotkeys,
  os: OsType | undefined
): string | string[] => {
  return (os && keys[os]) || [];
};
