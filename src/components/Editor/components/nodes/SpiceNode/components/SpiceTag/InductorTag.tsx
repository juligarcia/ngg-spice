import { InductorData } from "@/components/context/SpiceContext";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/Typography";
import { Units } from "@/constants/units";
import { FC } from "react";

interface InductorTagProps {
  name: string;
  data: Partial<InductorData>;
}

const ResistorTag: FC<InductorTagProps> = ({ name, data }) => {
  return (
    <>
      <Typography className="overflow-hidden text-ellipsis" variant="h4">
        {name || "???"}
      </Typography>
      {data.value && (
        <Badge>
          <Typography variant="h4">{`${data.value}${Units.Inductance}`}</Typography>
        </Badge>
      )}
    </>
  );
};

export default ResistorTag;
