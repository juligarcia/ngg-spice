import { SpiceInstanceName, SpiceNodeDefinition } from "../SpiceContext";
import NodeSymbol from "@/assets/nodes/current_source.svg?react";

export const CurrentSource: SpiceNodeDefinition = {
  instance_name: SpiceInstanceName.CurrentSource,
  symbol: NodeSymbol,

  dimensions: {
    width: 100,
    height: 100
  },

  left_ports: [],
  right_ports: [],

  top_ports: [{ name: "0", x: 50, y: 0 }],
  bottom_ports: [{ name: "1", x: 50, y: 100 }]
};
