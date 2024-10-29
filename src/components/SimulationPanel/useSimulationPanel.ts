import { invoke } from "@tauri-apps/api/core";
import { useReactFlow } from "@xyflow/react";
import { useCallback, useEffect } from "react";
import { match } from "ts-pattern";
import { AppNode, NodeType } from "../Editor/components/nodes/types";
import { AppEdge } from "../Editor/components/edges/types";
import { listen } from "@tauri-apps/api/event";
import { SimulationStatus } from "@/types/simulation";
import { useSimulationStore } from "@/store/simulation";

const useSimulationPanel = () => {
  const simulationStatus = useSimulationStore.use.simulationStatus();

  const resetSimulationStatus = useSimulationStore.use.resetSimulationStatus();
  const updateSimulationStatus =
    useSimulationStore.use.updateSimulationStatus();

  const simulationsToRun = useSimulationStore.use.simulationsToRun();

  const { getNodes, getEdges } = useReactFlow<AppNode, AppEdge>();

  useEffect(() => {
    const will_be_unlisten = listen<SimulationStatus>(
      "simulation_status_update",
      (event) => {
        updateSimulationStatus(event.payload);
      }
    );

    return () => {
      will_be_unlisten.then((unlisten) => unlisten());
    };
  }, []);

  const simulate = useCallback(() => {
    const nodes = getNodes();
    const edges = getEdges();

    resetSimulationStatus();

    invoke<void>("simulate", {
      nodes: nodes.map((node) => ({
        id: node.id,
        ...match(node)
          .with({ type: NodeType.Spice }, ({ data }) => ({
            data: {
              [data.instance_name]: { ...data.data, name: data.name }
            }
          }))
          .otherwise(() => ({
            data: { Node: {} }
          }))
      })),
      edges: edges.map(({ source, target }) => ({ source, target })),
      config: simulationsToRun
    });
  }, [simulationsToRun]);

  return {
    simulate,
    simulationStatus
  };
};

export default useSimulationPanel;
