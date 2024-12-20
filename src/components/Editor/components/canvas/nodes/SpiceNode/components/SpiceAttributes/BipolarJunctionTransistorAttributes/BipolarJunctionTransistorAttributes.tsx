import {
  BipolarJunctionTransistorData,
  BipolarJunctionTransistorModel
} from "@/components/context/SpiceContext/SpiceContext";
import { FC } from "react";
import { Typography } from "@/components/ui/Typography";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProgramStore } from "@/store/program";
import ModelForm from "./ModelForm";
import PickModel from "./PickModel";

interface BipolarJunctionTransistorAttributesProps {
  data: Partial<BipolarJunctionTransistorData>;
  id: string;
  handleClose(): void;
}

export type Form = BipolarJunctionTransistorModel;

const BipolarJunctionTransistorAttributes: FC<
  BipolarJunctionTransistorAttributesProps
> = ({ data, id, handleClose }) => {
  const bjtModels = useProgramStore.use.bjtModels();

  const exists = bjtModels.some(({ name }) => data.model?.name === name);

  return (
    <div className="w-full p-4 flex flex-col justify-between gap-4">
      <div className="flex flex-col gap-4 w-full">
        <div className="p-4 bg-secondary rounded-lg border-accent">
          <Typography>
            This BJT model is an adaptation of the integral charge control model
            of Gummel and Poon. The model automatically simplifies to the
            simpler Ebers-Moll model when certain parameters are not specified.
          </Typography>
        </div>
        <Tabs className="overflow-hidden flex flex-col" defaultValue="pick">
          <TabsList>
            <TabsTrigger value="form">
              {exists ? "Edit existing model" : "Create from scratch"}
            </TabsTrigger>
            <TabsTrigger value="pick">Pick from database</TabsTrigger>
          </TabsList>
          <TabsContent value="form">
            <ModelForm handleClose={handleClose} id={id} model={data.model} />
          </TabsContent>
          <TabsContent value="pick">
            <PickModel
              currentModel={data.model}
              id={id}
              handleClose={handleClose}
              models={bjtModels}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BipolarJunctionTransistorAttributes;
