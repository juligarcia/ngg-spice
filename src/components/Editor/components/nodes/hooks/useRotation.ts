import { useOs } from "@/components/context/OsContext";
import { osHotkeys } from "@/utils/hotkeys";
import { useReactFlow, useUpdateNodeInternals } from "@xyflow/react";
import { useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Position } from "@xyflow/react";
import Nodes from "../utils";

export type AvailableHandles = {
  [key in Position]: number;
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
  availableHandles = { top: 1, bottom: 1, left: 1, right: 1 }
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
        ...Array.from({ length: availableHandles.top }).reduce<{
          [key: string]: Position;
        }>((rots, _, index) => {
          rots[Nodes.tagPort(id, Position.Top, index)] = top;

          return rots;
        }, {}),
        ...Array.from({ length: availableHandles.right }).reduce<{
          [key: string]: Position;
        }>((rots, _, index) => {
          rots[Nodes.tagPort(id, Position.Right, index)] = right;

          return rots;
        }, {}),
        ...Array.from({ length: availableHandles.bottom }).reduce<{
          [key: string]: Position;
        }>((rots, _, index) => {
          rots[Nodes.tagPort(id, Position.Bottom, index)] = bottom;

          return rots;
        }, {}),
        ...Array.from({ length: availableHandles.left }).reduce<{
          [key: string]: Position;
        }>((rots, _, index) => {
          rots[Nodes.tagPort(id, Position.Left, index)] = left;

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
          ...Array.from({ length: availableHandles.top }).reduce<{
            [key: string]: Position;
          }>((rots, _, index) => {
            rots[Nodes.tagPort(id, Position.Top, index)] = top;

            return rots;
          }, {}),
          ...Array.from({ length: availableHandles.right }).reduce<{
            [key: string]: Position;
          }>((rots, _, index) => {
            rots[Nodes.tagPort(id, Position.Right, index)] = right;

            return rots;
          }, {}),
          ...Array.from({ length: availableHandles.bottom }).reduce<{
            [key: string]: Position;
          }>((rots, _, index) => {
            rots[Nodes.tagPort(id, Position.Bottom, index)] = bottom;

            return rots;
          }, {}),
          ...Array.from({ length: availableHandles.left }).reduce<{
            [key: string]: Position;
          }>((rots, _, index) => {
            rots[Nodes.tagPort(id, Position.Left, index)] = left;

            return rots;
          }, {})
        }
      });
    }
  });

  return [rotation, rotatedPositions];
};
