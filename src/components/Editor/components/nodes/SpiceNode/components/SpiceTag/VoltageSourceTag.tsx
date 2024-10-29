import { VoltageSourceData } from "@/components/context/SpiceContext";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/Typography";
import { Units } from "@/constants/units";
import { TimeDomainAnalysis } from "@/types/elements";
import { FC } from "react";
import { match, P } from "ts-pattern";
import Pulse from "@/assets/voltage-source/pulse.svg?react";
import Sine from "@/assets/voltage-source/sine.svg?react";
import Exp from "@/assets/voltage-source/exp.svg?react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";

interface VoltageSourceTagProps {
  name: string;
  data: Partial<VoltageSourceData>;
}

const ResistorTag: FC<VoltageSourceTagProps> = ({ name, data }) => {
  return (
    <>
      <Typography className="overflow-hidden text-ellipsis" variant="h4">
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
                  <Typography variant="h4">{`${value}${Units.Voltage}`}</Typography>
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
                  <Pulse className="w-8 h-6 border-r-2 border-primary-foreground pr-2" />
                  <Typography variant="h4">{`${initial_value}${Units.Voltage},`}</Typography>
                  <Typography variant="h4">{`${final_value}${Units.Voltage},`}</Typography>
                  {rise_time && (
                    <Typography variant="h4">{`${rise_time}${Units.Time}`}</Typography>
                  )}
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
                  <Sine className="w-8 h-6 border-r-2 border-primary-foreground pr-2" />
                  <Typography variant="h4">{`${amplitude}${Units.Voltage},`}</Typography>
                  <Typography variant="h4">{`${offset}${Units.Voltage},`}</Typography>
                  {frequency && (
                    <Typography variant="h4">{`${frequency}${Units.Frequency}`}</Typography>
                  )}
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
                  <Exp className="w-8 h-6 border-r-2 border-primary-foreground pr-2 py-1" />
                  <Typography variant="h4">{`${initial_value}${Units.Voltage},`}</Typography>
                  {rise_time && (
                    <Typography variant="h4">{`${rise_time}${Units.Time},`}</Typography>
                  )}
                  <Typography variant="h4">{`${final_value}${Units.Voltage},`}</Typography>
                  {fall_time && (
                    <Typography variant="h4">{`${fall_time}${Units.Time}`}</Typography>
                  )}
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
                    variant="h4"
                    className="border-r-2 border-primary-foreground pr-2"
                  >
                    FM
                  </Typography>
                  <Typography variant="h4">{`${amplitude}${Units.Voltage},`}</Typography>
                  <Typography variant="h4">{`${offset}${Units.Voltage},`}</Typography>
                  {signal_frequency && (
                    <Typography variant="h4">{`${signal_frequency}${Units.Frequency},`}</Typography>
                  )}
                  {carrier_frequency && (
                    <Typography variant="h4">{`${carrier_frequency}${Units.Frequency}`}</Typography>
                  )}
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
                    variant="h4"
                    className="border-r-2 border-primary-foreground pr-2"
                  >
                    FM
                  </Typography>
                  <Typography variant="h4">{`${amplitude}${Units.Voltage},`}</Typography>
                  <Typography variant="h4">{`${offset}${Units.Voltage},`}</Typography>
                  {carrier_frequency && (
                    <Typography variant="h4">{`${carrier_frequency}${Units.Frequency}`}</Typography>
                  )}
                  {modulating_frequency && (
                    <Typography variant="h4">{`${modulating_frequency}${Units.Frequency},`}</Typography>
                  )}
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
                  variant="h4"
                  className="border-r-2 border-primary-foreground pr-2"
                >
                  AC
                </Typography>
                <Typography variant="h4">{`${amplitude}${Units.Voltage},`}</Typography>
                {phase && (
                  <Typography variant="h4">{`${phase}${Units.Phase}`}</Typography>
                )}
              </Badge>
            </TooltipTrigger>
          </Tooltip>
        ))
        .otherwise(() => null)}
    </>
  );
};

export default ResistorTag;
