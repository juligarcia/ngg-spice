import { CapacitorData } from "@/components/context/SpiceContext/SpiceContext";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/Typography";
import { Units } from "@/constants/units";
import { FC } from "react";

interface CapacitorTagProps {
  name: string;
  data: Partial<CapacitorData>;
}

const ResistorTag: FC<CapacitorTagProps> = ({ name, data }) => {
  return (
    <>
      <Typography
        className="font-semibold tracking-tight overflow-hidden text-ellipsis"
        variant="xsmall"
      >
        {name || "???"}
      </Typography>
      {data.value && (
        <Badge>
          <Typography
            className="font-semibold tracking-tight"
            variant="xsmall"
          >{`${data.value}${Units.Capacitance}`}</Typography>
        </Badge>
      )}
    </>
  );
};

export default ResistorTag;
