import { FC, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { ResistorData } from "@/components/context/SpiceContext/SpiceContext";
import { Button } from "@/components/ui/Button";
import { useReactFlow } from "@xyflow/react";
import { Units } from "@/constants/units";
import { isUnit } from "@/utils/validations";
import FieldContainer from "@/components/ui/FieldContainer";

interface ResistorAttributesProps {
  data: Partial<ResistorData>;
  id: string;
  handleClose(): void;
}

type Form = ResistorData;

const ResistorAttributes: FC<ResistorAttributesProps> = ({
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
      <FieldContainer error={errors["value"]} postfix={Units.Resistance}>
        <Input
          placeholder="Value"
          {...register("value", {
            required: {
              value: true,
              message: "Resistor value is required"
            },
            validate: {
              isUnit: isUnit("resistor")
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

export default ResistorAttributes;
