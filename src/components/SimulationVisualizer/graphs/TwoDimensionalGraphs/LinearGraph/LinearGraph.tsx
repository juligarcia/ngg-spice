import { FC, useEffect, useState } from "react";
import LinearGraphLayout from "./LinearGraphLayout";
import VisualizerSideToolbar2D from "../components/VisualizerSideToolbar2D";
import { useSimulationStore } from "@/store/simulation";
import { SimulationBasis, SimulationData } from "@/types/simulation";
import { Typography } from "@/components/ui/Typography";
import VisualizerTopToolbar2D from "../components/VisualizerTopToolbar2D";
import randomColor from "randomcolor";
import { useTheme } from "@/components/ThemeProvider";
import { isEmpty } from "lodash";

export type Series = {
  accessor: string;
  color: string;
  strokeWidth: number;
};

interface LinearGraphProps {
  simulationId: string;
  order: number;
}

const LinearGraph: FC<LinearGraphProps> = ({ simulationId, order }) => {
  const { isDark } = useTheme();

  const simulationData = useSimulationStore((state) =>
    state.simulationData.get(simulationId)
  );

  const getAvailableNodes = (simulationData: SimulationData[] | undefined) =>
    simulationData && !isEmpty(simulationData)
      ? simulationData[0]?.computed_values_for_index.map(({ name }) => name)
      : [];

  const availableNodes = getAvailableNodes(simulationData);

  const [xAccessor, setXAccessor] = useState<string | null>(null);
  const [series, setSeries] = useState<Series[]>([]);

  const partiallyUpdateSeries = (
    index: number,
    partial: Partial<Series> | null
  ) => {
    const firstHalf = series.slice(0, index);
    const secondHalf = series.slice(index + 1, series.length);

    if (!partial) return setSeries([...firstHalf, ...secondHalf]);

    const updated = { ...series[index], ...partial };
    setSeries([...firstHalf, updated, ...secondHalf]);
  };

  const createSeries = (accessor: string): Series => {
    return {
      accessor,
      color: randomColor({ luminosity: isDark ? "light" : "dark" }),
      strokeWidth: 4
    };
  };

  const addSeries = (accessor: string) => {
    setSeries([...series, createSeries(accessor)]);
  };

  const deriveInitialAccessors = (
    simulationData: SimulationData[] | undefined
  ) => {
    if (!simulationData) return;

    const availableNodes = getAvailableNodes(simulationData);

    const maybeXAccessor =
      Object.values(SimulationBasis).find(
        (basis) => availableNodes.includes(basis) && basis
      ) || null;

    const maybeYAccessor =
      availableNodes.filter(
        (node) => !Object.values<string>(SimulationBasis).includes(node)
      )[0] || null;

    if (maybeYAccessor) setSeries([createSeries(maybeYAccessor)]);
    setXAccessor(maybeXAccessor);
  };

  useEffect(() => {
    deriveInitialAccessors(simulationData);
  }, [simulationId]);

  useEffect(
    () =>
      useSimulationStore.subscribe(
        (state) => state.simulationData.get(simulationId),
        (simulationData) => {
          deriveInitialAccessors(simulationData);
        }
      ),
    [simulationId]
  );

  const initialized = !!xAccessor && !!series.length;

  return (
    <div className="flex flex-col w-full h-full max-w-full max-h-full">
      <VisualizerTopToolbar2D order={order} simulationId={simulationId} />
      <div className="flex bg-card grow min-h-0">
        <VisualizerSideToolbar2D
          addSeries={addSeries}
          availableNodes={availableNodes}
          setXAccessor={setXAccessor}
          partiallyUpdateSeries={partiallyUpdateSeries}
          xAccessor={xAccessor}
          series={series}
          simulationId={simulationId}
        />
        {initialized ? (
          <LinearGraphLayout
            key={simulationId}
            xAccessor={xAccessor}
            series={series}
            simulationId={simulationId}
            order={order}
          />
        ) : (
          <div className="p-8 w-full h-full flex flex-col items-center justify-center">
            <Typography variant="h4" className="text-muted-foreground">
              Select X and Y
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
};

export default LinearGraph;
