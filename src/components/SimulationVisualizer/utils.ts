import { SimulationConfig, SimulationDisplay } from "@/types/simulation";
import { match, P } from "ts-pattern";

export const simulationConfig2Name = (simulationConfig: SimulationConfig) =>
  match(simulationConfig)
    .with({ Tran: P.nonNullable }, () => SimulationDisplay.tran)
    .with({ Ac: P.nonNullable }, () => SimulationDisplay.ac)
    .with({ Dc: P.nonNullable }, () => SimulationDisplay.dc)
    .with({ Disto: P.nonNullable }, () => SimulationDisplay.disto)
    .with({ Noise: P.nonNullable }, () => SimulationDisplay.noise)
    .with({ Op: P.nonNullable }, () => SimulationDisplay.op)
    .with({ Pz: P.nonNullable }, () => SimulationDisplay.pz)
    .with({ Sens: P.nonNullable }, () => SimulationDisplay.sens)
    .run();
