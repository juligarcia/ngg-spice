import { LayoutOption } from "@/types/layout";
import { ComponentType } from "react";

import {
  Columns2,
  Columns3,
  Grid2x2,
  LucideProps,
  Rows2,
  Square
} from "lucide-react";

export const LAYOUT_OPTION_ICON_MAPPER: Record<
  LayoutOption,
  ComponentType<LucideProps>
> = {
  [LayoutOption.Grid2x2]: Grid2x2,
  [LayoutOption.Columns2]: Columns2,
  [LayoutOption.Columns3]: Columns3,
  [LayoutOption.Rows2]: Rows2,
  [LayoutOption.Focus]: Square
};

export const LayoutOptionDisplay = {
  [LayoutOption.Columns2]: "2 Columns",
  [LayoutOption.Columns3]: "3 Columns",
  [LayoutOption.Grid2x2]: "2x2 Grid",
  [LayoutOption.Rows2]: "2 Rows",
  [LayoutOption.Focus]: "Focus"
};
