import { FC, useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "./ui/dropdown-menu";
import { AnimatePresence, motion } from "framer-motion";
import {
  LAYOUT_OPTION_ICON_MAPPER,
  LayoutOptionDisplay
} from "@/constants/layout";
import { useLayoutStore } from "@/store/layout";
import { Typography } from "./ui/Typography";
import { LayoutOption } from "@/types/layout";
import clsx from "clsx";
import { useHotkeys } from "react-hotkeys-hook";
import { osHotkeys } from "@/utils/hotkeys";
import { useOs } from "./context/OsContext";
import { Shortcuts } from "@/constants/shortcuts";

const AnimatedTypography = motion(Typography);

interface ToggleLayoutProps {
  minimized?: boolean;
}

const ToggleLayout: FC<ToggleLayoutProps> = ({ minimized }) => {
  const layout = useLayoutStore.use.layoutType();
  const setLayout = useLayoutStore.use.setLayout();

  const AnimatedIcon = useMemo(
    () => motion(LAYOUT_OPTION_ICON_MAPPER[layout]),
    [layout]
  );

  const { os } = useOs();

  useHotkeys(osHotkeys(Shortcuts.FocusLayout.osHotKeys, os), () => {
    setLayout(LayoutOption.Focus);
  });

  useHotkeys(osHotkeys(Shortcuts.Rows2Layout.osHotKeys, os), () => {
    setLayout(LayoutOption.Rows2);
  });

  useHotkeys(osHotkeys(Shortcuts.Columns2Layout.osHotKeys, os), () => {
    setLayout(LayoutOption.Columns2);
  });

  useHotkeys(osHotkeys(Shortcuts.Columns3Layout.osHotKeys, os), () => {
    setLayout(LayoutOption.Columns3);
  });

  useHotkeys(osHotkeys(Shortcuts.Grid2x2Layout.osHotKeys, os), () => {
    setLayout(LayoutOption.Grid2x2);
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={clsx(
            "cursor-pointer w-full h-fit shrink-0 flex flex-col items-center p-2 rounded-md",
            ["[&:hover]:bg-accent"]
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            <AnimatedIcon
              transition={{ type: "spring", duration: 0.2 }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              size={20}
              key={layout}
            />
          </AnimatePresence>
          <AnimatePresence initial={false}>
            {!minimized && (
              <AnimatedTypography
                initial={{
                  opacity: 0,
                  fontSize: "0px",
                  marginTop: 0,
                  height: 0,
                  y: 50
                }}
                animate={{
                  opacity: 1,
                  fontSize: "12px",
                  marginTop: 8,
                  height: "auto",
                  y: 0
                }}
                exit={{
                  opacity: 0,
                  fontSize: "0px",
                  marginTop: 0,
                  height: 0,
                  y: 50
                }}
              >
                Layout
              </AnimatedTypography>
            )}
          </AnimatePresence>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="start">
        {Object.values(LayoutOption).map((option) => {
          const Icon = LAYOUT_OPTION_ICON_MAPPER[option];
          const title = LayoutOptionDisplay[option];

          return (
            <DropdownMenuItem key={option} onClick={() => setLayout(option)}>
              <Icon size={15} className="mr-2" />
              <Typography>{title}</Typography>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ToggleLayout;
