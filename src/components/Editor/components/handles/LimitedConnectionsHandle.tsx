import { Handle, HandleProps, useHandleConnections } from "@xyflow/react";
import { FC } from "react";

interface LimitedConnectionsHandleProps
  extends Omit<HandleProps, "isConnectable"> {
  connectionLimit?: number;
}

const LimitedConnectionsHandle: FC<LimitedConnectionsHandleProps> = ({
  connectionLimit = 1,
  type,
  id,
  ...handleProps
}) => {
  const connections = useHandleConnections({
    id,
    type
  });

  return (
    <Handle
      {...handleProps}
      type={type}
      id={id}
      isConnectable={connections.length < connectionLimit}
    />
  );
};

export default LimitedConnectionsHandle;
