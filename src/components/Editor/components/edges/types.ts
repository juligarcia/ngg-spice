import { Edge } from "@xyflow/react";
import { EditablePathEdgeType } from "./EditablePathEdge/types";

export enum EdgeType {
  EditablePath = "editable-path"
}

export type AppEdge = EditablePathEdgeType | Edge;
