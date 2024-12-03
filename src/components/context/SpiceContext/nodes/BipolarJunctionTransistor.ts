import {
  BipolarJunctionTransistorType,
  SpiceInstanceName,
  SpiceNodeDefinition
} from "../SpiceContext";
import NpnNodeSymbol from "@/assets/nodes/bipolar_junction_transistor_npn.svg?react";
import PnpNodeSymbol from "@/assets/nodes/bipolar_junction_transistor_pnp.svg?react";

export const BipolarJunctionTransistor: SpiceNodeDefinition = {
  instance_name: SpiceInstanceName.BJT,
  symbol: {
    key: "type",
    variants: {
      [BipolarJunctionTransistorType.Npn]: NpnNodeSymbol,
      [BipolarJunctionTransistorType.Pnp]: PnpNodeSymbol,
      default: NpnNodeSymbol
    }
  },
  dimensions: { width: 120, height: 120 },

  top_ports: [{ name: "0c", x: 70, y: 0 }],
  right_ports: [],
  bottom_ports: [{ name: "2e", x: 70, y: 120 }],
  left_ports: [{ name: "1b", x: 0, y: 60 }]
};
