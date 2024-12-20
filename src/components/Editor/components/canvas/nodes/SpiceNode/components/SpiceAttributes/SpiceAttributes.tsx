import {
  SpiceInstanceName,
  SpiceNode,
  SpiceNodeDisplayName
} from "@/components/context/SpiceContext/SpiceContext";
import { Typography } from "@/components/ui/Typography";
import {
  NodeToolbar,
  Position,
  ReactFlowState,
  useReactFlow,
  useStore,
  Viewport
} from "@xyflow/react";
import clsx from "clsx";
import { FC, useCallback, useEffect, useState } from "react";
import { shallow } from "zustand/shallow";
import Nodes from "../../../utils";
import { match, P } from "ts-pattern";
import ResistorAttributes from "./ResistorAttributes";
import { SpiceNodeValues } from "../../types";
import { Input } from "@/components/ui/input";
import CapacitorAttributes from "./CapacitorAttributes";
import InductorAttributes from "./InductorAttributes";
import SourceAttributes from "./SourceAttributes/PowerSourceAttributes";
import { useMeasure } from "@uidotdev/usehooks";
import CurrentControlledPowerSupplyAttributes from "./CurrentControlledPowerSupplyAttributes";
import VoltageControlledPowerSupplyAttributes from "./VoltageControlledPowerSupplyAttributes";
import BipolarJunctionTransistorAttributes from "./BipolarJunctionTransistorAttributes/BipolarJunctionTransistorAttributes";

const storeSelector = (state: ReactFlowState) => ({
  singleSelection: state.nodes.filter((node) => node.selected).length === 1
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
  const [previousViewport, setPreviousViewport] = useState<Viewport | null>(
    null
  );

  const { singleSelection } = useStore(storeSelector, shallow);

  const isVisible = selected && singleSelection;

  const { getNode, setNodes, fitBounds, getViewport, setViewport } =
    useReactFlow();

  const onNameChange = useCallback((newName: string) => {
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
  }, []);

  const [ref, { width, height }] = useMeasure();

  useEffect(() => {
    if (isVisible) {
      const outOfBounds = Nodes.isOutOfBounds(
        "canvas-wrapper",
        `${id}-attributes`
      );

      if (outOfBounds && width !== null && height !== null) {
        setPreviousViewport(getViewport());

        const node = getNode(id);

        if (!node) return;

        const { x = 0, y = 0 } = node.position;
        const { height: nodeHeight = 0, width: nodeWidth = 0 } =
          node.measured || {};

        if (position === Position.Top) {
          const boundWidth = width;
          const boundHeight = height + nodeHeight;
          const boundX = x - boundWidth / 2;
          const boundY = y - boundHeight + 100;

          fitBounds(
            { x: boundX, y: boundY, width: boundWidth, height: boundHeight },
            { duration: 300 }
          );
        } else if (position === Position.Bottom) {
          const boundWidth = width;
          const boundHeight = height + nodeHeight;
          const boundX = x - boundWidth / 2;
          const boundY = y - 100;

          fitBounds(
            { x: boundX, y: boundY, width: boundWidth, height: boundHeight },
            { duration: 300 }
          );
        } else if (position === Position.Left) {
          const boundWidth = width + nodeWidth;
          const boundHeight = height;
          const boundX = x - boundWidth + 100;
          const boundY = y - boundHeight / 2;

          fitBounds(
            { x: boundX, y: boundY, width: boundWidth, height: boundHeight },
            { duration: 300 }
          );
        } else if (position === Position.Right) {
          const boundWidth = width + nodeWidth;
          const boundHeight = height;
          const boundX = x - 100;
          const boundY = y - boundHeight / 2;

          fitBounds(
            { x: boundX, y: boundY, width: boundWidth, height: boundHeight },
            { duration: 300 }
          );
        }
      }
    }
  }, [isVisible, width, height, position]);

  useEffect(() => {
    if (!selected && !isVisible && previousViewport) {
      setViewport(previousViewport, { duration: 300 });
      setPreviousViewport(null);
    }
  }, [selected, isVisible]);

  const hasSpiceAttributes = match(nodeData.instance_name)
    .with(SpiceInstanceName.Ground, () => false)
    .otherwise(() => true);

  const handleClose = () =>
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return { ...node, selected: false };
        }

        return node;
      })
    );

  return (
    <NodeToolbar
      className="nowheel nodrag"
      isVisible={hasSpiceAttributes && isVisible}
      offset={offset}
      id={`${id}-attributes`}
      position={position}
    >
      <div
        ref={ref}
        className={clsx("flex gap-2", {
          "flex-col-reverse": position === Position.Top,
          "flex-row": position === Position.Right,
          "flex-col": position === Position.Bottom,
          "flex-row-reverse": position === Position.Left
        })}
      >
        <div
          className={clsx("bg-accent rounded-lg overflow-hidden shadow-xl")}
          style={{
            width: match(nodeData.instance_name)
              .with(
                P.union(
                  SpiceInstanceName.VoltageSource,
                  SpiceInstanceName.CurrentSource
                ),
                () => 550
              )
              .with(SpiceInstanceName.BJT, () => 850)
              .otherwise(() => 350)
          }}
        >
          <div className="flex items-center w-full justify-between p-4 bg-primary/30">
            <Input
              placeholder="Name..."
              onBlur={(e) => onNameChange(e.target.value)}
              defaultValue={name}
              className="bg-transparent border-none border-card w-[50%] text-xl font-semibold tracking-tight !outline-primary"
            />
            <Typography variant="h4" className="text-right">
              {SpiceNodeDisplayName[instance_name]}
            </Typography>
          </div>
          {match(nodeData)
            .with(
              { instance_name: SpiceInstanceName.Resistor },
              (resistorNode) => (
                <ResistorAttributes
                  handleClose={handleClose}
                  id={id}
                  data={resistorNode.data}
                />
              )
            )
            .with(
              { instance_name: SpiceInstanceName.Capacitor },
              (capacitorData) => (
                <CapacitorAttributes
                  handleClose={handleClose}
                  id={id}
                  data={capacitorData.data}
                />
              )
            )
            .with(
              { instance_name: SpiceInstanceName.Inductor },
              (inductorData) => (
                <InductorAttributes
                  handleClose={handleClose}
                  id={id}
                  data={inductorData.data}
                />
              )
            )
            .with(
              {
                instance_name: SpiceInstanceName.VoltageSource
              },
              (voltageSourceData) => (
                <SourceAttributes
                  type={SpiceInstanceName.VoltageSource}
                  handleClose={handleClose}
                  id={id}
                  data={voltageSourceData.data}
                />
              )
            )
            .with(
              { instance_name: SpiceInstanceName.CurrentSource },
              (currentSourceData) => (
                <SourceAttributes
                  type={SpiceInstanceName.CurrentSource}
                  handleClose={handleClose}
                  id={id}
                  data={currentSourceData.data}
                />
              )
            )
            .with(
              {
                instance_name: P.union(
                  SpiceInstanceName.VCVS,
                  SpiceInstanceName.VCIS
                )
              },
              (controlledSourceData) => (
                <VoltageControlledPowerSupplyAttributes
                  handleClose={handleClose}
                  id={id}
                  type={controlledSourceData.instance_name}
                  data={controlledSourceData.data}
                />
              )
            )
            .with(
              {
                instance_name: P.union(
                  SpiceInstanceName.ICVS,
                  SpiceInstanceName.ICIS
                )
              },
              (currentControlledSourceData) => (
                <CurrentControlledPowerSupplyAttributes
                  handleClose={handleClose}
                  id={id}
                  type={currentControlledSourceData.instance_name}
                  data={currentControlledSourceData.data}
                />
              )
            )
            .with({ instance_name: SpiceInstanceName.BJT }, (bjtData) => (
              <BipolarJunctionTransistorAttributes
                handleClose={handleClose}
                id={id}
                data={bjtData.data}
              />
            ))
            .otherwise(() => null)}
        </div>
      </div>
    </NodeToolbar>
  );
};

export default SpiceAttributes;
