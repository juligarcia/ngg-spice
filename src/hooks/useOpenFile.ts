import { useSimulationStore } from "@/store/simulation";
import {
  ContractEdge,
  ContractNode,
  ContractSimulationsToRun
} from "@/utils/contract";
import { listen } from "@tauri-apps/api/event";
import { useReactFlow } from "@xyflow/react";
import { useEffect } from "react";
import { match } from "ts-pattern";

type OpenFile = {
  nodes: ContractNode[];
  edges: ContractEdge[];
  config: ContractSimulationsToRun;
  platform: "ltSpice" | "graphicSpice";
};

const useOpenFile = () => {
  const { setNodes, setEdges, fitView } = useReactFlow();

  const setSimulationsToRun = useSimulationStore.use.setSimulationsToRun();
  const clearStoredData = useSimulationStore.use.clearStoredData();

  useEffect(() => {
    const willBeUnlisten = listen<OpenFile>("open_file", (event) => {
      const nodes = ContractNode.toDomain(
        event.payload.nodes,
        // Spacing factor for the nodes
        match(event.payload.platform)
          .with("ltSpice", () => 2)
          .with("graphicSpice", () => 1)
          .otherwise(() => 1)
      );

      setNodes(nodes);
      setEdges(ContractEdge.toDomain(event.payload.edges));
      clearStoredData();
      setSimulationsToRun(event.payload.config);

      // Trigger re-center after updating nodes
      setTimeout(() => fitView({ nodes, duration: 300 }), 10);
    });

    return () => {
      willBeUnlisten.then((unlisten) => unlisten());
    };
  }, [setNodes, setEdges, setSimulationsToRun]);

  useEffect(() => {
    const willBeUnlisten = listen("clear_for_new_file", () => {
      setNodes([]);
      setEdges([]);
      clearStoredData();
    });

    return () => {
      willBeUnlisten.then((unlisten) => unlisten());
    };
  }, [setNodes, setEdges, setSimulationsToRun]);
};

export default useOpenFile;
