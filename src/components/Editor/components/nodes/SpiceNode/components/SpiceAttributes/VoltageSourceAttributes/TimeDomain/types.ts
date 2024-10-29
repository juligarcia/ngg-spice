import {
  FieldErrors,
  UseFormRegister,
  UseFormUnregister
} from "react-hook-form";
import { VoltageSourceAttributesForm } from "../VoltageSourceAttributes";

export type TimeDomainAnalysisProps = {
  register: UseFormRegister<VoltageSourceAttributesForm>;
  unregister: UseFormUnregister<VoltageSourceAttributesForm>;
  errors: FieldErrors<VoltageSourceAttributesForm>;
};

export type SmallSignalAnalysisProps = {
  register: UseFormRegister<VoltageSourceAttributesForm>;
  unregister: UseFormUnregister<VoltageSourceAttributesForm>;
  errors: FieldErrors<VoltageSourceAttributesForm>;
};
