import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/ThemeProvider";
import { Typography } from "./ui/Typography";
import { AnimatePresence, motion } from "framer-motion";
import { FC } from "react";

const MotionSun = motion(Sun);
const MotionMoon = motion(Moon);
const AnimatedTypography = motion(Typography);

interface ThemeToggleProps {
  minimized?: boolean;
}

const ThemeToggle: FC<ThemeToggleProps> = ({ minimized }) => {
  const { setTheme, isDark } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="w-full h-fit flex flex-col items-center p-2"
          variant="ghost"
          size="icon"
        >
          <AnimatePresence mode="wait" initial={false}>
            {!isDark && (
              <MotionSun
                className="h-5 w-5"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: -90 }}
              />
            )}
            {isDark && (
              <MotionMoon
                className="h-5 w-5"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: -90 }}
              />
            )}
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
                Theme
              </AnimatedTypography>
            )}
          </AnimatePresence>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeToggle;
