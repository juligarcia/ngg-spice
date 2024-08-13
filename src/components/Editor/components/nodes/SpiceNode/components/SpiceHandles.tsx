import { Port } from "@/components/context/SpiceContext";
import { Position } from "@xyflow/react";
import { FC } from "react";
import { tagPort } from "@/components/Editor/components/nodes/utils";
import LimitedConnectionsHandle from "@/components/Editor/components/handles/LimitedConnectionsHandle";

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
      {top_ports.map((_, index) => (
        <LimitedConnectionsHandle
          className="!top-0 !left-[50%] !-translate-x-2/4 !-translate-y-2/4 !bottom-[unset] !right-[unset]"
          // TODO: style left
          key={tagPort(id, Position.Top, index)}
          id={tagPort(id, Position.Top, index)}
          type="source"
          position={TOP}
        />
      ))}

      {right_ports.map((_, index) => (
        <LimitedConnectionsHandle
          className="!right-0 !top-[50%] !-translate-y-2/4 !translate-x-2/4 !left-[unset] !bottom-[unset]"
          // TODO: style top
          key={tagPort(id, Position.Right, index)}
          id={tagPort(id, Position.Right, index)}
          type="source"
          position={RIGHT}
        />
      ))}
      {bottom_ports.map((_, index) => (
        <LimitedConnectionsHandle
          className="!bottom-0 !left-[50%] !-translate-x-2/4 !translate-y-2/4 !top-[unset] !right-[unset]"
          // TODO: style left
          key={tagPort(id, Position.Bottom, index)}
          id={tagPort(id, Position.Bottom, index)}
          type="source"
          position={BOTTOM}
        />
      ))}

      {left_ports.map((_, index) => (
        <LimitedConnectionsHandle
          className="!left-0 !top-[50%] !-translate-y-2/4 !-translate-x-2/4 !right-[unset] !bottom-[unset]"
          // TODO: style top
          key={tagPort(id, Position.Left, index)}
          id={tagPort(id, Position.Left, index)}
          type="source"
          position={LEFT}
        />
      ))}
    </>
  );
};

export default SpiceHandles;
