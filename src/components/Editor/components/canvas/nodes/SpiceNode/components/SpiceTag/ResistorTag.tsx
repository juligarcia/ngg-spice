import { ResistorData } from "@/components/context/SpiceContext";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/Typography";
import { Units } from "@/constants/units";
import { FC } from "react";

interface ResistorTagProps {
  name: string;
  data: Partial<ResistorData>;
}

const ResistorTag: FC<ResistorTagProps> = ({ name, data }) => {
  return (
    <>
      <Typography className="overflow-hidden text-ellipsis" variant="h4">
        {name || "???"}
      </Typography>
      {data.value && (
        <Badge>
          <Typography variant="h4">{`${data.value}${Units.Resistance}`}</Typography>
        </Badge>
      )}
    </>
  );
};

export default ResistorTag;
