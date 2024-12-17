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

export const tagPort = (nodeId: string, nameOrIndex: string | number = 0) => {
  return `port-[${nodeId}]-${nameOrIndex}`;
};

export const tagNode = (uuid: string) => {
  return `${NodeCategory.Node}-${uuid}`;
};

export const tagElement = (uuid: string) => {
  return `${NodeCategory.Element}-${uuid}`;
};

const isOutOfBounds = (parentId: string, childId: string): boolean => {
  const child = document.getElementById(childId);
  const parent = document.getElementById(parentId);

  if (!child || !parent) return false;

  const { x, y } = child.getBoundingClientRect();

  const nodePosX = x;
  const nodePosY = y;

  const nodeWidth = child.clientWidth;

  const nodeHeight = child.clientHeight;

  const viewportWidth = parent.clientWidth;
  const viewportHeight = parent.clientHeight;

  const { left: offsetX, top: offsetY } = parent.getBoundingClientRect();

  const isOutOfXBounds =
    nodePosX - offsetX < 0 || nodePosX + nodeWidth - offsetX > viewportWidth;
  const isOutOfYBounds =
    nodePosY - offsetY < 0 || nodePosY + nodeHeight > viewportHeight;

  return isOutOfXBounds || isOutOfYBounds;
};

const Nodes = {
  calculateNodeCenter,
  findNode,
  isOfCategory,
  tagPort,
  tagNode,
  tagElement,
  isOutOfBounds
};

export default Nodes;
