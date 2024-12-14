import { FC } from "react";
import { LayoutOptionProps } from "./types";
import { LayoutConfiguration } from "@/store/layout";
import FlexRenderer from "../components/FlexRenderer";

const Columns3: FC<LayoutOptionProps> = ({ layoutConfigurations }) => {
  const [left, middle, right] = layoutConfigurations.sort(
    (a, b) => a.order - b.order
  ) as [
    LayoutConfiguration | undefined,
    LayoutConfiguration | undefined,
    LayoutConfiguration | undefined
  ];

  return (
    <div className="grid w-full h-full grid-cols-3 gap-2">
      {left && <FlexRenderer order={0} layoutConfiguration={left} />}
      {middle && <FlexRenderer order={1} layoutConfiguration={middle} />}
      {right && <FlexRenderer order={2} layoutConfiguration={right} />}
    </div>
  );
};

export default Columns3;
