import {
  BipolarJunctionTransistorData,
  BipolarJunctionTransistorType,
  BipolarJunctionTransistorTypeDisplay
} from "@/components/context/SpiceContext/SpiceContext";
import { useReactFlow } from "@xyflow/react";
import { FC } from "react";
import { Controller, useForm } from "react-hook-form";
import Model from "./Model";
import { isEmpty } from "lodash";
import FieldContainer from "@/components/ui/FieldContainer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";

interface BipolarJunctionTransistorAttributesProps {
  data: Partial<BipolarJunctionTransistorData>;
  id: string;
  handleClose(): void;
}

export type Form = BipolarJunctionTransistorData;

const BipolarJunctionTransistorAttributes: FC<
  BipolarJunctionTransistorAttributesProps
> = ({ data, id, handleClose }) => {
  const {
    formState: { isDirty, errors },
    register,
    handleSubmit,
    reset,
    unregister,
    control,
    watch
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

  const onSubmitModel = (
    model: Partial<BipolarJunctionTransistorData["model"]>
  ) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id)
          return {
            ...node,
            data: { ...node.data, data: { ...watch(), model } }
          };

        return node;
      })
    );
    reset({ ...watch(), model });
  };

  const onClearModel = () => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id)
          return {
            ...node,
            data: { ...node.data, data: { ...watch(), model: undefined } }
          };

        return node;
      })
    );
    reset({ ...watch(), model: undefined });
  };

  return (
    <form
      onSubmit={onSubmit}
      className="w-full p-4 flex flex-col justify-between mt-4 gap-4"
    >
      <Controller<Form>
        name="t_type"
        control={control}
        rules={{
          required: {
            value: true,
            message: "Reference source is required."
          }
        }}
        render={({ field }) => (
          <div className="flex flex-col gap-2">
            <Typography className="text-muted-foreground">
              Transistor type
            </Typography>
            <FieldContainer>
              <Select defaultValue={data.t_type} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Ref source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value={BipolarJunctionTransistorType.Npn}
                    key={BipolarJunctionTransistorType.Npn}
                  >
                    <Typography>
                      {
                        BipolarJunctionTransistorTypeDisplay[
                          BipolarJunctionTransistorType.Npn
                        ]
                      }
                    </Typography>
                  </SelectItem>
                  <SelectItem
                    value={BipolarJunctionTransistorType.Pnp}
                    key={BipolarJunctionTransistorType.Pnp}
                  >
                    <Typography>
                      {
                        BipolarJunctionTransistorTypeDisplay[
                          BipolarJunctionTransistorType.Pnp
                        ]
                      }
                    </Typography>
                  </SelectItem>
                </SelectContent>
              </Select>
            </FieldContainer>
          </div>
        )}
      />

      <Model
        unregister={unregister}
        onSubmit={onSubmitModel}
        onClearModel={onClearModel}
        model={watch("model")}
        register={register}
        handleClose={() => {
          if (isEmpty(data.model)) {
            unregister("model");
          } else {
            reset(data);
          }
        }}
        errors={errors}
      />

      <div className="w-full flex gap-2 items-center justify-end [&>button]:w-[50%] mt-12">
        <Button disabled={!isDirty}>Save</Button>
      </div>
    </form>
  );
};

export default BipolarJunctionTransistorAttributes;
