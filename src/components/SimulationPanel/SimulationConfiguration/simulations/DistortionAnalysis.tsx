import { FC } from "react";
import {
  DistortionAnalysisConfig,
  FrequencyVariation,
  FrequencyVariationDisplay,
  Simulation,
  SimulationDisplay
} from "@/types/simulation";
import { useSimulationStore } from "@/store/simulation";
import {
  getIdOfType,
  hasAnyOfType,
  isDistortionAnalysis,
  isSimulationRunning
} from "@/utils/simulation";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { CircleHelp, SquareCheck } from "lucide-react";
import SimulationStatus from "../SimulationsStatus";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export const Trigger: FC = () => {
  const simulationMap = useSimulationStore.use.simulationsToRun();
  const isEnqueued = hasAnyOfType(simulationMap, isDistortionAnalysis);

  return (
    <div className="bg-accent rounded-sm overflow-hidden flex items-center gap-2">
      <Typography className="capitalize" variant="h4">
        {SimulationDisplay[Simulation.Distortion]}
      </Typography>
      {isEnqueued && <SquareCheck className="stroke-primary" size={25} />}
    </div>
  );
};

type DistortionAnalysisForm = DistortionAnalysisConfig["Disto"];

export const Content: FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
    control
  } = useForm<DistortionAnalysisForm>({});

  const simulationMap = useSimulationStore.use.simulationsToRun();

  const enqueueSimulation = useSimulationStore.use.enqueueSimulation();
  const dequeueSimulation = useSimulationStore.use.dequeueSimulation();

  const isEnqueued = hasAnyOfType(simulationMap, isDistortionAnalysis);

  const id = getIdOfType(simulationMap, isDistortionAnalysis);
  const status = useSimulationStore.use.simulationStatus().get(id || "no-id");

  const isRunning = isSimulationRunning(status);

  return (
    <div>
      <Typography className="text-muted-foreground">
        Computes steady-state harmonic and intermodulation products for small
        input signal magnitudes.
      </Typography>
      {isEnqueued && <SimulationStatus status={status} />}
      <form
        onSubmit={handleSubmit((config) => {
          enqueueSimulation({ Disto: config }, isDistortionAnalysis);
          reset(config);
        })}
        className="mt-6 flex flex-col gap-2"
      >
        <div className="flex items-center gap-4">
          <Typography className="whitespace-nowrap grow w-full">
            Variation *
          </Typography>
          <Controller<DistortionAnalysisForm>
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
            Frequency ratio
          </Typography>
          <Input
            disabled={isRunning}
            {...register("f2overf1", { valueAsNumber: true })}
            className="grow w-full"
          />
          <Tooltip>
            <TooltipContent className="max-w-80" side="right">
              <Typography className="leading-normal">
                Defines the ratio between two input frequencies, f2 and f1. This
                analysis computes the distortion characteristics of a circuit by
                applying two signals at different frequencies. The f2overf1
                parameter sets the frequency relationship between these two
                input signals, allowing NGSpice to evaluate how the circuit
                responds to combinations of signals and to determine the
                intermodulation distortion products.
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
