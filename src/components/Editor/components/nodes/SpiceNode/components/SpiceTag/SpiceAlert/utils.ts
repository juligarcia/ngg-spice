import {
  CapacitorData,
  InductorData,
  REQUIRED_CAPACITOR_VALUES,
  REQUIRED_INDUCTOR_VALUES,
  REQUIRED_RESISTOR_VALUES,
  REQUIRED_VOLTAGE_SOURCE_VALUES,
  ResistorData,
  VoltageSourceData
} from "@/components/context/SpiceContext";
import { get, isEmpty } from "lodash";

export const getResistorHelperText = (
  data: Partial<ResistorData>,
  name?: string
) => {
  let helperText: string | null = null;

  if (!name) return "All elements must have names";

  for (let key of REQUIRED_RESISTOR_VALUES) {
    if (data[key] === undefined) {
      helperText = "Resistor is not properly configured";
      break;
    }
  }

  return helperText;
};

export const getCapacitorHelperText = (
  data: Partial<CapacitorData>,
  name?: string
) => {
  let helperText: string | null = null;

  if (!name) return "All elements must have names";

  for (let key of REQUIRED_CAPACITOR_VALUES) {
    if (data[key] === undefined) {
      helperText = "Capacitor is not properly configured";
      break;
    }
  }

  return helperText;
};

export const getInductorHelperText = (
  data: Partial<InductorData>,
  name?: string
) => {
  let helperText: string | null = null;

  if (!name) return "All elements must have names";

  for (let key of REQUIRED_INDUCTOR_VALUES) {
    if (data[key] === undefined) {
      helperText = "Inductor is not properly configured";
      break;
    }
  }

  return helperText;
};

export const getVoltageSourceHelperText = (
  data: Partial<VoltageSourceData>,
  name?: string
) => {
  let helperText: string | null = null;

  if (!name) return "All elements must have names";

  if (isEmpty(data)) return "Source is not properly configured";

  for (let key of REQUIRED_VOLTAGE_SOURCE_VALUES) {
    const isComplex = key.includes(".");

    if (isComplex) {
      const [parent] = key.split(".");

      if (data[parent as keyof typeof data] !== undefined) {
        if (get(data, key) === undefined) {
          helperText = "Voltage source is not properly configured";
          break;
        }
      }
    } else if (get(data, key) === undefined) {
      helperText = "Voltage source is not properly configured";
      break;
    }
  }

  return helperText;
};
