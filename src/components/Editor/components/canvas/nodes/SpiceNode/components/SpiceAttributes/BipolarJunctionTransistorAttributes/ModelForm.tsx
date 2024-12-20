import {
  BipolarJunctionTransistorModel,
  BipolarJunctionTransistorPolarity,
  BipolarJunctionTransistorPolarityDisplay
} from "@/components/context/SpiceContext/SpiceContext";
import { Typography } from "@/components/ui/Typography";
import { useReactFlow } from "@xyflow/react";
import { FC, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useProgramStore } from "@/store/program";
import { isUnit } from "@/utils/validations";
import FieldContainer from "@/components/ui/FieldContainer";
import { Input } from "@/components/ui/input";
import { Units } from "@/constants/units";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/Button";
import { AppNode } from "../../../../types";
import { AppEdge } from "@/components/Editor/components/canvas/edges/types";
import { invoke } from "@tauri-apps/api/core";
import toast from "react-hot-toast";

export type Form = BipolarJunctionTransistorModel;

interface ModelFormProps {
  id: string;
  model?: Partial<BipolarJunctionTransistorModel>;
  handleClose(): void;
}

const ModelForm: FC<ModelFormProps> = ({ id, model, handleClose }) => {
  const { setNodes } = useReactFlow<AppNode, AppEdge>();

  const [maybeModel, setMaybeModel] = useState("");

  const bjtModels = useProgramStore.use.bjtModels();
  const updateBjtModel = useProgramStore.use.updateBjtModel();

  const {
    formState: { isDirty, errors },
    register,
    reset,
    watch,
    handleSubmit,
    control
  } = useForm<Form>();

  const exists = bjtModels.some(({ name }) => watch("name") === name);

  // Only uses the model
  const onUse = handleSubmit((model) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          const bjtNode = {
            ...node,
            data: {
              ...node.data,
              data: { model }
            }
          } as AppNode;

          return bjtNode;
        }

        return node;
      })
    );
    reset(model);
    handleClose();
  });

  // Updates the model in the DB and later uses it
  const onSaveAndUse = handleSubmit((model) => {
    invoke<void>("save_bjt_model", { model }).then(() => {
      updateBjtModel(model);
      setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === id) {
            const bjtNode = {
              ...node,
              data: {
                ...node.data,
                data: { model }
              }
            } as AppNode;

            return bjtNode;
          }

          return node;
        })
      );
      reset(model);
      handleClose();
    });
  });

  return (
    <>
      <div className="flex items-center gap-4 w-full mb-6 px-1">
        <Input
          placeholder=".MODEL"
          onChange={(e) => setMaybeModel(e.currentTarget.value)}
        />
        <Button
          onClick={() => {
            invoke<BipolarJunctionTransistorModel | null>(
              "parse_bjt_model_directive",
              { maybeModelDirective: maybeModel }
            ).then((maybeModel) => {
              if (maybeModel) reset(maybeModel);
              else toast.error("Invalid prompt");
            });
          }}
          disabled={!maybeModel}
        >
          Parse
        </Button>
      </div>
      <form onSubmit={onSaveAndUse} className="flex flex-col gap-4 w-full px-1">
        <div className="grid grid-cols-3 gap-2">
          <Controller
            name="polarity"
            control={control}
            defaultValue={model?.polarity}
            rules={{
              required: {
                value: true,
                message: "BJT polarity source is required."
              }
            }}
            render={({ field }) => (
              <FieldContainer>
                <Select
                  value={field.value}
                  defaultValue={model?.polarity}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Polarity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value={BipolarJunctionTransistorPolarity.Npn}
                      key={BipolarJunctionTransistorPolarity.Npn}
                    >
                      <Typography>
                        {
                          BipolarJunctionTransistorPolarityDisplay[
                            BipolarJunctionTransistorPolarity.Npn
                          ]
                        }
                      </Typography>
                    </SelectItem>
                    <SelectItem
                      value={BipolarJunctionTransistorPolarity.Pnp}
                      key={BipolarJunctionTransistorPolarity.Pnp}
                    >
                      <Typography>
                        {
                          BipolarJunctionTransistorPolarityDisplay[
                            BipolarJunctionTransistorPolarity.Pnp
                          ]
                        }
                      </Typography>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FieldContainer>
            )}
          />

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
        <div className="flex w-full justify-end gap-2">
          <Button
            onClick={onUse}
            variant="ghost"
            role="button"
            disabled={!isDirty}
          >
            Use
          </Button>
          <Button disabled={!isDirty}>
            {exists ? "Update & Use model" : "Save & Use model"}
          </Button>
        </div>
      </form>
    </>
  );
};

export default ModelForm;
