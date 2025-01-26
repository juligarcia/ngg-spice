import { FC } from "react";
import useSimulationPanel from "./useSimulationPanel";
import { Button } from "../ui/Button";
import { AudioWaveform } from "lucide-react";
import { anySimulationRunning } from "@/utils/simulation";

const SimulationActions: FC = () => {
  const { simulate, simulationStatus, simulationsToRun } = useSimulationPanel();

  const hasAnySimulationRunning = anySimulationRunning(simulationStatus);
  const hasNoSimulations = simulationsToRun.size === 0;

  return (
    <div className="w-full mt-auto flex flex-row-reverse">
      <Button
        disabled={hasNoSimulations || hasAnySimulationRunning}
        onClick={simulate}
      >
        <div className="flex items-center gap-1">
          Simulate
          <AudioWaveform className="p-0.5" />
        </div>
      </Button>
    </div>
  );
};

export default SimulationActions;
