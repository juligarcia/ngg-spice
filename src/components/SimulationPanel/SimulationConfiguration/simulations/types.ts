import { SimulationConfig } from "@/types/simulation";

export interface SimulationConfigCommonInterface {
  enqueueSimulation(newSimulationConfig: SimulationConfig): void;
  isEnqueued: boolean;
  dequeueSimulation(id: string): void;
  id: string | null;
}
