import { FC } from "react";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import {
  SpiceInstanceName,
  VCISData,
  VCVSData
} from "@/components/context/SpiceContext/SpiceContext";
import { Button } from "@/components/ui/Button";
import { useReactFlow } from "@xyflow/react";
import { Units } from "@/constants/units";
import { isUnit } from "@/utils/validations";
import FieldContainer from "@/components/ui/FieldContainer";
import { match } from "ts-pattern";

interface VoltageControlledPowerSupplyAttributesProps {
  data: Partial<VCVSData | VCISData>;
  type: SpiceInstanceName.VCVS | SpiceInstanceName.VCIS;

  id: string;
  handleClose(): void;
}

type Form = VCVSData | VCISData;

const VoltageControlledPowerSupplyAttributes: FC<
  VoltageControlledPowerSupplyAttributesProps
> = ({ data, id, type, handleClose }) => {
  const {
    formState: { isDirty, errors },
    register,
    handleSubmit,
    reset
  } = useForm<Form>({ defaultValues: data });

  const valueHelperIdentifier = match(type)
    .with(SpiceInstanceName.VCVS, () => "modifier")
    .with(SpiceInstanceName.VCIS, () => "transconductance modifier")
    .run();

  const powerUnit = match(type)
    .with(SpiceInstanceName.VCVS, () => Units.Unitless)
    .with(SpiceInstanceName.VCIS, () => Units.Conductance)
    .run();

  const { setNodes } = useReactFlow();

  const onSubmit = handleSubmit((formValues) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id)
          return {
            ...node,
            data: { ...node.data, data: formValues }
          };

        return node;
      })
    );
    reset(formValues);
    handleClose();
  });

  return (
    <form
      onSubmit={onSubmit}
      className="w-full p-4 flex flex-col justify-between mt-4"
    >
      <FieldContainer error={errors["value"]} postfix={powerUnit}>
        <Input
          placeholder="Value"
          {...register("value", {
            validate: {
              isUnit: isUnit(valueHelperIdentifier)
            }
          })}
        />
      </FieldContainer>
      <div className="w-full flex gap-2 items-center justify-end [&>button]:w-[50%] mt-12">
        <Button disabled={!isDirty}>Save</Button>
      </div>
    </form>
  );
};

export default VoltageControlledPowerSupplyAttributes;
