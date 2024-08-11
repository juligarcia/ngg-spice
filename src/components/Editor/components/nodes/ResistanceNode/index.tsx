import { NodeProps, Position } from "@xyflow/react";
import { FC, forwardRef } from "react";
import { ResistanceNodeType } from "@/components/Editor/components/nodes/ResistanceNode/types";
import LimitedConnectionsHandle from "../../handles/LimitedConnectionsHandle";
import ResistanceLogo from "../../../../../../public/nodes/resistor.svg?react";
import clsx from "clsx";
import { useRotation } from "../hooks/useRotation";
import { fixedLeftClass, fixedRightClass } from "../../handles/classes";
import { tagPort } from "../utils";

export type ResistanceNodeProps = NodeProps<ResistanceNodeType>;

const ResistanceNode: FC<ResistanceNodeProps> = forwardRef<
  HTMLDivElement,
  ResistanceNodeProps
>(({ id, selected }, ref) => {
  const [rotation, [, RIGHT, , LEFT]] = useRotation({
    id,
    selected
  });
  

  return (
    <div
      ref={ref}
      style={{ transform: `rotate(${rotation}deg)` }}
      className={clsx("w-[120px] h-[120px] relative p-2")}
    >
      <LimitedConnectionsHandle
        className={fixedLeftClass}
        id={tagPort(id, Position.Left)}
        type="source"
        position={LEFT}
      />
      <div className={clsx("rounded-lg")}>
        <ResistanceLogo
          className={clsx("rounded-lg", {
            "fill-foreground": !selected,
            "fill-primary bg-accent": selected
          })}
        />
      </div>
      <LimitedConnectionsHandle
        className={fixedRightClass}
        id={tagPort(id, Position.Right)}
        type="source"
        position={RIGHT}
      />
    </div>
  );
});

export default ResistanceNode;
