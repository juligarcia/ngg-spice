import {
  AppNode,
  NodeType
} from "@/components/Editor/components/canvas/nodes/types";
import { match } from "ts-pattern";

type GetNodeCountParams =
  | { nodes: AppNode[]; type: NodeType.Spice; instanceName: string }
  | { nodes: AppNode[]; type: NodeType.ConnectionNode; instanceName?: never };

export const getNodeCount = (params: GetNodeCountParams) => {
  return params.nodes.reduce((count, node) => {
    return match([params, node])
      .with(
        [{ type: NodeType.Spice }, { type: NodeType.Spice }],
        ([
          { instanceName },
          {
            data: { instance_name: nodeInstanceName }
          }
        ]) => (instanceName === nodeInstanceName ? count + 1 : count)
      )
      .with(
        [{ type: NodeType.ConnectionNode }, { type: NodeType.ConnectionNode }],
        () => count + 1
      )
      .otherwise(() => count);
  }, 1);
};
