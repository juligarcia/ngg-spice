import {
  BipolarJunctionTransistorPolarity,
  SpiceInstanceName,
  SpiceNodeDefinition
} from "../SpiceContext";
import NpnNodeSymbol from "@/assets/nodes/bipolar_junction_transistor_npn.svg?react";
import PnpNodeSymbol from "@/assets/nodes/bipolar_junction_transistor_pnp.svg?react";

export const BipolarJunctionTransistor: SpiceNodeDefinition = {
  instance_name: SpiceInstanceName.BJT,
  symbol: {
    key: "model.polarity",
    variants: {
      [BipolarJunctionTransistorPolarity.Npn]: NpnNodeSymbol,
      [BipolarJunctionTransistorPolarity.Pnp]: PnpNodeSymbol,
      default: NpnNodeSymbol
    }
  },
  dimensions: { width: 120, height: 120 },

  top_ports: [{ name: "0", x: 70, y: 0 }],
  right_ports: [],
  bottom_ports: [{ name: "2", x: 70, y: 120 }],
  left_ports: [{ name: "1", x: 0, y: 60 }]
};
