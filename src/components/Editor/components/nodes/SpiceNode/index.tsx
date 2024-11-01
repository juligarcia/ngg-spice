import { NodeProps, Position } from "@xyflow/react";
import { FC } from "react";
import { SpiceNodeType } from "./types";
import clsx from "clsx";
import { useRotation } from "../hooks/useRotation";
import SpiceAttributes from "./components/SpiceAttributes/SpiceAttributes";
import SpiceHandles from "./components/SpiceHandles";
import { match, P } from "ts-pattern";
import SpiceTag from "./components/SpiceTag/SpiceTag";

export type SpiceNodeProps = NodeProps<SpiceNodeType>;

const SpiceNode: FC<SpiceNodeProps> = ({ id, selected, data, dragging }) => {
  const {
    top_ports,
    right_ports,
    bottom_ports,
    left_ports,
    instance_name,
    symbol,
    dimensions,
    name
  } = data;

  const [rotation, [TOP, RIGHT, BOTTOM, LEFT]] = useRotation({
    id,
    selected: selected || dragging,
    availableHandles: {
      top: top_ports,
      right: right_ports,
      bottom: bottom_ports,
      left: left_ports
    }
  });

  // If its rotated
  // TODO: bug with css transform when node is rotated and user zooms out
  const offset = match(TOP)
    .with(P.union(Position.Left, Position.Right), () =>
      dimensions.width > dimensions.height
        ? dimensions.height - dimensions.width + 30
        : 30
    )
    .otherwise(() =>
      dimensions.height > dimensions.width
        ? dimensions.width - dimensions.height + 30
        : 30
    );

  return (
    <div
      style={{ transform: `rotate(${rotation}deg)`, ...dimensions }}
      className={clsx(
        "!relative",
        "transition-[filter] duration-300 ease-in-out"
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
        <SpiceTag
          nodeData={data}
          offset={offset}
          name={name}
          position={BOTTOM}
          id={id}
        />
        <SpiceAttributes
          selected={selected && !dragging}
          offset={offset}
          id={id}
          instance_name={instance_name}
          name={name}
          position={TOP}
          nodeData={data}
        />
      </div>
    </div>
  );
};

export default SpiceNode;
