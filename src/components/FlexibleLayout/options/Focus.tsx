import { FC } from "react";
import FlexRenderer from "../components/FlexRenderer";
import { LayoutOptionProps } from "./types";
import { LayoutConfiguration } from "@/store/layout";

const Focus: FC<LayoutOptionProps> = ({ layoutConfigurations }) => {
  const [focus] = layoutConfigurations.sort((a, b) => a.order - b.order) as [
    LayoutConfiguration | undefined
  ];

  return (
    <div className="flex flex-col w-full h-full grow">
      {focus && <FlexRenderer order={0} layoutConfiguration={focus} />}
    </div>
  );
};

export default Focus;
