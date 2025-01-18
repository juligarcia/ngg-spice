import { spiceNodes } from "@/components/context/SpiceContext/nodes/nodes";
import { SpiceInstanceName } from "@/components/context/SpiceContext/SpiceContext";
import { AppEdge } from "@/components/Editor/components/canvas/edges/types";
import { ConnectionNodeType } from "@/components/Editor/components/canvas/nodes/ConnectionNode/types";
import {
  SpiceNodeType,
  SpiceNodeValues
} from "@/components/Editor/components/canvas/nodes/SpiceNode/types";
import {
  AppNode,
  NodeType
} from "@/components/Editor/components/canvas/nodes/types";
import { SimulationConfig } from "@/types/simulation";
import { XYPosition } from "@xyflow/react";
import { match, P } from "ts-pattern";
import { v4 as uuidv4 } from "uuid";
import { roundToTheNearestMultiple } from "./numbers";

type CommonContractNode = {
  name: string;
  position: XYPosition;
};

type ContractNodeData =
  | {
      data: {
        [key in SpiceInstanceName]: SpiceNodeValues["data"] &
          CommonContractNode;
      };
    }
  | { data: { Node: CommonContractNode } };

export type ContractNode = {
  rotation: number;
  id: string;
} & ContractNodeData;

export type ContractEdge = {
  source: string;
  source_port: string;
  target: string;
  target_port?: string;
};

export type ContractSimulationsToRun = Map<string, SimulationConfig>;

export const ContractNode = {
  toDomain: (contractNodes: ContractNode[], amp: number = 1): AppNode[] => {
    return contractNodes.map(({ id, data, rotation }) => {
      return match(data)
        .with(
          P.union({ Node: P.nonNullable }),
          ({ Node: { name, position } }) => {
            return {
              id,
              type: NodeType.ConnectionNode,
              position: {
                x: roundToTheNearestMultiple(position.x * amp, 10),
                y: roundToTheNearestMultiple(position.y * amp, 10)
              },
              data: { name }
            } as ConnectionNodeType;
          }
        )
        .otherwise((d) => {
          const instanceName = Object.keys(d)[0] as SpiceInstanceName;
          const { name, position, ...data } = d[instanceName];

          return {
            id,
            type: NodeType.Spice,
            position: {
              x: roundToTheNearestMultiple(position.x * amp, 10),
              y: roundToTheNearestMultiple(position.y * amp, 10)
            },
            data: {
              rotation,
              data,
              name,
              ...spiceNodes[instanceName as SpiceInstanceName]
            }
          } as SpiceNodeType;
        });
    });
  }
};

export const ContractEdge = {
  toDomain: (contractEdges: ContractEdge[]): AppEdge[] => {
    return contractEdges.map(({ source, source_port, target, target_port }) => {
      return {
        type: "floating",
        source,
        target,
        sourceHandle: source_port,
        id: uuidv4(),
        targetHandle: target_port
      };
    });
  }
};

export const ContractSimulationsToRun = {};
