import { NodeProps } from "@xyflow/react";
import { FC, forwardRef } from "react";
import { SpiceNodeType } from "./types";
import clsx from "clsx";
import { useRotation } from "../hooks/useRotation";
import SpiceAttributes from "./components/SpiceAttributes";
import SpiceHandles from "./components/SpiceHandles";

export type SpiceNodeProps = NodeProps<SpiceNodeType>;

const SpiceNode: FC<SpiceNodeProps> = forwardRef<
  HTMLDivElement,
  SpiceNodeProps
>(({ id, selected, data }, ref) => {
  const [rotation, [TOP, RIGHT, BOTTOM, LEFT]] = useRotation({
    id,
    selected
  });

  const {
    top_ports,
    right_ports,
    bottom_ports,
    left_ports,
    name,
    asset,
    dimensions,
    values
  } = data;

  return (
    <div
      ref={ref}
      style={{ transform: `rotate(${rotation}deg)`, ...dimensions }}
      className="p-2 !relative"
    >
      <SpiceHandles
        id={id}
        top_ports={top_ports}
        right_ports={right_ports}
        bottom_ports={bottom_ports}
        left_ports={left_ports}
        TOP={TOP}
        RIGHT={RIGHT}
        BOTTOM={BOTTOM}
        LEFT={LEFT}
      />
      <div className="w-full h-full">
        {asset && (
          <div
            className={clsx(
              "w-full h-full fill-foreground [&_svg]:w-full [&_svg]:h-full",
              "transition-all duration-150 ease-in-out hover:fill-muted-foreground"
            )}
            dangerouslySetInnerHTML={{ __html: asset }}
          />
        )}

        <SpiceAttributes
          id={id}
          values={values}
          name={name}
          isVisible={selected}
          position={TOP}
        />
      </div>
    </div>
  );
});

export default SpiceNode;
