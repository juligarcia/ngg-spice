import { FC, ReactNode, createContext, useContext } from "react";
import yaml from "js-yaml";
import { BaseDirectory, readDir, readTextFile } from "@tauri-apps/plugin-fs";
import { useQuery } from "@tanstack/react-query";
import { resolveResource } from "@tauri-apps/api/path";
import { SmallsignalParameters, TimeDomainParameters } from "@/types/elements";

export interface Port {
  name?: string;
  x: number;
  y: number;
}

export type Field = {
  type: "number" | "string";
  validation?: string;
  name: string;
  required?: boolean;
};

export enum SpiceInstanceName {
  Resistor = "R",
  Inductor = "L",
  Capacitor = "C",
  VoltageSource = "V",
  Ground = "Gnd"
}

export interface SingleValuedElement {
  value: string;
}

export interface ResistorData extends SingleValuedElement {}
export const REQUIRED_RESISTOR_VALUES: Array<keyof ResistorData> = ["value"];

export interface CapacitorData extends SingleValuedElement {}
export const REQUIRED_CAPACITOR_VALUES: Array<keyof CapacitorData> = ["value"];

export interface InductorData extends SingleValuedElement {}
export const REQUIRED_INDUCTOR_VALUES: Array<keyof InductorData> = ["value"];

export type VoltageSourceData = {
  time_domain: TimeDomainParameters;
  small_signal: SmallsignalParameters;
};
export const REQUIRED_VOLTAGE_SOURCE_VALUES: Array<
  UnionNestedKeysOf<VoltageSourceData>
> = [
  "time_domain.Dc.value",
  "time_domain.Pulse.initial_value",
  "time_domain.Pulse.final_value",
  "time_domain.Sin.offset",
  "time_domain.Sin.amplitude",
  "time_domain.Exp.initial_value",
  "time_domain.Exp.final_value",
  "time_domain.Sffm.offset",
  "time_domain.Sffm.amplitude",
  "time_domain.Am.offset",
  "time_domain.Am.amplitude",
  "time_domain.Am.modulating_frequency",
  "small_signal.amplitude"
];

export type SpiceData =
  | { instance_name: SpiceInstanceName.Resistor; data: Partial<ResistorData> }
  | { instance_name: SpiceInstanceName.Capacitor; data: Partial<CapacitorData> }
  | { instance_name: SpiceInstanceName.Inductor; data: Partial<InductorData> }
  | {
      instance_name: SpiceInstanceName.VoltageSource;
      data: Partial<VoltageSourceData>;
    }
  | { instance_name: SpiceInstanceName.Ground; data: { value?: never } };

export type SpiceNode = {
  symbol?: string;
  fields: Array<Field>;
  top_ports: Array<Port>;
  right_ports: Array<Port>;
  bottom_ports: Array<Port>;
  left_ports: Array<Port>;
  dimensions: { width: number; height: number };
  name: string;
} & SpiceData;

export const SpiceNodeDisplayName: { [key in SpiceInstanceName]: string } = {
  [SpiceInstanceName.Resistor]: "Resistor",
  [SpiceInstanceName.Capacitor]: "Capacitor",
  [SpiceInstanceName.Inductor]: "Inductor",
  [SpiceInstanceName.Ground]: "Ground",
  [SpiceInstanceName.VoltageSource]: "Voltage Source"
};

interface SpiceContextType {
  components: Array<SpiceNode>;
  isLoading: boolean;
}

const SpiceContext = createContext<SpiceContextType>({
  components: [],
  isLoading: false
});

interface SpiceContextProviderProps {
  children: ReactNode;
}

export const SpiceContextProvider: FC<SpiceContextProviderProps> = ({
  children
}) => {
  const { data: components, isPending: isLoadingSpice } = useQuery({
    queryKey: ["spice-nodes"],
    queryFn: async () => {
      const entries = await readDir("spice/components", {
        baseDir: BaseDirectory.Resource
      });

      const fileEntries = entries.filter(({ isFile, name }) => {
        const extension = name.split(".").at(-1);

        return isFile && (extension === "yaml" || extension === "yml");
      });

      return await Promise.all(
        fileEntries.map(async ({ name }) => {
          const content = await readTextFile(`spice/components/${name}`, {
            baseDir: BaseDirectory.Resource
          });

          const spiceNode = yaml.load(content) as SpiceNode;

          if (spiceNode.symbol) {
            const symbolPath = await resolveResource(
              `spice/components/${spiceNode.symbol}`
            );

            const symbolSVG = await readTextFile(symbolPath);

            return { ...spiceNode, symbol: symbolSVG };
          }

          return spiceNode;
        })
      );
    },
    refetchOnMount: true
  });

  const isLoading = isLoadingSpice;

  return (
    <SpiceContext.Provider value={{ components: components ?? [], isLoading }}>
      {children}
    </SpiceContext.Provider>
  );
};

export const useSpice = () => {
  const spiceContext = useContext(SpiceContext);

  return spiceContext;
};
