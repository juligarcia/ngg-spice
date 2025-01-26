import { useOs } from "@/components/context/OsContext";
import { Typography } from "@/components/ui/Typography";
import { useProgramStore } from "@/store/program";
import { osHotkeys } from "@/utils/hotkeys";
import clsx from "clsx";
import { AudioWaveform, ChevronsRight } from "lucide-react";
import { FC } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useSimulationStore } from "@/store/simulation";
import { Badge } from "@/components/ui/badge";
import { Shortcuts } from "@/constants/shortcuts";

const SimulationPanelTrigger: FC = () => {
  const simulationPanelOpen = useProgramStore.use.simulationPanelOpen();
  const toggleSimulationPanelOpen =
    useProgramStore.use.toggleSimulationPanelOpen();

  const numberOfSimulationsToRun =
    useSimulationStore.use.simulationsToRun().size;

  const { os } = useOs();

  useHotkeys(
    osHotkeys(Shortcuts.ToggleSimulationPanel.osHotKeys, os),
    toggleSimulationPanelOpen
  );

  return (
    <div
      onClick={toggleSimulationPanelOpen}
      className={clsx(
        "w-fit relative rounded-r-lg h-full cursor-pointer flex flex-col items-center justify-between px-2 py-6",
        "[&_*]:transition-colors [&_*]:duration-300",
        "hover:bg-primary [&_*]:hover:text-foreground",
        {
          "bg-primary [&_*]:text-foreground": simulationPanelOpen,
          "bg-accent [&_*]:text-muted-foreground": !simulationPanelOpen
        }
      )}
    >
      <ChevronsRight
        className={clsx("duration-300 transition-transform", {
          "-rotate-180": simulationPanelOpen
        })}
        size={20}
      />
      <div className="absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 -rotate-90 flex items-center gap-2">
        {!!numberOfSimulationsToRun && (
          <Badge>
            <Typography className="font-bold">
              {numberOfSimulationsToRun}
            </Typography>
          </Badge>
        )}
        <Typography className=" text-center whitespace-nowrap">
          Simulation
        </Typography>
        <AudioWaveform size={20} className="" />
      </div>
      <ChevronsRight
        className={clsx("duration-300 transition-transform", {
          "rotate-180": simulationPanelOpen
        })}
        size={20}
      />
    </div>
  );
};

export default SimulationPanelTrigger;
