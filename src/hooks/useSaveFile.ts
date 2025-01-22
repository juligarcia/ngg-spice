import { AppEdge } from "@/components/Editor/components/canvas/edges/types";
import {
  AppNode,
  NodeType
} from "@/components/Editor/components/canvas/nodes/types";
import { useSimulationStore } from "@/store/simulation";
import {
  ContractEdge,
  ContractNode,
  ContractSimulationsToRun
} from "@/utils/contract";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { useReactFlow } from "@xyflow/react";
import { useEffect } from "react";

type CanvasDataRequest = {
  filePath: string;
};

type SaveFile = {
  nodes: ContractNode[];
  edges: ContractEdge[];
  config: ContractSimulationsToRun;
  filePath: string;
};

const useSaveFile = () => {
  const { getEdges, getNodes } = useReactFlow<AppNode, AppEdge>();

  const simulationsToRun = useSimulationStore.use.simulationsToRun();

  useEffect(() => {
    const will_be_unlisten = listen<CanvasDataRequest>(
      "canvas_data_request",
      (event) => {
        const nodes = getNodes();
        const edges = getEdges();

        const connectionNodes = nodes.filter(
          ({ type }) => type === NodeType.ConnectionNode
        );

        // Map of connection node id to name, we'll use name to accept tags
        const connectionNodesMap = new Map<string, string>(
          connectionNodes.map(({ id, data }) => [id, data.name])
        );

        invoke<SaveFile>("save_graphic_spice_from_domain", {
          nodes: ContractNode.toContract(nodes),
          edges: ContractEdge.toContract(edges, connectionNodesMap),
          config: simulationsToRun,
          filePath: event.payload.filePath
        });
      }
    );

    return () => {
      will_be_unlisten.then((unlisten) => unlisten());
    };
  }, [getEdges, getNodes, simulationsToRun]);
};

export default useSaveFile;
