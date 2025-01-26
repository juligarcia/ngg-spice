import { Typography } from "@/components/ui/Typography";
import {
  Simulation,
  SimulationDisplay,
  TransientAnalysisConfig
} from "@/types/simulation";
import { FC, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { LoaderCircle, SquareCheck } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/Button";
import { useSimulationStore } from "@/store/simulation";
import SimulationStatus from "../SimulationsStatus";
import {
  getIdOfType,
  hasAnyOfType,
  isSimulationRunning,
  isTransientAnalysis
} from "@/utils/simulation";
import { isUnit } from "@/utils/validations";
import FieldContainer from "@/components/ui/FieldContainer";

export const Trigger: FC = () => {
  const simulationMap = useSimulationStore.use.simulationsToRun();
  const isEnqueued = hasAnyOfType(simulationMap, isTransientAnalysis);
  const id = getIdOfType(simulationMap, isTransientAnalysis);
  const status = useSimulationStore.use.simulationStatus().get(id || "no-id");
  const isRunning = isSimulationRunning(status);

  return (
    <div className="px-1 bg-accent rounded-sm overflow-hidden flex items-center gap-2 w-full mr-2">
      <Typography className="capitalize" variant="h4">
        {SimulationDisplay[Simulation.Transient]}
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

type TransientAnalysisConfigForm = TransientAnalysisConfig["Tran"];

export const Content: FC = () => {
  const simulationMap = useSimulationStore.use.simulationsToRun();

  const enqueueSimulation = useSimulationStore.use.enqueueSimulation();
  const dequeueSimulation = useSimulationStore.use.dequeueSimulation();

  const isEnqueued = hasAnyOfType(simulationMap, isTransientAnalysis);

  const id = getIdOfType(simulationMap, isTransientAnalysis);

  const configuration = simulationMap.get(id || "") as
    | TransientAnalysisConfig
    | undefined;

  const status = useSimulationStore.use.simulationStatus().get(id || "no-id");

  const isRunning = isSimulationRunning(status);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty, errors },
    control,
    setFocus
  } = useForm<TransientAnalysisConfigForm>({
    defaultValues: configuration?.Tran || {}
  });

  useEffect(() => {
    setFocus("tstep");
  }, []);

  return (
    <div className="p-1">
      <div className="min-h-fit">
        <Typography className="text-muted-foreground">
          Perform a non-linear, time-domain simulation.
        </Typography>
      </div>
      {isEnqueued && <SimulationStatus status={status} />}
      <form
        onSubmit={handleSubmit((config) => {
          enqueueSimulation({ Tran: config }, isTransientAnalysis);
          reset(config);
        })}
        className="mt-6 flex flex-col gap-2"
      >
        <div className="flex items-center gap-4">
          <FieldContainer
            prefix="Time step *"
            className="grow w-full"
            error={errors["tstep"]}
            tooltip="Refers to the computing increment."
          >
            <Input
              defaultValue={configuration?.Tran.tstep}
              disabled={isRunning}
              {...register("tstep", {
                required: {
                  value: true,
                  message: "This field is required."
                },
                validate: {
                  isUnit: isUnit("time")
                }
              })}
            />
          </FieldContainer>
        </div>
        <FieldContainer
          prefix="Stop time *"
          className="grow w-full"
          error={errors["tstop"]}
          tooltip="Refers to the final time."
        >
          <Input
            defaultValue={configuration?.Tran.tstop}
            disabled={isRunning}
            {...register("tstop", {
              required: {
                value: true,
                message: "This field is required."
              },
              validate: {
                isUnit: isUnit("time")
              }
            })}
          />
        </FieldContainer>
        <FieldContainer
          tooltip=" Refers to the initial time."
          prefix="Start time"
        >
          <Input
            defaultValue={configuration?.Tran.tstart}
            {...register("tstart", {
              setValueAs: (value) => value || undefined
            })}
            disabled={isRunning}
            placeholder="0"
            className="grow w-full"
          />
        </FieldContainer>
        <FieldContainer
          tooltip="Refers to the maximum step size that spice uses.By default, the
                program chooses either the selected time step or (time stop -
                time start)/50, whichever is smaller. This field can be used to
                guarantee a computing interval that is smaller than the printer
                increment, Time step."
          prefix="Maximum step"
        >
          <Input
            defaultValue={configuration?.Tran.tmax}
            {...register("tmax", {
              setValueAs: (value) => value || undefined
            })}
            disabled={isRunning}
            placeholder="Default"
            className="grow w-full"
          />
        </FieldContainer>
        <FieldContainer
          tooltip=" An optional keyword that indicates that the user does not want
                ngspice to solve for the quiescent operating point before
                beginning the transient analysis."
          prefix="Initial conditions"
        >
          <div className="h-10  items-center flex grow w-full justify-end">
            <Controller<TransientAnalysisConfigForm>
              control={control}
              name="uic"
              defaultValue={configuration?.Tran.uic}
              render={({ field: { onBlur, onChange, ref } }) => (
                <Checkbox
                  defaultChecked={configuration?.Tran.uic}
                  disabled={isRunning}
                  onCheckedChange={onChange}
                  onBlur={onBlur}
                  ref={ref}
                />
              )}
            />
          </div>
        </FieldContainer>
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
