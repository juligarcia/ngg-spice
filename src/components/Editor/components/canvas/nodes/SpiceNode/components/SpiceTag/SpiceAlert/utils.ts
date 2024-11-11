import {
  CapacitorData,
  InductorData,
  REQUIRED_CAPACITOR_VALUES,
  REQUIRED_INDUCTOR_VALUES,
  REQUIRED_RESISTOR_VALUES,
  REQUIRED_POWER_SOURCE_VALUES,
  ResistorData,
  PowerSourceData,
  VCVSData,
  REQUIRED_VCVS_VALUES,
  VCISData,
  REQUIRED_VCIS_VALUES,
  ICISData,
  REQUIRED_ICIS_VALUES,
  ICVSData,
  REQUIRED_ICVS_VALUES
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

export const getPowerSourceHelperText = (
  data: Partial<PowerSourceData>,
  name?: string
) => {
  let helperText: string | null = null;

  if (!name) return "All elements must have names";

  if (isEmpty(data)) return "Power source is not properly configured";

  for (let key of REQUIRED_POWER_SOURCE_VALUES) {
    const isComplex = key.includes(".");

    if (isComplex) {
      const [parent, category] = key.split(".");

      if (get(data, `${parent}.${category}`) !== undefined) {
        if (get(data, key) === undefined) {
          helperText = "Power source is not properly configured";
          break;
        }
      }
    } else if (get(data, key) === undefined) {
      helperText = "Power source is not properly configured";
      break;
    }
  }

  return helperText;
};

export const getCurrentSourceHelperText = (
  data: Partial<PowerSourceData>,
  name?: string
) => {
  let helperText: string | null = null;

  if (!name) return "All elements must have names";

  if (isEmpty(data)) return "Source is not properly configured";

  for (let key of REQUIRED_POWER_SOURCE_VALUES) {
    const isComplex = key.includes(".");

    if (isComplex) {
      const [parent, category] = key.split(".");

      if (get(data, `${parent}.${category}`) !== undefined) {
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

export const getVCVSHelperText = (data: Partial<VCVSData>, name?: string) => {
  let helperText: string | null = null;

  if (!name) return "All elements must have names";

  for (let key of REQUIRED_VCVS_VALUES) {
    if (data[key] === undefined) {
      helperText = "Controlled source is not properly configured";
      break;
    }
  }

  return helperText;
};

export const getVCISHelperText = (data: Partial<VCISData>, name?: string) => {
  let helperText: string | null = null;

  if (!name) return "All elements must have names";

  for (let key of REQUIRED_VCIS_VALUES) {
    if (data[key] === undefined) {
      helperText = "Controlled source is not properly configured";
      break;
    }
  }

  return helperText;
};

export const getICISHelperText = (data: Partial<ICISData>, name?: string) => {
  let helperText: string | null = null;

  if (!name) return "All elements must have names";

  for (let key of REQUIRED_ICIS_VALUES) {
    if (data[key] === undefined) {
      helperText = "Controlled source is not properly configured";
      break;
    }
  }

  return helperText;
};

export const getICVSHelperText = (data: Partial<ICVSData>, name?: string) => {
  let helperText: string | null = null;

  if (!name) return "All elements must have names";

  for (let key of REQUIRED_ICVS_VALUES) {
    if (data[key] === undefined) {
      helperText = "Controlled source is not properly configured";
      break;
    }
  }

  return helperText;
};
