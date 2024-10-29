import { SpiceInstanceName } from "@/components/context/SpiceContext";
import { Typography } from "@/components/ui/Typography";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { Emoji } from "react-apple-emojis";
import { FC } from "react";
import { SpiceNodeValues } from "../../../types";
import { match } from "ts-pattern";
import {
  getCapacitorHelperText,
  getInductorHelperText,
  getResistorHelperText,
  getVoltageSourceHelperText
} from "./utils";

type SpiceAlertProps = {
  nodeData: SpiceNodeValues;
};

const SpiceAlert: FC<SpiceAlertProps> = ({ nodeData }) => {
  const helperText = match(nodeData)
    .with(
      {
        instance_name: SpiceInstanceName.Resistor
      },
      ({ data, name }) => getResistorHelperText(data, name)
    )
    .with(
      {
        instance_name: SpiceInstanceName.Capacitor
      },
      ({ data, name }) => getCapacitorHelperText(data, name)
    )
    .with(
      {
        instance_name: SpiceInstanceName.Inductor
      },
      ({ data, name }) => getInductorHelperText(data, name)
    )
    .with(
      {
        instance_name: SpiceInstanceName.VoltageSource
      },
      ({ data, name }) => getVoltageSourceHelperText(data, name)
    )
    .otherwise(() => false);

  const hasErrors = !!helperText;

  return hasErrors ? (
    <Tooltip delayDuration={0}>
      <TooltipContent>
        <Typography variant="xsmall">{helperText}</Typography>
      </TooltipContent>
      <TooltipTrigger className="min-h-full">
        <Emoji className="w-[25px]" name="warning" />
      </TooltipTrigger>
    </Tooltip>
  ) : null;
};

export default SpiceAlert;
