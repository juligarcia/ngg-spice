import { FC } from "react";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import {
  ICISData,
  ICVSData,
  SpiceInstanceName
} from "@/components/context/SpiceContext";
import { Button } from "@/components/ui/Button";
import { useReactFlow, useStore } from "@xyflow/react";
import { Units } from "@/constants/units";
import { isUnit } from "@/utils/validations";
import FieldContainer from "@/components/ui/FieldContainer";
import { match, P } from "ts-pattern";
import { AppNode, NodeType } from "../../../types";
import { SpiceNodeType } from "../../types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Typography } from "@/components/ui/Typography";
import { isEmpty } from "lodash";

interface CurrentControlledPowerSupplyAttributesProps {
  data: Partial<ICISData | ICVSData>;
  type: SpiceInstanceName.ICIS | SpiceInstanceName.ICVS;
  id: string;
  handleClose(): void;
}

type Form = ICISData | ICVSData;

const CurrentControlledPowerSupplyAttributes: FC<
  CurrentControlledPowerSupplyAttributesProps
> = ({ data, id, type, handleClose }) => {
  console.log(data);

  const {
    formState: { isDirty, errors },
    register,
    handleSubmit,
    reset,
    control
  } = useForm<Form>({ defaultValues: data });

  const valueHelperIdentifier = match(type)
    .with(SpiceInstanceName.ICIS, () => "modifier")
    .with(SpiceInstanceName.ICVS, () => "transresistance modifier")
    .run();

  const powerUnit = match(type)
    .with(SpiceInstanceName.ICIS, () => Units.Unitless)
    .with(SpiceInstanceName.ICVS, () => Units.Resistance)
    .run();

  const { setNodes } = useReactFlow();

  const nodes = useStore((state) => state.nodes) as AppNode[];

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

  const possibleNodeTargets = new Set(
    nodes.filter(({ type, data }) =>
      match([type, data])
        .with(
          [
            NodeType.Spice,
            {
              instance_name: P.union(SpiceInstanceName.VoltageSource)
            }
          ],
          () => true
        )
        .otherwise(() => false)
    ) as SpiceNodeType[]
  );

  return (
    <form
      onSubmit={onSubmit}
      className="w-full p-4 flex flex-col justify-between mt-4 gap-2"
    >
      <Controller<Form>
        name="src"
        control={control}
        rules={{
          required: {
            value: true,
            message: "Reference source is required."
          }
        }}
        render={({ field }) => (
          <FieldContainer error={errors["src"]} postfix={Units.Unitless}>
            <Select
              defaultValue={data.src}
              disabled={isEmpty(possibleNodeTargets)}
              onValueChange={field.onChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Ref source" />
              </SelectTrigger>
              <SelectContent>
                {[...possibleNodeTargets].map(
                  ({ data: { name, instance_name } }) => (
                    <SelectItem
                      value={`${instance_name}${name}`}
                      key={`${instance_name}${name}`}
                    >
                      <Typography>{name}</Typography>
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </FieldContainer>
        )}
      />
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

export default CurrentControlledPowerSupplyAttributes;
