import {
  DCAnalysisConfig,
  Simulation,
  SimulationDisplay
} from "@/types/simulation";
import { FC, useEffect, useState } from "react";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { CircleHelp, LoaderCircle, SquareCheck } from "lucide-react";
import SimulationStatus from "../SimulationsStatus";
import { useSimulationStore } from "@/store/simulation";
import {
  getIdOfType,
  hasAnyOfType,
  isSimulationRunning,
  isDCAnalysis
} from "@/utils/simulation";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  AppNode,
  NodeType
} from "@/components/Editor/components/canvas/nodes/types";
import { match, P } from "ts-pattern";
import { SpiceInstanceName } from "@/components/context/SpiceContext/SpiceContext";
import { SpiceNodeType } from "@/components/Editor/components/canvas/nodes/SpiceNode/types";
import { Switch } from "@/components/ui/switch";
import { useStore } from "@xyflow/react";

export const Trigger: FC = () => {
  const simulationMap = useSimulationStore.use.simulationsToRun();
  const isEnqueued = hasAnyOfType(simulationMap, isDCAnalysis);
  const id = getIdOfType(simulationMap, isDCAnalysis);
  const status = useSimulationStore.use.simulationStatus().get(id || "no-id");
  const isRunning = isSimulationRunning(status);

  return (
    <div className="bg-accent rounded-sm overflow-hidden flex items-center gap-2">
      <Typography className="capitalize" variant="h4">
        {SimulationDisplay[Simulation.DC]}
      </Typography>
      {isEnqueued &&
        (isRunning ? (
          <LoaderCircle size={25} className="stroke-primary animate-spin" />
        ) : (
          <SquareCheck className="stroke-primary" size={25} />
        ))}
    </div>
  );
};

type DCAnalysisForm = DCAnalysisConfig["Dc"];

export const Content: FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
    control,
    unregister,
    setFocus
  } = useForm<DCAnalysisForm>({});

  useEffect(() => {
    setFocus("srcnam");
  }, []);

  const simulationMap = useSimulationStore.use.simulationsToRun();

  const enqueueSimulation = useSimulationStore.use.enqueueSimulation();
  const dequeueSimulation = useSimulationStore.use.dequeueSimulation();

  const isEnqueued = hasAnyOfType(simulationMap, isDCAnalysis);

  const id = getIdOfType(simulationMap, isDCAnalysis);
  const status = useSimulationStore.use.simulationStatus().get(id || "no-id");

  const isRunning = isSimulationRunning(status);

  const nodes = useStore((state) => state.nodes) as AppNode[];

  const possibleNodeTargets = new Set(
    nodes.filter(({ type, data }) =>
      match([type, data])
        .with(
          [
            NodeType.Spice,
            {
              instance_name: P.union(
                SpiceInstanceName.Resistor,
                SpiceInstanceName.VoltageSource,
                SpiceInstanceName.CurrentSource
              )
            }
          ],
          () => true
        )
        .otherwise(() => false)
    ) as SpiceNodeType[]
  );

  const [withSecondarySource, setWithSecondarySource] = useState(false);

  return (
    <div>
      <Typography className="text-muted-foreground">
        DC analysis performs a DC sweep analysis, varying a specified source
        (like a voltage or current) over a defined range and calculating the
        resulting voltages and currents in the circuit. A second source may be
        specified.
      </Typography>
      {isEnqueued && <SimulationStatus status={status} />}
      <form
        onSubmit={handleSubmit((config) => {
          enqueueSimulation({ Dc: config }, isDCAnalysis);
          reset(config);
        })}
        className="mt-6 flex flex-col gap-2"
      >
        <div className="flex items-center gap-4">
          <Typography className="whitespace-nowrap grow w-full">
            Main Source *
          </Typography>
          <Controller<DCAnalysisForm>
            name="srcnam"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} disabled={isRunning}>
                <SelectTrigger>
                  <SelectValue placeholder="Main source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TEMP">
                    <Typography>Temperature</Typography>
                  </SelectItem>
                  {[...possibleNodeTargets].map(
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
            )}
          />
          <Tooltip>
            <TooltipContent className="max-w-80" side="right">
              <Typography className="leading-normal">
                Lists all nodes whose value could be swept over for the
                analysis.
              </Typography>
            </TooltipContent>
            <TooltipTrigger>
              <CircleHelp className="stroke-muted-foreground" size={20} />
            </TooltipTrigger>
          </Tooltip>
        </div>

        <div className="flex items-center gap-4 h-10">
          <Typography className="whitespace-nowrap grow w-full">
            Start Value *
          </Typography>
          <Input
            disabled={isRunning}
            {...register("vstart")}
            className="grow w-full"
          />
          <Tooltip>
            <TooltipContent className="max-w-80" side="right">
              <Typography className="leading-normal">
                Refers to the starting value for the swept main source
              </Typography>
            </TooltipContent>
            <TooltipTrigger>
              <CircleHelp className="stroke-muted-foreground" size={20} />
            </TooltipTrigger>
          </Tooltip>
        </div>

        <div className="flex items-center gap-4 h-10">
          <Typography className="whitespace-nowrap grow w-full">
            Stop Value *
          </Typography>
          <Input
            disabled={isRunning}
            {...register("vstop")}
            className="grow w-full"
          />
          <Tooltip>
            <TooltipContent className="max-w-80" side="right">
              <Typography className="leading-normal">
                Refers to the stopping value for the swept main source
              </Typography>
            </TooltipContent>
            <TooltipTrigger>
              <CircleHelp className="stroke-muted-foreground" size={20} />
            </TooltipTrigger>
          </Tooltip>
        </div>

        <div className="flex items-center gap-4 h-10">
          <Typography className="whitespace-nowrap grow w-full">
            Step Size *
          </Typography>
          <Input
            disabled={isRunning}
            {...register("vincr")}
            className="grow w-full"
          />
          <Tooltip>
            <TooltipContent className="max-w-80" side="right">
              <Typography className="leading-normal">
                Refers to the step size increment used to sweep the main source
              </Typography>
            </TooltipContent>
            <TooltipTrigger>
              <CircleHelp className="stroke-muted-foreground" size={20} />
            </TooltipTrigger>
          </Tooltip>
        </div>

        <div className="flex flex-col gap-4 border-muted-foreground/25 border-2 rounded-md p-4 mt-4">
          <div className="flex items-center gap-12 w-full justify-between">
            <div className="flex flex-col gap-2">
              <Typography>Secondary source</Typography>
              <Typography variant="xsmall" className="text-muted-foreground">
                The main source is swept over its own range for each value of
                the secondary source.
              </Typography>
            </div>
            <Switch
              disabled={isRunning}
              onCheckedChange={(checked) => {
                setWithSecondarySource(checked);

                if (!checked) {
                  unregister("src2");
                  unregister("start2");
                  unregister("stop2");
                  unregister("incr2");
                }
              }}
            />
          </div>
          {withSecondarySource && (
            <div>
              <div className="flex items-center gap-4">
                <Typography className="whitespace-nowrap grow w-full">
                  Secondary Source *
                </Typography>
                <Controller<DCAnalysisForm>
                  name="src2"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} disabled={isRunning}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sec. source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TEMP">
                          <Typography>Temperature</Typography>
                        </SelectItem>
                        {[...possibleNodeTargets].map(
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
                  )}
                />

                <Tooltip>
                  <TooltipContent className="max-w-80" side="right">
                    <Typography className="leading-normal">
                      Lists all nodes whose value could be swept over for the
                      analysis.
                    </Typography>
                  </TooltipContent>
                  <TooltipTrigger>
                    <CircleHelp className="stroke-muted-foreground" size={20} />
                  </TooltipTrigger>
                </Tooltip>
              </div>

              <div className="flex items-center gap-4 h-10">
                <Typography className="whitespace-nowrap grow w-full">
                  Start Value *
                </Typography>
                <Input
                  disabled={isRunning}
                  {...register("vstart")}
                  className="grow w-full"
                />
                <Tooltip>
                  <TooltipContent className="max-w-80" side="right">
                    <Typography className="leading-normal">
                      Refers to the starting value for the swept secondary
                      source
                    </Typography>
                  </TooltipContent>
                  <TooltipTrigger>
                    <CircleHelp className="stroke-muted-foreground" size={20} />
                  </TooltipTrigger>
                </Tooltip>
              </div>

              <div className="flex items-center gap-4 h-10">
                <Typography className="whitespace-nowrap grow w-full">
                  Stop Value *
                </Typography>
                <Input
                  disabled={isRunning}
                  {...register("vstop")}
                  className="grow w-full"
                />
                <Tooltip>
                  <TooltipContent className="max-w-80" side="right">
                    <Typography className="leading-normal">
                      Refers to the stopping value for the swept secondary
                      source
                    </Typography>
                  </TooltipContent>
                  <TooltipTrigger>
                    <CircleHelp className="stroke-muted-foreground" size={20} />
                  </TooltipTrigger>
                </Tooltip>
              </div>

              <div className="flex items-center gap-4 h-10">
                <Typography className="whitespace-nowrap grow w-full">
                  Step Size *
                </Typography>
                <Input
                  disabled={isRunning}
                  {...register("vincr")}
                  className="grow w-full"
                />
                <Tooltip>
                  <TooltipContent className="max-w-80" side="right">
                    <Typography className="leading-normal">
                      Refers to the step size increment used to sweep the
                      secondary source
                    </Typography>
                  </TooltipContent>
                  <TooltipTrigger>
                    <CircleHelp className="stroke-muted-foreground" size={20} />
                  </TooltipTrigger>
                </Tooltip>
              </div>
            </div>
          )}
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
