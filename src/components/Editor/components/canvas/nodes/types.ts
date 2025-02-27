import { Position } from "@xyflow/react";
import { ConnectionNodeType } from "./ConnectionNode/types";
import { SpiceNodeType } from "./SpiceNode/types";

export type WithRotation = {
  rotation?: number;
  withRotation?: {
    [key: string]: Position;
  };
};

export enum NodeCategory {
  Element = "element",
  Node = "node"
}

export enum NodeType {
  ConnectionNode = "node",
  Spice = "spice"
}

export type AppNode = ConnectionNodeType | SpiceNodeType;
