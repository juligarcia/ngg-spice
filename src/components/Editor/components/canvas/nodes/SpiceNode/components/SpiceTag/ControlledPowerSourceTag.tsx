import {
  ICISData,
  ICVSData,
  SpiceInstanceName,
  VCISData,
  VCVSData
} from "@/components/context/SpiceContext/SpiceContext";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { Typography } from "@/components/ui/Typography";
import { Units } from "@/constants/units";
import { isEmpty } from "lodash";
import { FC } from "react";
import { match, P } from "ts-pattern";

interface ControlledPowerSourceTagProps {
  name: string;
  type:
    | SpiceInstanceName.VCVS
    | SpiceInstanceName.VCIS
    | SpiceInstanceName.ICIS
    | SpiceInstanceName.ICVS;
  data: Partial<VCVSData | VCISData | ICISData | ICVSData>;
}

const ControlledPowerSourceTag: FC<ControlledPowerSourceTagProps> = ({
  name,
  data,
  type
}) => {
  const unit = match(type)
    .with(
      P.union(SpiceInstanceName.VCVS, SpiceInstanceName.ICIS),
      () => Units.Unitless
    )
    .with(SpiceInstanceName.VCIS, () => Units.Conductance)
    .with(SpiceInstanceName.ICVS, () => Units.Resistance)
    .run();

  const mapTruthyToLabel = (labels: (string | false | undefined | null)[]) =>
    labels
      .filter((maybeLabel) => !!maybeLabel)
      .map((label, index, filteredLabels) => (
        <Typography
          key={label?.toString()}
          className="font-semibold tracking-tight"
          variant="xsmall"
        >{`${label}${
          index < filteredLabels.length - 1 ? "," : ""
        }`}</Typography>
      ));

  const tooltipHelperText = match(type)
    .with(
      SpiceInstanceName.VCVS,
      () => "Voltage-controlled Voltage Source: (voltage amplification)"
    )
    .with(
      SpiceInstanceName.ICIS,
      () => "Current-controlled Current Source: (Ref current, Amp)"
    )
    .with(
      SpiceInstanceName.VCIS,
      () =>
        "Voltage-controlled Current Source: (transconductance amplification)"
    )
    .with(
      SpiceInstanceName.ICVS,
      () => "Current-controlled Voltage Source: (Ref current, Transresistance)"
    )
    .run();

  return (
    <>
      <Typography
        className="font-semibold tracking-tight overflow-hidden text-ellipsis"
        variant="xsmall"
      >
        {name || "???"}
      </Typography>
      {!isEmpty(data) && (
        <Tooltip>
          <TooltipTrigger>
            <Badge className="flex gap-2">
              {mapTruthyToLabel([
                "src" in data && data.src?.slice(1),
                data.value && `${data.value}${unit}`
              ])}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>{tooltipHelperText}</TooltipContent>
        </Tooltip>
      )}
    </>
  );
};

export default ControlledPowerSourceTag;
