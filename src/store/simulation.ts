import {
  SimulationConfig,
  SimulationData,
  SimulationDataPayload,
  SimulationStatusPayload
} from "@/types/simulation";
import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { createSelectors } from "@/utils/zustand";
import { getIdOfType } from "@/utils/simulation";
import { subscribeWithSelector } from "zustand/middleware";

interface SimulationStore {
  simulationsToRun: Map<string, SimulationConfig>;
  setSimulationsToRun(simulationsToRun: Map<string, SimulationConfig>): void;

  enqueueSimulation<T extends SimulationConfig>(
    newSimulationConfig: T,
    isOfType: (config: SimulationConfig) => config is T
  ): void;
  dequeueSimulation(simulationToRemove: string): void;

  simulationStatus: Map<string, SimulationStatusPayload>;
  simulationData: Map<string, Array<SimulationData>>;

  updateSimulationStatus(newStatus: SimulationStatusPayload): void;
  resetSimulations(): void;

  pushSimulationData(newDataItem: SimulationDataPayload): void;
}

const useSimulationStoreBase = create<SimulationStore>()(
  subscribeWithSelector((set) => ({
    simulationsToRun: new Map(),
    setSimulationsToRun: (simulationsToRun) =>
      set(() => {
        return { simulationsToRun: new Map(simulationsToRun) };
      }),

    simulationData: new Map(),
    simulationStatus: new Map(),

    enqueueSimulation: (newSimulationConfig, isOfType) =>
      set((state) => {
        const id = getIdOfType(state.simulationsToRun, isOfType) || uuidv4();

        state.simulationsToRun.set(id, newSimulationConfig);

        return { simulationsToRun: new Map(state.simulationsToRun) };
      }),

    dequeueSimulation: (simulationToRemove) =>
      set((state) => {
        state.simulationsToRun.delete(simulationToRemove);

        return { simulationsToRun: new Map(state.simulationsToRun) };
      }),

    updateSimulationStatus: (newStatus) =>
      set((state) => {
        state.simulationStatus.set(newStatus.id, newStatus);

        return { simulationStatus: new Map(state.simulationStatus) };
      }),

    pushSimulationData: (newDataItem) =>
      set((state) => {
        const current = state.simulationData.get(newDataItem.id) || [];

        current.push(...newDataItem.data);

        state.simulationData.set(newDataItem.id, current);

        return { simulationData: new Map(state.simulationData) };
      }),

    resetSimulations: () =>
      set(() => {
        return { simulationStatus: new Map(), simulationData: new Map() };
      })
  }))
);

export const useSimulationStore = createSelectors(useSimulationStoreBase);
