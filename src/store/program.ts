import { create } from "zustand";
import { createSelectors } from "@/utils/zustand";

interface ProgramStore {
  simulationPanelOpen: boolean;
  toggleSimulationPanelOpen(): void;
}

const useProgramStoreBase = create<ProgramStore>((set) => ({
  simulationPanelOpen: false,
  toggleSimulationPanelOpen: () =>
    set((state) => ({ simulationPanelOpen: !state.simulationPanelOpen }))
}));

export const useProgramStore = createSelectors(useProgramStoreBase);
