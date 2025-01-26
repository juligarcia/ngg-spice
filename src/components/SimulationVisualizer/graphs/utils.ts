import { SimulationData } from "@/types/simulation";

export const getY =
  (name: string) =>
  (d: SimulationData): number => {
    const data = d.computed_values_for_index.find((data) => data.name === name);

    if (data) return data.c_real;

    return 0;
  };

export const getX =
  (name: string) =>
  (d: SimulationData): number => {
    const data = d.computed_values_for_index.find((data) => data.name === name);

    if (data) return data.c_real;

    return 0;
  };

export const getReal =
  (name: string) =>
  (d: SimulationData): number | null => {
    const data = d.computed_values_for_index.find((data) => data.name === name);

    if (data) return data.c_real;

    return null;
  };
