import { FC } from "react";
import FlexRenderer from "../components/FlexRenderer";
import { LayoutOptionProps } from "./types";
import { LayoutConfiguration } from "@/store/layout";

const Grid2x2: FC<LayoutOptionProps> = ({ layoutConfigurations }) => {
  const [topLeft, topRight, bottomLeft, bottomRight] =
    layoutConfigurations.sort((a, b) => a.order - b.order) as [
      LayoutConfiguration | undefined,
      LayoutConfiguration | undefined,
      LayoutConfiguration | undefined,
      LayoutConfiguration | undefined
    ];

  return (
    <div className="grid w-full h-full grid-cols-2 grid-rows-2 gap-2">
      {topLeft && <FlexRenderer order={0} layoutConfiguration={topLeft} />}
      {topRight && <FlexRenderer order={1} layoutConfiguration={topRight} />}
      {bottomLeft && (
        <FlexRenderer order={2} layoutConfiguration={bottomLeft} />
      )}
      {bottomRight && (
        <FlexRenderer order={3} layoutConfiguration={bottomRight} />
      )}
    </div>
  );
};

export default Grid2x2;
