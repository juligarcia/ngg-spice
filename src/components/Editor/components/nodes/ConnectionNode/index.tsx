import { Handle, NodeProps, Position } from "@xyflow/react";
import { FC } from "react";
import { ConnectionNodeType } from "@/components/Editor/components/nodes/ConnectionNode/types";
import { Hexagon } from "lucide-react";
import clsx from "clsx";
import { tagPort } from "../utils";

export type ConnectionNodeProps = NodeProps<ConnectionNodeType>;

const uniformClassname =
  "!top-0 !left-0 !right-[unset] !bottom-[unset] !w-full !h-full !opacity-0 !transform-none z-[-1]";

const ConnectionNode: FC<ConnectionNodeProps> = ({ selected, id }) => {
  return (
    <div
      className={clsx("relative shadow-none", {
        "scale-150": selected
      })}
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
        className={clsx(
          "bg-card rounded-full border border-foreground w-[20px] h-[20px] flex flex-col items-center justify-center"
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
