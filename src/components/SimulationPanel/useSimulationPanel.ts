import { Channel, invoke } from "@tauri-apps/api/core";
import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";
import { AppNode, NodeType } from "../Editor/components/canvas/nodes/types";
import { AppEdge } from "../Editor/components/canvas/edges/types";
import {
  SimulationDataPayload,
  SimulationStatusPayload,
  SimulatorError
} from "@/types/simulation";
import { useSimulationStore } from "@/store/simulation";
import {
  ContractEdge,
  ContractNode,
  ContractSimulationsToRun
} from "@/utils/contract";
import toast from "react-hot-toast";
import { getToastMessageFromSimulatorError } from "@/utils/simulation";
import { match, P } from "ts-pattern";

const useSimulationPanel = () => {
  const simulationStatus = useSimulationStore.use.simulationStatus();

  const resetSimulations = useSimulationStore.use.resetSimulations();
  const setValidationError = useSimulationStore.use.setValidationError();
  const clearValidationError = useSimulationStore.use.clearValidationError();

  const updateSimulationStatus =
    useSimulationStore.use.updateSimulationStatus();

  const pushSimulationData = useSimulationStore.use.pushSimulationData();

  const simulationsToRun = useSimulationStore.use.simulationsToRun();

  const { getNodes, getEdges } = useReactFlow<AppNode, AppEdge>();

  const simulate = useCallback(() => {
    const nodes = getNodes();
    const edges = getEdges();

    if (nodes.length === 0) {
      toast.error("No circuit to simulate");
      return;
    }

    toast.success("Starting simulations...");
    clearValidationError();

    const connectionNodes = nodes.filter(
      ({ type }) => type === NodeType.ConnectionNode
    );

    // Map of connection node id to name, we'll use name to accept tags
    const connectionNodesMap = new Map<string, string>(
      connectionNodes.map(({ id, data }) => [id, data.name])
    );

    resetSimulations();

    const dataUpdateChannel = new Channel<SimulationDataPayload>();
    dataUpdateChannel.onmessage = (data) => {
      console.log(data);
      pushSimulationData(data);
    };

    const statusUpdateChannel = new Channel<SimulationStatusPayload>();
    statusUpdateChannel.onmessage = updateSimulationStatus;

    invoke<void>("simulate", {
      nodes: ContractNode.toContract(nodes),
      edges: ContractEdge.toContract(edges, connectionNodesMap),
      config: Object.fromEntries(simulationsToRun) as ContractSimulationsToRun,
      dataUpdateChannel,
      statusUpdateChannel
    })
      .then(() => {
        toast.success("All simulations done!");
      })
      .catch((e: SimulatorError) => {
        toast.error(getToastMessageFromSimulatorError(e), { duration: 5000 });
        match(e)
          .with({ FloatingNode: P.string }, ({ FloatingNode }) => {
            setValidationError(FloatingNode, "Floating port");
          })
          .with(
            { UnconfiguredElement: P.string },
            ({ UnconfiguredElement }) => {
              setValidationError(
                UnconfiguredElement,
                "Element not correctly configured"
              );
            }
          )
          .with(
            { MalformedSimulationConfig: P.string },
            ({ MalformedSimulationConfig }) => {
              setValidationError(
                MalformedSimulationConfig,
                "Simulation not correctly configured"
              );
            }
          );
      });
  }, [simulationsToRun]);

  return {
    simulate,
    simulationStatus,
    simulationsToRun
  };
};

export default useSimulationPanel;
