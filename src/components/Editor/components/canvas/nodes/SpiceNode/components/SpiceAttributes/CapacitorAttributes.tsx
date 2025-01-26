import { FC, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { CapacitorData } from "@/components/context/SpiceContext/SpiceContext";
import { Button } from "@/components/ui/Button";
import { useReactFlow } from "@xyflow/react";
import { Units } from "@/constants/units";
import { isUnit } from "@/utils/validations";
import FieldContainer from "@/components/ui/FieldContainer";

interface CapacitorAttributesProps {
  data: Partial<CapacitorData>;
  id: string;
  handleClose(): void;
}

type Form = CapacitorData;

const CapacitorAttributes: FC<CapacitorAttributesProps> = ({
  data,
  id,
  handleClose
}) => {
  const {
    formState: { isDirty, errors },
    register,
    handleSubmit,
    reset,
    setFocus
  } = useForm<Form>({ defaultValues: data });

  useEffect(() => {
    setFocus("value");
  }, []);

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
      <FieldContainer error={errors["value"]} postfix={Units.Capacitance}>
        <Input
          placeholder="Value"
          {...register("value", {
            required: {
              value: true,
              message: "Capacitor value is required"
            },
            validate: {
              isUnit: isUnit("capacitor")
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

export default CapacitorAttributes;
