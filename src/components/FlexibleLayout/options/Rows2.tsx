import { FC } from "react";
import { LayoutOptionProps } from "./types";
import { LayoutConfiguration } from "@/store/layout";
import FlexRenderer from "../components/FlexRenderer";

const Rows2: FC<LayoutOptionProps> = ({ layoutConfigurations }) => {
  const [top, bottom] = layoutConfigurations.sort(
    (a, b) => a.order - b.order
  ) as [LayoutConfiguration | undefined, LayoutConfiguration | undefined];

  return (
    <div className="grid w-full h-full grid-rows-2 gap-2">
      {top && <FlexRenderer order={0} layoutConfiguration={top} />}
      {bottom && <FlexRenderer order={1} layoutConfiguration={bottom} />}
    </div>
  );
};

export default Rows2;
