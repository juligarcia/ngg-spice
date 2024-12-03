import {
  FieldErrors,
  UseFormRegister,
  UseFormUnregister
} from "react-hook-form";
import { PowerSourceAttributesForm } from "../PowerSourceAttributes";
import { SpiceInstanceName } from "@/components/context/SpiceContext/SpiceContext";

export type TimeDomainAnalysisProps = {
  register: UseFormRegister<PowerSourceAttributesForm>;
  unregister: UseFormUnregister<PowerSourceAttributesForm>;
  errors: FieldErrors<PowerSourceAttributesForm>;
  type: SpiceInstanceName.VoltageSource | SpiceInstanceName.CurrentSource;
};

export type SmallSignalAnalysisProps = {
  register: UseFormRegister<PowerSourceAttributesForm>;
  unregister: UseFormUnregister<PowerSourceAttributesForm>;
  errors: FieldErrors<PowerSourceAttributesForm>;
  type: SpiceInstanceName.VoltageSource | SpiceInstanceName.CurrentSource;

};
