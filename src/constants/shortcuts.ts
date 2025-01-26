import { OsHotkeys } from "@/utils/hotkeys";

export enum ShortcutCateogory {
  CircuitElements = "CircuitElements",
  Layout = "Layout",
  Editor = "Editor",
  Miscellanous = "Miscellanous"
}

export enum ShortcutCateogoryDisplay {
  CircuitElements = "Circuit Elements",
  Layout = "Layout",
  Editor = "Editor",
  Miscellanous = "Miscellanous"
}

export enum AvailableShortcuts {
  ShowShortcuts = "ShowShortcuts",

  FocusLayout = "FocusLayout",
  Rows2Layout = "Rows2Layout",
  Columns2Layout = "Columns2Layout",
  Columns3Layout = "Columns3Layout",
  Grid2x2Layout = "Grid2x2Layout",

  PlaceResistor = "PlaceResistor",
  PlaceCapacitor = "PlaceCapacitor",
  PlaceInductor = "PlaceInductor",
  PlaceVoltageSource = "PlaceVoltageSource",
  PlaceCurrentSource = "PlaceCurrentSource",
  PlaceBJT = "PlaceBJT",
  PlaceVCVS = "PlaceVCVS",
  PlaceVCIS = "PlaceVCIS",
  PlaceICVS = "PlaceICVS",
  PlaceICIS = "PlaceICIS",
  PlaceGround = "PlaceGround",
  PlaceTag = "PlaceTag",

  RotateElement = "RotateElement",
  ToggleSimulationPanel = "ToggleSimulationPanel",
  CenterSchematic = "CenterSchematic"
}

export type Shortcut = {
  osHotKeys: OsHotkeys;
  functionality: string;
  category: ShortcutCateogory;
  delay?: number;
  specialIndication?: string;
};

export const Shortcuts: Record<AvailableShortcuts, Shortcut> = {
  [AvailableShortcuts.FocusLayout]: {
    osHotKeys: { macos: "meta+1", windows: "alt+1", linux: "alt+1" },
    functionality: "Focus layout (only editor)",
    category: ShortcutCateogory.Layout
  },

  [AvailableShortcuts.Rows2Layout]: {
    osHotKeys: { macos: "meta+2", windows: "alt+2", linux: "alt+2" },
    functionality: "Two rows layout",
    category: ShortcutCateogory.Layout
  },

  [AvailableShortcuts.Columns2Layout]: {
    osHotKeys: { macos: "meta+3", windows: "alt+3", linux: "alt+3" },
    functionality: "Two columns layout",
    category: ShortcutCateogory.Layout
  },

  [AvailableShortcuts.Columns3Layout]: {
    osHotKeys: { macos: "meta+4", windows: "alt+4", linux: "alt+4" },
    functionality: "Three columns layout",
    category: ShortcutCateogory.Layout
  },

  [AvailableShortcuts.Grid2x2Layout]: {
    osHotKeys: { macos: "meta+5", windows: "alt+4", linux: "alt+4" },
    functionality: "2x2 Grid layout",
    category: ShortcutCateogory.Layout
  },

  [AvailableShortcuts.ShowShortcuts]: {
    osHotKeys: { macos: "meta", windows: "alt", linux: "alt" },
    functionality: "Show available shortcuts",
    delay: 1000,
    category: ShortcutCateogory.Miscellanous
  },

  [AvailableShortcuts.PlaceResistor]: {
    osHotKeys: { macos: "r", windows: "r", linux: "r" },
    functionality: "Resistor",
    category: ShortcutCateogory.CircuitElements
  },

  [AvailableShortcuts.PlaceCapacitor]: {
    osHotKeys: { macos: "c", windows: "c", linux: "c" },
    functionality: "capacitor",
    category: ShortcutCateogory.CircuitElements
  },

  [AvailableShortcuts.PlaceInductor]: {
    osHotKeys: { macos: "l", windows: "l", linux: "l" },
    functionality: "Inductor",
    category: ShortcutCateogory.CircuitElements
  },

  [AvailableShortcuts.PlaceVoltageSource]: {
    osHotKeys: { macos: "v", windows: "v", linux: "v" },
    functionality: "Voltage source",
    category: ShortcutCateogory.CircuitElements
  },

  [AvailableShortcuts.PlaceCurrentSource]: {
    osHotKeys: { macos: "i", windows: "i", linux: "i" },
    functionality: "Current source",
    category: ShortcutCateogory.CircuitElements
  },

  [AvailableShortcuts.PlaceBJT]: {
    osHotKeys: { macos: "q", windows: "q", linux: "q" },
    functionality: "Bipolar junction transistor",
    category: ShortcutCateogory.CircuitElements
  },

  [AvailableShortcuts.PlaceVCVS]: {
    osHotKeys: { macos: "e", windows: "e", linux: "e" },
    functionality: "Voltage controlled voltage source",
    category: ShortcutCateogory.CircuitElements
  },

  [AvailableShortcuts.PlaceVCIS]: {
    osHotKeys: { macos: "g", windows: "g", linux: "g" },
    functionality: "Voltage controlled current source",
    category: ShortcutCateogory.CircuitElements
  },

  [AvailableShortcuts.PlaceICVS]: {
    osHotKeys: { macos: "h", windows: "h", linux: "h" },
    functionality: "Current controlled voltage source",
    category: ShortcutCateogory.CircuitElements
  },

  [AvailableShortcuts.PlaceICIS]: {
    osHotKeys: { macos: "f", windows: "f", linux: "f" },
    functionality: "Current controlled current source",
    category: ShortcutCateogory.CircuitElements
  },

  [AvailableShortcuts.PlaceGround]: {
    osHotKeys: { macos: "meta+g", windows: "alt+g", linux: "alt+g" },
    functionality: "Ground",
    category: ShortcutCateogory.CircuitElements
  },

  [AvailableShortcuts.PlaceTag]: {
    osHotKeys: { macos: "t", windows: "t", linux: "t" },
    functionality: "Node tag",
    category: ShortcutCateogory.CircuitElements
  },

  [AvailableShortcuts.RotateElement]: {
    osHotKeys: { macos: "meta+r", windows: "alt+r", linux: "alt+r" },
    functionality: "Rotate",
    category: ShortcutCateogory.Editor,
    specialIndication: "when dragging or selecting element"
  },

  [AvailableShortcuts.ToggleSimulationPanel]: {
    osHotKeys: { macos: "meta+s", windows: "alt+s", linux: "alt+s" },
    functionality: "Open/Close simulation panel",
    category: ShortcutCateogory.Editor
  },

  [AvailableShortcuts.CenterSchematic]: {
    osHotKeys: { macos: "meta+c", windows: "alt+c", linux: "alt+c" },
    functionality: "Center schematic",
    category: ShortcutCateogory.Editor
  }
};

export const keysToSpecialCharacterMapper: Record<string, OsHotkeys> = {
  meta: { macos: "⌘" },
  alt: { macos: "⌥", windows: "alt", linux: "alt" },
  shift: { macos: "⇧", windows: "shift", linux: "shift" },
  ctrl: { macos: "⌃", windows: "ctrl", linux: "ctrl" }
};
