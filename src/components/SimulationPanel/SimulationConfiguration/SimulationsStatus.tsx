import { SimulationStatus as SimulationStatusType } from "@/types/simulation";
import { FC, ReactNode } from "react";
import { match, P } from "ts-pattern";
import { Typography } from "@/components/ui/Typography";
import { Progress } from "@/components/ui/progress";
import { Bolt, CircleCheck, LoaderCircle } from "lucide-react";

interface SimulationStatusBadgeProps {
  status: string;
  progress: number;
  icon: ReactNode;
}

const SimulationStatusBadge: FC<SimulationStatusBadgeProps> = ({
  status,
  progress,
  icon
}) => {
  return (
    <div className="flex flex-col w-full bg-background rounded-sm relative overflow-hidden">
      <div className="flex flex-row gap-8 grow w-full p-4">
        <div className="flex gap-2 w-full items-center justify-between">
          <div className="flex flex-col gap-2 grow w-20">
            <Typography variant="small">Status</Typography>
            <Typography variant="xsmall" className="text-muted-foreground">
              {status}
            </Typography>
          </div>
          {icon}
        </div>
      </div>
      <Progress
        className="rounded-none"
        value={progress}
      />
    </div>
  );
};

interface SimulationStatusProps {
  status?: SimulationStatusType;
  name: string;
}

const SimulationStatus: FC<SimulationStatusProps> = ({ status }) => {
  return (
    <div className="w-full mt-4">
      {match(status)
        .with(P.nullish, () => (
          <SimulationStatusBadge
            icon={<Bolt size={25} className="stroke-muted-foreground" />}
            status="Idle"
            progress={0}
          />
        ))
        .with({ status: "SourceDeck" }, () => (
          <SimulationStatusBadge
            icon={
              <LoaderCircle size={25} className="stroke-primary animate-spin" />
            }
            status="Sourcing"
            progress={0}
          />
        ))
        .with({ status: "Ready" }, () => (
          <SimulationStatusBadge
            icon={<CircleCheck size={25} className="stroke-primary" />}
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
              status={`Running ${progress.toFixed(0)}%`}
              progress={progress}
              icon={
                <LoaderCircle
                  size={25}
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
