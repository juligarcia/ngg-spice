import { useOs } from "@/components/context/OsContext";
import { osHotkeys } from "@/utils/hotkeys";
import { useReactFlow, useUpdateNodeInternals } from "@xyflow/react";
import { useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Position } from "@xyflow/react";

interface UseRoatationParams {
  selected?: boolean;
  id: string;
}

function arrayRotate<T>(arr: Array<T>, reverse?: boolean) {
  if (reverse) arr.unshift(arr.pop() as T);
  else arr.push(arr.shift() as T);
  return arr;
}

type RotatedPositions = [Position, Position, Position, Position];

export const useRotation = ({
  selected,
  id
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
        [`handle-${id}-top`]: top,
        [`handle-${id}-right`]: right,
        [`handle-${id}-bottom`]: bottom,
        [`handle-${id}-left`]: left
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
          [`handle-${id}-top`]: top,
          [`handle-${id}-right`]: right,
          [`handle-${id}-bottom`]: bottom,
          [`handle-${id}-left`]: left
        }
      });
    }
  });

  return [rotation, rotatedPositions];
};
