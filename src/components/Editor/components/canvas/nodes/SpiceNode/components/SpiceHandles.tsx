import { Port } from "@/components/context/SpiceContext/SpiceContext";
import { Position } from "@xyflow/react";
import { FC } from "react";
import { tagPort } from "@/components/Editor/components/canvas/nodes/utils";
import LimitedConnectionsHandle from "@/components/Editor/components/canvas/handles/LimitedConnectionsHandle";
import clsx from "clsx";

interface SpiceHandlesProps {
  id: string;
  top_ports: Port[];
  right_ports: Port[];
  bottom_ports: Port[];
  left_ports: Port[];
  TOP: Position;
  RIGHT: Position;
  BOTTOM: Position;
  LEFT: Position;
}

const SpiceHandles: FC<SpiceHandlesProps> = ({
  top_ports,
  right_ports,
  bottom_ports,
  left_ports,
  id,
  TOP,
  RIGHT,
  BOTTOM,
  LEFT
}) => {
  return (
    <>
      {top_ports.map(({ name, x, y }, index) => (
        <LimitedConnectionsHandle
          style={{
            left: x,
            top: y
          }}
          className={clsx(
            "!-translate-x-2/4 !-translate-y-2/4 !right-[unset] !bottom-[unset]"
          )}
          key={tagPort(id, name || index)}
          id={tagPort(id, name || index)}
          type="source"
          position={TOP}
        />
      ))}

      {right_ports.map(({ name, x, y }, index) => (
        <LimitedConnectionsHandle
          style={{
            left: x,
            top: y
          }}
          className={clsx(
            "!-translate-y-2/4 !-translate-x-2/4 !right-[unset] !bottom-[unset]"
          )}
          key={tagPort(id, name || index)}
          id={tagPort(id, name || index)}
          type="source"
          position={RIGHT}
        />
      ))}
      {bottom_ports.map(({ name, x, y }, index) => (
        <LimitedConnectionsHandle
          style={{
            left: x,
            top: y
          }}
          className={clsx(
            "!-translate-x-2/4 !-translate-y-2/4 !right-[unset] !bottom-[unset]"
          )}
          key={tagPort(id, name || index)}
          id={tagPort(id, name || index)}
          type="source"
          position={BOTTOM}
        />
      ))}

      {left_ports.map(({ name, x, y }, index) => (
        <LimitedConnectionsHandle
          style={{
            left: x,
            top: y
          }}
          className={clsx(
            "!-translate-y-2/4 !-translate-x-2/4 !right-[unset] !bottom-[unset]"
          )}
          key={tagPort(id, name || index)}
          id={tagPort(id, name || index)}
          type="source"
          position={LEFT}
        />
      ))}
    </>
  );
};

export default SpiceHandles;
