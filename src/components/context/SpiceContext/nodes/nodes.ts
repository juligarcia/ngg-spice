import { SpiceInstanceName, SpiceNodeDefinition } from "../SpiceContext";
import { BipolarJunctionTransistor } from "./BipolarJunctionTransistor";
import { Capacitor } from "./Capacitor";
import { CurrentControlledCurrentSource } from "./CurrentControlledCurrentSource";
import { CurrentControlledVoltageSource } from "./CurrentControlledVoltageSource";
import { CurrentSource } from "./CurrentSource";
import { Ground } from "./Ground";
import { Inductor } from "./Inductor";
import { Resistor } from "./Resistor";
import { VoltageControlledCurrentSource } from "./VoltageControlledCurrentSource";
import { VoltageControlledVoltageSource } from "./VoltageControlledVoltageSource";
import { VoltageSource } from "./VoltageSource";

export type SpiceContextNodes = {
  [key in SpiceInstanceName]: SpiceNodeDefinition;
};

export const spiceNodes: SpiceContextNodes = {
  R: Resistor,
  C: Capacitor,
  L: Inductor,
  V: VoltageSource,
  I: CurrentSource,
  [SpiceInstanceName.VCVS]: VoltageControlledVoltageSource,
  [SpiceInstanceName.VCIS]: VoltageControlledCurrentSource,
  [SpiceInstanceName.ICVS]: CurrentControlledVoltageSource,
  [SpiceInstanceName.ICIS]: CurrentControlledCurrentSource,
  Gnd: Ground,
  Q: BipolarJunctionTransistor
};
