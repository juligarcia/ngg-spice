import {
  SimulationConfig,
  OperatingPointConfig,
  TransientAnalysisConfig
} from "@/types/simulation";

import _ from "lodash";
import { match } from "ts-pattern";

export const isOpeartingPoint = (
  config: SimulationConfig
): config is OperatingPointConfig => {
  return "Op" in config;
};

export const isTransientAnalysis = (
  config: SimulationConfig
): config is TransientAnalysisConfig => {
  return "Tran" in config;
};

export const checkSimulationUniqueness = (
  config: SimulationConfig,
  storeSimConfigs: Map<string, SimulationConfig>
): boolean => {
  return match(config)
    .with({ Op: {} }, () => {
      for (let [, storedConfig] of storeSimConfigs) {
        console.log(storedConfig, isOpeartingPoint(storedConfig));
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
