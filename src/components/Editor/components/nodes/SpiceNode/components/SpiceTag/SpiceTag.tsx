import { NodeToolbar, Position } from "@xyflow/react";
import { FC } from "react";
import SpiceAlert from "./SpiceAlert/SpiceAlert";
import { match } from "ts-pattern";
import { SpiceNodeValues } from "../../types";
import { SpiceInstanceName } from "@/components/context/SpiceContext";
import ResistorTag from "./ResistorTag";
import CapacitorTag from "./CapacitorTag";
import InductorTag from "./InductorTag";
import VoltageSourceTag from "./VoltageSourceTag";

interface SpiceTagProps {
  position: Position;
  id: string;
  offset: number;
  name: string;
  nodeData: SpiceNodeValues;
}

const SpiceTag: FC<SpiceTagProps> = ({
  position,
  id,
  offset,
  nodeData,
  name
}) => {
  const hasSpiceTag = match(nodeData.instance_name)
    .with(SpiceInstanceName.Ground, () => false)
    .otherwise(() => true);

  return (
    <NodeToolbar
      isVisible={hasSpiceTag}
      offset={offset}
      id={id}
      position={position}
    >
      <div className="flex h-fit bg-accent overflow-hidden rounded-sm relative items-center px-4 py-2 gap-3">
        {match(nodeData)
          .with(
            { instance_name: SpiceInstanceName.Resistor },
            (resistorData) => (
              <ResistorTag name={name} data={resistorData.data} />
            )
          )
          .with(
            { instance_name: SpiceInstanceName.Capacitor },
            (capacitorData) => (
              <CapacitorTag name={name} data={capacitorData.data} />
            )
          )
          .with(
            { instance_name: SpiceInstanceName.Inductor },
            (capacitorData) => (
              <InductorTag name={name} data={capacitorData.data} />
            )
          )
          .with(
            { instance_name: SpiceInstanceName.VoltageSource },
            (capacitorData) => (
              <VoltageSourceTag name={name} data={capacitorData.data} />
            )
          )
          .otherwise(() => null)}
        <SpiceAlert nodeData={nodeData} />
      </div>
    </NodeToolbar>
  );
};

export default SpiceTag;
