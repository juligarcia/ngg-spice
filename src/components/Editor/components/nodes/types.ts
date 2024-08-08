import { ConnectionNodeType } from "./ConnectionNode/types";
import { ResistanceNodeType } from "./ResistanceNode/types";

export enum NodeCategory {
  Element = "element-",
  Connection = "connection-"
}

export enum NodeType {
  Resistance = "resistance",
  Connection = "connection"
}

export type AppNode = ResistanceNodeType | ConnectionNodeType;
