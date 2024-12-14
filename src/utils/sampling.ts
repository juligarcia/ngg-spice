import { getX, getY } from "@/components/SimulationVisualizer/graphs/utils";
import { SimulationData } from "@/types/simulation";
import * as Arr from "@/utils/array";

export function downsample(
  data: SimulationData[],
  estimatedDensity: number,
  lastDatumIndex: number,
  xAccessor: string,
  yAccessor: string
) {
  // Grab only new data range
  const sliced = Arr.slice(data, lastDatumIndex, data.length);

  // Get a downsampled sized array
  const downSampledArraySize = Math.floor(
    (data.length - lastDatumIndex) / estimatedDensity
  );

  if (!downSampledArraySize) return [];

  const downSampledData = Arr.reduce(
    sliced,
    (acc, curr, dataIndex) => {
      const downSampledIndex = Math.floor(dataIndex / estimatedDensity);
      const rest = (lastDatumIndex + dataIndex) % estimatedDensity;

      if (rest !== 0) return acc;

      const x = getX(xAccessor)(curr);
      const y = getY(yAccessor)(curr);

      acc[downSampledIndex] = [x, y];

      return acc;
    },
    Array<[number, number]>(Math.max(downSampledArraySize))
  );

  return downSampledData;
}
