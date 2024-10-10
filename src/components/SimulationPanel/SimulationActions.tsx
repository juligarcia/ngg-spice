import { FC } from "react";
import useSimulationPanel from "./useSimulationPanel";
import { Button } from "../ui/Button";
import { AudioWaveform } from "lucide-react";
import { anySimulationRunning } from "@/utils/simulation";

const SimulationActions: FC = () => {
  const { simulate, simulationStatus } = useSimulationPanel();

  const hasAnySimulationRunning = anySimulationRunning(simulationStatus);

  return (
    <div className="w-full mt-auto flex flex-row-reverse">
      <Button disabled={hasAnySimulationRunning} onClick={simulate}>
        <div className="flex items-center gap-1">
          Simulate
          <AudioWaveform className="p-0.5" />
        </div>
      </Button>
    </div>
  );
};

export default SimulationActions;
