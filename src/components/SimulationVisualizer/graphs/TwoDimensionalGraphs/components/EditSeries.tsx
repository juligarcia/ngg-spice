import { FC } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Series } from "../LinearGraph/LinearGraph";
import { Controller, useForm } from "react-hook-form";
import FieldContainer from "@/components/ui/FieldContainer";
import { Input } from "@/components/ui/input";
import { HexColorPicker } from "react-colorful";
import { Button } from "@/components/ui/Button";

interface EditSeriesProps {
  series: Series;
  updateSeries(updatedSeries: Partial<Series>): void;
  handleClose(): void;
}

type Form = Pick<Series, "color" | "strokeWidth">;

const EditSeries: FC<EditSeriesProps> = ({
  series,
  updateSeries,
  handleClose
}) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<Form>({
    defaultValues: series
  });

  console.log(errors);

  return (
    <DialogContent className="w-[400px]">
      <DialogHeader>
        <DialogTitle>{`Editing ${series.accessor}`}</DialogTitle>
        <DialogDescription className="pt-4">
          <form
            className="pt-4 flex flex-col items-center gap-4"
            onSubmit={handleSubmit((newSeries) => {
              updateSeries(newSeries);
              handleClose();
            })}
          >
            <FieldContainer>
              <Controller<Form>
                control={control}
                name="color"
                render={({ field }) => (
                  <HexColorPicker
                    color={field.value as string}
                    onChange={field.onChange}
                  />
                )}
              />
            </FieldContainer>
            <FieldContainer
              prefix="Stroke width *"
              error={errors["strokeWidth"]}
            >
              <Input
                {...register("strokeWidth", {
                  valueAsNumber: true,
                  max: {
                    value: 20,
                    message: "20 is the maximum stroke width"
                  },
                  validate: {
                    isNotNan: (value) => !isNaN(value) || "Invalid stroke width"
                  }
                })}
              />
            </FieldContainer>
            <div className="w-full flex justify-end">
              <Button className="w-28">Save</Button>
            </div>
          </form>
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  );
};

export default EditSeries;
