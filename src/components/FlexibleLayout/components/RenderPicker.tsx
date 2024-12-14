import { FC } from "react";
import { Typography } from "@/components/ui/Typography";
import { LayoutConfiguration, useLayoutStore } from "@/store/layout";
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ChartLine, ChevronDown, PencilRuler } from "lucide-react";

type RenderPickerProps = Pick<LayoutConfiguration, "order">;

const RenderPicker: FC<RenderPickerProps> = ({ order }) => {
  const hasEditor = useLayoutStore((state) =>
    state.layoutConfigurations.some(
      (configuration) => configuration.type === "editor"
    )
  );

  const changeTypeByOrder = useLayoutStore.use.changeTypeByOrder();

  return (
    <div className="h-full w-full bg-gradient-to-br border-2 border-accent from-accent/50 to-card rounded-md overflow-hidden flex flex-col items-center justify-center p-8 gap-6 hover:border-primary/50 duration-300">
      <Typography className="text-muted-foreground text-center" variant="h4">
        Assign what you want to visualize in this display area
      </Typography>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="flex items-center gap-2">
            <Typography>Assign</Typography>
            <ChevronDown size={15} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent sideOffset={10} side="bottom" align="center">
          <DropdownMenuItem disabled={hasEditor}>
            <PencilRuler size={15} className="mr-2" />
            <Typography>Editor</Typography>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => changeTypeByOrder({ order, type: "visualizer" })}
          >
            <ChartLine size={15} className="mr-2" />
            <Typography>Visualizer</Typography>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default RenderPicker;
