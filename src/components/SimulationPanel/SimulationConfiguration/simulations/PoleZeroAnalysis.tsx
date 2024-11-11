import { Typography } from "@/components/ui/Typography";
import {
  PoleZeroAnalysisConfig,
  PoleZeroAnalysisType,
  PoleZeroAnalysisTypeDisplay,
  Simulation,
  SimulationDisplay,
  TransferFunction,
  TransferFunctionDisplay
} from "@/types/simulation";
import { FC } from "react";
import { Controller, useForm } from "react-hook-form";
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
  isPoleZeroAnalysis
} from "@/utils/simulation";
import { useStore } from "@xyflow/react";
import { AppNode, NodeType } from "@/components/Editor/components/canvas/nodes/types";
import { match } from "ts-pattern";
import { ConnectionNodeType } from "@/components/Editor/components/canvas/nodes/ConnectionNode/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { isEmpty } from "lodash";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export const Trigger: FC = () => {
  const simulationMap = useSimulationStore.use.simulationsToRun();
  const isEnqueued = hasAnyOfType(simulationMap, isPoleZeroAnalysis);

  return (
    <div className="bg-accent rounded-sm overflow-hidden flex items-center gap-2">
      <Typography className="capitalize" variant="h4">
        {SimulationDisplay[Simulation.PoleZero]}
      </Typography>
      {isEnqueued && <SquareCheck className="stroke-primary" size={25} />}
    </div>
  );
};

type PoleZeroAnalysisConfigForm = PoleZeroAnalysisConfig["Pz"];

export const Content: FC = () => {
  const {
    handleSubmit,
    reset,
    formState: { isDirty },
    control
  } = useForm<PoleZeroAnalysisConfigForm>({});

  const simulationMap = useSimulationStore.use.simulationsToRun();

  const enqueueSimulation = useSimulationStore.use.enqueueSimulation();
  const dequeueSimulation = useSimulationStore.use.dequeueSimulation();

  const isEnqueued = hasAnyOfType(simulationMap, isPoleZeroAnalysis);

  const id = getIdOfType(simulationMap, isPoleZeroAnalysis);

  const status = useSimulationStore.use.simulationStatus().get(id || "no-id");

  const isRunning = isSimulationRunning(status);

  const nodes = useStore((state) => state.nodes) as AppNode[];

  const possibleInputOutputNodes = new Set(
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
      <div className="min-h-fit">
        <Typography className="text-muted-foreground">
          Computes the poles and/or zeros in the small signal AC transfer
          function.
        </Typography>
      </div>
      {isEnqueued && <SimulationStatus status={status} />}
      <form
        onSubmit={handleSubmit((config) => {
          enqueueSimulation({ Pz: config });
          reset(config);
        })}
        className="mt-6 flex flex-col gap-2"
      >
        <div className="flex items-center gap-4">
          <Typography className="whitespace-nowrap grow w-full">
            Input 1 *
          </Typography>
          <Controller<PoleZeroAnalysisConfigForm>
            name="node1"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                disabled={isRunning || isEmpty(possibleInputOutputNodes)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Input 1" />
                </SelectTrigger>
                <SelectContent>
                  {[...possibleInputOutputNodes].map(({ id }) => (
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
                List of nodes eligible as input 1 for the simulation.
              </Typography>
            </TooltipContent>
            <TooltipTrigger>
              <CircleHelp className="stroke-muted-foreground" size={20} />
            </TooltipTrigger>
          </Tooltip>
        </div>

        <div className="flex items-center gap-4">
          <Typography className="whitespace-nowrap grow w-full">
            Input 2 *
          </Typography>
          <Controller<PoleZeroAnalysisConfigForm>
            name="node2"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                disabled={isRunning || isEmpty(possibleInputOutputNodes)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Input 2" />
                </SelectTrigger>
                <SelectContent>
                  {[...possibleInputOutputNodes].map(({ id }) => (
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
                List of nodes eligible as input 2 for the simulation.
              </Typography>
            </TooltipContent>
            <TooltipTrigger>
              <CircleHelp className="stroke-muted-foreground" size={20} />
            </TooltipTrigger>
          </Tooltip>
        </div>

        <div className="flex items-center gap-4">
          <Typography className="whitespace-nowrap grow w-full">
            Output 1 *
          </Typography>
          <Controller<PoleZeroAnalysisConfigForm>
            name="node3"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                disabled={isRunning || isEmpty(possibleInputOutputNodes)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Output 1" />
                </SelectTrigger>
                <SelectContent>
                  {[...possibleInputOutputNodes].map(({ id }) => (
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
                List of nodes eligible as output 1 for the simulation.
              </Typography>
            </TooltipContent>
            <TooltipTrigger>
              <CircleHelp className="stroke-muted-foreground" size={20} />
            </TooltipTrigger>
          </Tooltip>
        </div>

        <div className="flex items-center gap-4">
          <Typography className="whitespace-nowrap grow w-full">
            Output 2 *
          </Typography>
          <Controller<PoleZeroAnalysisConfigForm>
            name="node4"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                disabled={isRunning || isEmpty(possibleInputOutputNodes)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Output 2" />
                </SelectTrigger>
                <SelectContent>
                  {[...possibleInputOutputNodes].map(({ id }) => (
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
                List of nodes eligible as output 2 for the simulation.
              </Typography>
            </TooltipContent>
            <TooltipTrigger>
              <CircleHelp className="stroke-muted-foreground" size={20} />
            </TooltipTrigger>
          </Tooltip>
        </div>

        <div className="flex items-center gap-4">
          <Typography className="whitespace-nowrap grow w-full">
            Transfer function *
          </Typography>
          <Controller<PoleZeroAnalysisConfigForm>
            name="transfer_function"
            render={({ field }) => (
              <RadioGroup
                className="flex grow w-full px-3 py-2 items-center justify-between"
                onValueChange={field.onChange}
                onBlur={field.onBlur}
                ref={field.ref}
              >
                <div className="flex flex-col gap-2 items-center">
                  <RadioGroupItem
                    value={TransferFunction.Voltage}
                    id={TransferFunction.Voltage}
                  />
                  <Label htmlFor={TransferFunction.Voltage}>
                    <Typography variant="xsmall">
                      {TransferFunctionDisplay[TransferFunction.Voltage]}
                    </Typography>
                  </Label>
                </div>

                <div className="flex flex-col gap-2 items-center">
                  <RadioGroupItem
                    value={TransferFunction.Current}
                    id={TransferFunction.Current}
                  />
                  <Label htmlFor={TransferFunction.Current}>
                    <Typography variant="xsmall">
                      {TransferFunctionDisplay[TransferFunction.Current]}
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
                Refers to the transfer function type that that will be computed.
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
          <Controller<PoleZeroAnalysisConfigForm>
            name="analysis_type"
            render={({ field }) => (
              <RadioGroup
                className="flex grow w-full px-3 py-2 items-center justify-between"
                onValueChange={field.onChange}
                onBlur={field.onBlur}
                ref={field.ref}
              >
                <div className="flex flex-col gap-2 items-center">
                  <RadioGroupItem
                    value={PoleZeroAnalysisType.Poles}
                    id={PoleZeroAnalysisType.Poles}
                  />
                  <Label htmlFor={PoleZeroAnalysisType.Poles}>
                    <Typography variant="xsmall">
                      {PoleZeroAnalysisTypeDisplay[PoleZeroAnalysisType.Poles]}
                    </Typography>
                  </Label>
                </div>

                <div className="flex flex-col gap-2 items-center">
                  <RadioGroupItem
                    value={PoleZeroAnalysisType.Zeros}
                    id={PoleZeroAnalysisType.Zeros}
                  />
                  <Label htmlFor={PoleZeroAnalysisType.Zeros}>
                    <Typography variant="xsmall">
                      {PoleZeroAnalysisTypeDisplay[PoleZeroAnalysisType.Zeros]}
                    </Typography>
                  </Label>
                </div>

                <div className="flex flex-col gap-2 items-center">
                  <RadioGroupItem
                    value={PoleZeroAnalysisType.PolesAndZeros}
                    id={PoleZeroAnalysisType.PolesAndZeros}
                  />
                  <Label htmlFor={PoleZeroAnalysisType.PolesAndZeros}>
                    <Typography variant="xsmall">
                      {
                        PoleZeroAnalysisTypeDisplay[
                          PoleZeroAnalysisType.PolesAndZeros
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
                Refers to the transfer function type that that will be computed.
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
