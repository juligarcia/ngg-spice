import {
  PowerSourceData,
  SpiceInstanceName
} from "@/components/context/SpiceContext/SpiceContext";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/Typography";
import { Units } from "@/constants/units";
import { TimeDomainAnalysis } from "@/types/elements";
import { FC } from "react";
import { match, P } from "ts-pattern";
import Pulse from "@/assets/power-source/pulse.svg?react";
import Sine from "@/assets/power-source/sine.svg?react";
import Exp from "@/assets/power-source/exp.svg?react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";

interface PowerSourceTagProps {
  name: string;
  data: Partial<PowerSourceData>;
  type: SpiceInstanceName.VoltageSource | SpiceInstanceName.CurrentSource;
}

const PowerSourceTag: FC<PowerSourceTagProps> = ({ name, data, type }) => {
  const powerUnit = match(type)
    .with(SpiceInstanceName.CurrentSource, () => Units.Current)
    .with(SpiceInstanceName.VoltageSource, () => Units.Voltage)
    .run();

  const mapTruthyToLabel = (labels: string[]) =>
    labels
      .filter((maybeLabel) => !!maybeLabel)
      .map((label, index, filteredLabels) => (
        <Typography
          key={label}
          className="font-semibold tracking-tight"
          variant="xsmall"
        >{`${label}${
          index !== filteredLabels.length - 1 ? "," : ""
        }`}</Typography>
      ));

  return (
    <div className="flex gap-2 items-center">
      <Typography
        className="font-semibold tracking-tight overflow-hidden text-ellipsis"
        variant="xsmall"
      >
        {name || "???"}
      </Typography>
      {match(data.time_domain)
        .with(
          { [TimeDomainAnalysis.DC]: P.nonNullable },
          ({ Dc: { value } }) => (
            <Tooltip>
              <TooltipContent>{"DC: (DC value)"}</TooltipContent>
              <TooltipTrigger>
                <Badge className="flex gap-2 items-center">
                  {mapTruthyToLabel([`${value}${powerUnit}`])}
                </Badge>
              </TooltipTrigger>
            </Tooltip>
          )
        )
        .with(
          { [TimeDomainAnalysis.Pulse]: P.nonNullable },
          ({ Pulse: { initial_value, final_value, rise_time } }) => (
            <Tooltip>
              <TooltipContent>
                {"Pulse: (Initial value), (Final value), (Rise time)"}
              </TooltipContent>
              <TooltipTrigger>
                <Badge className="flex gap-2 items-center">
                  <Pulse className="w-6 h-4 border-r-2 border-primary-foreground pr-2" />
                  {mapTruthyToLabel([
                    `${initial_value}${powerUnit}`,
                    `${final_value}${powerUnit}`,
                    rise_time && `${rise_time}${Units.Time}`
                  ])}
                </Badge>
              </TooltipTrigger>
            </Tooltip>
          )
        )
        .with(
          { [TimeDomainAnalysis.Sine]: P.nonNullable },
          ({ Sin: { amplitude, offset, frequency } }) => (
            <Tooltip>
              <TooltipContent>
                {"Sine: (Amplitude), (DC offset), (Frequency)"}
              </TooltipContent>
              <TooltipTrigger>
                <Badge className="flex gap-2 items-center">
                  <Sine className="w-6 h-4 border-r-2 border-primary-foreground pr-2" />
                  {mapTruthyToLabel([
                    `${amplitude}${powerUnit}`,
                    `${offset}${powerUnit}`,
                    frequency && `${frequency}${Units.Frequency}`
                  ])}
                </Badge>
              </TooltipTrigger>
            </Tooltip>
          )
        )
        .with(
          { [TimeDomainAnalysis.Exponential]: P.nonNullable },
          ({ Exp: { initial_value, final_value, rise_time, fall_time } }) => (
            <Tooltip>
              <TooltipContent>
                {
                  "Exponential: (Initial value), (Rise time), (Final value), (Fall time)"
                }
              </TooltipContent>
              <TooltipTrigger>
                <Badge className="flex gap-2 items-center">
                  <Exp className="w-6 h-4 border-r-2 border-primary-foreground pr-2 py-1" />
                  {mapTruthyToLabel([
                    `${initial_value}${powerUnit}`,
                    rise_time && `${rise_time}${Units.Time}`,
                    `${final_value}${powerUnit}`,
                    fall_time && `${fall_time}${Units.Time}`
                  ])}
                </Badge>
              </TooltipTrigger>
            </Tooltip>
          )
        )
        .with(
          { [TimeDomainAnalysis.SingleFrequencyFM]: P.nonNullable },
          ({
            Sffm: { amplitude, offset, carrier_frequency, signal_frequency }
          }) => (
            <Tooltip>
              <TooltipContent>
                {
                  "Frequency modulated: (Amplitude), (DC offset), (Signal frequency), (Carrier frequency)"
                }
              </TooltipContent>
              <TooltipTrigger>
                <Badge className="flex gap-2 items-center">
                  <Typography
                    className="font-semibold tracking-tight border-r-2 border-primary-foreground pr-2"
                    variant="xsmall"
                  >
                    FM
                  </Typography>
                  {mapTruthyToLabel([
                    `${amplitude}${powerUnit}`,
                    `${offset}${powerUnit}`,
                    signal_frequency && `${signal_frequency}${Units.Frequency}`,
                    carrier_frequency &&
                      `${carrier_frequency}${Units.Frequency}`
                  ])}
                </Badge>
              </TooltipTrigger>
            </Tooltip>
          )
        )
        .with(
          { [TimeDomainAnalysis.AmplitudeModulated]: P.nonNullable },
          ({
            Am: { amplitude, offset, carrier_frequency, modulating_frequency }
          }) => (
            <Tooltip>
              <TooltipContent>
                {
                  "Amplitude modulated: (Amplitude), (DC offset), (Carrier frequency), (Signal frequency)"
                }
              </TooltipContent>
              <TooltipTrigger>
                <Badge className="flex gap-2 items-center">
                  <Typography
                    className="font-semibold tracking-tight border-r-2 border-primary-foreground pr-2"
                    variant="xsmall"
                  >
                    FM
                  </Typography>
                  {mapTruthyToLabel([
                    `${amplitude}${powerUnit}`,
                    `${offset}${powerUnit}`,
                    carrier_frequency &&
                      `${carrier_frequency}${Units.Frequency}`,
                    modulating_frequency &&
                      `${modulating_frequency}${Units.Frequency}`
                  ])}
                </Badge>
              </TooltipTrigger>
            </Tooltip>
          )
        )
        .otherwise(() => null)}
      {match(data.small_signal)
        .with(P.nonNullable, ({ amplitude, phase }) => (
          <Tooltip>
            <TooltipContent>
              {"Small signal AC: (Amplitude), (Phase)"}
            </TooltipContent>
            <TooltipTrigger>
              <Badge className="flex gap-2 items-center">
                <Typography
                  className="font-semibold tracking-tight border-r-2 border-primary-foreground pr-2"
                  variant="xsmall"
                >
                  AC
                </Typography>
                {mapTruthyToLabel([
                  `${amplitude}${powerUnit}`,
                  phase && `${phase}${Units.Phase}`
                ])}
              </Badge>
            </TooltipTrigger>
          </Tooltip>
        ))
        .otherwise(() => null)}
    </div>
  );
};

export default PowerSourceTag;
