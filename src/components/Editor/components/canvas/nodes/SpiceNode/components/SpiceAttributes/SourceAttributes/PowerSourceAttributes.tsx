import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import {
  PowerSourceData,
  SpiceInstanceName
} from "@/components/context/SpiceContext/SpiceContext";
import { Button } from "@/components/ui/Button";
import { useReactFlow } from "@xyflow/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Typography } from "@/components/ui/Typography";
import {
  TimeDomainAnalysis,
  TimeDomainAnalysisDisplay,
  TimeDomainParameters
} from "@/types/elements";
import { match } from "ts-pattern";
import TimeDomainDC from "./TimeDomain/TimeDomainDC";
import TimeDomainPulse from "./TimeDomain/TimeDomainPulse";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import TimeDomainSine from "./TimeDomain/TimeDomainSine";
import TimeDomainExponential from "./TimeDomain/TimeDomainExponential";
import TimeDomainFm from "./TimeDomain/TimeDomainFm";
import TimeDomainAm from "./TimeDomain/TimeDomainAm";
import SmallSignal from "./SmallSignal";
import { isEmpty } from "lodash";

interface PowerSourceAttributesProps {
  data: Partial<PowerSourceData>;
  id: string;
  handleClose(): void;
  type: SpiceInstanceName.VoltageSource | SpiceInstanceName.CurrentSource;
}

export type PowerSourceAttributesForm = PowerSourceData;

const getTimeDomainFromAttributes = (
  data?: Partial<TimeDomainParameters>
): TimeDomainAnalysis => {
  if (!data) return TimeDomainAnalysis.DC;

  if (TimeDomainAnalysis.DC in data) return TimeDomainAnalysis.DC;
  if (TimeDomainAnalysis.Pulse in data) return TimeDomainAnalysis.Pulse;
  if (TimeDomainAnalysis.Sine in data) return TimeDomainAnalysis.Sine;
  if (TimeDomainAnalysis.Exponential in data)
    return TimeDomainAnalysis.Exponential;
  if (TimeDomainAnalysis.SingleFrequencyFM in data)
    return TimeDomainAnalysis.SingleFrequencyFM;
  if (TimeDomainAnalysis.AmplitudeModulated in data)
    return TimeDomainAnalysis.AmplitudeModulated;

  return TimeDomainAnalysis.DC;
};

const PowerSourceAttributes: FC<PowerSourceAttributesProps> = ({
  data,
  id,
  handleClose,
  type
}) => {
  const [timeDomainAnalysis, setTimeDomainAnalysis] = useState(
    getTimeDomainFromAttributes(data.time_domain)
  );

  const {
    formState: { isDirty, errors },
    register,
    unregister,
    handleSubmit,
    reset
  } = useForm<PowerSourceAttributesForm>({ defaultValues: data });

  const { setNodes } = useReactFlow();

  const onSubmit = handleSubmit((formValues) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id)
          return {
            ...node,
            data: { ...node.data, data: formValues }
          };

        return node;
      })
    );
    reset(formValues);
    handleClose();
  });

  return (
    <form
      onSubmit={onSubmit}
      className="w-full flex flex-col gap-4 justify-between mt-4"
    >
      <Accordion
        defaultValue={[
          String(("time_domain" in data || isEmpty(data)) && "time_domain"),
          String("small_signal" in data && "small_signal")
        ].filter((tab) => tab !== "false")}
        type="multiple"
      >
        <AccordionItem value="time_domain">
          <AccordionTrigger>
            <Typography className="text-muted-foreground">
              Time domain parameters
            </Typography>
          </AccordionTrigger>
          <AccordionContent>
            <Select
              value={timeDomainAnalysis}
              onValueChange={(newMode) =>
                setTimeDomainAnalysis(newMode as TimeDomainAnalysis)
              }
            >
              <SelectTrigger className="mb-2 w-2/4 focus:ring-inset !ring-offset-0">
                <SelectValue placeholder="Mode" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(TimeDomainAnalysis).map((mode) => (
                  <SelectItem value={mode} key={mode}>
                    <Typography>{TimeDomainAnalysisDisplay[mode]}</Typography>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="bg-background/50 p-2 rounded-lg flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-2">
                {match(timeDomainAnalysis)
                  .with(TimeDomainAnalysis.DC, () => (
                    <TimeDomainDC
                      type={type}
                      errors={errors}
                      register={register}
                      unregister={unregister}
                    />
                  ))
                  .with(TimeDomainAnalysis.Pulse, () => (
                    <TimeDomainPulse
                      type={type}
                      errors={errors}
                      register={register}
                      unregister={unregister}
                    />
                  ))
                  .with(TimeDomainAnalysis.Sine, () => (
                    <TimeDomainSine
                      type={type}
                      errors={errors}
                      register={register}
                      unregister={unregister}
                    />
                  ))
                  .with(TimeDomainAnalysis.Exponential, () => (
                    <TimeDomainExponential
                      type={type}
                      errors={errors}
                      register={register}
                      unregister={unregister}
                    />
                  ))
                  .with(TimeDomainAnalysis.SingleFrequencyFM, () => (
                    <TimeDomainFm
                      type={type}
                      errors={errors}
                      register={register}
                      unregister={unregister}
                    />
                  ))
                  .with(TimeDomainAnalysis.AmplitudeModulated, () => (
                    <TimeDomainAm
                      type={type}
                      errors={errors}
                      register={register}
                      unregister={unregister}
                    />
                  ))
                  .otherwise(() => null)}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="small_signal">
          <AccordionTrigger>
            <Typography className="text-muted-foreground">
              Small signal parameters
            </Typography>
          </AccordionTrigger>
          <AccordionContent>
            <SmallSignal
              type={type}
              register={register}
              errors={errors}
              unregister={unregister}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="w-full flex gap-2 px-4 pb-4 items-center justify-end [&>button]:w-[50%] mt-12">
        <Button disabled={!isDirty}>Save</Button>
      </div>
    </form>
  );
};

export default PowerSourceAttributes;
