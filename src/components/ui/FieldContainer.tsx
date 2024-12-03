import { FC, ReactNode } from "react";
import { Typography } from "./Typography";
import { FieldError } from "react-hook-form";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { CircleHelp } from "lucide-react";

interface FieldContainerProps {
  postfix?: string;
  children: ReactNode;
  error?: FieldError;
  tooltip?: string;
}

const FieldContainer: FC<FieldContainerProps> = ({
  children,
  postfix,
  error,
  tooltip
}) => (
  <div>
    <div className="flex items-center">
      <div className="grow w-full flex gap-2">
        {children}
        {tooltip && (
          <Tooltip delayDuration={0}>
            <TooltipContent>{tooltip}</TooltipContent>
            <TooltipTrigger>
              <CircleHelp className="stroke-muted-foreground" size={20} />
            </TooltipTrigger>
          </Tooltip>
        )}
      </div>
      {postfix && (
        <Typography
          className="px-4 text-muted-foreground w-16 text-center font-bold"
          variant="small"
        >
          {postfix}
        </Typography>
      )}
    </div>
    {error && (
      <Typography className="text-destructive pl-3 pt-1">
        {error.message}
      </Typography>
    )}
  </div>
);

export default FieldContainer;
