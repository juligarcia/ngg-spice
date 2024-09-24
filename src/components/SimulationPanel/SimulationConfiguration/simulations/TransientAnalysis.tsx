import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Typography } from "@/components/ui/Typography";
import {
  Simulation,
  SimulationDisplay,
  TransientAnalysisConfig
} from "@/types/simulation";
import clsx from "clsx";
import { FC } from "react";
import { SimulationConfigCommonInterface } from "./types";
import { AnimatePresence, motion } from "framer-motion";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { CircleHelp, SquareCheck } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/Button";
import { useSimulationStore } from "@/store/simulation";
import SimulationStatus from "../SimulationsStatus";

export const Trigger: FC<
  Pick<SimulationConfigCommonInterface, "isEnqueued">
> = ({ isEnqueued }) => {
  return (
    <div className="bg-accent rounded-sm overflow-hidden flex items-center gap-2">
      <Typography variant="h4">
        {SimulationDisplay[Simulation.Transient]}
      </Typography>
      {isEnqueued && <SquareCheck className="stroke-primary" size={25} />}
    </div>
  );
};

type TransientAnalysisConfigForm = TransientAnalysisConfig["Tran"];

export const Content: FC<
  Pick<
    SimulationConfigCommonInterface,
    "dequeueSimulation" | "enqueueSimulation" | "id" | "isEnqueued"
  >
> = ({ isEnqueued, dequeueSimulation, id, enqueueSimulation }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { isDirty },
    control
  } = useForm<TransientAnalysisConfigForm>({});

  const status = useSimulationStore.use.simulationStatus().get(id || "no-id");

  return (
    <div>
      <div className="min-h-fit">
        <Typography className="text-muted-foreground">
          Perform a non-linear, time-domain simulation.
        </Typography>
      </div>
      {isEnqueued && (
        <SimulationStatus name={SimulationDisplay.op} status={status} />
      )}
      <form
        onSubmit={handleSubmit((config) => enqueueSimulation({ Tran: config }))}
        className="mt-6 flex flex-col gap-2"
      >
        <div className="flex items-center gap-4 h-10">
          <Typography className="whitespace-nowrap grow w-full">
            Time step *
          </Typography>
          <Input {...register("tstep")} className="grow w-full" />
          <Tooltip>
            <TooltipContent className="max-w-80" side="right">
              <Typography className="leading-normal">
                Refers to the computing increment.
              </Typography>
            </TooltipContent>
            <TooltipTrigger>
              <CircleHelp className="stroke-muted-foreground" size={20} />
            </TooltipTrigger>
          </Tooltip>
        </div>
        <div className="flex items-center gap-4 h-10">
          <Typography className="whitespace-nowrap grow w-full">
            Stop time *
          </Typography>
          <Input {...register("tstop")} className="grow w-full" />
          <Tooltip>
            <TooltipContent className="max-w-80" side="right">
              <Typography className="leading-normal">
                Refers to the final time.
              </Typography>
            </TooltipContent>
            <TooltipTrigger>
              <CircleHelp className="stroke-muted-foreground" size={20} />
            </TooltipTrigger>
          </Tooltip>
        </div>
        <div className="flex items-center gap-4 h-10">
          <Typography className="whitespace-nowrap grow w-full">
            Start time
          </Typography>
          <Input
            {...register("tstart", {
              setValueAs: (value) => value || undefined
            })}
            placeholder="0"
            className="grow w-full"
          />
          <Tooltip>
            <TooltipContent className="max-w-80" side="right">
              <Typography className="leading-normal">
                Refers to the initial time.
              </Typography>
            </TooltipContent>
            <TooltipTrigger>
              <CircleHelp className="stroke-muted-foreground" size={20} />
            </TooltipTrigger>
          </Tooltip>
        </div>
        <div className="flex items-center gap-4 h-10">
          <Typography className="whitespace-nowrap grow w-full">
            Maximum step
          </Typography>
          <Input
            {...register("tmax", {
              setValueAs: (value) => value || undefined
            })}
            placeholder="Default"
            className="grow w-full"
          />
          <Tooltip>
            <TooltipContent className="max-w-80" side="right">
              <Typography className="leading-normal">
                Refers to the maximum step size that spice uses.By default, the
                program chooses either the selected time step or (time stop -
                time start)/50, whichever is smaller. This field can be used to
                guarantee a computing interval that is smaller than the printer
                increment, Time step.
              </Typography>
            </TooltipContent>
            <TooltipTrigger>
              <CircleHelp className="stroke-muted-foreground" size={20} />
            </TooltipTrigger>
          </Tooltip>
        </div>
        <div className="flex items-center gap-4 h-10">
          <Typography className="whitespace-nowrap grow w-full">
            Initial conditions
          </Typography>
          <div className="flex grow w-full justify-end">
            <Controller<TransientAnalysisConfigForm>
              control={control}
              name="uic"
              render={({ field: { onBlur, onChange, ref } }) => (
                <Checkbox
                  onCheckedChange={onChange}
                  onBlur={onBlur}
                  ref={ref}
                />
              )}
            />
          </div>

          <Tooltip>
            <TooltipContent className="max-w-80" side="right">
              <Typography className="leading-normal">
                An optional keyword that indicates that the user does not want
                ngspice to solve for the quiescent operating point before
                beginning the transient analysis.
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
          <Button disabled={!isDirty} className="w-full grow">
            {isEnqueued ? "Update" : "Add to queue"}
          </Button>
        </div>
      </form>
    </div>
  );
};
