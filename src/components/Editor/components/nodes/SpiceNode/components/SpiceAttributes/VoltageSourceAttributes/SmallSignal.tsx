import FieldContainer from "@/components/ui/FieldContainer";
import { Input } from "@/components/ui/input";
import { Units } from "@/constants/units";
import { FC, useEffect } from "react";
import { SmallSignalAnalysisProps } from "./TimeDomain/types";
import { isUnit } from "@/utils/validations";
import _ from "lodash";

const SmallSignal: FC<SmallSignalAnalysisProps> = ({
  register,
  errors,
  unregister
}) => {
  useEffect(() => () => unregister("small_signal"), []);

  return (
    <div className="bg-background/50 p-2 rounded-lg flex flex-col gap-2 [&>div]:w-2/4">
      <FieldContainer
        error={_.get(errors, "SmallSignal.amplitude")}
        postfix={Units.Voltage}
      >
        <Input
          placeholder="Amplitude"
          {...register("small_signal.amplitude", {
            required: {
              value: true,
              message: "Amplitude is required for AC analysis"
            },
            setValueAs: (value) => value || undefined,
            validate: {
              isUnit: isUnit("amplitude")
            }
          })}
        />
      </FieldContainer>
      <FieldContainer
        error={_.get(errors, "SmallSignal.phase")}
        postfix={Units.Phase}
      >
        <Input
          placeholder="Phase"
          {...register("small_signal.phase", {
            setValueAs: (value) => value || undefined,
            validate: {
              isUnit: isUnit("phase")
            }
          })}
        />
      </FieldContainer>
    </div>
  );
};

export default SmallSignal;
