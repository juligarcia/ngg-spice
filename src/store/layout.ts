import { create } from "zustand";
import { createSelectors } from "@/utils/zustand";
import { LayoutOption } from "@/types/layout";
import { match } from "ts-pattern";

type BaseLayoutConfiguration = {
  order: number;
};

type TypeBasedLayoutConfiguration =
  | {
      type: "editor";
    }
  | { type: "visualizer"; simulationId?: string }
  | { type: "picker" };

export type LayoutConfiguration = BaseLayoutConfiguration &
  TypeBasedLayoutConfiguration;

interface LayoutStore {
  layoutType: LayoutOption;
  setLayout(newLayoutOption: LayoutOption): void;

  layoutConfigurations: Array<LayoutConfiguration>;
  changeTypeByOrder(newLayoutConfiguration: LayoutConfiguration): void;

  updateConfiguration(
    order: number,
    updatedInformation: TypeBasedLayoutConfiguration
  ): void;
}

const useLayoutStoreBase = create<LayoutStore>((set) => ({
  layoutType: LayoutOption.Focus,
  setLayout: (newLayoutOption) => {
    set((state) => {
      const createFallback = (order: number): LayoutConfiguration => ({
        type: "picker",
        order
      });

      const [maybe0, maybe1, maybe2, maybe3] = [
        ...state.layoutConfigurations
      ] as Array<LayoutConfiguration | undefined>;

      const configuration0 = maybe0 || createFallback(0);
      const configuration1 = maybe1 || createFallback(1);
      const configuration2 = maybe2 || createFallback(2);
      const configuration3 = maybe3 || createFallback(3);

      return {
        layoutConfigurations: match(newLayoutOption)
          .with(LayoutOption.Focus, () => [configuration0])
          .with(LayoutOption.Columns2, () => [configuration0, configuration1])
          .with(LayoutOption.Columns3, () => [
            configuration0,
            configuration1,
            configuration2
          ])
          .with(LayoutOption.Rows2, () => [configuration0, configuration1])
          .with(LayoutOption.Grid2x2, () => [
            configuration0,
            configuration1,
            configuration2,
            configuration3
          ])
          .run(),
        layoutType: newLayoutOption
      };
    });
  },

  layoutConfigurations: [{ type: "editor", order: 0 }],

  changeTypeByOrder: (newLayoutConfiguration) => {
    set((state) => {
      state.layoutConfigurations[newLayoutConfiguration.order] =
        newLayoutConfiguration;

      return { layoutConfigurations: [...state.layoutConfigurations] };
    });
  },

  updateConfiguration: (order, updatedInformation) => {
    set((state) => {
      state.layoutConfigurations[order] = {
        ...state.layoutConfigurations[order],
        ...updatedInformation
      };

      return { layoutConfigurations: [...state.layoutConfigurations] };
    });
  }
}));

export const useLayoutStore = createSelectors(useLayoutStoreBase);
