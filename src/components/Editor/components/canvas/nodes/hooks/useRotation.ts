import { useOs } from "@/components/context/OsContext";
import { osHotkeys } from "@/utils/hotkeys";
import { useReactFlow, useUpdateNodeInternals } from "@xyflow/react";
import { useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Position } from "@xyflow/react";
import Nodes from "../utils";
import { Port } from "@/components/context/SpiceContext/SpiceContext";

export type AvailableHandles = {
  [key in Position]: Array<Port>;
};

interface UseRoatationParams {
  selected?: boolean;
  id: string;
  availableHandles?: AvailableHandles;
}

function arrayRotate<T>(arr: Array<T>, reverse?: boolean) {
  if (reverse) arr.unshift(arr.pop() as T);
  else arr.push(arr.shift() as T);
  return arr;
}

type RotatedPositions = [Position, Position, Position, Position];

export const useRotation = ({
  selected,
  id,
  availableHandles = { top: [], bottom: [], left: [], right: [] }
}: UseRoatationParams): [number, Position[]] => {
  const [rotation, setRotation] = useState(0);
  const [rotatedPositions, setRotatedPositions] = useState<RotatedPositions>([
    Position.Top,
    Position.Right,
    Position.Bottom,
    Position.Left
  ]);

  const { os } = useOs();

  const updateNodeInternals = useUpdateNodeInternals();
  const { updateNodeData } = useReactFlow();

  useEffect(() => {
    const [top, right, bottom, left] = rotatedPositions;

    updateNodeData(id, {
      withRotation: {
        ...availableHandles.top.reduce<{
          [key: string]: Position;
        }>((rots, { name }, index) => {
          rots[Nodes.tagPort(id, Position.Top, name || index)] = top;

          return rots;
        }, {}),
        ...availableHandles.right.reduce<{
          [key: string]: Position;
        }>((rots, { name }, index) => {
          rots[Nodes.tagPort(id, Position.Right, name || index)] = right;

          return rots;
        }, {}),
        ...availableHandles.bottom.reduce<{
          [key: string]: Position;
        }>((rots, { name }, index) => {
          rots[Nodes.tagPort(id, Position.Bottom, name || index)] = bottom;

          return rots;
        }, {}),
        ...availableHandles.left.reduce<{
          [key: string]: Position;
        }>((rots, { name }, index) => {
          rots[Nodes.tagPort(id, Position.Left, name || index)] = left;

          return rots;
        }, {})
      }
    });
  }, []);

  useHotkeys(osHotkeys({ macos: "Meta+r" }, os), () => {
    if (selected) {
      const newPositions = arrayRotate(rotatedPositions) as RotatedPositions;
      const [top, right, bottom, left] = newPositions;

      setRotation((currentRotation) => currentRotation + 90);
      setRotatedPositions(newPositions);
      updateNodeInternals(id);

      updateNodeData(id, {
        withRotation: {
          ...availableHandles.top.reduce<{
            [key: string]: Position;
          }>((rots, { name }, index) => {
            rots[Nodes.tagPort(id, Position.Top, name || index)] = top;

            return rots;
          }, {}),
          ...availableHandles.right.reduce<{
            [key: string]: Position;
          }>((rots, { name }, index) => {
            rots[Nodes.tagPort(id, Position.Right, name || index)] = right;

            return rots;
          }, {}),
          ...availableHandles.bottom.reduce<{
            [key: string]: Position;
          }>((rots, { name }, index) => {
            rots[Nodes.tagPort(id, Position.Bottom, name || index)] = bottom;

            return rots;
          }, {}),
          ...availableHandles.left.reduce<{
            [key: string]: Position;
          }>((rots, { name }, index) => {
            rots[Nodes.tagPort(id, Position.Left, name || index)] = left;

            return rots;
          }, {})
        }
      });
    }
  });

  return [rotation, rotatedPositions];
};
