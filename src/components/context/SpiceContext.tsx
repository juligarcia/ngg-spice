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

type WithOptions =
  | { type: "number"; options?: never }
  | { type: "string"; options?: never }
  | { type: "select"; options: Array<string> };

export type Value = {
  type: "number" | "string" | "select";
  validation?: string;
  name: string;
} & WithOptions;

export type SpiceNode = {
  name: string;
  asset?: string;
  values: Array<Value>;
  top_ports: Array<Port>;
  right_ports: Array<Port>;
  bottom_ports: Array<Port>;
  left_ports: Array<Port>;
  dimensions: { width: number; height: number };
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

          if (spiceNode.asset) {
            const assetPath = await resolveResource(
              `spice/components/${spiceNode.asset}`
            );

            const assetContent = await readTextFile(assetPath);

            return { ...spiceNode, asset: assetContent };
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
