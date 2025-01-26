import { FC } from "react";
import { Typography } from "../ui/Typography";
import SimulationActions from "./SimulationActions";
import SimulationConfiguration from "./SimulationConfiguration/SimulationConfiguration";
import clsx from "clsx";
import { scrollbarClassName } from "@/constants/tailwind";
import SimulationPanelTrigger from "./components/SimulationPanelTrigger";
import { useProgramStore } from "@/store/program";
import { motion } from "framer-motion";

const SimulationPanel: FC = () => {
  const simulationPanelOpen = useProgramStore.use.simulationPanelOpen();

  return (
    <div className="flex">
      <motion.div
        initial={false}
        className="overflow-hidden"
        animate={{ width: simulationPanelOpen ? 450 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div
          className={clsx(
            "w-[450px] shrink-0 flex flex-col py-4 pl-4 pr-2 border-accent border-y-2 bg-gradient-to-r from-accent/40 via-card to-card gap-4 h-full z-10"
          )}
        >
          <Typography
            className="border-b-2 border-accent pb-4 text-muted-foreground"
            variant="h3"
          >
            Simulation Panel
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
      </motion.div>
      <SimulationPanelTrigger />
    </div>
  );
};

export default SimulationPanel;
