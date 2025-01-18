import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { NodeToolbar, useReactFlow } from "@xyflow/react";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { ConnectionNodeProps } from "./ConnectionNode";
import FieldContainer from "@/components/ui/FieldContainer";
import clsx from "clsx";

interface ConnectionNodeToolbarProps {
  isVisible?: boolean;
  data: ConnectionNodeProps["data"];
  id: string;
}

const ConnectionNodeToolbar: FC<ConnectionNodeToolbarProps> = ({
  isVisible,
  data,
  id
}) => {
  const {
    register,
    formState: { errors, isDirty },
    handleSubmit,
    reset
  } = useForm<typeof data>({
    defaultValues: { name: data.name }
  });

  const { setNodes } = useReactFlow();

  const handleClose = () =>
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return { ...node, selected: false };
        }

        return node;
      })
    );

  const onSubmit = handleSubmit((formValues) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id)
          return {
            ...node,
            data: { ...node.data, ...formValues }
          };

        return node;
      })
    );
    reset(formValues);
    handleClose();
  });

  return (
    <NodeToolbar offset={20} isVisible={isVisible} className="nowheel nodrag">
      <form
        className={clsx(
          "bg-accent rounded-lg overflow-hidden shadow-xl p-4 flex flex-col gap-4"
        )}
        onSubmit={onSubmit}
      >
        <FieldContainer error={errors["name"]}>
          <Input
            {...register("name", {
              required: {
                value: true,
                message: "Name is required"
              }
            })}
            defaultValue={data.name}
          />
        </FieldContainer>

        <Button disabled={!isDirty}>Save</Button>
      </form>
    </NodeToolbar>
  );
};

export default ConnectionNodeToolbar;
