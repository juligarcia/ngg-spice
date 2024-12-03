import { SpiceInstanceName, SpiceNodeDefinition } from "../SpiceContext";
import NodeSymbol from "@/assets/nodes/ground.svg?react";

export const Ground: SpiceNodeDefinition = {
  instance_name: SpiceInstanceName.Ground,
  symbol: NodeSymbol,

  dimensions: {
    width: 60,
    height: 60
  },

  top_ports: [
    {
      x: 30,
      y: 0
    }
  ],
  right_ports: [],
  bottom_ports: [],
  left_ports: []
};
