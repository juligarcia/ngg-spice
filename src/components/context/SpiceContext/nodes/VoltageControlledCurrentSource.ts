import { SpiceInstanceName, SpiceNodeDefinition } from "../SpiceContext";
import NodeSymbol from "@/assets/nodes/voltage_controlled_current_source.svg?react";

export const VoltageControlledCurrentSource: SpiceNodeDefinition = {
  instance_name: SpiceInstanceName.VCIS,
  symbol: NodeSymbol,

  dimensions: {
    width: 240,
    height: 240
  },

  left_ports: [
    { name: "3", x: 0, y: 60 },
    { name: "2", x: 0, y: 180 }
  ],
  right_ports: [
    { name: "0", x: 240, y: 60 },
    { name: "1", x: 240, y: 180 }
  ],

  top_ports: [],
  bottom_ports: []
};