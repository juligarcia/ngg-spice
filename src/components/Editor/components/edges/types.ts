import { Edge } from "@xyflow/react";
import { SingleEndedFloatingEdgeType } from "./SingleEndedFloatingEdge/types";

export enum EdgeType {
  Floating = "floating"
}

export type AppEdge = SingleEndedFloatingEdgeType | Edge;
