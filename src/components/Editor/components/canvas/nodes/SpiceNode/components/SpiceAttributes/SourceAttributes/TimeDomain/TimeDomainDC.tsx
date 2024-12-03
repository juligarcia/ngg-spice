import FieldContainer from "@/components/ui/FieldContainer";
import { Input } from "@/components/ui/input";
import { Units } from "@/constants/units";
import { FC, useEffect } from "react";
import { TimeDomainAnalysisProps } from "./types";
import { isUnit } from "@/utils/validations";
import _ from "lodash";
import { match } from "ts-pattern";
import { SpiceInstanceName } from "@/components/context/SpiceContext/SpiceContext";

const TimeDomainDC: FC<TimeDomainAnalysisProps> = ({
  register,
  unregister,
  errors,
  type
}) => {
  useEffect(() => () => unregister("time_domain.Dc"), []);

  const unit = match(type)
    .with(SpiceInstanceName.VoltageSource, () => Units.Voltage)
    .otherwise(() => Units.Current);

  return (
    <>
      <FieldContainer
        error={_.get(errors, "time_domain.Dc.value")}
        postfix={unit}
      >
        <Input
          placeholder="DC value"
          {...register("time_domain.Dc.value", {
            setValueAs: (value) => value || undefined,
            required: {
              value: true,
              message: "Source value is required"
            },
            validate: {
              isUnit: isUnit("dc")
            }
          })}
        />
      </FieldContainer>
    </>
  );
};

export default TimeDomainDC;
