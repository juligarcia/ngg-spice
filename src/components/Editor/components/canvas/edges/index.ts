import { EdgeTypes } from "@xyflow/react";
import { EdgeType } from "./types";
import SingleEndedFloatingEdge from "./SingleEndedFloatingEdge";

export const edgeTypes: EdgeTypes = {
  [EdgeType.Floating]: SingleEndedFloatingEdge
};
