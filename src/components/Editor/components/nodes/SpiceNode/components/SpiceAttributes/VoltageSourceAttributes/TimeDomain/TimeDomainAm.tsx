import FieldContainer from "@/components/ui/FieldContainer";
import { Input } from "@/components/ui/input";
import { Units } from "@/constants/units";
import { FC, useEffect } from "react";
import { TimeDomainAnalysisProps } from "./types";
import { isUnit } from "@/utils/validations";
import _ from "lodash";

const TimeDomainAm: FC<TimeDomainAnalysisProps> = ({
  register,
  unregister,
  errors
}) => {
  useEffect(() => () => unregister("time_domain.Am"), []);

  return (
    <>
      <FieldContainer
        error={_.get(errors, "time_domain.Am.amplitude")}
        postfix={Units.Voltage}
      >
        <Input
          placeholder="Amplitude"
          {...register("time_domain.Am.amplitude", {
            setValueAs: (value) => value || undefined,
            required: {
              value: true,
              message: "Amplitude value is required"
            },
            validate: {
              isUnit: isUnit("voltage")
            }
          })}
        />
      </FieldContainer>

      <FieldContainer
        error={_.get(errors, "time_domain.Am.offset")}
        postfix={Units.Voltage}
      >
        <Input
          placeholder="Offset"
          {...register("time_domain.Am.offset", {
            setValueAs: (value) => value || undefined,
            required: {
              value: true,
              message: "Offset is required"
            },
            validate: {
              isUnit: isUnit("voltage")
            }
          })}
        />
      </FieldContainer>

      <FieldContainer
        error={_.get(errors, "time_domain.Am.modulating_frequency")}
        postfix={Units.Frequency}
      >
        <Input
          placeholder="Modulating frequency"
          {...register("time_domain.Am.modulating_frequency", {
            setValueAs: (value) => value || undefined,
            required: {
              value: true,
              message: "Modulating frequency is required"
            },
            validate: {
              isUnit: isUnit("frequency")
            }
          })}
        />
      </FieldContainer>

      <FieldContainer
        error={_.get(errors, "time_domain.Am.carrier_frequency")}
        postfix={Units.Frequency}
      >
        <Input
          placeholder="Carrier frequency"
          {...register("time_domain.Am.carrier_frequency", {
            setValueAs: (value) => value || undefined,
            validate: {
              isUnit: isUnit("frequency")
            }
          })}
        />
      </FieldContainer>

      <FieldContainer
        error={_.get(errors, "time_domain.Am.delay")}
        postfix={Units.Time}
      >
        <Input
          placeholder="Delay"
          {...register("time_domain.Am.delay", {
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

export default TimeDomainAm;
