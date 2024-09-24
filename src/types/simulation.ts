export enum Simulation {
  Transient = "tran",
  OperatingPoint = "op"
}

export enum SimulationDisplay {
  tran = "Transient analysis",
  op = "Operating point"
}

type BaseSimulationStatus = {
  id: string;
};

type SourceDeck = {
  status: "SourceDeck";
};

type Ready = {
  status: "Ready";
};

type Progress = {
  status: {
    Progress: {
      simulation_name: Simulation;
      progress: number;
    };
  };
};

export type SimulationStatus = BaseSimulationStatus &
  (SourceDeck | Ready | Progress);

export type OperatingPointConfig = {
  Op: {};
};

export type TransientAnalysisConfig = {
  Tran: {
    tstep: string;
    tstop: string;
    tstart?: string;
    tmax?: string;
    uic?: boolean;
  };
};

export type SimulationConfig = OperatingPointConfig | TransientAnalysisConfig;
