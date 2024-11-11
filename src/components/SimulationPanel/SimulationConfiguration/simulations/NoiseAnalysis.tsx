import { Typography } from "@/components/ui/Typography";
import {
  FrequencyVariation,
  FrequencyVariationDisplay,
  NoiseAnalysisConfig,
  Simulation,
  SimulationDisplay
} from "@/types/simulation";
import { FC } from "react";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { CircleHelp, SquareCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useSimulationStore } from "@/store/simulation";
import SimulationStatus from "../SimulationsStatus";
import {
  getIdOfType,
  hasAnyOfType,
  isSimulationRunning,
  isNoiseAnalysis
} from "@/utils/simulation";
import { useStore } from "@xyflow/react";
import { AppNode, NodeType } from "@/components/Editor/components/canvas/nodes/types";
import { match, P } from "ts-pattern";
import { ConnectionNodeType } from "@/components/Editor/components/canvas/nodes/ConnectionNode/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { isEmpty } from "lodash";
import { SpiceInstanceName } from "@/components/context/SpiceContext";
import { SpiceNodeType } from "@/components/Editor/components/canvas/nodes/SpiceNode/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export const Trigger: FC = () => {
  const simulationMap = useSimulationStore.use.simulationsToRun();
  const isEnqueued = hasAnyOfType(simulationMap, isNoiseAnalysis);

  return (
    <div className="bg-accent rounded-sm overflow-hidden flex items-center gap-2">
      <Typography className="capitalize" variant="h4">
        {SimulationDisplay[Simulation.Noise]}
      </Typography>
      {isEnqueued && <SquareCheck className="stroke-primary" size={25} />}
    </div>
  );
};

type NoiseAnalysisConfigForm = NoiseAnalysisConfig["Noise"];

export const Content: FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
    control
  } = useForm<NoiseAnalysisConfigForm>({});

  const simulationMap = useSimulationStore.use.simulationsToRun();

  const enqueueSimulation = useSimulationStore.use.enqueueSimulation();
  const dequeueSimulation = useSimulationStore.use.dequeueSimulation();

  const isEnqueued = hasAnyOfType(simulationMap, isNoiseAnalysis);

  const id = getIdOfType(simulationMap, isNoiseAnalysis);

  const status = useSimulationStore.use.simulationStatus().get(id || "no-id");

  const isRunning = isSimulationRunning(status);

  const nodes = useStore((state) => state.nodes) as AppNode[];

  const possibleNodeTargets = new Set(
    nodes.filter(({ type }) =>
      match(type)
        .with(
          NodeType.ConnectionNode,

          () => true
        )
        .otherwise(() => false)
    ) as ConnectionNodeType[]
  );

  const possibleSources = new Set(
    nodes.filter(({ type, data }) =>
      match([type, data])
        .with(
          [
            NodeType.Spice,
            {
              // TODO: Agregar fuentes de corriente también
              instance_name: P.union(SpiceInstanceName.VoltageSource)
            }
          ],
          () => true
        )
        .otherwise(() => false)
    ) as SpiceNodeType[]
  );

  return (
    <div>
      <div className="min-h-fit">
        <Typography className="text-muted-foreground">
          Performs noise analysis to calculate total noise at the output node,
          showing contributions from each component to help assess circuit
          performance.
        </Typography>
      </div>
      {isEnqueued && <SimulationStatus status={status} />}
      <form
        onSubmit={handleSubmit((config) => {
          enqueueSimulation({ Noise: config });
          reset(config);
        })}
        className="mt-6 flex flex-col gap-2"
      >
        <div className="flex items-center gap-4">
          <Typography className="whitespace-nowrap grow w-full">
            Output *
          </Typography>
          <Controller<NoiseAnalysisConfigForm>
            name="output"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                disabled={isRunning || isEmpty(possibleNodeTargets)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Output" />
                </SelectTrigger>
                <SelectContent>
                  {[...possibleNodeTargets].map(({ id }) => (
                    <SelectItem value={id} key={id}>
                      <Typography className="capitalize">
                        {id.split("-").join(" ")}
                      </Typography>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <Tooltip>
            <TooltipContent className="max-w-80" side="right">
              <Typography className="leading-normal">
                List of nodes eligible as simulation output.
              </Typography>
            </TooltipContent>
            <TooltipTrigger>
              <CircleHelp className="stroke-muted-foreground" size={20} />
            </TooltipTrigger>
          </Tooltip>
        </div>

        <div className="flex items-center gap-4">
          <Typography className="whitespace-nowrap grow w-full">
            Output reference
          </Typography>
          <Controller<NoiseAnalysisConfigForm>
            name="oref"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                disabled={isRunning || isEmpty(possibleNodeTargets)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Ground" />
                </SelectTrigger>
                <SelectContent>
                  {[...possibleNodeTargets].map(({ id }) => (
                    <SelectItem value={id} key={id}>
                      <Typography className="capitalize">
                        {id.split("-").join(" ")}
                      </Typography>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <Tooltip>
            <TooltipContent className="max-w-80" side="right">
              <Typography className="leading-normal">
                List of nodes eligible as simulation output reference. If
                specified, then the noise voltage v(output) - v(ref) is
                calculated
              </Typography>
            </TooltipContent>
            <TooltipTrigger>
              <CircleHelp className="stroke-muted-foreground" size={20} />
            </TooltipTrigger>
          </Tooltip>
        </div>

        <div className="flex items-center gap-4">
          <Typography className="whitespace-nowrap grow w-full">
            Source *
          </Typography>
          <Controller<NoiseAnalysisConfigForm>
            name="src"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                disabled={isRunning || isEmpty(possibleSources)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  {[...possibleSources].map(
                    ({ data: { instance_name, name } }) => (
                      <SelectItem
                        value={`${instance_name}${name}`}
                        key={`${instance_name}${name}`}
                      >
                        <Typography className="capitalize">{name}</Typography>
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            )}
          />
          <Tooltip>
            <TooltipContent className="max-w-80" side="right">
              <Typography className="leading-normal">
                List of nodes eligible as simulation source.
              </Typography>
            </TooltipContent>
            <TooltipTrigger>
              <CircleHelp className="stroke-muted-foreground" size={20} />
            </TooltipTrigger>
          </Tooltip>
        </div>

        <div className="flex items-center gap-4">
          <Typography className="whitespace-nowrap grow w-full">
            Variation *
          </Typography>
          <Controller<NoiseAnalysisConfigForm>
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
            {...register("pts", { valueAsNumber: true })}
            className="grow w-full"
          />
          <Tooltip>
            <TooltipContent className="max-w-80" side="right">
              <Typography className="leading-normal">
                Refers to points calculated for each division, be it points per
                decade/octave or just number of points for linear variation.
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

        <div className="flex items-center gap-4 h-10">
          <Typography className="whitespace-nowrap grow w-full">
            Points per summary
          </Typography>
          <Input
            disabled={isRunning}
            {...register("pts_per_summary", { valueAsNumber: true })}
            className="grow w-full"
          />
          <Tooltip>
            <TooltipContent className="max-w-80" side="right">
              <Typography className="leading-normal">
                If specified, the noise contributions of each noise generator is
                produced every points per summary frequency points
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
            <Button disabled={isRunning || !isDirty} className="w-full grow">
              Update
            </Button>
          )}
          {!isEnqueued && (
            <Button className="w-full grow">
              {isEnqueued ? "Update" : "Add to queue"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};
