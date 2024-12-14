import { SimulationData } from "@/types/simulation";
import Dygraph from "dygraphs";

export type PlotState = {
  graph: Dygraph | null;
  data: SimulationData[];
  downSampledData: [number, number][];
  width: number;
  height: number;
  xAccessor: string;
  yAccessor: string;
  plotCompletion: number;
  estimatedTotalPoints: number;
  estimatedDensity: number;
  lastDatumIndex: number;
};
