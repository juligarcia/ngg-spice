import { FC, memo } from "react";
import { match } from "ts-pattern";
import LinearGraph from "./graphs/TwoDimensionalGraphs/LinearGraph/LinearGraph";
import { Typography } from "../ui/Typography";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Button } from "../ui/Button";
import { useSimulationStore } from "@/store/simulation";
import { useLayoutStore } from "@/store/layout";
import { simulationConfig2Name } from "./utils";
import { isOpeartingPoint } from "@/utils/simulation";

interface SimulationVisualizerProps {
  simulationId?: string;
  order: number;
}

const SimulationVisualizer: FC<SimulationVisualizerProps> = ({
  simulationId,
  order
}) => {
  const graphType = "linear";

  const simulationsToRun = useSimulationStore.use.simulationsToRun();
  const simulationConfig = simulationsToRun.get(simulationId || "");
  const updateConfiguration = useLayoutStore.use.updateConfiguration();

  const isInitialized = !!simulationConfig;

  if (!simulationId)
    return (
      <div
        id={`visualizer-container-${order}`}
        className="w-full h-full bg-accent/50 flex flex-col gap-6 p-8 items-center justify-center"
      >
        <Typography className="text-muted-foreground text-center" variant="h4">
          What simulation do you want to visualize?
        </Typography>

        <DropdownMenu>
          <DropdownMenuTrigger disabled={simulationsToRun.size === 0} asChild>
            <Button className="flex items-center gap-2">
              <Typography>Pick simulation</Typography>
              <ChevronDown size={15} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent sideOffset={10} side="bottom" align="center">
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
    );

  return (
    <div className="w-full h-full flex flex-col items-center justify-center border-r-2 border-b-2 border-accent rounded-lg overflow-hidden">
      {isInitialized && (
        <>
          {match(graphType)
            .with("linear", () => (
              <LinearGraph order={order} simulationId={simulationId} />
            ))
            .otherwise(() => null)}
        </>
      )}
    </div>
  );
};

export default memo(SimulationVisualizer);
