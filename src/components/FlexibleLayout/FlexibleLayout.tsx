import { useLayoutStore } from "@/store/layout";
import { LayoutOption } from "@/types/layout";
import clsx from "clsx";
import { FC } from "react";
import { match } from "ts-pattern";
import Grid2x2 from "./options/Grid2x2";
import Columns2 from "./options/Columns2";
import Columns3 from "./options/Columns3";
import Rows2 from "./options/Rows2";
import Focus from "./options/Focus";

export interface FlexibleLayoutProps {
  className?: string;
}

const FlexibleLayout: FC<FlexibleLayoutProps> = ({ className }) => {
  const layoutType = useLayoutStore.use.layoutType();
  const layoutConfigurations = useLayoutStore.use.layoutConfigurations();

  return (
    <div
      className={clsx(
        "flex grow h-full w-full min-h-0 min-w-0 overflow-hidden",
        className
      )}
    >
      {match(layoutType)
        .with(LayoutOption.Grid2x2, () => (
          <Grid2x2 layoutConfigurations={layoutConfigurations} />
        ))
        .with(LayoutOption.Columns2, () => (
          <Columns2 layoutConfigurations={layoutConfigurations} />
        ))
        .with(LayoutOption.Columns3, () => (
          <Columns3 layoutConfigurations={layoutConfigurations} />
        ))
        .with(LayoutOption.Rows2, () => (
          <Rows2 layoutConfigurations={layoutConfigurations} />
        ))
        .with(LayoutOption.Focus, () => (
          <Focus layoutConfigurations={layoutConfigurations} />
        ))
        .otherwise(() => null)}
    </div>
  );
};

export default FlexibleLayout;
