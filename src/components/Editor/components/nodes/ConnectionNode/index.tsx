import { Handle, NodeProps, Position } from "@xyflow/react";
import { FC } from "react";
import { ConnectionNodeType } from "@/components/Editor/components/nodes/ConnectionNode/types";
import { Hexagon, Waypoints } from "lucide-react";
import clsx from "clsx";
import { tagPort } from "../utils";
import usePointerProximity from "@/hooks/usePointerProximity";

export type ConnectionNodeProps = NodeProps<ConnectionNodeType>;

const uniformClassname =
  "!top-0 !left-0 !right-[unset] !bottom-[unset] !w-full !h-full !opacity-0 !transform-none z-[-1]";

const ConnectionNode: FC<ConnectionNodeProps> = ({ selected, id }) => {
  const proximity = usePointerProximity({ id });

  return (
    <div
      id={id}
      className={clsx("relative animate-transform duration-100 ease-in-out")}
    >
      <Handle
        className={uniformClassname}
        type="source"
        id={tagPort(id, Position.Left)}
        position={Position.Left}
      />
      <Handle
        className={uniformClassname}
        type="source"
        id={tagPort(id, Position.Top)}
        position={Position.Top}
      />
      <div
        style={{ transform: `scale(${Math.max((proximity + 50) / 100, 1)})` }}
        className={clsx(
          "transition-[border-color] duration-150 ease-in-out bg-card border hover:border-muted-foreground [&:hover_svg]:stroke-muted-foreground border-foreground rounded-sm w-[25px] h-[25px] p-1 flex flex-col items-center justify-center",
          {
            "!scale-150 !border-muted-foreground [&_svg]:stroke-muted-foreground":
              selected
          }
        )}
      >
        <Waypoints
          className={clsx(
            "h-full w-full transition-[stroke] duration-150 ease-in-out stroke-foreground"
          )}
        />
      </div>
      <Handle
        className={uniformClassname}
        type="source"
        id={tagPort(id, Position.Bottom)}
        position={Position.Bottom}
      />

      <Handle
        className={uniformClassname}
        type="source"
        id={tagPort(id, Position.Right)}
        position={Position.Right}
      />
    </div>
  );
};

export default ConnectionNode;
