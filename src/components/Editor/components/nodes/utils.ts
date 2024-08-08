import { Node } from "@xyflow/react";
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

// export const findNode = <T extends Node>(nodes: Array<T>, match:string, with:string | number ): T | undefined => {}

export const findNode = <K extends keyof Node>(
  nodes: Node[],
  match: K,
  withValue: Node[K]
) => {
  return nodes.find((node) => node[match] === withValue);
};

export const isOfCategory = <T extends Node>(
  node: T,
  category: NodeCategory
): boolean => {
  // TODO: implement
  return true;
};
