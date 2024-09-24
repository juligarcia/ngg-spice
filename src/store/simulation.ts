import { SimulationConfig, SimulationStatus } from "@/types/simulation";
import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { createSelectors } from "@/utils/zustand";

interface SimulationStore {
  simulationsToRun: Map<string, SimulationConfig>;

  enqueueSimulation(newSimulationConfig: SimulationConfig): void;
  dequeueSimulation(simulationToRemove: string): void;

  simulationStatus: Map<string, SimulationStatus>;

  updateSimulationStatus(newStatus: SimulationStatus): void;
  resetSimulationStatus(): void;
}

const useSimulationStoreBase = create<SimulationStore>((set) => ({
  simulationsToRun: new Map<string, SimulationConfig>(),

  enqueueSimulation: (newSimulationConfig: SimulationConfig) =>
    set((state) => {
      state.simulationsToRun.set(uuidv4(), newSimulationConfig);

      return { simulationsToRun: new Map(state.simulationsToRun) };
    }),

  dequeueSimulation: (simulationToRemove: string) =>
    set((state) => {
      state.simulationsToRun.delete(simulationToRemove);

      return { simulationsToRun: new Map(state.simulationsToRun) };
    }),

  simulationStatus: new Map<string, SimulationStatus>(),

  updateSimulationStatus: (newStatus: SimulationStatus) =>
    set((state) => {
      state.simulationStatus.set(newStatus.id, newStatus);

      return { simulationStatus: new Map(state.simulationStatus) };
    }),

  resetSimulationStatus: () =>
    set(() => {
      return { simulationStatus: new Map() };
    })
}));

export const useSimulationStore = createSelectors(useSimulationStoreBase);
