import { FC, memo } from "react";
import { match, P } from "ts-pattern";
import LinearGraph from "./graphs/LinearGraph";
import { Typography } from "../ui/Typography";
import { useMeasure } from "@uidotdev/usehooks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Button } from "../ui/Button";
import { useSimulationStore } from "@/store/simulation";
import { SimulationDisplay } from "@/types/simulation";
import { useLayoutStore } from "@/store/layout";

interface SimulationVisualizerProps {
  simulationId?: string;
  order: number;
}

const SimulationVisualizer: FC<SimulationVisualizerProps> = ({
  simulationId,
  order
}) => {
  const graphType = "linear";

  const [ref, { width, height }] = useMeasure();

  const simulationsToRun = useSimulationStore.use.simulationsToRun();
  const updateConfiguration = useLayoutStore.use.updateConfiguration();

  const isInitialized = width && height;

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
            {Array.from(simulationsToRun.entries()).map(
              ([simulationId, simulationConfig]) => (
                <DropdownMenuItem
                  key={simulationId}
                  onClick={() =>
                    updateConfiguration(order, {
                      type: "visualizer",
                      simulationId
                    })
                  }
                >
                  {/* <PencilRuler size={15} className="mr-2" /> */}
                  <Typography>
                    {match(simulationConfig)
                      .with(
                        { Tran: P.nonNullable },
                        () => SimulationDisplay.tran
                      )
                      .with({ Ac: P.nonNullable }, () => SimulationDisplay.ac)
                      .with({ Dc: P.nonNullable }, () => SimulationDisplay.dc)
                      .with(
                        { Disto: P.nonNullable },
                        () => SimulationDisplay.disto
                      )
                      .with(
                        { Noise: P.nonNullable },
                        () => SimulationDisplay.noise
                      )
                      .with({ Op: P.nonNullable }, () => SimulationDisplay.op)
                      .with({ Pz: P.nonNullable }, () => SimulationDisplay.pz)
                      .with(
                        { Sens: P.nonNullable },
                        () => SimulationDisplay.sens
                      )
                      .run()}
                  </Typography>
                </DropdownMenuItem>
              )
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );

  return (
    <div
      ref={ref}
      className="w-full h-full flex flex-col items-center justify-center border-2 border-accent rounded-lg overflow-hidden"
    >
      {isInitialized &&
        match(graphType)
          .with("linear", () => (
            <LinearGraph
              order={order}
              simulationId={simulationId}
              width={width}
              height={height}
            />
          ))
          .otherwise(() => null)}
    </div>
  );
};

export default memo(SimulationVisualizer);
