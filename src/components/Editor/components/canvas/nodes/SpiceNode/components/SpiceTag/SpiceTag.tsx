import { FC } from "react";
import SpiceAlert from "./SpiceAlert/SpiceAlert";
import { match } from "ts-pattern";
import { SpiceNodeValues } from "../../types";
import { SpiceInstanceName } from "@/components/context/SpiceContext/SpiceContext";
import ResistorTag from "./ResistorTag";
import CapacitorTag from "./CapacitorTag";
import InductorTag from "./InductorTag";
import PowerSourceTag from "./PowerSourceTag";
import clsx from "clsx";
import ControlledPowerSourceTag from "./ControlledPowerSourceTag";
import BipolarJunctionTransistorTag from "./BipolarJunctionTransistorTag";

interface SpiceTagProps {
  id: string;
  name: string;
  nodeData: SpiceNodeValues;
  offset: number;
}

const SpiceTag: FC<SpiceTagProps> = ({ id, nodeData, name, offset }) => {
  const hasSpiceTag = match(nodeData.instance_name)
    .with(SpiceInstanceName.Ground, () => false)
    .otherwise(() => true);

  return hasSpiceTag ? (
    <div
      style={{ bottom: -offset }}
      className={clsx(
        "flex h-fit z-10 bg-accent/50 rounded-sm absolute items-center px-4 py-2 gap-3 w-fit left-2/4 translate-y-[100%] -translate-x-2/4"
      )}
      id={id}
    >
      {match(nodeData)
        .with({ instance_name: SpiceInstanceName.Resistor }, (resistorData) => (
          <ResistorTag name={name} data={resistorData.data} />
        ))
        .with(
          { instance_name: SpiceInstanceName.Capacitor },
          (capacitorData) => (
            <CapacitorTag name={name} data={capacitorData.data} />
          )
        )
        .with({ instance_name: SpiceInstanceName.Inductor }, (inductorData) => (
          <InductorTag name={name} data={inductorData.data} />
        ))
        .with(
          { instance_name: SpiceInstanceName.VoltageSource },
          (voltageSourceData) => (
            <PowerSourceTag
              type={SpiceInstanceName.VoltageSource}
              name={name}
              data={voltageSourceData.data}
            />
          )
        )
        .with(
          { instance_name: SpiceInstanceName.CurrentSource },
          (currentSourceData) => (
            <PowerSourceTag
              type={SpiceInstanceName.CurrentSource}
              name={name}
              data={currentSourceData.data}
            />
          )
        )
        .with({ instance_name: SpiceInstanceName.VCVS }, (vcvsData) => (
          <ControlledPowerSourceTag
            type={SpiceInstanceName.VCVS}
            name={name}
            data={vcvsData.data}
          />
        ))
        .with({ instance_name: SpiceInstanceName.VCIS }, (vcisData) => (
          <ControlledPowerSourceTag
            type={SpiceInstanceName.VCIS}
            name={name}
            data={vcisData.data}
          />
        ))
        .with({ instance_name: SpiceInstanceName.ICIS }, (icisData) => (
          <ControlledPowerSourceTag
            type={SpiceInstanceName.ICIS}
            name={name}
            data={icisData.data}
          />
        ))
        .with({ instance_name: SpiceInstanceName.ICVS }, (icvsData) => (
          <ControlledPowerSourceTag
            type={SpiceInstanceName.ICVS}
            name={name}
            data={icvsData.data}
          />
        ))
        .with({ instance_name: SpiceInstanceName.BJT }, (bjtData) => (
          <BipolarJunctionTransistorTag name={name} data={bjtData.data} />
        ))
        .otherwise(() => null)}
      <SpiceAlert nodeData={nodeData} />
    </div>
  ) : null;
};

export default SpiceTag;
