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
      <Typography className="overflow-hidden text-ellipsis" variant="h4">
        {name || "???"}
      </Typography>
      {!isEmpty(data) && (
        <Badge className="flex gap-2 items-center">
          <Typography variant="h4">{data.t_type}</Typography>
          {data.model?.name && (
            <Typography variant="h4">{data.model?.name}</Typography>
          )}
        </Badge>
      )}
    </>
  );
};

export default BipolarJunctionTransistorTag;
