import { FC } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/Button";
import { useSimulationStore } from "@/store/simulation";
import { Typography } from "@/components/ui/Typography";
import { ChevronDown } from "lucide-react";
import { useLayoutStore } from "@/store/layout";
import { simulationConfig2Name } from "../../../utils";
import { isOpeartingPoint } from "@/utils/simulation";

interface VisualizerTopToolbar2DProps {
  order: number;
  simulationId: string;
}

const VisualizerTopToolbar2D: FC<VisualizerTopToolbar2DProps> = ({
  order,
  simulationId
}) => {
  const simulationsToRun = useSimulationStore.use.simulationsToRun();
  const updateConfiguration = useLayoutStore.use.updateConfiguration();

  const simulationConfig = simulationsToRun.get(simulationId)!;

  return (
    <div className="bg-accent w-full p-2 flex items-center justify-between border-b-2 border-card">
      <div />
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger disabled={simulationsToRun.size === 1} asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
            >
              <Typography>{simulationConfig2Name(simulationConfig)}</Typography>
              <ChevronDown size={15} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent sideOffset={10} side="bottom" align="end">
            {Array.from(simulationsToRun.entries())
              .filter(
                ([_, simulationConfig]) => !isOpeartingPoint(simulationConfig)
              )
              .map(([simulationId, simulationConfig]) => (
                <DropdownMenuItem
                  key={simulationId}
                  onClick={() =>
                    updateConfiguration(order, {
                      type: "visualizer",
                      simulationId
                    })
                  }
                >
                  <Typography>
                    {simulationConfig2Name(simulationConfig)}
                  </Typography>
                </DropdownMenuItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default VisualizerTopToolbar2D;
