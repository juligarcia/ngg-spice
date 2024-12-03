import { FC } from "react";
import { Form } from "./BipolarJunctionTransistorAttributes";
import {
  FieldErrors,
  useForm,
  UseFormRegister,
  UseFormUnregister
} from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Microchip } from "lucide-react";
import {
  BipolarJunctionTransistorData,
  BipolarJunctionTransistorModel
} from "@/components/context/SpiceContext/SpiceContext";
import { Input } from "@/components/ui/input";
import FieldContainer from "@/components/ui/FieldContainer";
import { Units } from "@/constants/units";
import { isUnit } from "@/utils/validations";
import { Typography } from "@/components/ui/Typography";

interface ModelProps {
  register: UseFormRegister<Form>;
  unregister: UseFormUnregister<Form>;
  handleClose(): void;
  errors: FieldErrors<Form>;
  model: BipolarJunctionTransistorData["model"];
  onClearModel(): void;
  onSubmit(model: Partial<BipolarJunctionTransistorData["model"]>): void;
}

type ModelFormProps = Pick<ModelProps, "model" | "onSubmit">;

const ModelForm: FC<ModelFormProps> = ({ model, onSubmit }) => {
  const {
    register,
    formState: { errors, isDirty },
    handleSubmit
  } = useForm<BipolarJunctionTransistorModel>({
    defaultValues: model
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="p-4 bg-secondary rounded-lg border-accent">
        <Typography>
          The bipolar junction transistor model in NGSpice is an adaptation of
          the integral charge control model of Gummel and Poon. This modified
          Gummel-Poon model extends the original model to include several
          effects at high bias levels. The model automatically simplifies to the
          simpler Ebers-Moll model when certain parameters are not specified.
        </Typography>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <FieldContainer error={errors["name"]} postfix={Units.Unitless}>
          <Input
            defaultValue={model?.name}
            placeholder="Model name"
            {...register("name", {
              required: { value: true, message: "Model name is required" }
            })}
          />
        </FieldContainer>
        <FieldContainer
          tooltip="Transport saturation current"
          error={errors["is"]}
          postfix={Units.Current}
        >
          <Input
            defaultValue={model?.is}
            placeholder="IS"
            {...register("is", {
              setValueAs: (value) => value || undefined,
              validate: {
                isUnit: isUnit("current")
              }
            })}
          />
        </FieldContainer>
        <FieldContainer
          tooltip="IS temperature effect exponent"
          error={errors["xti"]}
          postfix={Units.Unitless}
        >
          <Input
            defaultValue={model?.xti}
            placeholder="XTI"
            {...register("xti", {
              setValueAs: (value) => value || undefined,
              validate: {
                isUnit: isUnit("coefficient")
              }
            })}
          />
        </FieldContainer>
        <FieldContainer
          tooltip="Bandgap voltage"
          error={errors["eg"]}
          postfix={Units.ElectronVolt}
        >
          <Input
            defaultValue={model?.eg}
            placeholder="EG"
            {...register("eg", {
              setValueAs: (value) => value || undefined,
              validate: {
                isUnit: isUnit("bandgap")
              }
            })}
          />
        </FieldContainer>
        <FieldContainer
          tooltip="Forward Early voltage"
          error={errors["vaf"]}
          postfix={Units.Voltage}
        >
          <Input
            defaultValue={model?.vaf}
            placeholder="VAF"
            {...register("vaf", {
              setValueAs: (value) => value || undefined,
              validate: {
                isUnit: isUnit("voltage")
              }
            })}
          />
        </FieldContainer>
        <FieldContainer
          postfix={Units.Unitless}
          tooltip="Ideal maximum forward beta"
          error={errors["bf"]}
        >
          <Input
            defaultValue={model?.bf}
            placeholder="BF"
            {...register("bf", {
              setValueAs: (value) => value || undefined,
              validate: {
                isUnit: isUnit("coefficient")
              }
            })}
          />
        </FieldContainer>
        <FieldContainer
          tooltip="Base-emitter leakage saturation current"
          error={errors["ise"]}
          postfix={Units.Current}
        >
          <Input
            defaultValue={model?.ise}
            placeholder="ISE"
            {...register("ise", {
              setValueAs: (value) => value || undefined,
              validate: {
                isUnit: isUnit("current")
              }
            })}
          />
        </FieldContainer>
        <FieldContainer
          postfix={Units.Unitless}
          tooltip="Base-emitter leakage emission coefficient"
          error={errors["ne"]}
        >
          <Input
            defaultValue={model?.ne}
            placeholder="NE"
            {...register("ne", {
              setValueAs: (value) => value || undefined,
              validate: {
                isUnit: isUnit("coefficient")
              }
            })}
          />
        </FieldContainer>
        <FieldContainer
          tooltip="Corner for forward-beta high-current roll-off"
          error={errors["ikf"]}
          postfix={Units.Current}
        >
          <Input
            defaultValue={model?.ikf}
            placeholder="IKF"
            {...register("ikf", {
              setValueAs: (value) => value || undefined,
              validate: {
                isUnit: isUnit("coefficient")
              }
            })}
          />
        </FieldContainer>
        <FieldContainer
          tooltip="High-current roll-off coefficient"
          error={errors["nk"]}
          postfix={Units.Unitless}
        >
          <Input
            defaultValue={model?.nk}
            placeholder="NK"
            {...register("nk", {
              setValueAs: (value) => value || undefined,
              validate: {
                isUnit: isUnit("coefficient")
              }
            })}
          />
        </FieldContainer>
        <FieldContainer
          tooltip="Forward and reverse beta temperature coefficient"
          error={errors["xtb"]}
          postfix={Units.Unitless}
        >
          <Input
            defaultValue={model?.xtb}
            placeholder="XTB"
            {...register("xtb", {
              setValueAs: (value) => value || undefined,
              validate: {
                isUnit: isUnit("coefficient")
              }
            })}
          />
        </FieldContainer>
        <FieldContainer
          postfix={Units.Unitless}
          tooltip="Ideal maximum reverse beta"
          error={errors["br"]}
        >
          <Input
            defaultValue={model?.br}
            placeholder="BR"
            {...register("br", {
              setValueAs: (value) => value || undefined,
              validate: {
                isUnit: isUnit("coefficient")
              }
            })}
          />
        </FieldContainer>
        <FieldContainer
          tooltip="Base-collector leakage saturation current"
          error={errors["isc"]}
          postfix={Units.Current}
        >
          <Input
            defaultValue={model?.isc}
            placeholder="ISC"
            {...register("isc", {
              setValueAs: (value) => value || undefined,
              validate: {
                isUnit: isUnit("current")
              }
            })}
          />
        </FieldContainer>
        <FieldContainer
          tooltip="Base-collector leakage emission coefficient"
          error={errors["nc"]}
          postfix={Units.Unitless}
        >
          <Input
            defaultValue={model?.nc}
            placeholder="NC"
            {...register("nc", {
              setValueAs: (value) => value || undefined,
              validate: {
                isUnit: isUnit("coefficient")
              }
            })}
          />
        </FieldContainer>
        <FieldContainer
          postfix={Units.Current}
          tooltip="Corner for reverse-beta high-current roll-off"
          error={errors["ikr"]}
        >
          <Input
            defaultValue={model?.ikr}
            placeholder="IKR"
            {...register("ikr", {
              setValueAs: (value) => value || undefined,
              validate: {
                isUnit: isUnit("current")
              }
            })}
          />
        </FieldContainer>
        <FieldContainer
          postfix={Units.Resistance}
          tooltip="Collector ohmic resistance"
          error={errors["rc"]}
        >
          <Input
            defaultValue={model?.rc}
            placeholder="RC"
            {...register("rc", {
              setValueAs: (value) => value || undefined,
              validate: {
                isUnit: isUnit("resistance")
              }
            })}
          />
        </FieldContainer>
        <FieldContainer
          postfix={Units.Capacitance}
          tooltip="Base-collector zero-bias capacitance"
          error={errors["cjc"]}
        >
          <Input
            defaultValue={model?.cjc}
            placeholder="CJC"
            {...register("cjc", {
              setValueAs: (value) => value || undefined,
              validate: {
                isUnit: isUnit("capacitance")
              }
            })}
          />
        </FieldContainer>
        <FieldContainer
          tooltip="Base-collector grading factor"
          error={errors["mjc"]}
          postfix={Units.Unitless}
        >
          <Input
            defaultValue={model?.mjc}
            placeholder="MJC"
            {...register("mjc", {
              setValueAs: (value) => value || undefined,
              validate: {
                isUnit: isUnit("coefficient")
              }
            })}
          />
        </FieldContainer>
        <FieldContainer
          postfix={Units.Voltage}
          tooltip="Base-collector built-in potential"
          error={errors["vjc"]}
        >
          <Input
            defaultValue={model?.vjc}
            placeholder="VJC"
            {...register("vjc", {
              setValueAs: (value) => value || undefined,
              validate: {
                isUnit: isUnit("voltage")
              }
            })}
          />
        </FieldContainer>
        <FieldContainer
          postfix={Units.Time}
          tooltip="Ideal reverse transit time"
          error={errors["tr"]}
        >
          <Input
            defaultValue={model?.tr}
            placeholder="TR"
            {...register("tr", {
              setValueAs: (value) => value || undefined,
              validate: {
                isUnit: isUnit("time")
              }
            })}
          />
        </FieldContainer>
        <FieldContainer
          postfix={Units.Time}
          tooltip="Ideal forward transit time"
          error={errors["tf"]}
        >
          <Input
            defaultValue={model?.tf}
            placeholder="TF"
            {...register("tf", {
              setValueAs: (value) => value || undefined,
              validate: {
                isUnit: isUnit("time")
              }
            })}
          />
        </FieldContainer>
        <FieldContainer
          postfix={Units.Current}
          tooltip="Transit time dependency on Ic"
          error={errors["itf"]}
        >
          <Input
            defaultValue={model?.itf}
            placeholder="ITF"
            {...register("itf", {
              setValueAs: (value) => value || undefined,
              validate: {
                isUnit: isUnit("current")
              }
            })}
          />
        </FieldContainer>
        <FieldContainer
          tooltip="Transit time bias dependence coefficient"
          error={errors["xtf"]}
          postfix={Units.Unitless}
        >
          <Input
            defaultValue={model?.xtf}
            placeholder="XTF"
            {...register("xtf", {
              setValueAs: (value) => value || undefined,
              validate: {
                isUnit: isUnit("coefficient")
              }
            })}
          />
        </FieldContainer>
        <FieldContainer
          postfix={Units.Voltage}
          tooltip="Transit time dependency on Vbc"
          error={errors["vtf"]}
        >
          <Input
            defaultValue={model?.vtf}
            placeholder="VTF"
            {...register("vtf", {
              setValueAs: (value) => value || undefined,
              validate: {
                isUnit: isUnit("voltage")
              }
            })}
          />
        </FieldContainer>
        <FieldContainer
          postfix={Units.Resistance}
          tooltip="Zero-bias (maximum) base resistance"
          error={errors["rb"]}
        >
          <Input
            defaultValue={model?.rb}
            placeholder="RB"
            {...register("rb", {
              setValueAs: (value) => value || undefined,
              validate: {
                isUnit: isUnit("resistance")
              }
            })}
          />
        </FieldContainer>
      </div>
      <div className="flex w-full flex-row-reverse">
        <Button
          disabled={!isDirty}
          onClick={handleSubmit(onSubmit)}
          className="w-[150px]"
        >
          Save model
        </Button>
      </div>
    </div>
  );
};

export const Model: FC<ModelProps> = ({ model, onSubmit, onClearModel }) => {
  return (
    <div className="flex flex-col gap-2">
      <Typography className="text-muted-foreground">
        Transistor model
      </Typography>
      <div className="flex gap-2 flex-col w-full border border-muted-foreground/30 p-2 rounded-lg">
        <Dialog>
          <DialogTrigger className="w-full">
            <Button className="w-full" type="button">
              <div className="flex items-center gap-1">
                <Typography>Edit model</Typography>
                <Microchip size={20} />
              </div>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{`Bipolar Junction Transistor Model${
                model?.name ? ` ${model.name}` : ""
              }`}</DialogTitle>
              <DialogDescription className="pt-4">
                <ModelForm onSubmit={onSubmit} model={model} />
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <Button
          onClick={onClearModel}
          className="w-full"
          type="button"
          variant="ghost"
        >
          Clear model
        </Button>
      </div>
    </div>
  );
};

export default Model;
