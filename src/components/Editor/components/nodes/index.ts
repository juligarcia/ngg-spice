import { NodeTypes } from "@xyflow/react";
import { NodeType } from "./types";
import ResistanceNode from "./ResistanceNode";
import ConnectionNode from "./ConnectionNode";

export const nodeTypes: NodeTypes = {
  [NodeType.Resistance]: ResistanceNode,
  [NodeType.Connection]: ConnectionNode
};
