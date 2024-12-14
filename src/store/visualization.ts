import { create } from "zustand";
import { createSelectors } from "@/utils/zustand";
import { Chart } from "chart.js";

interface ChartState {
  chart: Chart;
  lastRendered: number;
}

interface VisualizationStore {
  chartStateMap: Map<string, ChartState>;
  updateChartState(id: string, newChartState: ChartState): void;

  updateDataOnChart(
    simulationId: string,
    data: { x: number; y: number }[]
  ): void;

  updateLastRendered(simulationId: string, lastRendered: number): void;

  triggerUpdate(simulationId: string): void;
}

const useVisualizationStoreBase = create<VisualizationStore>((set) => ({
  chartStateMap: new Map(),

  updateDataOnChart: (simulationId, data) =>
    set((state) => {
      const chartState = state.chartStateMap.get(simulationId);

      if (chartState) {
        chartState.chart.data.datasets[0].data.push(...data);
      }

      return { chartStateMap: new Map(state.chartStateMap) };
    }),

  updateChartState: (simulationId, newChartState) =>
    set((state) => {
      state.chartStateMap.set(simulationId, newChartState);

      return { chartStateMap: new Map(state.chartStateMap) };
    }),

  updateLastRendered: (simulationId, lastRendered) =>
    set((state) => {
      const chartState = state.chartStateMap.get(simulationId);

      if (!chartState) return {};

      chartState.lastRendered = lastRendered;

      return {
        chartStateMap: new Map(state.chartStateMap)
      };
    }),

  triggerUpdate: (simulationId) =>
    set((state) => {
      const chartState = state.chartStateMap.get(simulationId);

      if (!chartState) return {};

      chartState.chart.update();

      return {};
    })
}));

export const useVisualizationStore = createSelectors(useVisualizationStoreBase);
