import { NodeProps, NodeToolbar } from "@xyflow/react";
import { FC } from "react";
import { SpiceNodeType } from "./types";
import clsx from "clsx";
import { useRotation } from "../hooks/useRotation";
import SpiceAttributes from "./components/SpiceAttributes";
import SpiceHandles from "./components/SpiceHandles";
import { isEmpty } from "lodash";
import SpiceAlert from "./components/SpiceAlert";
import { Typography } from "@/components/ui/Typography";

export type SpiceNodeProps = NodeProps<SpiceNodeType>;

const SpiceNode: FC<SpiceNodeProps> = ({ id, selected, data }) => {
  const [rotation, [TOP, RIGHT, BOTTOM, LEFT]] = useRotation({
    id,
    selected
  });

  const {
    top_ports,
    right_ports,
    bottom_ports,
    left_ports,
    instance_name,
    symbol,
    dimensions,
    fields,
    data: fieldsData
  } = data;

  return (
    <div
      style={{ transform: `rotate(${rotation}deg)`, ...dimensions }}
      className={clsx(
        "p-2 !relative",
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
        {!isEmpty(fields) && (
          <NodeToolbar id={id} isVisible position={BOTTOM}>
            <div
              className={clsx(
                "flex gap-4 items-center justify-between bg-accent rounded-sm py-2 px-4 relative"
              )}
            >
              <Typography
                className="overflow-hidden text-ellipsis"
                variant="h4"
              >
                {data.name}
              </Typography>
              <SpiceAlert data={fieldsData} fields={fields} />
            </div>
          </NodeToolbar>
        )}
        {!isEmpty(fields) && (
          <SpiceAttributes
            id={id}
            fields={fields}
            instance_name={instance_name}
            isVisible={selected}
            position={TOP}
            data={fieldsData}
          />
        )}
      </div>
    </div>
  );
};

export default SpiceNode;
