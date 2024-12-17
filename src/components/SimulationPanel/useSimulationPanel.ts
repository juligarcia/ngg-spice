import { invoke } from "@tauri-apps/api/core";
import { useReactFlow } from "@xyflow/react";
import { useCallback, useEffect } from "react";
import { match } from "ts-pattern";
import { AppNode, NodeType } from "../Editor/components/canvas/nodes/types";
import { AppEdge } from "../Editor/components/canvas/edges/types";
import { listen } from "@tauri-apps/api/event";
import {
  SimulationDataPayload,
  SimulationListenerTag,
  SimulationStatusPayload
} from "@/types/simulation";
import { useSimulationStore } from "@/store/simulation";

const useSimulationPanel = () => {
  const simulationStatus = useSimulationStore.use.simulationStatus();

  const resetSimulations = useSimulationStore.use.resetSimulations();

  const updateSimulationStatus =
    useSimulationStore.use.updateSimulationStatus();

  const pushSimulationData = useSimulationStore.use.pushSimulationData();

  const simulationsToRun = useSimulationStore.use.simulationsToRun();

  const { getNodes, getEdges } = useReactFlow<AppNode, AppEdge>();

  useEffect(() => {
    const will_be_unlisten = listen<SimulationStatusPayload>(
      SimulationListenerTag.StatusUpdate,
      (event) => {
        updateSimulationStatus(event.payload);
      }
    );

    return () => {
      will_be_unlisten.then((unlisten) => unlisten());
    };
  }, []);

  useEffect(() => {
    const will_be_unlisten = listen<SimulationDataPayload>(
      SimulationListenerTag.DataPush,
      (event) => {
        pushSimulationData(event.payload);
      }
    );

    return () => {
      will_be_unlisten.then((unlisten) => unlisten());
    };
  }, []);

  const simulate = useCallback(() => {
    const nodes = getNodes();
    const edges = getEdges();

    resetSimulations();

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
      edges: edges.map(({ target, sourceHandle, source }) => ({
        source,
        source_port: sourceHandle,
        target
      })),
      config: simulationsToRun
    });
  }, [simulationsToRun]);

  return {
    simulate,
    simulationStatus
  };
};

export default useSimulationPanel;
