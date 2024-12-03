import FieldContainer from "@/components/ui/FieldContainer";
import { Input } from "@/components/ui/input";
import { Units } from "@/constants/units";
import { FC, useEffect } from "react";
import { TimeDomainAnalysisProps } from "./types";
import { isUnit } from "@/utils/validations";
import _ from "lodash";
import { match } from "ts-pattern";
import { SpiceInstanceName } from "@/components/context/SpiceContext/SpiceContext";

const TimeDomainSine: FC<TimeDomainAnalysisProps> = ({
  register,
  unregister,
  errors,
  type
}) => {
  useEffect(() => () => unregister("time_domain.Sin"), []);

  const unit = match(type)
    .with(SpiceInstanceName.VoltageSource, () => Units.Voltage)
    .otherwise(() => Units.Current);

  return (
    <>
      <FieldContainer
        error={_.get(errors, "time_domain.Sin.amplitude")}
        postfix={unit}
      >
        <Input
          placeholder="Amplitude"
          {...register("time_domain.Sin.amplitude", {
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
        error={_.get(errors, "time_domain.Sin.offset")}
        postfix={unit}
      >
        <Input
          placeholder="Offset"
          {...register("time_domain.Sin.offset", {
            setValueAs: (value) => value || undefined,
            required: {
              value: true,
              message: "Offset value is required"
            },
            validate: {
              isUnit: isUnit("offset")
            }
          })}
        />
      </FieldContainer>

      <FieldContainer
        error={_.get(errors, "time_domain.Sin.frequency")}
        postfix={Units.Frequency}
      >
        <Input
          placeholder="Frequency"
          {...register("time_domain.Sin.frequency", {
            setValueAs: (value) => value || undefined,
            validate: {
              isUnit: isUnit("frequency")
            }
          })}
        />
      </FieldContainer>

      <FieldContainer
        error={_.get(errors, "time_domain.Sin.delay")}
        postfix={Units.Time}
      >
        <Input
          placeholder="Delay"
          {...register("time_domain.Sin.delay", {
            setValueAs: (value) => value || undefined,
            validate: {
              isUnit: isUnit("time")
            }
          })}
        />
      </FieldContainer>

      <FieldContainer
        error={_.get(errors, "time_domain.Sin.damping_factor")}
        postfix={Units.Time}
      >
        <Input
          placeholder="Damping factor"
          {...register("time_domain.Sin.damping_factor", {
            setValueAs: (value) => value || undefined,
            validate: {
              isUnit: isUnit("damping factor")
            }
          })}
        />
      </FieldContainer>
    </>
  );
};

export default TimeDomainSine;
