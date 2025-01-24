import {
  OperatingPointConfig,
  Simulation,
  SimulationDisplay
} from "@/types/simulation";
import { FC } from "react";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { SquareCheck } from "lucide-react";
import SimulationStatus from "../SimulationsStatus";
import { useSimulationStore } from "@/store/simulation";
import {
  getIdOfType,
  hasAnyOfType,
  isOpeartingPoint,
  isSimulationRunning
} from "@/utils/simulation";
import clsx from "clsx";

export const Trigger: FC = () => {
  const simulationMap = useSimulationStore.use.simulationsToRun();
  const isEnqueued = hasAnyOfType(simulationMap, isOpeartingPoint);

  return (
    <div
      className={clsx(
        "bg-accent rounded-sm overflow-hidden flex items-center justify-between w-full mr-4"
      )}
    >
      <div className={clsx("flex items-center gap-2")}>
        <Typography className="capitalize" variant="h4">
          {SimulationDisplay[Simulation.OperatingPoint]}
        </Typography>
        {isEnqueued && <SquareCheck className="stroke-primary" size={25} />}
      </div>
    </div>
  );
};

export const Content: FC = () => {
  const simulationMap = useSimulationStore.use.simulationsToRun();

  const enqueueSimulation = useSimulationStore.use.enqueueSimulation();
  const dequeueSimulation = useSimulationStore.use.dequeueSimulation();

  const isEnqueued = hasAnyOfType(simulationMap, isOpeartingPoint);

  const id = getIdOfType(simulationMap, isOpeartingPoint);

  const status = useSimulationStore.use.simulationStatus().get(id || "no-id");

  const isRunning = isSimulationRunning(status);

  return (
    <div>
      <Typography className="text-muted-foreground">
        Compute the DC operating point trating capacitances as open circuits and
        inductances as short circuits
      </Typography>
      {isEnqueued && <SimulationStatus status={status} />}
      <div className="mt-6 flex">
        {!isEnqueued && (
          <Button
            disabled={isRunning}
            className="w-full"
            onClick={() => {
              enqueueSimulation(
                { Op: {} } as OperatingPointConfig,
                isOpeartingPoint
              );
            }}
          >
            Add to queue
          </Button>
        )}
        {isEnqueued && (
          <Button
            disabled={isRunning}
            className="w-full"
            variant="ghost"
            onClick={() => {
              if (id) dequeueSimulation(id);
            }}
          >
            Dequeue
          </Button>
        )}
      </div>
    </div>
  );
};
