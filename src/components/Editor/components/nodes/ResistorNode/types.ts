import { Node } from "@xyflow/react";
import { NodeType, WithRotation } from "../types";

export type ResistorNodeValues = {
  value: number;
  unit: string;
} & WithRotation;

export type ResistorNodeType = Node<ResistorNodeValues, NodeType.Resistor>;
