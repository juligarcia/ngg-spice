import { Node } from "@xyflow/react";
import { NodeType } from "../types";

export type ResistanceNodeValues = {
  value: number;
  unit: string;
};

export type ResistanceNodeType = Node<
  ResistanceNodeValues,
  NodeType.Resistance
>;
