import { FC } from "react";
import { Typography } from "../ui/Typography";
import SimulationActions from "./SimulationActions";
import SimulationConfiguration from "./SimulationConfiguration/SimulationConfiguration";

interface SimulationPanelProps {
  open?: boolean;
}

const SimulationPanel: FC<SimulationPanelProps> = ({ open }) => {
  return open ? (
    <div className="flex flex-col p-4 w-[500px] border-accent border-2 bg-gradient-to-br from-accent/40 via-accent/20 to-accent/0 rounded-lg bg-background gap-4 h-full z-10">
      <Typography className="border-b-2 border-accent pb-4" variant="h3">
        Simulation Configuration
      </Typography>
      <div className="flex flex-col grow min-h-0 overflow-auto">
        <SimulationConfiguration />
      </div>
      <SimulationActions />
    </div>
  ) : null;
};

export default SimulationPanel;
