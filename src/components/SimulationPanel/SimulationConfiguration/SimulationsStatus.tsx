import { SimulationStatus as SimulationStatusType } from "@/types/simulation";
import { FC, ReactNode } from "react";
import { match, P } from "ts-pattern";
import { Typography } from "@/components/ui/Typography";
import { Progress } from "@/components/ui/progress";
import { Bolt, CircleCheck, LoaderCircle } from "lucide-react";
import clsx from "clsx";

interface SimulationStatusBadgeProps {
  status: string;
  progress: number;
  icon: ReactNode;
  compact?: boolean;
}

const SimulationStatusBadge: FC<SimulationStatusBadgeProps> = ({
  status,
  progress,
  icon,
  compact
}) => {
  return compact ? (
    icon
  ) : (
    <div
      className={clsx(
        "flex flex-col w-full bg-background rounded-sm relative overflow-hidden",
        {
          "!rounded-b-sm !rounded-t-none": compact
        }
      )}
    >
      <div className={clsx("flex flex-row gap-8 grow w-full p-4")}>
        <div className="flex gap-2 w-full items-center justify-between">
          <div className="flex flex-col gap-2 grow w-20">
            <Typography variant="small">Status</Typography>
            <div className="flex items-center gap-4">
              <Typography variant="xsmall" className="text-muted-foreground">
                {status}
              </Typography>
            </div>
          </div>
          {icon}
        </div>
      </div>
      <Progress className="rounded-none" value={progress} />
    </div>
  );
};

interface SimulationStatusProps {
  status?: SimulationStatusType;
  compact?: boolean;
}

const SimulationStatus: FC<SimulationStatusProps> = ({ status, compact }) => {
  return (
    <div
      className={clsx("w-full mt-4", {
        "!mt-0  ": compact
      })}
    >
      {match(status)
        .with(P.nullish, () => (
          <SimulationStatusBadge
            compact={compact}
            icon={
              <Bolt
                size={compact ? 20 : 25}
                className="stroke-muted-foreground"
              />
            }
            status="Idle"
            progress={0}
          />
        ))
        .with({ status: "SourceDeck" }, () => (
          <SimulationStatusBadge
            compact={compact}
            icon={
              <LoaderCircle
                size={compact ? 15 : 25}
                className="stroke-primary animate-spin"
              />
            }
            status="Sourcing"
            progress={0}
          />
        ))
        .with({ status: "Ready" }, () => (
          <SimulationStatusBadge
            compact={compact}
            icon={
              <CircleCheck
                size={compact ? 15 : 25}
                className="stroke-primary"
              />
            }
            status="Finalized"
            progress={100}
          />
        ))
        .with(
          {
            status: {
              Progress: { progress: P.number, simulation_name: P.string }
            }
          },
          ({
            status: {
              Progress: { progress }
            }
          }) => (
            <SimulationStatusBadge
              compact={compact}
              status={`Running ${progress.toFixed(0)}%`}
              progress={progress}
              icon={
                <LoaderCircle
                  size={compact ? 15 : 25}
                  className="stroke-primary animate-spin"
                />
              }
            />
          )
        )
        .run()}
    </div>
  );
};

export default SimulationStatus;
