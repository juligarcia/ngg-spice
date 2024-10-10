import { FC } from "react";
import { Typography } from "../ui/Typography";
import SimulationActions from "./SimulationActions";
import SimulationConfiguration from "./SimulationConfiguration/SimulationConfiguration";
import clsx from "clsx";
import { scrollbarClassName } from "@/constants/tailwind";

interface SimulationPanelProps {
  open?: boolean;
}

const SimulationPanel: FC<SimulationPanelProps> = ({ open }) => {
  return open ? (
    <div
      className={clsx(
        "w-[600px] flex flex-col py-4 pl-4 pr-2 border-accent border-2 rounded-lg bg-background gap-4 h-full z-10"
      )}
    >
      <Typography className="border-b-2 border-accent pb-4" variant="h3">
        Simulation Configuration
      </Typography>
      <div
        className={clsx(
          "flex flex-col grow min-h-0 overflow-y-scroll rounded-lg",
          scrollbarClassName
        )}
      >
        <SimulationConfiguration />
      </div>
      <SimulationActions />
    </div>
  ) : null;
};

export default SimulationPanel;
