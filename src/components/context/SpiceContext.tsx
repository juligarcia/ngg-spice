import { Position } from "@xyflow/react";
import { FC, ReactNode, createContext, useContext } from "react";
import yaml from "js-yaml";
import { BaseDirectory, readDir, readTextFile } from "@tauri-apps/plugin-fs";
import { useQuery } from "@tanstack/react-query";
import { resolveResource } from "@tauri-apps/api/path";

export interface Port {
  position: Position;
  label?: string;
  spice_id?: string;
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

export interface CapacitorData extends SingleValuedElement {}

export interface InductorData extends SingleValuedElement {}

export interface VoltageSourceData extends SingleValuedElement {}

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
