import FieldContainer from "@/components/ui/FieldContainer";
import { Input } from "@/components/ui/input";
import { Units } from "@/constants/units";
import { FC, useEffect } from "react";
import { TimeDomainAnalysisProps } from "./types";
import { isUnit } from "@/utils/validations";
import _ from "lodash";
import { match } from "ts-pattern";
import { SpiceInstanceName } from "@/components/context/SpiceContext";

const TimeDomainPulse: FC<TimeDomainAnalysisProps> = ({
  register,
  unregister,
  errors,
  type
}) => {
  useEffect(() => () => unregister("time_domain.Pulse"), []);

  const unit = match(type)
    .with(SpiceInstanceName.VoltageSource, () => Units.Voltage)
    .otherwise(() => Units.Current);

  return (
    <>
      <FieldContainer
        error={_.get(errors, "time_domain.Pulse.initial_value")}
        postfix={unit}
      >
        <Input
          placeholder="Initial value"
          {...register("time_domain.Pulse.initial_value", {
            setValueAs: (value) => value || undefined,
            required: {
              value: true,
              message: "Initial value is required"
            },
            validate: {
              isUnit: isUnit("initial")
            }
          })}
        />
      </FieldContainer>

      <FieldContainer
        error={_.get(errors, "time_domain.Pulse.final_value")}
        postfix={unit}
      >
        <Input
          placeholder="Final value"
          {...register("time_domain.Pulse.final_value", {
            setValueAs: (value) => value || undefined,
            required: {
              value: true,
              message: "Final value is required"
            },
            validate: {
              isUnit: isUnit("final")
            }
          })}
        />
      </FieldContainer>

      <FieldContainer
        error={_.get(errors, "time_domain.Pulse.delay")}
        postfix={Units.Time}
      >
        <Input
          placeholder="Delay"
          {...register("time_domain.Pulse.delay", {
            setValueAs: (value) => value || undefined,
            validate: {
              isUnit: isUnit("time")
            }
          })}
        />
      </FieldContainer>

      <FieldContainer
        error={_.get(errors, "time_domain.Pulse.rise_time")}
        postfix={Units.Time}
      >
        <Input
          placeholder="Rise time"
          {...register("time_domain.Pulse.rise_time", {
            setValueAs: (value) => value || undefined,
            validate: {
              isUnit: isUnit("time")
            }
          })}
        />
      </FieldContainer>

      <FieldContainer
        error={_.get(errors, "time_domain.Pulse.fall_time")}
        postfix={Units.Time}
      >
        <Input
          placeholder="Fall time"
          {...register("time_domain.Pulse.fall_time", {
            setValueAs: (value) => value || undefined,
            validate: {
              isUnit: isUnit("time")
            }
          })}
        />
      </FieldContainer>

      <FieldContainer
        error={_.get(errors, "time_domain.Pulse.pulse_width")}
        postfix={Units.Time}
      >
        <Input
          placeholder="Pulse width"
          {...register("time_domain.Pulse.pulse_width", {
            setValueAs: (value) => value || undefined,
            validate: {
              isUnit: isUnit("time")
            }
          })}
        />
      </FieldContainer>

      <FieldContainer
        error={_.get(errors, "time_domain.Pulse.period")}
        postfix={Units.Time}
      >
        <Input
          placeholder="Period"
          {...register("time_domain.Pulse.period", {
            setValueAs: (value) => value || undefined,
            validate: {
              isUnit: isUnit("time")
            }
          })}
        />
      </FieldContainer>
    </>
  );
};

export default TimeDomainPulse;
