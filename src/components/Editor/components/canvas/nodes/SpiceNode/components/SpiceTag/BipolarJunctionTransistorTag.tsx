import { BipolarJunctionTransistorData } from "@/components/context/SpiceContext/SpiceContext";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/Typography";
import { isEmpty } from "lodash";
import { FC } from "react";

interface BipolarJunctionTransistorTagProps {
  name: string;
  data: Partial<BipolarJunctionTransistorData>;
}

const BipolarJunctionTransistorTag: FC<BipolarJunctionTransistorTagProps> = ({
  name,
  data
}) => {
  return (
    <>
      <Typography
        className="font-semibold tracking-tight overflow-hidden text-ellipsis"
        variant="xsmall"
      >
        {name || "???"}
      </Typography>
      {!isEmpty(data.model) && (
        <Badge className="flex gap-2 items-center">
          <Typography className="font-semibold tracking-tight" variant="xsmall">
            {data.model?.polarity}
          </Typography>
          {data.model?.name && (
            <Typography
              className="font-semibold tracking-tight"
              variant="xsmall"
            >
              {data.model?.name}
            </Typography>
          )}
        </Badge>
      )}
    </>
  );
};

export default BipolarJunctionTransistorTag;
