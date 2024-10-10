import {
  SpiceNode,
  SpiceNodeDisplayName
} from "@/components/context/SpiceContext";
import { Typography } from "@/components/ui/Typography";
import { Input } from "@/components/ui/input";
import { NodeToolbar, Position, useReactFlow } from "@xyflow/react";
import clsx from "clsx";
import { FC } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";

type SpiceAttributesProps = {
  isVisible?: boolean;
  position: Position;
  id: string;
} & Pick<SpiceNode, "instance_name" | "data" | "fields">;

const SpiceAttributes: FC<SpiceAttributesProps> = ({
  isVisible,
  position,
  instance_name,
  fields,
  id,
  data
}) => {
  const {
    register,
    handleSubmit,
    formState: { isDirty }
  } = useForm<{
    [key: string]: string | number;
  }>({
    defaultValues: data
  });

  const { setNodes } = useReactFlow();

  return (
    <NodeToolbar id={id} isVisible={isVisible} position={position}>
      <div
        className={clsx("flex gap-2", {
          "flex-col-reverse": position === Position.Top,
          "flex-row": position === Position.Right,
          "flex-col": position === Position.Bottom,
          "flex-row-reverse": position === Position.Left
        })}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={clsx("p-4 bg-accent rounded-lg w-[350px] shadow-xl")}
        >
          <Typography variant="h4">
            {SpiceNodeDisplayName[instance_name]}
          </Typography>
          <form
            onSubmit={handleSubmit((formValues) => {
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
            })}
            className="w-full mt-6"
          >
            {fields.map(({ name: fieldName, required = false }) => (
              <div key={fieldName}>
                <Input
                  {...register(fieldName, {
                    required: {
                      value: required,
                      message: "This field is required"
                    }
                  })}
                  className="mt-2 border-accent"
                  placeholder={fieldName}
                />
              </div>
            ))}
            <div className="w-full flex gap-2 items-center justify-end mt-6">
              <Button disabled={!isDirty}>Save</Button>
            </div>
          </form>
        </motion.div>
      </div>
    </NodeToolbar>
  );
};

export default SpiceAttributes;
