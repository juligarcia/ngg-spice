import { FC, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { Pencil, Plus, Trash } from "lucide-react";
import { SimulationBasis } from "@/types/simulation";
import { Waypoints } from "lucide-react";
import { Series } from "../LinearGraph/LinearGraph";
import EditSeries from "./EditSeries";
import { Dialog } from "@/components/ui/dialog";

interface VisualizerSideToolbar2DProps {
  simulationId: string;
  xAccessor: string | null;
  series: Series[];
  setXAccessor(newAccessors: string): void;
  partiallyUpdateSeries(index: number, partial: Partial<Series> | null): void;
  addSeries(accessor: string): void;
  availableNodes: string[];
}

const VisualizerSideToolbar2D: FC<VisualizerSideToolbar2DProps> = ({
  xAccessor,
  series,
  setXAccessor,
  partiallyUpdateSeries,
  availableNodes,
  addSeries
}) => {
  const [editSeries, setEditSeries] = useState<number | null>();

  const yNodes = availableNodes.filter(
    (nodeName) => !Object.values<string>(SimulationBasis).includes(nodeName)
  );

  const xNodes = availableNodes.filter((nodeName) =>
    Object.values<string>(SimulationBasis).includes(nodeName)
  );

  return (
    <div className="bg-accent min-w-36 max-w-36 p-2 flex flex-col items-center justify-between">
      <div></div>

      <div className="flex flex-col items-center gap-2 w-full">
        <div className="w-full flex flex-col items-center gap-2 p-2 border-2 border-primary/50 rounded-lg">
          <DropdownMenu>
            <DropdownMenuTrigger disabled={xNodes.length <= 1} asChild>
              <Button variant="outline" size="sm" className="w-full">
                <Typography className="overflow-hidden text-ellipsis">
                  {xAccessor || "x"}
                </Typography>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent sideOffset={10} side="right" align="end">
              {xNodes.map((nodeName) => (
                <DropdownMenuItem
                  className="gap-2"
                  disabled={
                    series.some(({ accessor }) => accessor === nodeName) ||
                    xAccessor === nodeName
                  }
                  key={nodeName}
                  onClick={() => setXAccessor(nodeName)}
                >
                  <Typography>{nodeName}</Typography>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Typography className="text-muted-foreground">vs.</Typography>

          {series.map((s, index) => {
            const isEditing = editSeries === index;

            return (
              <Dialog
                open={isEditing}
                onOpenChange={(open) => !open && setEditSeries(null)}
              >
                <EditSeries
                  handleClose={() => setEditSeries(null)}
                  series={s}
                  updateSeries={(newSeries) => {
                    if (isEditing) partiallyUpdateSeries(index, newSeries);
                  }}
                />
                <DropdownMenu>
                  <DropdownMenuTrigger disabled={yNodes.length <= 1} asChild>
                    <Button variant="outline" size="sm" className="w-full">
                      <Typography className="overflow-hidden text-ellipsis">
                        {s.accessor || "y"}
                      </Typography>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent sideOffset={10} side="right" align="end">
                    {yNodes.map((nodeName) => (
                      <DropdownMenuItem
                        className="gap-2"
                        disabled={
                          series.some(
                            ({ accessor }) => accessor === nodeName
                          ) || xAccessor === nodeName
                        }
                        key={nodeName}
                        onClick={() =>
                          partiallyUpdateSeries(index, { accessor: nodeName })
                        }
                      >
                        <Waypoints size={15} />
                        <Typography>{nodeName}</Typography>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="gap-2"
                      onClick={() => setEditSeries(index)}
                    >
                      <Pencil size={15} />
                      <Typography>Edit</Typography>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="gap-2"
                      onClick={() => partiallyUpdateSeries(index, null)}
                    >
                      <Trash size={15} />
                      <Typography>Remove</Typography>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </Dialog>
            );
          })}
        </div>

        <div className="flex flex-col gap-2 items-center w-full">
          <DropdownMenu>
            <DropdownMenuTrigger disabled={series.length >= 3} asChild>
              <Button size="sm" className="flex items-center gap-2 w-full">
                <div className="flex gap-2 items-center">
                  <Typography>Add</Typography>
                  <Plus size={15} />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent sideOffset={10} side="right" align="end">
              {yNodes.map((nodeName) => (
                <DropdownMenuItem
                  className="gap-2"
                  disabled={
                    series.some(({ accessor }) => accessor === nodeName) ||
                    xAccessor === nodeName
                  }
                  key={`add-${nodeName}`}
                  onClick={() => addSeries(nodeName)}
                >
                  <Waypoints size={15} />
                  <Typography>{nodeName}</Typography>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default VisualizerSideToolbar2D;
