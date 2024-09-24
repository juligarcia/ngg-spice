import { SpiceNode } from "@/components/context/SpiceContext";
import { Typography } from "@/components/ui/Typography";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { OctagonX } from "lucide-react";
import { FC } from "react";

type SpiceAlertProps = {} & Pick<SpiceNode, "fields" | "data">;

const SpiceAlert: FC<SpiceAlertProps> = ({ fields, data }) => {
  const hasMissingFields = fields.some(
    ({ name }) => !data[name as keyof typeof data]
  );

  return hasMissingFields ? (
    <Tooltip delayDuration={0}>
      <TooltipContent>
        <Typography variant="xsmall">
          Component is missing all/some attributes
        </Typography>
      </TooltipContent>
      <TooltipTrigger className="absolute right-0 top-0 translate-x-[35%] -translate-y-[35%]">
        <Badge className="rounded-sm p-0.5" variant="destructive">
          <OctagonX className="fill-" size={15} />
        </Badge>
      </TooltipTrigger>
    </Tooltip>
  ) : null;
};

export default SpiceAlert;
