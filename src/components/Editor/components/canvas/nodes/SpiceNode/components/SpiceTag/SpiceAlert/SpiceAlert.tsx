import { SpiceInstanceName } from "@/components/context/SpiceContext/SpiceContext";
import { Typography } from "@/components/ui/Typography";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { Emoji } from "react-apple-emojis";
import { FC } from "react";
import { SpiceNodeValues } from "../../../types";
import { match, P } from "ts-pattern";
import {
  getCapacitorHelperText,
  getInductorHelperText,
  getResistorHelperText,
  getPowerSourceHelperText,
  getVCVSHelperText,
  getVCISHelperText,
  getICISHelperText,
  getICVSHelperText,
  getBJTHelperText
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
        instance_name: P.union(
          SpiceInstanceName.VoltageSource,
          SpiceInstanceName.CurrentSource
        )
      },
      ({ data, name }) => getPowerSourceHelperText(data, name)
    )
    .with(
      {
        instance_name: SpiceInstanceName.VCVS
      },
      ({ data, name }) => getVCVSHelperText(data, name)
    )
    .with(
      {
        instance_name: SpiceInstanceName.VCIS
      },
      ({ data, name }) => getVCISHelperText(data, name)
    )
    .with(
      {
        instance_name: SpiceInstanceName.ICIS
      },
      ({ data, name }) => getICISHelperText(data, name)
    )
    .with(
      {
        instance_name: SpiceInstanceName.ICVS
      },
      ({ data, name }) => getICVSHelperText(data, name)
    )
    .with({ instance_name: SpiceInstanceName.BJT }, ({ data, name }) =>
      getBJTHelperText(data, name)
    )
    .otherwise(() => false);

  const hasErrors = !!helperText;

  return hasErrors ? (
    <Tooltip>
      <TooltipContent>
        <Typography variant="xsmall">{helperText}</Typography>
      </TooltipContent>
      <TooltipTrigger className="min-h-full">
        <Emoji className="min-w-[12px] w-[12px]" name="warning" />
      </TooltipTrigger>
    </Tooltip>
  ) : null;
};

export default SpiceAlert;
