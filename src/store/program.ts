import { create } from "zustand";
import { createSelectors } from "@/utils/zustand";
import { BipolarJunctionTransistorModel } from "@/components/context/SpiceContext/SpiceContext";

interface ProgramStore {
  simulationPanelOpen: boolean;
  toggleSimulationPanelOpen(): void;

  bjtModels: BipolarJunctionTransistorModel[];
  setBjtModels(bjtModels: BipolarJunctionTransistorModel[]): void;
  updateBjtModel(bjtModel: BipolarJunctionTransistorModel): void;

  showShortcutsDialog: boolean;
  setShortcutsDialogOpen(open: boolean): void;
}

const useProgramStoreBase = create<ProgramStore>((set) => ({
  simulationPanelOpen: false,
  toggleSimulationPanelOpen: () =>
    set((state) => ({ simulationPanelOpen: !state.simulationPanelOpen })),

  bjtModels: [],
  setBjtModels: (bjtModels) => set(() => ({ bjtModels })),
  updateBjtModel: (bjtModel) =>
    set((state) => {
      const bjtModels = state.bjtModels.filter(
        ({ name }) => name !== bjtModel.name
      );

      bjtModels.push(bjtModel);

      return { bjtModels };
    }),

  showShortcutsDialog: false,
  setShortcutsDialogOpen: (open) => set(() => ({ showShortcutsDialog: open }))
}));

export const useProgramStore = createSelectors(useProgramStoreBase);
