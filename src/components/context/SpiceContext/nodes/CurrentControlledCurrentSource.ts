import { SpiceInstanceName, SpiceNodeDefinition } from "../SpiceContext";
import NodeSymbol from "@/assets/nodes/current_controlled_current_source.svg?react";

export const CurrentControlledCurrentSource: SpiceNodeDefinition = {
  instance_name: SpiceInstanceName.ICIS,
  symbol: NodeSymbol,

  dimensions: {
    width: 240,
    height: 240
  },

  left_ports: [],
  right_ports: [
    { name: "1", x: 240, y: 60 },
    { name: "0", x: 240, y: 180 }
  ],

  top_ports: [],
  bottom_ports: []
};