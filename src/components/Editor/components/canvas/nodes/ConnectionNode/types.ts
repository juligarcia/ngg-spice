import { Node } from "@xyflow/react";
import { NodeType } from "../types";

export type ConnectionNodeType = Node<
  { name: string },
  NodeType.ConnectionNode
>;
