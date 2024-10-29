import {
  SpiceInstanceName,
  SpiceNode,
  SpiceNodeDisplayName
} from "@/components/context/SpiceContext";
import { Typography } from "@/components/ui/Typography";
import {
  NodeToolbar,
  Position,
  ReactFlowState,
  useReactFlow,
  useStore
} from "@xyflow/react";
import clsx from "clsx";
import { FC, useCallback, useEffect } from "react";
import { shallow } from "zustand/shallow";
import Nodes from "../../../utils";
import { match } from "ts-pattern";
import ResistorAttributes from "./ResistorAttributes";
import { SpiceNodeValues } from "../../types";
import { Input } from "@/components/ui/input";
import { debounce } from "lodash";
import CapacitorAttributes from "./CapacitorAttributes";
import InductorAttributes from "./InductorAttributes";
import VoltageSourceAttributes from "./VoltageSourceAttributes/VoltageSourceAttributes";

const storeSelector = (state: ReactFlowState) => ({
  singleSelection: state.nodes.filter((node) => node.selected).length === 1,
  zoomLevel: state.transform[2]
});

type SpiceAttributesProps = {
  isVisible?: boolean;
  position: Position;
  id: string;
  offset: number;
  selected?: boolean;
  nodeData: SpiceNodeValues;
  name: string;
} & Pick<SpiceNode, "instance_name">;

const SpiceAttributes: FC<SpiceAttributesProps> = ({
  position,
  instance_name,
  name,
  id,
  nodeData,
  offset,
  selected
}) => {
  const { singleSelection, zoomLevel } = useStore(storeSelector, shallow);

  const isVisible = selected && singleSelection;

  const { fitView, getNode, setNodes } = useReactFlow();

  const onNameChange = useCallback(
    debounce((newName) => {
      setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === id)
            return {
              ...node,
              data: { ...node.data, name: newName }
            };

          return node;
        })
      );
    }, 300),
    []
  );

  useEffect(() => {
    if (isVisible) {
      const outOfBounds = Nodes.isOutOfBounds(
        "canvas-wrapper",
        `${id}-attributes`
      );

      if (outOfBounds)
        fitView({
          duration: 300,
          nodes: [getNode(id)!],
          minZoom: zoomLevel,
          maxZoom: zoomLevel
        });
    }
  }, [isVisible]);

  const hasSpiceAttributes = match(nodeData.instance_name)
    .with(SpiceInstanceName.Ground, () => false)
    .otherwise(() => true);

  return (
    <NodeToolbar
      className="nowheel nodrag"
      isVisible={hasSpiceAttributes && isVisible}
      offset={offset}
      id={`${id}-attributes`}
      position={position}
    >
      <div
        className={clsx("flex gap-2", {
          "flex-col-reverse": position === Position.Top,
          "flex-row": position === Position.Right,
          "flex-col": position === Position.Bottom,
          "flex-row-reverse": position === Position.Left
        })}
      >
        <div
          className={clsx(
            "bg-accent rounded-lg overflow-hidden shadow-xl"
          )}
          style={{
            width: match(nodeData.instance_name)
              .with(SpiceInstanceName.VoltageSource, () => 550)
              .otherwise(() => 350)
          }}
        >
          <div className="flex items-center w-full justify-between p-4 bg-primary/30">
            <Input
              placeholder="Name..."
              onChange={(e) => onNameChange(e.target.value)}
              defaultValue={name}
              className="bg-transparent border-none border-card w-[50%] text-xl font-semibold tracking-tight !outline-primary"
            />
            <Typography variant="h4">
              {SpiceNodeDisplayName[instance_name]}
            </Typography>
          </div>
          {match(nodeData)
            .with(
              { instance_name: SpiceInstanceName.Resistor },
              (resistorNode) => (
                <ResistorAttributes id={id} data={resistorNode.data} />
              )
            )
            .with(
              { instance_name: SpiceInstanceName.Capacitor },
              (capacitorData) => (
                <CapacitorAttributes id={id} data={capacitorData.data} />
              )
            )
            .with(
              { instance_name: SpiceInstanceName.Inductor },
              (inductorData) => (
                <InductorAttributes id={id} data={inductorData.data} />
              )
            )
            .with(
              { instance_name: SpiceInstanceName.VoltageSource },
              (voltageSourcedata) => (
                <VoltageSourceAttributes
                  id={id}
                  data={voltageSourcedata.data}
                />
              )
            )
            .otherwise(() => null)}
        </div>
      </div>
    </NodeToolbar>
  );
};

export default SpiceAttributes;
