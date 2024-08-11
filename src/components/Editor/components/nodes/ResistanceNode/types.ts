import { Node } from "@xyflow/react";
import { NodeType, WithRotation } from "../types";

export type ResistanceNodeValues = {
  value: number;
  unit: string;
} & WithRotation;

export type ResistanceNodeType = Node<
  ResistanceNodeValues,
  NodeType.Resistance
>;
