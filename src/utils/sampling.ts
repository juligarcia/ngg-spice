import { Series } from "@/components/SimulationVisualizer/graphs/TwoDimensionalGraphs/LinearGraph/LinearGraph";
import { getX, getY } from "@/components/SimulationVisualizer/graphs/utils";
import { SimulationData } from "@/types/simulation";
import * as Arr from "@/utils/array";

export function downsample(
  data: SimulationData[],
  estimatedDensity: number,
  lastDatumIndex: number,
  xAccessor: string,
  series: Series[]
): [number[][], number] {
  // Grab only new data range
  const sliced = Arr.slice(
    data,
    Math.min(lastDatumIndex, data.length),
    data.length
  );

  // Get a downsampled sized array
  const downSampledArraySize = Math.floor(
    (data.length - lastDatumIndex) / estimatedDensity
  );

  // Correction offset for better sampling
  const nextCorrectionOffset =
    (data.length - lastDatumIndex) % estimatedDensity;

  if (!downSampledArraySize) return [[], 0];

  const downSampledData = Arr.reduce(
    sliced,
    (acc, curr, dataIndex) => {
      const downSampledIndex = Math.floor(dataIndex / estimatedDensity);
      const rest = (lastDatumIndex + dataIndex) % estimatedDensity;

      if (rest !== 0) return acc;

      const x = getX(xAccessor)(curr);
      const yValues = Arr.map(series, (s) => getY(s.accessor)(curr));

      acc[downSampledIndex] = [x, ...yValues];

      return acc;
    },
    Array<Array<number>>(Math.max(downSampledArraySize))
  );

  return [downSampledData, data.length - nextCorrectionOffset];
}
