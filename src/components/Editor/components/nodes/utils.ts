import { Node, Position } from "@xyflow/react";
import { NodeCategory } from "./types";

// Given that nodeOrigin = [0.5, 0.5] we only need it's position here
export const calculateNodeCenter = <T extends Node>(
  node: T
): [number, number] => {
  const {
    position: { x, y }
  } = node;

  return [x, y];
};

export const findNode = <K extends keyof Node>(
  nodes: Node[],
  match: K,
  withValue: Node[K]
) => {
  return nodes.find((node) => node[match] === withValue);
};

export const isOfCategory = <T extends Node>(
  node: T | string,
  category: NodeCategory
): boolean => {
  return typeof node === "string"
    ? node.indexOf(category) >= 0
    : node.id.indexOf(category) >= 0;
};

export const tagPort = (
  nodeId: string,
  position: Position,
  index: number = 0
) => {
  return `port-[${nodeId}]-${position}-${index}`;
};

const Nodes = {
  calculateNodeCenter,
  findNode,
  isOfCategory,
  tagPort
};

export default Nodes;
