import {
  Handle,
  NodeProps,
  Position,
  ReactFlowState,
  useStore
} from "@xyflow/react";
import { FC } from "react";
import { ConnectionNodeType } from "@/components/Editor/components/canvas/nodes/ConnectionNode/types";
import { Waypoints } from "lucide-react";
import clsx from "clsx";
import { tagPort } from "../utils";
import usePointerProximity from "@/hooks/usePointerProximity";
import { Typography } from "@/components/ui/Typography";
import { shallow } from "zustand/shallow";
import ConnectionNodeToolbar from "./ConnectionNodeToolbar";
import { useSimulationStore } from "@/store/simulation";
import { isEmpty } from "lodash";

const storeSelector = (state: ReactFlowState) => ({
  singleSelection: state.nodes.filter((node) => node.selected).length === 1
});

export type ConnectionNodeProps = NodeProps<ConnectionNodeType>;

const uniformClassname =
  "!top-0 !left-0 !right-[unset] !bottom-[unset] !w-full !h-full !opacity-0 !transform-none z-[-1]";

const ConnectionNode: FC<ConnectionNodeProps> = ({ selected, id, data }) => {
  const proximity = usePointerProximity({ id });

  const { name } = data;

  const { singleSelection } = useStore(storeSelector, shallow);

  const isVisible = selected && singleSelection;

  const hasSimulationData = !isEmpty(useSimulationStore.use.simulationData());

  return (
    <div
      id={id}
      className={clsx("relative animate-transform duration-100 ease-in-out")}
    >
      <Handle
        className={uniformClassname}
        type="source"
        id={tagPort(id)}
        position={Position.Left}
      />
      <Handle
        className={uniformClassname}
        type="source"
        id={tagPort(id)}
        position={Position.Top}
      />
      <div
        style={{ transform: `scale(${Math.max((proximity + 50) / 100, 1)})` }}
        className={clsx(
          "relative transition-[border-color,_transform] duration-75 ease-linear",
          "bg-card border hover:border-muted-foreground [&:hover_svg]:stroke-muted-foreground border-foreground rounded-sm w-[20px] h-[20px] p-1 flex flex-col items-center justify-center",
          {
            "!scale-150 !border-muted-foreground [&_svg]:stroke-muted-foreground":
              selected,
            "!border-primary cursor-pointer !bg-primary": hasSimulationData
          }
        )}
      >
        <Waypoints
          className={clsx(
            "h-full w-full transition-[stroke] duration-150 ease-in-out stroke-foreground",
            {
              "!stroke-foreground": hasSimulationData
            }
          )}
        />
        <div className="absolute whitespace-nowrap mt-4 top-0 translate-y-2/4 bg-accent/30 rounded-sm items-center p-1">
          <Typography className="font-semibold tracking-tight" variant="xsmall">
            {name}
          </Typography>
        </div>
      </div>
      <Handle
        className={uniformClassname}
        type="source"
        id={tagPort(id)}
        position={Position.Bottom}
      />
      <Handle
        className={uniformClassname}
        type="source"
        id={tagPort(id)}
        position={Position.Right}
      />

      <ConnectionNodeToolbar id={id} isVisible={isVisible} data={data} />
    </div>
  );
};

export default ConnectionNode;
