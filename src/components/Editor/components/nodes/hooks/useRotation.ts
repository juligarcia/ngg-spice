import { useOs } from "@/components/context/OsContext";
import { osHotkeys } from "@/utils/hotkeys";
import { useUpdateNodeInternals } from "@xyflow/react";
import { useState } from "react";
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

export const useRotation = ({
  selected,
  id
}: UseRoatationParams): [number, Position[]] => {
  const [rotation, setRotation] = useState(0);
  const [rotatedPositions, setRotatedPositions] = useState([
    Position.Top,
    Position.Right,
    Position.Bottom,
    Position.Left
  ]);

  const { os } = useOs();

  const updateNodeInternals = useUpdateNodeInternals();

  useHotkeys(osHotkeys({ Darwin: "Meta+r" }, os), () => {
    if (selected) {
      setRotation((currentRotation) => currentRotation + 90);
      setRotatedPositions(arrayRotate(rotatedPositions));
      updateNodeInternals(id);
    }
  });

  return [rotation, rotatedPositions];
};
