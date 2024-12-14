import {
  SimulationConfig,
  OperatingPointConfig,
  TransientAnalysisConfig,
  SimulationStatusPayload,
  SmallSignalACAnalysisConfig,
  DistortionAnalysisConfig,
  DCAnalysisConfig,
  NoiseAnalysisConfig,
  PoleZeroAnalysisConfig,
  SensitivityAnalysisConfig
} from "@/types/simulation";

import _ from "lodash";
import { match, P } from "ts-pattern";

export const isOpeartingPoint = (
  config: SimulationConfig
): config is OperatingPointConfig => {
  return "Op" in config;
};

export const isPoleZeroAnalysis = (
  config: SimulationConfig
): config is PoleZeroAnalysisConfig => {
  return "Pz" in config;
};

export const isDistortionAnalysis = (
  config: SimulationConfig
): config is DistortionAnalysisConfig => {
  return "Disto" in config;
};

export const isTransientAnalysis = (
  config: SimulationConfig
): config is TransientAnalysisConfig => {
  return "Tran" in config;
};

export const isNoiseAnalysis = (
  config: SimulationConfig
): config is NoiseAnalysisConfig => {
  return "Noise" in config;
};

export const isSmallSignalACAnalysis = (
  config: SimulationConfig
): config is SmallSignalACAnalysisConfig => {
  return "Ac" in config;
};

export const isSensitivityAnalysis = (
  config: SimulationConfig
): config is SensitivityAnalysisConfig => {
  return "Sens" in config;
};

export const isDCAnalysis = (
  config: SimulationConfig
): config is DCAnalysisConfig => {
  return "Dc" in config;
};

export const isSimulationRunning = (
  status: SimulationStatusPayload | undefined
) =>
  match(status)
    .with(P.nullish, () => false)
    .with({ status: "Ready" }, () => false)
    .otherwise(() => true);

export const anySimulationRunning = (
  statusMap: Map<string, SimulationStatusPayload>
) => {
  for (let [, status] of statusMap) {
    if (isSimulationRunning(status)) return true;
  }

  return false;
};

export const checkSimulationUniqueness = (
  config: SimulationConfig,
  storeSimConfigs: Map<string, SimulationConfig>
): boolean => {
  return match(config)
    .with({ Op: {} }, () => {
      for (let [, storedConfig] of storeSimConfigs) {
        if (isOpeartingPoint(storedConfig)) return false;
      }
      return true;
    })
    .with({ Tran: {} }, () => {
      for (let [, storedConfig] of storeSimConfigs) {
        if (isTransientAnalysis(storedConfig)) return false;
      }
      return true;
    })
    .run();
};

export const hasAnyOfType = <T extends SimulationConfig>(
  storeSimConfigs: Map<string, SimulationConfig>,
  isOfType: (config: SimulationConfig) => config is T
) => {
  for (let [, config] of storeSimConfigs) {
    if (isOfType(config)) return true;
  }

  return false;
};

export const getIdOfType = <T extends SimulationConfig>(
  storeSimConfigs: Map<string, SimulationConfig>,
  isOfType: (config: SimulationConfig) => config is T
): string | null => {
  for (let [id, config] of storeSimConfigs) {
    if (isOfType(config)) return id;
  }

  return null;
};
