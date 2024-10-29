import { useTheme } from "@/components/ThemeProvider";
import usePointerProximity from "@/hooks/usePointerProximity";
import { blend_colors } from "@/utils/colors";
import { Handle, HandleProps, useHandleConnections } from "@xyflow/react";
import clsx from "clsx";
import { FC } from "react";

interface LimitedConnectionsHandleProps
  extends Omit<HandleProps, "isConnectable"> {
  connectionLimit?: number;
}

const LimitedConnectionsHandle: FC<LimitedConnectionsHandleProps> = ({
  connectionLimit = 1,
  type,
  id,
  className,
  ...handleProps
}) => {
  const { isDark } = useTheme();

  const connections = useHandleConnections({
    id,
    type
  });

  const acceptsMoreConnections = connections.length < connectionLimit;

  const proximity = usePointerProximity({
    id,
    selector: "data-handleid",
    disabled: !acceptsMoreConnections
  });

  return (
    <Handle
      {...handleProps}
      style={{
        backgroundColor: isDark
          ? blend_colors("#0c0b0e", "#e6e6e6", proximity / 100)
          : blend_colors("#f2f2f2", "#000000", proximity / 100),
        height: Math.round((proximity / 100) * 4 + 12),
        width: Math.round((proximity / 100) * 4 + 12),
        ...handleProps.style
      }}
      className={clsx(
        className,
        "!border !border-foreground rounded-full",
        "transition-[width,_height,_background-color] duration-75 ease-linear"
      )}
      type={type}
      id={id}
      isConnectable={acceptsMoreConnections}
    >
      <div />
    </Handle>
  );
};

export default LimitedConnectionsHandle;
