import {
  CurrentOrVoltage,
  CurrentOrVoltageDisplay,
  FrequencyVariation,
  FrequencyVariationDisplay,
  SensitivityAnalysisConfig,
  SensitivityAnalysisType,
  SensitivityAnalysisTypeDisplay,
  Simulation,
  SimulationDisplay
} from "@/types/simulation";
import { FC, Fragment } from "react";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { CircleHelp, SquareCheck } from "lucide-react";
import SimulationStatus from "../SimulationsStatus";
import { useSimulationStore } from "@/store/simulation";
import {
  getIdOfType,
  hasAnyOfType,
  isSensitivityAnalysis,
  isSimulationRunning
} from "@/utils/simulation";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useStore } from "@xyflow/react";
import { AppNode, NodeType } from "@/components/Editor/components/canvas/nodes/types";
import { match, P } from "ts-pattern";
import { SpiceInstanceName } from "@/components/context/SpiceContext/SpiceContext";
import { SpiceNodeType } from "@/components/Editor/components/canvas/nodes/SpiceNode/types";
import { ConnectionNodeType } from "@/components/Editor/components/canvas/nodes/ConnectionNode/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { isEmpty } from "lodash";

export const Trigger: FC = () => {
  const simulationMap = useSimulationStore.use.simulationsToRun();
  const isEnqueued = hasAnyOfType(simulationMap, isSensitivityAnalysis);

  return (
    <div className="bg-accent rounded-sm overflow-hidden flex items-center gap-2">
      <Typography className="capitalize" variant="h4">
        {SimulationDisplay[Simulation.Sensitivity]}
      </Typography>
      {isEnqueued && <SquareCheck className="stroke-primary" size={25} />}
    </div>
  );
};

type SensitivityAnalysisConfigForm = SensitivityAnalysisConfig["Sens"];

export const Content: FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
    control,
    watch,
    resetField,
    unregister
  } = useForm<SensitivityAnalysisConfigForm>({
    defaultValues: {
      output_type: CurrentOrVoltage.V,
      analysis_type: SensitivityAnalysisType.DC
    }
  });

  const simulationMap = useSimulationStore.use.simulationsToRun();

  const enqueueSimulation = useSimulationStore.use.enqueueSimulation();
  const dequeueSimulation = useSimulationStore.use.dequeueSimulation();

  const isEnqueued = hasAnyOfType(simulationMap, isSensitivityAnalysis);

  const id = getIdOfType(simulationMap, isSensitivityAnalysis);
  const status = useSimulationStore.use.simulationStatus().get(id || "no-id");

  const isRunning = isSimulationRunning(status);

  const isAcAnalysis = watch("analysis_type") === SensitivityAnalysisType.AC;
  const shouldMeasureVoltage = watch("output_type") === CurrentOrVoltage.V;

  const nodes = useStore((state) => state.nodes) as AppNode[];

  const possibleVoltageSources = new Set(
    nodes.filter(({ type, data }) =>
      match([type, data])
        .with(
          [
            NodeType.Spice,
            {
              instance_name: P.union(SpiceInstanceName.VoltageSource)
            }
          ],
          () => true
        )
        .otherwise(() => false)
    ) as SpiceNodeType[]
  );

  const possibleNodes = new Set(
    nodes.filter(({ type }) =>
      match(type)
        .with(
          NodeType.ConnectionNode,

          () => true
        )
        .otherwise(() => false)
    ) as ConnectionNodeType[]
  );

  return (
    <div>
      <Typography className="text-muted-foreground">
        Computes the operating-point sensitivity or the AC small-signal
        sensitivity of an output variable with respect to all circuit variables,
        including model parameters.
      </Typography>
      {isEnqueued && <SimulationStatus status={status} />}
      <form
        onSubmit={handleSubmit((config) => {
          enqueueSimulation({ Sens: config });
          reset(config);
        })}
        className="mt-6 flex flex-col gap-2"
      >
        <div className="flex items-center gap-4">
          <Typography className="whitespace-nowrap grow w-full">
            Measure *
          </Typography>
          <Controller<SensitivityAnalysisConfigForm>
            name="output_type"
            render={({ field }) => (
              <RadioGroup
                className="flex grow w-full px-3 py-2 items-center justify-center gap-4 [&>*]:grow"
                onValueChange={(newValue) => {
                  resetField("output");
                  field.onChange(newValue);
                }}
                onBlur={field.onBlur}
                ref={field.ref}
                defaultValue={CurrentOrVoltage.V}
              >
                <div className="flex flex-col gap-2 items-center">
                  <RadioGroupItem
                    value={CurrentOrVoltage.V}
                    id={CurrentOrVoltage.V}
                  />
                  <Label htmlFor={CurrentOrVoltage.V}>
                    <Typography variant="xsmall">
                      {CurrentOrVoltageDisplay[CurrentOrVoltage.V]}
                    </Typography>
                  </Label>
                </div>
                <div className="flex flex-col gap-2 items-center">
                  <RadioGroupItem
                    value={CurrentOrVoltage.I}
                    id={CurrentOrVoltage.I}
                  />
                  <Label htmlFor={CurrentOrVoltage.I}>
                    <Typography variant="xsmall">
                      {CurrentOrVoltageDisplay[CurrentOrVoltage.I]}
                    </Typography>
                  </Label>
                </div>
              </RadioGroup>
            )}
            control={control}
          />
          <Tooltip>
            <TooltipContent className="max-w-80" side="right">
              <Typography className="leading-normal">
                Refers to the output magnitude the user wants to measure, could
                be voltage or current.
              </Typography>
            </TooltipContent>
            <TooltipTrigger>
              <CircleHelp className="stroke-muted-foreground" size={20} />
            </TooltipTrigger>
          </Tooltip>
        </div>

        <div className="flex items-center gap-4">
          <Typography className="whitespace-nowrap grow w-full">
            Output *
          </Typography>
          <Controller<SensitivityAnalysisConfigForm>
            name="output"
            control={control}
            render={({ field }) =>
              shouldMeasureVoltage ? (
                <Select
                  onValueChange={field.onChange}
                  disabled={isRunning || isEmpty(possibleNodes)}
                >
                  <SelectTrigger ref={field.ref}>
                    <SelectValue placeholder="Output" />
                  </SelectTrigger>
                  <SelectContent>
                    {[...possibleNodes].map(({ id }) => (
                      <SelectItem value={id} key={id}>
                        <Typography className="capitalize">
                          {id.split("-").join(" ")}
                        </Typography>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Select
                  onValueChange={field.onChange}
                  disabled={isRunning || isEmpty(possibleVoltageSources)}
                >
                  <SelectTrigger ref={field.ref}>
                    <SelectValue placeholder="Output" />
                  </SelectTrigger>
                  <SelectContent>
                    {[...possibleVoltageSources].map(
                      ({ data: { name, instance_name } }) => (
                        <SelectItem
                          value={`${instance_name}${name}`}
                          key={`${instance_name}${name}`}
                        >
                          <Typography>{name}</Typography>
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              )
            }
          />
          <Tooltip>
            <TooltipContent className="max-w-80" side="right">
              <Typography className="leading-normal">
                List of nodes eligible as simulation output, either nodes for
                voltage measurements, or voltage sources for branch current
                measurements.
              </Typography>
            </TooltipContent>
            <TooltipTrigger>
              <CircleHelp className="stroke-muted-foreground" size={20} />
            </TooltipTrigger>
          </Tooltip>
        </div>

        <div className="flex items-center gap-4">
          <Typography className="whitespace-nowrap grow w-full">
            Analysis type *
          </Typography>
          <Controller<SensitivityAnalysisConfigForm>
            name="analysis_type"
            render={({ field }) => (
              <RadioGroup
                className="flex grow w-full px-3 py-2 items-center justify-center gap-4 [&>*]:grow"
                onValueChange={(newValue) => {
                  if (newValue === SensitivityAnalysisType.DC) {
                    unregister("fstart");
                    unregister("fstop");
                    unregister("variation");
                    unregister("nx");
                  }

                  field.onChange(newValue);
                }}
                onBlur={field.onBlur}
                ref={field.ref}
                defaultValue={SensitivityAnalysisType.DC}
              >
                <div className="flex flex-col gap-2 items-center">
                  <RadioGroupItem
                    value={SensitivityAnalysisType.DC}
                    id={SensitivityAnalysisType.DC}
                  />
                  <Label htmlFor={SensitivityAnalysisType.DC}>
                    <Typography variant="xsmall">
                      {
                        SensitivityAnalysisTypeDisplay[
                          SensitivityAnalysisType.DC
                        ]
                      }
                    </Typography>
                  </Label>
                </div>

                <div className="flex flex-col gap-2 items-center">
                  <RadioGroupItem
                    value={SensitivityAnalysisType.AC}
                    id={SensitivityAnalysisType.AC}
                  />
                  <Label htmlFor={SensitivityAnalysisType.AC}>
                    <Typography variant="xsmall">
                      {
                        SensitivityAnalysisTypeDisplay[
                          SensitivityAnalysisType.AC
                        ]
                      }
                    </Typography>
                  </Label>
                </div>
              </RadioGroup>
            )}
            control={control}
          />
          <Tooltip>
            <TooltipContent className="max-w-80" side="right">
              <Typography className="leading-normal">
                Refers to the output magnitude the user wants to measure, could
                be voltage or current.
              </Typography>
            </TooltipContent>
            <TooltipTrigger>
              <CircleHelp className="stroke-muted-foreground" size={20} />
            </TooltipTrigger>
          </Tooltip>
        </div>

        {isAcAnalysis && (
          <Fragment>
            <div className="flex items-center gap-4">
              <Typography className="whitespace-nowrap grow w-full">
                Variation *
              </Typography>
              <Controller<SensitivityAnalysisConfigForm>
                name="variation"
                render={({ field }) => (
                  <RadioGroup
                    className="flex grow w-full px-3 py-2 items-center justify-between"
                    onValueChange={field.onChange}
                    onBlur={field.onBlur}
                    ref={field.ref}
                  >
                    <div className="flex flex-col gap-2 items-center">
                      <RadioGroupItem
                        value={FrequencyVariation.Decade}
                        id={FrequencyVariation.Decade}
                      />
                      <Label htmlFor={FrequencyVariation.Decade}>
                        <Typography variant="xsmall">
                          {FrequencyVariationDisplay[FrequencyVariation.Decade]}
                        </Typography>
                      </Label>
                    </div>

                    <div className="flex flex-col gap-2 items-center">
                      <RadioGroupItem
                        value={FrequencyVariation.Octave}
                        id={FrequencyVariation.Octave}
                      />
                      <Label htmlFor={FrequencyVariation.Octave}>
                        <Typography variant="xsmall">
                          {FrequencyVariationDisplay[FrequencyVariation.Octave]}
                        </Typography>
                      </Label>
                    </div>

                    <div className="flex flex-col gap-2 items-center">
                      <RadioGroupItem
                        value={FrequencyVariation.Linear}
                        id={FrequencyVariation.Linear}
                      />
                      <Label htmlFor={FrequencyVariation.Linear}>
                        <Typography variant="xsmall">
                          {FrequencyVariationDisplay[FrequencyVariation.Linear]}
                        </Typography>
                      </Label>
                    </div>
                  </RadioGroup>
                )}
                control={control}
              />
              <Tooltip>
                <TooltipContent className="max-w-80" side="right">
                  <Typography className="leading-normal">
                    Refers to the frequency variation mode for the analysis.
                  </Typography>
                </TooltipContent>
                <TooltipTrigger>
                  <CircleHelp className="stroke-muted-foreground" size={20} />
                </TooltipTrigger>
              </Tooltip>
            </div>

            <div className="flex items-center gap-4 h-10">
              <Typography className="whitespace-nowrap grow w-full">
                Points per division *
              </Typography>
              <Input
                disabled={isRunning}
                {...register("nx", { valueAsNumber: true })}
                className="grow w-full"
              />
              <Tooltip>
                <TooltipContent className="max-w-80" side="right">
                  <Typography className="leading-normal">
                    Refers to points calculated for each division, be it points
                    per decade/octave or just number of points for linear
                    variation.
                  </Typography>
                </TooltipContent>
                <TooltipTrigger>
                  <CircleHelp className="stroke-muted-foreground" size={20} />
                </TooltipTrigger>
              </Tooltip>
            </div>

            <div className="flex items-center gap-4 h-10">
              <Typography className="whitespace-nowrap grow w-full">
                Start frequency *
              </Typography>
              <Input
                disabled={isRunning}
                {...register("fstart")}
                className="grow w-full"
              />
              <Tooltip>
                <TooltipContent className="max-w-80" side="right">
                  <Typography className="leading-normal">
                    Refers to the starting frequency for the analysis.
                  </Typography>
                </TooltipContent>
                <TooltipTrigger>
                  <CircleHelp className="stroke-muted-foreground" size={20} />
                </TooltipTrigger>
              </Tooltip>
            </div>

            <div className="flex items-center gap-4 h-10">
              <Typography className="whitespace-nowrap grow w-full">
                Stop frequency *
              </Typography>
              <Input
                disabled={isRunning}
                {...register("fstop")}
                className="grow w-full"
              />
              <Tooltip>
                <TooltipContent className="max-w-80" side="right">
                  <Typography className="leading-normal">
                    Refers to the stopping frequency for the analysis.
                  </Typography>
                </TooltipContent>
                <TooltipTrigger>
                  <CircleHelp className="stroke-muted-foreground" size={20} />
                </TooltipTrigger>
              </Tooltip>
            </div>

            <div className="mt-6 flex">
              {isEnqueued && (
                <Button
                  disabled={isRunning}
                  className="w-full grow"
                  role="button"
                  variant="ghost"
                  onClick={() => {
                    if (id) dequeueSimulation(id);
                  }}
                >
                  Dequeue
                </Button>
              )}
              {isEnqueued && (
                <Button
                  disabled={isRunning || !isDirty}
                  className="w-full grow"
                >
                  Update
                </Button>
              )}
              {!isEnqueued && (
                <Button className="w-full grow">
                  {isEnqueued ? "Update" : "Add to queue"}
                </Button>
              )}
            </div>
          </Fragment>
        )}
      </form>
    </div>
  );
};
