import { InductorData } from "@/components/context/SpiceContext/SpiceContext";
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
          >{`${data.value}${Units.Inductance}`}</Typography>
        </Badge>
      )}
    </>
  );
};

export default ResistorTag;
