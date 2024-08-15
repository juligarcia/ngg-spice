import { SpiceNode } from "@/components/context/SpiceContext";
import { Typography } from "@/components/ui/Typography";
import { Input } from "@/components/ui/input";
import { NodeToolbar, Position } from "@xyflow/react";
import clsx from "clsx";
import { FC } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings2 } from "lucide-react";

interface SpiceAttributesProps {
  isVisible?: boolean;
  position: Position;
  component_type: string;
  fields: SpiceNode["fields"];
  id: string;
}

const SpiceAttributes: FC<SpiceAttributesProps> = ({
  isVisible,
  position,
  component_type,
  fields,
  id
}) => {
  return (
    <NodeToolbar id={id} isVisible={isVisible} position={position}>
      <Tabs
        className={clsx("flex gap-2", {
          "flex-col-reverse": position === Position.Top,
          "flex-row": position === Position.Right,
          "flex-col": position === Position.Bottom,
          "flex-row-reverse": position === Position.Left
        })}
      >
        <TabsList
          className={clsx("flex w-fit m-auto shadow-xl", {
            "flex-row":
              position === Position.Top || position === Position.Bottom,
            "flex-col":
              position === Position.Right || position === Position.Left
          })}
        >
          <TabsTrigger value="configuration">
            <Settings2 />
          </TabsTrigger>
        </TabsList>
        <TabsContent value="configuration">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={clsx(
              "p-4 bg-accent backdrop-blur-md rounded-lg w-[350px] shadow-xl"
            )}
          >
            <Typography variant="h4">{component_type}</Typography>
            <div className="w-full mt-6">
              {fields.map(({ name: fieldName }) => (
                <div key={fieldName}>
                  <Input
                    className="mt-2 border-accent"
                    placeholder={fieldName}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </NodeToolbar>
  );
};

export default SpiceAttributes;
