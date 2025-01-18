import { useProgramStore } from "@/store/program";
import { SmallsignalParameters, TimeDomainParameters } from "@/types/elements";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";
import { ComponentType } from "react";

export interface Port {
  name?: string;
  x: number;
  y: number;
}

export enum SpiceInstanceName {
  Resistor = "R",
  Inductor = "L",
  Capacitor = "C",
  VoltageSource = "V",
  CurrentSource = "I",
  VCVS = "E",
  VCIS = "G",
  ICVS = "H",
  ICIS = "F",
  // JFET = "J",
  // MOSFET = "M",
  // MESFET = "Z",
  BJT = "Q",
  Ground = "Gnd"
}

export interface SingleValuedElement {
  value: string;
}

export interface ResistorData extends SingleValuedElement {}
export const REQUIRED_RESISTOR_VALUES: Array<keyof ResistorData> = ["value"];

export interface CapacitorData extends SingleValuedElement {}
export const REQUIRED_CAPACITOR_VALUES: Array<keyof CapacitorData> = ["value"];

export interface InductorData extends SingleValuedElement {}
export const REQUIRED_INDUCTOR_VALUES: Array<keyof InductorData> = ["value"];

export interface VCVSData extends SingleValuedElement {}
export const REQUIRED_VCVS_VALUES: Array<keyof VCVSData> = ["value"];

export interface VCISData extends SingleValuedElement {}
export const REQUIRED_VCIS_VALUES: Array<keyof VCISData> = ["value"];

export interface ICISData extends SingleValuedElement {
  src: string;
}
export const REQUIRED_ICIS_VALUES: Array<keyof ICISData> = ["value", "src"];

export interface ICVSData extends SingleValuedElement {
  src: string;
}
export const REQUIRED_ICVS_VALUES: Array<keyof ICVSData> = ["value", "src"];

export type BipolarJunctionTransistorModel = {
  name: string;
  polarity: BipolarJunctionTransistorPolarity;

  // Transport saturation current
  is: string;
  // IS temperature effect exponent
  xti: string;
  // Bandgap voltage (barrier height)
  eg: string;
  // Forward Early voltage
  vaf: string;
  // Ideal maximum forward beta
  bf: string;
  // Base-emitter leakage saturation current
  ise: string;
  // Base-emitter leakage emission coefficient
  ne: string;
  // Corner for forward-beta high-current roll-off
  ikf: string;
  // High-current roll-off coefficient
  nk: string;
  // Forward and reverse beta temperature coefficient
  xtb: string;
  // Ideal maximum reverse beta
  br: string;
  // Base-collector leakage saturation current
  isc: string;
  // Base-collector leakage emission coefficient
  nc: string;
  // Corner for reverse-beta high-current roll-off
  ikr: string;
  // Collector ohmic resistance
  rc: string;
  // Base-collector zero-bias p-n capacitance
  cjc: string;
  // Base-collector p-n grading factor
  mjc: string;
  // Base-collector built-in potential
  vjc: string;
  // Forward-bias depletion capacitor coefficient
  fc: string;
  // Base-emitter zero-bias p-n capacitance
  cje: string;
  // Base-emitter p-n grading factor
  mje: string;
  // Base-emitter built-in potential
  vje: string;
  // Ideal reverse transit time
  tr: string;
  // Ideal forward transit time
  tf: string;
  // Transit time dependency on Ic
  itf: string;
  // Transit time bias dependence coefficient
  xtf: string;
  // Transit time dependency on Vbc
  vtf: string;
  // Zero-bias (maximum) base resistance
  rb: string;
};

export enum BipolarJunctionTransistorPolarity {
  Npn = "NPN",
  Pnp = "PNP"
}

export enum BipolarJunctionTransistorPolarityDisplay {
  NPN = "NPN",
  PNP = "PNP"
}

export interface BipolarJunctionTransistorData {
  model: Partial<BipolarJunctionTransistorModel>;
}
export const REQUIRED_BJT_VALUES: Array<
  UnionNestedKeysOf<BipolarJunctionTransistorData>
> = ["model", "model.name", "model.polarity"];

export type PowerSourceData = {
  time_domain: TimeDomainParameters;
  small_signal: SmallsignalParameters;
};
export const REQUIRED_POWER_SOURCE_VALUES: Array<
  UnionNestedKeysOf<PowerSourceData>
> = [
  "time_domain.Dc.value",
  "time_domain.Pulse.initial_value",
  "time_domain.Pulse.final_value",
  "time_domain.Sin.offset",
  "time_domain.Sin.amplitude",
  "time_domain.Exp.initial_value",
  "time_domain.Exp.final_value",
  "time_domain.Sffm.offset",
  "time_domain.Sffm.amplitude",
  "time_domain.Am.offset",
  "time_domain.Am.amplitude",
  "time_domain.Am.modulating_frequency",
  "small_signal.amplitude"
];

export type SpiceData =
  | { instance_name: SpiceInstanceName.Resistor; data: Partial<ResistorData> }
  | { instance_name: SpiceInstanceName.Capacitor; data: Partial<CapacitorData> }
  | { instance_name: SpiceInstanceName.Inductor; data: Partial<InductorData> }
  | {
      instance_name: SpiceInstanceName.VoltageSource;
      data: Partial<PowerSourceData>;
    }
  | {
      instance_name: SpiceInstanceName.CurrentSource;
      data: Partial<PowerSourceData>;
    }
  | {
      instance_name: SpiceInstanceName.VCVS;
      data: Partial<VCVSData>;
    }
  | {
      instance_name: SpiceInstanceName.VCIS;
      data: Partial<VCISData>;
    }
  | {
      instance_name: SpiceInstanceName.ICVS;
      data: Partial<ICVSData>;
    }
  | {
      instance_name: SpiceInstanceName.ICIS;
      data: Partial<ICISData>;
    }
  | {
      instance_name: SpiceInstanceName.BJT;
      data: Partial<BipolarJunctionTransistorData>;
    }
  | {
      instance_name: SpiceInstanceName.Ground;
      data: Partial<{}>;
    };

export type Symbol =
  | ComponentType
  | {
      key: string;
      variants: {
        [key: string]: ComponentType;
        default: ComponentType;
      };
    };

export type SpiceNodeDefinition = {
  instance_name: SpiceInstanceName;
  symbol: Symbol;
  top_ports: Array<Port>;
  right_ports: Array<Port>;
  bottom_ports: Array<Port>;
  left_ports: Array<Port>;
  dimensions: { width: number; height: number };
};

export type NamedSpiceNode = { name: string };

export type SpiceNode = SpiceNodeDefinition & NamedSpiceNode & SpiceData;

export const SpiceNodeDisplayName: { [key in SpiceInstanceName]: string } = {
  [SpiceInstanceName.Resistor]: "Resistor",
  [SpiceInstanceName.Capacitor]: "Capacitor",
  [SpiceInstanceName.Inductor]: "Inductor",
  [SpiceInstanceName.Ground]: "Ground",
  [SpiceInstanceName.VoltageSource]: "Voltage Source",
  [SpiceInstanceName.CurrentSource]: "Current Source",
  [SpiceInstanceName.VCVS]: "Voltage-Controlled Voltage Source",
  [SpiceInstanceName.VCIS]: "Voltage-Controlled Current Source",
  [SpiceInstanceName.ICIS]: "Current-Controlled Current Source",
  [SpiceInstanceName.ICVS]: "Current-Controlled Voltage Source",
  [SpiceInstanceName.BJT]: "Bipolar Junction Transistor"
};

export const useInitializeModels = (): { isLoading: boolean } => {
  const setBjtModels = useProgramStore.use.setBjtModels();

  const { isPending: isLoadingBjtModels } = useQuery({
    queryKey: ["bjt-models"],
    queryFn: () =>
      invoke<BipolarJunctionTransistorModel[]>("load_bjt_models").then(
        (bjtModels) => {
          setBjtModels(bjtModels);
          return null;
        }
      ),
    refetchOnMount: true
  });

  return { isLoading: isLoadingBjtModels };
};
