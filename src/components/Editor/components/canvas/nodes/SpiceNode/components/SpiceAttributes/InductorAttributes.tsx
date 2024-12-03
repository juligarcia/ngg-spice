import { FC } from "react";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { InductorData } from "@/components/context/SpiceContext/SpiceContext";
import { Button } from "@/components/ui/Button";
import { useReactFlow } from "@xyflow/react";
import { Units } from "@/constants/units";
import { isUnit } from "@/utils/validations";
import FieldContainer from "@/components/ui/FieldContainer";

interface InductorAttributesProps {
  data: Partial<InductorData>;
  id: string;
  handleClose(): void;
}

type Form = InductorData;

const InductorAttributes: FC<InductorAttributesProps> = ({
  data,
  id,
  handleClose
}) => {
  const {
    formState: { isDirty, errors },
    register,
    handleSubmit,
    reset
  } = useForm<Form>({ defaultValues: data });

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
      <FieldContainer error={errors["value"]} postfix={Units.Inductance}>
        <Input
          placeholder="Value"
          {...register("value", {
            required: {
              value: true,
              message: "Inductor value is required"
            },
            validate: {
              isUnit: isUnit("inductor")
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

export default InductorAttributes;
