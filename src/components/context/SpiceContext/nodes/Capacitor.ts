import { SpiceInstanceName, SpiceNodeDefinition } from "../SpiceContext";
import NodeSymbol from "@/assets/nodes/capacitor.svg?react";

export const Capacitor: SpiceNodeDefinition = {
  instance_name: SpiceInstanceName.Capacitor,
  symbol: NodeSymbol,

  dimensions: {
    width: 120,
    height: 60
  },

  left_ports: [{ name: "0", x: 0, y: 30 }],
  right_ports: [{ name: "1", x: 120, y: 30 }],

  top_ports: [],
  bottom_ports: []
};
