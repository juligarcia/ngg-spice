import { NodeProps } from "@xyflow/react";
import { FC, forwardRef } from "react";
import { SpiceNodeType } from "./types";
import clsx from "clsx";
import { useRotation } from "../hooks/useRotation";
import SpiceAttributes from "./components/SpiceAttributes";
import SpiceHandles from "./components/SpiceHandles";
import { isEmpty } from "lodash";

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
    component_type,
    symbol,
    dimensions,
    fields
  } = data;

  return (
    <div
      ref={ref}
      style={{ transform: `rotate(${rotation}deg)`, ...dimensions }}
      className={clsx(
        "p-2 !relative",
        "transition-[filter] duration-300 ease-in-out",
        {
          "drop-shadow-xl": selected,
          "shadow-transparent": !selected
        }
      )}
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
        {symbol && (
          <div
            className={clsx(
              "w-full h-full fill-foreground [&_svg]:w-full [&_svg]:h-full",
              "transition-[fill] duration-150 ease-in-out hover:fill-muted-foreground",
              { "!fill-accent": selected }
            )}
            dangerouslySetInnerHTML={{ __html: symbol }}
          />
        )}

        {!isEmpty(fields) && (
          <SpiceAttributes
            id={id}
            fields={fields}
            component_type={component_type}
            isVisible={selected}
            position={TOP}
          />
        )}
      </div>
    </div>
  );
});

export default SpiceNode;
