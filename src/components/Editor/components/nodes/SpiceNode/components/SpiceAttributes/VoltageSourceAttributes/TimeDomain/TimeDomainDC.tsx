import FieldContainer from "@/components/ui/FieldContainer";
import { Input } from "@/components/ui/input";
import { Units } from "@/constants/units";
import { FC, useEffect } from "react";
import { TimeDomainAnalysisProps } from "./types";
import { isUnit } from "@/utils/validations";
import _ from "lodash";

const TimeDomainDC: FC<TimeDomainAnalysisProps> = ({
  register,
  unregister,
  errors
}) => {
  useEffect(() => () => unregister("time_domain.Dc"), []);

  return (
    <>
      <FieldContainer
        error={_.get(errors, "time_domain.Dc.value")}
        postfix={Units.Voltage}
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
              isUnit: isUnit("voltage")
            }
          })}
        />
      </FieldContainer>
    </>
  );
};

export default TimeDomainDC;
