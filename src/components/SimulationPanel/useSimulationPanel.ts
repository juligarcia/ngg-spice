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
import {
  ContractEdge,
  ContractNode,
  ContractSimulationsToRun
} from "@/utils/contract";

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

    const connectionNodes = nodes.filter(
      ({ type }) => type === NodeType.ConnectionNode
    );

    // Map of connection node id to name, we'll use name to accept tags
    const connectionNodesMap = new Map<string, string>(
      connectionNodes.map(({ id, data }) => [id, data.name])
    );

    resetSimulations();

    const params = {
      nodes: nodes.map(
        (node) =>
          ({
            id: node.id,
            ...match(node)
              .with({ type: NodeType.Spice }, ({ data, position }) => ({
                data: {
                  [data.instance_name]: {
                    ...data.data,
                    name: data.name,
                    position
                  }
                }
              }))
              .otherwise(({ position, data }) => ({
                data: { Node: { position, name: data.name } }
              }))
          } as ContractNode)
      ),
      edges: edges.map(
        ({ target, sourceHandle, source }) =>
          ({
            source,
            source_port: sourceHandle,
            // Interchange the target (connection node) id with its name for tag functionality
            target: connectionNodesMap.get(target)
          } as ContractEdge)
      ),
      config: simulationsToRun as ContractSimulationsToRun
    };

    invoke<void>("simulate", params);
  }, [simulationsToRun]);

  return {
    simulate,
    simulationStatus
  };
};

export default useSimulationPanel;
