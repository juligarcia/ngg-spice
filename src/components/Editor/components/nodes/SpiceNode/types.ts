import { Node } from "@xyflow/react";
import { NodeType, WithRotation } from "../types";
import { SpiceNode } from "@/components/context/SpiceContext";

export type SpiceNodeValues = SpiceNode & WithRotation;

export type SpiceNodeType = Node<SpiceNodeValues, NodeType.Spice>;
