import { FC } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { Typography } from "./Typography";

interface AcronymProps {
  children: string;
  helper: string;
}

const Acronym: FC<AcronymProps> = ({ children, helper }) => {
  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger>
        <Typography>{children}</Typography>
      </TooltipTrigger>
      <TooltipContent>{helper}</TooltipContent>
    </Tooltip>
  );
};

export default Acronym;
