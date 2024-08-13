import { NodeTypes } from "@xyflow/react";
import { NodeType } from "./types";
import ResistorNode from "./ResistorNode";
import ConnectionNode from "./ConnectionNode";
import SpiceNode from "./SpiceNode";

export const nodeTypes: NodeTypes = {
  [NodeType.Resistor]: ResistorNode,
  [NodeType.Connection]: ConnectionNode,
  [NodeType.Spice]: SpiceNode
};
