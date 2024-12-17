import { SimulationData } from "@/types/simulation";
import Dygraph from "dygraphs";
import { Series } from "./TwoDimensionalGraphs/LinearGraph/LinearGraph";

export type PlotState = {
  graph: Dygraph | null;
  data: SimulationData[];
  downSampledData: number[][];
  width: number;
  height: number;
  xAccessor: string;
  series: Series[];
  plotCompletion: number;
  estimatedTotalPoints: number;
  estimatedDensity: number;
  lastDatumIndex: number;
};
