import FieldContainer from "@/components/ui/FieldContainer";
import { Input } from "@/components/ui/input";
import { Units } from "@/constants/units";
import { FC, useEffect } from "react";
import { TimeDomainAnalysisProps } from "./types";
import { isUnit } from "@/utils/validations";
import _ from "lodash";

const TimeDomainExponential: FC<TimeDomainAnalysisProps> = ({
  register,
  unregister,
  errors
}) => {
  useEffect(() => () => unregister("time_domain.Exp"), []);

  return (
    <>
      <FieldContainer
        error={_.get(errors, "time_domain.Exp.initial_value")}
        postfix={Units.Voltage}
      >
        <Input
          placeholder="Initial value"
          {...register("time_domain.Exp.initial_value", {
            setValueAs: (value) => value || undefined,
            required: {
              value: true,
              message: "Initial value is required"
            },
            validate: {
              isUnit: isUnit("voltage")
            }
          })}
        />
      </FieldContainer>

      <FieldContainer
        error={_.get(errors, "time_domain.Exp.final_value")}
        postfix={Units.Voltage}
      >
        <Input
          placeholder="Final value"
          {...register("time_domain.Exp.final_value", {
            setValueAs: (value) => value || undefined,
            required: {
              value: true,
              message: "Final value is required"
            },
            validate: {
              isUnit: isUnit("voltage")
            }
          })}
        />
      </FieldContainer>

      <FieldContainer
        error={_.get(errors, "time_domain.Exp.rise_time")}
        postfix={Units.Time}
      >
        <Input
          placeholder="Rise time"
          {...register("time_domain.Exp.rise_time", {
            setValueAs: (value) => value || undefined,
            validate: {
              isUnit: isUnit("time")
            }
          })}
        />
      </FieldContainer>

      <FieldContainer
        error={_.get(errors, "time_domain.Exp.rise_delay")}
        postfix={Units.Time}
      >
        <Input
          placeholder="Rise time delay"
          {...register("time_domain.Exp.rise_delay", {
            setValueAs: (value) => value || undefined,
            validate: {
              isUnit: isUnit("time")
            }
          })}
        />
      </FieldContainer>

      <FieldContainer
        error={_.get(errors, "time_domain.Exp.fall_time")}
        postfix={Units.Time}
      >
        <Input
          placeholder="Fall time"
          {...register("time_domain.Exp.fall_time", {
            setValueAs: (value) => value || undefined,
            validate: {
              isUnit: isUnit("time")
            }
          })}
        />
      </FieldContainer>

      <FieldContainer
        error={_.get(errors, "time_domain.Exp.fall_delay")}
        postfix={Units.Time}
      >
        <Input
          placeholder="Fall time delay"
          {...register("time_domain.Exp.fall_delay", {
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

export default TimeDomainExponential;
