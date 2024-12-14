import { FC } from "react";
import FlexRenderer from "../components/FlexRenderer";
import { LayoutOptionProps } from "./types";
import { LayoutConfiguration } from "@/store/layout";

const Columns2: FC<LayoutOptionProps> = ({ layoutConfigurations }) => {
  const [left, right] = layoutConfigurations.sort(
    (a, b) => a.order - b.order
  ) as [LayoutConfiguration | undefined, LayoutConfiguration | undefined];

  return (
    <div className="grid w-full h-full grid-cols-2 gap-2">
      {left && <FlexRenderer order={0} layoutConfiguration={left} />}
      {right && <FlexRenderer order={1} layoutConfiguration={right} />}
    </div>
  );
};

export default Columns2;
