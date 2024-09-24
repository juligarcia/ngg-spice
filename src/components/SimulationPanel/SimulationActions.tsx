import { FC } from "react";
import useSimulationPanel from "./useSimulationPanel";
import { Button } from "../ui/Button";
import { AudioWaveform } from "lucide-react";

const SimulationActions: FC = () => {
  const { simulate } = useSimulationPanel();

  return (
    <div className="w-full mt-auto flex flex-row-reverse">
      <Button onClick={simulate}>
        <div className="flex items-center gap-1">
          Simulate
          <AudioWaveform className="p-0.5" />
        </div>
      </Button>
    </div>
  );
};

export default SimulationActions;
