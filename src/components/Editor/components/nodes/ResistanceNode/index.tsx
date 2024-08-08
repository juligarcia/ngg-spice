import { NodeProps } from "@xyflow/react";
import { FC, forwardRef } from "react";
import { ResistanceNodeType } from "@/components/Editor/components/nodes/ResistanceNode/types";
import LimitedConnectionsHandle from "../../handles/LimitedConnectionsHandle";
import ResistanceLogo from "../../../../../../public/nodes/resistor.svg?react";
import clsx from "clsx";
import { useRotation } from "../hooks/useRotation";
import { fixedLeftClass, fixedRightClass } from "../../handles/classes";

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
      className={clsx("w-[120px] h-[120px] relative")}
    >
      <LimitedConnectionsHandle
        className={fixedLeftClass}
        id="left"
        type="source"
        position={LEFT}
      />
      <div
        className={clsx("p-2 rounded-xl border border-foreground", {
          "bg-card": !selected,
          "bg-accent": selected
        })}
      >
        <ResistanceLogo className="fill-foreground" />
      </div>
      <LimitedConnectionsHandle
        className={fixedRightClass}
        id="right"
        type="source"
        position={RIGHT}
      />
    </div>
  );
});

export default ResistanceNode;
