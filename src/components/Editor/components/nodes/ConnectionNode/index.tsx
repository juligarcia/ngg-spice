import { Handle, NodeProps } from "@xyflow/react";
import { FC } from "react";
import { ConnectionNodeType } from "@/components/Editor/components/nodes/ConnectionNode/types";
import { Hexagon } from "lucide-react";
import clsx from "clsx";
import { useRotation } from "../hooks/useRotation";
import {
  fixedBottomClass,
  fixedLeftClass,
  fixedRightClass,
  fixedTopClass
} from "../../handles/classes";

export type ConnectionNodeProps = NodeProps<ConnectionNodeType>;

const ConnectionNode: FC<ConnectionNodeProps> = ({ selected, id }) => {
  // TODO: hacer que se conecte al handle mas cercano

  const [rotation, [TOP, RIGHT, BOTTOM, LEFT]] = useRotation({ selected, id });

  return (
    <div
      style={{
        transform: `rotate(${rotation}deg) scale(${selected ? 1.25 : 1})`
      }}
      className={clsx("relative shadow-none")}
    >
      <Handle
        className={fixedLeftClass}
        type="source"
        id="left"
        position={LEFT}
      />
      <Handle className={fixedTopClass} type="source" id="top" position={TOP} />
      <div
        className={clsx(
          "bg-card rounded-full border border-foreground w-4 h-4 flex flex-col items-center justify-center"
        )}
      >
        <Hexagon
          className={clsx("h-2 w-2", {
            "stroke-primary fill-primary": selected,
            "stroke-foreground fill-card": !selected
          })}
        />
      </div>
      <Handle
        className={fixedBottomClass}
        type="source"
        id="bottom"
        position={BOTTOM}
      />

      <Handle
        className={fixedRightClass}
        type="source"
        id="right"
        position={RIGHT}
      />
    </div>
  );
};

export default ConnectionNode;
