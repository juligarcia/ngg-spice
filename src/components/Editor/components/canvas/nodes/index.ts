import { NodeTypes } from "@xyflow/react";
import { NodeType } from "./types";
import ConnectionNode from "./ConnectionNode/ConnectionNode";
import SpiceNode from "./SpiceNode/SpiceNode";

export const nodeTypes: NodeTypes = {
  [NodeType.ConnectionNode]: ConnectionNode,
  [NodeType.Spice]: SpiceNode
};
