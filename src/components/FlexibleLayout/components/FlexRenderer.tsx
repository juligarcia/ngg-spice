import Editor from "@/components/Editor/Editor";
import SimulationVisualizer from "@/components/SimulationVisualizer/SimulationVisualizer";
import { LayoutConfiguration } from "@/store/layout";
import { FC } from "react";
import { match } from "ts-pattern";
import RenderPicker from "./RenderPicker";
import clsx from "clsx";

interface FlexRendererProps {
  layoutConfiguration: LayoutConfiguration;
  order: number;
  className?: string;
}

const FlexRenderer: FC<FlexRendererProps> = ({
  layoutConfiguration,
  order,
  className
}) => {
  return (
    <div
      className={clsx(
        "rounded-lg w-full h-full overflow-hidden max-h-full max-w-full",
        className
      )}
    >
      {match(layoutConfiguration)
        .with({ type: "editor" }, () => <Editor />)
        .with({ type: "visualizer" }, ({ simulationId }) => (
          <SimulationVisualizer simulationId={simulationId} order={order} />
        ))
        .with({ type: "picker" }, ({ order }) => <RenderPicker order={order} />)
        .otherwise(() => null)}
    </div>
  );
};

export default FlexRenderer;
