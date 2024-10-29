import { CapacitorData } from "@/components/context/SpiceContext";
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
      <Typography className="overflow-hidden text-ellipsis" variant="h4">
        {name || "???"}
      </Typography>
      {data.value && (
        <Badge>
          <Typography variant="h4">{`${data.value}${Units.Capacitance}`}</Typography>
        </Badge>
      )}
    </>
  );
};

export default ResistorTag;
