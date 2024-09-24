import {
  OperatingPointConfig,
  Simulation,
  SimulationDisplay
} from "@/types/simulation";
import { FC } from "react";
import { SimulationConfigCommonInterface } from "./types";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { SquareCheck } from "lucide-react";
import SimulationStatus from "../SimulationsStatus";
import { useSimulationStore } from "@/store/simulation";

export const Trigger: FC<
  Pick<SimulationConfigCommonInterface, "isEnqueued">
> = ({ isEnqueued }) => {
  return (
    <div className="bg-accent rounded-sm overflow-hidden flex items-center gap-2">
      <Typography variant="h4">
        {SimulationDisplay[Simulation.OperatingPoint]}
      </Typography>
      {isEnqueued && <SquareCheck className="stroke-primary" size={25} />}
    </div>
  );
};

export const Content: FC<
  Pick<
    SimulationConfigCommonInterface,
    "enqueueSimulation" | "isEnqueued" | "id" | "dequeueSimulation"
  >
> = ({ enqueueSimulation, isEnqueued, id, dequeueSimulation }) => {
  const status = useSimulationStore.use.simulationStatus().get(id || "no-id");

  const a = useSimulationStore.use.simulationStatus();

  console.log(a);

  return (
    <div>
      <Typography className="text-muted-foreground">
        Compute the DC operating point trating capacitances as open circuits and
        inductances as short circuits
      </Typography>
      {isEnqueued && (
        <SimulationStatus name={SimulationDisplay.op} status={status} />
      )}
      <div className="mt-6 flex">
        {!isEnqueued && (
          <Button
            className="w-full"
            onClick={() => {
              enqueueSimulation({ Op: {} } as OperatingPointConfig);
            }}
          >
            Add to queue
          </Button>
        )}
        {isEnqueued && (
          <Button
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
