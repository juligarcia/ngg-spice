import { Node, Position } from "@xyflow/react";
import { NodeType, WithRotation } from "../types";
import { SpiceNode } from "@/components/context/SpiceContext";

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

export type SpiceNodeValues = SpiceNode & WithRotation;

export type SpiceNodeType = Node<SpiceNodeValues, NodeType.Spice>;
