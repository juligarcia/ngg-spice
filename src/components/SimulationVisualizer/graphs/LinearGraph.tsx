import { FC, useCallback, useEffect, useMemo, useRef } from "react";

import { useSimulationStore } from "@/store/simulation";

import Dygraph from "dygraphs";
import { throttle } from "lodash";
import { PlotState } from "./types";
import {
  isInProgress,
  isReady,
  SimulationData,
  SimulationStatus,
  SimulationStatusPayload
} from "@/types/simulation";
import { downsample } from "@/utils/sampling";
import bs from "binary-search";
import { getX } from "./utils";
import * as Arr from "@/utils/array";

type LinearGraphProps = {
  width: number;
  height: number;
  simulationId: string;
  order: number;
};

const LinearGraph: FC<LinearGraphProps> = ({ simulationId, order }) => {
  const graphContainerId = `chart-container-${order}-${simulationId}`;

  const _dataRef = useRef(
    useSimulationStore.use.simulationData().get(simulationId) || []
  );

  const _simulationStatus = useRef(
    useSimulationStore.use.simulationStatus().get(simulationId)
  );

  const deriveState = (
    data: SimulationData[],
    simulationStatus?: SimulationStatus
  ): PlotState => {
    const graphContainer = document.getElementById(
      graphContainerId
    ) as HTMLElement;

    // Take dimensions from parent
    const width = graphContainer.clientWidth;
    const height = graphContainer.clientHeight;

    const xAccessor = "time";
    const yAccessor = "vv1#branch";

    // Grab plot / simulation completion from the simulation status 0, ..., 100
    const plotCompletion = isInProgress(simulationStatus)
      ? simulationStatus.status.Progress.progress
      : isReady(simulationStatus)
      ? 100
      : 0;

    // If plot completio is positive, different from 0, estimate total points
    const estimatedTotalPoints =
      plotCompletion && (100 * data.length) / plotCompletion;

    // Having estimated total points, estimate points per pixel or density
    // if total points is too low -> less than 1 point per pixel
    // we take 1 point per pixel
    const estimatedDensity = Math.max(
      Math.floor(estimatedTotalPoints / (width * 5)),
      1
    );

    // If initial data exists, downsample it
    const downSampledData =
      data.length === 0
        ? []
        : downsample(data, estimatedDensity, 0, xAccessor, yAccessor);

    const lastDatumIndex = data.length;

    return {
      graph: null,
      xAccessor,
      yAccessor,
      data,
      plotCompletion,
      estimatedTotalPoints,
      estimatedDensity,
      downSampledData,
      lastDatumIndex,
      width,
      height
    };
  };

  const handleZoomChange = (
    x1: number,
    x2: number,
    yRanges: ReadonlyArray<[number, number]>
  ) => {
    if (!plotState.current) return;

    const data = plotState.current.data;
    const downSampledData = plotState.current.downSampledData;

    const xAccessor = plotState.current.xAccessor;
    const yAccessor = plotState.current.yAccessor;

    const width = plotState.current.width;

    // Binary search indexes on full data array
    // This binary search will either return the actual index or a suggested one
    const start = Math.abs(
      bs(data, x1, (datum, needle) => getX(xAccessor)(datum) - needle)
    );

    const end = Math.abs(
      bs(data, x2, (datum, needle) => getX(xAccessor)(datum) - needle)
    );

    const estimatedDensity = Math.floor((end - start) / (width * 5));

    // Avoid further downsampling if point density does not accompany
    if (estimatedDensity <= 0) return;

    // Downsample the original data but only the slice between start and end
    const zoomedInDownSampledData = downsample(
      Arr.slice(data, start, end + 1),
      estimatedDensity,
      0,
      xAccessor,
      yAccessor
    );

    // Only piece of state that will be tinkered with here is the down sampled data
    // Every other piece of state is critial to overall plotting

    const downSampledStart = Math.abs(
      bs(downSampledData, x1, (datum, needle) => datum[0] - needle)
    );

    const downSampledEnd = Math.abs(
      bs(downSampledData, x2, (datum, needle) => datum[0] - needle)
    );

    const firstHalf = Arr.slice(downSampledData, 0, downSampledStart);

    const secondHalf = Arr.slice(
      downSampledData,
      downSampledEnd,
      downSampledData.length
    );

    const newDownSampledData = [
      ...firstHalf,
      ...zoomedInDownSampledData,
      ...secondHalf
    ];

    plotState.current.downSampledData = newDownSampledData;
    plotState.current.graph?.updateOptions({
      file: newDownSampledData,
      valueRange: [...yRanges[0]]
    });
  };

  const plotState = useRef<PlotState | null>(null);

  // Initiate plot state
  useEffect(() => {
    plotState.current = deriveState(
      _dataRef.current,
      _simulationStatus.current
    );
  }, []);

  // Create Dygraph plot with down sampled data
  useEffect(() => {
    const graphContainer = document.getElementById(graphContainerId);

    if (!graphContainer || !plotState.current) return;

    const dygraph = new Dygraph(
      graphContainer,
      plotState.current.downSampledData,
      {
        animatedZooms: true,
        labels: [plotState.current.xAccessor, plotState.current.yAccessor],
        color: "#7C3AED",
        title: `${plotState.current.yAccessor} / ${plotState.current.xAccessor}`,
        legend: "always",
        strokeWidth: 2,
        gridLineColor: "#D5D7DD",
        axisLineColor: "#D5D7DD",
        zoomCallback: handleZoomChange
      }
    );

    plotState.current.graph = dygraph;

    return () => dygraph.destroy();
  }, [graphContainerId]);

  // Listen to container resize
  const [resizeObserver, target] = useMemo<
    [ResizeObserver | null, HTMLElement | null]
  >(() => {
    const graphContainer = document.getElementById(graphContainerId);

    if (!graphContainer) return [null, null];

    const observer = new ResizeObserver(() => {
      plotState.current?.graph?.resize();
    });

    observer.observe(graphContainer);

    return [observer, graphContainer];
  }, [order, graphContainerId]);

  // Cleanup observer
  useEffect(() => {
    return () => resizeObserver?.unobserve(target as Element);
  }, [resizeObserver, target]);

  const throttledUpdate = useCallback(
    throttle((simulationStatus: SimulationStatus) => {
      if (!plotState.current) return;

      const width = plotState.current.width;
      const data = plotState.current.data;
      const xAccessor = plotState.current.xAccessor;
      const yAccessor = plotState.current.yAccessor;
      const lastDatumIndex = plotState.current.lastDatumIndex;

      const plotCompletion = isInProgress(simulationStatus)
        ? simulationStatus.status.Progress.progress
        : isReady(simulationStatus)
        ? 100
        : 0;

      // If plot completio is positive, different from 0, estimate total points
      const estimatedTotalPoints =
        plotCompletion && (100 * data.length) / plotCompletion;

      // Having estimated total points, estimate points per pixel or density
      // if total points is too low -> less than 1 point per pixel
      // we take 1 point per pixel
      const estimatedDensity = Math.max(
        Math.floor(estimatedTotalPoints / (width * 5)),
        1
      );

      const newDownSampledData = downsample(
        data,
        estimatedDensity,
        lastDatumIndex,
        xAccessor,
        yAccessor
      );

      plotState.current.downSampledData.push(...newDownSampledData);
      plotState.current.plotCompletion = plotCompletion;
      plotState.current.estimatedTotalPoints = estimatedTotalPoints;
      plotState.current.estimatedDensity = estimatedDensity;
      plotState.current.lastDatumIndex = data.length;

      plotState.current.graph?.updateOptions({
        file: plotState.current.downSampledData
      });

      console.log(plotState.current.downSampledData.length);
    }, 300),
    []
  );

  // Listen to data and status changes
  useEffect(
    () =>
      useSimulationStore.subscribe(
        (
          state
        ): [
          SimulationData[] | undefined,
          SimulationStatusPayload | undefined
        ] => [
          state.simulationData.get(simulationId),
          state.simulationStatus.get(simulationId)
        ],
        ([simulationData, simulationStatus]) => {
          // Check that the necessary data is in place
          if (
            !plotState.current ||
            !simulationData ||
            !simulationStatus ||
            !isInProgress(simulationStatus)
          )
            return;

          if (plotState.current.data !== simulationData) {
            plotState.current = {
              ...deriveState(simulationData, simulationStatus),
              graph: plotState.current.graph
            };

            plotState.current.graph?.updateOptions({
              file: plotState.current.downSampledData
            });
          }

          throttledUpdate(simulationStatus);
        }
      ),
    [simulationId]
  );

  return (
    <div className="bg-card p-4 h-full w-full max-w-full max-h-full">
      <div
        className="h-full w-full max-w-full max-h-full"
        id={graphContainerId}
      />
    </div>
  );
};

export default LinearGraph;
