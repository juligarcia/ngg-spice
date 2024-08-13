import { Position } from "@xyflow/react";
import { ConnectionNodeType } from "./ConnectionNode/types";
import { ResistorNodeType } from "./ResistorNode/types";
import { SpiceNodeType } from "./SpiceNode/types";

export type WithRotation = {
  withRotation?: {
    [key: string]: Position;
  };
};

export enum NodeCategory {
  Element = "element",
  Connection = "connection"
}

export enum NodeType {
  Resistor = "resistor",
  Connection = "connection",
  Spice = "spice"
}

export type AppNode = ResistorNodeType | ConnectionNodeType | SpiceNodeType;
