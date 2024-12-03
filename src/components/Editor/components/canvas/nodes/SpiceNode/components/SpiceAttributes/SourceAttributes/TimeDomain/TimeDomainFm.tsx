import FieldContainer from "@/components/ui/FieldContainer";
import { Input } from "@/components/ui/input";
import { Units } from "@/constants/units";
import { FC, useEffect } from "react";
import { TimeDomainAnalysisProps } from "./types";
import { isUnit } from "@/utils/validations";
import _ from "lodash";
import { match } from "ts-pattern";
import { SpiceInstanceName } from "@/components/context/SpiceContext/SpiceContext";

const TimeDomainFm: FC<TimeDomainAnalysisProps> = ({
  register,
  unregister,
  errors,
  type
}) => {
  useEffect(() => () => unregister("time_domain.Sffm"), []);

  const unit = match(type)
    .with(SpiceInstanceName.VoltageSource, () => Units.Voltage)
    .otherwise(() => Units.Current);

  return (
    <>
      <FieldContainer
        error={_.get(errors, "time_domain.Sffm.amplitude")}
        postfix={unit}
      >
        <Input
          placeholder="Amplitude"
          {...register("time_domain.Sffm.amplitude", {
            setValueAs: (value) => value || undefined,
            required: {
              value: true,
              message: "Amplitude value is required"
            },
            validate: {
              isUnit: isUnit("amplitude")
            }
          })}
        />
      </FieldContainer>

      <FieldContainer
        error={_.get(errors, "time_domain.Sffm.offset")}
        postfix={unit}
      >
        <Input
          placeholder="Offset"
          {...register("time_domain.Sffm.offset", {
            setValueAs: (value) => value || undefined,
            required: {
              value: true,
              message: "Offset is required"
            },
            validate: {
              isUnit: isUnit("offset")
            }
          })}
        />
      </FieldContainer>

      <FieldContainer
        error={_.get(errors, "time_domain.Sffm.signal_frequency")}
        postfix={Units.Frequency}
      >
        <Input
          placeholder="Signal frequency"
          {...register("time_domain.Sffm.signal_frequency", {
            setValueAs: (value) => value || undefined,
            validate: {
              isUnit: isUnit("frequency")
            }
          })}
        />
      </FieldContainer>

      <FieldContainer
        error={_.get(errors, "time_domain.Sffm.carrier_frequency")}
        postfix={Units.Frequency}
      >
        <Input
          placeholder="Carrier frequency"
          {...register("time_domain.Sffm.carrier_frequency", {
            setValueAs: (value) => value || undefined,
            validate: {
              isUnit: isUnit("frequency")
            }
          })}
        />
      </FieldContainer>

      <FieldContainer
        error={_.get(errors, "time_domain.Sffm.modulation_index")}
        postfix={Units.Unitless}
      >
        <Input
          placeholder="Modulation index"
          {...register("time_domain.Sffm.modulation_index", {
            setValueAs: (value) => value || undefined,
            validate: {
              isUnit: isUnit("modulation")
            }
          })}
        />
      </FieldContainer>
    </>
  );
};

export default TimeDomainFm;
