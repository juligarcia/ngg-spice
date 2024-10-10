export enum Simulation {
  Transient = "tran",
  OperatingPoint = "op",
  SmallSignalAC = "ac",
  DC = "dc",
  Distortion = "disto",
  Noise = "noise",
  PoleZero = "pz",
  Sensitivity = "sens"
}

export enum SimulationDisplay {
  tran = "Transient analysis",
  op = "Operating point",
  ac = "Small signal AC analysis",
  dc = "DC analysis",
  disto = "Distortion analysis",
  noise = "Noise analysis",
  pz = "Pole-Zero analysis",
  sens = "Senitivity analysis"
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

export enum FrequencyVariation {
  Decade = "Dec",
  Octave = "Oct",
  Linear = "Lin"
}

export enum FrequencyVariationDisplay {
  Dec = "Decade",
  Oct = "Octave",
  Lin = "Linear"
}

export enum TransferFunction {
  Voltage = "Vol",
  Current = "Cur"
}

export enum TransferFunctionDisplay {
  Vol = "V/V",
  Cur = "V/I"
}

export enum PoleZeroAnalysisType {
  Poles = "Pol",
  Zeros = "Zer",
  PolesAndZeros = "Pz"
}

export enum PoleZeroAnalysisTypeDisplay {
  Pol = "Poles",
  Zer = "Zeros",
  Pz = "Poles and zeros"
}

export enum SensitivityAnalysisType {
  AC = "Ac",
  DC = "Dc"
}

export enum SensitivityAnalysisTypeDisplay {
  Ac = "AC",
  Dc = "DC"
}

export enum CurrentOrVoltage {
  I = "I",
  V = "V"
}

export enum CurrentOrVoltageDisplay {
  V = "Voltage",
  I = "Current"
}

export type SmallSignalACAnalysisConfig = {
  Ac: {
    fstart: string;
    fstop: string;
    variation: FrequencyVariation;
    nx: number;
  };
};

export type DCAnalysisConfig = {
  Dc: {
    // Is the name of an independent voltage or current source,
    // a resistor, or the circuit temperature.
    srcnam: string;
    vstart: string;
    vstop: string;
    vincr: string;

    //  A second source (src2) may optionally be specified with its
    // own associated sweep parameters. In such a case the first source
    // is swept over its own range for each value of the second source.
    src2?: string;
    start2?: string;
    stop2?: string;
    incr2?: string;
  };
};

export type DistortionAnalysisConfig = {
  Disto: {
    fstart: string;
    fstop: string;
    variation: FrequencyVariation;
    nx: number;
    // If the optional f2overf1 parameter is specified, it should be a real number between (and not equal to) 0.0 and 1.0
    f2overf1?: number;
  };
};

export type NoiseAnalysisConfig = {
  Noise: {
    output: string;
    // Defaults to GND

    oref?: string;

    src: string;
    variation: FrequencyVariation;
    pts: number;
    fstart: string;
    fstop: string;

    pts_per_summary?: number;
  };
};

export type PoleZeroAnalysisConfig = {
  Pz: {
    node1: string;
    node2: string;
    node3: string;
    node4: string;
    transfer_function: TransferFunction;
    analysis_type: PoleZeroAnalysisType;
  };
};

export type SensitivityAnalysisConfig = {
  Sens: {
    output_type: CurrentOrVoltage;
    output: string;
    analysis_type: SensitivityAnalysisType;

    // Same as Ac
    fstart?: string;
    fstop?: string;
    variation?: FrequencyVariation;
    nx?: number;
  };
};

export type SimulationConfig =
  | OperatingPointConfig
  | TransientAnalysisConfig
  | SmallSignalACAnalysisConfig
  | DCAnalysisConfig
  | DistortionAnalysisConfig
  | NoiseAnalysisConfig
  | PoleZeroAnalysisConfig
  | SensitivityAnalysisConfig;
