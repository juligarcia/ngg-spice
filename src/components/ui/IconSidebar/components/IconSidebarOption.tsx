import { ComponentType, FC, ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";

import clsx from "clsx";
import { LucideProps } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";

type WithIconOrNode =
  | { Icon: ComponentType<LucideProps>; node?: never }
  | { Icon?: never; node: ReactNode };

export interface CommonProps {
  ariaLabel: string;
  onClick?(): void;
  title?: string;
  minimized?: boolean;
}

export type IconSidebarOptionProps = CommonProps & WithIconOrNode;

const AnimatedTypography = motion(Typography);

const IconSidebarOption: FC<IconSidebarOptionProps> = ({
  ariaLabel,
  Icon,
  onClick,
  title,
  node,
  minimized
}) => {
  return (
    <Tooltip>
      {minimized && !!title && (
        <TooltipContent side="right">{title}</TooltipContent>
      )}
      <TooltipTrigger className="w-full">
        <Button
          className={clsx("p-0 w-full flex flex-col items-center justify-center", {
            "h-16": !!title,
            "h-12": !title
          })}
          variant="ghost"
          key={ariaLabel}
          aria-label={ariaLabel}
          onClick={onClick}
        >
          {node || (
            <motion.div
              animate={{ height: "auto", width: "auto" }}
              className={clsx(
                "flex flex-col items-center w-full h-full p-2 overflow-hidden"
              )}
            >
              {Icon && <Icon className="w-5 h-5" />}
              <AnimatePresence initial={false}>
                {title && !minimized && (
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
                    {title}
                  </AnimatedTypography>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </Button>
      </TooltipTrigger>
    </Tooltip>
  );
};

export default IconSidebarOption;
