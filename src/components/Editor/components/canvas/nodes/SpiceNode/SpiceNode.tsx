import { NodeProps, Position } from "@xyflow/react";
import { FC } from "react";
import { SpiceNodeType } from "./types";
import clsx from "clsx";
import { useRotation } from "../hooks/useRotation";
import SpiceAttributes from "./components/SpiceAttributes/SpiceAttributes";
import SpiceHandles from "./components/SpiceHandles";
import { match, P } from "ts-pattern";
import SpiceTag from "./components/SpiceTag/SpiceTag";
import { get } from "lodash";

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

  // If rotated:
  // TODO: bug with css transform when node is rotated and user zooms out
  const attributesOffset = match(TOP)
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

  const tagOffset = Math.abs(
    match(BOTTOM)
      .with(P.union(Position.Left, Position.Right), () =>
        dimensions.width > dimensions.height
          ? dimensions.height - dimensions.width + 30
          : 30
      )
      .otherwise(() =>
        dimensions.height > dimensions.width
          ? dimensions.width - dimensions.height + 30
          : 30
      )
  );

  return (
    <>
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
          <div
            className={clsx(
              "w-full h-full fill-foreground stroke-foreground [&_svg]:w-full [&_svg]:h-full",
              "transition-[fill,stroke] duration-150 ease-in-out hover:fill-muted-foreground hover:stroke-muted-foreground",
              {
                "!fill-accent !stroke-accent": selected
              }
            )}
          >
            {match(symbol)
              .with({ variants: P.nonNullable }, ({ key, variants }) => {
                const keyValue = get(data.data, key) as keyof typeof variants;

                if (keyValue) {
                  const Icon = variants[keyValue];

                  return <Icon />;
                }

                const Icon = variants.default;

                return <Icon />;
              })
              .otherwise((Icon) => (
                <Icon />
              ))}
          </div>
          <SpiceAttributes
            selected={selected && !dragging}
            offset={attributesOffset}
            id={id}
            instance_name={instance_name}
            name={name}
            position={TOP}
            nodeData={data}
          />
        </div>
      </div>
      <SpiceTag nodeData={data} name={name} offset={tagOffset} id={id} />
    </>
  );
};

export default SpiceNode;
